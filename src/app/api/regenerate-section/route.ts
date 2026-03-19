import { NextRequest, NextResponse } from "next/server";
import { buildRegenerateSectionPrompt } from "@/lib/prompts";
import { checkRateLimit } from "@/lib/rate-limit";
import { generateAIResponse } from "@/lib/ai-client";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a few minutes." }, { status: 429 });
  }

  try {
    const { sectionName, currentSection, jobDescription, fullResumeContext } = await request.json();

    if (!sectionName || !currentSection || !jobDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = buildRegenerateSectionPrompt(sectionName, currentSection, jobDescription, fullResumeContext);

    let parsed;
    try {
      const text = await generateAIResponse(prompt);
      parsed = JSON.parse(text);
    } catch {
      const retryText = await generateAIResponse(
        prompt + "\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no code fences, no extra text."
      );
      parsed = JSON.parse(retryText);
    }

    return NextResponse.json({ section: parsed });
  } catch (error) {
    console.error("Regenerate section error:", error);
    return NextResponse.json({ error: "Failed to regenerate section. Please try again." }, { status: 500 });
  }
}
