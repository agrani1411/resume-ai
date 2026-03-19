import { NextRequest, NextResponse } from "next/server";
import { GenerateResumeResponseSchema } from "@/lib/schemas";
import { buildGenerateResumePrompt } from "@/lib/prompts";
import { checkRateLimit } from "@/lib/rate-limit";
import { generateAIResponse } from "@/lib/ai-client";

export const maxDuration = 60;

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
    } catch {
      // Retry once
      const retryText = await generateAIResponse(
        prompt + "\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no code fences, no extra text."
      );
      parsed = JSON.parse(retryText);
    }

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
