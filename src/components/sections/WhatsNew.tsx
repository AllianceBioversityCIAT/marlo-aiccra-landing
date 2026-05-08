import { useState, useEffect } from 'react';
import {
  ChevronDown,
  ExternalLink,
  Calendar,
  Users,
  Tag,
  Link2,
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

function DeveloperAvatar({ dev }: { dev: Developer }) {
  const initials = dev.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-center gap-1.5">
      {dev.avatar_url ? (
        <img src={dev.avatar_url} alt={dev.name} className="w-6 h-6 rounded-full object-cover" />
      ) : (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
          style={{ background: '#1a3a5c' }}
        >
          {initials}
        </div>
      )}
      <span className="text-xs text-gray-600">{dev.name}</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <div className="h-5 w-20 bg-gray-200 rounded-full" />
            <div className="h-5 w-16 bg-gray-200 rounded-full" />
          </div>
          <div className="h-5 w-3/4 bg-gray-200 rounded-lg" />
          <div className="h-4 w-full bg-gray-100 rounded-lg" />
          <div className="h-4 w-2/3 bg-gray-100 rounded-lg" />
        </div>
        <div className="h-5 w-5 bg-gray-200 rounded mt-1 flex-shrink-0" />
      </div>
    </div>
  );
}

function ReleaseCard({
  release,
  expanded,
  onToggle,
}: {
  release: ReleaseNote;
  expanded: boolean;
  onToggle: () => void;
}) {
  const statusColor = release.status
    ? (STATUS_COLOR[release.status.color] ?? '#6b7280')
    : '#6b7280';
  const statusBg = release.status
    ? (STATUS_BG[release.status.color] ?? 'rgba(107,114,128,0.1)')
    : 'rgba(107,114,128,0.1)';

  const shortDesc =
    release.description.length > 140
      ? release.description.slice(0, 140).trimEnd() + '…'
      : release.description;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-shadow duration-200 hover:shadow-md">
      <button
        onClick={onToggle}
        className="w-full text-left p-6 flex items-start justify-between gap-4 focus:outline-none"
        aria-expanded={expanded}
      >
        <div className="flex-1 min-w-0 space-y-2.5">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2">
            {release.date && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium">
                <Calendar size={11} />
                {formatDate(release.date)}
              </span>
            )}
            {release.status && (
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ color: statusColor, background: statusBg }}
              >
                {release.status.name}
              </span>
            )}
            {release.tag && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                <Tag size={10} />
                {release.tag}
              </span>
            )}
            {release.projects.map((p) => (
              <span
                key={p}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background: 'rgba(13,148,136,0.08)',
                  color: '#0d9488',
                }}
              >
                {p}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-gray-900 leading-snug">{release.title}</h3>

          {/* Short description (collapsed) */}
          {!expanded && release.description && (
            <p className="text-sm text-gray-500 leading-relaxed">{shortDesc}</p>
          )}
        </div>

        <ChevronDown
          size={18}
          className="flex-shrink-0 mt-0.5 text-gray-400 transition-transform duration-300"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4">
          {release.description && (
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {release.description}
            </p>
          )}

          {release.developers.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <Users size={11} />
                Developers
              </p>
              <div className="flex flex-wrap gap-3">
                {release.developers.map((dev) => (
                  <DeveloperAvatar key={dev.id} dev={dev} />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            {release.evidenceLink && (
              <a
                href={release.evidenceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors duration-150"
                style={{ background: '#2563eb' }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#1d4ed8')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#2563eb')}
              >
                <Link2 size={14} />
                Evidence
              </a>
            )}
            {release.notionUrl && (
              <a
                href={release.notionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 bg-white transition-colors duration-150 hover:bg-gray-50"
              >
                <ExternalLink size={14} />
                View in Notion
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const PROJECTS = ['All', 'AICCRA', 'MARLO-CRP'] as const;
type ProjectFilter = (typeof PROJECTS)[number];

export default function WhatsNew() {
  const [releases, setReleases] = useState<ReleaseNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<ProjectFilter>('All');

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

  const filtered =
    activeProject === 'All' ? releases : releases.filter((r) => r.projects.includes(activeProject));

  return (
    <section style={{ background: '#f3f4f6' }} className="min-h-screen">
      {/* Hero header */}
      <div
        className="py-20 px-6"
        style={{
          background: 'linear-gradient(135deg, #0f2a47 0%, #1a3a5c 60%, #0d9488 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
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
              {filtered.length} release{filtered.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Project filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {PROJECTS.map((project) => {
            const isActive = activeProject === project;
            return (
              <button
                key={project}
                onClick={() => setActiveProject(project)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                style={
                  isActive
                    ? { background: '#1a3a5c', color: '#fff' }
                    : { background: '#fff', color: '#4b5563', border: '1px solid #e5e7eb' }
                }
              >
                {project}
              </button>
            );
          })}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
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
        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500 font-medium">
              No releases found for{' '}
              <span className="font-semibold text-gray-700">{activeProject}</span>.
            </p>
          </div>
        )}

        {/* Release list */}
        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((release) => (
              <ReleaseCard
                key={release.id}
                release={release}
                expanded={expandedId === release.id}
                onToggle={() => setExpandedId(expandedId === release.id ? null : release.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
