import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GenerateResumeResponseSchema } from "@/lib/schemas";
import { buildGenerateResumePrompt } from "@/lib/prompts";
import { checkRateLimit } from "@/lib/rate-limit";

const client = new Anthropic({ timeout: 60000 });

const AI_MODEL = "claude-sonnet-4-20250514";

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

    const message = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected AI response format" }, { status: 500 });
    }

    let parsed;
    try {
      parsed = JSON.parse(content.text);
    } catch {
      const retryMessage = await client.messages.create({
        model: AI_MODEL,
        max_tokens: 4096,
        messages: [
          { role: "user", content: prompt },
          { role: "assistant", content: content.text },
          { role: "user", content: "Your response was not valid JSON. Please return ONLY valid JSON with no markdown formatting, no code fences, no extra text." },
        ],
      });
      const retryContent = retryMessage.content[0];
      if (retryContent.type !== "text") {
        return NextResponse.json({ error: "AI failed to generate valid response" }, { status: 500 });
      }
      parsed = JSON.parse(retryContent.text);
    }

    const validated = GenerateResumeResponseSchema.parse(parsed);

    return NextResponse.json(validated, {
      headers: { "X-RateLimit-Remaining": remaining.toString() },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "AI generated invalid resume structure. Please try again." }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to generate resume. Please try again." }, { status: 500 });
  }
}
