import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai-client";
import { buildCoverLetterPrompt } from "@/lib/prompts";
import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a few minutes." }, { status: 429 });
  }

  try {
    const { jobDescription, resumeText, companyName } = await request.json();

    if (!jobDescription || !resumeText) {
      return NextResponse.json({ error: "Job description and resume text are required" }, { status: 400 });
    }

    const prompt = buildCoverLetterPrompt(jobDescription, resumeText, companyName);

    let parsed;
    try {
      const text = await generateAIResponse(prompt);
      parsed = JSON.parse(text);
    } catch {
      const retryText = await generateAIResponse(
        prompt + "\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no code fences."
      );
      parsed = JSON.parse(retryText);
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Cover letter error:", error);
    return NextResponse.json({ error: "Failed to generate cover letter. Please try again." }, { status: 500 });
  }
}
