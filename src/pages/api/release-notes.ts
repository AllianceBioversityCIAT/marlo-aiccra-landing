import type { APIRoute } from 'astro';
import { RELEASE_NOTES_API_URL } from '../../lib/release-notes';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const response = await fetch(RELEASE_NOTES_API_URL, {
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
