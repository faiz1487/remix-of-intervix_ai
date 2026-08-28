import Seo from "@/components/Seo";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Send, Sparkles, ArrowLeft, Loader2, LogOut, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { streamChat, type Msg } from "@/lib/chat";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import VoiceAssistant from "@/components/VoiceAssistant";
import {
  FileSearch, FilePlus2, MessageSquareMore, AlertTriangle,
  Map, ExternalLink, UserSearch, Mail, Linkedin, Briefcase, Target, MessageSquareHeart,
} from "lucide-react";

const quickActions = [
  { icon: Target, label: "AI Job Match", prompt: "__NAV__/modules/ai-job-match" },
  { icon: FileSearch, label: "ATS Resume Sample", prompt: "__NAV__/modules/ats-resume-score" },

  { icon: FilePlus2, label: "Create ATS Resume", prompt: "__NAV__/ats-resume-builder" },
  { icon: MessageSquareMore, label: "Interview Questions", prompt: "__NAV__/modules/interview-questions" },
  { icon: AlertTriangle, label: "Scenario Questions", prompt: "__NAV__/modules/scenario-questions" },
  { icon: Map, label: "Prep Roadmap", prompt: "__NAV__/modules/prep-roadmap" },
  { icon: Mic, label: "Mock Interview", prompt: "__NAV__/modules/mock-interview" },
  { icon: ExternalLink, label: "Job Links", prompt: "__NAV__/modules/job-links" },
  { icon: UserSearch, label: "HR Contacts", prompt: "__NAV__/modules/hr-contacts" },
  { icon: Mail, label: "Cold Email", prompt: "__NAV__/modules/cold-email" },
  { icon: Linkedin, label: "LinkedIn Optimizer", prompt: "__NAV__/modules/linkedin-optimizer" },
  { icon: Briefcase, label: "Naukri Optimizer", prompt: "__NAV__/modules/naukri-optimizer" },
  { icon: MessageSquareHeart, label: "Feedback & Suggestions", prompt: "__NAV__/modules/feedback" },
];

const Chat = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [user, setUser] = useState<{ name: string; avatar: string; email: string } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        setUser({
          name: meta?.full_name || meta?.name || session.user.email || "User",
          avatar: meta?.avatar_url || meta?.picture || "",
          email: session.user.email || "",
        });
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    if (text.startsWith("__NAV__")) {
      navigate(text.replace("__NAV__", ""));
      return;
    }
    const userMsg: Msg = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: upsertAssistant,
        onDone: () => setIsLoading(false),
        onError: (err) => {
          toast.error(err);
          setIsLoading(false);
        },
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="aurora pointer-events-none" />
      <Seo
        path="/chat"
        title="AI Career Assistant Chat — Intervixa AI"
        description="Chat with the Intervixa AI career assistant for resume feedback, interview answers and job search guidance."
        noindex
      />
      {/* Header */}
      <header className="glass border-b border-border/30 px-4 py-3 flex items-center justify-between shrink-0 relative z-[2]">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm">Intervixa AI — Your Career Assistant</h1>
            <p className="text-xs text-muted-foreground">
              {voiceMode ? "Voice Assistant" : "Your AI Career Assistant"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={voiceMode ? "default" : "ghost"}
            size="sm"
            onClick={() => setVoiceMode(!voiceMode)}
            className={`gap-1.5 rounded-full ${voiceMode ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">Voice</span>
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full hover:bg-secondary/50 px-2 py-1 transition-colors">
                  <span className="text-sm text-muted-foreground hidden sm:block">{user.name}</span>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Content */}
      {voiceMode ? (
        <div className="flex-1 overflow-y-auto px-4 py-6 relative z-[1]">
          <div className="max-w-3xl mx-auto">
            <VoiceAssistant />
          </div>
        </div>
      ) : (
      <div className="flex-1 overflow-y-auto px-4 py-6 relative z-[1]">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
              <div className="text-center pt-8">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center shadow-glow"
                  animate={{ y: [0, -8, 0], rotate: [0, 4, -4, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-display text-2xl font-bold mb-2"
                >
                  How can I help you today?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-muted-foreground text-sm max-w-md mx-auto"
                >
                  Choose a module below or type your career question to get started.
                </motion.p>
              </div>
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
              >
                {quickActions.map((action) => (
                  <motion.button
                    key={action.label}
                    variants={{ hidden: { opacity: 0, y: 16, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1 } }}
                    whileHover={{ y: -4, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 320, damping: 22 }}
                    onClick={() => send(action.prompt)}
                    className="group relative overflow-hidden p-4 rounded-xl glass hover:border-primary/30 transition-colors duration-300 hover:shadow-glow text-left"
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
                    <action.icon className="w-5 h-5 text-primary mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 transition-shadow duration-300 hover:shadow-glow ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "glass"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_p]:text-foreground [&_li]:text-foreground [&_strong]:text-primary [&_code]:text-primary [&_a]:text-primary">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="glass rounded-2xl px-4 py-3 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
      )}

      {/* Input - only show in text mode */}
      {!voiceMode && (
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="shrink-0 border-t border-border/30 glass px-4 py-3 relative z-[1]"
      >
        <div className="max-w-3xl mx-auto flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about resumes, interviews, job search..."
            rows={1}
            className="flex-1 bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 placeholder:text-muted-foreground transition-all duration-300 hover:border-primary/30"
          />
          <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }}>
            <Button
              onClick={() => send(input)}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="bg-gradient-primary text-primary-foreground h-12 w-12 rounded-xl shadow-glow hover:opacity-90 transition-opacity shrink-0"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </motion.div>
        </div>
      </motion.div>
      )}
    </div>
  );
};

export default Chat;
