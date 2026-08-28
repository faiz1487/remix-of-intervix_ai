import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert ATS Resume Builder and Senior Technical Recruiter.

Convert candidate input into a highly optimized ATS-friendly resume.

Rules:
- Use strong action verbs
- Include measurable results
- Optimize for ATS systems
- Match job description keywords
- Use concise bullet points

You MUST respond with a JSON object with this exact structure (no markdown, no code fences, just raw JSON):
{
  "resume": {
    "personalInfo": {
      "name": "Full Name",
      "email": "email@example.com",
      "phone": "+1 555-555-5555",
      "location": "City, Country",
      "linkedin": "https://linkedin.com/in/username"
    },
    "professionalSummary": "string - 3-4 sentence professional summary",
    "technicalSkills": ["skill1", "skill2", ...],
    "experience": [
      {
        "title": "Job Title",
        "company": "Company Name",
        "duration": "Start - End",
        "bullets": ["achievement 1", "achievement 2", ...]
      }
    ],
    "projects": [
      {
        "name": "Project Name",
        "description": "Brief description",
        "bullets": ["detail 1", "detail 2"]
      }
    ],
    "education": [
      {
        "degree": "Degree Name",
        "institution": "University Name",
        "year": "Year"
      }
    ],
    "certifications": ["cert1", "cert2"]
  },
  "atsAnalysis": {
    "atsScore": 85,
    "keywordMatch": 78,
    "missingKeywords": ["keyword1", "keyword2"],
    "improvements": ["suggestion 1", "suggestion 2"]
  }
}

If the user provides a job description, tailor the resume to match those keywords and requirements.
If information is missing, infer reasonable details based on the context provided.
Always ensure the output is valid JSON.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resumeText, jobDescription, yearsOfExperience, skills, targetRole, fullName, email, phone, location, linkedin } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userPrompt = `Create an ATS-optimized resume from the following information:

${resumeText ? `EXISTING RESUME / DETAILS:\n${resumeText}\n` : ""}
${jobDescription ? `TARGET JOB DESCRIPTION:\n${jobDescription}\n` : ""}
${targetRole ? `TARGET ROLE: ${targetRole}` : ""}
${yearsOfExperience ? `YEARS OF EXPERIENCE: ${yearsOfExperience}` : ""}
${skills ? `KEY SKILLS: ${skills}` : ""}

PERSONAL INFORMATION (use exactly these values in personalInfo, do not invent):
- Name: ${fullName || "(extract from resume if available)"}
- Email: ${email || "(extract from resume if available)"}
- Phone: ${phone || "(extract from resume if available)"}
- Location: ${location || "(extract from resume if available)"}
- LinkedIn: ${linkedin || "(extract from resume if available)"}

Generate the optimized resume and ATS analysis.`;
${yearsOfExperience ? `YEARS OF EXPERIENCE: ${yearsOfExperience}` : ""}
${skills ? `KEY SKILLS: ${skills}` : ""}

Generate the optimized resume and ATS analysis.`;

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
          { role: "user", content: userPrompt },
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
    
    // Strip markdown code fences if present
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
    console.error("ats-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
