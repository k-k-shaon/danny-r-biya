const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(__dirname, reqPath);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(0, '127.0.0.1', () => {
  const port = server.address().port;
  console.log(`Local HTTP server running at http://127.0.0.1:${port}`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'D:\\New folder\\Projects\\danny\\tmp_chrome';

  const args = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`,
    '--dump-dom',
    `http://127.0.0.1:${port}/index.html`
  ];

  const child = spawn(chromePath, args);
  let output = '';

  child.stdout.on('data', d => { output += d.toString(); });
  child.stderr.on('data', d => { output += d.toString(); });

  setTimeout(() => {
    if (child && !child.killed) child.kill();
    server.close(() => {
      console.log('HTTP Test Finished. Output length received:', output.length);
      const ok = output.includes('Taif &amp; Sabrina') || output.includes('Wedding Reception');
      console.log('Content Verified over HTTP:', ok ? 'PASS' : 'FAIL');
      process.exit(0);
    });
  }, 2500);
});
