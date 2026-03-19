"use client";

import { Resume } from "@/types/resume";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

interface FinalResumePreviewProps {
  resume: Resume;
}

export function FinalResumePreview({ resume }: FinalResumePreviewProps) {
  const [copied, setCopied] = useState(false);

  const buildPlainText = () => {
    const lines: string[] = [];

    // Header
    lines.push(resume.personalInfo.name.toUpperCase());
    const contact = [resume.personalInfo.email, resume.personalInfo.phone, resume.personalInfo.location, resume.personalInfo.linkedin].filter(Boolean).join(" | ");
    if (contact) lines.push(contact);
    lines.push("");

    // Summary
    if (resume.summary) {
      lines.push("PROFESSIONAL SUMMARY");
      lines.push("-".repeat(40));
      lines.push(resume.summary);
      lines.push("");
    }

    // Experience
    if (resume.experience?.length > 0) {
      lines.push("EXPERIENCE");
      lines.push("-".repeat(40));
      for (const exp of resume.experience) {
        lines.push(`${exp.title} | ${exp.company}, ${exp.location}`);
        lines.push(`${exp.startDate} - ${exp.endDate}`);
        for (const bullet of exp.bullets) {
          lines.push(`  • ${bullet}`);
        }
        lines.push("");
      }
    }

    // Projects
    if (resume.projects && resume.projects.length > 0) {
      lines.push("PROJECTS");
      lines.push("-".repeat(40));
      for (const proj of resume.projects) {
        lines.push(proj.name);
        lines.push(proj.description);
        if (proj.technologies?.length > 0) {
          lines.push(`Technologies: ${proj.technologies.join(", ")}`);
        }
        lines.push("");
      }
    }

    // Education
    if (resume.education?.length > 0) {
      lines.push("EDUCATION");
      lines.push("-".repeat(40));
      for (const edu of resume.education) {
        lines.push(`${edu.degree} | ${edu.institution}`);
        lines.push(edu.graduationDate + (edu.gpa ? ` | GPA: ${edu.gpa}` : ""));
        lines.push("");
      }
    }

    // Skills
    if (resume.skills?.length > 0) {
      lines.push("SKILLS");
      lines.push("-".repeat(40));
      lines.push(resume.skills.join(", "));
      lines.push("");
    }

    // Certifications
    if (resume.certifications && resume.certifications.length > 0) {
      lines.push("CERTIFICATIONS");
      lines.push("-".repeat(40));
      for (const cert of resume.certifications) {
        lines.push(`${cert.name} — ${cert.issuer} (${cert.date})`);
      }
    }

    return lines.join("\n");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildPlainText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Final Resume</h3>
          <p className="text-xs text-gray-500">Ready to submit</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy All"}
        </Button>
      </div>

      {/* Preview */}
      <div className="flex-1 overflow-y-auto p-5 font-mono text-xs leading-relaxed">
        {/* Name */}
        <div className="text-center mb-3">
          <h1 className="text-base font-bold text-gray-900 tracking-wide uppercase">
            {resume.personalInfo.name}
          </h1>
          <p className="text-gray-600 text-[11px] mt-0.5">
            {[resume.personalInfo.email, resume.personalInfo.phone, resume.personalInfo.location, resume.personalInfo.linkedin].filter(Boolean).join(" | ")}
          </p>
        </div>

        {/* Summary */}
        {resume.summary && (
          <div className="mb-3">
            <h2 className="font-bold text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5 text-[11px] uppercase tracking-wider">Professional Summary</h2>
            <p className="text-gray-700">{resume.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resume.experience?.length > 0 && (
          <div className="mb-3">
            <h2 className="font-bold text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5 text-[11px] uppercase tracking-wider">Experience</h2>
            {resume.experience.map((exp, i) => (
              <div key={i} className="mb-2.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">{exp.title}</span>
                  <span className="text-gray-500 text-[10px]">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-gray-600 italic">{exp.company}, {exp.location}</div>
                <ul className="mt-0.5 space-y-0.5">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="text-gray-700 pl-3 relative before:content-['•'] before:absolute before:left-0">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <div className="mb-3">
            <h2 className="font-bold text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5 text-[11px] uppercase tracking-wider">Projects</h2>
            {resume.projects.map((proj, i) => (
              <div key={i} className="mb-2">
                <span className="font-bold text-gray-900">{proj.name}</span>
                <p className="text-gray-700">{proj.description}</p>
                {proj.technologies?.length > 0 && (
                  <p className="text-gray-500 italic">{proj.technologies.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {resume.education?.length > 0 && (
          <div className="mb-3">
            <h2 className="font-bold text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5 text-[11px] uppercase tracking-wider">Education</h2>
            {resume.education.map((edu, i) => (
              <div key={i} className="mb-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">{edu.degree}</span>
                  <span className="text-gray-500 text-[10px]">{edu.graduationDate}</span>
                </div>
                <div className="text-gray-600">{edu.institution}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}</div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {resume.skills?.length > 0 && (
          <div className="mb-3">
            <h2 className="font-bold text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5 text-[11px] uppercase tracking-wider">Skills</h2>
            <p className="text-gray-700">{resume.skills.join(", ")}</p>
          </div>
        )}

        {/* Certifications */}
        {resume.certifications && resume.certifications.length > 0 && (
          <div className="mb-3">
            <h2 className="font-bold text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5 text-[11px] uppercase tracking-wider">Certifications</h2>
            {resume.certifications.map((cert, i) => (
              <div key={i} className="text-gray-700">{cert.name} — {cert.issuer} ({cert.date})</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
