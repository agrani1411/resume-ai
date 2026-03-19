"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { useState } from "react";
import { Resume, ATSKeyword } from "@/types/resume";
import { resumeToHTML, highlightKeywords } from "@/lib/resume-html";
import { Button } from "@/components/ui/Button";

interface ResumeEditorProps {
  resume: Resume;
  keywords: ATSKeyword[];
  onResumeChange: (resume: Resume) => void;
  jobDescription: string;
}

export function ResumeEditor({ resume, keywords, onResumeChange, jobDescription }: ResumeEditorProps) {
  const [regenerating, setRegenerating] = useState<string | null>(null);

  const matchedKeywords = keywords.filter((k) => k.matched).map((k) => k.term);
  const initialHTML = highlightKeywords(resumeToHTML(resume), matchedKeywords);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: false }),
    ],
    content: initialHTML,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[600px] p-6",
      },
    },
  });

  const handleRegenerateSection = async (sectionName: string) => {
    setRegenerating(sectionName);
    try {
      const currentSection = JSON.stringify(
        sectionName === "summary" ? resume.summary :
        sectionName === "experience" ? resume.experience :
        sectionName === "education" ? resume.education :
        sectionName === "skills" ? resume.skills :
        sectionName === "projects" ? resume.projects :
        resume.certifications
      );

      const res = await fetch("/api/regenerate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionName,
          currentSection,
          jobDescription,
          fullResumeContext: JSON.stringify(resume),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedResume = { ...resume, [sectionName]: data.section };
        onResumeChange(updatedResume);
        if (editor) {
          const newHTML = highlightKeywords(resumeToHTML(updatedResume), matchedKeywords);
          editor.commands.setContent(newHTML);
        }
      }
    } catch {
      // Error handled by toast in parent
    } finally {
      setRegenerating(null);
    }
  };

  const sections = [
    { name: "summary", label: "Summary" },
    { name: "experience", label: "Experience" },
    { name: "projects", label: "Projects" },
    { name: "education", label: "Education" },
    { name: "skills", label: "Skills" },
    { name: "certifications", label: "Certifications" },
  ].filter((s) => {
    if (s.name === "projects") return resume.projects && resume.projects.length > 0;
    if (s.name === "certifications") return resume.certifications && resume.certifications.length > 0;
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="px-6 pt-6 pb-2 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">{resume.personalInfo.name}</h1>
        <p className="text-sm text-gray-600">
          {[resume.personalInfo.email, resume.personalInfo.phone, resume.personalInfo.location, resume.personalInfo.linkedin].filter(Boolean).join(" | ")}
        </p>
      </div>
      <div className="px-6 py-2 flex gap-2 flex-wrap border-b border-gray-100 bg-gray-50">
        <span className="text-xs text-gray-500 self-center mr-2">Regenerate:</span>
        {sections.map((s) => (
          <Button
            key={s.name}
            variant="outline"
            size="sm"
            onClick={() => handleRegenerateSection(s.name)}
            loading={regenerating === s.name}
          >
            {s.label}
          </Button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
