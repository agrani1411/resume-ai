import { z } from "zod";

export const PersonalInfoSchema = z.object({
  name: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  location: z.string().default(""),
  linkedin: z.string().optional().default(""),
}).passthrough();

export const ExperienceSchema = z.object({
  title: z.string().default(""),
  company: z.string().default(""),
  location: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  bullets: z.array(z.string()).default([]),
}).passthrough();

export const ProjectSchema = z.object({
  name: z.string().default(""),
  description: z.string().default(""),
  technologies: z.array(z.string()).default([]),
  url: z.string().optional().default(""),
}).passthrough();

export const EducationSchema = z.object({
  degree: z.string().default(""),
  institution: z.string().default(""),
  graduationDate: z.string().default(""),
  gpa: z.string().optional().default(""),
}).passthrough();

export const CertificationSchema = z.object({
  name: z.string().default(""),
  issuer: z.string().default(""),
  date: z.string().default(""),
}).passthrough();

export const ResumeSchema = z.object({
  personalInfo: PersonalInfoSchema,
  summary: z.string().default(""),
  experience: z.array(ExperienceSchema).default([]),
  projects: z.array(ProjectSchema).optional().default([]),
  education: z.array(EducationSchema).default([]),
  skills: z.array(z.string()).default([]),
  certifications: z.array(CertificationSchema).optional().default([]),
}).passthrough();

export const ATSKeywordSchema = z.object({
  term: z.string(),
  matched: z.boolean(),
}).passthrough();

export const ATSAnalysisSchema = z.object({
  keywords: z.array(ATSKeywordSchema).default([]),
}).passthrough();

export const GenerateResumeResponseSchema = z.object({
  resume: ResumeSchema,
  atsAnalysis: ATSAnalysisSchema.optional().default({ keywords: [] }),
}).passthrough();
