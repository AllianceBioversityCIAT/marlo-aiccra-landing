import { useState, type ComponentType } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Eye,
  Globe,
  TrendingUp,
  Zap,
  type LucideProps,
} from 'lucide-react';

const featuredBullets = [
  'Standardize reporting across multiple projects and teams',
  'Reduce manual work and reporting errors',
  'Improve data visibility in real time',
  'Support evidence-based decision-making',
  'Align reporting with organizational frameworks (e.g., PRMS, donor requirements)',
];

type Stat = {
  id: string;
  Icon: ComponentType<LucideProps>;
  iconColor: string;
  iconBg: string;
  label: string;
  desc: string;
  featured?: boolean;
};

const stats: Stat[] = [
  {
    id: 'faster',
    Icon: Globe,
    iconColor: '#2563eb',
    iconBg: 'rgba(37,99,235,0.1)',
    label: 'Proven in Complex Multi-Country Programs',
    desc: 'MARLO has been used in initiatives like AICCRA to support results management across more than 10 countries and distributed teams, ensuring consistent reporting at scale.',
  },
  {
    id: 'consistency',
    Icon: Eye,
    iconColor: '#0d9488',
    iconBg: 'rgba(13,148,136,0.1)',
    label: 'End-to-End Results Visibility',
    desc: 'The platform supports tracking of thousands of deliverables, innovations, and impact reports, providing clear traceability from activities to results.',
  },
  {
    id: 'realtime',
    Icon: Zap,
    iconColor: '#059669',
    iconBg: 'rgba(5,150,105,0.1)',
    label: 'Faster Reporting with AI Support',
    desc: 'Using AI powered by structured data, teams can move from hours of manual writing to draft reports in minutes, while maintaining consistency and quality.',
  },
  {
    id: 'errors',
    Icon: BookOpen,
    iconColor: '#7c3aed',
    iconBg: 'rgba(124,58,237,0.1)',
    label: 'Quality and Open Science Standards',
    desc: 'MARLO supports compliance with FAIR and Open Access principles, helping ensure outputs are reusable, accessible, and aligned with institutional standards.',
  },
  {
    id: 'lifecycle',
    Icon: TrendingUp,
    iconColor: '#0d9488',
    iconBg: 'rgba(13,148,136,0.1)',
    label: 'Transform reporting into a strategic asset',
    desc: 'MARLO is a structured reporting and performance management platform designed for complex programs — improving data quality, streamlining reporting cycles, and turning data into actionable insights.',
    featured: true,
  },
];

const firstInteractiveId = stats.find((s) => !s.featured)!.id;

export default function ImpactAccordion() {
  const [activeId, setActiveId] = useState<string>(firstInteractiveId);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  let interactiveIndex = 0;

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:h-[440px]">
      {stats.map((s) => {
        const isActive = s.featured || activeId === s.id;
        const contentId = `impact-card-${s.id}`;
        const isHovered = hoveredId === s.id;

        const number = !s.featured ? String(++interactiveIndex).padStart(2, '0') : null;
        const arrowActive = !s.featured && (isActive || isHovered);
        const arrowStyle = {
          color: arrowActive ? s.iconColor : '#9ca3af',
          transform: arrowActive ? 'rotate(-45deg)' : 'rotate(0deg)',
        } as const;

        const expandedContent = (
          <div
            id={contentId}
            role="region"
            key={`expanded-${s.id}-${isActive ? 'a' : 'b'}`}
            className={`flex flex-col h-full p-6 text-left impact-animate-in ${s.featured ? 'justify-center' : ''}`}
          >
            {!s.featured && (
              <div className="flex items-start justify-between">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: s.iconBg }}
                >
                  <s.Icon size={20} color={s.iconColor} />
                </div>
                {number && (
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold tracking-widest"
                      style={{ color: '#9ca3af' }}
                    >
                      {number}
                    </span>
                    <ArrowRight
                      size={16}
                      className="transition-all duration-300 ease-out"
                      style={arrowStyle}
                    />
                  </div>
                )}
              </div>
            )}

            <div className={s.featured ? '' : 'mt-auto pt-6'}>
              <h3
                className={`${s.featured ? 'text-lg leading-snug' : 'text-sm'} font-bold mb-2`}
                style={{ color: '#111827' }}
              >
                {s.label}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>
                {s.desc}
              </p>
              {s.featured && (
                <ul className="flex flex-col gap-1.5 mt-4">
                  {featuredBullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-[11px] leading-snug"
                      style={{ color: '#374151' }}
                    >
                      <Check size={13} color={s.iconColor} className="shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );

        const collapsedContent = (
          <div className="flex flex-col items-center h-full py-6 px-3 gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold tracking-widest" style={{ color: '#9ca3af' }}>
                {number}
              </span>
              <ArrowRight
                size={14}
                className="transition-all duration-300 ease-out"
                style={arrowStyle}
              />
            </div>
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: s.iconBg }}
            >
              <s.Icon size={20} color={s.iconColor} />
            </div>
            <div className="flex-1 flex items-center">
              <span
                className="text-sm font-bold whitespace-nowrap [writing-mode:vertical-rl] rotate-180"
                style={{ color: '#111827' }}
              >
                {s.label}
              </span>
            </div>
          </div>
        );

        const base =
          'relative bg-white rounded-2xl overflow-hidden transition-all duration-500 ease-out border border-[#e5e7eb] sm:min-w-0';
        const flex = s.featured
          ? 'sm:flex-[2.5_1_0%]'
          : isActive
            ? 'sm:flex-[2_1_0%]'
            : 'sm:flex-[1_1_0%]';

        if (s.featured) {
          return (
            <div
              key={s.id}
              className={`${base} ${flex}`}
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
            >
              <div className="hidden sm:block h-full">{expandedContent}</div>
              <div className="sm:hidden">{expandedContent}</div>
            </div>
          );
        }

        return (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveId(s.id)}
            onMouseEnter={() => setHoveredId(s.id)}
            onMouseLeave={() => setHoveredId(null)}
            aria-expanded={isActive}
            aria-controls={contentId}
            className={`${base} ${flex} text-left ${
              isActive ? 'cursor-default' : 'cursor-pointer hover:border-[#cbd5e1]'
            }`}
          >
            <div className="hidden sm:block h-full">
              {isActive ? expandedContent : collapsedContent}
            </div>
            <div className="sm:hidden">{expandedContent}</div>
          </button>
        );
      })}
    </div>
  );
}
