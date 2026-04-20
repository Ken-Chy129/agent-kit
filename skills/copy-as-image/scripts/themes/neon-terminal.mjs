/** Neon Terminal - CRT phosphor green + magenta, scan lines */
export default (html) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Chakra+Petch:wght@500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap');
* { margin:0; padding:0; box-sizing:border-box; }
body { width:980px; background:linear-gradient(135deg,#050505 0%,#0a1208 50%,#050505 100%); padding:56px; font-family:'Share Tech Mono','Noto Sans SC',monospace; }
.window { border-radius:12px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 40px rgba(51,255,136,0.05),0 0 0 1px rgba(51,255,136,0.1); }
.titlebar { height:40px; background:#0a0a0a; display:flex; align-items:center; padding:0 16px; border-bottom:1px solid rgba(51,255,136,0.08); }
.traffic-lights { display:flex; gap:8px; }
.dot { width:12px; height:12px; border-radius:50%; }
.dot-red { background:#ff5f57; border:0.5px solid #e0443e; }
.dot-yellow { background:#febc2e; border:0.5px solid #dea123; }
.dot-green { background:#28c840; border:0.5px solid #14ae46; }
.content { overflow-wrap:break-word; word-wrap:break-word; background:#050505; font-size:14px; line-height:1.8; color:#33ff88; padding:44px 52px 48px; position:relative; overflow:hidden; }
.content::before { content:''; position:absolute; top:0; left:0; right:0; bottom:0; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.15) 2px,rgba(0,0,0,0.15) 4px); pointer-events:none; z-index:10; }
.content::after { content:''; position:absolute; top:0; left:0; right:0; bottom:0; background:radial-gradient(ellipse at center,transparent 60%,rgba(0,0,0,0.4) 100%); pointer-events:none; z-index:11; }
.content > * { position:relative; z-index:1; }
.status-bar { font-size:11px; color:#1a8844; margin-bottom:20px; padding-bottom:12px; border-bottom:1px solid #1a3322; letter-spacing:1px; }
h1 { font-family:'Chakra Petch','Noto Sans SC',sans-serif; font-size:28px; font-weight:700; color:#33ff88; margin-bottom:24px; letter-spacing:2px; text-transform:uppercase; text-shadow:0 0 10px rgba(51,255,136,0.4),0 0 30px rgba(51,255,136,0.15); padding-left:20px; position:relative; }
h1::before { content:'>'; position:absolute; left:0; color:#33ff88; }
h2 { font-family:'Chakra Petch','Noto Sans SC',sans-serif; font-size:17px; font-weight:600; color:#ff33aa; margin:32px 0 12px; letter-spacing:1.5px; text-transform:uppercase; text-shadow:0 0 8px rgba(255,51,170,0.3); padding-left:16px; position:relative; }
h2::before { content:'//'; position:absolute; left:0; color:#662244; }
h3 { font-size:15px; font-weight:500; color:#33ccff; margin:22px 0 8px; text-shadow:0 0 6px rgba(51,204,255,0.25); }
h3::before { content:'# '; color:#1a6680; }
p { margin:8px 0; color:#22aa66; }
strong { color:#44ffaa; text-shadow:0 0 4px rgba(68,255,170,0.2); }
a { color:#33ccff; text-decoration:none; border-bottom:1px dashed #1a6680; }
ul,ol { padding-left:24px; margin:8px 0; color:#22aa66; }
li { margin:4px 0; }
li::marker { color:#33ff88; }
blockquote { margin:16px 0; padding:14px 20px; background:rgba(255,51,170,0.04); border-left:3px solid #ff33aa; color:#cc6699; position:relative; }
blockquote::before { content:'! WARNING'; display:block; font-family:'Chakra Petch',sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; color:#ff33aa; margin-bottom:6px; text-shadow:0 0 6px rgba(255,51,170,0.3); }
code { font-family:'Share Tech Mono',monospace; font-size:13px; background:rgba(51,255,136,0.08); color:#66ffbb; padding:1px 6px; border:1px solid rgba(51,255,136,0.15); }
pre { white-space:pre-wrap; word-wrap:break-word; margin:18px 0; padding:20px 24px; background:#0a0a0a; border:1px solid #1a3322; overflow-x:auto; position:relative; }
pre::before { content:'--- OUTPUT ---'; display:block; font-size:10px; letter-spacing:2px; color:#1a5533; margin-bottom:10px; padding-bottom:8px; border-bottom:1px dashed #1a3322; }
pre code { background:none; padding:0; border:none; color:#33ff88; font-size:13px; line-height:1.7; text-shadow:0 0 3px rgba(51,255,136,0.2); }
table { width:100%; border-collapse:collapse; margin:16px 0; border:1px solid #1a3322; }
th { background:rgba(51,255,136,0.06); color:#33ff88; font-weight:600; padding:10px 16px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:2px; border-bottom:1px solid #1a5533; }
td { padding:9px 16px; border-bottom:1px solid #0d1a12; font-size:13px; color:#22aa66; }
tr:hover td { background:rgba(51,255,136,0.03); }
</style></head><body>
<div class="window"><div class="titlebar"><div class="traffic-lights"><div class="dot dot-red"></div><div class="dot dot-yellow"></div><div class="dot dot-green"></div></div></div>
<div class="content"><div class="status-bar">SYS.RENDER // PID 4088 // MEM 64K // STATUS: NOMINAL</div>${html}</div></div>
</body></html>`;
