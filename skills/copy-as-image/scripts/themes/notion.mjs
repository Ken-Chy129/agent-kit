/** Notion - Clean white, Notion-style layout, minimal */
export default (html) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap');
* { margin:0; padding:0; box-sizing:border-box; }
body { width:980px; background:#f0ede8; padding:56px; font-family:'Inter','Noto Sans SC',-apple-system,sans-serif; }
.window { border-radius:12px; overflow:hidden; box-shadow:0 0 0 1px rgba(0,0,0,0.03),0 2px 8px rgba(0,0,0,0.04),0 20px 60px rgba(0,0,0,0.1); }
.titlebar { height:40px; background:#ffffff; display:flex; align-items:center; padding:0 16px; border-bottom:1px solid #e8e5e0; }
.traffic-lights { display:flex; gap:8px; }
.dot { width:12px; height:12px; border-radius:50%; }
.dot-red { background:#ff5f57; border:0.5px solid #e0443e; }
.dot-yellow { background:#febc2e; border:0.5px solid #dea123; }
.dot-green { background:#28c840; border:0.5px solid #14ae46; }
.content { overflow-wrap:break-word; word-wrap:break-word; background:#ffffff; font-size:15px; line-height:1.8; color:#37352f; padding:48px 52px; }
h1 { font-size:30px; font-weight:700; color:#191919; margin-bottom:8px; letter-spacing:-0.03em; line-height:1.2; }
h2 { font-size:20px; font-weight:600; color:#191919; margin:32px 0 12px; padding-bottom:6px; border-bottom:1px solid #e8e5e0; }
h3 { font-size:16px; font-weight:600; color:#37352f; margin:24px 0 8px; }
p { margin:8px 0; }
strong { color:#191919; font-weight:600; }
a { color:#2f81f7; text-decoration:underline; text-underline-offset:2px; }
ul,ol { padding-left:24px; margin:8px 0; }
li { margin:4px 0; }
li::marker { color:#9b9a97; }
blockquote { margin:16px 0; padding:8px 20px; border-left:3px solid #e8e5e0; background:#fbfaf8; border-radius:0 6px 6px 0; color:#6b6b6b; }
code { font-family:'SFMono-Regular','Menlo',monospace; font-size:13px; background:#f1f0ed; color:#eb5757; padding:2px 6px; border-radius:4px; }
pre { white-space:pre-wrap; word-wrap:break-word; margin:16px 0; padding:20px; background:#f7f6f3; border-radius:8px; border:1px solid #e8e5e0; overflow-x:auto; }
pre code { background:none; color:#37352f; padding:0; font-size:13px; line-height:1.6; }
table { width:100%; border-collapse:collapse; margin:16px 0; font-size:14px; }
th { background:#f7f6f3; color:#6b6b6b; padding:10px 16px; text-align:left; font-weight:500; font-size:12px; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1px solid #e8e5e0; }
td { padding:10px 16px; border-bottom:1px solid #f0eeeb; }
tr:hover td { background:#fbfaf8; }
</style></head><body>
<div class="window"><div class="titlebar"><div class="traffic-lights"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div></div></div>
<div class="content">${html}</div></div>
</body></html>`;
