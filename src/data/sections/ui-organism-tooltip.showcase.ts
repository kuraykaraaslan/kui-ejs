import type { ShowcaseItem } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const sourceCode = fs.readFileSync(path.join(process.cwd(), 'modules/ui/Tooltip.ejs'), 'utf-8');

const themeClassMap: Record<string, string> = {
  default: 'bg-surface-overlay text-text-primary border border-border',
  dark:    'bg-gray-900 text-white border-transparent',
  light:   'bg-white text-gray-900 border border-border shadow-md',
};

const placementClassMap: Record<string, string> = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  right:  'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowPlacementMap: Record<string, string> = {
  top:    'bottom-[-5px] left-1/2 -translate-x-1/2 border-t-0 border-l-0',
  bottom: 'top-[-5px] left-1/2 -translate-x-1/2 border-b-0 border-r-0',
  left:   'right-[-5px] top-1/2 -translate-y-1/2 border-l-0 border-b-0',
  right:  'left-[-5px] top-1/2 -translate-y-1/2 border-r-0 border-t-0',
};

const arrowThemeMap: Record<string, string> = {
  default: 'bg-surface-overlay',
  dark:    'bg-gray-900 border-transparent',
  light:   'bg-white',
};

function tooltipEl(opts: {
  trigger: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  theme?: 'default' | 'dark' | 'light';
  arrow?: boolean;
}) {
  const placement = opts.placement || 'top';
  const theme     = opts.theme || 'default';
  const tc        = themeClassMap[theme];
  const pc        = placementClassMap[placement];
  const ap        = arrowPlacementMap[placement];
  const at        = arrowThemeMap[theme];
  return `<span class="relative inline-flex items-center">
  <span>${opts.trigger}</span>
  <span role="tooltip" class="absolute z-[80] whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium shadow-md transition-opacity duration-150 pointer-events-none opacity-100 ${tc} ${pc}">
    ${opts.content}
    ${opts.arrow ? `<span aria-hidden="true" class="absolute w-2 h-2 rotate-45 border border-border ${ap} ${at}"></span>` : ''}
  </span>
</span>`;
}

const triggerBtn = (label: string) =>
  `<button type="button" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus border border-border text-text-primary hover:bg-surface-overlay px-3 py-1.5 text-sm">${label}</button>`;

const stage = (inner: string) =>
  `<div class="flex items-center justify-center gap-8 py-16 px-8">${inner}</div>`;

export function buildTooltipData(): ShowcaseItem[] {
  return [
    {
      id: 'tooltip',
      title: 'Tooltip',
      category: 'Organism',
      abbr: 'Tt',
      description: 'Short hint shown on hover and focus. Accessible via role="tooltip" + aria-describedby. Supports 4 placements, 3 themes, optional arrow, and configurable delay.',
      filePath: 'modules/ui/Tooltip.ejs',
      sourceCode,
      variants: [
        {
          title: 'Placements',
          previewHtml: stage(`
  ${tooltipEl({ trigger: triggerBtn('Top'), content: 'Top tooltip', placement: 'top' })}
  ${tooltipEl({ trigger: triggerBtn('Bottom'), content: 'Bottom tooltip', placement: 'bottom' })}
  ${tooltipEl({ trigger: triggerBtn('Right'), content: 'Right tooltip', placement: 'right' })}
`),
          code: `<%- include('modules/ui/Tooltip', { content: 'Top tooltip', placement: 'top', children: '<button>Top</button>' }) %>
<%- include('modules/ui/Tooltip', { content: 'Bottom tooltip', placement: 'bottom', children: '<button>Bottom</button>' }) %>
<%- include('modules/ui/Tooltip', { content: 'Right tooltip', placement: 'right', children: '<button>Right</button>' }) %>`,
          layout: 'stack',
        },
        {
          title: 'Themes',
          previewHtml: stage(`
  ${tooltipEl({ trigger: triggerBtn('Default'), content: 'Default theme', theme: 'default' })}
  ${tooltipEl({ trigger: triggerBtn('Dark'), content: 'Dark theme', theme: 'dark' })}
  ${tooltipEl({ trigger: triggerBtn('Light'), content: 'Light theme', theme: 'light' })}
`),
          code: `<%- include('modules/ui/Tooltip', { content: 'Default theme', theme: 'default', children: '<button>Default</button>' }) %>
<%- include('modules/ui/Tooltip', { content: 'Dark theme', theme: 'dark', children: '<button>Dark</button>' }) %>
<%- include('modules/ui/Tooltip', { content: 'Light theme', theme: 'light', children: '<button>Light</button>' }) %>`,
          layout: 'stack',
        },
        {
          title: 'With arrow',
          previewHtml: stage(`
  ${tooltipEl({ trigger: triggerBtn('Top + arrow'), content: 'Has an arrow', placement: 'top', arrow: true })}
  ${tooltipEl({ trigger: triggerBtn('Bottom + arrow'), content: 'Has an arrow', placement: 'bottom', arrow: true })}
`),
          code: `<%- include('modules/ui/Tooltip', {
  content: 'Has an arrow',
  placement: 'top',
  arrow: true,
  children: '<button>Top + arrow</button>'
}) %>`,
          layout: 'stack',
        },
        {
          title: 'On an icon button',
          previewHtml: stage(
            tooltipEl({
              trigger: '<button type="button" aria-label="Settings" class="inline-flex items-center justify-center h-9 w-9 rounded-md border border-border text-text-secondary hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"><i class="fa-solid fa-gear" aria-hidden="true"></i></button>',
              content: 'Open settings',
              placement: 'top',
              theme: 'dark',
            })
          ),
          code: `<%- include('modules/ui/Tooltip', {
  content: 'Open settings',
  placement: 'top',
  theme: 'dark',
  children: '<button aria-label="Settings"><i class="fa-solid fa-gear"></i></button>'
}) %>`,
          layout: 'stack',
        },
      ],
    },
  ];
}
