# Legal pages, cookie banner, and consent

Add three public policy pages, a site-wide cookie consent banner, footer links, and a privacy consent checkbox on the feedback/contact form. Entity details used throughout: **Intervixa AI**, support@intervixa.online, Noida, Uttar Pradesh, India. Grievance Officer is listed generically with the support email.

## New pages

Public, indexable routes with their own `<Seo>` metadata (title, description, canonical, JSON-LD `WebPage`) and a shared layout (navbar + footer + readable prose column, responsive):

- `/privacy-policy` — data collected (account, resume text, usage), how it is used (AI features, job matching), third-party processors (cloud backend, AI provider, email/voice services), storage and retention, user rights under India's DPDP Act 2023 (access, correction, erasure, grievance redressal), children's data, security, contact and Grievance Officer block, "last updated" date.
- `/terms-and-conditions` — eligibility, account rules, subscription/launch-offer terms and payment/refund statement, acceptable use, AI output disclaimer (no guarantee of job placement or interview outcomes), intellectual property, third-party links, limitation of liability, termination, governing law (India, courts of Noida/Uttar Pradesh), contact.
- `/cookie-policy` — what cookies are, categories used (strictly necessary: auth/session/theme; preference; analytics), how to change the choice via the banner or browser settings, contact.

Copy is generic-but-accurate boilerplate for an Indian tech SaaS — no invented certifications, audits, or compliance claims.

## Cookie banner

- Bottom-fixed, responsive card rendered app-wide, shown only when no stored choice exists.
- Buttons: **Accept All**, **Reject Non-Essential**, **Manage Preferences**.
- Manage Preferences opens a dialog with toggles: Strictly Necessary (always on, disabled), Preferences, Analytics — plus Save Preferences.
- Choice is stored in `localStorage` with a version and timestamp. Consent is recorded only; no scripts are gated today, and the stored value is shaped so gating can be added later.
- Banner links to the Cookie Policy and Privacy Policy.
- A "Cookie preferences" footer link reopens the dialog after dismissal.

## Consent checkbox

- Feedback / suggestion form (`/modules/feedback`) gets a required checkbox: "I agree to the Privacy Policy and Terms & Conditions", with inline links. Submit stays disabled until it is checked.
- Same pattern applied to any other user-submitted form if one exists on the public site.

## Footer and discovery

- Footer gains a legal link row: Privacy Policy, Terms & Conditions, Cookie Policy, Cookie preferences (alongside the existing guide links and social icons).
- The three policy routes are added to `scripts/generate-sitemap.ts` (regenerates `public/sitemap.xml`) at low priority, yearly changefreq.

## Technical notes

- New files: `src/pages/legal/PrivacyPolicy.tsx`, `TermsAndConditions.tsx`, `CookiePolicy.tsx`, a shared `src/components/legal/LegalPageLayout.tsx`, `src/components/CookieConsent.tsx`, and a small `src/lib/cookie-consent.ts` helper (read/write/subscribe to the stored choice).
- Routes registered in `src/App.tsx` above the catch-all; `CookieConsent` mounted once inside `BrowserRouter`.
- Existing shadcn `Dialog`, `Switch`, `Checkbox`, and `Button` components are reused; all styling uses existing semantic design tokens so light and dark modes both work.
- No backend or database changes.
