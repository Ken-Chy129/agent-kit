/** One Dark Carbon - Classic Carbon/Ray.so style, dark purple gradient, monospace */
export default (html) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
* { margin:0; padding:0; box-sizing:border-box; }
body { width:980px; background:linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%); padding:56px; font-family:'JetBrains Mono',Menlo,Monaco,'Courier New',monospace; }
.window { border-radius:12px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.05); }
.titlebar { height:40px; background:#21252b; display:flex; align-items:center; padding:0 16px; }
.traffic-lights { display:flex; gap:8px; }
.dot { width:12px; height:12px; border-radius:50%; }
.dot-red { background:#ff5f57; border:0.5px solid #e0443e; }
.dot-yellow { background:#febc2e; border:0.5px solid #dea123; }
.dot-green { background:#28c840; border:0.5px solid #14ae46; }
.content { overflow-wrap:break-word; word-wrap:break-word; background:#282c34; font-size:14px; line-height:1.75; color:#abb2bf; padding:40px 48px 44px; }
h1 { font-size:22px; font-weight:700; color:#61afef; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid #3e4451; }
h2 { font-size:18px; font-weight:700; color:#61afef; margin:28px 0 10px; padding-bottom:8px; border-bottom:1px solid #3e4451; }
h3 { font-size:15px; font-weight:700; color:#61afef; margin:22px 0 8px; }
p { margin:8px 0; }
strong { color:#e5c07b; font-weight:700; }
em { color:#c678dd; font-style:italic; }
a { color:#56b6c2; text-decoration:none; }
ul,ol { padding-left:24px; margin:8px 0; }
li { margin:3px 0; }
li::marker { color:#c678dd; }
blockquote { margin:14px 0; padding:10px 20px; border-left:3px solid #c678dd; background:rgba(198,120,221,0.05); border-radius:0 6px 6px 0; color:#7f848e; }
code { font-family:'JetBrains Mono',Menlo,monospace; font-size:13px; background:#2c313a; color:#d19a66; padding:2px 6px; border-radius:4px; }
pre { white-space:pre-wrap; word-wrap:break-word; margin:14px 0; padding:18px 22px; background:#21252b; border-radius:8px; border:1px solid #3e4451; overflow-x:auto; }
pre code { background:none; padding:0; color:#abb2bf; font-size:13px; line-height:1.6; }
table { width:100%; border-collapse:collapse; margin:14px 0; }
th { background:#21252b; color:#61afef; font-weight:600; padding:10px 16px; text-align:left; font-size:12px; text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid #3e4451; }
td { padding:9px 16px; border-bottom:1px solid #2c313a; font-size:13px; color:#abb2bf; }
tr:hover td { background:rgba(97,175,239,0.03); }
</style></head><body>
<div class="window"><div class="titlebar"><div class="traffic-lights"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div></div></div>
<div class="content">${html}</div></div>
</body></html>`;
