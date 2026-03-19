"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">ResumeAI</h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Land More Interviews with an ATS-Optimized Resume
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Paste a job description and your resume. Our AI tailors your resume to match what employers are looking for — with the right keywords, structure, and language.
        </p>
        <Link href="/generate">
          <Button size="lg">Get Started — It&apos;s Free</Button>
        </Link>
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-xl bg-gray-50">
            <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
            <h3 className="font-semibold text-gray-900 mb-1">Paste Job Description</h3>
            <p className="text-sm text-gray-600">Copy the job posting you want to apply for.</p>
          </div>
          <div className="p-6 rounded-xl bg-gray-50">
            <div className="text-2xl font-bold text-blue-600 mb-2">2</div>
            <h3 className="font-semibold text-gray-900 mb-1">Add Your Resume</h3>
            <p className="text-sm text-gray-600">Upload a file, paste text, or fill in your details.</p>
          </div>
          <div className="p-6 rounded-xl bg-gray-50">
            <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
            <h3 className="font-semibold text-gray-900 mb-1">Download &amp; Apply</h3>
            <p className="text-sm text-gray-600">Edit your tailored resume and export as PDF or DOCX.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
