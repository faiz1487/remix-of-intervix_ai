import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LiveKitInterview from "@/components/LiveKitInterview";
import ModulePageLayout from "@/components/modules/ModulePageLayout";

const MockInterviewPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [voiceOpen, setVoiceOpen] = useState(false);

  useEffect(() => {
    supabase.from("mock_interviews").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setData(data || []);
      setLoading(false);
    });
  }, []);

  const uniqueRoles = [...new Set(data.map(d => d.role).filter(Boolean))];
  const uniqueDifficulty = [...new Set(data.map(d => d.difficulty).filter(Boolean))];

  return (
    <>
      <ModulePageLayout
        title="Mock Interview"
        description="Practice with mock interview question sets"
        icon={<Mic className="w-5 h-5 text-primary-foreground" />}
        data={data}
        loading={loading}
        searchKeys={["role", "question_set", "difficulty"]}
        filters={[
          { key: "role", label: "Role", options: uniqueRoles },
          { key: "difficulty", label: "Difficulty", options: uniqueDifficulty },
        ]}
        columns={[
          { key: "role", label: "Role", render: (v: string) => <span className="font-medium">{v}</span> },
          { key: "question_set", label: "Question Set", className: "max-w-sm" },
          { key: "difficulty", label: "Difficulty", render: (v: string) => (
            <Badge variant={v === "Hard" ? "destructive" : v === "Easy" ? "secondary" : "outline"}>{v}</Badge>
          )},
        ]}
      />

      {/* Floating voice interview button */}
      <Button
        onClick={() => setVoiceOpen(true)}
        aria-label="Start voice mock interview"
        className="fixed bottom-24 right-6 z-30 h-14 w-14 rounded-full bg-gradient-primary text-primary-foreground shadow-glow"
      >
        <Mic className="w-6 h-6" />
      </Button>

      <Dialog open={voiceOpen} onOpenChange={setVoiceOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Voice Mock Interview</DialogTitle>
          </DialogHeader>
          <LiveKitInterview />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MockInterviewPage;
