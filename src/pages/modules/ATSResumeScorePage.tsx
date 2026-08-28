import { useEffect, useState } from "react";
import { FileText, Download, ExternalLink, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import ResumeThumbnail from "@/components/ats-resume/ResumeThumbnail";
import Seo from "@/components/Seo";

interface Template {
  id: string;
  name: string;
  file_url: string;
  created_at: string;
}

const ATSResumeSamplePage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("resume_templates")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setItems(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-10">
      <Seo
        path="/modules/ats-resume-score"
        title="ATS Resume Samples & Templates — Intervixa AI"
        description="Download curated ATS-friendly resume samples for Cloud and DevOps roles, built to parse cleanly in applicant tracking systems."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "ATS Resume Samples & Templates",
          description: "ATS-optimized resume samples for Cloud and DevOps roles.",
          url: "https://intervixa.online/modules/ats-resume-score",
        }}
      />
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/chat")} aria-label="Go back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold">ATS Resume Sample</h1>
          </div>
          <p className="text-muted-foreground">
            Browse and download ATS-optimized resume samples curated by our team.
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-sm md:text-base text-foreground/90">
            Want a resume tailored to your target job? Use our AI ATS Resume Builder to generate, score and export a recruiter-ready resume.
          </p>
          <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow shrink-0">
            <Link to="/ats-resume-builder">
              Build Your Resume <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
            No resume samples available yet. Check back soon.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((t) => (
              <div
                key={t.id}
                className="glass rounded-2xl p-5 space-y-4 hover:border-primary/40 transition-all group"
              >
                <ResumeThumbnail url={t.file_url} name={t.name} />
                <div>
                  <h3 className="font-display font-semibold truncate">{t.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Added {new Date(t.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" className="flex-1">
                    <a href={t.file_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> View
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <a href={t.file_url} download>
                      <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSResumeSamplePage;
