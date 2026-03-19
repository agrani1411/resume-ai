import mammoth from "mammoth";

export async function parsePDF(buffer: Buffer): Promise<string> {
  // pdf-parse v1 uses default export as a function
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  const data = await pdfParse(buffer);
  if (!data.text || data.text.trim().length < 20) {
    throw new Error("Could not extract text from PDF. It may be scanned or image-based.");
  }
  return data.text;
}

export async function parseDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  if (!result.value || result.value.trim().length < 20) {
    throw new Error("Could not extract text from DOCX.");
  }
  return result.value;
}
