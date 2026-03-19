import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export async function parsePDF(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  if (!result.text || result.text.trim().length < 20) {
    throw new Error("Could not extract text from PDF. It may be scanned or image-based.");
  }
  return result.text;
}

export async function parseDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  if (!result.value || result.value.trim().length < 20) {
    throw new Error("Could not extract text from DOCX.");
  }
  return result.value;
}
