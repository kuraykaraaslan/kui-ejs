import type { ShowcaseItem } from '../../types';
import { buildAppShellData }              from './app-shell.showcase';
import { buildAppNavData }                from './app-nav.showcase';
import { buildAppUserData }               from './app-user.showcase';
import { buildAppFormData }               from './app-form.showcase';
import { buildAppContentData }            from './app-content.showcase';
import { buildAppAccessibilityKitData }   from './app-accessibility-kit.showcase';
import { buildAppDrawerData }             from './app-drawer.showcase';
import { buildAppFormFieldData }          from './app-form-field.showcase';
import { buildAppNotificationSystemData } from './app-notification-system.showcase';
import { buildSectionCardData }           from './app-section-card.showcase';
import { buildInlineAlertData }           from './app-inline-alert.showcase';
import { buildStepShellData }             from './app-step-shell.showcase';
import { buildAppBreadcrumbsData }        from './app-breadcrumbs.showcase';
import { buildAppFooterData }             from './app-footer.showcase';
import { buildThemeSwitcherData }         from './app-theme-switcher.showcase';
import { buildAppRichTextEditorData }     from './app-rich-text-editor.showcase';
import { buildAppCodeEditorData }         from './app-code-editor.showcase';
import { buildContextMenuData }           from './app-context-menu.showcase';
import { buildImageGalleryData }          from './app-image-gallery.showcase';

export function buildAppPatternsData(): ShowcaseItem[] {
  return [
    ...buildAppShellData(),
    ...buildAppNavData(),
    ...buildAppUserData(),
    ...buildAppFormData(),
    ...buildAppContentData(),
    ...buildAppAccessibilityKitData(),
    ...buildAppDrawerData(),
    ...buildAppFormFieldData(),
    ...buildAppNotificationSystemData(),
    ...buildSectionCardData(),
    ...buildInlineAlertData(),
    ...buildStepShellData(),
    ...buildAppBreadcrumbsData(),
    ...buildAppFooterData(),
    ...buildThemeSwitcherData(),
    ...buildAppRichTextEditorData(),
    ...buildAppCodeEditorData(),
    ...buildContextMenuData(),
    ...buildImageGalleryData(),
  ];
}
