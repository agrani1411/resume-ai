"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface EditorToolbarProps {
  onExportPDF: () => void;
  onExportDOCX: () => void;
  onStartOver: () => void;
  exporting: boolean;
}

export function EditorToolbar({ onExportPDF, onExportDOCX, onStartOver, exporting }: EditorToolbarProps) {
  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">ResumeAI</Link>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onStartOver}>Start Over</Button>
          <Button variant="secondary" size="sm" onClick={onExportDOCX} loading={exporting}>
            Download DOCX
          </Button>
          <Button size="sm" onClick={onExportPDF} loading={exporting}>
            Download PDF
          </Button>
        </div>
      </div>
    </header>
  );
}
