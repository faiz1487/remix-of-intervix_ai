import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Network,
  Github,
  Cloud,
  Container,
  Ship,
  Layers,
  GitBranch,
  Activity,
  MessageSquare,
  ChevronDown,
  Search,
  Sparkles,
  Play,
  Trophy,
  Flame,
  Clock,
  Award,
  Target,
  Bot,
  GraduationCap,
  Route as RouteIcon,
  FileSearch,
  HelpCircle,
  X,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import ModuleHeader from "@/components/modules/ModuleHeader";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import Seo from "@/components/Seo";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type Status = "Completed" | "In Progress" | "Not Started";

interface Module {
  id: string;
  title: string;
  icon: React.ElementType;
  difficulty: Difficulty;
  duration: string;
  progress: number;
  topics: string[];
  topicLinks: Record<string, string>;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Terminal, Network, Github, Cloud, Container, Ship, Layers, GitBranch, Activity, MessageSquare,
};

const aiFeatures = [
  { icon: Bot, title: "AI Mentor", desc: "24/7 personal DevOps coach" },
  { icon: GraduationCap, title: "AI Mock Interview", desc: "Realistic voice interview drills" },
  { icon: RouteIcon, title: "AI Roadmap Generator", desc: "Personalized learning path" },
  { icon: Target, title: "AI Career Guidance", desc: "Role & salary recommendations" },
  { icon: FileSearch, title: "AI Resume Review", desc: "Instant ATS-aligned feedback" },
];

const filters: (Difficulty | Status | "All")[] = ["All", "Beginner", "Intermediate", "Advanced", "Completed", "In Progress"];

const difficultyColor = (d: Difficulty) =>
  d === "Beginner" ? "bg-primary/15 text-primary border-primary/30"
  : d === "Intermediate" ? "bg-glow-secondary/15 text-glow-secondary border-glow-secondary/30"
  : "bg-destructive/15 text-destructive border-destructive/30";

const statusOf = (p: number): Status => p >= 100 ? "Completed" : p > 0 ? "In Progress" : "Not Started";

const PrepRoadmapPage = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    supabase
      .from("roadmap_modules")
      .select("*")
      .order("order_index", { ascending: true })
      .then(({ data }) => {
        if (!data) return;
        const mapped: Module[] = data.map((r: any) => ({
          id: r.id,
          title: r.title,
          icon: ICON_MAP[r.icon_name] || Cloud,
          difficulty: (r.difficulty as Difficulty) || "Beginner",
          duration: r.duration,
          progress: r.progress ?? 0,
          topics: r.topics || [],
          topicLinks: (r.topic_links as Record<string, string>) || {},

        }));
        setModules(mapped);
        if (mapped.length && !expanded) setExpanded(mapped[0].id);
      });
  }, []);

  const overall = modules.length ? Math.round(modules.reduce((s, m) => s + m.progress, 0) / modules.length) : 0;
  const completed = modules.filter(m => m.progress >= 100).length;

  const filtered = useMemo(() => {
    return modules.filter(m => {
      const q = query.toLowerCase();
      const matchQ = !q || m.title.toLowerCase().includes(q) || m.topics.some(t => t.toLowerCase().includes(q));
      const status = statusOf(m.progress);
      const matchF =
        filter === "All" ? true
        : filter === "Completed" || filter === "In Progress" ? status === filter
        : m.difficulty === filter;
      return matchQ && matchF;
    });
  }, [query, filter]);

  return (
    <div className="min-h-screen bg-hero">
      <Seo
        path="/roadmap"
        title="Cloud & DevOps Career Roadmap — Intervixa AI"
        description="Explore a structured Cloud and DevOps career roadmap with skill paths, milestones, role-ready learning tracks and curated topic resources."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: "Cloud & DevOps Career Roadmap",
          description: "Step-by-step Cloud and DevOps learning roadmap with modules, topics and resources.",
          url: "https://intervixa.online/roadmap",
        }}
      />
      <Navbar />

      <main className="container mx-auto px-4 pt-28 pb-20 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <ModuleHeader
            title="Cloud & DevOps Engineer Roadmap"
            description="Master Linux, Cloud, Docker, Kubernetes, Monitoring, CI/CD and DevOps Interview Preparation"
            icon={<RouteIcon className="w-5 h-5 text-primary" />}
            titleClassName="text-4xl md:text-5xl text-gradient"
          />
          <div className="mt-4">
            <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/20 gap-1">
              <Sparkles className="w-3 h-3" /> AI Recommended Path
            </Badge>
          </div>

          <Card className="glass mt-8 p-6 shadow-card">
            <div className="flex flex-wrap items-center gap-6 justify-between">
              <div className="flex-1 min-w-[260px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Overall Progress</span>
                  <span className="text-sm font-semibold text-primary">{overall}%</span>
                </div>
                <Progress value={overall} className="h-2" />
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ~16 weeks remaining</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> {completed}/{modules.length} modules</span>
                </div>
              </div>
              <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 gap-2">
                <Play className="w-4 h-4" /> Continue Learning
              </Button>
            </div>
          </Card>

          <div className="mt-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-sm md:text-base text-foreground/90">
              Sign in to track your roadmap progress, save completed topics and get AI-powered mock interviews.
            </p>
            <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow shrink-0">
              <Link to="/login?next=/roadmap">
                Save My Progress <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[
            { icon: Trophy, label: "Modules Done", value: completed },
            { icon: Flame, label: "Day Streak", value: 12 },
            { icon: Target, label: "Interview Ready", value: `${Math.min(95, overall + 15)}%` },
            { icon: Clock, label: "Practice Hours", value: 47 },
            { icon: Award, label: "Certificates", value: 3 },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="glass p-4 hover:shadow-glow transition-all hover:-translate-y-0.5">
                <s.icon className="w-5 h-5 text-primary mb-2" />
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search modules or topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 glass border-border/50"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
                className={cn(
                  "transition-all",
                  filter === f && "bg-gradient-primary text-primary-foreground shadow-glow"
                )}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        {/* Roadmap Flow */}
        <div className="space-y-4 mb-16">
          {filtered.map((m, idx) => {
            const isOpen = expanded === m.id;
            const Icon = m.icon;
            return (
              <div key={m.id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Card
                    className={cn(
                      "glass overflow-hidden transition-all duration-300 hover:shadow-glow hover:border-primary/40 cursor-pointer",
                      isOpen && "border-primary/50 shadow-glow"
                    )}
                    onClick={() => setExpanded(isOpen ? null : m.id)}
                  >
                    <div className="p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow shrink-0">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-lg truncate">{m.title}</h3>
                          <Badge variant="outline" className={cn("text-xs", difficultyColor(m.difficulty))}>
                            {m.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {m.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={m.progress} className="h-1.5 flex-1 max-w-xs" />
                          <span className="text-xs text-muted-foreground">{m.progress}%</span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); }}
                        className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 gap-1 hidden sm:inline-flex"
                      >
                        <Play className="w-3 h-3" /> Start
                      </Button>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      </motion.div>
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="px-5 pb-5 pt-1 border-t border-border/50">
                            <p className="text-xs text-muted-foreground mt-3 mb-3 uppercase tracking-wider">Topics covered</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {m.topics.map(t => {
                                const href = m.topicLinks?.[t];
                                const cls = "flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/40 border border-border/40 hover:border-primary/40 hover:bg-secondary/60 transition-all text-sm";
                                return href ? (
                                  <a key={t} href={href} target="_blank" rel="noopener noreferrer" className={cls} title={`Open document: ${t}`}>
                                    <ExternalLink className="w-3 h-3 text-primary shrink-0" />
                                    <span className="truncate underline-offset-4 hover:underline">{t}</span>
                                  </a>
                                ) : (
                                  <div key={t} className={cls}>
                                    <ArrowRight className="w-3 h-3 text-primary shrink-0" />
                                    <span className="truncate">{t}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>

                {idx < filtered.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div className="w-px h-6 bg-gradient-to-b from-primary/60 to-transparent" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* AI Features */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-2">AI-Powered Tools</h2>
          <p className="text-muted-foreground mb-6">Accelerate your prep with built-in AI assistants</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {aiFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="glass p-5 h-full hover:shadow-glow hover:-translate-y-1 hover:border-primary/40 transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center mb-3 shadow-glow group-hover:scale-110 transition-transform">
                    <f.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Floating AI Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {assistantOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="mb-3 w-72"
            >
              <Card className="glass p-4 shadow-glow border-primary/40">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="font-semibold text-sm">Intervixa AI</span>
                  </div>
                  <button onClick={() => setAssistantOpen(false)} aria-label="Close AI assistant" className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Need help choosing your roadmap? I can recommend the perfect path based on your goals.
                </p>
                <Button size="sm" className="w-full bg-gradient-primary text-primary-foreground" onClick={() => window.location.assign("/chat")}>
                  Ask Intervixa AI
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setAssistantOpen(v => !v)}
          className="w-14 h-14 rounded-full bg-gradient-primary shadow-glow flex items-center justify-center hover:scale-110 transition-transform animate-pulse"
          aria-label="Open AI assistant"
        >
          {assistantOpen ? <X className="w-6 h-6 text-primary-foreground" /> : <HelpCircle className="w-6 h-6 text-primary-foreground" />}
        </button>
      </div>
    </div>
  );
};

export default PrepRoadmapPage;
