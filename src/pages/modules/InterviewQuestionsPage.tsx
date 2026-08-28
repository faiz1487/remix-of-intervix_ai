import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Search,
  Sparkles,
  X,
  Send,
  Loader2,
  MessageSquareMore,
  Play,
  Lightbulb,
  Eye,
  CheckCircle2,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  Inbox,
  ExternalLink,
  Building2,
  ArrowRight,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { streamChat, type Msg } from "@/lib/chat";
import { toast } from "sonner";
import Seo from "@/components/Seo";
import ModuleHeader from "@/components/modules/ModuleHeader";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface QuestionRow {
  id: string;
  role: string;
  topic: string;
  company: string | null;
  question: string;
  answer: string | null;
  hint: string | null;
  explanation: string | null;
  tags: string[] | null;
  difficulty: string | null;
  created_at: string | null;
}

const BOOKMARK_KEY = "intervixa.questions.bookmarks";
const COMPLETED_KEY = "intervixa.questions.completed";

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

interface CompanyQuestionRow {
  id: string;
  company: string;
  role: string | null;
  location: string | null;
  skills: string[] | null;
  question: string;
  answer: string | null;
  difficulty: string | null;
  document_link: string | null;
}

const InterviewQuestionsPage = () => {
  const [rows, setRows] = useState<QuestionRow[]>([]);
  const [companyRows, setCompanyRows] = useState<CompanyQuestionRow[]>([]);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("__all__");
  const [topicFilter, setTopicFilter] = useState("__all__");
  const [diffFilter, setDiffFilter] = useState("__all__");
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const [active, setActive] = useState<QuestionRow | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);

  const [aiOpen, setAiOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("interview_questions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load questions");
    setRows((data as QuestionRow[]) || []);
    setLoading(false);
  };

  const fetchCompanyQuestions = async () => {
    setCompanyLoading(true);
    const { data, error } = await supabase
      .from("company_questions")
      .select("id, company, role, location, skills, question, answer, difficulty, document_link")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load company questions");
    setCompanyRows((data as CompanyQuestionRow[]) || []);
    setCompanyLoading(false);
  };

  useEffect(() => {
    fetchRows();
    fetchCompanyQuestions();
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

  const roles = useMemo(
    () => Array.from(new Set(rows.map((r) => r.role).filter(Boolean))),
    [rows]
  );
  const topics = useMemo(
    () => Array.from(new Set(rows.map((r) => r.topic).filter(Boolean))),
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
      const question = (r.question || "").toLowerCase();
      const role = (r.role || "").toLowerCase();
      const topic = (r.topic || "").toLowerCase();
      const tags = (r.tags || []).map((t) => t.toLowerCase());

      const matchesSearch =
        !q ||
        question.includes(q) ||
        role.includes(q) ||
        topic.includes(q) ||
        tags.some((t) => t.includes(q));

      const matchesRole = roleFilter === "__all__" || r.role === roleFilter;
      const matchesTopic = topicFilter === "__all__" || r.topic === topicFilter;
      const matchesDiff =
        diffFilter === "__all__" || (r.difficulty || "Intermediate") === diffFilter;
      const matchesTag = !tagFilter || (r.tags || []).includes(tagFilter);

      return matchesSearch && matchesRole && matchesTopic && matchesDiff && matchesTag;
    });
  }, [rows, search, roleFilter, topicFilter, diffFilter, tagFilter]);

  const openQuestion = (q: QuestionRow) => {
    setActive(q);
    setUserAnswer("");
    setShowHint(false);
    setRevealed(false);
    setSubmitted(false);
  };

  const closeQuestion = () => setActive(null);

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
      <Seo
        path="/modules/interview-questions"
        title="Interview Questions & Answers — Intervixa AI"
        description="Practice real interview questions by topic and company, with model answers, hints and explanations."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: rows
            .filter((r: any) => r.question && r.answer)
            .slice(0, 20)
            .map((r: any) => ({
              "@type": "Question",
              name: r.question,
              acceptedAnswer: { "@type": "Answer", text: r.answer },
            })),
        }}
      />

      <div className={`flex-1 transition-all duration-300 ${aiOpen ? "mr-[400px]" : ""}`}>
        <ModuleHeader
          title="Interview Questions"
          description="Browse curated interview questions by role and topic"
          icon={<MessageSquareMore className="w-5 h-5 text-primary" />}
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
              <Button variant="outline" onClick={() => setAiOpen(!aiOpen)} className="gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Ask Intervixa AI
              </Button>
            </div>
          }
        />

        <section className="px-6 pt-6 pb-2">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search questions, role or topic..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-card/60 border-border/40"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px] h-11 bg-card/60 border-border/40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Roles</SelectItem>
                  {roles.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={topicFilter} onValueChange={setTopicFilter}>
                <SelectTrigger className="w-[150px] h-11 bg-card/60 border-border/40">
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Topics</SelectItem>
                  {topics.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={diffFilter} onValueChange={setDiffFilter}>
                <SelectTrigger className="w-[150px] h-11 bg-card/60 border-border/40">
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
                const isActive = tagFilter === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTagFilter(isActive ? null : t)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      isActive
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
            {filtered.length} {filtered.length === 1 ? "question" : "questions"} found
          </div>

          <div className="mt-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-sm md:text-base text-foreground/90">
              Sign in to bookmark questions, mark them complete and get AI explanations tailored to your experience.
            </p>
            <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow shrink-0">
              <Link to="/login?next=/modules/interview-questions">
                Practice Free <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </section>

        <main className="px-6 pb-12">
          <Tabs defaultValue="browse" className="mt-2">
            <TabsList className="bg-card/60 border border-border/40">
              <TabsTrigger value="browse">Browse Questions</TabsTrigger>
              <TabsTrigger value="company">Company-wise</TabsTrigger>
              <TabsTrigger value="topic">Topic-wise</TabsTrigger>
            </TabsList>

            <TabsContent value="browse">
              <h2 className="text-xl font-bold mt-4 mb-2">Browse all interview questions</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Explore Cloud and DevOps interview questions filtered by role, topic, difficulty and tags.
              </p>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="h-56 bg-card/60 border-border/30 animate-pulse" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <EmptyState onRefresh={fetchRows} hasData={rows.length > 0} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-4">
                  {filtered.map((q) => {
                    const difficulty = (q.difficulty || "Intermediate") as Difficulty;
                    const isBookmarked = bookmarks.includes(q.id);
                    const isDone = completed.includes(q.id);

                    return (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Card className="group relative h-full bg-card/80 border-border/40 rounded-2xl p-5 flex flex-col hover:border-primary/50 hover:shadow-glow transition-all duration-300">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-md border ${difficultyClasses(
                                  difficulty
                                )}`}
                              >
                                {difficulty}
                              </span>
                              {q.role && (
                                <Badge variant="secondary" className="text-[10px] font-medium">
                                  {q.role}
                                </Badge>
                              )}
                              {q.topic && (
                                <span className="text-[10px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md">
                                  {q.topic}
                                </span>
                              )}
                              {(q.tags || []).slice(0, 1).map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                            <button
                              onClick={() => toggleBookmark(q.id)}
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

                          <h3 className="font-display font-semibold text-base leading-snug mb-2 line-clamp-3 flex-1">
                            {q.question}
                          </h3>

                          <div className="flex items-center justify-between mt-3">
                            {isDone ? (
                              <span className="text-xs text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Ready to solve</span>
                            )}
                            <Button
                              size="sm"
                              onClick={() => openQuestion(q)}
                              className="bg-gradient-primary text-primary-foreground gap-1.5 shadow-glow"
                            >
                              Start Question
                              <Play className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="company">
              <h2 className="text-xl font-bold mt-4 mb-2">Company-wise interview questions</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Real interview questions asked by top companies hiring Cloud and DevOps talent.
              </p>
              <CompanyJobsTable rows={companyRows} loading={companyLoading} search={search} />
            </TabsContent>

            <TabsContent value="topic">
              <h2 className="text-xl font-bold mt-4 mb-2">Topic-wise interview questions</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Study questions grouped by technology and topic, from AWS and Docker to Kubernetes and Terraform.
              </p>
              <GroupedTable
                rows={filtered}
                groupBy="topic"
                emptyLabel="No topic tagged questions yet."
                onOpen={openQuestion}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && closeQuestion()}>
        <DialogContent className="max-w-5xl w-[95vw] p-0 overflow-hidden bg-card border-border/40">
          {active && (
            <div className="grid grid-cols-1 lg:grid-cols-2 max-h-[85vh]">
              <div className="p-6 lg:border-r border-border/30 overflow-y-auto">
                <DialogHeader className="text-left mb-4">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className={`text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-md border ${difficultyClasses(
                        active.difficulty || "Intermediate"
                      )}`}
                    >
                      {active.difficulty || "Intermediate"}
                    </span>
                    {active.role && (
                      <Badge variant="secondary" className="text-[10px]">
                        {active.role}
                      </Badge>
                    )}
                    {active.topic && (
                      <span className="text-[10px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md">
                        {active.topic}
                      </span>
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
                  <DialogTitle className="text-xl font-display">Question</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 text-sm">
                  <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {active.question}
                  </p>
                </div>
              </div>

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
                  placeholder="Type your answer here..."
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
                    <Button variant="outline" onClick={() => setShowHint((v) => !v)} className="gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      {showHint ? "Hide Hint" : "Show Hint"}
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => setRevealed(true)} className="gap-2">
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
                        The admin hasn't added a solution for this question yet.
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                  <p>Ask me anything about interview questions.</p>
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
                placeholder="Ask about questions..."
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
      {hasData ? "No questions match your filters" : "No questions available yet"}
    </h3>
    <p className="text-sm text-muted-foreground max-w-md mb-6">
      {hasData
        ? "Try adjusting your search, role, topic or difficulty filters."
        : "Questions will appear here once added by admin."}
    </p>
    <Button variant="outline" onClick={onRefresh} className="gap-2">
      <RefreshCw className="w-4 h-4" /> Refresh
    </Button>
  </div>
);

interface GroupedTableProps {
  rows: QuestionRow[];
  groupBy: "company" | "topic";
  emptyLabel: string;
  onOpen: (q: QuestionRow) => void;
}

const GroupedTable = ({ rows, groupBy, emptyLabel, onOpen }: GroupedTableProps) => {
  const groups = useMemoGroups(rows, groupBy);
  const groupKeys = Object.keys(groups).sort((a, b) => a.localeCompare(b));

  if (groupKeys.length === 0) {
    return (
      <div className="text-center py-16 mt-4 rounded-2xl border border-dashed border-border/40 bg-card/40">
        <Inbox className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-4">
      {groupKeys.map((key) => (
        <Card key={key} className="bg-card/70 border-border/40 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/30 flex items-center justify-between bg-card/40">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-sm">{key}</h3>
              <Badge variant="secondary" className="text-[10px]">
                {groups[key].length}
              </Badge>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[45%]">Question</TableHead>
                <TableHead>{groupBy === "company" ? "Topic" : "Role"}</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right w-28">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups[key].map((q) => (
                <TableRow key={q.id} className="cursor-pointer" onClick={() => onOpen(q)}>
                  <TableCell className="font-medium max-w-md">
                    <span className="line-clamp-2">{q.question}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {groupBy === "company" ? q.topic || "—" : q.role || "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-md border ${difficultyClasses(
                        q.difficulty || "Intermediate"
                      )}`}
                    >
                      {q.difficulty || "Intermediate"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                      {(q.tags || []).slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen(q);
                      }}
                      className="gap-1.5"
                    >
                      <Play className="w-3 h-3" />
                      Solve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ))}
    </div>
  );
};

const useMemoGroups = (rows: QuestionRow[], key: "company" | "topic") => {
  return useMemo(() => {
    const map: Record<string, QuestionRow[]> = {};
    rows.forEach((r) => {
      const raw = (r[key] as string | null) || "";
      const label = raw.trim() || (key === "company" ? "Unspecified Company" : "Unspecified Topic");
      if (!map[label]) map[label] = [];
      map[label].push(r);
    });
    // Hide the catch-all bucket if it's the only thing and empty-ish
    if (key === "company") {
      const onlyKey = Object.keys(map);
      if (onlyKey.length === 1 && onlyKey[0] === "Unspecified Company") {
        return {};
      }
    }
    return map;
  }, [rows, key]);
};

interface CompanyJobsTableProps {
  rows: CompanyQuestionRow[];
  loading: boolean;
  search: string;
}

const CompanyJobsTable = ({ rows, loading, search }: CompanyJobsTableProps) => {
  const q = search.toLowerCase().trim();
  const filtered = q
    ? rows.filter(
        (j) =>
          j.company?.toLowerCase().includes(q) ||
          (j.role || "").toLowerCase().includes(q) ||
          (j.location || "").toLowerCase().includes(q) ||
          (j.skills || []).some((s) => s.toLowerCase().includes(q)) ||
          j.question?.toLowerCase().includes(q)
      )
    : rows;

  if (loading) {
    return (
      <div className="mt-4 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="h-14 bg-card/60 border-border/30 animate-pulse" />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16 mt-4 rounded-2xl border border-dashed border-border/40 bg-card/40">
        <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          No company-wise questions available yet.
        </p>
      </div>
    );
  }

  return (
    <Card className="bg-card/70 border-border/40 overflow-hidden mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[16%]">Company</TableHead>
            <TableHead className="w-[14%]">Role</TableHead>
            <TableHead className="w-[14%]">Location</TableHead>
            <TableHead className="w-[20%]">Skills</TableHead>
            <TableHead>Question</TableHead>
            <TableHead className="text-right w-32">Document</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((j) => (
            <TableRow key={j.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span>{j.company}</span>
                </div>
              </TableCell>
              <TableCell>{j.role || "—"}</TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {j.location || "—"}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[260px]">
                  {(j.skills || []).slice(0, 4).map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px]">
                      {s}
                    </Badge>
                  ))}
                  {(j.skills || []).length > 4 && (
                    <span className="text-[10px] text-muted-foreground self-center">
                      +{(j.skills || []).length - 4}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="max-w-md">
                <span className="line-clamp-2 text-sm">{j.question}</span>
              </TableCell>
              <TableCell className="text-right">
                {j.document_link ? (
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-primary text-primary-foreground gap-1.5 shadow-glow"
                  >
                    <a href={j.document_link} target="_blank" rel="noopener noreferrer">
                      Open Link
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default InterviewQuestionsPage;
