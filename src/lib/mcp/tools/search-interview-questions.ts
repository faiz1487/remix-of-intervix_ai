import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";
import { dbError, rows, unauthenticated } from "../shared";

export default defineTool({
  name: "search_interview_questions",
  title: "Search interview questions",
  description: "Search topic-wise interview questions with answers, hints and explanations.",
  inputSchema: {
    topic: z.string().trim().optional().describe("Topic, e.g. Linux, AWS, Docker, Kubernetes."),
    role: z.string().trim().optional().describe("Target role, e.g. DevOps Engineer."),
    company: z.string().trim().optional().describe("Company the question was asked at."),
    difficulty: z.string().trim().optional().describe("Difficulty, e.g. easy, medium, hard."),
    query: z.string().trim().optional().describe("Free text matched against the question."),
    limit: z.number().int().min(1).max(50).optional().describe("Max rows to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ topic, role, company, difficulty, query, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    let q = supabaseForUser(ctx)
      .from("interview_questions")
      .select("id,role,topic,company,difficulty,tags,question,hint,answer,explanation")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (topic) q = q.ilike("topic", `%${topic}%`);
    if (role) q = q.ilike("role", `%${role}%`);
    if (company) q = q.ilike("company", `%${company}%`);
    if (difficulty) q = q.ilike("difficulty", `%${difficulty}%`);
    if (query) q = q.ilike("question", `%${query}%`);
    const { data, error } = await q;
    return error ? dbError(error.message) : rows(data);
  },
});
