import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import OAuthConsent from "./pages/OAuthConsent";
import ATSResumeBuilder from "./pages/ATSResumeBuilder";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/AuthGuard";
import AdminGuard from "./components/admin/AdminGuard";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminQuestions from "./pages/admin/AdminQuestions";
import AdminCompanyQuestions from "./pages/admin/AdminCompanyQuestions";
import AdminPrepRoadmap from "./pages/admin/AdminPrepRoadmap";
import AdminScenarioQuestions from "./pages/admin/AdminScenarioQuestions";
import AdminHRContacts from "./pages/admin/AdminHRContacts";
import AdminTemplates from "./pages/admin/AdminTemplates";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminContactMessages from "./pages/admin/AdminContactMessages";

// Module pages
import JobLinksPage from "./pages/modules/JobLinksPage";
import HRContactsPage from "./pages/modules/HRContactsPage";
import InterviewQuestionsPage from "./pages/modules/InterviewQuestionsPage";
import ScenarioQuestionsPage from "./pages/modules/ScenarioQuestionsPage";
import PrepRoadmapPage from "./pages/modules/PrepRoadmapPage";
import MockInterviewPage from "./pages/modules/MockInterviewPage";
import ColdEmailPage from "./pages/modules/ColdEmailPage";
import LinkedInOptimizerPage from "./pages/modules/LinkedInOptimizerPage";
import NaukriOptimizerPage from "./pages/modules/NaukriOptimizerPage";
import ATSResumeScorePage from "./pages/modules/ATSResumeScorePage";
import AIJobMatchPage from "./pages/modules/AIJobMatchPage";
import FeedbackPage from "./pages/modules/FeedbackPage";

// Public guides
import AtsOptimizationGuide from "./pages/guides/AtsOptimizationGuide";
import BehavioralInterviewGuide from "./pages/guides/BehavioralInterviewGuide";
import RouteSeo from "./components/RouteSeo";

// Keyword topic landing pages
import TopicQuestionsPage from "./pages/topics/TopicQuestionsPage";
import { TOPIC_PAGES } from "./data/topic-pages";

// Legal pages
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsAndConditions from "./pages/legal/TermsAndConditions";
import CookiePolicy from "./pages/legal/CookiePolicy";
import CookieConsent from "@/components/CookieConsent";
import FloatingContact from "@/components/FloatingContact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouteSeo />
        <CookieConsent />
        <FloatingContact />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/guide/ats-optimization" element={<AtsOptimizationGuide />} />
          <Route
            path="/guide/behavioral-interview-questions"
            element={<BehavioralInterviewGuide />}
          />
          {TOPIC_PAGES.map((p) => (
            <Route
              key={p.slug}
              path={`/${p.slug}`}
              element={<TopicQuestionsPage slug={p.slug} />}
            />
          ))}
          <Route path="/chat" element={<AuthGuard><Chat /></AuthGuard>} />
          <Route path="/ats-resume-builder" element={<AuthGuard><ATSResumeBuilder /></AuthGuard>} />

          {/* Module pages */}
          <Route path="/modules/job-links" element={<AuthGuard><JobLinksPage /></AuthGuard>} />
          <Route path="/modules/hr-contacts" element={<AuthGuard><HRContactsPage /></AuthGuard>} />
          <Route path="/modules/interview-questions" element={<InterviewQuestionsPage />} />
          <Route path="/modules/scenario-questions" element={<ScenarioQuestionsPage />} />
          <Route path="/modules/prep-roadmap" element={<PrepRoadmapPage />} />
          <Route path="/roadmap" element={<PrepRoadmapPage />} />
          <Route path="/modules/mock-interview" element={<AuthGuard><MockInterviewPage /></AuthGuard>} />
          <Route path="/modules/cold-email" element={<AuthGuard><ColdEmailPage /></AuthGuard>} />
          <Route path="/modules/linkedin-optimizer" element={<AuthGuard><LinkedInOptimizerPage /></AuthGuard>} />
          <Route path="/modules/naukri-optimizer" element={<AuthGuard><NaukriOptimizerPage /></AuthGuard>} />
          <Route path="/modules/ai-job-match" element={<AuthGuard><AIJobMatchPage /></AuthGuard>} />
          <Route path="/modules/feedback" element={<AuthGuard><FeedbackPage /></AuthGuard>} />
          <Route path="/modules/ats-resume-score" element={<ATSResumeScorePage />} />

          <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
            <Route index element={<AdminDashboard />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="questions" element={<AdminQuestions />} />
            <Route path="company-questions" element={<AdminCompanyQuestions />} />
            <Route path="prep-roadmap" element={<AdminPrepRoadmap />} />
            <Route path="scenario-questions" element={<AdminScenarioQuestions />} />
            <Route path="hr-contacts" element={<AdminHRContacts />} />
            <Route path="templates" element={<AdminTemplates />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="contact-messages" element={<AdminContactMessages />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
