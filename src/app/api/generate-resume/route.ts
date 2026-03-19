import { NextRequest, NextResponse } from "next/server";
import { GenerateResumeResponseSchema } from "@/lib/schemas";
import { buildGenerateResumePrompt } from "@/lib/prompts";
import { checkRateLimit } from "@/lib/rate-limit";
import { generateAIResponse } from "@/lib/ai-client";

export const maxDuration = 60;

function normalizeResponse(data: Record<string, unknown>) {
  // Handle case where AI wraps everything differently
  // Ensure we have the expected top-level structure
  if (data.resume && !data.atsAnalysis) {
    // AI might use different key names
    const atsKey = Object.keys(data).find(k =>
      k.toLowerCase().includes("ats") || k.toLowerCase().includes("keyword") || k.toLowerCase().includes("analysis")
    );
    if (atsKey && atsKey !== "atsAnalysis") {
      data.atsAnalysis = data[atsKey];
    } else {
      data.atsAnalysis = { keywords: [] };
    }
  }

  // If AI returns flat resume fields without wrapping in "resume" key
  if (!data.resume && data.personalInfo) {
    const { atsAnalysis, ...resumeFields } = data;
    return {
      resume: resumeFields,
      atsAnalysis: atsAnalysis || { keywords: [] },
    };
  }

  return data;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const { allowed, remaining } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes." },
      { status: 429, headers: { "X-RateLimit-Remaining": "0" } }
    );
  }

  try {
    const { jobDescription, resumeText } = await request.json();

    if (!jobDescription || !resumeText) {
      return NextResponse.json({ error: "Job description and resume text are required" }, { status: 400 });
    }

    const prompt = buildGenerateResumePrompt(jobDescription, resumeText);

    let parsed;
    try {
      const text = await generateAIResponse(prompt);
      parsed = JSON.parse(text);
    } catch (firstError) {
      console.error("First attempt failed:", firstError);
      // Retry once
      const retryText = await generateAIResponse(
        prompt + "\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no code fences, no extra text."
      );
      parsed = JSON.parse(retryText);
    }

    // Normalize the AI response to match our expected structure
    parsed = normalizeResponse(parsed);

    const validated = GenerateResumeResponseSchema.parse(parsed);

    return NextResponse.json(validated, {
      headers: { "X-RateLimit-Remaining": remaining.toString() },
    });
  } catch (error) {
    console.error("Generate resume error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "AI generated invalid resume structure. Please try again." }, { status: 500 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Failed to generate resume: ${message}` }, { status: 500 });
  }
}
