# SEO & Traffic Growth Plan for Intervixa AI

## Current State

- **Technical SEO**: Mostly solid. Homepage is indexed by Google, sitemap and robots.txt are configured, metadata is unique, structured data is in place.
- **Search Console**: 0 clicks, ~14 impressions, average position 81.4. The site is indexed but not ranking for anything with volume yet.
- **Semrush**: No measurable ranking visibility for `intervixa.online` in India.
- **Content**: 12 career modules exist but most are behind auth (`noindex`) and not reachable by Google.
- **Two active SEO findings**:
  1. Placeholder hero metric ("10+ Users Hired") hurts trust.
  2. Missing accessible labels/subheadings on module pages.

## Goal

Increase organic traffic **and** sign-ups by unlocking existing content for Google, targeting high-volume Indian Cloud & DevOps career keywords, and improving homepage conversion trust signals.

## Strategy

Target the Indian job-seeker market. Transform the existing gated modules into public, indexable landing pages while keeping the full AI/chat features behind free sign-up. Focus first on the highest-search-volume topics already in the database: AWS, DevOps, Docker, Kubernetes, Terraform, Jenkins, Linux, and Cloud interview questions.

## Phases

### Phase 1 — Quick Wins (1-2 days)

1. Replace the placeholder "10+ Users Hired" metric in `HeroSection.tsx` with a real or conservatively accurate trust signal (e.g., "Trusted by job seekers at TCS, Infosys, Wipro, Accenture, Amazon, Google, Microsoft, IBM").
2. Fix the accessibility/subheading findings on module pages so the SEO scan passes.
3. Trigger a fresh SEO scan and verify all findings pass.

### Phase 2 — Unlock Existing Modules for Search (1 week)

Make these modules publicly indexable by removing `noindex` and auth-gating only the interactive actions:

- `/modules/interview-questions` → public question bank
- `/modules/scenario-questions` → public scenario bank
- `/modules/ats-resume-score` → public resume sample gallery
- `/roadmap` and `/modules/prep-roadmap` → public roadmap overview

Keep the following auth-gated (they don't work without a user resume/profile):
- `/modules/ai-job-match`
- `/modules/mock-interview`
- `/modules/linkedin-optimizer`
- `/modules/naukri-optimizer`

For each unlocked module:
- Remove `noindex` from `RouteSeo.tsx`.
- Add the route to `scripts/generate-sitemap.ts` and regenerate `public/sitemap.xml`.
- Add an `<h2>` subheading structure and a short intro paragraph targeting the main keyword.
- Add a soft CTA banner: "Sign in to save progress / get AI answers".

### Phase 3 — Keyword-Focused Landing Pages (1-2 weeks)

Create dedicated public pages for the highest-volume search terms, pulling from the existing question bank:

- `/aws-interview-questions`
- `/devops-interview-questions`
- `/docker-interview-questions`
- `/kubernetes-interview-questions`
- `/terraform-interview-questions`
- `/jenkins-interview-questions`
- `/linux-interview-questions`
- `/cloud-interview-questions`

Each page should:
- Use the `Seo` component with a unique title, description, and Article JSON-LD.
- Display 8-12 curated questions + answers from the database.
- Link back to the full `/modules/interview-questions` and `/modules/scenario-questions` banks.
- Include a clear sign-up CTA.

### Phase 4 — Internal Linking & Conversion

1. Add a "Popular guides" or "Free resources" section to the homepage footer and `/guide` hub.
2. Link from each public question page to related pages (e.g., AWS → DevOps → Cloud).
3. Ensure every public page has a visible, above-the-fold CTA to `/login?next=/chat`.
4. Add breadcrumbs with `BreadcrumbList` JSON-LD on public module pages.

### Phase 5 — Measure & Iterate

1. Resubmit the updated sitemap in Google Search Console after publishing.
2. Wait 2-4 weeks, then review Search Console queries report.
3. Double down on pages getting impressions but no clicks (improve titles/descriptions).
4. Expand to long-tail topics: "behavioral interview questions for freshers", "DevOps resume for freshers", "AWS solution architect interview questions".

## Expected Outcome

- Google can crawl and rank the interview question bank and topic pages.
- Target keywords: "aws interview questions", "devops interview questions", "cloud interview questions", plus tool-specific terms.
- Homepage trust and conversion improve with real metrics and clearer CTAs.
- Traffic growth should be visible in Search Console within 2-4 weeks of publishing.

## Notes

- This plan keeps the AI/chat features gated while making informational content public — the standard freemium SEO model.
- No backend changes are needed beyond possibly adding a `published` filter if you want to control which questions appear publicly.
