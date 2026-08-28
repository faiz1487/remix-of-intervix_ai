import { DEVOPS_CERTIFICATIONS, DEVOPS_SKILLS, DevOpsJob } from "@/data/devops-jobs";

export interface ResumeProfile {
  skills: string[];
  certifications: string[];
  years: number;
  cloud: string[];
}

const ALIASES: Record<string, string[]> = {
  "AWS": ["aws", "amazon web services"],
  "Azure": ["azure"],
  "GCP": ["gcp", "google cloud"],
  "Kubernetes": ["kubernetes", "k8s"],
  "CI/CD": ["ci/cd", "cicd", "continuous integration", "continuous delivery"],
  "Infrastructure as Code": ["infrastructure as code", "iac"],
  "GitHub Actions": ["github actions"],
  "GitLab CI": ["gitlab ci", "gitlab-ci"],
  "ELK": ["elk", "elasticsearch", "logstash", "kibana"],
  "Incident Management": ["incident management", "on-call", "oncall", "rca"],
  "Go": ["golang", " go "],
};

function matchesTerm(text: string, term: string) {
  const variants = ALIASES[term] ?? [term.toLowerCase()];
  return variants.some((v) => text.includes(v));
}

export function analyzeResume(rawText: string): ResumeProfile {
  const text = ` ${rawText.toLowerCase().replace(/\s+/g, " ")} `;
  const skills = DEVOPS_SKILLS.filter((s) => matchesTerm(text, s));
  const certifications = DEVOPS_CERTIFICATIONS.filter((c) => {
    const key = c.toLowerCase();
    if (key === "cka" || key === "ckad" || key === "rhcsa") return text.includes(` ${key} `);
    return text.includes(key) || (key.includes("aws devops") && text.includes("devops engineer professional"));
  });
  const yearMatches = [...rawText.matchAll(/(\d{1,2})\s*\+?\s*(?:years|yrs)/gi)].map((m) => Number(m[1]));
  const years = yearMatches.length ? Math.max(...yearMatches) : 0;
  const cloud = ["AWS", "Azure", "GCP"].filter((c) => matchesTerm(text, c));
  return { skills, certifications, years, cloud };
}

export interface MatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  missingCertifications: string[];
}

export function scoreJob(job: DevOpsJob, profile: ResumeProfile | null): MatchResult {
  const matchedSkills = profile ? job.skills.filter((s) => profile.skills.includes(s)) : [];
  const missingSkills = job.skills.filter((s) => !matchedSkills.includes(s));
  const missingCertifications = profile
    ? job.certifications.filter((c) => !profile.certifications.includes(c))
    : job.certifications;

  if (!profile) return { score: 0, matchedSkills, missingSkills, missingCertifications };

  // Skills 60%
  const skillScore = job.skills.length ? (matchedSkills.length / job.skills.length) * 60 : 0;
  // Cloud platform 15%
  const cloudScore =
    job.cloud === "Multi-Cloud"
      ? profile.cloud.length
        ? 15
        : 4
      : profile.cloud.includes(job.cloud)
        ? 15
        : 3;
  // Experience 15%
  const expScore = profile.years >= job.minExp ? 15 : Math.max(0, 15 - (job.minExp - profile.years) * 4);
  // Certifications 10%
  const certScore = job.certifications.length
    ? (job.certifications.filter((c) => profile.certifications.includes(c)).length / job.certifications.length) * 10
    : 6;

  const score = Math.min(99, Math.round(skillScore + cloudScore + expScore + certScore));
  return { score, matchedSkills, missingSkills, missingCertifications };
}

export function recommendUpskilling(profile: ResumeProfile | null, jobs: DevOpsJob[]) {
  const demand = new Map<string, number>();
  jobs.forEach((j) => j.skills.forEach((s) => demand.set(s, (demand.get(s) ?? 0) + 1)));
  const missingSkills = [...demand.entries()]
    .filter(([s]) => !profile?.skills.includes(s))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([s, n]) => ({ skill: s, demand: n }));

  const certDemand = new Map<string, number>();
  jobs.forEach((j) => j.certifications.forEach((c) => certDemand.set(c, (certDemand.get(c) ?? 0) + 1)));
  const missingCerts = [...certDemand.entries()]
    .filter(([c]) => !profile?.certifications.includes(c))
    .sort((a, b) => b[1] - a[1])
    .map(([c, n]) => ({ certification: c, demand: n }));

  return { missingSkills, missingCerts };
}

export function generateCoverLetter(job: DevOpsJob, profile: ResumeProfile | null, match: MatchResult) {
  const strengths = (match.matchedSkills.length ? match.matchedSkills : job.skills.slice(0, 5)).join(", ");
  const exp = profile?.years ? `${profile.years}+ years` : "several years";
  return `Dear ${job.company} Hiring Team,

I am applying for the ${job.title} role at ${job.company} (${job.location}, ${job.workMode}).

With ${exp} of hands-on Cloud and DevOps experience, I work daily with ${strengths}. In my current role I own infrastructure-as-code delivery, container platform operations and CI/CD reliability — reducing deployment lead time and improving service availability through better monitoring, alerting and incident response.

What draws me to this position is the scale of ${job.company}'s ${job.cloud} platform and the emphasis on ${job.skills.slice(0, 3).join(", ")}. I would bring a strong automation-first mindset, disciplined production practices and clear cross-team communication.

I would welcome the opportunity to discuss how my background maps to your platform roadmap.

Best regards,
[Your Name]
[Phone] · [Email] · [LinkedIn]`;
}
