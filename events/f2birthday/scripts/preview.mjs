import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const eventRoot = fileURLToPath(new URL('../', import.meta.url));
const siteRoot = path.resolve(eventRoot, '../..');
const strip = text => text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon' };
async function render() {
  const source = await readFile(path.join(eventRoot, 'index.html'), 'utf8');
  const heading = source.match(/^heading: (.*)$/m)[1];
  let tool = strip(await readFile(path.join(siteRoot, '_layouts/tool-content.html'), 'utf8')).replace('{{ page.heading }}', heading).replace('{{ content }}', strip(source));
  // Preview only: show content even if an optional CDN script is unavailable.
  tool = tool.replace('content d-none loaded-b', 'content loaded-b');
  let html = (await readFile(path.join(siteRoot, '_layouts/default.html'), 'utf8')).replace('{{ content }}', tool).replace('{{ page.title }}', "F2's Birthday - Platopedia").replace('{{ page.description }}', "F2's October 18 birthday adventure");
  for (const include of ['head-brand-default.html', 'head-menu.html', 'head-theme.html']) html = html.replace(`{% include ${include} %}`, await readFile(path.join(siteRoot, '_includes', include), 'utf8'));
  // The preview does not need the site's external analytics/counter.
  return html.replace('{% include foot-counter.html %}', '');
}
export const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (['/', '/events/f2birthday', '/events/f2birthday/'].includes(pathname)) { response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }); response.end(await render()); return; }
    let target;
    if (/^\/events\/f2birthday\/assets\/[a-z0-9.-]+$/i.test(pathname)) target = path.join(eventRoot, pathname.replace('/events/f2birthday/', ''));
    else if (/^\/docs\/assets\/(?:css|js|images)\/[a-z0-9_./-]+$/i.test(pathname) && !pathname.includes('..')) target = path.join(siteRoot, pathname.slice(1));
    else { response.writeHead(404); response.end('Not found'); return; }
    if (!types[path.extname(target)]) { response.writeHead(404); response.end('Not found'); return; }
    response.writeHead(200, { 'Content-Type': types[path.extname(target)], 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); response.end(await readFile(target));
  } catch { response.writeHead(404); response.end('Not found'); }
});
if (process.argv.includes('--file')) {
  const html = (await render()).replaceAll('/events/f2birthday/assets/', 'assets/').replaceAll('/docs/assets/', '../../docs/assets/');
  await writeFile(path.join(eventRoot, 'preview.html'), html);
  console.log('Wrote preview.html using the actual Platopedia layouts and CSS.');
} else server.listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173/events/f2birthday/'));
