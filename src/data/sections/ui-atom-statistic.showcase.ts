import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

const statisticPath   = path.join(process.cwd(), 'modules/ui/Statistic.ejs');
const statisticSource = fs.readFileSync(statisticPath, 'utf-8');

function renderStatistic(locals: Record<string, unknown>): string {
  return ejs.render(statisticSource, locals, { filename: statisticPath });
}

const wrap = (inner: string) => `<div class="flex flex-wrap gap-8 p-2">${inner}</div>`;

export function buildStatisticData(): ShowcaseItem[] {
  return [
    {
      id: 'statistic',
      title: 'Statistic',
      category: 'Atom',
      abbr: 'St',
      description:
        'Bare KPI number with label, no card chrome — see StatCard for the card-wrapped sibling. Supports numeric `precision`, HTML `prefix`/`suffix`, an up/down `trend` indicator, and a pulsing skeleton via `loading`.',
      filePath: 'modules/ui/Statistic.ejs',
      sourceCode: statisticSource,
      since: '2026-09',
      variants: [
        {
          title: 'Basic + trend',
          previewHtml: wrap(
            renderStatistic({ label: 'Active users', value: 8420 }) +
            renderStatistic({ label: 'Revenue', value: 128400, precision: 2, prefix: '$', trend: 'up', trendValue: '+12.4%' }) +
            renderStatistic({ label: 'Churn rate', value: 3.1, precision: 1, suffix: '%', trend: 'down', trendValue: '-0.6%' })
          ),
          code: `<%- include('modules/ui/Statistic', {
  label: 'Revenue',
  value: 128400,
  precision: 2,
  prefix: '$',
  trend: 'up',
  trendValue: '+12.4%',
}) %>`,
        },
        {
          title: 'Loading',
          previewHtml: wrap(
            renderStatistic({ label: 'Active users', loading: true }) +
            renderStatistic({ label: 'Revenue', loading: true })
          ),
          code: `<%- include('modules/ui/Statistic', {
  label: 'Active users',
  loading: true,
}) %>`,
        },
      ],
    },
  ];
}
