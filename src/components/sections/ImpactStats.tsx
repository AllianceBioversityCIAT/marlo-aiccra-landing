import {
  Users,
  Globe,
  Building2,
  BookOpen,
  CalendarDays,
  FileText,
  Lightbulb,
  Target,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Stat {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
}

const stats: Stat[] = [
  {
    icon: Users,
    title: 'Users',
    value: '1,380+',
    description:
      'Registered users who have engaged with and made use of the platform, from researchers to policymakers and agricultural specialists.',
  },
  {
    icon: Globe,
    title: 'Countries',
    value: '145+',
    description:
      'Countries where results reported through the platform have had a presence and impact.',
  },
  {
    icon: Building2,
    title: 'Organizations',
    value: '2,035+',
    description:
      'Number of organizations MARLO has supported in reporting their results and outcomes.',
  },
  {
    icon: BookOpen,
    title: 'Programs',
    value: 'CGIAR, CRP & AICCRA',
    description:
      'CGIAR research programs and initiatives managed and monitored within MARLO throughout their lifecycle.',
  },
  {
    icon: CalendarDays,
    title: 'Years Supporting CGIAR Reporting',
    value: 'Since 2017',
    description:
      "Continuously supporting CGIAR's results reporting cycle since 2017, evolving with each phase of the initiative.",
  },
  {
    icon: FileText,
    title: 'Deliverables',
    value: '32,780+',
    description:
      'Articles, datasets, and reports capturing the tangible knowledge outputs reported through CGIAR programs worldwide.',
  },
  {
    icon: Lightbulb,
    title: 'Innovations',
    value: '2,370+',
    description:
      'New or significantly improved technologies, methods, and practices emerging from CGIAR research across programs and regions.',
  },
  {
    icon: Target,
    title: 'OICRs',
    value: '1,955+',
    description:
      'Documented cases where research has contributed to real changes in policy, practice, and outcomes on the ground.',
  },
];

export default function ImpactStats() {
  return (
    <section
      id="impact-stats"
      className="relative py-24 overflow-hidden"
      style={{
        backgroundImage: 'url(/images/impact-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: '#4ade80' }}
          >
            Real Results
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Impact at a Glance</h2>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.75)' }}>
            MARLO platform impact across CGIAR programs worldwide
          </p>
        </div>

        {/* Grid — rows of 3, last row of 2 centered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            // Rows of 3 (span 2 of 6 cols). Last row of 2: offset to center (cols 2–3 and 4–5)
            const colClass =
              index < stats.length - 2
                ? 'lg:col-span-2'
                : index === stats.length - 2
                  ? 'lg:col-span-2 lg:col-start-2'
                  : 'lg:col-span-2';

            return (
              <div
                key={index}
                className={`rounded-2xl p-6 bg-white ${colClass}`}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                {/* Top row: icon + title + value */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: '#d1fae5' }}
                  >
                    <Icon size={18} style={{ color: '#059669' }} strokeWidth={2} />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="text-xs font-medium leading-tight mb-1"
                      style={{ color: '#6b7280' }}
                    >
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold leading-none" style={{ color: '#059669' }}>
                      {stat.value}
                    </p>
                  </div>
                </div>

                {/* Description — always visible */}
                <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
