#!/usr/bin/env node
/**
 * copy-as-image: Markdown -> beautiful PNG screenshot -> clipboard
 *
 * Usage:
 *   node copy-as-image.mjs <file> [--theme <name>]
 *   echo "# Hello" | node copy-as-image.mjs [--theme <name>]
 *   node copy-as-image.mjs --list-themes
 *
 * Themes:
 *   one-dark-carbon  Classic Carbon/Ray.so style, dark purple gradient, monospace
 *   warm-paper       Warm white paper, serif headings, printed-page feel
 *   glassmorphism    Frosted glass, colorful blurs, modern UI (default)
 *   notion           Notion-style clean white, minimal
 *   brutalist        Brutalist newsprint, high-contrast B&W
 *   neon-terminal    CRT terminal, phosphor green + magenta, scan lines
 */

import { chromium } from "playwright";
import { marked } from "marked";
import { readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join, dirname } from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ═══════════════════════════════════════════════════════════════════════
// Theme Registry
// ═══════════════════════════════════════════════════════════════════════

const THEME_META = {
  "one-dark-carbon": { desc: "Classic Carbon style, dark purple gradient, monospace", file: "one-dark-carbon.mjs" },
  "warm-paper":      { desc: "Warm white paper, serif headings, printed-page feel",   file: "warm-paper.mjs" },
  "glassmorphism":   { desc: "Frosted glass, colorful blurs, modern UI",              file: "glassmorphism.mjs" },
  "notion":          { desc: "Notion-style clean white, minimal",                     file: "notion.mjs" },
  "brutalist":       { desc: "Brutalist newsprint, high-contrast B&W",                file: "brutalist.mjs" },
  "neon-terminal":   { desc: "CRT terminal, phosphor green + magenta, scan lines",    file: "neon-terminal.mjs" },
};

const DEFAULT_THEME = "glassmorphism";

async function loadTheme(name) {
  const meta = THEME_META[name];
  if (!meta) {
    console.error(`Error: Unknown theme "${name}". Use --list-themes to see available themes.`);
    process.exit(1);
  }
  const mod = await import(join(__dirname, "themes", meta.file));
  return mod.default;
}

// ═══════════════════════════════════════════════════════════════════════
// Render Pipeline
// ═══════════════════════════════════════════════════════════════════════

/**
 * Detect if text looks like plain preformatted output (CLI help, logs, etc.)
 * rather than markdown. If it has alignment spaces or lacks markdown markers,
 * wrap it in a <pre> block to preserve whitespace formatting.
 */
function textToHtml(text) {
  const lines = text.split("\n");
  const hasMdMarkers = lines.some(l =>
    /^#{1,6}\s/.test(l) || /^\*\*/.test(l.trim()) || /^[-*]\s/.test(l.trim()) || /^\d+\.\s/.test(l.trim()) || /^>\s/.test(l.trim()) || /^```/.test(l.trim()) || /\[.*\]\(.*\)/.test(l)
  );
  const hasAlignmentSpaces = lines.filter(l => l.trim()).some(l => /\S {2,}\S/.test(l));

  if (!hasMdMarkers && hasAlignmentSpaces) {
    // Plain preformatted text - wrap in <pre> to preserve spaces
    const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<pre><code>${escaped}</code></pre>`;
  }
  return marked.parse(text);
}

async function render(mdText, themeName) {
  const htmlContent = textToHtml(mdText);
  const themeFn = await loadTheme(themeName);
  const fullHtml = themeFn(htmlContent);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 980, height: 600 }, deviceScaleFactor: 2 });
  await page.setContent(fullHtml, { waitUntil: "networkidle" });
  const bodyH = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewportSize({ width: 980, height: bodyH });

  const pngBuffer = await page.screenshot({ fullPage: true });
  await browser.close();

  return Buffer.from(pngBuffer);
}

// ═══════════════════════════════════════════════════════════════════════
// Clipboard
// ═══════════════════════════════════════════════════════════════════════

function copyToClipboard(pngFilePath) {
  if (process.platform === "darwin") {
    const script = `set the clipboard to (read (POSIX file "${pngFilePath}") as \u00ABclass PNGf\u00BB)`;
    execSync(`osascript -e '${script}'`, { timeout: 10000 });
  } else if (process.platform === "linux") {
    try {
      execSync(`xclip -selection clipboard -t image/png -i "${pngFilePath}"`, { timeout: 10000 });
    } catch {
      try {
        execSync(`xsel --clipboard --input < "${pngFilePath}"`, { timeout: 10000 });
      } catch {
        throw new Error("No clipboard tool found. Install xclip or xsel:\n  sudo apt install xclip");
      }
    }
  } else {
    throw new Error(`Unsupported platform: ${process.platform}. Only macOS and Linux are supported.`);
  }
}

// ═══════════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════════

function parseArgs(argv) {
  const args = argv.slice(2);
  let file = null;
  let theme = DEFAULT_THEME;
  let listThemes = false;
  let showHelp = false;
  let outFile = null; // --out or --out <path>

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--list-themes") {
      listThemes = true;
    } else if (args[i] === "--help" || args[i] === "-h") {
      showHelp = true;
    } else if (args[i] === "--out") {
      // --out <path> or just --out (auto temp path)
      if (i + 1 < args.length && !args[i + 1].startsWith("--")) {
        outFile = args[++i];
      } else {
        outFile = "auto";
      }
    } else if (args[i] === "--theme" && i + 1 < args.length) {
      theme = args[++i];
    } else if (!args[i].startsWith("--")) {
      file = args[i];
    }
  }

  return { file, theme, listThemes, showHelp, outFile };
}

async function main() {
  const { file, theme, listThemes, showHelp, outFile } = parseArgs(process.argv);

  if (showHelp) {
    console.log(`copy-as-image: Markdown -> beautiful PNG screenshot -> clipboard

Usage:
  node copy-as-image.mjs <file> [--theme <name>]
  echo "text" | node copy-as-image.mjs [--theme <name>]
  node copy-as-image.mjs <file> --out [path]                Save to file only, skip clipboard
  open "$(node copy-as-image.mjs <file> --out)"              Generate and open directly
  node copy-as-image.mjs <file> --out | xargs open           Same, xargs style

Options:
  --theme <name>    Choose theme (default: glassmorphism)
  --out [path]      Save PNG to file only, skip clipboard. Prints path to stdout.
                    Omit path for auto temp file; provide path to write there.
  --list-themes     List all available themes
  --help, -h        Show this help message

Themes:
  one-dark-carbon   Classic Carbon style, dark purple gradient, monospace
  warm-paper        Warm white paper, serif headings, printed-page feel
  glassmorphism     Frosted glass, colorful blurs, modern UI (default)
  notion            Notion-style clean white, minimal
  brutalist         Brutalist newsprint, high-contrast B&W
  neon-terminal     CRT terminal, phosphor green + magenta, scan lines`);
    process.exit(0);
  }

  if (listThemes) {
    console.log("Available themes:\n");
    for (const [name, meta] of Object.entries(THEME_META)) {
      const marker = name === DEFAULT_THEME ? " (default)" : "";
      console.log(`  ${name.padEnd(18)} ${meta.desc}${marker}`);
    }
    process.exit(0);
  }

  // Read input
  let text;
  if (file) {
    text = readFileSync(file, "utf-8");
  } else {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    text = Buffer.concat(chunks).toString("utf-8");
  }

  if (!text.trim()) {
    console.error("Error: No input.\nUsage: node copy-as-image.mjs <file> [--theme <name>]");
    process.exit(1);
  }

  // Render
  const pngBuffer = await render(text, theme);

  // Determine output path
  let pngFile;
  if (outFile && outFile !== "auto") {
    pngFile = outFile;
  } else {
    const rand = Math.random().toString(36).slice(2, 10);
    pngFile = join(tmpdir(), `claude-screenshot-${rand}.png`);
  }
  writeFileSync(pngFile, pngBuffer);

  if (outFile) {
    // --out mode: print path to stdout only (pipeable)
    console.log(pngFile);
  } else {
    // Default: copy to clipboard
    try {
      copyToClipboard(pngFile);
      console.log(`Image copied to clipboard! (${pngBuffer.length} bytes, theme: ${theme})`);
      console.log(`PNG saved to: ${pngFile}`);
    } catch (err) {
      console.error(`Failed to copy to clipboard: ${err}`);
      console.log(`PNG saved to: ${pngFile}`);
      process.exit(1);
    }
  }
}

main().catch((err) => { console.error(`Fatal error: ${err}`); process.exit(1); });
