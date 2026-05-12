import { useState } from 'react';
import { ArrowRight, CheckCircle, Activity, Loader2 } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

const BENEFITS = [
  'See how MARLO handles complex multi-level reporting',
  'Configure indicators, milestones, and evidence workflows',
  'Explore BI dashboards and outcome reporting tools',
  'Get answers directly from the team that built it',
];

const inputBase =
  'w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all';

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold" style={{ color: '#374151' }}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      organization: (form.elements.namedItem('organization') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      role: (form.elements.namedItem('role') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(json.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  }

  const focusStyle = {
    borderColor: '#2563eb',
    boxShadow: '0 0 0 3px rgba(37,99,235,0.12)',
  };
  const blurStyle = { borderColor: '#d1d5db', boxShadow: 'none' };

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden py-20"
      style={{ background: '#012E4A' }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left column */}
          <div className="flex flex-col gap-8 pt-4">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold w-fit"
              style={{
                background: 'rgba(37,99,235,0.2)',
                color: '#93c5fd',
                border: '1px solid rgba(37,99,235,0.3)',
              }}
            >
              <Activity size={12} />
              MARLO PLATFORM
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Book a 1:1 with our
              <br />
              <em className="not-italic" style={{ color: '#22D3EE' }}>
                program experts
              </em>
            </h1>

            <p className="text-base lg:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Request a personalized demo to explore how MARLO can support your program. Our team
              will walk you through the platform and answer your questions.
            </p>

            <ul className="flex flex-col gap-4">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle
                    size={18}
                    className="shrink-0 mt-0.5"
                    style={{ color: '#22D3EE' }}
                  />
                  <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
              {status === 'success' ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <CheckCircle size={48} style={{ color: '#16a34a' }} />
                  <h2 className="text-xl font-bold" style={{ color: '#0f2a47' }}>
                    Request received!
                  </h2>
                  <p className="text-sm" style={{ color: '#6b7280' }}>
                    Thanks for reaching out. Our team will get back to you shortly to schedule your
                    personalized demo.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-1 mb-7">
                    <h2 className="text-xl font-bold" style={{ color: '#0f2a47' }}>
                      Get a personalized walkthrough
                    </h2>
                    <p className="text-sm" style={{ color: '#6b7280' }}>
                      Fill in your details so we can tailor the demo to your requirements.
                    </p>
                  </div>

                  {status === 'error' && (
                    <div
                      className="mb-5 px-4 py-3 rounded-lg text-sm"
                      style={{
                        background: '#fef2f2',
                        color: '#b91c1c',
                        border: '1px solid #fecaca',
                      }}
                    >
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                    <Field id="name" label="Name" required>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        required
                        className={inputBase}
                        style={blurStyle}
                        onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                        onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                      />
                    </Field>

                    <Field id="organization" label="Organization" required>
                      <input
                        id="organization"
                        name="organization"
                        type="text"
                        placeholder="Your organization or institution"
                        required
                        className={inputBase}
                        style={blurStyle}
                        onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                        onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                      />
                    </Field>

                    <Field id="email" label="Email" required>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your business email"
                        required
                        className={inputBase}
                        style={blurStyle}
                        onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                        onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                      />
                    </Field>

                    <Field id="role" label="Role">
                      <input
                        id="role"
                        name="role"
                        type="text"
                        placeholder="Your role or job title"
                        className={inputBase}
                        style={blurStyle}
                        onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                        onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                      />
                    </Field>

                    <Field id="message" label="Message">
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        placeholder="Tell us what you'd like to explore or any specific questions you have (optional)"
                        className={`${inputBase} resize-none`}
                        style={blurStyle}
                        onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                        onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                      />
                    </Field>

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#2563eb' }}
                      onMouseOver={(e) => {
                        if (status !== 'loading')
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1d4ed8';
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2563eb';
                      }}
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Enviando…
                        </>
                      ) : (
                        <>
                          Request a Demo
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
