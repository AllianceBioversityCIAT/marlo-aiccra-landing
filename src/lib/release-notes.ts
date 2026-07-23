/** Shared release-notes fetching/parsing, used both server-side (SSR page load,
 * so GEO/AI crawlers without JS see real content) and client-side (manual refresh). */

export const RELEASE_NOTES_API_URL =
  'https://release-notes.prms.cgiar.org/api/notion/databases/035e13d090ff4251acb12f8e5e2171f4/query?projects=AICCRA, MARLO-CRP';

export interface Developer {
  id: string;
  name: string;
  avatar_url?: string;
}

export interface ReleaseNote {
  id: string;
  title: string;
  description: string;
  date: string | null;
  status: { name: string; color: string } | null;
  tag: string | null;
  projects: string[];
  developers: Developer[];
  evidenceLink: string | null;
  notionUrl: string | null;
  lastEdited: string;
  coverImage: string | null;
}

interface NotionRichText {
  plain_text: string;
}
interface NotionSelectOption {
  name: string;
}
interface NotionPerson {
  id: string;
  name?: string;
  avatar_url?: string;
}
interface NotionPageProperties {
  Name?: { title: NotionRichText[] };
  'Brief description'?: { rich_text: NotionRichText[] };
  'Released date'?: { date: { start: string } | null };
  Status?: { status: { name: string; color: string } | null };
  Tags?: { select: NotionSelectOption | null };
  Projects?: { multi_select: NotionSelectOption[] };
  Developers?: { people: NotionPerson[] };
  'Evidence link'?: { url: string | null };
}
interface NotionPage {
  id: string;
  cover?:
    | { type: 'external'; external: { url: string } }
    | { type: 'file'; file: { url: string; expiry_time: string } }
    | null;
  properties: NotionPageProperties;
  public_url: string | null;
  last_edited_time: string;
}

export function parseReleases(results: NotionPage[]): ReleaseNote[] {
  return results
    .map((result) => {
      const props = result.properties;

      const title = (props.Name?.title ?? []).map((t) => t.plain_text).join('') || 'Untitled';
      const description = (props['Brief description']?.rich_text ?? [])
        .map((t) => t.plain_text)
        .join('');
      const date = props['Released date']?.date?.start ?? null;
      const statusRaw = props.Status?.status;
      const status = statusRaw ? { name: statusRaw.name, color: statusRaw.color } : null;
      const tag = props.Tags?.select?.name ?? null;
      const projects = (props.Projects?.multi_select ?? []).map((p) => p.name);
      const developers = (props.Developers?.people ?? []).map((p) => ({
        id: p.id,
        name: p.name ?? 'Unknown',
        avatar_url: p.avatar_url,
      }));
      const evidenceLink = props['Evidence link']?.url ?? null;
      const coverImage =
        result.cover?.type === 'external'
          ? result.cover.external.url
          : result.cover?.type === 'file'
            ? result.cover.file.url
            : null;

      return {
        id: result.id,
        title,
        description,
        date,
        status,
        tag,
        projects,
        developers,
        evidenceLink,
        notionUrl: result.public_url ?? null,
        lastEdited: result.last_edited_time,
        coverImage,
      };
    })
    .sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });
}

export async function fetchReleaseNotes(): Promise<ReleaseNote[]> {
  const response = await fetch(RELEASE_NOTES_API_URL, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  return parseReleases(data.results ?? []);
}
