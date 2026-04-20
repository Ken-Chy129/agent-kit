---
name: copy-as-image
version: 2.0.0
description: Copy Claude's last response as a beautiful terminal-style image to your clipboard. Use when you want to share Claude's output in Slack, docs, or presentations.
metadata:
  requires:
    bins: ["node"]
---

# Copy as Image

Capture the last meaningful Claude response as a styled screenshot image and copy it to the clipboard.

## Selecting the right response

Look back through the conversation and find your **last substantial assistant response**. Skip over any of the following:

- One-line or very short replies (e.g. "Done.", "OK", "Sure")
- Slash command outputs (messages that start with `/`)
- Tool invocation confirmations
- This current skill invocation itself

Pick the most recent assistant message that has **meaningful multi-line content** (explanations, code, analysis, etc.).

## Choosing a theme

There are 6 themes available. Choose the best match based on the content and user preference:

| Theme | Best for | Style |
|-------|----------|-------|
| `glassmorphism` | General use, design discussions, creative content | Dark with colorful frosted glass blur effects **(default)** |
| `one-dark-carbon` | Code, technical output, terminal logs | Dark, monospace, Carbon/Ray.so aesthetic |
| `warm-paper` | Long-form writing, reports, documentation | Light warm, serif headings, printed-page feel |
| `notion` | Clean documentation, meeting notes, checklists | Light white, minimal, Notion-style |
| `brutalist` | Bold statements, manifestos, high-impact content | Newspaper/brutalist, high contrast B&W |
| `neon-terminal` | Hacker-style, system output, cyberpunk vibes | CRT green-on-black with scan lines |

**Theme selection rules:**
1. If the user explicitly requests a style (e.g. "make it look like a newspaper", "dark theme", "clean white"), pick the matching theme.
2. If no preference is stated, choose based on content type using the table above.
3. When in doubt, use `glassmorphism` (the default).

To see all themes: `node copy-as-image.mjs --list-themes`

## Steps

Do everything in a **single** Bash call. Use a timestamp-based temp file name (do NOT use mktemp with XXXXXX templates). Write the response, run the script, and clean up:

```bash
TMPFILE="/tmp/claude-response-$(date +%s%N).md"
SKILL_DIR="${CLAUDE_SKILL_DIR}"

cat > "$TMPFILE" << 'CLAUDE_EOF'
<paste the full text of the chosen response here>
CLAUDE_EOF

cd "$SKILL_DIR/scripts" && \
  (test -d ../node_modules || npm install --prefix .. --omit=dev 2>/dev/null) && \
  node copy-as-image.mjs "$TMPFILE" --theme <chosen-theme>

rm -f "$TMPFILE"
```

Replace `<chosen-theme>` with one of: `glassmorphism`, `one-dark-carbon`, `warm-paper`, `notion`, `brutalist`, `neon-terminal`.

After the command finishes, tell the user:
- "Image copied to clipboard! Paste anywhere with Cmd+V (macOS) or Ctrl+V (Linux)."
- Show the saved PNG file path from the script output.
- Mention which theme was used.

## Important Notes

- Only requires **Node.js** (no bun/deno needed)
- Uses **Playwright** (Chromium) for pixel-perfect 2x Retina rendering
- Works on **macOS** (uses `osascript`) and **Linux** (requires `xclip` or `xsel`)
- All themes include a macOS-style window with traffic light buttons
- Google Fonts are loaded for each theme (requires internet)
