#!/usr/bin/env bash
# audit-tokens.sh — Verify CSS token contract: no raw hex color codes outside the allowlist.
#
# Regex matches exactly 3, 6, or 8 hex chars preceded by `#`.
# A 4-digit sequence like `#1042` (order/invoice number) does NOT match.
#
# Allowlisted paths (raw hex is intentional — see justifications below):
#
#   views/theme/common/email/**
#   src/data/sections/domain-common-email.showcase.ts
#     Email preview templates and their showcase data. Email clients do not support
#     CSS custom properties, so bg-[#f0f2f5] etc. are required for rendering
#     fidelity when templates are sent. Showcase data mirrors the template HTML.
#
#   modules/domain/common/auth/OAuthButtons.ejs
#   src/data/sections/domain-common-auth.showcase.ts
#     OAuth provider brand colors (#EA4335 Google, #5865F2 Discord, #00A4EF Microsoft).
#     Spec-mandated brand identity values — cannot be replaced with design-system tokens.
#
#   modules/domain/common/payment/CreditCardVisual.ejs
#   src/data/sections/domain-common-payment.showcase.ts
#     Payment card brand gradients (VISA, Mastercard, AMEX, etc.).
#     Official brand colors — cannot be replaced with design-system tokens.
#
#   modules/ui/MapView/partials/_popup.ejs
#   src/data/sections/ui-molecule-map.showcase.ts
#     Leaflet popup/tooltip innerHTML is built as a JS string; CSS classes and
#     custom properties cannot be used inside Leaflet's popup HTML API.
#
#   modules/domain/common/charts/Charts.ejs
#   src/data/sections/domain-common-charts.showcase.ts
#     Chart.js dataset options (borderColor etc.) require hex — the library
#     reads these values before the browser resolves CSS variables.
#
#   modules/ui/ColorPicker/ColorPicker.ejs
#   modules/ui/ColorPicker/partials/_inputs.ejs
#   src/data/sections/ui-molecule-pickers.showcase.ts
#     The swatch palette and hex input placeholder/default of a color-picker
#     component are, by definition, arbitrary colors the user can choose —
#     not design-system tokens.
#
#   src/registry/registry.ts
#     DESIGN_TOKENS: this *is* the token contract — the file that declares
#     what each --token-name resolves to. It must contain the hex values;
#     every other file in the audit exists to make sure they reference this
#     one instead of repeating themselves.
#
#   modules/domain/common/seo/SeoPreview.ejs
#     `text-[#1a0dab]` mimics Google's actual search-result link color so the
#     preview reads as a real SERP snippet. Spec-mandated for the same reason
#     as the OAuth/card brand colors above — it represents a third party's
#     real, fixed UI, not this design system's.

set -euo pipefail

cd "$(dirname "$0")/.."

SCAN_DIRS="views modules src"

# Matches exactly 3, 6, or 8 hex chars after `#`, not followed by another hex char.
# This avoids false positives on strings like `#1042` (order/invoice numbers).
HEX_PATTERN='#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-fA-F])'

ALLOWLIST=(
  "views/theme/common/email/"
  "src/data/sections/domain-common-email.showcase.ts"
  "modules/domain/common/auth/OAuthButtons.ejs"
  "src/data/sections/domain-common-auth.showcase.ts"
  "modules/domain/common/payment/CreditCardVisual.ejs"
  "src/data/sections/domain-common-payment.showcase.ts"
  "modules/ui/MapView/partials/_popup.ejs"
  "src/data/sections/ui-molecule-map.showcase.ts"
  "modules/domain/common/charts/Charts.ejs"
  "src/data/sections/domain-common-charts.showcase.ts"
  "modules/ui/ColorPicker/ColorPicker.ejs"
  "modules/ui/ColorPicker/partials/_inputs.ejs"
  "src/data/sections/ui-molecule-pickers.showcase.ts"
  "src/registry/registry.ts"
  "modules/domain/common/seo/SeoPreview.ejs"
)

violations=$(
  grep -rn -P "$HEX_PATTERN" \
    --include="*.ejs" \
    --include="*.ts" \
    $SCAN_DIRS \
    2>/dev/null || true
)

for path in "${ALLOWLIST[@]}"; do
  violations=$(echo "$violations" | grep -v "^$path" || true)
done

if [ -z "$violations" ]; then
  echo "✅  Token audit passed — no raw hex codes found outside the allowlist."
  exit 0
else
  echo "❌  Token audit FAILED — raw hex codes found outside the allowlist:"
  echo ""
  echo "$violations"
  echo ""
  echo "Fix: replace hex values with CSS token utilities (bg-primary, text-text-secondary, etc.)"
  echo "     or add the file to the allowlist in scripts/audit-tokens.sh with a justification."
  exit 1
fi
