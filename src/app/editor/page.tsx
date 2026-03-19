"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useResume } from "@/context/ResumeContext";
import { ResumeEditor } from "@/components/editor/ResumeEditor";
import { KeywordSidebar } from "@/components/editor/KeywordSidebar";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { Toast } from "@/components/ui/Toast";
import { Resume } from "@/types/resume";
import { saveAs } from "file-saver";

export default function EditorPage() {
  const router = useRouter();
  const {
    generatedResume, setGeneratedResume,
    atsAnalysis, jobDescription, clearAll,
  } = useResume();
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!generatedResume) {
      router.push("/generate");
    }
  }, [generatedResume, router]);

  if (!generatedResume || !atsAnalysis) return null;

  const handleExport = async (format: "pdf" | "docx") => {
    setExporting(true);
    setError(null);
    try {
      const res = await fetch(`/api/export/${format}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generatedResume),
      });

      if (!res.ok) {
        throw new Error(`Failed to generate ${format.toUpperCase()}`);
      }

      const blob = await res.blob();
      const ext = format === "pdf" ? "pdf" : "docx";
      const filename = `${generatedResume.personalInfo.name.replace(/\s+/g, "_")}_Resume.${ext}`;
      saveAs(blob, filename);
    } catch {
      setError(`Failed to export ${format.toUpperCase()}. Please try again.`);
    } finally {
      setExporting(false);
    }
  };

  const handleStartOver = () => {
    clearAll();
    router.push("/generate");
  };

  const handleResumeChange = (updated: Resume) => {
    setGeneratedResume(updated);
  };

  return (
    <div className="h-screen flex flex-col">
      <EditorToolbar
        onExportPDF={() => handleExport("pdf")}
        onExportDOCX={() => handleExport("docx")}
        onStartOver={handleStartOver}
        exporting={exporting}
      />
      <div className="flex flex-1 overflow-hidden">
        <ResumeEditor
          resume={generatedResume}
          keywords={atsAnalysis.keywords}
          onResumeChange={handleResumeChange}
          jobDescription={jobDescription}
        />
        <KeywordSidebar keywords={atsAnalysis.keywords} />
      </div>
      {error && <Toast message={error} onClose={() => setError(null)} />}
    </div>
  );
}
