"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResume } from "@/context/ResumeContext";
import { JobDescriptionStep } from "@/components/generator/JobDescriptionStep";
import { ResumeInputStep } from "@/components/generator/ResumeInputStep";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Toast } from "@/components/ui/Toast";
import Link from "next/link";

export default function GeneratePage() {
  const router = useRouter();
  const {
    jobDescription, setJobDescription,
    resumeText, setResumeText,
    setGeneratedResume, setAtsAnalysis,
    isLoading, setIsLoading,
    error, setError,
  } = useResume();
  const [step, setStep] = useState(1);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, resumeText }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate resume");
      }
      const data = await res.json();
      setGeneratedResume(data.resume);
      setAtsAnalysis(data.atsAnalysis);
      router.push("/editor");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <Link href="/" className="text-xl font-bold text-gray-900">ResumeAI</Link>
          </div>
        </header>
        <LoadingSpinner message="Analyzing job description and generating your resume..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">ResumeAI</Link>
          <div className="text-sm text-gray-500">Step {step} of 2</div>
        </div>
      </header>
      <main className="px-6 py-12">
        {step === 1 && (
          <JobDescriptionStep
            value={jobDescription}
            onChange={setJobDescription}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <ResumeInputStep
            value={resumeText}
            onChange={setResumeText}
            onBack={() => setStep(1)}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        )}
      </main>
      {error && <Toast message={error} onClose={() => setError(null)} />}
    </div>
  );
}
