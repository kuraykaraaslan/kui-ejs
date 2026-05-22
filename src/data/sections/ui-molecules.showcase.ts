import type { ShowcaseItem } from '../../types';
import { buildMoleculeTextData }      from './ui-molecule-text.showcase';
import { buildMoleculeSelectionData } from './ui-molecule-selection.showcase';
import { buildMoleculePickersData }   from './ui-molecule-pickers.showcase';
import { buildMultiSelectData }       from './ui-molecule-multi-select.showcase';
import { buildComboBoxData }          from './ui-molecule-combo-box.showcase';
import { buildDateRangePickerData }   from './ui-molecule-date-range-picker.showcase';
import { buildTagInputData }          from './ui-molecule-tag-input.showcase';

// NextJS molecule order:
// input, checkbox, radio-group, select, multi-select, combo-box, textarea,
// search-bar, toggle, date-picker, date-range-picker, checkbox-group,
// tag-input, file-input
//
// Existing builders bundle items, so we slot the new single-item builders
// between them to keep the sidebar order aligned with NextJS:
//   text       → input, checkbox, textarea, search-bar, toggle
//   selection  → select, radio-group, checkbox-group
//   pickers    → date-picker, file-input
//
// The 4 new builders sit between selection and pickers in the new order.
export function buildMoleculesData(): ShowcaseItem[] {
  return [
    ...buildMoleculeTextData(),
    ...buildMoleculeSelectionData(),
    ...buildMultiSelectData(),
    ...buildComboBoxData(),
    ...buildDateRangePickerData(),
    ...buildTagInputData(),
    ...buildMoleculePickersData(),
  ];
}
