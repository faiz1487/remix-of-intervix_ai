import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Loader2, Linkedin, Target, TrendingUp,
  CheckCircle2, AlertTriangle, Award, Lightbulb, Zap, Calendar,
  Image as ImageIcon, FileText, ChevronDown, ChevronUp, Users, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { parseResumeFile } from "@/lib/resume-parser";
import ModuleHeader from "@/components/modules/ModuleHeader";

interface LinkedInAnalysis {
  experienceLevel: string;
  overallScore: number;
  scores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  missingRecruiterSignals: string[];
  headline: any;
  aboutSection: any;
  summary: any;
  keySkills: any;
  experienceImprovements: { before: string; after: string }[];
  projectImprovements: { title: string; improvedDescription: string; techStack: string[]; businessImpact: string }[];
  certifications: any;
  atsKeywordAnalysis: any;
  bannerAndPhoto: any;
  recruiterVisibility: any;
  contentStrategy: any;
  networking: any;
  roadmap: any;
  finalVerdict: string;
}

const EXPERIENCE_LEVELS = ["Fresher", "1-3 Years", "Mid-Level", "Senior", "Managerial"];

const SCORE_LABELS: Record<string, string> = {
  ssiScore: "SSI Score",
  recruiterVisibility: "Recruiter Visibility",
  keywordOptimization: "Keyword Optimization",
  headlineStrength: "Headline Strength",
  aboutSectionQuality: "About Section Quality",
  experienceStrength: "Experience Strength",
  skillsEndorsements: "Skills & Endorsements",
  personalBranding: "Personal Branding",
  networkQuality: "Network Quality",
  contentEngagement: "Content Engagement",
};

const scoreColor = (n: number) =>
  n >= 80 ? "text-emerald-400" : n >= 60 ? "text-amber-400" : "text-rose-400";

const Section = ({ title, icon, children, defaultOpen = false }: any) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass rounded-2xl overflow-hidden border border-border/40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            {icon}
          </div>
          <h3 className="font-display font-semibold text-sm">{title}</h3>
        </div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LinkedInOptimizerPage = () => {
  const [profileText, setProfileText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Mid-Level");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [analysis, setAnalysis] = useState<LinkedInAnalysis | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsing(true);
    try {
      const text = await parseResumeFile(file);
      setProfileText(text);
      toast.success(`Parsed "${file.name}" successfully!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to parse file.");
    } finally {
      setIsParsing(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result as string);
      setImageName(file.name);
      toast.success("Screenshot ready for analysis");
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!profileText.trim() && !imageDataUrl) {
      toast.error("Upload a screenshot, resume, or paste your LinkedIn profile content.");
      return;
    }
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const { data, error } = await supabase.functions.invoke("linkedin-optimizer", {
        body: { profileText, targetRole, experienceLevel, imageDataUrl },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAnalysis(data);
      toast.success("Profile analysis complete!");
    } catch (e: any) {
      toast.error(e.message || "Analysis failed. Try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ModuleHeader
        title="LinkedIn Optimizer"
        description="SSI + recruiter visibility + personal branding"
        icon={<Linkedin className="w-5 h-5 text-primary" />}
        className="glass border-b border-border/30 px-4 py-3 shrink-0 z-10"
      />

      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
          {/* Input Card */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 space-y-5 shadow-glow">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-display font-semibold text-base">Profile Analysis</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5">🎯 Target Role</label>
                <input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full bg-muted/50 border border-border/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">📊 Experience Level</label>
                <div className="flex flex-wrap gap-2">
                  {EXPERIENCE_LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setExperienceLevel(lvl)}
                      className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                        experienceLevel === lvl
                          ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
                          : "border-border/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">📄 LinkedIn Profile / Resume Content</label>
              <div className="flex flex-wrap gap-2 mb-2">
                <input ref={fileRef} type="file" accept=".pdf,.docx" onChange={handleResumeUpload} className="hidden" />
                <input ref={imageRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={isParsing} className="rounded-xl text-xs">
                  {isParsing ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <FileText className="w-3.5 h-3.5 mr-1" />}
                  Upload Resume (PDF/DOCX)
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => imageRef.current?.click()} className="rounded-xl text-xs">
                  <ImageIcon className="w-3.5 h-3.5 mr-1" /> Upload LinkedIn Screenshot
                </Button>
                {imageDataUrl && (
                  <Badge variant="secondary" className="text-xs">📸 {imageName}</Badge>
                )}
              </div>
              <textarea
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                placeholder="Paste your LinkedIn headline, about, skills, experience, and projects here..."
                rows={8}
                className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-gradient-primary text-primary-foreground h-12 rounded-xl shadow-glow hover:opacity-90 font-semibold text-sm"
            >
              {isAnalyzing ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Analyzing Profile...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Run Recruiter-Grade Analysis</>
              )}
            </Button>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {analysis && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                {/* Overall Score */}
                <div className="glass rounded-2xl p-6 border border-primary/20 shadow-glow">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Overall LinkedIn Score</p>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-5xl font-display font-bold ${scoreColor(analysis.overallScore)}`}>
                          {analysis.overallScore}
                        </span>
                        <span className="text-muted-foreground text-lg">/100</span>
                      </div>
                      <Badge variant="secondary" className="mt-2 text-xs">{analysis.experienceLevel}</Badge>
                    </div>
                    <div className="flex-1 max-w-md w-full">
                      <Progress value={analysis.overallScore} className="h-3" />
                      <p className="text-xs text-muted-foreground mt-2 italic">{analysis.finalVerdict}</p>
                    </div>
                  </div>
                </div>

                {/* Score Grid */}
                <div className="glass rounded-2xl p-5">
                  <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" /> Scorecard
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(analysis.scores || {}).map(([k, v]) => (
                      <div key={k} className="bg-muted/30 rounded-xl p-3">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs text-muted-foreground">{SCORE_LABELS[k] || k}</span>
                          <span className={`text-sm font-bold ${scoreColor(v as number)}`}>{v}</span>
                        </div>
                        <Progress value={v as number} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass rounded-2xl p-5 border border-emerald-500/20">
                    <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Strengths
                    </h3>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {analysis.strengths?.map((s, i) => <li key={i}>• {s}</li>)}
                    </ul>
                  </div>
                  <div className="glass rounded-2xl p-5 border border-amber-500/20">
                    <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2 text-amber-400">
                      <AlertTriangle className="w-4 h-4" /> Weaknesses
                    </h3>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {analysis.weaknesses?.map((w, i) => <li key={i}>• {w}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="glass rounded-2xl p-5">
                  <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" /> Missing Keywords & Recruiter Signals
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">Missing Search Keywords</p>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.missingKeywords?.map((k, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-rose-500/30 text-rose-300">{k}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">Missing Recruiter Signals</p>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.missingRecruiterSignals?.map((k, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-amber-500/30 text-amber-300">{k}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Sections */}
                <Section title="Headline Optimization" icon={<Sparkles className="w-4 h-4 text-primary-foreground" />} defaultOpen>
                  <div><b className="text-foreground">Current Analysis:</b> {analysis.headline?.currentAnalysis}</div>
                  <div className="bg-muted/30 rounded-xl p-3"><b className="text-primary">Recommended:</b> {analysis.headline?.recommended}</div>
                  <div className="bg-muted/30 rounded-xl p-3"><b className="text-primary">Search Optimized:</b> {analysis.headline?.atsOptimized}</div>
                  <div className="bg-muted/30 rounded-xl p-3"><b className="text-primary">Senior Positioning:</b> {analysis.headline?.seniorPositioning}</div>
                  <div>
                    <b className="text-foreground">Variations:</b>
                    <ul className="mt-1 space-y-1">{analysis.headline?.variations?.map((v: string, i: number) => <li key={i}>→ {v}</li>)}</ul>
                  </div>
                  <div className="text-xs italic">{analysis.headline?.whyItWorks}</div>
                </Section>

                <Section title="About Section" icon={<FileText className="w-4 h-4 text-primary-foreground" />}>
                  <div className="bg-muted/30 rounded-xl p-3 whitespace-pre-wrap"><b className="text-primary">Professional:</b> {analysis.aboutSection?.professional}</div>
                  <div className="bg-muted/30 rounded-xl p-3 whitespace-pre-wrap"><b className="text-primary">Storytelling Version:</b> {analysis.aboutSection?.storytellingVersion}</div>
                  <div className="bg-muted/30 rounded-xl p-3 whitespace-pre-wrap"><b className="text-primary">Recruiter-Focused:</b> {analysis.aboutSection?.recruiterFocused}</div>
                  <div className="bg-muted/30 rounded-xl p-3 whitespace-pre-wrap"><b className="text-primary">{analysis.experienceLevel} Specific:</b> {analysis.aboutSection?.levelSpecific}</div>
                </Section>

                <Section title="Profile Summary" icon={<FileText className="w-4 h-4 text-primary-foreground" />}>
                  <div className="bg-muted/30 rounded-xl p-3"><b className="text-primary">Professional:</b> {analysis.summary?.professional}</div>
                  <div className="bg-muted/30 rounded-xl p-3"><b className="text-primary">Keyword-Rich:</b> {analysis.summary?.atsRich}</div>
                  <div className="bg-muted/30 rounded-xl p-3"><b className="text-primary">Impact-Focused:</b> {analysis.summary?.productionFocused}</div>
                  <div className="bg-muted/30 rounded-xl p-3"><b className="text-primary">{analysis.experienceLevel} Specific:</b> {analysis.summary?.levelSpecific}</div>
                </Section>

                <Section title="Key Skills Optimization" icon={<Zap className="w-4 h-4 text-primary-foreground" />}>
                  <div>{analysis.keySkills?.currentAnalysis}</div>
                  <div>
                    <b className="text-foreground">Recommended Order (top 10 pin to top):</b>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {analysis.keySkills?.recommendedOrder?.map((s: string, i: number) => (
                        <Badge key={i} className={`text-xs ${i < 10 ? "bg-gradient-primary text-primary-foreground" : ""}`} variant={i < 10 ? "default" : "outline"}>
                          {i + 1}. {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <b className="text-foreground">Trending:</b>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {analysis.keySkills?.trending?.map((s: string, i: number) => <Badge key={i} variant="outline" className="text-xs border-primary/40 text-primary">{s}</Badge>)}
                    </div>
                  </div>
                  <div className="text-xs italic">{analysis.keySkills?.explanation}</div>
                </Section>

                <Section title="Experience Improvements" icon={<TrendingUp className="w-4 h-4 text-primary-foreground" />}>
                  {analysis.experienceImprovements?.map((imp, i) => (
                    <div key={i} className="bg-muted/30 rounded-xl p-3 space-y-2">
                      <div className="text-xs"><b className="text-rose-400">Before:</b> {imp.before}</div>
                      <div className="text-xs"><b className="text-emerald-400">After:</b> {imp.after}</div>
                    </div>
                  ))}
                </Section>

                <Section title="Project Optimization" icon={<Award className="w-4 h-4 text-primary-foreground" />}>
                  {analysis.projectImprovements?.map((p, i) => (
                    <div key={i} className="bg-muted/30 rounded-xl p-3 space-y-2">
                      <div className="font-semibold text-foreground text-sm">{p.title}</div>
                      <div className="text-xs">{p.improvedDescription}</div>
                      <div className="flex flex-wrap gap-1">{p.techStack?.map((t, j) => <Badge key={j} variant="outline" className="text-[10px]">{t}</Badge>)}</div>
                      <div className="text-xs italic"><b>Impact:</b> {p.businessImpact}</div>
                    </div>
                  ))}
                </Section>

                <Section title="Certifications" icon={<Award className="w-4 h-4 text-primary-foreground" />}>
                  <div><b className="text-foreground">Recommended:</b> {analysis.certifications?.recommended?.join(", ")}</div>
                  <div><b className="text-foreground">High Value:</b> {analysis.certifications?.highValue?.join(", ")}</div>
                  <div className="italic">{analysis.certifications?.reasoning}</div>
                </Section>

                <Section title="Keyword Analysis" icon={<Target className="w-4 h-4 text-primary-foreground" />}>
                  <div><b className="text-foreground">Missing:</b> <div className="flex flex-wrap gap-1 mt-1">{analysis.atsKeywordAnalysis?.missing?.map((k: string, i: number) => <Badge key={i} variant="outline" className="text-xs">{k}</Badge>)}</div></div>
                  <div><b className="text-foreground">Trending:</b> <div className="flex flex-wrap gap-1 mt-1">{analysis.atsKeywordAnalysis?.trending?.map((k: string, i: number) => <Badge key={i} variant="outline" className="text-xs border-primary/40 text-primary">{k}</Badge>)}</div></div>
                  <div><b className="text-foreground">Industry:</b> <div className="flex flex-wrap gap-1 mt-1">{analysis.atsKeywordAnalysis?.industry?.map((k: string, i: number) => <Badge key={i} variant="outline" className="text-xs">{k}</Badge>)}</div></div>
                  <div className="italic text-xs">{analysis.atsKeywordAnalysis?.explanation}</div>
                </Section>

                <Section title="Banner & Profile Photo" icon={<ImageIcon className="w-4 h-4 text-primary-foreground" />}>
                  <div className="bg-muted/30 rounded-xl p-3"><b className="text-primary">Profile Photo:</b> {analysis.bannerAndPhoto?.profilePhoto}</div>
                  <div className="bg-muted/30 rounded-xl p-3"><b className="text-primary">Banner Strategy:</b> {analysis.bannerAndPhoto?.bannerStrategy}</div>
                  <div className="bg-muted/30 rounded-xl p-3"><b className="text-primary">Visual Branding:</b> {analysis.bannerAndPhoto?.visualBranding}</div>
                </Section>

                <Section title="Recruiter Visibility Hacks" icon={<TrendingUp className="w-4 h-4 text-primary-foreground" />}>
                  <div className="bg-muted/30 rounded-xl p-3"><b className="text-primary">Algorithm:</b> {analysis.recruiterVisibility?.algorithmInsights}</div>
                  <div className="bg-muted/30 rounded-xl p-3"><b className="text-primary">Daily Strategy:</b> {analysis.recruiterVisibility?.dailyStrategy}</div>
                  <div className="bg-muted/30 rounded-xl p-3"><b className="text-primary">Update Frequency:</b> {analysis.recruiterVisibility?.updateFrequency}</div>
                  <div className="bg-muted/30 rounded-xl p-3"><b className="text-primary">Best Time to Post:</b> {analysis.recruiterVisibility?.bestTimeToPost}</div>
                  <div className="bg-muted/30 rounded-xl p-3"><b className="text-primary">#OpenToWork Strategy:</b> {analysis.recruiterVisibility?.openToWorkStrategy}</div>
                </Section>

                <Section title="Content Strategy" icon={<MessageSquare className="w-4 h-4 text-primary-foreground" />}>
                  <div><b className="text-foreground">Post Ideas:</b><ul className="mt-1 space-y-1">{analysis.contentStrategy?.postIdeas?.map((s: string, i: number) => <li key={i}>• {s}</li>)}</ul></div>
                  <div><b className="text-foreground">Engagement Tactics:</b><ul className="mt-1 space-y-1">{analysis.contentStrategy?.engagementTactics?.map((s: string, i: number) => <li key={i}>• {s}</li>)}</ul></div>
                  <div><b className="text-foreground">Hashtag Strategy:</b>
                    <div className="flex flex-wrap gap-1.5 mt-1">{analysis.contentStrategy?.hashtagStrategy?.map((s: string, i: number) => <Badge key={i} variant="outline" className="text-xs border-primary/40 text-primary">{s}</Badge>)}</div>
                  </div>
                </Section>

                <Section title="Networking & Outreach" icon={<Users className="w-4 h-4 text-primary-foreground" />}>
                  <div><b className="text-foreground">Connection Strategy:</b><ul className="mt-1 space-y-1">{analysis.networking?.connectionStrategy?.map((s: string, i: number) => <li key={i}>• {s}</li>)}</ul></div>
                  <div><b className="text-foreground">Message Templates:</b><ul className="mt-1 space-y-1">{analysis.networking?.messageTemplates?.map((s: string, i: number) => <li key={i} className="bg-muted/30 rounded-lg p-2">{s}</li>)}</ul></div>
                  <div><b className="text-foreground">Recruiter Outreach:</b><ul className="mt-1 space-y-1">{analysis.networking?.recruiterOutreach?.map((s: string, i: number) => <li key={i} className="bg-muted/30 rounded-lg p-2">{s}</li>)}</ul></div>
                </Section>

                <Section title="Final Improvement Roadmap" icon={<Calendar className="w-4 h-4 text-primary-foreground" />} defaultOpen>
                  <div>
                    <b className="text-emerald-400 flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Quick Wins:</b>
                    <ul className="mt-1 space-y-1">{analysis.roadmap?.quickWins?.map((s: string, i: number) => <li key={i}>✓ {s}</li>)}</ul>
                  </div>
                  <div>
                    <b className="text-amber-400 flex items-center gap-1"><Lightbulb className="w-3.5 h-3.5" /> Priority:</b>
                    <ul className="mt-1 space-y-1">{analysis.roadmap?.priorityImprovements?.map((s: string, i: number) => <li key={i}>→ {s}</li>)}</ul>
                  </div>
                  <div>
                    <b className="text-primary flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Advanced:</b>
                    <ul className="mt-1 space-y-1">{analysis.roadmap?.advanced?.map((s: string, i: number) => <li key={i}>★ {s}</li>)}</ul>
                  </div>
                  <div>
                    <b className="text-foreground">7-Day Plan:</b>
                    <ul className="mt-1 space-y-1">{analysis.roadmap?.sevenDayPlan?.map((s: string, i: number) => <li key={i}>• {s}</li>)}</ul>
                  </div>
                  <div>
                    <b className="text-foreground">30-Day Plan:</b>
                    <ul className="mt-1 space-y-1">{analysis.roadmap?.thirtyDayPlan?.map((s: string, i: number) => <li key={i}>• {s}</li>)}</ul>
                  </div>
                </Section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LinkedInOptimizerPage;
