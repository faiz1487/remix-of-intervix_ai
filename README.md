# Intervixa AI

**AI-powered Cloud & DevOps interview preparation platform** — resume building, mock interviews, job matching, recruiter outreach, and guided prep, all in one place.

🌐 **Live site:** https://intervixa.online

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Route Map](#route-map)
- [Architecture](#architecture)
  - [Database Tables](#database-tables)
  - [Edge Functions](#edge-functions)
  - [MCP Server](#mcp-server)
- [Admin Panel](#admin-panel)
- [Environment & Secrets](#environment--secrets)
- [Getting Started](#getting-started)
- [Deployment & SEO](#deployment--seo)

---

## Overview

Intervixa AI helps engineers prepare for Cloud & DevOps roles end to end:

- Practice with **real interview questions** and **scenario-based problems**
- Build and score **ATS-optimized resumes**
- Run **voice mock interviews** with an AI interviewer
- Discover **jobs** and **recruiter contacts**, synced automatically
- Generate **cold outreach emails** and optimize **LinkedIn / Naukri profiles**
- Follow a structured **10-step Cloud & DevOps roadmap**

The platform also exposes an **MCP server** so external AI agents can search jobs, questions, roadmaps, and contacts on the user's behalf (with OAuth consent).

## Features

### 13 Career Modules

| Module | Route | Access | Description |
|---|---|---|---|
| AI Chat & Voice Assistant | `/chat` | Auth | Streaming AI career assistant (Gemini) with ElevenLabs voice |
| ATS Resume Builder | `/ats-resume-builder` | Auth | Claude-powered resume optimization, PDF export, canvas thumbnails |
| ATS Resume Score | `/modules/ats-resume-score` | Public | Score any resume against ATS criteria |
| Interview Questions | `/modules/interview-questions` | Public | Topic-wise real interview questions with hints & reveal mechanics |
| Scenario Questions | `/modules/scenario-questions` | Public | Real-world scenario-based Cloud/DevOps problems |
| Prep Roadmap | `/roadmap` | Public | 10-step Cloud & DevOps learning path with progress tracking |
| AI Job Match | `/modules/ai-job-match` | Auth | DevOps/Cloud job portal with AI scoring & resume analysis |
| Job Apply Links | `/modules/job-links` | Auth | Curated application links from synced listings |
| HR Contact Finder | `/modules/hr-contacts` | Auth | Recruiter/HR contacts from recent hiring posts |
| Cold Email Generator | `/modules/cold-email` | Auth | Outreach templates & AI-generated cold emails |
| LinkedIn Optimizer | `/modules/linkedin-optimizer` | Auth | Vision AI analysis of LinkedIn profiles |
| Naukri Optimizer | `/modules/naukri-optimizer` | Auth | Vision AI analysis of Naukri profiles |
| Mock Interview | `/modules/mock-interview` | Auth | LiveKit Cloud voice interviews (Agent: faizan) |

### Additional Capabilities

- **Automated job & HR sync** — Firecrawl-powered hourly sync of listings and recruiter contacts
- **Contact system** — global floating widget (inquiry form, email, WhatsApp) with admin management
- **Interactive solvers** — card grids with *Hint* and *Reveal* mechanics
- **SEO landing pages** — 9 targeted topic pages (e.g. `/aws-interview-questions`), automated sitemap, JSON-LD structured data
- **Feedback module** — user feedback collection with admin review
- **Launch offer system** — homepage popup and claimed-spots tracking

## Tech Stack

**Frontend**
- React 18, Vite 5, TypeScript 5
- Tailwind CSS v3 + shadcn-ui (dark theme, teal/cyan primary, glass morphism)
- Fonts: Space Grotesk (display), Inter (body)

**Backend — Lovable Cloud** (database, auth, storage, edge functions)
- Google OAuth authentication
- Row Level Security on all tables
- Role-based admin access (`user_roles` + `has_role()` security definer function)

**AI & Voice**
- Lovable AI Gateway — Google Gemini (chat, streaming) and Claude (resume generation)
- ElevenLabs — conversational voice assistant
- LiveKit Cloud — real-time mock interview audio
- Firecrawl — job & HR contact scraping/sync

## Route Map

```
Public:
  /                              Landing page
  /login                         Google OAuth sign-in
  /roadmap                       Cloud & DevOps roadmap (SEO)
  /modules/interview-questions   Interview question bank (SEO)
  /modules/scenario-questions    Scenario questions (SEO)
  /modules/ats-resume-score      ATS resume scorer (SEO)
  /*-interview-questions         Topic landing pages (SEO, 9 pages)
  /*-scenario-questions          Topic scenario pages (SEO)
  /guides/*                      ATS optimization & behavioral interview guides
  /privacy-policy, /terms, /cookie-policy

Auth-guarded:
  /chat                          AI chat & voice assistant
  /ats-resume-builder            Resume builder
  /modules/ai-job-match          Job matching
  /modules/job-links, /modules/hr-contacts, /modules/cold-email
  /modules/linkedin-optimizer, /modules/naukri-optimizer
  /modules/mock-interview, /modules/feedback

Admin (role-guarded):
  /admin                         Dashboard
  /admin/jobs, /admin/questions, /admin/company-questions
  /admin/scenario-questions, /admin/hr-contacts, /admin/templates
  /admin/prep-roadmap, /admin/users, /admin/feedback
  /admin/contact-messages
```

## Architecture

### Database Tables

| Table | Purpose |
|---|---|
| `user_roles` | Admin role system (checked via `has_role()` security definer function) |
| `jobs` | Synced job listings (title, company, location, skills, apply link) |
| `interview_questions` | Topic-wise questions with answers & hints |
| `company_questions` | Company/role-grouped questions |
| `scenario_questions` | Real-world scenario problems |
| `hr_contacts` | Recruiter contacts (name, company, email, LinkedIn) |
| `roadmap_modules` | Ordered prep roadmap modules & topics |
| `cold_email_templates` | Outreach email templates |
| `resume_templates` | Downloadable ATS resume samples (+ storage bucket) |
| `contact_messages` | Contact widget inquiries |
| `feedback` | User feedback submissions |

All tables have RLS enabled with explicit grants. Admin-only tables check `public.has_role(auth.uid(), 'admin')`.

### Edge Functions

| Function | Purpose |
|---|---|
| `chat` | Streaming AI chat via Lovable AI Gateway (Gemini) |
| `ats-resume` | ATS resume generation/optimization (Claude) |
| `sync-jobs` | Firecrawl-powered hourly job sync (cron-authenticated) |
| `sync-hr-contacts` | Firecrawl-powered HR contact sync |
| `linkedin-optimizer` / `naukri-optimizer` | Vision AI profile analysis |
| `livekit-token` | LiveKit Cloud token minting for mock interviews |
| `elevenlabs-conversation-token` | Voice assistant session tokens |
| `admin-users` | List / ban / unban users (service role) |
| `claimed-spots` | Launch offer spot tracking |
| `mcp` | MCP server endpoint (see below) |

### MCP Server

External AI agents can connect to the platform's MCP server at `/functions/v1/mcp` with OAuth (Supabase issuer, `authenticated` audience). Tools:

- `search_jobs` — search Cloud/DevOps job listings
- `search_interview_questions` — topic-wise Q&A with hints
- `search_company_questions` — company/role-grouped questions
- `search_scenario_questions` — scenario-based questions
- `search_hr_contacts` — recruiter contacts
- `get_prep_roadmap` — ordered roadmap modules & topics
- `list_cold_email_templates` — outreach templates
- `list_resume_templates` — ATS resume samples

Tool definitions live in `src/lib/mcp/tools/`, composed in `src/lib/mcp/index.ts`, with per-user data access via `supabaseForUser(ctx)` (user's OAuth token, so RLS applies).

## Admin Panel

Role-based admin suite at `/admin/*`, guarded by `AdminGuard` (checks `user_roles` via `has_role()`). Provides CRUD management for jobs, all question banks, HR contacts, templates, roadmap modules, users (ban/unban), feedback, and contact messages.

> The first admin must be granted manually by inserting a row into `user_roles` with role `admin`.

## Environment & Secrets

Secrets are managed via Lovable Cloud (never committed to the repo):

| Secret | Used by |
|---|---|
| `ELEVENLABS_AGENT_ID` | Voice assistant conversation tokens |
| `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET` / `LIVEKIT_URL` | Mock interview voice rooms |
| `JOB_SYNC_CRON_SECRET` | Authenticating scheduled job/HR sync invocations |
| `LOVABLE_API_KEY` | AI Gateway calls (auto-provisioned) |

## Getting Started

**Prerequisites:** Node.js & npm (recommend installing via [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Navigate to the project
cd intervixa-ai

# 3. Install dependencies
npm i

# 4. Start the dev server (hot reload + instant preview)
npm run dev
```

**Other ways to edit:**
- **Lovable** — open the project on [lovable.dev](https://lovable.dev) and prompt changes; they commit automatically
- **GitHub** — edit files directly or use a Codespace; pushes sync back to Lovable

## Deployment & SEO

- **Publish:** Lovable → Share → Publish; custom domain supported (currently serving at https://intervixa.online)
- **Sitemap:** `public/sitemap.xml` (generated via `scripts/generate-sitemap.ts`)
- **Structured data:** JSON-LD on public/SEO pages
- **Meta:** per-route titles/descriptions via `Seo` / `RouteSeo` components
- **Legal:** privacy policy, terms, cookie policy + cookie consent banner
