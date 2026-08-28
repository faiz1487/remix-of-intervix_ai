import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";
import { dbError, rows, unauthenticated } from "../shared";

export default defineTool({
  name: "search_jobs",
  title: "Search jobs",
  description: "Search the latest Cloud/DevOps job listings collected by Intervixa AI.",
  inputSchema: {
    query: z.string().trim().optional().describe("Free text matched against job title."),
    company: z.string().trim().optional().describe("Filter by company name."),
    location: z.string().trim().optional().describe("Filter by location."),
    limit: z.number().int().min(1).max(50).optional().describe("Max rows to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, company, location, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    let q = supabaseForUser(ctx)
      .from("jobs")
      .select("id,title,company_name,location,skills_required,apply_link,source,posted_at,description")
      .order("posted_at", { ascending: false, nullsFirst: false })
      .limit(limit ?? 20);
    if (query) q = q.ilike("title", `%${query}%`);
    if (company) q = q.ilike("company_name", `%${company}%`);
    if (location) q = q.ilike("location", `%${location}%`);
    const { data, error } = await q;
    return error ? dbError(error.message) : rows(data);
  },
});
