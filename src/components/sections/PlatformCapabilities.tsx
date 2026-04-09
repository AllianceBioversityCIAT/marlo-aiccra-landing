import { useState } from 'react';
import { capabilityTabs } from '../../data/capabilities';

const icons: Record<string, string> = {
  map: `<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>`,
  'refresh-cw': `<polyline points="23,4 23,10 17,10"/><polyline points="1,20 1,14 7,14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>`,
  'file-text': `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/>`,
};

export default function PlatformCapabilities() {
  const [activeTab, setActiveTab] = useState(capabilityTabs[0].id);
  const current = capabilityTabs.find((t) => t.id === activeTab)!;

  return (
    <section id="capabilities" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: '#0d9488' }}
            >
              Core Platform Capabilities
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: '#111827' }}>
              Built for Every Stage of the Research Cycle
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>
              Three integrated modules working in harmony to support the full program lifecycle.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {capabilityTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={
                activeTab === tab.id
                  ? { background: '#1a3a5c', color: 'white' }
                  : { background: '#f3f4f6', color: '#4b5563' }
              }
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                dangerouslySetInnerHTML={{ __html: icons[tab.icon] }}
              />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          className="rounded-2xl p-8 lg:p-10"
          style={{ background: '#f3f4f6', border: '1px solid #e5e7eb' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left */}
            <div className="flex flex-col gap-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(37,99,235,0.1)' }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dangerouslySetInnerHTML={{ __html: icons[current.icon] }}
                />
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#111827' }}>
                  {current.label}
                </h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#6b7280' }}>
                  {current.description}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {current.checklistItems.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="shrink-0 mt-0.5"
                      >
                        <circle cx="12" cy="12" r="10" fill="#0d9488" />
                        <polyline
                          points="9,12 11,14 15,10"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm" style={{ color: '#374151' }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Builder mock */}
            <div
              className="rounded-xl p-6 bg-white"
              style={{ border: '1px solid #e5e7eb' }}
            >
              <p
                className="text-[11px] font-semibold tracking-widest uppercase mb-5"
                style={{ color: '#9ca3af' }}
              >
                {current.builderTitle}
              </p>

              <div className="flex flex-col gap-3 mb-6">
                {current.builderSteps.map((step) => (
                  <div
                    key={step.number}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg"
                    style={{
                      background: step.active ? 'rgba(37,99,235,0.05)' : '#f9fafb',
                      border: step.active ? '1px solid rgba(37,99,235,0.2)' : '1px solid #f3f4f6',
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: step.active ? '#2563eb' : '#d1d5db' }}
                    >
                      {step.number}
                    </div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: step.active ? '#1a3a5c' : '#6b7280' }}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Metric */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs" style={{ color: '#9ca3af' }}>
                    {current.metric.label}
                  </span>
                  <span className="text-xs font-bold" style={{ color: '#1a3a5c' }}>
                    {current.metric.value}
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background: '#e5e7eb' }}>
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width:
                        typeof current.metric.value === 'string' &&
                        current.metric.value.includes('%')
                          ? current.metric.value
                          : '100%',
                      background: 'linear-gradient(to right, #2563eb, #0d9488)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
