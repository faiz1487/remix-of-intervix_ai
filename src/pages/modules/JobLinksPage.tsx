import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ModulePageLayout from "@/components/modules/ModulePageLayout";
import Seo from "@/components/Seo";
import { toast } from "sonner";

const JobLinksPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("jobs").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setData(data || []);
      setLoading(false);
    });
  }, []);

  const uniqueLocations = [...new Set(data.map(d => d.location).filter(Boolean))];
  const uniqueCompanies = [...new Set(data.map(d => d.company_name).filter(Boolean))];

  return (
    <>
    <Seo
      path="/modules/job-links"
      title="Latest Job Links & Openings — Intervixa AI"
      description="Browse the latest curated job openings from LinkedIn and Naukri with company, role, location and direct apply links."
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Latest Job Links",
        description: "Curated list of the latest job openings aggregated for Intervixa AI users.",
        url: "https://intervixa.online/modules/job-links",
      }}
    />
    <ModulePageLayout

      title="Job Links"
      description="Browse and apply to curated job opportunities"
      icon={<ExternalLink className="w-5 h-5 text-primary-foreground" />}
      data={data}
      loading={loading}
      searchKeys={["title", "company_name", "location"]}
      filters={[
        { key: "location", label: "Location", options: uniqueLocations },
        { key: "company_name", label: "Company", options: uniqueCompanies },
      ]}
      columns={[
        { key: "company_name", label: "Company", render: (v: string) => <span className="font-medium">{v}</span> },
        { key: "title", label: "Role" },
        { key: "location", label: "Location" },
        { key: "skills_required", label: "Skills", render: (v: string[]) => (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {(v || []).slice(0, 3).map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
            {(v || []).length > 3 && <Badge variant="outline" className="text-xs">+{v.length - 3}</Badge>}
          </div>
        )},
      ]}
      actions={(row) => (
        <div className="flex gap-1">
          {row.apply_link && (
            <Button variant="outline" size="sm" onClick={() => window.open(row.apply_link, "_blank")} className="gap-1 text-xs">
              <ExternalLink className="w-3 h-3" /> Apply
            </Button>
          )}
        </div>
      )}
    />
    </>
  );
};

export default JobLinksPage;
