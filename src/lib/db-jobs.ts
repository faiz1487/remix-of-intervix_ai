import { CloudPlatform, DevOpsJob, WorkMode } from "@/data/devops-jobs";

type DbJob = {
  id: string;
  title: string;
  company_name: string;
  location: string | null;
  skills_required: string[] | null;
  apply_link: string | null;
  source: string | null;
  posted_at: string | null;
  created_at: string | null;
  description: string | null;
};

const CLOUD_RE: [CloudPlatform, RegExp][] = [
  ["AWS", /\baws\b|amazon web services|\beks\b|\bec2\b/i],
  ["Azure", /\bazure\b|\baks\b/i],
  ["GCP", /\bgcp\b|google cloud|\bgke\b/i],
];

const RELEVANT_RE =
  /devops|sre|site reliability|cloud|platform engineer|infrastructure|kubernetes|docker|terraform|linux|ci\/cd|automation|observability|monitoring|devsecops/i;

function detectCloud(text: string): CloudPlatform {
  const hits = CLOUD_RE.filter(([, re]) => re.test(text)).map(([c]) => c);
  if (hits.length > 1) return "Multi-Cloud";
  return hits[0] ?? "Multi-Cloud";
}

function detectMode(location: string): WorkMode {
  if (/remote|wfh|work from home/i.test(location)) return "Remote";
  if (/hybrid/i.test(location)) return "Hybrid";
  return "Onsite";
}

function daysAgo(iso: string | null): number {
  if (!iso) return 0;
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return Number.isFinite(d) && d >= 0 ? d : 0;
}

function detectMinExp(text: string): number {
  const m = text.match(/(\d{1,2})\s*\+?\s*(?:-|–|to)?\s*(\d{1,2})?\s*(?:years|yrs)/i);
  return m ? Number(m[1]) : 0;
}

/** Maps a row from the Job Links table into the AI Job Match job shape. */
export function mapDbJob(row: DbJob): DevOpsJob | null {
  const title = row.title?.trim();
  if (!title || !row.company_name) return null;

  const skills = (row.skills_required ?? []).filter(Boolean);
  const haystack = [title, row.description ?? "", skills.join(" ")].join(" ");
  if (!RELEVANT_RE.test(haystack)) return null;

  const location = row.location?.trim() || "India";
  const minExp = detectMinExp(haystack);

  return {
    id: `db-${row.id}`,
    title,
    company: row.company_name,
    logo: row.company_name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase() || "JB",
    location,
    workMode: detectMode(location),
    salary: "Not disclosed",
    experience: minExp ? `${minExp}+ yrs` : "Not specified",
    minExp,
    cloud: detectCloud(haystack),
    skills: skills.length ? skills : ["DevOps"],
    certifications: [],
    source: (row.source && /linkedin/i.test(row.source)
      ? "LinkedIn"
      : row.source && /indeed/i.test(row.source)
        ? "Indeed"
        : "Company Careers") as DevOpsJob["source"],
    postedDaysAgo: daysAgo(row.posted_at ?? row.created_at),
    applyLink: row.apply_link || "",
    description: (row.description || "").slice(0, 260) || `${title} opening at ${row.company_name}.`,
  };
}

export function mapDbJobs(rows: DbJob[] | null | undefined): DevOpsJob[] {
  return (rows ?? []).map(mapDbJob).filter((j): j is DevOpsJob => !!j);
}
