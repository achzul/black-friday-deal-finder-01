// FridayFinds local preview server (Node 22, standard library only).
//
// Serves the app/ folder on http://localhost:8080 so the deal finder can be opened in a desktop
// browser or at a phone size while building it. Usage: `node serve.ts` or `node serve.ts --port 9000`.
// It only reads files inside app/, sends the right MIME type for each, and never writes anything —
// a development convenience, not a production server.

import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = resolve(fileURLToPath(new URL('./app', import.meta.url)));

function pickPort() {
  const i = process.argv.indexOf('--port');
  const n = i === -1 ? NaN : Number(process.argv[i + 1]);
  return Number.isInteger(n) && n > 0 && n < 65536 ? n : 8080;
}

const TYPES = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon'],
  ['.woff2', 'font/woff2'],
]);

const server = createServer((req, res) => {
  let path = '/';
  try {
    path = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('bad request');
    return;
  }
  if (path.endsWith('/')) path += 'index.html';
  const file = resolve(join(appRoot, normalize(path)));
  if (file !== appRoot && !file.startsWith(appRoot + sep)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  let bytes;
  try {
    const st = statSync(file);
    if (!st.isFile()) throw new Error('not a file');
    bytes = st.size;
  } catch {
    res.writeHead(404).end('not found');
    return;
  }
  res.writeHead(200, {
    'content-type': TYPES.get(extname(file).toLowerCase()) ?? 'application/octet-stream',
    'content-length': bytes,
    'cache-control': 'no-store',
  });
  createReadStream(file).pipe(res);
});

const port = pickPort();
server.listen(port, '127.0.0.1', () => console.log(`FridayFinds preview: http://localhost:${port}`));
