import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildRegenerateSectionPrompt } from "@/lib/prompts";
import { checkRateLimit } from "@/lib/rate-limit";

const client = new Anthropic({ timeout: 60000 });

const AI_MODEL = "claude-sonnet-4-20250514";

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

    const message = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 2048,
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
        max_tokens: 2048,
        messages: [
          { role: "user", content: prompt },
          { role: "assistant", content: content.text },
          { role: "user", content: "Your response was not valid JSON. Return ONLY valid JSON." },
        ],
      });
      const retryContent = retryMessage.content[0];
      if (retryContent.type !== "text") {
        return NextResponse.json({ error: "AI failed to generate valid response" }, { status: 500 });
      }
      parsed = JSON.parse(retryContent.text);
    }

    return NextResponse.json({ section: parsed });
  } catch {
    return NextResponse.json({ error: "Failed to regenerate section. Please try again." }, { status: 500 });
  }
}
