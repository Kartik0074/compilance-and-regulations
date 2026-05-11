# EU Startup Compliance Checker

An interactive web tool that helps tech founders and developers identify which EU regulations apply to their company — before they get a fine.

**Live Demo → [your-github-username.github.io/eu-compliance-checker]()**

![EU Compliance Checker Screenshot](screenshot.png)

---

## What It Does

Answer 15 questions about your product, data handling, and company size. The tool instantly generates a tailored compliance action list covering:

- **GDPR** — General Data Protection Regulation
- **ISO 27001** — Information Security Management
- **NIS2** — Network & Information Security Directive 2
- **DORA** — Digital Operational Resilience Act (Financial sector)
- **KRITIS** — German Critical Infrastructure Regulation

Each triggered framework shows prioritised actions (High / Medium / Low) with the exact legal article reference.

---

## Why I Built This

Most early-stage tech companies in Germany discover compliance requirements too late — after a client rejects them, or worse, after a regulatory fine.

This tool is a starting point: a structured way to understand your exposure across the five key EU/German frameworks before you engage a lawyer or consultant.

Built as a GRC portfolio project to demonstrate practical knowledge of EU data protection and cybersecurity regulation.

---

## Tech Stack

- React + Vite
- 100% client-side — no backend, no database, no user data collected
- No third-party analytics or tracking

---

## Run Locally

```bash
git clone https://github.com/your-username/eu-compliance-checker.git
cd eu-compliance-checker
npm install
npm run dev
```

Open `http://localhost:5173/`

---

## Frameworks Covered

| Framework | Scope | Enforced By |
|---|---|---|
| GDPR | Any company processing EU personal data | National DPAs (e.g. BfDI in Germany) |
| ISO 27001 | Information security management | Certification bodies |
| NIS2 | Essential & important entities in covered sectors | BSI (Germany) |
| DORA | Financial entities and ICT providers | BaFin (Germany) |
| KRITIS | Critical infrastructure operators in Germany | BSI |

---

## Disclaimer

This tool is for educational and awareness purposes only. It does not constitute legal advice. Always consult a qualified legal or compliance professional for your specific situation.

---

## Author

**Kartik** — MSc Cybersecurity student at Gisma University of Applied Sciences, Berlin.  
Certifications: CompTIA Security+, ISC2 CC, Microsoft AZ-900, SC-900, CNSP.  
