# ResumeAI — Feature Roadmap (Prioritized)

Based on competitive market analysis (March 2026)

---

## Ranking Criteria

Each feature scored on:
- **Impact** (1-5): How much it moves the needle for users
- **Competitive Edge** (1-5): How much it differentiates from competitors
- **Effort** (1-5): Development complexity (1=easy, 5=hard)
- **Priority Score** = (Impact + Competitive Edge) - (Effort / 2)

---

## Tier 1: Must-Have (Build Next)

| Rank | Feature | Impact | Edge | Effort | Score | Why |
|------|---------|--------|------|--------|-------|-----|
| 1 | **ATS Match Score (Before/After)** | 5 | 5 | 2 | 9 | Jobscan's #1 feature — we can offer it free. Shows users their resume improved from 45% → 92%. Gamification drives sharing. |
| 2 | **Multiple ATS Templates (5-10)** | 5 | 4 | 3 | 7.5 | Currently single template. Users want choice. Competes with Kickresume (40+) and Zety (20+). |
| 3 | **Cover Letter Generator** | 4 | 4 | 2 | 7 | Natural extension — same AI pipeline, same job description input. Most competitors charge extra for this. |
| 4 | **Resume Version History** | 4 | 5 | 2 | 7 | Save multiple tailored versions per job. Store in localStorage. No competitor offers this without an account. |
| 5 | **Before/After Comparison View** | 4 | 4 | 2 | 7 | Side-by-side of original vs optimized resume. Visual proof of value. Great for screenshots/sharing. |

---

## Tier 2: Should-Have (Post-Launch Growth)

| Rank | Feature | Impact | Edge | Effort | Score | Why |
|------|---------|--------|------|--------|-------|-----|
| 6 | **Chrome Extension** | 4 | 4 | 3 | 6.5 | "Optimize for this job" button on LinkedIn/Indeed. Follows Teal's model but free. Massive distribution channel. |
| 7 | **LinkedIn Profile Optimization** | 4 | 3 | 3 | 5.5 | Paste LinkedIn URL → get optimization suggestions. Jobscan charges $50/mo for this. |
| 8 | **Bulk Application Mode** | 4 | 5 | 3 | 7.5 | Upload 1 resume + 5 job descriptions → get 5 tailored resumes. Zero competitors offer this. Game-changer for active job seekers. |
| 9 | **Interview Prep Questions** | 3 | 4 | 2 | 6 | Based on the job description, generate likely interview questions + suggested answers from user's experience. |
| 10 | **Resume Scoring Breakdown** | 4 | 3 | 2 | 6 | Detailed breakdown: formatting score, keyword density, bullet point strength, quantification rate. |

---

## Tier 3: Nice-to-Have (Scale Phase)

| Rank | Feature | Impact | Edge | Effort | Score | Why |
|------|---------|--------|------|--------|-------|-----|
| 11 | **Multi-Language Support** | 3 | 3 | 3 | 4.5 | Resume.io supports 20+ languages. Opens international markets. |
| 12 | **API Access** | 2 | 5 | 3 | 5.5 | Let developers integrate ResumeAI. Unique in market. Builds ecosystem. |
| 13 | **Community Templates** | 3 | 4 | 2 | 6 | Open source template contributions. Leverages the OSS advantage. |
| 14 | **Job Tracker** | 3 | 2 | 4 | 3 | Track which jobs you applied to with which resume version. Teal's feature — lower priority for us. |
| 15 | **Personal Website Generator** | 2 | 3 | 4 | 3 | Generate a portfolio site from resume data. Kickresume has this. Low priority. |

---

## Tier 4: Future Exploration

| Rank | Feature | Impact | Edge | Effort | Score | Why |
|------|---------|--------|------|--------|-------|-----|
| 16 | **AI Mock Interviews** | 3 | 4 | 5 | 4.5 | Voice-based mock interviews using AI. High effort but high differentiation. |
| 17 | **Salary Negotiation Helper** | 2 | 3 | 3 | 3.5 | Based on role + location, suggest salary range and negotiation talking points. |
| 18 | **Networking Email Generator** | 2 | 3 | 2 | 4 | Cold outreach templates personalized to the target company/role. |
| 19 | **White-Label/API for HR Platforms** | 2 | 4 | 5 | 3.5 | Let HR platforms embed ResumeAI. Revenue opportunity. High effort. |
| 20 | **Mobile App** | 3 | 2 | 5 | 2.5 | Native iOS/Android. Low priority — resume editing on mobile is impractical. |

---

## Recommended Implementation Order

### Sprint 1 (Next 2 weeks)
- [ ] ATS Match Score with before/after percentage
- [ ] Before/After comparison view
- [ ] Cover letter generator

### Sprint 2 (Weeks 3-4)
- [ ] 5 additional ATS-friendly templates
- [ ] Resume version history (localStorage)
- [ ] Resume scoring breakdown

### Sprint 3 (Weeks 5-8)
- [ ] Chrome extension
- [ ] Bulk application mode
- [ ] Interview prep questions

### Sprint 4 (Weeks 9-12)
- [ ] Multi-language support
- [ ] LinkedIn profile optimization
- [ ] API access for developers
- [ ] Community templates

---

## Key Takeaways

1. **ATS Match Score is the #1 priority** — it's Jobscan's core $50/mo feature and we can offer it free
2. **Cover letter generation is low-hanging fruit** — same AI pipeline, huge user demand
3. **Bulk mode is our unique killer feature** — no competitor does this, and active job seekers would love it
4. **Chrome extension is the growth hack** — puts ResumeAI where users already are (job boards)
5. **Stay focused on the core workflow** — don't become a bloated career platform like Teal. Do resume optimization better than anyone.

---

*Prioritization based on competitive analysis from docs/market-analysis.md*
