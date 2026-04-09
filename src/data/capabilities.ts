export interface TabData {
  id: string;
  label: string;
  icon: string;
  description: string;
  checklistItems: string[];
  builderTitle: string;
  builderSteps: Array<{ number: number; label: string; active?: boolean }>;
  metric: { label: string; value: string };
}

export const capabilityTabs: TabData[] = [
  {
    id: 'planning',
    label: 'Outcome-Focused Planning',
    icon: 'map',
    description:
      'Define portfolios, map activities to impact pathways, and align deliverables with measurable outcomes across all research clusters.',
    checklistItems: [
      'Define core, co-funded, and bilateral portfolios',
      'Map activities to impact pathways and geographic targets',
      'Align deliverables with measurable outcomes',
    ],
    builderTitle: 'IMPACT PATHWAY BUILDER',
    builderSteps: [
      { number: 1, label: 'Strategic Outcome', active: true },
      { number: 2, label: 'Intermediate Outcome' },
      { number: 3, label: 'Output' },
      { number: 4, label: 'Activity' },
    ],
    metric: { label: 'Cycle Completion', value: '91%' },
  },
  {
    id: 'management',
    label: 'Adaptive Management',
    icon: 'refresh-cw',
    description:
      'Track activities in real time, document planning adjustments, and reflect on strategic shifts with full audit trails across clusters.',
    checklistItems: [
      'Track activities, milestones, and deliverables in real time',
      'Document planning adjustments and strategic shifts',
      'Maintain full audit trails across all clusters',
    ],
    builderTitle: 'ACTIVITY TRACKER',
    builderSteps: [
      { number: 1, label: 'Plan Activities', active: true },
      { number: 2, label: 'Monitor Progress' },
      { number: 3, label: 'Review & Adjust' },
      { number: 4, label: 'Document Changes' },
    ],
    metric: { label: 'Activities On Track', value: '87%' },
  },
  {
    id: 'reporting',
    label: 'Results-Based Reporting',
    icon: 'file-text',
    description:
      'Generate structured reports, synthesize insights at cluster and portfolio levels, and support donor communication with evidence-based narratives.',
    checklistItems: [
      'Generate structured cluster and portfolio reports',
      'Synthesize insights across reporting cycles',
      'Support donor communication with evidence narratives',
    ],
    builderTitle: 'REPORT BUILDER',
    builderSteps: [
      { number: 1, label: 'Select Portfolio', active: true },
      { number: 2, label: 'Aggregate Data' },
      { number: 3, label: 'Draft Narrative' },
      { number: 4, label: 'Publish Report' },
    ],
    metric: { label: 'Reports Submitted', value: '24/24' },
  },
];
