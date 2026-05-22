import type { ShowcaseItem } from '../../types';
import { buildButtonData }      from './ui-atom-button.showcase';
import { buildButtonGroupData } from './ui-atom-button-group.showcase';
import { buildBadgeData }       from './ui-atom-badge.showcase';
import { buildAvatarData }      from './ui-atom-avatar.showcase';
import { buildSpinnerData }     from './ui-atom-spinner.showcase';
import { buildSkeletonData }    from './ui-atom-skeleton.showcase';
import { buildSkipLinkData }    from './ui-atom-skip-link.showcase';
import { buildBrandLogoData }   from './ui-atom-brand-logo.showcase';
import { buildStarRatingData }  from './ui-atom-star-rating.showcase';
import { buildToggleData }      from './ui-atom-toggle.showcase';
import { buildCheckboxData }    from './ui-atom-checkbox.showcase';
import { buildInputData }       from './ui-atom-input.showcase';
import { buildTextareaData }    from './ui-atom-textarea.showcase';

export function buildAtomsData(): ShowcaseItem[] {
  return [
    ...buildButtonData(),
    ...buildButtonGroupData(),
    ...buildBadgeData(),
    ...buildAvatarData(),
    ...buildSpinnerData(),
    ...buildSkeletonData(),
    ...buildSkipLinkData(),
    ...buildBrandLogoData(),
    ...buildStarRatingData(),
    ...buildToggleData(),
    ...buildCheckboxData(),
    ...buildInputData(),
    ...buildTextareaData(),
  ];
}
