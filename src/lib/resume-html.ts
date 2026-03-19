import { Resume } from "@/types/resume";

export function resumeToHTML(resume: Resume): string {
  let html = "";

  html += `<div data-section="summary">`;
  html += `<h2>Summary</h2>`;
  html += `<p>${resume.summary}</p>`;
  html += `</div>`;

  html += `<div data-section="experience">`;
  html += `<h2>Experience</h2>`;
  for (const exp of resume.experience) {
    html += `<h3>${exp.title} | ${exp.company}, ${exp.location}</h3>`;
    html += `<p><em>${exp.startDate} - ${exp.endDate}</em></p>`;
    html += `<ul>`;
    for (const bullet of exp.bullets) {
      html += `<li>${bullet}</li>`;
    }
    html += `</ul>`;
  }
  html += `</div>`;

  if (resume.projects && resume.projects.length > 0) {
    html += `<div data-section="projects">`;
    html += `<h2>Projects</h2>`;
    for (const proj of resume.projects) {
      html += `<h3>${proj.name}</h3>`;
      html += `<p>${proj.description}</p>`;
      html += `<p><em>${proj.technologies.join(", ")}</em></p>`;
    }
    html += `</div>`;
  }

  html += `<div data-section="education">`;
  html += `<h2>Education</h2>`;
  for (const edu of resume.education) {
    html += `<h3>${edu.degree} | ${edu.institution}</h3>`;
    html += `<p><em>${edu.graduationDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}</em></p>`;
  }
  html += `</div>`;

  html += `<div data-section="skills">`;
  html += `<h2>Skills</h2>`;
  html += `<p>${resume.skills.join(", ")}</p>`;
  html += `</div>`;

  if (resume.certifications && resume.certifications.length > 0) {
    html += `<div data-section="certifications">`;
    html += `<h2>Certifications</h2>`;
    html += `<ul>`;
    for (const cert of resume.certifications) {
      html += `<li>${cert.name} — ${cert.issuer} (${cert.date})</li>`;
    }
    html += `</ul>`;
    html += `</div>`;
  }

  return html;
}

export function highlightKeywords(html: string, keywords: string[]): string {
  let result = html;
  for (const keyword of keywords) {
    const regex = new RegExp(`\\b(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`, "gi");
    result = result.replace(regex, `<mark>$1</mark>`);
  }
  return result;
}
