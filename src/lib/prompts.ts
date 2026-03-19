export function buildGenerateResumePrompt(jobDescription: string, resumeText: string): string {
  return `You are an expert resume writer and ATS optimization specialist.

TASK: Analyze the job description and rewrite the candidate's resume to maximize ATS compatibility and interview chances.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S CURRENT RESUME:
${resumeText}

INSTRUCTIONS:
1. Analyze the job description for key requirements, skills, and keywords.
2. Restructure the resume to lead with the most relevant experience.
3. Rewrite bullet points using strong action verbs and quantified results where possible.
4. Naturally incorporate keywords from the job description where the candidate has genuine experience.
5. Write a compelling 2-3 sentence professional summary tailored to this role.
6. DO NOT fabricate any experience, skills, or qualifications the candidate doesn't have.
7. Use standard section headings: Summary, Experience, Projects (if applicable), Education, Skills, Certifications (if applicable).

OUTPUT: Return ONLY valid JSON matching this exact structure (no markdown, no code fences):

{
  "resume": {
    "personalInfo": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "" },
    "summary": "",
    "experience": [{ "title": "", "company": "", "location": "", "startDate": "", "endDate": "", "bullets": [""] }],
    "projects": [{ "name": "", "description": "", "technologies": [""], "url": "" }],
    "education": [{ "degree": "", "institution": "", "graduationDate": "", "gpa": "" }],
    "skills": [""],
    "certifications": [{ "name": "", "issuer": "", "date": "" }]
  },
  "atsAnalysis": {
    "keywords": [{ "term": "", "matched": true }]
  }
}

For "endDate", use "Present" for current roles. Omit projects/certifications arrays entirely if none found. The keywords array should include ALL important terms from the job description, with "matched": true if the resume includes that skill/experience, false if not.`;
}

export function buildRegenerateSectionPrompt(
  sectionName: string,
  currentSection: string,
  jobDescription: string,
  fullResumeContext: string
): string {
  return `You are an expert resume writer. Rewrite ONLY the "${sectionName}" section of this resume to better match the job description.

JOB DESCRIPTION:
${jobDescription}

FULL RESUME CONTEXT:
${fullResumeContext}

CURRENT ${sectionName.toUpperCase()} SECTION:
${currentSection}

Rewrite this section to better align with the job requirements. Keep the same JSON structure. Return ONLY the updated section as valid JSON (no markdown, no code fences). Do not fabricate experience.`;
}
