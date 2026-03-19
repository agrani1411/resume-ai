import { NextRequest, NextResponse } from "next/server";
import { parsePDF, parseDOCX } from "@/lib/resume-parser";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text: string;

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      text = await parsePDF(buffer);
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.endsWith(".docx")
    ) {
      text = await parseDOCX(buffer);
    } else {
      return NextResponse.json({ error: "Unsupported file type. Upload PDF or DOCX." }, { status: 400 });
    }

    return NextResponse.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not read this file. Try pasting the text instead.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
