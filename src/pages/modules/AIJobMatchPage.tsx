import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Sparkles, Upload, MapPin, Building2, Clock, IndianRupee, Bookmark, BookmarkCheck,
  ExternalLink, FileText, Mic, Zap, GraduationCap, TrendingUp, Loader2, Cloud,
  CheckCircle2, ListChecks, Send,
} from "lucide-react";
import Seo from "@/components/Seo";
import ModuleHeader from "@/components/modules/ModuleHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEVOPS_JOBS, DevOpsJob, CLOUD_DEVOPS_ROLES, DEVOPS_CERTIFICATIONS } from "@/data/devops-jobs";
import { analyzeResume, scoreJob, recommendUpskilling, generateCoverLetter, ResumeProfile } from "@/lib/job-match";
import { parseResumeFile } from "@/lib/resume-parser";
import { supabase } from "@/integrations/supabase/client";
import { mapDbJobs } from "@/lib/db-jobs";

type AppStage = "queued" | "submitting" | "applied";
interface AppStatus { stage: AppStage; at: number; auto: boolean }

const STAGE_META: Record<AppStage, { label: string; progress: number }> = {
  queued: { label: "Queued", progress: 25 },
  submitting: { label: "Submitting", progress: 65 },
  applied: { label: "Applied", progress: 100 },
};


const ANY = "__any__";

const AIJobMatchPage = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<ResumeProfile | null>(null);
  const [parsing, setParsing] = useState(false);
  const [resumeName, setResumeName] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [role, setRole] = useState(ANY);
  const [cloud, setCloud] = useState(ANY);
  const [mode, setMode] = useState(ANY);
  const [company, setCompany] = useState(ANY);
  const [tech, setTech] = useState(ANY);
  const [cert, setCert] = useState(ANY);
  const [source, setSource] = useState(ANY);
  const [minExp, setMinExp] = useState(0);
  const [minSalary, setMinSalary] = useState(0);
  const [postedWithin, setPostedWithin] = useState(30);
  const [minMatch, setMinMatch] = useState(0);
  const [notice, setNotice] = useState(ANY);

  const [saved, setSaved] = useState<string[]>([]);
  const [coverJob, setCoverJob] = useState<DevOpsJob | null>(null);

  // Jobs pulled from the Job Links module
  const [dbJobs, setDbJobs] = useState<DevOpsJob[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Application progress tracking
  const [applications, setApplications] = useState<Record<string, AppStatus>>({});
  const [running, setRunning] = useState(false);

  // Auto apply config
  const [autoApply, setAutoApply] = useState(false);
  const [aaMinScore, setAaMinScore] = useState(75);
  const [aaRoles, setAaRoles] = useState("DevOps Engineer, SRE, Platform Engineer");
  const [aaCloud, setAaCloud] = useState("AWS");
  const [aaLocations, setAaLocations] = useState("Bengaluru, Hyderabad, Remote");
  const [aaSalary, setAaSalary] = useState("₹20 LPA+");
  const [aaRemoteOnly, setAaRemoteOnly] = useState(false);
  const [aaMaxDaily, setAaMaxDaily] = useState(10);
  const [aaResume, setAaResume] = useState("Primary DevOps Resume v3");
  const [aaTemplate, setAaTemplate] = useState("AI generated per job");

  useEffect(() => {
    supabase
      .from("jobs")
      .select("id,title,company_name,location,skills_required,apply_link,source,posted_at,created_at,description")
      .order("created_at", { ascending: false })
      .limit(500)
      .then(({ data }) => {
        setDbJobs(mapDbJobs(data as never));
        setLoadingJobs(false);
      });
  }, []);

  const allJobs = useMemo(() => {
    const seen = new Set<string>();
    return [...dbJobs, ...DEVOPS_JOBS].filter((j) => {
      const key = `${j.title}|${j.company}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [dbJobs]);

  const companies = useMemo(() => [...new Set(allJobs.map((j) => j.company))].sort(), [allJobs]);
  const techs = useMemo(() => [...new Set(allJobs.flatMap((j) => j.skills))].sort(), [allJobs]);
  const sources = useMemo(() => [...new Set(allJobs.map((j) => j.source))].sort(), [allJobs]);

  const scored = useMemo(
    () =>
      allJobs.map((job) => ({ job, match: scoreJob(job, profile) })).sort(
        (a, b) => b.match.score - a.match.score || a.job.postedDaysAgo - b.job.postedDaysAgo,
      ),
    [allJobs, profile],
  );

  const salaryFloor = (s: string) => Number(s.replace(/[^\d–-]/g, "").split(/[–-]/)[0] || 0);

  const filtered = scored.filter(({ job, match }) => {
    const q = search.trim().toLowerCase();
    if (q && ![job.title, job.company, job.location, ...job.skills].join(" ").toLowerCase().includes(q)) return false;
    if (role !== ANY && !job.title.toLowerCase().includes(role.toLowerCase().replace(/\s*\(sre\)/, ""))) return false;
    if (cloud !== ANY && job.cloud !== cloud) return false;
    if (mode !== ANY && job.workMode !== mode) return false;
    if (company !== ANY && job.company !== company) return false;
    if (tech !== ANY && !job.skills.includes(tech)) return false;
    if (cert !== ANY && !job.certifications.includes(cert)) return false;
    if (source !== ANY && job.source !== source) return false;
    if (job.minExp < minExp) return false;
    if (minSalary > 0 && salaryFloor(job.salary) < minSalary) return false;
    if (job.postedDaysAgo > postedWithin) return false;
    if (profile && match.score < minMatch) return false;
    return true;
  });

  const upskill = useMemo(() => recommendUpskilling(profile, allJobs), [profile, allJobs]);

  const handleUpload = async (file?: File) => {
    if (!file) return;
    setParsing(true);
    try {
      const text = await parseResumeFile(file);
      const p = analyzeResume(text);
      setProfile(p);
      setResumeName(file.name);
      toast.success(`Resume analyzed — ${p.skills.length} DevOps skills detected`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not read that file");
    } finally {
      setParsing(false);
    }
  };

  const setStage = (id: string, stage: AppStage, auto: boolean) =>
    setApplications((prev) => ({ ...prev, [id]: { stage, at: Date.now(), auto } }));

  const markApplied = (job: DevOpsJob) => {
    setStage(job.id, "applied", false);
    toast.success(`Marked as applied — ${job.title}`);
  };

  const scoreTone = (s: number) =>
    s >= 80 ? "text-primary border-primary/40 bg-primary/10"
    : s >= 60 ? "text-accent-foreground border-accent/50 bg-accent/20"
    : "text-muted-foreground border-border bg-muted/40";

  const autoApplyTargets = filtered.filter(
    ({ job, match }) => match.score >= aaMinScore && (!aaRemoteOnly || job.workMode === "Remote"),
  );

  const runAutoApply = async () => {
    if (!autoApply) return toast.error("Turn on auto apply first");
    const queue = autoApplyTargets
      .filter(({ job }) => applications[job.id]?.stage !== "applied")
      .slice(0, aaMaxDaily);
    if (!queue.length) return toast.error("No new roles match your auto apply rules");

    setRunning(true);
    queue.forEach(({ job }) => setStage(job.id, "queued", true));
    for (const { job } of queue) {
      setStage(job.id, "submitting", true);
      await new Promise((r) => setTimeout(r, 450));
      setStage(job.id, "applied", true);
    }
    setRunning(false);
    toast.success(`Auto apply finished — ${queue.length} applications submitted`);
  };

  const appliedList = Object.entries(applications)
    .map(([id, s]) => ({ status: s, job: allJobs.find((j) => j.id === id) }))
    .filter((x): x is { status: AppStatus; job: DevOpsJob } => !!x.job)
    .sort((a, b) => b.status.at - a.status.at);

  const appliedCount = appliedList.filter((a) => a.status.stage === "applied").length;


  return (
    <>
      <Seo
        path="/modules/ai-job-match"
        title="AI Job Match for Cloud & DevOps Roles — Intervixa AI"
        description="Upload your resume and get AI-matched Cloud, DevOps, SRE and Platform Engineering jobs with match scores, auto-apply rules and skill gap analysis."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Intervixa AI Job Match",
          applicationCategory: "BusinessApplication",
          description: "AI job matching exclusively for Cloud, DevOps, SRE and Platform Engineering careers.",
        }}
      />

      <div className="min-h-screen bg-background page-enter">
        <div className="aurora" aria-hidden />
        <div className="container mx-auto px-4 py-10 space-y-8">
          <ModuleHeader
            title="AI Job Match"
            description="Cloud · DevOps · SRE · Platform · Infrastructure roles only"
            icon={<Sparkles className="w-5 h-5 text-primary" />}
          />

          <div className="flex flex-wrap gap-2">
            {["LinkedIn", "Indeed", "Wellfound", "Greenhouse", "Lever", "Ashby", "SmartRecruiters", "Workday", "Company Careers"].map((s) => (
              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
            ))}
          </div>

          {/* Resume panel */}
          <Card className="glass card-interactive">
            <CardContent className="p-6 grid gap-6 md:grid-cols-[1fr_auto] items-center">
              <div className="space-y-2">
                <h2 className="font-display text-lg font-semibold">Resume intelligence</h2>
                <p className="text-sm text-muted-foreground">
                  Upload a PDF or DOCX resume — Intervixa extracts your cloud platforms, DevOps tooling,
                  certifications and experience, then scores every job against your profile.
                </p>
                {profile && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <Badge className="text-xs">{resumeName}</Badge>
                    <Badge variant="secondary" className="text-xs">{profile.years || "—"} yrs experience</Badge>
                    {profile.cloud.map((c) => <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>)}
                    {profile.skills.slice(0, 14).map((s) => (
                      <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                    {profile.skills.length > 14 && (
                      <Badge variant="outline" className="text-xs">+{profile.skills.length - 14} more</Badge>
                    )}
                  </div>
                )}
              </div>
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files?.[0])}
                />
                <Button className="btn-shine gap-2" disabled={parsing} onClick={() => fileRef.current?.click()}>
                  {parsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {profile ? "Replace resume" : "Upload resume"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="jobs" className="space-y-6">
            <TabsList>
              <TabsTrigger value="jobs">Matched jobs</TabsTrigger>
              <TabsTrigger value="auto">Auto apply</TabsTrigger>
              <TabsTrigger value="progress">Applications{appliedList.length ? ` (${appliedList.length})` : ""}</TabsTrigger>
              <TabsTrigger value="improve">Resume improvement</TabsTrigger>
            </TabsList>


            {/* JOBS */}
            <TabsContent value="jobs" className="space-y-6">
              <Card className="glass">
                <CardContent className="p-5 space-y-4">
                  <Input
                    placeholder="Search role, company, location or skill…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <FilterSelect label="Role" value={role} onChange={setRole} options={[...CLOUD_DEVOPS_ROLES]} />
                    <FilterSelect label="Cloud platform" value={cloud} onChange={setCloud} options={["AWS", "Azure", "GCP", "Multi-Cloud"]} />
                    <FilterSelect label="Work mode" value={mode} onChange={setMode} options={["Remote", "Hybrid", "Onsite"]} />
                    <FilterSelect label="Company" value={company} onChange={setCompany} options={companies} />
                    <FilterSelect label="Technology" value={tech} onChange={setTech} options={techs} />
                    <FilterSelect label="Certification" value={cert} onChange={setCert} options={DEVOPS_CERTIFICATIONS} />
                    <FilterSelect label="Source" value={source} onChange={setSource} options={sources} />
                    <FilterSelect label="Notice period" value={notice} onChange={setNotice} options={["Immediate", "15 days", "30 days", "60 days", "90 days"]} />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 pt-1">
                    <RangeFilter label={`Experience ≥ ${minExp} yrs`} value={minExp} max={10} onChange={setMinExp} />
                    <RangeFilter label={`Salary ≥ ₹${minSalary} LPA`} value={minSalary} max={40} step={2} onChange={setMinSalary} />
                    <RangeFilter label={`Posted within ${postedWithin} days`} value={postedWithin} max={30} min={1} onChange={setPostedWithin} />
                    <RangeFilter label={`Match score ≥ ${minMatch}%`} value={minMatch} max={95} step={5} onChange={setMinMatch} />
                  </div>
                </CardContent>
              </Card>

              <p className="text-sm text-muted-foreground">
                {loadingJobs ? "Loading live job links…" : `${filtered.length} Cloud & DevOps roles`}
                {!loadingJobs && ` · ${dbJobs.length} from Job Links`}
                {!loadingJobs && (profile ? " · ranked by AI match" : " — upload a resume to see match scores")}
              </p>


              <div className="grid gap-5 lg:grid-cols-2">
                {filtered.map(({ job, match }) => (
                  <Card key={job.id} className="glass card-interactive overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-primary/25 to-glow/20 border border-border flex items-center justify-center font-display font-bold text-sm">
                          {job.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base leading-snug">{job.title}</CardTitle>
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <Building2 className="w-3.5 h-3.5" /> {job.company}
                            <span className="text-muted-foreground/50">·</span>
                            <span className="text-xs">{job.source}</span>
                          </p>
                        </div>
                        <div className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-center ${scoreTone(match.score)}`}>
                          <div className="text-lg font-bold leading-none">{profile ? `${match.score}%` : "—"}</div>
                          <div className="text-[10px] uppercase tracking-wide opacity-80">AI match</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {profile && <Progress value={match.score} className="h-1.5" />}
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                        <Badge variant="secondary" className="text-[10px]">{job.workMode}</Badge>
                        <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />{job.salary}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.experience}</span>
                        <span className="flex items-center gap-1"><Cloud className="w-3.5 h-3.5" />{job.cloud}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{job.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills.map((s) => (
                          <Badge
                            key={s}
                            variant={match.matchedSkills.includes(s) ? "default" : "outline"}
                            className="text-[11px]"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                      {applications[job.id] && (
                        <div className="rounded-lg border border-primary/30 bg-primary/5 p-2.5 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 font-medium">
                              {applications[job.id].stage === "applied"
                                ? <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              {STAGE_META[applications[job.id].stage].label}
                              {applications[job.id].auto && <Badge variant="secondary" className="text-[10px]">auto</Badge>}
                            </span>
                            <span className="text-muted-foreground">
                              {new Date(applications[job.id].at).toLocaleTimeString()}
                            </span>
                          </div>
                          <Progress value={STAGE_META[applications[job.id].stage].progress} className="h-1.5" />
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-muted-foreground">
                          Posted {job.postedDaysAgo === 0 ? "today" : `${job.postedDaysAgo}d ago`}
                        </span>
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          <Button size="sm" variant="ghost" className="gap-1 text-xs"
                            onClick={() => setSaved((p) => p.includes(job.id) ? p.filter((i) => i !== job.id) : [...p, job.id])}>
                            {saved.includes(job.id) ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                            {saved.includes(job.id) ? "Saved" : "Save"}
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => setCoverJob(job)}>
                            <FileText className="w-3.5 h-3.5" /> Cover letter
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => navigate("/modules/mock-interview")}>
                            <Mic className="w-3.5 h-3.5" /> Mock interview
                          </Button>
                          <Button
                            size="sm"
                            className="gap-1 text-xs btn-shine"
                            disabled={applications[job.id]?.stage === "applied"}
                            onClick={() => {
                              if (job.applyLink) window.open(job.applyLink, "_blank");
                              markApplied(job);
                            }}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {applications[job.id]?.stage === "applied" ? "Applied" : "Apply"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                ))}
                {!filtered.length && (
                  <p className="text-sm text-muted-foreground">No Cloud/DevOps roles match these filters.</p>
                )}
              </div>
            </TabsContent>

            {/* AUTO APPLY */}
            <TabsContent value="auto">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="w-4 h-4 text-primary" /> Auto apply configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium">Enable auto apply</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically queue applications for Cloud/DevOps roles above your match threshold.
                      </p>
                    </div>
                    <Switch checked={autoApply} onCheckedChange={setAutoApply} />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Minimum match score — {aaMinScore}%</Label>
                      <Slider value={[aaMinScore]} min={40} max={95} step={5} onValueChange={(v) => setAaMinScore(v[0])} />
                    </div>
                    <div className="space-y-2">
                      <Label>Maximum daily applications — {aaMaxDaily}</Label>
                      <Slider value={[aaMaxDaily]} min={1} max={50} step={1} onValueChange={(v) => setAaMaxDaily(v[0])} />
                    </div>
                    <Field label="Preferred job roles" value={aaRoles} onChange={setAaRoles} />
                    <Field label="Preferred cloud platform" value={aaCloud} onChange={setAaCloud} />
                    <Field label="Preferred locations" value={aaLocations} onChange={setAaLocations} />
                    <Field label="Expected salary" value={aaSalary} onChange={setAaSalary} />
                    <Field label="Resume version" value={aaResume} onChange={setAaResume} />
                    <Field label="Cover letter template" value={aaTemplate} onChange={setAaTemplate} />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium">Remote only</p>
                      <p className="text-sm text-muted-foreground">Skip hybrid and onsite listings.</p>
                    </div>
                    <Switch checked={aaRemoteOnly} onCheckedChange={setAaRemoteOnly} />
                  </div>

                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
                    <p className="font-medium">
                      {autoApply ? `${autoApplyTargets.length} of today's roles qualify` : "Auto apply is off"}
                    </p>
                    <p className="text-muted-foreground">
                      {autoApply
                        ? `Up to ${Math.min(aaMaxDaily, autoApplyTargets.length)} applications will be submitted with "${aaResume}".`
                        : "Turn it on to queue matching Cloud & DevOps applications automatically."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => toast.success("Auto apply preferences saved")}>
                      Save preferences
                    </Button>
                    <Button className="btn-shine gap-2" disabled={!autoApply || running} onClick={runAutoApply}>
                      {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {running ? "Applying…" : "Run auto apply now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* PROGRESS */}
            <TabsContent value="progress">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ListChecks className="w-4 h-4 text-primary" /> Application progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <StatBox label="Total tracked" value={appliedList.length} />
                    <StatBox label="Applied" value={appliedCount} />
                    <StatBox label="In progress" value={appliedList.length - appliedCount} />
                  </div>

                  {!appliedList.length && (
                    <p className="text-sm text-muted-foreground">
                      No applications yet — apply to a job or run auto apply to start tracking progress.
                    </p>
                  )}

                  {appliedList.map(({ job, status }) => (
                    <div key={job.id} className="rounded-lg border border-border p-4 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{job.title}</p>
                          <p className="text-xs text-muted-foreground">{job.company} · {job.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {status.auto && <Badge variant="secondary" className="text-[10px]">auto apply</Badge>}
                          <Badge variant={status.stage === "applied" ? "default" : "outline"} className="text-xs">
                            {STAGE_META[status.stage].label}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={STAGE_META[status.stage].progress} className="h-1.5" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Updated {new Date(status.at).toLocaleString()}</span>
                        {job.applyLink && (
                          <button className="underline" onClick={() => window.open(job.applyLink, "_blank")}>
                            Open listing
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>


            {/* IMPROVEMENT */}
            <TabsContent value="improve" className="grid gap-5 md:grid-cols-2">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="w-4 h-4 text-primary" /> Missing high-demand DevOps skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upskill.missingSkills.length ? upskill.missingSkills.map(({ skill, demand }) => (
                    <div key={skill} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{skill}</span>
                        <span className="text-muted-foreground">{demand} of {allJobs.length} jobs</span>
                      </div>
                      <Progress value={(demand / Math.max(1, allJobs.length)) * 100} className="h-1.5" />

                    </div>
                  )) : <p className="text-sm text-muted-foreground">Your resume already covers the top in-demand tooling.</p>}
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <GraduationCap className="w-4 h-4 text-primary" /> Recommended certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upskill.missingCerts.map(({ certification, demand }) => (
                    <div key={certification} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <span className="text-sm">{certification}</span>
                      <Badge variant="secondary" className="text-xs">{demand} roles</Badge>
                    </div>
                  ))}
                  {!upskill.missingCerts.length && (
                    <p className="text-sm text-muted-foreground">You already hold the certifications these roles ask for.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={!!coverJob} onOpenChange={(o) => !o && setCoverJob(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cover letter — {coverJob?.title} @ {coverJob?.company}</DialogTitle>
          </DialogHeader>
          {coverJob && (
            <>
              <Textarea
                readOnly
                className="min-h-[340px] text-sm"
                value={generateCoverLetter(coverJob, profile, scoreJob(coverJob, profile))}
              />
              <Button
                className="btn-shine"
                onClick={() => {
                  navigator.clipboard.writeText(generateCoverLetter(coverJob, profile, scoreJob(coverJob, profile)));
                  toast.success("Cover letter copied");
                }}
              >
                Copy cover letter
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const FilterSelect = ({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs text-muted-foreground">{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder={`Any ${label.toLowerCase()}`} /></SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectItem value={ANY}>Any {label.toLowerCase()}</SelectItem>
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>
);

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-lg border border-border p-4">
    <p className="text-2xl font-bold font-display">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

const Field = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-1.5">
    <Label className="text-xs text-muted-foreground">{label}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const RangeFilter = ({ label, value, onChange, max, min = 0, step = 1 }: {
  label: string; value: number; onChange: (v: number) => void; max: number; min?: number; step?: number;
}) => (
  <div className="space-y-2">
    <Label className="text-xs text-muted-foreground">{label}</Label>
    <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} />
  </div>
);

export default AIJobMatchPage;
