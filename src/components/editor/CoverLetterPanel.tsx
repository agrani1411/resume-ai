"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface CoverLetterPanelProps {
  jobDescription: string;
  resumeText: string;
}

export function CoverLetterPanel({ jobDescription, resumeText }: CoverLetterPanelProps) {
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [positionTitle, setPositionTitle] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, resumeText }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate");
      }
      const data = await res.json();
      setCoverLetter(data.coverLetter || "");
      setPositionTitle(data.positionTitle || "");
      setCompanyName(data.companyName || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate cover letter");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!coverLetter && !generating) {
    return (
      <div className="h-full border-l border-gray-200 bg-white flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900 text-sm">Cover Letter</h3>
          <p className="text-xs text-gray-500">AI-generated, tailored to the job</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-4">Generate a cover letter matched to this job description</p>
            <Button onClick={handleGenerate} loading={generating}>
              Generate Cover Letter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="h-full border-l border-gray-200 bg-white flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900 text-sm">Cover Letter</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-gray-500 text-sm">Writing your cover letter...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full border-l border-gray-200 bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Cover Letter</h3>
          {positionTitle && <p className="text-xs text-gray-500">{positionTitle}{companyName ? ` at ${companyName}` : ""}</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Preview" : "Edit"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleGenerate} loading={generating}>
            Regenerate
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {isEditing ? (
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full h-full p-3 border border-gray-300 rounded-lg text-sm leading-relaxed resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <div className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
            {coverLetter}
          </div>
        )}
      </div>
    </div>
  );
}
