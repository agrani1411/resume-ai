"use client";

import { Button } from "@/components/ui/Button";

interface JobDescriptionStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export function JobDescriptionStep({ value, onChange, onNext }: JobDescriptionStepProps) {
  const isValid = value.trim().length >= 50;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 1: Paste the Job Description</h2>
      <p className="text-gray-600 mb-6">Copy and paste the full job posting you want to apply for.</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job description here..."
        className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">
          {value.trim().length < 50 ? `At least 50 characters required (${value.trim().length}/50)` : "Looks good!"}
        </p>
        <Button onClick={onNext} disabled={!isValid}>Next</Button>
      </div>
    </div>
  );
}
