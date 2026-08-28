import { useLocation } from "react-router-dom";
import Seo from "@/components/Seo";

interface RouteMeta {
  title: string;
  description: string;
  noindex?: boolean;
}

/**
 * Per-route social/search metadata for pages that don't render <Seo /> themselves.
 * Pages rendering their own <Seo /> override these values (Helmet dedupes by
 * name/property and the deeper component wins).
 */
const ROUTE_META: Record<string, RouteMeta> = {
  "/chat": {
    title: "AI Career Assistant Chat — Intervixa AI",
    description:
      "Chat with an AI career coach for resume, interview and job search help, with voice conversation and every Intervixa module in one place.",
    noindex: true,
  },
  "/ats-resume-builder": {
    title: "Free ATS Resume Builder — Intervixa AI",
    description:
      "Build an ATS-ready resume in minutes, score it against any job description and export a clean PDF or DOCX recruiters can parse.",
    noindex: true,
  },
  "/modules/job-links": {
    title: "Latest Cloud & DevOps Job Links — Intervixa AI",
    description:
      "Browse fresh Cloud and DevOps job openings collected from LinkedIn and Naukri, with direct apply links updated every day.",
    noindex: true,
  },
  "/modules/interview-questions": {
    title: "Cloud & DevOps Interview Questions — Intervixa AI",
    description:
      "Practice 50+ real Cloud and DevOps interview questions by topic and company, each with a detailed answer and explanation.",
  },
  "/modules/ai-job-match": {
    title: "AI Job Match for Cloud & DevOps — Intervixa AI",
    description:
      "Upload your resume and get AI-scored job matches, missing-skill insights and auto-apply tracking for Cloud and DevOps roles.",
    noindex: true,
  },
  "/modules/feedback": {
    title: "Feedback & Suggestions — Intervixa AI",
    description:
      "Share feedback, report issues and suggest new features for the Intervixa AI career platform.",
    noindex: true,
  },
  "/modules/hr-contacts": {
    title: "HR Contacts for Cloud & DevOps Roles — Intervixa AI",
    description:
      "Find verified recruiter and HR contacts hiring for Cloud and DevOps roles, and generate a tailored outreach email in one click.",
    noindex: true,
  },
  "/modules/scenario-questions": {
    title: "DevOps Scenario-Based Interview Questions — Intervixa AI",
    description:
      "Practice real production scenario questions across Linux, AWS, Docker, Kubernetes, Terraform and CI/CD with detailed answers.",
  },
  "/modules/prep-roadmap": {
    title: "Cloud & DevOps Interview Prep Roadmap — Intervixa AI",
    description:
      "Follow a step-by-step Cloud and DevOps learning roadmap with topic modules, progress tracking and curated practice.",
  },
  "/roadmap": {
    title: "Cloud & DevOps Career Roadmap — Intervixa AI",
    description:
      "Explore a structured Cloud and DevOps career roadmap with skill paths, milestones and role-ready learning tracks.",
  },
  "/modules/mock-interview": {
    title: "AI Mock Interview Practice — Intervixa AI",
    description:
      "Run realistic AI mock interviews with voice, get instant feedback and rehearse the questions you'll actually be asked.",
    noindex: true,
  },
  "/modules/cold-email": {
    title: "Cold Email Templates for Job Seekers — Intervixa AI",
    description:
      "Proven recruiter outreach and referral cold email templates you can copy, personalise and send in seconds.",
    noindex: true,
  },
  "/modules/linkedin-optimizer": {
    title: "AI LinkedIn Profile Optimizer — Intervixa AI",
    description:
      "Score your LinkedIn profile, fix your headline, about and experience sections, and get found by more recruiters.",
    noindex: true,
  },
  "/modules/naukri-optimizer": {
    title: "AI Naukri Profile Optimizer — Intervixa AI",
    description:
      "Analyse and improve your Naukri profile with AI scoring, keyword gaps and recruiter-ready rewrite suggestions.",
    noindex: true,
  },
  "/modules/ats-resume-score": {
    title: "ATS Resume Samples & Templates — Intervixa AI",
    description:
      "Download curated ATS-friendly resume samples for Cloud and DevOps roles, built to parse cleanly in applicant tracking systems.",
  },
  "/login": {
    title: "Sign In — Intervixa AI",
    description:
      "Sign in to Intervixa AI to access your resume builder, interview practice modules and personalised job matches.",
  },
};


export const RouteSeo = () => {
  const { pathname } = useLocation();
  const meta = ROUTE_META[pathname];
  if (!meta) return null;

  return (
    <Seo
      path={pathname}
      title={meta.title}
      description={meta.description}
      noindex={meta.noindex}
    />
  );
};

export default RouteSeo;
