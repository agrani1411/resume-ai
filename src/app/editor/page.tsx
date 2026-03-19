"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useResume } from "@/context/ResumeContext";
import { ResumeEditor } from "@/components/editor/ResumeEditor";
import { KeywordSidebar } from "@/components/editor/KeywordSidebar";
import { FinalResumePreview } from "@/components/editor/FinalResumePreview";
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

  if (!generatedResume) return null;

  const keywords = atsAnalysis?.keywords || [];

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
        {/* Left: Editable Resume */}
        <div className="flex-1 min-w-0">
          <ResumeEditor
            resume={generatedResume}
            keywords={keywords}
            onResumeChange={handleResumeChange}
            jobDescription={jobDescription}
          />
        </div>

        {/* Middle: ATS Analysis Sidebar */}
        <div className="w-64 flex-shrink-0">
          <KeywordSidebar keywords={keywords} />
        </div>

        {/* Right: Final Submission-Ready Resume */}
        <div className="w-96 flex-shrink-0">
          <FinalResumePreview resume={generatedResume} />
        </div>
      </div>
      {error && <Toast message={error} onClose={() => setError(null)} />}
    </div>
  );
}
