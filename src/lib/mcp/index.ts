import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchJobs from "./tools/search-jobs";
import searchInterviewQuestions from "./tools/search-interview-questions";
import searchCompanyQuestions from "./tools/search-company-questions";
import searchScenarioQuestions from "./tools/search-scenario-questions";
import searchHrContacts from "./tools/search-hr-contacts";
import getPrepRoadmap from "./tools/get-prep-roadmap";
import listColdEmailTemplates from "./tools/list-cold-email-templates";
import listResumeTemplates from "./tools/list-resume-templates";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "intervix-ai",
  title: "Intervix_Ai",
  version: "0.1.0",
  instructions:
    "Tools for Intervixa AI, a Cloud & DevOps interview preparation platform. Use search_jobs for the latest job listings, search_interview_questions and search_company_questions for interview prep, search_scenario_questions for real-world scenarios, get_prep_roadmap for a study plan, search_hr_contacts for recruiter outreach, and the template tools for cold emails and ATS resume samples.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    searchJobs,
    searchInterviewQuestions,
    searchCompanyQuestions,
    searchScenarioQuestions,
    searchHrContacts,
    getPrepRoadmap,
    listColdEmailTemplates,
    listResumeTemplates,
  ],
});
