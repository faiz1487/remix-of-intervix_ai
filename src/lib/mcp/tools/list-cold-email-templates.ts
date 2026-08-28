import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";
import { dbError, rows, unauthenticated } from "../shared";

export default defineTool({
  name: "list_cold_email_templates",
  title: "List cold email templates",
  description: "List the cold email / outreach templates available in Intervixa AI.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const { data, error } = await supabaseForUser(ctx)
      .from("cold_email_templates")
      .select("id,template_name,email_subject,email_body")
      .order("created_at", { ascending: true });
    return error ? dbError(error.message) : rows(data);
  },
});
