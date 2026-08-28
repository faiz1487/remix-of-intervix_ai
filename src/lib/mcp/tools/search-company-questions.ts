import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";
import { dbError, rows, unauthenticated } from "../shared";

export default defineTool({
  name: "search_company_questions",
  title: "Search company-wise questions",
  description: "Search interview questions grouped by company, role and required skills.",
  inputSchema: {
    company: z.string().trim().optional().describe("Company name."),
    role: z.string().trim().optional().describe("Role, e.g. Cloud Engineer."),
    query: z.string().trim().optional().describe("Free text matched against the question."),
    limit: z.number().int().min(1).max(50).optional().describe("Max rows to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ company, role, query, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    let q = supabaseForUser(ctx)
      .from("company_questions")
      .select("id,company,role,location,skills,question,answer,difficulty,document_link")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (company) q = q.ilike("company", `%${company}%`);
    if (role) q = q.ilike("role", `%${role}%`);
    if (query) q = q.ilike("question", `%${query}%`);
    const { data, error } = await q;
    return error ? dbError(error.message) : rows(data);
  },
});
