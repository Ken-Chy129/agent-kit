/** Brutalist - Newsprint, high-contrast B&W, bold typography */
export default (html) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Anybody:wght@700;900&family=Literata:ital,wght@0,400;0,500;0,700;1,400&family=Noto+Sans+SC:wght@400;700;900&family=Courier+Prime:wght@400;700&display=swap');
* { margin:0; padding:0; box-sizing:border-box; }
body { width:980px; background:linear-gradient(145deg,#d4c8a8 0%,#c4b898 50%,#b8a880 100%); padding:56px; font-family:'Literata','Noto Sans SC',Georgia,serif; }
.window { border-radius:12px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.35),0 0 0 1px rgba(26,26,24,0.1); }
.titlebar { height:40px; background:#1a1a18; display:flex; align-items:center; padding:0 16px; }
.traffic-lights { display:flex; gap:8px; }
.dot { width:12px; height:12px; border-radius:50%; }
.dot-red { background:#ff5f57; border:0.5px solid #e0443e; }
.dot-yellow { background:#febc2e; border:0.5px solid #dea123; }
.dot-green { background:#28c840; border:0.5px solid #14ae46; }
.content { overflow-wrap:break-word; word-wrap:break-word; background:#f2ead8; font-size:15px; line-height:1.75; color:#1a1a18; padding:48px 56px 52px; position:relative; }
.content::after { content:''; position:absolute; top:0; left:0; right:0; bottom:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"); pointer-events:none; }
.content > * { position:relative; z-index:1; }
.header-rule { border:none; border-top:6px solid #1a1a18; margin:0 0 4px 0; position:relative; z-index:1; }
.header-rule-thin { border:none; border-top:2px solid #1a1a18; margin:0 0 20px 0; position:relative; z-index:1; }
h1 { font-family:'Anybody','Noto Sans SC',Impact,sans-serif; font-size:42px; font-weight:900; color:#0a0a08; margin:4px 0 20px; letter-spacing:-1.5px; line-height:1.05; text-transform:uppercase; border-bottom:4px solid #0a0a08; padding-bottom:14px; }
h2 { font-family:'Anybody','Noto Sans SC',sans-serif; font-size:20px; font-weight:700; color:#0a0a08; margin:32px 0 10px; padding:6px 0; letter-spacing:0.5px; text-transform:uppercase; border-top:2px solid #1a1a18; border-bottom:1px solid #1a1a18; }
h3 { font-family:'Literata',serif; font-size:17px; font-weight:700; font-style:italic; color:#2a2a28; margin:22px 0 8px; }
p { margin:8px 0; color:#2a2a28; }
strong { color:#0a0a08; font-weight:700; }
a { color:#0a0a08; text-decoration:underline; text-decoration-thickness:2px; text-underline-offset:2px; }
ul,ol { padding-left:24px; margin:8px 0; color:#2a2a28; }
li { margin:4px 0; }
li::marker { color:#0a0a08; font-weight:700; }
blockquote { margin:20px 0; padding:18px 24px; background:transparent; border-left:6px solid #0a0a08; border-right:6px solid #0a0a08; color:#1a1a18; font-style:italic; font-size:16px; line-height:1.6; text-align:center; }
code { font-family:'Courier Prime',monospace; font-size:13.5px; background:rgba(26,26,24,0.08); color:#0a0a08; padding:1px 5px; border:1px solid rgba(26,26,24,0.2); }
pre { white-space:pre-wrap; word-wrap:break-word; margin:20px 0; padding:22px 26px; background:#1a1a18; overflow-x:auto; }
pre code { background:none; padding:0; border:none; color:#f2ead8; font-size:13px; line-height:1.65; }
table { width:100%; border-collapse:collapse; margin:18px 0; border:2px solid #1a1a18; }
th { background:#1a1a18; color:#f2ead8; font-family:'Anybody',sans-serif; font-weight:700; padding:10px 16px; text-align:left; font-size:12px; text-transform:uppercase; letter-spacing:1.5px; }
td { padding:10px 16px; border-bottom:1px solid rgba(26,26,24,0.2); font-size:14px; color:#2a2a28; }
tr:hover td { background:rgba(26,26,24,0.04); }
</style></head><body>
<div class="window"><div class="titlebar"><div class="traffic-lights"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div></div></div>
<div class="content"><hr class="header-rule"><hr class="header-rule-thin">${html}</div></div>
</body></html>`;
