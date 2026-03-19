"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { ManualEntryForm } from "./ManualEntryForm";

interface ResumeInputStepProps {
  value: string;
  onChange: (value: string) => void;
  onBack: () => void;
  onGenerate: () => void;
  isLoading: boolean;
}

type Tab = "upload" | "paste" | "manual";

export function ResumeInputStep({ value, onChange, onBack, onGenerate, isLoading }: ResumeInputStepProps) {
  const [tab, setTab] = useState<Tab>("upload");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File must be under 5MB");
      return;
    }
    const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isDOCX = file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.toLowerCase().endsWith(".docx");
    if (!isPDF && !isDOCX) {
      setUploadError("Please upload a PDF or DOCX file");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/parse-resume", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        setUploadError(data.error || "Could not read this file. Try pasting the text instead.");
        return;
      }
      const data = await res.json();
      onChange(data.text);
      setTab("paste");
    } catch {
      setUploadError("Could not read this file. Try pasting the text instead.");
    }
  };

  const tabs = [
    { id: "upload" as Tab, label: "Upload File" },
    { id: "paste" as Tab, label: "Paste Text" },
    { id: "manual" as Tab, label: "Fill Manually" },
  ];

  const isValid = value.trim().length >= 50;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Add Your Resume</h2>
      <p className="text-gray-600 mb-6">Upload your existing resume or enter your details.</p>
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "upload" && (
        <div>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleFileUpload(file);
            }}
          >
            <p className="text-gray-600 mb-2">Drag &amp; drop your resume here, or click to browse</p>
            <p className="text-sm text-gray-400">PDF or DOCX, max 5MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </div>
          {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
        </div>
      )}
      {tab === "paste" && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your resume text here..."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      )}
      {tab === "manual" && <ManualEntryForm onChange={onChange} />}
      <div className="flex items-center justify-between mt-6">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onGenerate} disabled={!isValid} loading={isLoading}>Generate Resume</Button>
      </div>
    </div>
  );
}
