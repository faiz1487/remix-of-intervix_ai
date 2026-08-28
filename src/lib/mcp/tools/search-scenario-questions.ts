import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";
import { dbError, rows, unauthenticated } from "../shared";

export default defineTool({
  name: "search_scenario_questions",
  title: "Search scenario questions",
  description: "Search real-world scenario-based Cloud/DevOps interview questions.",
  inputSchema: {
    technology: z.string().trim().optional().describe("Technology, e.g. Kubernetes, Terraform."),
    query: z.string().trim().optional().describe("Free text matched against the scenario title."),
    limit: z.number().int().min(1).max(50).optional().describe("Max rows to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ technology, query, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    let q = supabaseForUser(ctx)
      .from("scenario_questions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (technology) q = q.ilike("technology", `%${technology}%`);
    if (query) q = q.ilike("title", `%${query}%`);
    const { data, error } = await q;
    return error ? dbError(error.message) : rows(data);
  },
});
