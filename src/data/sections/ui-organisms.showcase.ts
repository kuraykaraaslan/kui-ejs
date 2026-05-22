import type { ShowcaseItem } from '../../types';
import { buildOrganismContentData }  from './ui-organism-content.showcase';
import { buildOrganismNavData }      from './ui-organism-nav.showcase';
import { buildOrganismOverlayData }  from './ui-organism-overlay.showcase';
import { buildOrganismDataData }     from './ui-organism-data.showcase';
import { buildMapData }              from './ui-molecule-map.showcase';
import { buildOrganismMediaData }    from './ui-organism-media.showcase';
import { buildSliderData }              from './ui-organism-slider.showcase';
import { buildStatCardData }            from './ui-organism-stat-card.showcase';
import { buildTabButtonData }           from './ui-organism-tab-button.showcase';
import { buildViewToggleData }          from './ui-organism-view-toggle.showcase';
import { buildEmptyStateData }          from './ui-organism-empty-state.showcase';
import { buildTooltipData }             from './ui-organism-tooltip.showcase';
import { buildDropdownMenuData }        from './ui-organism-dropdown-menu.showcase';
import { buildPopoverData }             from './ui-organism-popover.showcase';
import { buildAdvancedDataTableData }   from './ui-organism-advanced-data-table.showcase';
import { buildServerDataTableData }     from './ui-organism-server-data-table.showcase';
import { buildTreeViewData }            from './ui-organism-tree-view.showcase';
import { buildContentScoreBarData }     from './ui-organism-content-score-bar.showcase';
import { buildPageHeaderData }          from './ui-organism-page-header.showcase';

export function buildOrganismsData(): ShowcaseItem[] {
  return [
    ...buildOrganismContentData(),
    ...buildOrganismNavData(),
    ...buildOrganismOverlayData(),
    ...buildOrganismDataData(),
    ...buildMapData(),
    ...buildOrganismMediaData(),
    ...buildSliderData(),
    ...buildStatCardData(),
    ...buildTabButtonData(),
    ...buildViewToggleData(),
    ...buildEmptyStateData(),
    ...buildTooltipData(),
    ...buildDropdownMenuData(),
    ...buildPopoverData(),
    ...buildAdvancedDataTableData(),
    ...buildServerDataTableData(),
    ...buildTreeViewData(),
    ...buildContentScoreBarData(),
    ...buildPageHeaderData(),
  ];
}
