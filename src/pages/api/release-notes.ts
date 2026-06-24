import type { APIRoute } from 'astro';

const API_URL =
  'https://release-notes.prms.cgiar.org/api/notion/databases/035e13d090ff4251acb12f8e5e2171f4/query?projects=AICCRA, MARLO-CRP';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch release notes' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (err) {
    console.error('[release-notes] Fetch error:', err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: 'Failed to fetch release notes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
