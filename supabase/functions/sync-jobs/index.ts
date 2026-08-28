import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const GATEWAY = "https://connector-gateway.lovable.dev/firecrawl/v2";
const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const DEFAULT_QUERIES = [
  "site:linkedin.com/jobs DevOps Engineer India",
  "site:linkedin.com/jobs Cloud Engineer India",
  "site:naukri.com DevOps Engineer jobs",
  "site:naukri.com Cloud Engineer jobs",
];

type RawResult = { url?: string; title?: string; description?: string; markdown?: string };

async function firecrawlSearch(query: string, lovableKey: string, fcKey: string, tbs = "qdr:d"): Promise<RawResult[]> {
  const res = await fetch(`${GATEWAY}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": fcKey,
    },
    body: JSON.stringify({ query, limit: 10, tbs }),
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

async function structureJobs(results: RawResult[], lovableKey: string) {
  const payload = results
    .map((r) => `URL: ${r.url}\nTITLE: ${r.title}\nSNIPPET: ${(r.description || r.markdown || "").slice(0, 500)}`)
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
            "You convert raw job search results into clean structured job listings. Only keep DevOps Engineer or Cloud Engineer style roles (incl. SRE, Platform, AWS/Azure/GCP DevOps). Discard search/listing/category pages that are not a single job posting. Respond with raw JSON only, no code fences.",
        },
        {
          role: "user",
          content: `Extract job listings from these search results.\n\n${payload}\n\nReturn JSON: {"jobs":[{"title":"","company_name":"","location":"","skills_required":["..."],"apply_link":"","description":"","source":"linkedin|naukri"}]}\nUse the exact URL as apply_link. Keep description under 300 chars. Skip anything where company or title is unknown.`,
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
    return Array.isArray(parsed?.jobs) ? parsed.jobs : [];
  } catch {
    console.error("Failed to parse AI output:", content.slice(0, 500));
    return [];
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const fcKey = Deno.env.get("FIRECRAWL_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!lovableKey || !fcKey) {
      return new Response(JSON.stringify({ error: "Job sync is not configured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Auth: either the scheduled cron token, or an admin user token.
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
    // Freshness window: "hour" -> last 1h, "day" (default) -> last 24h, "week" -> last 7d
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

    const results: RawResult[] = [];
    for (const q of queries) {
      try {
        results.push(...(await firecrawlSearch(q, lovableKey, fcKey, tbs)));
      } catch (e) {
        console.error("search error for", q, e);
      }
    }

    // If the tight window returned nothing, widen once so the sync isn't empty.
    if (!results.length && tbs !== "qdr:w") {
      const fallback = tbs === "qdr:h" ? "qdr:d" : "qdr:w";
      for (const q of queries) {
        try {
          results.push(...(await firecrawlSearch(q, lovableKey, fcKey, fallback)));
        } catch (e) {
          console.error("fallback search error for", q, e);
        }
      }
    }

    if (!results.length) {
      return new Response(JSON.stringify({ found: 0, inserted: 0, message: "No results from search." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const jobs = await structureJobs(results, lovableKey);

    const rows = jobs
      .filter((j: any) => j?.title && j?.company_name && j?.apply_link)
      .map((j: any) => ({
        title: String(j.title).slice(0, 200),
        company_name: String(j.company_name).slice(0, 200),
        location: String(j.location || "").slice(0, 200),
        skills_required: Array.isArray(j.skills_required) ? j.skills_required.slice(0, 12).map(String) : [],
        apply_link: String(j.apply_link),
        description: String(j.description || "").slice(0, 600),
        source: j.source === "naukri" ? "naukri" : j.source === "linkedin" ? "linkedin" : "auto",
        posted_at: new Date().toISOString(),
      }));

    if (!rows.length) {
      return new Response(JSON.stringify({ found: results.length, inserted: 0, message: "No valid jobs extracted." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: inserted, error } = await admin

      .from("jobs")
      .upsert(rows, { onConflict: "apply_link", ignoreDuplicates: true })
      .select("id");

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
    console.error("sync-jobs error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
