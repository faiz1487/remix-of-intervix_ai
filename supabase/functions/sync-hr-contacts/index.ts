import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const GATEWAY = "https://connector-gateway.lovable.dev/firecrawl/v2";
const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const DEFAULT_QUERIES = [
  'site:linkedin.com/posts hiring DevOps Engineer resume email',
  'site:linkedin.com/posts hiring Cloud Engineer send resume "@gmail.com"',
  'site:linkedin.com/posts "we are hiring" DevOps India resume mail',
  'site:linkedin.com/posts hiring "Site Reliability Engineer" OR "Platform Engineer" resume email',
  'site:linkedin.com/posts "immediate joiners" DevOps OR AWS OR Azure resume "@"',
  'site:linkedin.com/posts hiring "AWS" OR "Kubernetes" engineer "drop your resume at"',
  'linkedin hiring post DevOps engineer India "send your CV to" email',
  'linkedin hiring post Cloud Engineer "interested candidates can share resume"',
];

type RawResult = { url?: string; title?: string; description?: string; markdown?: string };

async function firecrawlSearch(query: string, lovableKey: string, fcKey: string, tbs: string): Promise<RawResult[]> {
  const res = await fetch(`${GATEWAY}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": fcKey,
    },
    body: JSON.stringify({ query, limit: 10, tbs, scrapeOptions: { formats: ["markdown"] } }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Firecrawl search failed [${res.status}]: ${body}`);
    throw new Error(`[${res.status}]: ${body}`);
  }

  const json = await res.json();
  const items = json?.data?.web ?? json?.data ?? [];
  return Array.isArray(items) ? items : [];
}

async function structureContacts(results: RawResult[], lovableKey: string) {
  const payload = results
    .map((r) => `URL: ${r.url}\nTITLE: ${r.title}\nCONTENT: ${(r.markdown || r.description || "").slice(0, 1500)}`)
    .join("\n---\n");

  const res = await fetch(AI_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3.6-flash",
      messages: [
        {
          role: "system",
          content:
            "You extract recruiter / HR contact details from LinkedIn hiring posts. Only keep posts hiring for DevOps, Cloud, SRE, Platform or related infrastructure roles. A contact is only valid if a real email address appears in the post text. Never invent emails. Respond with raw JSON only, no code fences.",
        },
        {
          role: "user",
          content: `Extract HR/recruiter contacts from these LinkedIn posts.\n\n${payload}\n\nReturn JSON: {"contacts":[{"name":"","company":"","email":"","linkedin":"","role_focus":"","notes":""}]}\nlinkedin = the post/profile URL from the source. role_focus = the role(s) being hired. notes = one short line about the opening (max 200 chars). Skip any entry without a valid email.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`AI gateway failed [${res.status}]: ${body}`);
    throw new Error(`[${res.status}]: ${body}`);
  }

  const data = await res.json();
  let content = data.choices?.[0]?.message?.content || "";
  content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed?.contacts) ? parsed.contacts : [];
  } catch {
    console.error("Failed to parse AI output:", content.slice(0, 500));
    return [];
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Only DevOps / Cloud / SRE / Platform hiring posts qualify.
const ROLE_RE =
  /(devops|dev ops|sre\b|site reliability|platform engineer|cloud engineer|cloud architect|cloud infra|aws\b|azure\b|gcp\b|google cloud|kubernetes|k8s|docker|terraform|ansible|jenkins|ci\/cd|cicd|openshift|infrastructure engineer|infra engineer|linux admin|system engineer cloud)/i;

// Roles we explicitly do not want.
const EXCLUDE_RE =
  /(front[- ]?end|back[- ]?end developer|full[- ]?stack|react developer|angular|node\.js developer|java developer|\.net developer|php|wordpress|android|ios developer|flutter|ui\/ux|graphic design|digital marketing|seo executive|content writer|sales|bpo|hr recruiter role|accountant|data entry|business analyst|tester|manual testing|salesforce|sap\b|power bi|mern|python django)/i;

const isCloudDevOpsRole = (text: string) =>
  ROLE_RE.test(text) && !EXCLUDE_RE.test(text);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const fcKey = Deno.env.get("FIRECRAWL_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!lovableKey || !fcKey) {
      return new Response(JSON.stringify({ error: "HR contact sync is not configured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Auth: scheduled cron token, or an admin user token.
    const providedCron = req.headers.get("x-cron-secret");
    let authorized = false;

    if (providedCron) {
      const { data: cfg } = await admin
        .from("app_config")
        .select("value")
        .eq("key", "job_sync_cron_token")
        .maybeSingle();
      authorized = Boolean(cfg?.value && cfg.value === providedCron);
    }

    if (!authorized) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const anon = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
        const token = authHeader.replace("Bearer ", "");
        const { data, error } = await anon.auth.getClaims(token);
        const userId = data?.claims?.sub;
        if (!error && userId) {
          const { data: roleRow } = await admin
            .from("user_roles")
            .select("role")
            .eq("user_id", userId)
            .eq("role", "admin")
            .maybeSingle();
          const isAdmin = Boolean(roleRow);
          authorized = Boolean(isAdmin);
        }
      }
    }

    if (!authorized) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let queries = DEFAULT_QUERIES;
    let tbs = "qdr:d";
    try {
      const body = await req.json();
      if (Array.isArray(body?.queries) && body.queries.length) {
        queries = body.queries.filter((q: unknown) => typeof q === "string" && q.length < 300).slice(0, 6);
      }
      const w = String(body?.window || "").toLowerCase();
      if (w === "hour" || w === "1h") tbs = "qdr:h";
      else if (w === "week") tbs = "qdr:w";
    } catch {
      // no body — use defaults
    }

    const settled = await Promise.allSettled(
      queries.map((q) => firecrawlSearch(q, lovableKey, fcKey, tbs)),
    );
    const results: RawResult[] = [];
    for (const s of settled) {
      if (s.status === "fulfilled") results.push(...s.value);
      else console.error("search error:", s.reason);
    }

    if (!results.length) {
      return new Response(JSON.stringify({ found: 0, inserted: 0, message: "No LinkedIn posts found in this window." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const contacts = await structureContacts(results, lovableKey);

    // Regex fallback: pull any email present in the raw post text that the model missed.
    const SCAN_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const BAD = /(linkedin|example|sentry|noreply|no-reply|support@|\.png|\.jpg)/i;
    const fallback: any[] = [];
    for (const r of results) {
      const text = `${r.title || ""} ${r.description || ""} ${r.markdown || ""}`;
      // Skip posts that are not clearly DevOps / Cloud hiring posts.
      if (!isCloudDevOpsRole(text)) continue;
      for (const m of text.match(SCAN_RE) || []) {
        if (BAD.test(m)) continue;
        fallback.push({
          name: (r.title || "LinkedIn recruiter").split(/[|–-]/)[0].trim(),
          company: m.split("@")[1].split(".")[0],
          email: m,
          linkedin: r.url || "",
          role_focus: "DevOps / Cloud",
          notes: (r.description || r.title || "").slice(0, 200),
        });
      }
    }

    const seen = new Set<string>();
    const rows = [...contacts, ...fallback]
      .filter((c: any) => c?.email && EMAIL_RE.test(String(c.email).trim()))
      .filter((c: any) => isCloudDevOpsRole(`${c.role_focus || ""} ${c.notes || ""}`))
      .map((c: any) => ({
        name: String(c.name || "LinkedIn recruiter").slice(0, 150),
        company: String(c.company || "Unknown").slice(0, 150),
        email: String(c.email).trim().toLowerCase(),
        linkedin: String(c.linkedin || "").slice(0, 500),
        role_focus: String(c.role_focus || "").slice(0, 200),
        source_url: String(c.linkedin || "").slice(0, 500),
        notes: String(c.notes || "").slice(0, 300),
        posted_at: new Date().toISOString(),
      }))
      .filter((r: any) => (seen.has(r.email) ? false : (seen.add(r.email), true)));

    if (!rows.length) {
      return new Response(
        JSON.stringify({ found: results.length, inserted: 0, message: "No HR emails found in these posts." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: existing } = await admin.from("hr_contacts").select("email");
    const known = new Set((existing || []).map((e: any) => String(e.email || "").toLowerCase()).filter(Boolean));
    const fresh = rows.filter((r: any) => !known.has(r.email));

    if (!fresh.length) {
      return new Response(
        JSON.stringify({ found: results.length, extracted: rows.length, inserted: 0, message: "All contacts already exist." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: inserted, error } = await admin.from("hr_contacts").insert(fresh).select("id");

    if (error) {
      console.error("insert error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ found: results.length, extracted: rows.length, inserted: inserted?.length ?? 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("sync-hr-contacts error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
