// Gera o sitemap.xml a partir dos ficheiros .html do projeto.
// Uso: node make-sitemap.mjs   (correr antes de cada commit que crie ou altere páginas)
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';

const BASE = 'https://posiciona.pt';
const SKIP = new Set(['404.html']);

const pages = [
  ...readdirSync('.').filter(f => f.endsWith('.html')),
  ...readdirSync('blog').filter(f => f.endsWith('.html')).map(f => `blog/${f}`),
].filter(f => !SKIP.has(f));

function lastmod(file) {
  try {
    const dirty = execSync(`git status --porcelain -- "${file}"`).toString().trim();
    if (!dirty) {
      const d = execSync(`git log -1 --format=%as -- "${file}"`).toString().trim();
      if (d) return d;
    }
  } catch {}
  return statSync(file).mtime.toISOString().slice(0, 10);
}

const urls = pages
  // páginas com noindex (ex.: demos de clientes) ficam de fora
  .filter(f => !/<meta[^>]+name="robots"[^>]+noindex/i.test(readFileSync(f, 'utf8')))
  .map(f => ({ loc: f === 'index.html' ? `${BASE}/` : `${BASE}/${f}`, lastmod: lastmod(f) }))
  .sort((a, b) => a.loc.localeCompare(b.loc));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`).join('\n')}
</urlset>
`;
writeFileSync('sitemap.xml', xml);
console.log(`sitemap.xml: ${urls.length} URLs`);
