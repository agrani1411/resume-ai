import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Resume } from "@/types/resume";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, lineHeight: 1.5 },
  name: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  contactLine: { fontSize: 9, color: "#555", marginBottom: 12 },
  sectionTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", borderBottomWidth: 1, borderBottomColor: "#000", paddingBottom: 2, marginBottom: 6, marginTop: 12 },
  jobHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  jobTitle: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  jobCompany: { fontSize: 10, color: "#333" },
  jobDate: { fontSize: 9, color: "#555" },
  bullet: { marginLeft: 12, marginBottom: 2 },
  summary: { marginBottom: 4 },
  skillLine: { marginBottom: 2 },
});

export async function generatePDF(resume: Resume): Promise<Buffer> {
  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{resume.personalInfo.name}</Text>
        <Text style={styles.contactLine}>
          {[resume.personalInfo.email, resume.personalInfo.phone, resume.personalInfo.location, resume.personalInfo.linkedin].filter(Boolean).join(" | ")}
        </Text>

        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.summary}>{resume.summary}</Text>

        <Text style={styles.sectionTitle}>Experience</Text>
        {resume.experience.map((exp, i) => (
          <View key={i} style={{ marginBottom: 8 }}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>{exp.title}</Text>
              <Text style={styles.jobDate}>{exp.startDate} - {exp.endDate}</Text>
            </View>
            <Text style={styles.jobCompany}>{exp.company}, {exp.location}</Text>
            {exp.bullets.map((b, j) => (
              <Text key={j} style={styles.bullet}>• {b}</Text>
            ))}
          </View>
        ))}

        {resume.projects && resume.projects.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Projects</Text>
            {resume.projects.map((p, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={styles.jobTitle}>{p.name}</Text>
                <Text>{p.description}</Text>
                <Text style={{ fontSize: 9, color: "#555" }}>{p.technologies.join(", ")}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Education</Text>
        {resume.education.map((edu, i) => (
          <View key={i} style={{ marginBottom: 4 }}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>{edu.degree}</Text>
              <Text style={styles.jobDate}>{edu.graduationDate}</Text>
            </View>
            <Text style={styles.jobCompany}>{edu.institution}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Skills</Text>
        <Text style={styles.skillLine}>{resume.skills.join(", ")}</Text>

        {resume.certifications && resume.certifications.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {resume.certifications.map((c, i) => (
              <Text key={i} style={styles.skillLine}>{c.name} — {c.issuer} ({c.date})</Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );

  return await renderToBuffer(doc);
}
