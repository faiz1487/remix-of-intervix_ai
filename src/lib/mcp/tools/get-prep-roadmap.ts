import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";
import { dbError, rows, unauthenticated } from "../shared";

export default defineTool({
  name: "get_prep_roadmap",
  title: "Get prep roadmap",
  description: "Get the ordered Cloud & DevOps interview preparation roadmap modules and their topics.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const { data, error } = await supabaseForUser(ctx)
      .from("roadmap_modules")
      .select("id,title,difficulty,duration,topics,order_index,progress")
      .order("order_index", { ascending: true });
    return error ? dbError(error.message) : rows(data);
  },
});
