import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Search,
  Sparkles,
  X,
  Send,
  Loader2,
  AlertTriangle,
  Play,
  Lightbulb,
  Eye,
  CheckCircle2,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  Inbox,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { streamChat, type Msg } from "@/lib/chat";
import { toast } from "sonner";
import ModuleHeader from "@/components/modules/ModuleHeader";
import Seo from "@/components/Seo";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface ScenarioRow {
  id: string;
  scenario: string;
  technology: string;
  explanation: string;
  title: string | null;
  description: string | null;
  answer: string | null;
  hint: string | null;
  tags: string[] | null;
  difficulty: string | null;
  created_at: string | null;
}

const BOOKMARK_KEY = "intervixa.scenario.bookmarks";
const COMPLETED_KEY = "intervixa.scenario.completed";

const difficultyClasses = (d: string) => {
  switch (d) {
    case "Beginner":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "Advanced":
      return "bg-rose-500/15 text-rose-400 border-rose-500/30";
    case "Intermediate":
    default:
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  }
};

const ScenarioQuestionsPage = () => {
  const [rows, setRows] = useState<ScenarioRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [techFilter, setTechFilter] = useState("__all__");
  const [diffFilter, setDiffFilter] = useState("__all__");
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const [active, setActive] = useState<ScenarioRow | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);

  // AI sidebar
  const [aiOpen, setAiOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("scenario_questions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load scenarios");
    setRows((data as ScenarioRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
    try {
      setBookmarks(JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]"));
      setCompleted(JSON.parse(localStorage.getItem(COMPLETED_KEY) || "[]"));
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const persist = (key: string, value: string[]) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const toggleBookmark = (id: string) => {
    const next = bookmarks.includes(id)
      ? bookmarks.filter((b) => b !== id)
      : [...bookmarks, id];
    setBookmarks(next);
    persist(BOOKMARK_KEY, next);
  };

  const markCompleted = (id: string) => {
    if (completed.includes(id)) return;
    const next = [...completed, id];
    setCompleted(next);
    persist(COMPLETED_KEY, next);
  };

  // Derived filter options
  const technologies = useMemo(
    () => Array.from(new Set(rows.map((r) => r.technology).filter(Boolean))),
    [rows]
  );
  const difficulties: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];
  const allTags = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => (r.tags || []).forEach((t) => t && set.add(t)));
    return Array.from(set).slice(0, 12);
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return rows.filter((r) => {
      const title = (r.title || r.scenario || "").toLowerCase();
      const desc = (r.description || r.scenario || "").toLowerCase();
      const tech = (r.technology || "").toLowerCase();
      const tags = (r.tags || []).map((t) => t.toLowerCase());

      const matchesSearch =
        !q ||
        title.includes(q) ||
        desc.includes(q) ||
        tech.includes(q) ||
        tags.some((t) => t.includes(q));

      const matchesTech =
        techFilter === "__all__" || r.technology === techFilter;
      const matchesDiff =
        diffFilter === "__all__" || (r.difficulty || "Intermediate") === diffFilter;
      const matchesTag = !tagFilter || (r.tags || []).includes(tagFilter);

      return matchesSearch && matchesTech && matchesDiff && matchesTag;
    });
  }, [rows, search, techFilter, diffFilter, tagFilter]);

  const openScenario = (s: ScenarioRow) => {
    setActive(s);
    setUserAnswer("");
    setShowHint(false);
    setRevealed(false);
    setSubmitted(false);
  };

  const closeScenario = () => setActive(null);

  const sendAi = async (text: string) => {
    if (!text.trim() || aiLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    setMessages((p) => [...p, userMsg]);
    setAiInput("");
    setAiLoading(true);
    let acc = "";
    const upsert = (chunk: string) => {
      acc += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: acc } : m
          );
        }
        return [...prev, { role: "assistant", content: acc }];
      });
    };
    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: upsert,
        onDone: () => setAiLoading(false),
        onError: (err) => {
          toast.error(err);
          setAiLoading(false);
        },
      });
    } catch {
      toast.error("Something went wrong.");
      setAiLoading(false);
    }
  };

  const completedCount = completed.length;
  const totalCount = rows.length;

  return (
    <div className="min-h-screen bg-background flex">
      <div className={`flex-1 transition-all duration-300 ${aiOpen ? "mr-[400px]" : ""}`}>
        <ModuleHeader
          title="Scenario Questions"
          description="Practice real-world production scenarios for interviews"
          icon={<AlertTriangle className="w-5 h-5 text-primary" />}
          className="glass border-b border-border/30 px-6 py-4 sticky top-0 z-10 backdrop-blur"
          action={
            <div className="flex items-center gap-3">
              {totalCount > 0 && (
                <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground px-3 py-1.5 rounded-full border border-border/40 bg-card/50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {completedCount} / {totalCount} completed
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => setAiOpen(!aiOpen)}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                Ask Intervixa AI
              </Button>
            </div>
          }
        />

        {/* SEARCH & FILTERS */}
        <section className="px-6 pt-6 pb-2">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search scenarios (e.g., EC2, Docker, Kubernetes)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-card/60 border-border/40"
              />
            </div>
            <div className="flex gap-3">
              <Select value={techFilter} onValueChange={setTechFilter}>
                <SelectTrigger className="w-[170px] h-11 bg-card/60 border-border/40">
                  <SelectValue placeholder="Technology" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Technologies</SelectItem>
                  {technologies.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={diffFilter} onValueChange={setDiffFilter}>
                <SelectTrigger className="w-[170px] h-11 bg-card/60 border-border/40">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Difficulties</SelectItem>
                  {difficulties.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {allTags.map((t) => {
                const active = tagFilter === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTagFilter(active ? null : t)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card/40 border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/40"
                    }`}
                  >
                    #{t}
                  </button>
                );
              })}
              {tagFilter && (
                <button
                  onClick={() => setTagFilter(null)}
                  className="px-3 py-1 text-xs rounded-full border border-border/40 text-muted-foreground hover:text-foreground"
                >
                  Clear tag
                </button>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground mt-4">
            {filtered.length} {filtered.length === 1 ? "scenario" : "scenarios"} found
          </div>
        </section>

        {/* SEO INTRO + CTA */}
        <section className="px-6 py-6">
          <div className="max-w-6xl mx-auto rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-sm md:text-base text-foreground/90">
                Practice real production scenarios used in Cloud & DevOps interviews. Sign in to track progress, bookmark questions and get AI explanations.
              </p>
            </div>
            <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow shrink-0">
              <Link to="/login?next=/modules/scenario-questions">
                Start Practicing <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <main className="px-6 pb-12">
          <h2 className="text-xl font-bold mt-4 mb-2">Real-world production scenarios</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Practice DevOps and Cloud scenario-based interview questions covering Linux, AWS, Docker, Kubernetes, Terraform, Jenkins and more.
          </p>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card
                  key={i}
                  className="h-56 bg-card/60 border-border/30 animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState onRefresh={fetchRows} hasData={rows.length > 0} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-4">
              {filtered.map((s) => {
                const difficulty = (s.difficulty || "Intermediate") as Difficulty;
                const title = s.title || s.scenario;
                const description =
                  s.description ||
                  (s.scenario && s.scenario !== title ? s.scenario : "") ||
                  "Open the scenario to see the full problem and start solving.";
                const isBookmarked = bookmarks.includes(s.id);
                const isDone = completed.includes(s.id);

                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Card className="group relative h-full bg-card/80 border-border/40 rounded-2xl p-5 flex flex-col hover:border-primary/50 hover:shadow-glow transition-all duration-300">
                      {/* TOP: difficulty + tags */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-md border ${difficultyClasses(
                              difficulty
                            )}`}
                          >
                            {difficulty}
                          </span>
                          {s.technology && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] font-medium"
                            >
                              {s.technology}
                            </Badge>
                          )}
                          {(s.tags || []).slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="text-[10px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => toggleBookmark(s.id)}
                          className="text-muted-foreground hover:text-primary transition-colors"
                          aria-label="Bookmark"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-primary" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* MIDDLE: title */}
                      <h3 className="font-display font-semibold text-base leading-snug mb-2 line-clamp-2">
                        {title}
                      </h3>

                      {/* BOTTOM: description + CTA */}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-5 flex-1">
                        {description}
                      </p>

                      <div className="flex items-center justify-between">
                        {isDone ? (
                          <span className="text-xs text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Ready to solve
                          </span>
                        )}
                        <Button
                          size="sm"
                          onClick={() => openScenario(s)}
                          className="bg-gradient-primary text-primary-foreground gap-1.5 shadow-glow"
                        >
                          Start Scenario
                          <Play className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* SCENARIO DETAIL DIALOG */}
      <Dialog open={!!active} onOpenChange={(o) => !o && closeScenario()}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 overflow-hidden bg-card border-border/40">
          {active && (
            <div className="grid grid-cols-1 lg:grid-cols-2 max-h-[85vh]">
              {/* LEFT: scenario */}
              <div className="p-6 lg:border-r border-border/30 overflow-y-auto">
                <DialogHeader className="text-left mb-4">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className={`text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-md border ${difficultyClasses(
                        (active.difficulty || "Intermediate")
                      )}`}
                    >
                      {active.difficulty || "Intermediate"}
                    </span>
                    {active.technology && (
                      <Badge variant="secondary" className="text-[10px]">
                        {active.technology}
                      </Badge>
                    )}
                    {(active.tags || []).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md"
                      >
                        #{t}
                      </span>
                    ))}
      </div>

      <Seo
        path="/modules/scenario-questions"
        title="DevOps Scenario-Based Interview Questions — Intervixa AI"
        description="Practice real production scenario questions across Linux, AWS, Docker, Kubernetes, Terraform, Jenkins and CI/CD with detailed answers and AI explanations."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "DevOps Scenario-Based Interview Questions",
          description: "Real-world Cloud and DevOps scenario questions grouped by technology and difficulty.",
          url: "https://intervixa.online/modules/scenario-questions",
        }}
      />
                  <DialogTitle className="text-xl font-display">
                    {active.title || active.scenario}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                      Problem
                    </h4>
                    <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {active.description || active.scenario}
                    </p>
                  </div>

                  {active.scenario && active.description && active.scenario !== active.description && (
                    <div className="rounded-lg border border-border/40 bg-muted/30 p-3 font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                      {active.scenario}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: answer flow */}
              <div className="p-6 overflow-y-auto bg-background/50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-display font-semibold">Your Answer</h4>
                  <button
                    onClick={() => toggleBookmark(active.id)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {bookmarks.includes(active.id) ? (
                      <BookmarkCheck className="w-4 h-4 text-primary" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <Textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type how you would approach and solve this..."
                  className="min-h-[160px] bg-card/60 border-border/40 resize-none mb-3"
                />

                <div className="flex flex-wrap gap-2 mb-5">
                  <Button
                    onClick={() => {
                      if (!userAnswer.trim()) {
                        toast.error("Write your answer first");
                        return;
                      }
                      setSubmitted(true);
                      setRevealed(true);
                      markCompleted(active.id);
                    }}
                    className="bg-gradient-primary text-primary-foreground gap-2 shadow-glow"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Submit Answer
                  </Button>
                  {active.hint && (
                    <Button
                      variant="outline"
                      onClick={() => setShowHint((v) => !v)}
                      className="gap-2"
                    >
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      {showHint ? "Hide Hint" : "Show Hint"}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => setRevealed(true)}
                    className="gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Reveal Answer
                  </Button>
                </div>

                {showHint && active.hint && (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-200/90 mb-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-amber-400 mb-1">
                      <Lightbulb className="w-3.5 h-3.5" /> Hint
                    </div>
                    {active.hint}
                  </div>
                )}

                {revealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {submitted && (
                      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Great work — compare your answer with the solution below.
                      </div>
                    )}

                    {active.answer && (
                      <div>
                        <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                          Correct Answer
                        </h4>
                        <div className="rounded-lg border border-border/40 bg-card/70 p-4 text-sm whitespace-pre-wrap leading-relaxed">
                          {active.answer}
                        </div>
                      </div>
                    )}

                    {active.explanation && (
                      <div>
                        <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                          Explanation & Key Takeaways
                        </h4>
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm prose prose-sm prose-invert max-w-none [&_p]:text-foreground/90 [&_li]:text-foreground/90 [&_strong]:text-primary">
                          <ReactMarkdown>{active.explanation}</ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {!active.answer && !active.explanation && (
                      <div className="text-sm text-muted-foreground text-center py-6 border border-dashed border-border/40 rounded-lg">
                        The admin hasn't added a solution for this scenario yet.
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* AI SIDEBAR */}
      <AnimatePresence>
        {aiOpen && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[400px] bg-card border-l border-border/30 flex flex-col z-20"
          >
            <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-display font-bold text-sm">Intervixa AI</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setAiOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm pt-8">
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-3 opacity-50" />
                  <p>Ask me anything about scenario interviews.</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:text-foreground [&_li]:text-foreground [&_strong]:text-primary">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {aiLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-xl px-3 py-2 flex items-center gap-2">
                    <Loader2 className="w-3 h-3 text-primary animate-spin" />
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-border/30 px-4 py-3 flex gap-2">
              <Input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendAi(aiInput);
                }}
                placeholder="Ask about scenarios..."
                className="text-sm"
              />
              <Button
                size="icon"
                onClick={() => sendAi(aiInput)}
                disabled={!aiInput.trim() || aiLoading}
                className="bg-gradient-primary text-primary-foreground shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EmptyState = ({
  onRefresh,
  hasData,
}: {
  onRefresh: () => void;
  hasData: boolean;
}) => (
  <div className="flex flex-col items-center justify-center text-center py-20 mt-4 rounded-2xl border border-dashed border-border/40 bg-card/40">
    <div className="w-16 h-16 rounded-2xl bg-gradient-primary/20 border border-primary/30 flex items-center justify-center mb-5">
      <Inbox className="w-7 h-7 text-primary" />
    </div>
    <h3 className="font-display font-semibold text-lg mb-1">
      {hasData ? "No scenarios match your filters" : "No scenarios available yet"}
    </h3>
    <p className="text-sm text-muted-foreground max-w-md mb-6">
      {hasData
        ? "Try adjusting your search, technology or difficulty filters."
        : "Scenarios will appear here once added by admin."}
    </p>
    <Button variant="outline" onClick={onRefresh} className="gap-2">
      <RefreshCw className="w-4 h-4" /> Refresh
    </Button>
  </div>
);

export default ScenarioQuestionsPage;
