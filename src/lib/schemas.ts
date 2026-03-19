import { z } from "zod";

export const PersonalInfoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  location: z.string().min(1),
  linkedin: z.string().optional(),
});

export const ExperienceSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
});

export const ProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string()),
  url: z.string().optional(),
});

export const EducationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  graduationDate: z.string().min(1),
  gpa: z.string().optional(),
});

export const CertificationSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string().min(1),
});

export const ResumeSchema = z.object({
  personalInfo: PersonalInfoSchema,
  summary: z.string().min(1),
  experience: z.array(ExperienceSchema).min(1),
  projects: z.array(ProjectSchema).optional(),
  education: z.array(EducationSchema).min(1),
  skills: z.array(z.string().min(1)).min(1),
  certifications: z.array(CertificationSchema).optional(),
});

export const ATSKeywordSchema = z.object({
  term: z.string().min(1),
  matched: z.boolean(),
});

export const ATSAnalysisSchema = z.object({
  keywords: z.array(ATSKeywordSchema),
});

export const GenerateResumeResponseSchema = z.object({
  resume: ResumeSchema,
  atsAnalysis: ATSAnalysisSchema,
});
