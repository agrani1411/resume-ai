export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface Education {
  degree: string;
  institution: string;
  graduationDate: string;
  gpa?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface Resume {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  projects?: Project[];
  education: Education[];
  skills: string[];
  certifications?: Certification[];
}

export interface ATSKeyword {
  term: string;
  matched: boolean;
}

export interface ATSAnalysis {
  keywords: ATSKeyword[];
  originalScore?: number;
  optimizedScore?: number;
}

export interface GenerateResumeResponse {
  resume: Resume;
  atsAnalysis: ATSAnalysis;
}
