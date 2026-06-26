import { useState, useEffect, useRef } from 'react';

interface Milestone {
  year: string;
  events: string[];
  peakHeight: number;
}

const milestones: Milestone[] = [
  {
    year: 'CGIAR Phase I',
    peakHeight: 0.28,
    events: [
      'CCAFS develops the initial online Planning & Reporting (P&R) system as MARLO\'s precursor',
    ],
  },
  {
    year: '2015',
    peakHeight: 0.38,
    events: [
      'CCAFS proposes to A4NH, PIM, and WLE to refine the P&R system for CGIAR Phase II research programs',
    ],
  },
  {
    year: '2016',
    peakHeight: 0.62,
    events: [
      'Cost-effectiveness analysis completed; four founding programs formally begin MARLO development (Feb)',
      'Livestock research program officially joins the MARLO ecosystem (Aug)',
      'MAIZE, Wheat, and Excellence in Breeding (EiB) platform adopt the system (Nov)',
    ],
  },
  {
    year: '2017',
    peakHeight: 0.48,
    events: [
      'RICE, FTA, and Fish global programs express formal interest in integrating MARLO (Jan)',
    ],
  },
  {
    year: '2019',
    peakHeight: 0.44,
    events: [
      'Major MARLO glossary update completed to standardize Results-Based Management (RBM) terms across centers (Jan 30)',
    ],
  },
  {
    year: '2021–2024',
    peakHeight: 0.66,
    events: [
      'MARLO serves as the digital backbone for the AICCRA project (USD 100M) data and knowledge management',
      'Supports research portfolio management across 10+ countries and distributed teams',
    ],
  },
  {
    year: '2025',
    peakHeight: 0.80,
    events: [
      'AI narrative generator and text-mining service for innovations integrated',
      'AICCRA Chatbot deployed — conversational interface for querying indicators via natural language',
      'Innovation Catalog launched as a public visualization layer linked to MARLO data',
      'AICCRA project concludes operational phase; MARLO positioned as strategic asset',
    ],
  },
  {
    year: '2026',
    peakHeight: 0.94,
    events: [
      'Platform consolidated as an ecosystem for complex, distributed research portfolios (Jan 20)',
      'Proposed as strategic monitoring system for Young Africa Feeds – Mastercard Foundation (USD 250M) (Mar 2)',
      'Concept note issued to implement MARLO for the Pan-Africa Bean Research Alliance (PABRA) (Apr 21)',
      'PABRA pilot project planned to validate workflows before full-scale rollout',
    ],
  },
];

const VIEW_W = 1200;
const VIEW_H = 420;
const BASELINE = 390;
const PAD_X = 90;
const PEAK_RANGE = 290;
const CONTOUR_LAYERS = 8;

function getPeakX(i: number) {
  return PAD_X + i * ((VIEW_W - PAD_X * 2) / (milestones.length - 1));
}

function getPeakY(peakHeight: number) {
  return BASELINE - peakHeight * PEAK_RANGE;
}

function buildMountainPoints() {
  const pts: [number, number][] = [[0, VIEW_H]];
  milestones.forEach((m, i) => {
    const x = getPeakX(i);
    const y = getPeakY(m.peakHeight);
    if (i > 0) {
      const prevX = getPeakX(i - 1);
      const prevY = getPeakY(milestones[i - 1].peakHeight);
      const valleyX = (prevX + x) / 2;
      const valleyY = Math.max(prevY, y) + 30 + Math.abs(prevY - y) * 0.15;
      pts.push([valleyX, valleyY]);
    }
    pts.push([x, y]);
  });
  pts.push([VIEW_W, VIEW_H]);
  return pts;
}

function pointsToD(pts: [number, number][], offsetY = 0): string {
  return pts
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${Math.min(y + offsetY, VIEW_H)}`)
    .join(' ');
}

function buildContourD(pts: [number, number][], offsetY: number): string {
  const shifted = pts.map(([x, y]) => [x, y + offsetY] as [number, number]);
  return pointsToD(shifted);
}

export default function MountainTimeline() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [cardPos, setCardPos] = useState<{ x: number; y: number; side: 'left' | 'right'; below: boolean } | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndexMobile, setActiveIndexMobile] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const basePoints = buildMountainPoints();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsAnimated(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleMarkerEnter(i: number) {
    if (isMobile) return;
    const svgEl = svgRef.current;
    const wrapperEl = wrapperRef.current;
    if (!svgEl || !wrapperEl) return;

    const svgRect = svgEl.getBoundingClientRect();
    const wrapperRect = wrapperEl.getBoundingClientRect();

    const scaleX = svgRect.width / VIEW_W;
    const scaleY = svgRect.height / VIEW_H;

    // Marker position relative to the wrapper
    const peakX = (getPeakX(i) * scaleX) + (svgRect.left - wrapperRect.left);
    const peakY = (getPeakY(milestones[i].peakHeight) * scaleY) + (svgRect.top - wrapperRect.top);

    const side = peakX > wrapperRect.width * 0.6 ? 'left' : 'right';
    // If peak is in upper 40% of the wrapper, show card below marker
    const below = peakY < wrapperRect.height * 0.4;

    setCardPos({ x: peakX, y: peakY, side, below });
    setHoveredIndex(i);
  }

  const activeIndex = isMobile ? activeIndexMobile : hoveredIndex;
  const activeMilestone = activeIndex !== null ? milestones[activeIndex] : null;

  const baseD = pointsToD(basePoints) + ' Z';

  return (
    <div ref={wrapperRef} className="relative w-full">
      <style>{`
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="w-full overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full"
          style={{ minWidth: 560, display: 'block' }}
          aria-label="MARLO history mountain timeline"
        >
          <defs>
            <linearGradient id="mountain-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dde3ec" />
              <stop offset="100%" stopColor="#c8d1de" />
            </linearGradient>
            {milestones.map((_, i) => (
              <style key={i}>{`
                .marker-${i} {
                  opacity: 0;
                  ${isAnimated ? `animation: markerFadeIn 0.4s ease-out ${1.2 + i * 0.12}s forwards;` : ''}
                }
                @keyframes markerFadeIn {
                  from { opacity: 0; transform: scale(0.4); }
                  to   { opacity: 1; transform: scale(1); }
                }
              `}</style>
            ))}
          </defs>

          {/* Mountain fill */}
          <path d={baseD} fill="url(#mountain-fill)" opacity="0.7" />

          {/* Topographic contour lines */}
          {Array.from({ length: CONTOUR_LAYERS }).map((_, layer) => {
            const offsetY = layer * 13;
            const opacity = 1 - layer * (0.85 / CONTOUR_LAYERS);
            const strokeWidth = Math.max(0.4, 1.8 - layer * 0.2);
            const d = buildContourD(basePoints, offsetY);
            const totalLen = 2800;
            return (
              <path
                key={layer}
                d={d}
                fill="none"
                stroke="#1a3a5c"
                strokeWidth={strokeWidth}
                opacity={opacity}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={
                  isAnimated
                    ? {
                        strokeDasharray: totalLen,
                        strokeDashoffset: 0,
                        transition: `stroke-dashoffset 1.6s ease-out ${layer * 0.08}s`,
                      }
                    : {
                        strokeDasharray: totalLen,
                        strokeDashoffset: totalLen,
                      }
                }
              />
            );
          })}

          {/* Vertical connector lines from peak to label zone */}
          {milestones.map((m, i) => {
            const cx = getPeakX(i);
            const cy = getPeakY(m.peakHeight);
            return (
              <line
                key={`line-${i}`}
                x1={cx}
                y1={cy + 10}
                x2={cx}
                y2={BASELINE + 8}
                stroke="#1a3a5c"
                strokeWidth="0.6"
                strokeDasharray="3 3"
                opacity={isAnimated ? 0.3 : 0}
                style={{ transition: `opacity 0.4s ease ${1 + i * 0.1}s` }}
              />
            );
          })}

          {/* Marker dots */}
          {milestones.map((m, i) => {
            const cx = getPeakX(i);
            const cy = getPeakY(m.peakHeight);
            const isHov = hoveredIndex === i && !isMobile;
            return (
              <g
                key={`marker-${i}`}
                className={`marker-${i}`}
                onMouseEnter={() => handleMarkerEnter(i)}
                onMouseLeave={() => { setHoveredIndex(null); setCardPos(null); }}
                onClick={() => isMobile && setActiveIndexMobile(activeIndexMobile === i ? null : i)}
                style={{ cursor: 'pointer' }}
              >
                {/* Glow ring on hover */}
                {isHov && (
                  <circle cx={cx} cy={cy} r={14} fill="#2563eb" opacity={0.15} />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHov ? 9 : 7}
                  fill="#2563eb"
                  style={{ transition: 'r 0.15s ease' }}
                />
                <circle cx={cx} cy={cy} r={3.5} fill="white" />
              </g>
            );
          })}

          {/* Year labels */}
          {milestones.map((m, i) => {
            const cx = getPeakX(i);
            const isHov = hoveredIndex === i && !isMobile;
            return (
              <text
                key={`label-${i}`}
                x={cx}
                y={BASELINE + 22}
                textAnchor="middle"
                fontSize={i === 0 ? 9 : 11}
                fontWeight="600"
                fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                fill={isHov ? '#2563eb' : '#1a3a5c'}
                opacity={isAnimated ? 1 : 0}
                style={{ transition: `opacity 0.4s ease ${1.1 + i * 0.1}s, fill 0.15s ease` }}
              >
                {m.year}
              </text>
            );
          })}
        </svg>

      </div>

      {/* Floating hover card — desktop, positioned relative to wrapperRef */}
      {!isMobile && hoveredIndex !== null && cardPos && (
        <div
          className="pointer-events-none absolute z-20 w-72"
          style={{
            ...(cardPos.below
              ? { top: cardPos.y + 18 }
              : { top: cardPos.y - 16, transform: 'translateY(-100%)' }),
            ...(cardPos.side === 'right'
              ? { left: cardPos.x + 14 }
              : { right: `calc(100% - ${cardPos.x}px + 14px)` }),
            animation: 'cardFadeIn 0.2s ease-out both',
          }}
        >
          <div
            className="bg-white rounded-xl shadow-xl border p-4"
            style={{ borderColor: 'rgba(26,58,92,0.15)' }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#2563eb' }}>
              {milestones[hoveredIndex].year}
            </p>
            <ul className="space-y-2">
              {milestones[hoveredIndex].events.map((ev, j) => (
                <li key={j} className="flex gap-2 text-xs leading-snug" style={{ color: '#374151' }}>
                  <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {ev}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Mobile tap card */}
      {isMobile && activeMilestone && (
        <div
          className="mt-4 mx-2 bg-white rounded-xl shadow-lg border p-4"
          style={{ borderColor: 'rgba(26,58,92,0.15)' }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#2563eb' }}>
            {activeMilestone.year}
          </p>
          <ul className="space-y-2">
            {activeMilestone.events.map((ev, j) => (
              <li key={j} className="flex gap-2 text-xs leading-snug" style={{ color: '#374151' }}>
                <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500" />
                {ev}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
