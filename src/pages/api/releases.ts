import type { APIRoute } from 'astro';

export const prerender = false;

const UPSTREAM =
  'https://release-notes.prms.cgiar.org/api/notion/databases/035e13d090ff4251acb12f8e5e2171f4/query?projects=AICCRA, MARLO-CRP';

export const GET: APIRoute = async () => {
  try {
    const res = await fetch(UPSTREAM, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Upstream error: ${res.status}` }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to fetch releases' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
