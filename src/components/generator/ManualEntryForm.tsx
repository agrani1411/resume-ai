"use client";

import { useState } from "react";

interface ManualEntryFormProps {
  onChange: (text: string) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
}

export function ManualEntryForm({ onChange }: ManualEntryFormProps) {
  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", location: "",
    summary: "", experience: "", education: "", skills: "",
  });

  const update = (field: keyof FormData, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    const text = [
      `Name: ${updated.name}`,
      `Email: ${updated.email}`,
      `Phone: ${updated.phone}`,
      `Location: ${updated.location}`,
      `Summary: ${updated.summary}`,
      `Experience:\n${updated.experience}`,
      `Education:\n${updated.education}`,
      `Skills: ${updated.skills}`,
    ].filter(line => !line.endsWith(": ") && !line.endsWith(":\n")).join("\n\n");
    onChange(text);
  };

  const inputClass = "w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input className={inputClass} placeholder="Full Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
        <input className={inputClass} placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        <input className={inputClass} placeholder="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        <input className={inputClass} placeholder="Location" value={form.location} onChange={(e) => update("location", e.target.value)} />
      </div>
      <textarea className={`${inputClass} h-20 resize-none`} placeholder="Professional summary..." value={form.summary} onChange={(e) => update("summary", e.target.value)} />
      <textarea className={`${inputClass} h-32 resize-none`} placeholder="Work experience (include job titles, companies, dates, and key responsibilities)..." value={form.experience} onChange={(e) => update("experience", e.target.value)} />
      <textarea className={`${inputClass} h-20 resize-none`} placeholder="Education (degrees, institutions, dates)..." value={form.education} onChange={(e) => update("education", e.target.value)} />
      <textarea className={`${inputClass} h-16 resize-none`} placeholder="Skills (comma separated)..." value={form.skills} onChange={(e) => update("skills", e.target.value)} />
    </div>
  );
}
