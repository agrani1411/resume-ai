import { NextRequest, NextResponse } from "next/server";
import { ResumeSchema } from "@/lib/schemas";
import { generateDOCX } from "@/lib/docx-generator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const resume = ResumeSchema.parse(body);
    const buffer = await generateDOCX(resume);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${resume.personalInfo.name.replace(/\s+/g, "_")}_Resume.docx"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate DOCX" }, { status: 500 });
  }
}
