@echo off
chcp 65001 >nul
echo 正在启动五运六气健康管理工具...
echo 请稍候，浏览器将自动打开...
cd /d "%~dp0"
start http://localhost:8080
node -e "const http=require('http'),fs=require('fs'),path=require('path');const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript'};const s=http.createServer((q,r)=>{let f=path.join(__dirname,q.url==='/'?'/index.html':q.url);if(!fs.existsSync(f)||fs.statSync(f).isDirectory())f=path.join(__dirname,'index.html');const e=path.extname(f);r.writeHead(200,{'Content-Type':mime[e]||'application/octet-stream'});r.end(fs.readFileSync(f));});s.listen(8080,()=>console.log('服务器已启动: http://localhost:8080'))"
