import type { APIRoute } from 'astro';
import { SITEMAP_ROUTES, absoluteUrl } from '../lib/seo';
import { fetchReleaseNotes } from '../lib/release-notes';

export const prerender = false;

async function whatsNewLastmod(): Promise<string> {
  try {
    const releases = await fetchReleaseNotes();
    const newest = releases.find((r) => r.date)?.date;
    if (newest) return newest;
  } catch {
    // fall through to today's date below
  }
  return new Date().toISOString().split('T')[0];
}

export const GET: APIRoute = async () => {
  const fallbackLastmod = new Date().toISOString().split('T')[0];
  const dynamicLastmod = await whatsNewLastmod();

  const urls = SITEMAP_ROUTES.map(({ path, changefreq, priority, lastmod }) => {
    const resolvedLastmod = lastmod ?? (path === '/whats-new' ? dynamicLastmod : fallbackLastmod);
    return `  <url>
    <loc>${absoluteUrl(path)}</loc>
    <lastmod>${resolvedLastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
  }).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
