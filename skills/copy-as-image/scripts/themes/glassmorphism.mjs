/** Glassmorphism - Frosted glass, colorful blurs, modern UI */
export default (html) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap');
* { margin:0; padding:0; box-sizing:border-box; }
body { width:980px; font-family:'Inter','Noto Sans SC',sans-serif; font-size:15px; line-height:1.8; color:#e2e8f0; background:#0f172a; padding:56px; position:relative; overflow:hidden; }
body::before { content:''; position:absolute; top:-100px; right:-60px; width:400px; height:400px; background:radial-gradient(circle,rgba(99,102,241,0.35) 0%,transparent 70%); filter:blur(60px); }
body::after { content:''; position:absolute; bottom:-80px; left:-40px; width:350px; height:350px; background:radial-gradient(circle,rgba(244,114,182,0.3) 0%,transparent 70%); filter:blur(60px); }
.window { position:relative; z-index:1; border-radius:24px; overflow:hidden; background:rgba(255,255,255,0.05); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.1); box-shadow:0 8px 32px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.08); }
.titlebar { height:44px; background:rgba(255,255,255,0.03); display:flex; align-items:center; padding:0 20px; border-bottom:1px solid rgba(255,255,255,0.06); }
.traffic-lights { display:flex; gap:8px; }
.dot { width:12px; height:12px; border-radius:50%; }
.dot-red { background:#ff5f57; border:0.5px solid #e0443e; }
.dot-yellow { background:#febc2e; border:0.5px solid #dea123; }
.dot-green { background:#28c840; border:0.5px solid #14ae46; }
.extra-glow { position:absolute; top:40%; left:50%; width:200px; height:200px; background:radial-gradient(circle,rgba(56,189,248,0.2) 0%,transparent 70%); filter:blur(50px); transform:translate(-50%,-50%); z-index:0; }
.content { overflow-wrap:break-word; word-wrap:break-word; padding:44px 52px 48px; position:relative; }
h1 { font-size:30px; font-weight:700; margin-bottom:28px; background:linear-gradient(135deg,#818cf8,#c084fc,#f472b6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
h2 { font-size:19px; font-weight:600; color:#a5b4fc; margin:32px 0 14px; display:flex; align-items:center; gap:10px; }
h2::before { content:''; display:inline-block; width:4px; height:20px; background:linear-gradient(180deg,#818cf8,#c084fc); border-radius:2px; }
h3 { font-size:16px; font-weight:600; color:#c084fc; margin:20px 0 10px; }
p { margin:10px 0; color:#b8c5d6; }
strong { color:#f1f5f9; font-weight:600; }
ul,ol { padding-left:24px; margin:10px 0; color:#b8c5d6; }
li { margin:4px 0; }
li::marker { color:#818cf8; }
blockquote { margin:16px 0; padding:14px 20px; background:rgba(129,140,248,0.08); border-left:3px solid #818cf8; border-radius:0 12px 12px 0; color:#a5b4fc; font-style:italic; }
code { font-family:'Fira Code',monospace; font-size:13px; background:rgba(129,140,248,0.1); color:#67e8f9; padding:2px 7px; border-radius:6px; }
pre { white-space:pre-wrap; word-wrap:break-word; margin:16px 0; padding:20px 24px; background:rgba(0,0,0,0.4); border-radius:14px; border:1px solid rgba(255,255,255,0.06); backdrop-filter:blur(10px); box-shadow:0 4px 20px rgba(0,0,0,0.2); }
pre code { background:none; padding:0; color:#e2e8f0; font-size:13px; line-height:1.6; }
table { width:100%; border-collapse:separate; border-spacing:0; margin:16px 0; border-radius:12px; overflow:hidden; border:1px solid rgba(255,255,255,0.06); }
th { background:rgba(129,140,248,0.12); color:#a5b4fc; font-weight:600; padding:12px 16px; text-align:left; font-size:12px; text-transform:uppercase; letter-spacing:1px; }
td { padding:10px 16px; border-bottom:1px solid rgba(255,255,255,0.04); font-size:14px; color:#b8c5d6; }
tr:last-child td { border-bottom:none; }
</style></head><body>
<div class="extra-glow"></div>
<div class="window"><div class="titlebar"><div class="traffic-lights"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div></div></div>
<div class="content">${html}</div></div>
</body></html>`;
