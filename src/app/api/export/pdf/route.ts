import { NextRequest, NextResponse } from "next/server";
import { ResumeSchema } from "@/lib/schemas";
import { generatePDF } from "@/lib/pdf-generator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const resume = ResumeSchema.parse(body);
    const pdfBuffer = await generatePDF(resume);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resume.personalInfo.name.replace(/\s+/g, "_")}_Resume.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
