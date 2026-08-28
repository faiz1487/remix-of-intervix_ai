import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import LaunchOfferSection from "@/components/LaunchOfferSection";
import LaunchOfferPopup from "@/components/LaunchOfferPopup";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        path="/"
        title="Intervixa AI — AI Resume, Interview & Job Search Coach"
        description="Optimize your resume for ATS, practice mock interviews, reach recruiters and find jobs faster with Intervixa AI."
      />
      <Navbar />
      <LaunchOfferPopup />

      <HeroSection />
      <TrustBar />
      <LaunchOfferSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
