"use client";

import { ResumeProvider } from "@/context/ResumeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ResumeProvider>{children}</ResumeProvider>;
}
