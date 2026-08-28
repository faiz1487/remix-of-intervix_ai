import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";
import { dbError, rows, unauthenticated } from "../shared";

export default defineTool({
  name: "search_hr_contacts",
  title: "Search HR contacts",
  description: "Search recruiter/HR contacts collected from recent Cloud & DevOps hiring posts.",
  inputSchema: {
    company: z.string().trim().optional().describe("Company name."),
    query: z.string().trim().optional().describe("Free text matched against the contact name."),
    limit: z.number().int().min(1).max(50).optional().describe("Max rows to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ company, query, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    let q = supabaseForUser(ctx)
      .from("hr_contacts")
      .select("id,name,company,email,linkedin,role_focus,source_url,notes,posted_at")
      .order("posted_at", { ascending: false, nullsFirst: false })
      .limit(limit ?? 20);
    if (company) q = q.ilike("company", `%${company}%`);
    if (query) q = q.ilike("name", `%${query}%`);
    const { data, error } = await q;
    return error ? dbError(error.message) : rows(data);
  },
});
