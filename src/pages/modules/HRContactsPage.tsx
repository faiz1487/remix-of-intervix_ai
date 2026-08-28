import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserSearch, Copy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import ModulePageLayout from "@/components/modules/ModulePageLayout";
import { toast } from "sonner";
import { streamChat, type Msg } from "@/lib/chat";

const HRContactsPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailModal, setEmailModal] = useState<any | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    supabase.from("hr_contacts").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setData(data || []);
      setLoading(false);
    });
  }, []);

  const generateEmail = async (contact: any) => {
    setEmailModal(contact);
    setGenerating(true);
    setGeneratedEmail("");

    let result = "";
    try {
      await streamChat({
        messages: [{ role: "user", content: `Generate a professional cold outreach email to ${contact.name} at ${contact.company}. I'm looking for job opportunities. Keep it concise and professional. Return only the email body, no subject line.` }],
        onDelta: (chunk) => { result += chunk; setGeneratedEmail(result); },
        onDone: () => setGenerating(false),
        onError: (err) => { toast.error(err); setGenerating(false); },
      });
    } catch {
      toast.error("Failed to generate email.");
      setGenerating(false);
    }
  };

  const uniqueCompanies = [...new Set(data.map(d => d.company).filter(Boolean))];
  const uniqueRoles = [...new Set(data.map(d => d.role_focus).filter(Boolean))];

  return (
    <>
      <ModulePageLayout
        title="HR Contacts"
        description="Find and reach out to HR contacts at target companies"
        icon={<UserSearch className="w-5 h-5 text-primary-foreground" />}
        data={data}
        loading={loading}
        searchKeys={["name", "company", "email", "role_focus", "experience"]}
        filters={[
          { key: "company", label: "Company", options: uniqueCompanies },
          { key: "role_focus", label: "Role", options: uniqueRoles },
        ]}
        columns={[
          { key: "company", label: "Company", render: (v: string) => <span className="font-medium">{v}</span> },
          { key: "name", label: "HR Name" },
          { key: "role_focus", label: "Role", render: (v: string) => v || "—" },
          { key: "experience", label: "Experience", render: (v: string) => v || "—" },
          { key: "email", label: "Email" },
          { key: "linkedin", label: "LinkedIn", render: (v: string) => v ? <a href={v} target="_blank" className="text-primary hover:underline text-xs truncate max-w-[120px] block">{v}</a> : "—" },
        ]}
        actions={(row) => (
          <div className="flex gap-1">
            {row.email && (
              <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(row.email); toast.success("Email copied!"); }} className="text-xs gap-1">
                <Copy className="w-3 h-3" /> Copy
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => generateEmail(row)} className="text-xs gap-1">
              <Mail className="w-3 h-3" /> Cold Email
            </Button>
          </div>
        )}
      />

      <Dialog open={!!emailModal} onOpenChange={(o) => { if (!o) setEmailModal(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Cold Email to {emailModal?.name} at {emailModal?.company}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={generatedEmail}
            onChange={(e) => setGeneratedEmail(e.target.value)}
            rows={12}
            placeholder={generating ? "Generating email..." : "Email will appear here..."}
            className="text-sm"
          />
          <div className="flex gap-2">
            <Button className="flex-1 gap-2" onClick={() => { navigator.clipboard.writeText(generatedEmail); toast.success("Copied!"); }}>
              <Copy className="w-4 h-4" /> Copy Email
            </Button>
            <Button variant="outline" className="flex-1 gap-2" onClick={() => {
              window.open(`mailto:${emailModal?.email}?body=${encodeURIComponent(generatedEmail)}`, "_blank");
            }}>
              <Mail className="w-4 h-4" /> Open Email Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HRContactsPage;
