export type FaqItem = {
  question: string;
  answer: string;
};

/**
 * Short FAQ set rendered on the home page. Shared with the home `FAQPage`
 * structured data so the markup and the schema can never drift apart —
 * Google discards FAQ rich results whose answers are not visible on the page.
 */
export const homeFaqs: FaqItem[] = [
  {
    question: 'What type of organizations is MARLO designed for?',
    answer:
      'MARLO is designed for international programs, research initiatives, NGOs, and organizations managing complex, multi-stakeholder reporting processes.',
  },
  {
    question: 'Can MARLO be adapted to different frameworks?',
    answer:
      'Yes, MARLO is flexible and can be aligned with frameworks such as PRMS, donor requirements, and custom reporting structures.',
  },
  {
    question: 'Does MARLO integrate with other systems?',
    answer:
      'Yes, MARLO can integrate with existing tools and data sources depending on project needs.',
  },
];

/** Full FAQ set used on `/faqs` and FAQPage structured data. */
export const extendedFaqs: FaqItem[] = [
  {
    question: 'What makes MARLO different from other reporting tools?',
    answer:
      'MARLO is specifically designed for complex programs, focusing on structured workflows, data quality, and alignment with frameworks like PRMS. Unlike generic tools, it addresses the full lifecycle of program reporting — from planning to outcome tracking — within a single platform.',
  },
  {
    question: 'What type of organizations is MARLO designed for?',
    answer:
      'MARLO is designed for international programs, research initiatives, NGOs, and organizations managing complex, multi-stakeholder reporting processes.',
  },
  {
    question: 'Can MARLO support multi-country programs?',
    answer:
      'Yes, MARLO is built to manage distributed teams and reporting across regions. It handles multi-country, multi-partner program structures with consistent data standards and centralized oversight.',
  },
  {
    question: 'Can MARLO be adapted to different frameworks?',
    answer:
      'Yes, MARLO is flexible and can be aligned with frameworks such as PRMS, donor requirements, and custom reporting structures.',
  },
  {
    question: 'Does MARLO integrate with other systems?',
    answer:
      'Yes, MARLO can integrate with existing tools and data sources depending on project needs.',
  },
  {
    question: 'How secure is the platform?',
    answer:
      "MARLO includes role-based access control and secure data management practices. Access to data is governed by permissions aligned to each user's role within the program, ensuring sensitive information remains protected.",
  },
  {
    question: 'Can the platform scale with program growth?',
    answer:
      'Yes, MARLO is designed to scale as programs expand in size and complexity. Whether your program grows in partners, geographies, or reporting requirements, the platform adapts without requiring structural changes.',
  },
  {
    question: 'What kind of support is provided?',
    answer:
      'The team provides onboarding, training, and continuous support based on project needs. From initial setup to advanced configuration, the MARLO team works closely with your organization throughout implementation.',
  },
];
