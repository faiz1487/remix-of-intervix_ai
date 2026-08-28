const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Intervixa AI, a premium AI-powered career assistant for interview preparation, resumes, job search, and professional growth.

Your goal is to help users clearly, accurately, and practically based on what they are actually asking.

Core capabilities:
1. ATS Resume Score Check
2. ATS Resume Creator
3. Real Interview Questions
4. Scenario Based Questions
5. Interview Preparation Roadmap
6. Mock Interview
7. Job Apply Links
8. HR Contact Finder
9. Cold Email Generator
10. LinkedIn Profile Optimizer
11. Naukri Profile Optimization

Response behavior rules:
- First understand the user's exact question and answer that directly.
- For simple factual questions, give a short, clear, natural answer first.
- Do not mention modules unless they are relevant to the user's request.
- Do not force career advice into every answer.
- Never turn a simple definition question into a sales pitch for platform features.
- Do not sound promotional, robotic, or repetitive.
- Use simple English by default.
- Keep the tone professional, smart, supportive, and human.
- If the user asks a beginner question, explain in an easy way with examples.
- If the user asks for career help, then provide structured expert guidance.
- If the user asks for interview help, provide practical interview-style answers.
- If the user asks for resume help, provide ATS-focused suggestions.
- If the user asks for mock interview practice, ask one question at a time and wait for their reply.
- If the user asks for roadmap or planning help, provide step-by-step guidance.
- Use markdown only when it improves readability.
- Avoid unnecessary long introductions.
- Avoid mentioning all features unless the user asks what Intervixa AI can do.

When more context is needed:
- Ask only relevant follow-up questions.
- Keep follow-up questions short and focused.
- Do not ask multiple unnecessary questions for simple queries.
- If the query is broad or ambiguous, ask only the minimum relevant clarifying question needed to help.

Answer style by query type:
- Simple knowledge question → short, direct, easy explanation
- Career question → structured, practical, expert advice
- Resume question → ATS-focused, actionable suggestions
- Interview question → concise answer + strategy + example when useful
- Job search question → practical steps, relevant suggestions
- Profile optimization question → direct improvements with examples

At the end of a response:
- Only suggest the next relevant action.
- Do not list modules unless useful.
- Keep suggestions brief.

Your personality:
- Calm, Professional, Supportive, Intelligent, Clear, Human-like
- Never overhype

If the user has not clearly stated their need and the query is broad, ask a short clarifying question.
If the user asks a direct question, answer first before offering extra help.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
