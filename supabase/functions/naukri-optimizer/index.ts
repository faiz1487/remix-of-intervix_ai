import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an elite Naukri Profile Optimization AI Coach: a Naukri recruiter expert + ATS optimization specialist + resume strategist + career branding consultant.

Analyze the candidate's Naukri profile / resume content with the depth of a senior tech recruiter. Personalize everything to their experience level (Fresher, 1-3 Years, Mid-Level, Senior, Managerial). Avoid generic advice. Focus on ATS filtering, recruiter search behavior, and recruiter psychology.

You MUST respond ONLY with raw JSON (no markdown, no code fences) matching this exact structure:

{
  "experienceLevel": "Fresher" | "1-3 Years" | "Mid-Level" | "Senior" | "Managerial",
  "overallScore": 0-100,
  "scores": {
    "atsScore": 0-100,
    "recruiterVisibility": 0-100,
    "keywordOptimization": 0-100,
    "experienceStrength": 0-100,
    "projectQuality": 0-100,
    "technicalPositioning": 0-100,
    "recruiterAppeal": 0-100,
    "resumeStrength": 0-100,
    "linkedinIntegration": 0-100,
    "interviewReadiness": 0-100
  },
  "strengths": ["..."],
  "weaknesses": ["..."],
  "missingKeywords": ["..."],
  "missingRecruiterSignals": ["..."],
  "headline": {
    "currentAnalysis": "...",
    "recommended": "...",
    "atsOptimized": "...",
    "seniorPositioning": "...",
    "variations": ["...", "...", "..."],
    "whyItWorks": "..."
  },
  "resumeHeadline": {
    "atsOptimized": "...",
    "brandingStatement": "...",
    "recruiterFocused": "..."
  },
  "summary": {
    "professional": "...",
    "atsRich": "...",
    "productionFocused": "...",
    "levelSpecific": "..."
  },
  "keySkills": {
    "currentAnalysis": "...",
    "recommendedOrder": ["..."],
    "trending": ["..."],
    "atsKeywords": ["..."],
    "explanation": "..."
  },
  "experienceImprovements": [
    { "before": "weak responsibility", "after": "achievement-based, metric-driven point" }
  ],
  "projectImprovements": [
    { "title": "...", "improvedDescription": "...", "techStack": ["..."], "businessImpact": "..." }
  ],
  "certifications": {
    "recommended": ["..."],
    "highValue": ["..."],
    "reasoning": "..."
  },
  "atsKeywordAnalysis": {
    "missing": ["..."],
    "trending": ["..."],
    "industry": ["..."],
    "explanation": "..."
  },
  "salaryNoticeStrategy": {
    "salaryPositioning": "...",
    "noticePeriod": "...",
    "recruiterFiltering": "..."
  },
  "recruiterVisibility": {
    "algorithmInsights": "...",
    "dailyStrategy": "...",
    "updateFrequency": "...",
    "bestTimeToUpdate": "...",
    "applicationStrategy": "..."
  },
  "linkedinGithub": {
    "linkedin": ["..."],
    "github": ["..."],
    "portfolio": ["..."]
  },
  "roadmap": {
    "quickWins": ["..."],
    "priorityImprovements": ["..."],
    "advanced": ["..."],
    "sevenDayPlan": ["Day 1: ...", "Day 2: ..."],
    "thirtyDayPlan": ["Week 1: ...", "Week 2: ..."]
  },
  "finalVerdict": "..."
}

If profile is already strong, skip basic advice and instead provide advanced recruiter tricks, senior-level branding, salary optimization, and enterprise-level wording.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { profileText, targetRole, experienceLevel, imageDataUrl } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userText = `Analyze and optimize this Naukri profile.

${experienceLevel ? `EXPERIENCE LEVEL: ${experienceLevel}\n` : ""}${targetRole ? `TARGET ROLE: ${targetRole}\n` : ""}
PROFILE / RESUME CONTENT:
${profileText || "(See attached profile screenshot)"}

Provide a complete recruiter-grade optimization following the JSON schema exactly.`;

    const userContent: any[] = [{ type: "text", text: userText }];
    if (imageDataUrl) {
      userContent.push({ type: "image_url", image_url: { url: imageDataUrl } });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse AI response. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("naukri-optimizer error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
