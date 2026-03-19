import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer, BorderStyle } from "docx";
import { Resume } from "@/types/resume";

export async function generateDOCX(resume: Resume): Promise<Buffer> {
  const children: Paragraph[] = [];

  children.push(new Paragraph({
    children: [new TextRun({ text: resume.personalInfo.name, bold: true, size: 28 })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  }));

  const contactLine = [resume.personalInfo.email, resume.personalInfo.phone, resume.personalInfo.location, resume.personalInfo.linkedin].filter(Boolean).join(" | ");
  children.push(new Paragraph({
    children: [new TextRun({ text: contactLine, size: 18, color: "555555" })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  }));

  const addSection = (title: string) => {
    children.push(new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" } },
    }));
  };

  addSection("Summary");
  children.push(new Paragraph({ children: [new TextRun({ text: resume.summary, size: 20 })], spacing: { after: 100 } }));

  addSection("Experience");
  for (const exp of resume.experience) {
    children.push(new Paragraph({
      children: [
        new TextRun({ text: exp.title, bold: true, size: 20 }),
        new TextRun({ text: `  |  ${exp.startDate} - ${exp.endDate}`, size: 18, color: "555555" }),
      ],
      spacing: { before: 120 },
    }));
    children.push(new Paragraph({
      children: [new TextRun({ text: `${exp.company}, ${exp.location}`, size: 20, color: "333333" })],
    }));
    for (const bullet of exp.bullets) {
      children.push(new Paragraph({ text: bullet, bullet: { level: 0 }, spacing: { after: 40 } }));
    }
  }

  if (resume.projects && resume.projects.length > 0) {
    addSection("Projects");
    for (const proj of resume.projects) {
      children.push(new Paragraph({
        children: [new TextRun({ text: proj.name, bold: true, size: 20 })],
        spacing: { before: 80 },
      }));
      children.push(new Paragraph({ children: [new TextRun({ text: proj.description, size: 20 })] }));
      children.push(new Paragraph({
        children: [new TextRun({ text: proj.technologies.join(", "), size: 18, color: "555555" })],
        spacing: { after: 80 },
      }));
    }
  }

  addSection("Education");
  for (const edu of resume.education) {
    children.push(new Paragraph({
      children: [
        new TextRun({ text: edu.degree, bold: true, size: 20 }),
        new TextRun({ text: `  |  ${edu.graduationDate}`, size: 18, color: "555555" }),
      ],
      spacing: { before: 80 },
    }));
    children.push(new Paragraph({
      children: [new TextRun({ text: `${edu.institution}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}`, size: 20, color: "333333" })],
    }));
  }

  addSection("Skills");
  children.push(new Paragraph({ children: [new TextRun({ text: resume.skills.join(", "), size: 20 })] }));

  if (resume.certifications && resume.certifications.length > 0) {
    addSection("Certifications");
    for (const cert of resume.certifications) {
      children.push(new Paragraph({
        children: [new TextRun({ text: `${cert.name} — ${cert.issuer} (${cert.date})`, size: 20 })],
      }));
    }
  }

  const doc = new Document({
    sections: [{ children }],
  });

  const buffer = await Packer.toBuffer(doc);
  return Buffer.from(buffer);
}
