# Detailed README for Intervixa AI

## What will be built
Replace the template `README.md` with a complete, detailed project README for **Intervixa AI** — a Cloud & DevOps interview preparation platform.

## README contents
1. **Project overview** — what Intervixa AI is, live URL (https://intervixa.online), key value proposition
2. **Feature list** — all 13 career modules:
   - AI Chat & Voice Assistant (`/chat`)
   - ATS Resume Builder + ATS Resume Score
   - Interview Questions & Scenario Questions (public SEO pages)
   - AI Job Match, Job Apply Links, HR Contact Finder
   - Cold Email Generator, LinkedIn/Naukri Profile Optimizers
   - Mock Interview (LiveKit voice), Prep Roadmap, Feedback
3. **Tech stack** — React 18, Vite 5, TypeScript 5, Tailwind CSS v3, shadcn-ui, Lovable Cloud (Supabase), Lovable AI Gateway (Gemini), ElevenLabs, LiveKit, Firecrawl
4. **Route map** — public, auth-guarded, and admin routes
5. **Architecture**
   - Database tables (user_roles, jobs, interview_questions, hr_contacts, resume_templates, roadmap_modules, cold_email_templates, etc.)
   - Edge functions (chat, ats-resume, sync-jobs, sync-hr-contacts, livekit-token, elevenlabs-conversation-token, mcp, admin-users, optimizers)
   - MCP server integration (tools list, OAuth)
6. **Admin panel** — dashboard + CRUD management, role-based access via user_roles
7. **Environment / secrets setup** — required secrets: ELEVENLABS_AGENT_ID, JOB_SYNC_CRON_SECRET, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL (values managed via Lovable Cloud secrets, never committed)
8. **Getting started** — local dev (clone, npm i, npm run dev), editing via Lovable / IDE / GitHub
9. **Deployment & SEO** — publishing, custom domain, sitemap, JSON-LD

## Notes
- No code or functionality changes — documentation only.
- Secrets will be referenced by name only; no real values included.
