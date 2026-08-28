import type { ToolContext } from "@lovable.dev/mcp-js";

export function unauthenticated() {
  return {
    content: [{ type: "text" as const, text: "Not authenticated. Connect with your Intervixa AI account." }],
    isError: true,
  };
}

export function dbError(message: string) {
  return { content: [{ type: "text" as const, text: message }], isError: true };
}

export function rows(data: unknown[] | null) {
  const items = data ?? [];
  return {
    content: [{ type: "text" as const, text: JSON.stringify(items, null, 2) }],
    structuredContent: { count: items.length, items },
  };
}

export function requireAuth(ctx: ToolContext) {
  return ctx.isAuthenticated();
}
