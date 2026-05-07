import { useState, useEffect, useRef, type ComponentType } from 'react';
import { createPortal } from 'react-dom';
import {
  ListChecks,
  Users,
  Database,
  FileText,
  Maximize2,
  X,
  type LucideProps,
} from 'lucide-react';

type Feature = {
  Icon: ComponentType<LucideProps>;
  iconColor: string;
  iconBg: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  title: string;
  desc: string;
  videos?: string[];
};

const features: Feature[] = [
  {
    Icon: ListChecks,
    iconColor: '#2563eb',
    iconBg: 'rgba(37,99,235,0.1)',
    badge: 'Workflows',
    badgeColor: '#2563eb',
    badgeBg: 'rgba(37,99,235,0.08)',
    title: 'Structured Workflows',
    desc: 'Define and manage reporting processes step by step, ensuring consistency across all projects and reporting cycles.',
    videos: ['/videos/structured-workflows.mov', '/videos/structured-workflows2.mov'],
  },
  {
    Icon: Users,
    iconColor: '#0d9488',
    iconBg: 'rgba(13,148,136,0.1)',
    badge: 'Access',
    badgeColor: '#0d9488',
    badgeBg: 'rgba(13,148,136,0.08)',
    title: 'Role-Based Access',
    desc: 'Assign roles and responsibilities to ensure accountability and proper data validation across your team.',
    videos: ['/videos/role-based-access.mov'],
  },
  {
    Icon: Database,
    iconColor: '#059669',
    iconBg: 'rgba(5,150,105,0.1)',
    badge: 'Data',
    badgeColor: '#059669',
    badgeBg: 'rgba(5,150,105,0.08)',
    title: 'Centralized Data Management',
    desc: 'Store all reporting data in one place — accessible, organized, and ready for analysis at any time.',
    videos: ['/videos/centralized-data-management.mov'],
  },
  {
    Icon: FileText,
    iconColor: '#7c3aed',
    iconBg: 'rgba(124,58,237,0.1)',
    badge: 'Reporting',
    badgeColor: '#7c3aed',
    badgeBg: 'rgba(124,58,237,0.08)',
    title: 'End-to-End Reporting',
    desc: 'From data entry to validation, aggregation, and reporting — all in one integrated platform.',
    videos: ['/videos/end-to-end-reporting.mp4'],
  },
];

function VideoCarousel({ videos, title }: { videos: string[]; title: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hovering, setHovering] = useState(false);

  const goTo = (idx: number) => {
    setVisible(false);
    setTimeout(() => {
      setActiveIdx(idx);
      setVisible(true);
    }, 300);
  };

  const handleEnded = () => goTo((activeIdx + 1) % videos.length);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isFullscreen]);

  return (
    <div className="w-full mb-6">
      <div
        className="relative w-full"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <video
          key={videos[activeIdx]}
          src={videos[activeIdx]}
          autoPlay
          muted
          playsInline
          onEnded={handleEnded}
          title={title}
          className="w-full rounded-2xl shadow-md"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 300ms ease-in-out',
          }}
        />
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          className="absolute bottom-3 right-3 p-1.5 rounded-lg"
          style={{
            opacity: hovering ? 1 : 0,
            transition: 'opacity 200ms ease-in-out',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
          }}
          aria-label="View fullscreen"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {videos.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {videos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => i !== activeIdx && goTo(i)}
              aria-label={`Go to video ${i + 1}`}
              className="w-2 h-2 rounded-full"
              style={{
                background: i === activeIdx ? '#2563eb' : '#d1d5db',
                transition: 'background 300ms ease-in-out',
              }}
            />
          ))}
        </div>
      )}

      {isFullscreen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.85)' }}
            onClick={(e) => e.target === e.currentTarget && setIsFullscreen(false)}
          >
            <div className="relative w-full max-w-5xl mx-4">
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="absolute -top-10 right-0 transition-colors"
                style={{ color: 'rgba(255,255,255,0.8)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                aria-label="Close fullscreen"
              >
                <X size={28} />
              </button>

              <video
                key={`fs-${videos[activeIdx]}`}
                src={videos[activeIdx]}
                autoPlay
                muted
                playsInline
                controls
                onEnded={handleEnded}
                title={title}
                className="w-full rounded-2xl shadow-2xl"
              />

              {videos.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {videos.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => i !== activeIdx && goTo(i)}
                      aria-label={`Go to video ${i + 1}`}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        background: i === activeIdx ? '#2563eb' : 'rgba(255,255,255,0.4)',
                        transition: 'background 300ms',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default function CoreFeatures() {
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = panelRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { root: null, rootMargin: '-30% 0px -25% 0px', threshold: 0 }
    );

    panelRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row">
        {/* Left column — sticky */}
        <div className="lg:w-[37%] lg:sticky lg:top-24 lg:self-start py-16 lg:py-24 flex flex-col justify-center lg:pr-12">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: '#0d9488' }}
          >
            Core Features
          </p>
          <h2
            className="text-3xl lg:text-4xl font-bold mb-4 text-balance"
            style={{ color: '#111827' }}
          >
            A platform designed for <br className="hidden lg:block" />
            structured reporting
          </h2>
          <p className="text-sm leading-relaxed mb-10" style={{ color: '#4b5563' }}>
            MARLO brings together the tools your team needs to standardize reporting, ensure data
            quality, and make information accessible across your entire program portfolio.
          </p>

          <nav className="flex flex-col gap-1">
            {features.map((f, i) => (
              <button
                key={f.title}
                type="button"
                onClick={() =>
                  panelRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
                className={`text-left pl-4 py-2.5 text-sm transition-all duration-300 border-l-2 ${
                  activeIndex === i
                    ? 'font-semibold'
                    : 'text-gray-500 hover:text-gray-600 border-gray-300'
                }`}
                style={
                  activeIndex === i ? { color: f.iconColor, borderColor: f.iconColor } : undefined
                }
              >
                {f.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Right column — scrollable panels */}
        <div className="lg:w-[63%]">
          {features.map((f, i) => (
            <>
              <div
                key={f.title}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                className="py-16 lg:min-h-screen flex flex-col items-center justify-center px-8 text-center"
              >
                {f.videos?.length ? (
                  <VideoCarousel videos={f.videos} title={f.title} />
                ) : (
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                    style={{ background: f.iconBg }}
                  >
                    <f.Icon size={36} color={f.iconColor} />
                  </div>
                )}

                <span
                  className="text-[11px] font-semibold px-3 py-1 rounded-full mb-5 inline-block"
                  style={{ background: f.badgeBg, color: f.badgeColor }}
                >
                  {f.badge}
                </span>

                <h3
                  className="text-2xl lg:text-3xl font-bold mb-4 max-w-sm"
                  style={{ color: '#111827' }}
                >
                  {f.title}
                </h3>

                <p className="text-base leading-relaxed max-w-md" style={{ color: '#6b7280' }}>
                  {f.desc}
                </p>
              </div>
              <>
                {i < features.length - 1 && (
                  <div className="w-full h-px lg:mt-0" style={{ background: '#e5e7eb' }} />
                )}
              </>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
