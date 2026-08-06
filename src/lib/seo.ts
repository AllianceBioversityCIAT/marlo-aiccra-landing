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

/**
 * Indexable marketing routes (excludes API endpoints).
 * `lastmod` is maintained by hand — bump it when a route's content meaningfully
 * changes. Search engines discount sitemaps whose lastmod is always "today".
 * `/whats-new` is the exception: its lastmod is computed at request time from
 * the newest release note (see sitemap.xml.ts).
 */
export const SITEMAP_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: 1.0, lastmod: '2026-07-16' },
  { path: '/about', changefreq: 'monthly', priority: 0.8, lastmod: '2026-07-22' },
  { path: '/contact', changefreq: 'monthly', priority: 0.9, lastmod: '2026-07-22' },
  { path: '/faqs', changefreq: 'monthly', priority: 0.8, lastmod: '2026-07-16' },
  { path: '/team', changefreq: 'monthly', priority: 0.7, lastmod: '2026-07-16' },
  { path: '/whats-new', changefreq: 'weekly', priority: 0.7, lastmod: null },
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
    // The acronym and the expanded name are both used in the wild; declaring
    // them lets search engines resolve either spelling to the same entity.
    alternateName: [
      'Managing Agricultural Research for Learning and Outcomes',
      'MARLO CGIAR',
    ],
    url: SITE_URL,
    // Pins the brand entity to the home page rather than to whichever URL a
    // crawler happens to like best — the whole point of the exercise.
    mainEntityOfPage: { '@id': `${SITE_URL}/#webpage` },
    logo: absoluteUrl('/marlo-logo.png'),
    description: DEFAULT_DESCRIPTION,
    parentOrganization: {
      '@type': 'Organization',
      name: 'CGIAR',
      url: 'https://www.cgiar.org/',
    },
    // `sameAs` is for other profiles of this same entity. The AICCRA host is a
    // deployment of the product, not another profile of the organization — it
    // is declared as `installUrl` on the SoftwareApplication node instead.
    sameAs: ['https://github.com/CCAFS/MARLO'],
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
    installUrl: 'https://aiccra.marlo.cgiar.org',
    description: DEFAULT_DESCRIPTION,
    offers: {
      '@type': 'Offer',
      url: absoluteUrl('/contact'),
      category: '1:1 request',
      description: 'Book a 1:1 with the MARLO technical team',
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
  path = '/faqs',
) {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(path)}#faqpage`,
    url: absoluteUrl(path),
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

export function breadcrumbListSchema(items: ReadonlyArray<{ name: string; path: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function aboutPageSchema(opts: { path: string }) {
  return {
    '@type': 'AboutPage',
    '@id': `${absoluteUrl(opts.path)}#aboutpage`,
    url: absoluteUrl(opts.path),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
  };
}

export function contactPageSchema(opts: { path: string }) {
  return {
    '@type': 'ContactPage',
    '@id': `${absoluteUrl(opts.path)}#contactpage`,
    url: absoluteUrl(opts.path),
    isPartOf: { '@id': `${SITE_URL}/#website` },
  };
}

export function collectionPageSchema(opts: { path: string; name: string; description: string }) {
  return {
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl(opts.path)}#collectionpage`,
    url: absoluteUrl(opts.path),
    name: opts.name,
    description: opts.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
  };
}

export function itemListSchema(
  items: ReadonlyArray<{ name: string; url?: string; description?: string }>,
) {
  return {
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? { url: item.url } : {}),
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

export function buildJsonLdGraph(nodes: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}
