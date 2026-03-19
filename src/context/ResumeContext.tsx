"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Resume, ATSAnalysis } from "@/types/resume";

interface ResumeContextType {
  jobDescription: string;
  setJobDescription: (jd: string) => void;
  resumeText: string;
  setResumeText: (text: string) => void;
  generatedResume: Resume | null;
  setGeneratedResume: (resume: Resume | null) => void;
  atsAnalysis: ATSAnalysis | null;
  setAtsAnalysis: (analysis: ATSAnalysis | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  clearAll: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const STORAGE_KEY = "resume-generator-state";

interface PersistedState {
  jobDescription: string;
  resumeText: string;
  generatedResume: Resume | null;
  atsAnalysis: ATSAnalysis | null;
}

function loadFromStorage(): PersistedState {
  if (typeof window === "undefined") {
    return { jobDescription: "", resumeText: "", generatedResume: null, atsAnalysis: null };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { jobDescription: "", resumeText: "", generatedResume: null, atsAnalysis: null };
}

function saveToStorage(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [generatedResume, setGeneratedResume] = useState<Resume | null>(null);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage();
    setJobDescription(stored.jobDescription);
    setResumeText(stored.resumeText);
    setGeneratedResume(stored.generatedResume);
    setAtsAnalysis(stored.atsAnalysis);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage({ jobDescription, resumeText, generatedResume, atsAnalysis });
  }, [jobDescription, resumeText, generatedResume, atsAnalysis, hydrated]);

  const clearAll = useCallback(() => {
    setJobDescription("");
    setResumeText("");
    setGeneratedResume(null);
    setAtsAnalysis(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        jobDescription, setJobDescription,
        resumeText, setResumeText,
        generatedResume, setGeneratedResume,
        atsAnalysis, setAtsAnalysis,
        isLoading, setIsLoading,
        error, setError,
        clearAll,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) throw new Error("useResume must be used within ResumeProvider");
  return context;
}
