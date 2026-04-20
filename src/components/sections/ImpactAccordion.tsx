import { useState, type ComponentType } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart2,
  Check,
  CheckCircle,
  ShieldCheck,
  TrendingUp,
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
  stat: string;
  label: string;
  desc: string;
  featured?: boolean;
};

const stats: Stat[] = [
  {
    id: 'faster',
    Icon: Activity,
    iconColor: '#2563eb',
    iconBg: 'rgba(37,99,235,0.1)',
    stat: '50%',
    label: 'Faster Reporting Cycles',
    desc: 'Reporting cycles completed faster, freeing teams to focus on what matters most.',
  },
  {
    id: 'consistency',
    Icon: CheckCircle,
    iconColor: '#0d9488',
    iconBg: 'rgba(13,148,136,0.1)',
    stat: '↑ High',
    label: 'Data Consistency',
    desc: 'Improved data consistency across projects with standardized reporting structures.',
  },
  {
    id: 'realtime',
    Icon: BarChart2,
    iconColor: '#059669',
    iconBg: 'rgba(5,150,105,0.1)',
    stat: 'Live',
    label: 'Real-Time Visibility',
    desc: 'Continuous visibility into program performance without manual consolidation.',
  },
  {
    id: 'errors',
    Icon: ShieldCheck,
    iconColor: '#7c3aed',
    iconBg: 'rgba(124,58,237,0.1)',
    stat: '↓ Few',
    label: 'Reporting Errors',
    desc: 'Significant reduction in reporting errors through structured workflows and validation.',
  },
  {
    id: 'lifecycle',
    Icon: TrendingUp,
    iconColor: '#0d9488',
    iconBg: 'rgba(13,148,136,0.1)',
    stat: 'Why MARLO',
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
              <div
                className={`${s.featured ? 'text-xs font-semibold tracking-widest uppercase' : 'text-3xl font-bold'} mb-1`}
                style={{ color: s.iconColor }}
              >
                {s.stat}
              </div>
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
            <div className="text-sm font-bold whitespace-nowrap" style={{ color: s.iconColor }}>
              {s.stat}
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
