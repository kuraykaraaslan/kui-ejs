import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/app/OnboardingWizard.ejs'), 'utf-8');

export function buildOnboardingWizardData(): ShowcaseItem[] {
  return [
    {
      id: 'onboarding-wizard',
      title: 'OnboardingWizard',
      category: 'App',
      abbr: 'OW',
      since: '2026-05',
      description: 'Multi-step onboarding flow with dots/bar progress, optional skip, and page or modal presentation. Server-rendered with ?step=N querystring.',
      filePath: 'modules/app/OnboardingWizard.ejs',
      sourceCode,
      variants: [
        {
          title: 'Dots indicator (page mode)',
          layout: 'stack',
          previewHtml: `<div class="mx-auto w-full max-w-2xl rounded-xl border border-border bg-surface-raised p-6 shadow-sm">
  <div class="flex flex-col gap-6">
    <div class="flex items-center gap-3">
      <span class="text-xs uppercase tracking-wide text-text-disabled font-medium shrink-0">1 / 3</span>
      <div class="flex-1">
        <div class="flex items-center gap-2" role="progressbar" aria-valuemin="0" aria-valuemax="3" aria-valuenow="1">
          <span class="h-2 rounded-full transition-all w-6 bg-primary" aria-hidden="true"></span>
          <span class="h-2 rounded-full transition-all w-2 bg-surface-sunken" aria-hidden="true"></span>
          <span class="h-2 rounded-full transition-all w-2 bg-surface-sunken" aria-hidden="true"></span>
        </div>
      </div>
    </div>
    <div>
      <h2 class="text-lg font-semibold text-text-primary">Welcome</h2>
      <p class="mt-1 text-sm text-text-secondary">Let's set up your workspace quickly.</p>
    </div>
    <div class="min-h-[8rem]"><p class="text-sm text-text-secondary leading-relaxed">We have a few questions for a personalized experience. Three steps in total.</p></div>
    <div class="flex items-center justify-between gap-3 pt-4 border-t border-border">
      <div></div>
      <div class="flex items-center gap-2">
        <button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium bg-transparent text-text-primary hover:bg-surface-overlay px-4 py-2 text-sm">
          <i class="fa-solid fa-xmark" style="font-size: 0.875rem;" aria-hidden="true"></i>
          Skip
        </button>
        <button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">
          Next
          <i class="fa-solid fa-arrow-right" style="font-size: 0.875rem;" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/OnboardingWizard', {
  steps: onboardingSteps,
  current: 0,
  indicator: 'dots',
  allowSkip: true
}) %>`,
        },
        {
          title: 'Progress bar indicator',
          layout: 'stack',
          previewHtml: `<div class="mx-auto w-full max-w-2xl rounded-xl border border-border bg-surface-raised p-6 shadow-sm">
  <div class="flex flex-col gap-6">
    <div class="flex items-center gap-3">
      <span class="text-xs uppercase tracking-wide text-text-disabled font-medium shrink-0">2 / 4</span>
      <div class="flex-1">
        <div class="h-1 w-full rounded-full bg-surface-sunken overflow-hidden" role="progressbar" aria-valuemin="0" aria-valuemax="4" aria-valuenow="2">
          <div class="h-full bg-primary transition-[width] duration-300" style="width: 50%;"></div>
        </div>
      </div>
    </div>
    <div>
      <h2 class="text-lg font-semibold text-text-primary">Invite Members</h2>
    </div>
    <div class="min-h-[8rem]"><p class="text-sm text-text-secondary">Invite your team members.</p></div>
    <div class="flex items-center justify-between gap-3 pt-4 border-t border-border">
      <div>
        <button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium border border-border text-text-primary hover:bg-surface-overlay px-4 py-2 text-sm">
          <i class="fa-solid fa-arrow-left" style="font-size: 0.875rem;" aria-hidden="true"></i>
          Back
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium bg-primary text-primary-fg hover:bg-primary-hover px-4 py-2 text-sm">
          Next
          <i class="fa-solid fa-arrow-right" style="font-size: 0.875rem;" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </div>
</div>`,
          code: `<%- include('modules/app/OnboardingWizard', {
  steps: onboardingSteps,
  current: 1,
  indicator: 'bar',
  allowSkip: false
}) %>`,
        },
      ],
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: ['role="progressbar"'],
      },
    },
  ];
}
