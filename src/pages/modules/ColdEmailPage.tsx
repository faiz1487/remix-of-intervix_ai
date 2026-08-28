import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModulePageLayout from "@/components/modules/ModulePageLayout";
import { toast } from "sonner";

const ColdEmailPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("cold_email_templates").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setData(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <ModulePageLayout
      title="Cold Email Templates"
      description="Professional cold outreach email templates"
      icon={<Mail className="w-5 h-5 text-primary-foreground" />}
      data={data}
      loading={loading}
      searchKeys={["template_name", "email_subject", "email_body"]}
      columns={[
        { key: "template_name", label: "Template Name", render: (v: string) => <span className="font-medium">{v}</span> },
        { key: "email_subject", label: "Subject" },
        { key: "email_body", label: "Email Body", className: "max-w-xs", render: (v: string) => <span className="truncate block max-w-[250px]">{v || "—"}</span> },
      ]}
      actions={(row) => (
        <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(row.email_body); toast.success("Email body copied!"); }} className="text-xs gap-1">
          <Copy className="w-3 h-3" /> Copy
        </Button>
      )}
    />
  );
};

export default ColdEmailPage;
