# Intervixa AI - Project Memory

## Architecture
- Landing page → `/` (public)
- Login → `/login` (Google OAuth via lovable.auth)
- Chat → `/chat` (auth-guarded, AI chat with streaming)
- ATS Resume Builder → `/ats-resume-builder` (auth-guarded)
- Admin Panel → `/admin/*` (admin-guarded via user_roles table)
  - Dashboard, Jobs, Questions, HR Contacts, Templates, Users

## Design System
- Dark theme with teal/cyan primary (HSL 174 72% 50%)
- Fonts: Space Grotesk (display), Inter (body)
- Glass morphism cards, gradient CTAs, glow shadows
- All colors via CSS custom properties in index.css

## Database Tables
- user_roles (admin role system with has_role() security definer function)
- jobs (title, company_name, location, skills_required, apply_link)
- interview_questions (role, topic, question, answer)
- hr_contacts (name, company, email, linkedin)
- resume_templates (name, file_url + storage bucket)

## Edge Functions
- chat: AI chat streaming
- ats-resume: ATS resume generation
- admin-users: list/ban/unban users (service role)

## Admin Access
- Admin role checked via user_roles table + has_role() function
- First admin must be added manually via database
