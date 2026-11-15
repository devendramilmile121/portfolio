// Build-time pre-rendering. Runs after `vite build` (client) and `vite build --ssr` (server entry).
//
// For every route it writes a static HTML file containing the rendered page, that page's own
// title, description, canonical URL, Open Graph tags and structured data, and the portfolio
// config inlined so the browser hydrates without fetching it. It also writes sitemap.xml.
//
// Why: GitHub Pages only knows about files. Without one per route, /blogs/<slug> was served by
// 404.html with an HTTP 404 status, and link previews (LinkedIn, WhatsApp, Slack) never run JS.
//
// Files are written as /blogs.html and /blogs/<slug>.html; GitHub Pages serves them at the
// extensionless URLs (/blogs, /blogs/<slug>) with a 200, which keeps URLs free of trailing slashes.
// Every file under public/ is copied as-is first, so the script refuses to overwrite one of those.

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SITE = 'https://devendramilmile.com';
const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const SSR_OUT = path.join(ROOT, 'dist-ssr');

const { render, getAllBlogs } = await import(pathToFileURL(path.join(SSR_OUT, 'entry-server.js')).href);

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
const config = readJson('public/config/portfolio.json');
const presentations = fs.existsSync(path.join(ROOT, 'public/presentations/manifest.json'))
  ? readJson('public/presentations/manifest.json')
  : [];
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// JSON inside <script>: escape "<" so content can never close the tag early
const scriptJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

const author = { '@type': 'Person', name: config.hero.name, url: SITE };

function setMeta(html, pattern, value) {
  if (!pattern.test(html)) throw new Error(`prerender: template is missing ${pattern}`);
  return html.replace(pattern, (_, before) => `${before}${escapeAttr(value)}`);
}

function buildPage({ url, title, description, type = 'website', jsonLd, body = '', noindex = false }) {
  const canonical = url === '/' ? `${SITE}/` : `${SITE}${url}`;
  let html = template.replace(/<title>[^<]*<\/title>/, () => `<title>${escapeAttr(title)}</title>`);
  html = setMeta(html, /(<meta name="title" content=")[^"]*/, title);
  html = setMeta(html, /(<meta name="description" content=")[^"]*/, description);
  html = setMeta(html, /(<meta property="og:title" content=")[^"]*/, title);
  html = setMeta(html, /(<meta property="og:description" content=")[^"]*/, description);
  html = setMeta(html, /(<meta property="og:type" content=")[^"]*/, type);
  html = setMeta(html, /(<meta property="og:url" content=")[^"]*/, canonical);
  html = setMeta(html, /(<meta name="twitter:title" content=")[^"]*/, title);
  html = setMeta(html, /(<meta name="twitter:description" content=")[^"]*/, description);
  html = setMeta(html, /(<meta name="twitter:url" content=")[^"]*/, canonical);
  html = setMeta(html, /(<link rel="canonical" href=")[^"]*/, canonical);
  if (noindex) html = setMeta(html, /(<meta name="robots" content=")[^"]*/, 'noindex');

  const headExtras = [`<script>window.__PORTFOLIO_CONFIG__=${scriptJson(config)}</script>`];
  if (jsonLd) headExtras.push(`<script type="application/ld+json">${scriptJson(jsonLd)}</script>`);
  html = html.replace('</head>', () => `    ${headExtras.join('\n    ')}\n  </head>`);

  if (!html.includes('<div id="root"></div>')) throw new Error('prerender: template is missing the empty #root');
  return html.replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
}

function write(file, html) {
  if (fs.existsSync(path.join(ROOT, 'public', file))) {
    throw new Error(`prerender: ${file} would overwrite a file from public/`);
  }
  const target = path.join(DIST, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
}

const posts = getAllBlogs();
const writingDescription = 'Notes on Angular, .NET and the problems I run into at work.';

const routes = [
  {
    url: '/',
    file: 'index.html',
    title: config.seo.title,
    description: config.seo.description,
    changefreq: 'monthly',
    priority: '1.0',
  },
  {
    url: '/blogs',
    file: 'blogs.html',
    title: `Writing — ${config.hero.name}`,
    description: writingDescription,
    lastmod: posts.find((post) => !post.unlisted)?.date,
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    url: '/resume',
    file: 'resume.html',
    title: `Résumé — ${config.hero.name}`,
    description: config.resume?.summary ?? config.seo.description,
    changefreq: 'monthly',
    priority: '0.6',
  },
  ...posts.map((post) => ({
    // Unlisted posts keep their URL working but stay out of search and the sitemap
    noindex: post.unlisted,
    sitemap: !post.unlisted,
    url: `/blogs/${post.slug}`,
    file: `blogs/${post.slug}.html`,
    title: `${post.title} — ${config.hero.name}`,
    description: post.summary,
    type: 'article',
    lastmod: post.date,
    changefreq: 'yearly',
    priority: '0.7',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.summary,
      datePublished: post.date,
      dateModified: post.date,
      keywords: post.tags.join(', '),
      author,
      publisher: author,
      image: `${SITE}/og-image.png`,
      mainEntityOfPage: `${SITE}/blogs/${post.slug}`,
    },
  })),
  // Presentation pages go in a folder: presentations/<id>.html is the slide deck itself,
  // which the viewer loads into an iframe, so a page there would overwrite it.
  // GitHub Pages redirects /presentations/<id> to the trailing-slash URL, which the router matches.
  ...presentations.map((deck) => ({
    url: `/presentations/${deck.id}/`,
    file: `presentations/${deck.id}/index.html`,
    title: `${deck.title} — ${config.hero.name}`,
    description: deck.description,
    lastmod: deck.date,
    changefreq: 'yearly',
    priority: '0.5',
  })),
];

// The 404 shell must come from the untouched template: GitHub Pages serves it for unknown URLs,
// and the client renders it from scratch (an empty #root means "don't hydrate")
write(
  '404.html',
  buildPage({ url: '/404', title: `Not found — ${config.hero.name}`, description: config.seo.description, noindex: true })
);

for (const route of routes) {
  const body = await render(route.url, config);
  if (!body.trim()) throw new Error(`prerender: ${route.url} rendered empty`);
  write(route.file, buildPage({ ...route, body }));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .filter((route) => route.sitemap !== false)
  .map((route) =>
    [
      '  <url>',
      `    <loc>${SITE}${route.url === '/' ? '/' : route.url}</loc>`,
      route.lastmod ? `    <lastmod>${route.lastmod}</lastmod>` : null,
      `    <changefreq>${route.changefreq}</changefreq>`,
      `    <priority>${route.priority}</priority>`,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n')
  )
  .join('\n')}
</urlset>
`;
write('sitemap.xml', sitemap);

fs.rmSync(SSR_OUT, { recursive: true, force: true });
console.log(`prerender: wrote ${routes.length} pages, 404.html and sitemap.xml`);
