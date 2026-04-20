/** Warm Paper - Warm white, serif headings, printed-page feel */
export default (html) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@400;500;700&family=Source+Code+Pro:wght@400;500&family=Playfair+Display:wght@700&display=swap');
* { margin:0; padding:0; box-sizing:border-box; }
body { width:980px; background:linear-gradient(145deg,#d8cbb8 0%,#c4b8a0 50%,#b8a890 100%); padding:56px; font-family:'Noto Sans SC',-apple-system,sans-serif; }
.window { border-radius:12px; overflow:hidden; box-shadow:0 20px 60px rgba(60,40,20,0.35),0 0 0 1px rgba(196,169,125,0.2); }
.titlebar { height:40px; background:#3a3020; display:flex; align-items:center; padding:0 16px; border-bottom:1px solid rgba(196,169,125,0.15); }
.traffic-lights { display:flex; gap:8px; }
.dot { width:12px; height:12px; border-radius:50%; }
.dot-red { background:#ff5f57; border:0.5px solid #e0443e; }
.dot-yellow { background:#febc2e; border:0.5px solid #dea123; }
.dot-green { background:#28c840; border:0.5px solid #14ae46; }
.content { overflow-wrap:break-word; word-wrap:break-word; background:#faf6ef; font-size:15px; line-height:1.85; color:#3d3929; padding:48px 56px 52px; position:relative; }
.content::before { content:''; position:absolute; top:0; left:0; right:0; bottom:0; background:repeating-linear-gradient(0deg,transparent,transparent 31px,rgba(190,170,140,0.06) 31px,rgba(190,170,140,0.06) 32px); pointer-events:none; }
.content > * { position:relative; z-index:1; }
h1 { font-family:'Playfair Display','Noto Serif SC',serif; font-size:32px; font-weight:700; color:#1a1510; margin-bottom:32px; padding-bottom:16px; border-bottom:3px double #c4a97d; letter-spacing:0.5px; }
h2 { font-family:'Noto Serif SC',serif; font-size:20px; font-weight:600; color:#6b4f2e; margin:36px 0 16px; padding-left:16px; border-left:4px solid #c4a97d; }
h3 { font-size:17px; font-weight:600; color:#8b6e47; margin:24px 0 12px; }
p { margin:10px 0; }
strong { color:#1a1510; font-weight:700; }
ul,ol { padding-left:28px; margin:10px 0; }
li { margin:5px 0; }
li::marker { color:#c4a97d; }
blockquote { margin:20px 0; padding:16px 24px; background:linear-gradient(135deg,#f5efe6,#efe8dc); border-left:4px solid #c4a97d; border-radius:0 8px 8px 0; color:#5a4a33; font-style:italic; box-shadow:inset 0 1px 3px rgba(0,0,0,0.04); }
code { font-family:'Source Code Pro',monospace; font-size:13px; background:rgba(196,169,125,0.12); color:#8b4513; padding:2px 7px; border-radius:4px; }
pre { white-space:pre-wrap; word-wrap:break-word; margin:20px 0; padding:22px 26px; background:#2b2520; border-radius:10px; overflow-x:auto; box-shadow:0 2px 16px rgba(43,37,32,0.15); }
pre code { background:none; padding:0; color:#e8dcc8; font-size:13px; line-height:1.65; }
table { width:100%; border-collapse:collapse; margin:20px 0; }
th { background:#6b4f2e; color:#faf6ef; font-weight:600; padding:12px 16px; text-align:left; font-size:13px; letter-spacing:0.5px; }
td { padding:11px 16px; border-bottom:1px solid rgba(196,169,125,0.25); font-size:14px; }
tr:hover td { background:rgba(196,169,125,0.06); }
</style></head><body>
<div class="window"><div class="titlebar"><div class="traffic-lights"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div></div></div>
<div class="content">${html}</div></div>
</body></html>`;
