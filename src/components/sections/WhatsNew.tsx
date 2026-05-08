import { useState, useEffect } from 'react';
import {
  ExternalLink,
  Calendar,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

const API_URL =
  'https://release-notes.prms.cgiar.org/api/notion/databases/035e13d090ff4251acb12f8e5e2171f4/query?projects=AICCRA, MARLO-CRP';

const STATUS_COLOR: Record<string, string> = {
  green: '#059669',
  blue: '#2563eb',
  yellow: '#d97706',
  red: '#dc2626',
  gray: '#6b7280',
  orange: '#ea580c',
  purple: '#7c3aed',
  pink: '#db2777',
  brown: '#92400e',
};

const STATUS_BG: Record<string, string> = {
  green: 'rgba(5,150,105,0.1)',
  blue: 'rgba(37,99,235,0.1)',
  yellow: 'rgba(217,119,6,0.1)',
  red: 'rgba(220,38,38,0.1)',
  gray: 'rgba(107,114,128,0.1)',
  orange: 'rgba(234,88,12,0.1)',
  purple: 'rgba(124,58,237,0.1)',
  pink: 'rgba(219,39,119,0.1)',
  brown: 'rgba(146,64,14,0.1)',
};

interface Developer {
  id: string;
  name: string;
  avatar_url?: string;
}

interface ReleaseNote {
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

function parseReleases(results: NotionPage[]): ReleaseNote[] {
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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function DeveloperAvatar({ dev, size = 'sm' }: { dev: Developer; size?: 'sm' | 'md' }) {
  const initials = dev.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  const dim = size === 'md' ? 'w-8 h-8 text-xs' : 'w-6 h-6 text-[10px]';

  return dev.avatar_url ? (
    <img
      src={dev.avatar_url}
      alt={dev.name}
      title={dev.name}
      className={`${dim} rounded-full object-cover ring-2 ring-white`}
    />
  ) : (
    <div
      className={`${dim} rounded-full flex items-center justify-center text-white font-bold ring-2 ring-white flex-shrink-0`}
      style={{ background: '#1a3a5c' }}
      title={dev.name}
    >
      {initials}
    </div>
  );
}

function ProjectBadge({ name }: { name: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: 'rgba(13,148,136,0.08)', color: '#0d9488' }}
    >
      {name}
    </span>
  );
}

function StatusBadge({ status }: { status: { name: string; color: string } }) {
  const color = STATUS_COLOR[status.color] ?? '#6b7280';
  const bg = STATUS_BG[status.color] ?? 'rgba(107,114,128,0.1)';
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ color, background: bg }}
    >
      {status.name}
    </span>
  );
}

// ── Featured card (with cover image) ─────────────────────────────────────────

function FeaturedCard({ release }: { release: ReleaseNote }) {
  return (
    <a
      href={release.notionUrl ?? release.evidenceLink ?? '#'}
      target={release.notionUrl || release.evidenceLink ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col transition-shadow duration-200 hover:shadow-md group"
    >
      {/* Cover image */}
      <div className="aspect-video w-full overflow-hidden bg-gray-100 flex-shrink-0">
        {release.coverImage ? (
          <img
            src={release.coverImage}
            alt={release.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(135deg, #0f2a47 0%, #1a3a5c 60%, #0d9488 100%)',
            }}
          />
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Dot + date */}
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #db2777 100%)',
            }}
          />
          {release.date && (
            <span className="text-xs text-gray-500 font-medium">{formatDate(release.date)}</span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {release.status && <StatusBadge status={release.status} />}
          {release.projects.map((p) => (
            <ProjectBadge key={p} name={p} />
          ))}
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
          {release.title}
        </h3>
      </div>
    </a>
  );
}

// ── List item (for remaining releases) ───────────────────────────────────────

function ReleaseListItem({ release }: { release: ReleaseNote }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      {/* Title */}
      <div className="flex-1 min-w-0">
        <a
          href={release.notionUrl ?? release.evidenceLink ?? '#'}
          target={release.notionUrl || release.evidenceLink ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors leading-snug line-clamp-2"
        >
          {release.title}
        </a>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 w-64 flex-shrink-0">
        {release.status && <StatusBadge status={release.status} />}
        {release.projects.map((p) => (
          <ProjectBadge key={p} name={p} />
        ))}
      </div>

      {/* Date */}
      <div className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap w-24 flex-shrink-0 justify-end">
        <Calendar size={11} />
        {release.date ? formatDate(release.date) : '—'}
      </div>

      {/* Developer avatars */}
      <div className="flex items-center flex-shrink-0 w-16 justify-end">
        {release.developers.slice(0, 3).map((dev, i) => (
          <div key={dev.id} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 3 - i }}>
            <DeveloperAvatar dev={dev} />
          </div>
        ))}
        {release.developers.length === 0 && (
          <div
            className="w-6 h-6 rounded-full ring-2 ring-white"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #db2777 100%)',
            }}
          />
        )}
      </div>

      {/* External link */}
      {(release.notionUrl || release.evidenceLink) && (
        <a
          href={release.notionUrl ?? release.evidenceLink ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-blue-500 transition-colors flex-shrink-0"
          aria-label="Open release"
        >
          <ExternalLink size={14} />
        </a>
      )}
    </div>
  );
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function SkeletonFeaturedCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-200 w-full" />
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gray-200" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-4 w-16 bg-gray-200 rounded-full" />
          <div className="h-4 w-20 bg-gray-200 rounded-full" />
        </div>
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

function SkeletonListItem() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 animate-pulse">
      <div className="flex-1 space-y-1.5">
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-100 rounded" />
      </div>
      <div className="flex gap-1.5 w-64 flex-shrink-0">
        <div className="h-4 w-20 bg-gray-200 rounded-full" />
        <div className="h-4 w-24 bg-gray-200 rounded-full" />
      </div>
      <div className="h-3 w-20 bg-gray-200 rounded w-24 flex-shrink-0" />
      <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0" />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function WhatsNew() {
  const [releases, setReleases] = useState<ReleaseNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchReleases() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setReleases(parseReleases(data.results ?? []));
    } catch {
      setError('Failed to load release notes. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReleases();
  }, []);

  const featured = releases.slice(0, 5);
  const rest = releases.slice(5);

  return (
    <section style={{ background: '#f3f4f6' }} className="min-h-screen">
      {/* Hero header */}
      <div
        className="py-20 px-6"
        style={{
          background: 'linear-gradient(135deg, #0f2a47 0%, #1a3a5c 60%, #0d9488 100%)',
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#7dd3fc' }}
          >
            <Sparkles size={12} />
            Release Notes
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            What's New
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed max-w-xl mx-auto">
            Stay up to date with the latest features, improvements, and fixes shipped to the MARLO
            platform.
          </p>
          {!loading && !error && (
            <p className="mt-4 text-sm text-blue-200">
              {releases.length} release{releases.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Loading state */}
        {loading && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SkeletonFeaturedCard />
              <SkeletonFeaturedCard />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SkeletonFeaturedCard />
              <SkeletonFeaturedCard />
              <SkeletonFeaturedCard />
            </div>
            <div className="mt-10">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
                {[...Array(4)].map((_, i) => (
                  <SkeletonListItem key={i} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="bg-white rounded-2xl border border-red-100 p-8 text-center">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={fetchReleases}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ background: '#2563eb' }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#1d4ed8')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#2563eb')}
            >
              <RefreshCw size={14} />
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && releases.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500 font-medium">No releases found.</p>
          </div>
        )}

        {/* Featured grid */}
        {!loading && !error && featured.length > 0 && (
          <div className="space-y-4">
            {/* Row 1: first 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featured.slice(0, 2).map((r) => (
                <FeaturedCard key={r.id} release={r} />
              ))}
            </div>

            {/* Row 2: next 3 */}
            {featured.length > 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {featured.slice(2, 5).map((r) => (
                  <FeaturedCard key={r.id} release={r} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* "More from the team" list */}
        {!loading && !error && rest.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">More from the team</h2>
            <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
              {rest.map((r) => (
                <ReleaseListItem key={r.id} release={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
