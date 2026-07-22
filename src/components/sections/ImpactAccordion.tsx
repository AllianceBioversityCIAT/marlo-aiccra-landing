import { useState, useEffect, useRef, type ComponentType } from 'react';
import { ArrowRight, BookOpen, Eye, Globe, Zap, type LucideProps } from 'lucide-react';

import VideoPlayer from '@/components/ui/VideoPlayer';

type Stat = {
  id: string;
  Icon: ComponentType<LucideProps>;
  iconColor: string;
  iconBg: string;
  label: string;
  desc: string;
};

type ImpactAccordionProps = {
  videosBaseUrl: string;
};

const stats: Stat[] = [
  {
    id: 'faster',
    Icon: Globe,
    iconColor: '#2563eb',
    iconBg: 'rgba(37,99,235,0.1)',
    label: 'Proven in Complex Multi-Country Programs',
    desc: 'MARLO has been used in initiatives like AICCRA to support results management across 145+ countries and distributed teams, ensuring consistent reporting at scale.',
  },
  {
    id: 'consistency',
    Icon: Eye,
    iconColor: '#0d9488',
    iconBg: 'rgba(13,148,136,0.1)',
    label: 'End-to-End Results Visibility',
    desc: 'The platform supports tracking of thousands of deliverables, innovations, and impact reports, providing clear traceability from indicators to results.',
  },
  {
    id: 'realtime',
    Icon: Zap,
    iconColor: '#059669',
    iconBg: 'rgba(5,150,105,0.1)',
    label: 'Faster Synthesis with AI Support',
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
];

const firstId = stats[0].id;

export default function ImpactAccordion({ videosBaseUrl }: ImpactAccordionProps) {
  const [activeId, setActiveId] = useState<string>(firstId);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [barKey, setBarKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const accumulatedElapsedRef = useRef(0);
  const lastRunStartRef = useRef(Date.now());
  const hasHoveredRef = useRef(false);

  const isHoveringActive = hoveredId === activeId;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.3,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    accumulatedElapsedRef.current = 0;
    lastRunStartRef.current = Date.now();
    hasHoveredRef.current = false;
    setBarKey((k) => k + 1);
  }, [activeId]);

  useEffect(() => {
    if (isHoveringActive) {
      hasHoveredRef.current = true;
      accumulatedElapsedRef.current += Date.now() - lastRunStartRef.current;
    } else if (hasHoveredRef.current) {
      hasHoveredRef.current = false;
      lastRunStartRef.current = Date.now();
      setBarKey((k) => k + 1);
    }
  }, [isHoveringActive]);

  useEffect(() => {
    if (!isVisible || isHoveringActive) return;

    const remaining = Math.max(0, 12000 - accumulatedElapsedRef.current);
    const timer = setTimeout(() => {
      const currentIndex = stats.findIndex((s) => s.id === activeId);
      const nextIndex = (currentIndex + 1) % stats.length;
      setActiveId(stats[nextIndex].id);
    }, remaining);

    return () => clearTimeout(timer);
  }, [activeId, isHoveringActive, isVisible]);

  let interactiveIndex = 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_550px] gap-8 lg:gap-10 xl:gap-16">
      <div ref={containerRef} className="flex flex-col gap-3 h-[540px]">
        {stats.map((s) => {
          const isActive = activeId === s.id;
          const contentId = `impact-card-${s.id}`;
          const isHovered = hoveredId === s.id;
          const number = String(++interactiveIndex).padStart(2, '0');

          const arrowActive = isActive || isHovered;
          const arrowStyle = {
            color: arrowActive ? s.iconColor : '#9ca3af',
            transform: arrowActive ? 'rotate(-45deg)' : 'rotate(0deg)',
          } as const;

          const expandedContent = (
            <div
              id={contentId}
              role="region"
              key={`expanded-${s.id}-${isActive ? 'a' : 'b'}`}
              className="flex flex-col h-full p-6 text-left impact-animate-in"
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: s.iconBg }}
                >
                  <s.Icon size={20} color={s.iconColor} />
                </div>
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
              </div>

              <div className="mt-auto pt-6">
                <h3 className="text-base font-bold mb-2" style={{ color: '#111827' }}>
                  {s.label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>
                  {s.desc}
                </p>
              </div>
            </div>
          );

          const collapsedContent = (
            <div className="flex flex-row items-center h-full px-6 gap-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: s.iconBg }}
              >
                <s.Icon size={18} color={s.iconColor} />
              </div>
              <span className="text-sm font-bold truncate flex-1" style={{ color: '#111827' }}>
                {s.label}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className="text-xs font-semibold tracking-widest"
                  style={{ color: '#9ca3af' }}
                >
                  {number}
                </span>
                <ArrowRight
                  size={14}
                  className="transition-all duration-300 ease-out"
                  style={arrowStyle}
                />
              </div>
            </div>
          );

          const flex = isActive ? 'flex-[3_1_0%]' : 'flex-[1_1_0%]';

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveId(s.id)}
              onMouseEnter={() => setHoveredId(s.id)}
              onMouseLeave={() => setHoveredId(null)}
              aria-expanded={isActive}
              aria-controls={contentId}
              className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-500 ease-out border border-[#e5e7eb] text-left ${flex} ${
                isActive ? 'cursor-default' : 'cursor-pointer hover:border-[#cbd5e1]'
              }`}
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
            >
              <div className="h-full">{isActive ? expandedContent : collapsedContent}</div>
              {isActive && (
                <div
                  key={barKey}
                  className="absolute bottom-0 left-0 right-0 h-[3px] origin-left"
                  style={{
                    background: s.iconColor,
                    animation: 'progress-countdown 12s linear forwards',
                    animationDelay: `-${accumulatedElapsedRef.current}ms`,
                    animationPlayState: isHoveringActive ? 'paused' : 'running',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center w-full">
        <VideoPlayer
          src={`${videosBaseUrl}/marlo-introduction.mp4`}
          className="rounded-2xl shadow-2xl"
        />
      </div>
    </div>
  );
}
