import { useState, useEffect, useRef, type ComponentType } from 'react';
import { ListChecks, Users, Database, FileText, type LucideProps } from 'lucide-react';

type Feature = {
  Icon: ComponentType<LucideProps>;
  iconColor: string;
  iconBg: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  title: string;
  desc: string;
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
  },
];

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
        <div className="lg:w-[38%] lg:sticky lg:top-24 lg:self-start py-16 lg:py-24 flex flex-col justify-center lg:pr-12">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: '#0d9488' }}
          >
            Core Features
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#111827' }}>
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
                    : 'text-gray-400 border-transparent hover:text-gray-600 hover:border-gray-300'
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
        <div className="lg:w-[62%]">
          {features.map((f, i) => (
            <>
              <div
                key={f.title}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                className="py-16 lg:min-h-screen flex flex-col items-center justify-center px-8 lg:px-20 text-center"
              >
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                  style={{ background: f.iconBg }}
                >
                  <f.Icon size={36} color={f.iconColor} />
                </div>

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
                  <div className="w-full h-px mt-16 lg:mt-0" style={{ background: '#e5e7eb' }} />
                )}
              </>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
