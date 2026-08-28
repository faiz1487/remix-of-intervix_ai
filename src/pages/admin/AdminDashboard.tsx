import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MessageSquare, Contact, FileText, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ScenarioRow {
  id: string;
  title: string | null;
  scenario: string;
  technology: string;
  difficulty: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState({ jobs: 0, questions: 0, hrContacts: 0, templates: 0, scenarios: 0 });
  const [scenarioBreakdown, setScenarioBreakdown] = useState({ Beginner: 0, Intermediate: 0, Advanced: 0 });
  const [recentScenarios, setRecentScenarios] = useState<ScenarioRow[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [jobs, questions, hrContacts, templates, scenarios, scenarioRows, recent] = await Promise.all([
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("interview_questions").select("id", { count: "exact", head: true }),
        supabase.from("hr_contacts").select("id", { count: "exact", head: true }),
        supabase.from("resume_templates").select("id", { count: "exact", head: true }),
        supabase.from("scenario_questions").select("id", { count: "exact", head: true }),
        supabase.from("scenario_questions").select("difficulty"),
        supabase
          .from("scenario_questions")
          .select("id,title,scenario,technology,difficulty,created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      setStats({
        jobs: jobs.count ?? 0,
        questions: questions.count ?? 0,
        hrContacts: hrContacts.count ?? 0,
        templates: templates.count ?? 0,
        scenarios: scenarios.count ?? 0,
      });
      const breakdown = { Beginner: 0, Intermediate: 0, Advanced: 0 } as Record<string, number>;
      (scenarioRows.data || []).forEach((r: any) => {
        if (breakdown[r.difficulty] !== undefined) breakdown[r.difficulty]++;
      });
      setScenarioBreakdown(breakdown as typeof scenarioBreakdown);
      setRecentScenarios((recent.data || []) as ScenarioRow[]);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Job Listings", value: stats.jobs, icon: Briefcase, color: "text-blue-500" },
    { label: "Interview Questions", value: stats.questions, icon: MessageSquare, color: "text-green-500" },
    { label: "Scenario Questions", value: stats.scenarios, icon: Lightbulb, color: "text-amber-500" },
    { label: "HR Contacts", value: stats.hrContacts, icon: Contact, color: "text-purple-500" },
    { label: "Resume Templates", value: stats.templates, icon: FileText, color: "text-orange-500" },
  ];

  const difficultyClass = (d: string) =>
    d === "Beginner"
      ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
      : d === "Advanced"
      ? "bg-rose-500/15 text-rose-600 border-rose-500/30"
      : "bg-amber-500/15 text-amber-600 border-amber-500/30";

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Scenarios by Difficulty</CardTitle>
              <Lightbulb className="h-5 w-5 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {(["Beginner", "Intermediate", "Advanced"] as const).map((d) => {
              const count = scenarioBreakdown[d];
              const pct = stats.scenarios ? (count / stats.scenarios) * 100 : 0;
              return (
                <div key={d}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{d}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={
                        d === "Beginner"
                          ? "h-full bg-emerald-500"
                          : d === "Advanced"
                          ? "h-full bg-rose-500"
                          : "h-full bg-amber-500"
                      }
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <Link
              to="/admin/scenario-questions"
              className="inline-block text-sm text-primary hover:underline pt-2"
            >
              Manage scenarios →
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recently Added Scenarios</CardTitle>
              <Link to="/admin/scenario-questions" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentScenarios.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No scenario questions yet. Add your first one.
              </p>
            ) : (
              <div className="space-y-3">
                {recentScenarios.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">
                        {s.title || s.scenario.slice(0, 70)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {s.technology} · {new Date(s.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className={difficultyClass(s.difficulty)}>
                      {s.difficulty}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
