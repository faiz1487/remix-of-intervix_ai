import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";
import { dbError, rows, unauthenticated } from "../shared";

export default defineTool({
  name: "list_resume_templates",
  title: "List resume templates",
  description: "List downloadable ATS resume sample templates.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const { data, error } = await supabaseForUser(ctx)
      .from("resume_templates")
      .select("id,name,file_url,created_at")
      .order("created_at", { ascending: false });
    return error ? dbError(error.message) : rows(data);
  },
});
