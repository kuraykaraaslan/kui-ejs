# views/theme/common — Common Theme

Cross-domain pages used as scaffolding by every vertical: auth flows, account management, cart, checkout, transactional email templates, error pages.

## Files

```
index.ejs         not-found.ejs

account/          _nav.ejs, _nav-close.ejs, addresses.ejs, orders.ejs,
                  payment-methods.ejs, profile.ejs, settings.ejs
auth/             forgot-password.ejs, login.ejs, register.ejs,
                  reset-password.ejs, two-factor.ejs, verify-email.ejs
cart/             index.ejs
email/            _footer.ejs, _preview-bar.ejs, index.ejs,
                  auth/, billing/, marketing/, notification/, order/, support/, system/
payment/          checkout.ejs, index.ejs
```

## Parity

Shared with NextJS: yes — counterpart is `/home/kuray/01_NextJS_Components/app/theme/common/`. Layouts, copy, and rendered DOM must remain in sync.

## Conventions

1. **Layout** — `layouts/main` for showcase-framed demo, `layouts/blank` for email previews and standalone auth screens.
2. **Header destructure** — `<% const { user, form, errors = {}, ... } = locals; %>` at the top of every view.
3. **Icons** — Font Awesome: `<i class="fa-solid fa-user" aria-hidden="true"></i>`.
4. **React state → vanilla IIFE** — password reveal, OAuth modal, tab switches all rendered as scoped `(function(){ ... })()` blocks.
5. **Shared Tailwind tokens** — `bg-surface-raised`, `text-text-primary`, `border-border-focus`; never raw hex.
6. **Compose** — auth/account/cart/payment partials come from `modules/domain/common/<sub>/`. Email templates use inline-safe tokens for client compatibility.
7. **`_nav.ejs` underscore-prefixed** partials are theme-scoped includes (not routes).

## See also

- Repo conventions: [`/home/kuray/02_EJS_Components/AGENTS.md`](../../../AGENTS.md)
- Domain partials consumed: [`/home/kuray/02_EJS_Components/modules/domain/common/`](../../../modules/domain/common/)
- Parity contract & pixel-perfect rule: `../../../../00_Config_and_AI_Rules`
