/** Canonical production origin for MARLO landing. */
export const SITE_URL = 'https://marlo.cgiar.org';

export const SITE_NAME = 'MARLO';

export const DEFAULT_TITLE = 'MARLO | Research Management & Reporting Platform for CGIAR';

export const DEFAULT_DESCRIPTION =
  'MARLO (Managing Agricultural Research for Learning and Outcomes) helps CGIAR and research programs plan, track, and report results with structured workflows, data quality, and actionable insights.';

export const DEFAULT_OG_IMAGE = '/images/og-image.jpg';

export const SITE_KEYWORDS = [
  'MARLO',
  'CGIAR',
  'AICCRA',
  'research management platform',
  'agricultural research reporting',
  'MEL',
  'results-based management',
  'performance management',
  'PRMS',
  'innovation tracking',
  'OICR',
  'FAIR data',
].join(', ');

/** Indexable marketing routes (excludes API endpoints). */
export const SITEMAP_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/about', changefreq: 'monthly', priority: 0.8 },
  { path: '/contact', changefreq: 'monthly', priority: 0.9 },
  { path: '/faqs', changefreq: 'monthly', priority: 0.8 },
  { path: '/team', changefreq: 'monthly', priority: 0.7 },
  { path: '/whats-new', changefreq: 'weekly', priority: 0.7 },
] as const;

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalized, SITE_URL).href;
}

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: 'Managing Agricultural Research for Learning and Outcomes',
    url: SITE_URL,
    logo: absoluteUrl('/marlo-logo.png'),
    description: DEFAULT_DESCRIPTION,
    parentOrganization: {
      '@type': 'Organization',
      name: 'CGIAR',
      url: 'https://www.cgiar.org/',
    },
    sameAs: ['https://aiccra.marlo.cgiar.org'],
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en',
  };
}

export function softwareApplicationSchema() {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}/#software`,
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Research management and MEL platform',
    operatingSystem: 'Web',
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    offers: {
      '@type': 'Offer',
      url: absoluteUrl('/contact'),
      category: 'Demo request',
      description: 'Request a personalized demo of MARLO',
    },
    provider: { '@id': `${SITE_URL}/#organization` },
  };
}

export function webPageSchema(opts: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(opts.path)}#webpage`,
    url: absoluteUrl(opts.path),
    name: opts.title,
    description: opts.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#software` },
    inLanguage: 'en',
  };
}

export function faqPageSchema(
  faqs: ReadonlyArray<{ question: string; answer: string }>,
) {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl('/faqs')}#faqpage`,
    url: absoluteUrl('/faqs'),
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

export function buildJsonLdGraph(nodes: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}
