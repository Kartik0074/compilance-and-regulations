// @ts-nocheck
import { useState } from "react";

const QUESTIONS = [
  {
    module: "Module 01",
    title: "Data & Users",
    desc: "What kind of data does your product collect or process?",
    items: [
      { id: "personal_data", text: "We collect personal data", sub: "Names, emails, IP addresses, cookies, or location data", tags: ["GDPR"] },
      { id: "sensitive_data", text: "We process sensitive data", sub: "Health records, biometrics, political views, or ethnic origin", tags: ["GDPR"] },
      { id: "eu_users", text: "Our users are based in the EU", sub: "GDPR applies regardless of where your company is registered", tags: ["GDPR", "NIS2"] },
      { id: "third_party_sharing", text: "We share data with third-party vendors", sub: "Analytics tools, cloud providers, marketing platforms", tags: ["GDPR", "ISO 27001"] },
      { id: "data_transfer", text: "We transfer data outside the EU", sub: "To the US, India, or any non-adequate country", tags: ["GDPR"] },
    ],
  },
  {
    module: "Module 02",
    title: "Product & Sector",
    desc: "The nature of your product determines which sector regulations apply.",
    items: [
      { id: "fintech", text: "We operate in financial services", sub: "Payments, banking, investment, lending, or crypto", tags: ["DORA", "NIS2"] },
      { id: "cloud_saas", text: "We provide cloud or managed IT services", sub: "SaaS platforms, cloud infrastructure, or managed services", tags: ["NIS2", "ISO 27001"] },
      { id: "critical_infra", text: "We operate in critical infrastructure", sub: "Energy, water, transport, healthcare, or public administration", tags: ["KRITIS", "NIS2"] },
      { id: "b2b_supplier", text: "We supply enterprises or government", sub: "Clients will contractually require ISO 27001 compliance", tags: ["ISO 27001"] },
      { id: "ai_product", text: "Our product uses AI or automated decisions", sub: "Decisions with legal or significant effects on individuals", tags: ["GDPR"] },
    ],
  },
  {
    module: "Module 03",
    title: "Company Profile",
    desc: "Company size and current security posture affect your obligations.",
    items: [
      { id: "over_50", text: "50+ employees or €10M+ annual revenue", sub: "NIS2 'important entity' classification threshold", tags: ["NIS2"] },
      { id: "over_250", text: "250+ employees or €50M+ annual revenue", sub: "NIS2 'essential entity' — stricter obligations apply", tags: ["NIS2", "KRITIS"] },
      { id: "no_security_policy", text: "No formal security policies exist yet", sub: "No documented ISMS, risk register, or security governance", tags: ["ISO 27001", "GDPR"] },
      { id: "no_dpo", text: "No Data Protection Officer appointed", sub: "May be legally mandatory depending on processing type", tags: ["GDPR"] },
      { id: "breach_plan", text: "No incident response plan in place", sub: "GDPR requires 72-hour breach notification to the DPA", tags: ["GDPR", "NIS2"] },
    ],
  },
];

const TAG_META = {
  GDPR:       { color: "#60a5fa", bg: "#1e3a5f" },
  "ISO 27001":{ color: "#4ade80", bg: "#14402a" },
  NIS2:       { color: "#fbbf24", bg: "#3d2e0a" },
  DORA:       { color: "#a78bfa", bg: "#2d1f4e" },
  KRITIS:     { color: "#f87171", bg: "#3d1a1a" },
};

const FW_META = {
  gdpr:   { color: "#60a5fa", label: "GDPR",      full: "General Data Protection Regulation" },
  iso:    { color: "#4ade80", label: "ISO 27001",  full: "Information Security Management System" },
  nis2:   { color: "#fbbf24", label: "NIS2",       full: "Network & Information Security Directive 2" },
  dora:   { color: "#a78bfa", label: "DORA",       full: "Digital Operational Resilience Act" },
  kritis: { color: "#f87171", label: "KRITIS",     full: "German Critical Infrastructure Regulation" },
};

const PRIORITY_COLOR = { high: "#f87171", medium: "#fbbf24", low: "#60a5fa" };
const STATUS_META = {
  applies: { label: "APPLIES",        color: "#f87171", bg: "#3d1a1a" },
  likely:  { label: "LIKELY APPLIES", color: "#fbbf24", bg: "#3d2e0a" },
  review:  { label: "REVIEW NEEDED",  color: "#60a5fa", bg: "#1e3a5f" },
};

function buildReport(sel) {
  const s = sel;
  const out = [];

  // GDPR
  const gdprIds = ["personal_data","sensitive_data","eu_users","third_party_sharing","data_transfer","ai_product","no_dpo","breach_plan"];
  if (gdprIds.some(id => s.has(id))) {
    const reqs = [];
    if (s.has("personal_data") || s.has("eu_users")) {
      reqs.push({ p:"high", t:"Privacy Policy & Legal Basis", d:"Document the lawful basis for each processing activity and publish an accessible privacy policy for users.", ref:"GDPR Art. 6, 13–14" });
      reqs.push({ p:"high", t:"Records of Processing Activities (ROPA)", d:"Maintain an internal register of all data flows — what you collect, why, who accesses it, and retention periods.", ref:"GDPR Art. 30" });
    }
    if (s.has("sensitive_data")) reqs.push({ p:"high", t:"Data Protection Impact Assessment (DPIA)", d:"Processing special category data requires a formal DPIA before processing begins. This is mandatory, not optional.", ref:"GDPR Art. 9, 35" });
    if (s.has("third_party_sharing")) reqs.push({ p:"high", t:"Data Processing Agreements (DPAs)", d:"Every vendor processing data on your behalf must sign a DPA. This includes AWS, Google Analytics, Stripe, and similar services.", ref:"GDPR Art. 28" });
    if (s.has("data_transfer")) reqs.push({ p:"high", t:"International Transfer Mechanisms", d:"Transfers to non-EU countries require Standard Contractual Clauses (SCCs) or a valid adequacy decision.", ref:"GDPR Art. 44–49" });
    if (s.has("no_dpo")) reqs.push({ p:"medium", t:"DPO Requirement Assessment", d:"A Data Protection Officer is mandatory if you process sensitive data at scale or systematically monitor individuals.", ref:"GDPR Art. 37" });
    if (s.has("breach_plan")) reqs.push({ p:"high", t:"72-Hour Breach Notification Procedure", d:"You must notify your national DPA within 72 hours of discovering a personal data breach. Build this process before an incident occurs.", ref:"GDPR Art. 33–34" });
    if (s.has("ai_product")) reqs.push({ p:"medium", t:"Automated Decision-Making Safeguards", d:"Users must be able to request human review of significant AI-driven decisions. The logic must be explainable.", ref:"GDPR Art. 22" });
    reqs.push({ p:"low", t:"Cookie Consent & ePrivacy", d:"Non-essential cookies require explicit opt-in. Implement a compliant Consent Management Platform.", ref:"ePrivacy Directive + GDPR" });
    reqs.push({ p:"low", t:"User Rights Fulfilment Process", d:"Respond to access, erasure, portability, and rectification requests within 30 days. Document your process.", ref:"GDPR Art. 15–22" });
    out.push({ id:"gdpr", status: gdprIds.filter(id=>s.has(id)).length >= 3 ? "applies":"likely", reqs });
  }

  // ISO 27001
  const isoIds = ["b2b_supplier","cloud_saas","no_security_policy","third_party_sharing","breach_plan"];
  if (isoIds.some(id=>s.has(id)) || s.has("over_50")) {
    const reqs = [];
    if (s.has("no_security_policy")) {
      reqs.push({ p:"high", t:"Information Security Policy", d:"A top-level document committing management to information security. This is the starting point for any ISO 27001 implementation.", ref:"Clause 5.2" });
      reqs.push({ p:"high", t:"Risk Assessment & Treatment Plan", d:"Identify assets, threats, and vulnerabilities. Score each risk and select Annex A controls to treat them. Document everything.", ref:"Clause 6.1" });
      reqs.push({ p:"high", t:"Statement of Applicability (SoA)", d:"List all 93 Annex A controls, whether each applies, and your justification for exclusions. Auditors examine this closely.", ref:"Clause 6.1.3" });
    }
    if (s.has("b2b_supplier")) reqs.push({ p:"high", t:"Certification Roadmap", d:"Enterprise and government clients will contractually require ISO 27001 certification. Plan for 6–12 months implementation and €10–30k in audit costs.", ref:"Full standard" });
    reqs.push({ p:"medium", t:"Access Control & Identity Management", d:"Define least-privilege access to all systems and data. Review access rights quarterly and remove stale permissions.", ref:"Annex A 5.15–5.18" });
    reqs.push({ p:"medium", t:"Asset Inventory", d:"Catalogue all information assets — data, systems, software, hardware — and assign a named owner to each.", ref:"Annex A 5.9" });
    reqs.push({ p:"medium", t:"Supplier Security Controls", d:"Assess and contractually bind your vendors to security requirements. Third-party risk is consistently among the top audit findings.", ref:"Annex A 5.19–5.22" });
    reqs.push({ p:"low", t:"Internal Audit Programme", d:"Conduct at least one internal audit annually. Identifying gaps internally is far less costly than external audit findings.", ref:"Clause 9.2" });
    reqs.push({ p:"low", t:"Security Awareness Training", d:"All staff must complete regular security training. Document attendance — auditors will request this evidence.", ref:"Annex A 6.3" });
    out.push({ id:"iso", status: s.has("b2b_supplier") ? "applies":"likely", reqs });
  }

  // NIS2
  const nisIds = ["cloud_saas","critical_infra","over_50","over_250","fintech","eu_users"];
  if (nisIds.filter(id=>s.has(id)).length >= 2) {
    const reqs = [];
    reqs.push({ p:"high", t:"Scope Classification", d:"Determine if you qualify as 'essential' (250+ staff or €50M+) or 'important' (50+ staff or €10M+) in a covered sector.", ref:"NIS2 Art. 3" });
    reqs.push({ p:"high", t:"Cybersecurity Risk Management Measures", d:"Implement network security, access controls, encryption, vulnerability management, and business continuity measures.", ref:"NIS2 Art. 21" });
    reqs.push({ p:"high", t:"Incident Reporting to BSI", d:"Early warning to BSI within 24 hours of a significant incident. Full report required within 72 hours.", ref:"NIS2 Art. 23" });
    if (s.has("over_250")) reqs.push({ p:"high", t:"Management Liability & Governance", d:"Senior management bears personal liability for cybersecurity governance failures. Board-level security ownership is now a legal obligation.", ref:"NIS2 Art. 20" });
    reqs.push({ p:"medium", t:"Supply Chain Security", d:"You are responsible for assessing and managing cybersecurity risks in your supply chain.", ref:"NIS2 Art. 21(2)(d)" });
    reqs.push({ p:"medium", t:"Business Continuity & Disaster Recovery", d:"Maintain documented backup and recovery procedures and test them regularly.", ref:"NIS2 Art. 21(2)(c)" });
    out.push({ id:"nis2", status: (s.has("over_250")||s.has("critical_infra")) ? "applies":"likely", reqs });
  }

  // DORA
  if (s.has("fintech")) {
    out.push({ id:"dora", status:"applies", reqs:[
      { p:"high", t:"ICT Risk Management Framework", d:"A complete, documented ICT risk governance framework. DORA is statutory — there is no opt-out for in-scope financial entities.", ref:"DORA Art. 5–16" },
      { p:"high", t:"Major Incident Classification & Reporting", d:"Classify ICT incidents using DORA's mandatory criteria and report to BaFin (Germany) within required timeframes.", ref:"DORA Art. 17–23" },
      { p:"high", t:"Third-Party ICT Provider Register", d:"Maintain a register of all ICT providers. All contracts must include DORA-mandated provisions.", ref:"DORA Art. 28–30" },
      { p:"medium", t:"Digital Operational Resilience Testing (TLPT)", d:"Essential entities must conduct Threat-Led Penetration Testing every three years. Budget accordingly.", ref:"DORA Art. 24–27" },
      { p:"medium", t:"ICT Concentration Risk", d:"Assess and document over-reliance on individual providers. Regulators are focused on systemic concentration risk.", ref:"DORA Art. 29" },
    ]});
  }

  // KRITIS
  if (s.has("critical_infra") || s.has("over_250")) {
    out.push({ id:"kritis", status: s.has("critical_infra") ? "applies":"review", reqs:[
      { p:"high", t:"BSI Registration", d:"Critical infrastructure operators in Germany must register with BSI. Thresholds vary by sector.", ref:"BSIG §8c" },
      { p:"high", t:"ISMS Implementation (Grundschutz or ISO 27001)", d:"KRITIS operators must implement a recognised ISMS. BSI IT-Grundschutz is the German-specific standard; ISO 27001 is internationally recognised.", ref:"BSIG §8a" },
      { p:"medium", t:"Biennial Compliance Proof", d:"Submit documented proof of security compliance to BSI every two years, via audit or certification.", ref:"BSIG §8a(3)" },
      { p:"medium", t:"Critical Incident Reporting to BSI", d:"Significant disruptions to critical services must be reported to BSI promptly.", ref:"BSIG §8b" },
    ]});
  }

  return out;
}

export default function App() {
  const [selected, setSelected] = useState(new Set());
  const [report, setReport] = useState(null);
  const [ran, setRan] = useState(false);

  const toggle = id => {
    const n = new Set(selected);
    n.has(id) ? n.delete(id) : n.add(id);
    setSelected(n);
    setRan(false);
  };

  const scan = () => {
    if (!selected.size) return;
    setReport(buildReport(selected));
    setRan(true);
    setTimeout(() => document.getElementById("report")?.scrollIntoView({ behavior:"smooth" }), 80);
  };

  const reset = () => { setSelected(new Set()); setReport(null); setRan(false); };

  const totalHigh = report?.reduce((a,fw)=>a+fw.reqs.filter(r=>r.p==="high").length,0)||0;
  const totalMed  = report?.reduce((a,fw)=>a+fw.reqs.filter(r=>r.p==="medium").length,0)||0;
  const totalLow  = report?.reduce((a,fw)=>a+fw.reqs.filter(r=>r.p==="low").length,0)||0;

  const C = {
    bg: "#0d1117",
    surface: "#161b22",
    surfaceHover: "#1c2330",
    border: "#21262d",
    borderStrong: "#30363d",
    text: "#e6edf3",
    textSub: "#8b949e",
    textMuted: "#484f58",
    accent: "#58a6ff",
  };

  return (
    <div style={{ background: C.bg, minHeight:"100vh", color: C.text, fontFamily:"'Georgia', 'Times New Roman', serif" }}>

      {/* Subtle top accent bar */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #1f6feb, #58a6ff, #1f6feb)" }} />

      <div style={{ maxWidth: 860, margin:"0 auto", padding:"0 28px" }}>

        {/* ── HEADER ── */}
        <div style={{ padding:"52px 0 40px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <div style={{ width:2, height:28, background:"#58a6ff", borderRadius:2 }} />
            <span style={{ fontFamily:"'Courier New', monospace", fontSize:12, color:"#58a6ff", letterSpacing:2, textTransform:"uppercase" }}>EU Compliance Radar · 2025</span>
          </div>

          <h1 style={{ fontFamily:"'Georgia', serif", fontSize:40, fontWeight:700, lineHeight:1.15, letterSpacing:-0.5, margin:0 }}>
            Startup Compliance<br />
            <span style={{ color:"#58a6ff" }}>Readiness Checker</span>
          </h1>

          <p style={{ marginTop:16, fontSize:16, color: C.textSub, lineHeight:1.75, maxWidth:580, fontFamily:"'Georgia', serif" }}>
            Identify which EU regulations apply to your tech company — GDPR, ISO 27001, NIS2, DORA, and KRITIS. Answer a few questions and receive a tailored compliance action list.
          </p>

          <div style={{ marginTop:24, display:"flex", gap:8, flexWrap:"wrap" }}>
            {["No account required","No data stored","Fully client-side","Updated for 2025"].map(c=>(
              <span key={c} style={{ fontFamily:"'Courier New', monospace", fontSize:11, padding:"4px 10px", border:`1px solid ${C.borderStrong}`, color: C.textSub, borderRadius:2 }}>✓ {c}</span>
            ))}
          </div>
        </div>

        {/* ── QUESTIONS ── */}
        {QUESTIONS.map((grp,gi) => (
          <div key={gi} style={{ padding:"40px 0", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", alignItems:"baseline", gap:14, marginBottom:6 }}>
              <span style={{ fontFamily:"'Courier New', monospace", fontSize:11, color: C.textMuted, letterSpacing:2 }}>{grp.module.toUpperCase()}</span>
              <h2 style={{ fontFamily:"'Georgia', serif", fontSize:20, fontWeight:700, margin:0 }}>{grp.title}</h2>
            </div>
            <p style={{ fontSize:14, color: C.textSub, marginBottom:24, lineHeight:1.6 }}>{grp.desc}</p>

            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {grp.items.map(q => {
                const on = selected.has(q.id);
                return (
                  <div key={q.id} onClick={()=>toggle(q.id)} style={{
                    background: on ? "#111d2e" : C.surface,
                    border: `1px solid ${on ? "#1f6feb" : C.border}`,
                    borderLeft: `3px solid ${on ? "#58a6ff" : C.border}`,
                    padding:"16px 18px",
                    cursor:"pointer",
                    transition:"all 0.15s ease",
                    borderRadius:2,
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:15, fontWeight:600, color: on ? C.text : C.text, fontFamily:"'Georgia', serif", marginBottom:3 }}>{q.text}</div>
                        <div style={{ fontSize:13, color: C.textSub, lineHeight:1.5 }}>{q.sub}</div>
                        <div style={{ marginTop:10, display:"flex", gap:6, flexWrap:"wrap" }}>
                          {q.tags.map(t=>(
                            <span key={t} style={{ fontFamily:"'Courier New', monospace", fontSize:10, padding:"2px 7px", background: TAG_META[t].bg, color: TAG_META[t].color, borderRadius:2, letterSpacing:0.5 }}>{t}</span>
                          ))}
                        </div>
                      </div>
                      {/* Clean checkbox */}
                      <div style={{
                        width:20, height:20, border:`2px solid ${on ? "#58a6ff" : C.borderStrong}`,
                        background: on ? "#58a6ff" : "transparent",
                        borderRadius:3, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                        transition:"all 0.15s", marginTop:2,
                      }}>
                        {on && <span style={{ color:"#0d1117", fontSize:13, fontWeight:900, lineHeight:1 }}>✓</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* ── ACTION BAR ── */}
        <div style={{ padding:"32px 0", display:"flex", alignItems:"center", gap:14, flexWrap:"wrap", borderBottom:`1px solid ${C.border}` }}>
          <button onClick={scan} style={{
            fontFamily:"'Courier New', monospace", fontSize:13, letterSpacing:1,
            padding:"12px 28px", background: selected.size ? "#1f6feb" : C.surface,
            border:`1px solid ${selected.size ? "#58a6ff" : C.border}`,
            color: selected.size ? "#ffffff" : C.textMuted,
            cursor: selected.size ? "pointer":"not-allowed",
            borderRadius:2, transition:"all 0.15s", fontWeight:600,
          }}>Run Compliance Scan</button>

          {ran && <button onClick={reset} style={{ fontFamily:"'Courier New', monospace", fontSize:12, letterSpacing:1, padding:"10px 20px", background:"transparent", border:`1px solid ${C.border}`, color: C.textSub, cursor:"pointer", borderRadius:2 }}>Reset</button>}

          <span style={{ fontFamily:"'Courier New', monospace", fontSize:12, color: C.textMuted }}>
            {selected.size} / 15 selected
          </span>
        </div>

        {/* ── REPORT ── */}
        {ran && report && (
          <div id="report" style={{ padding:"48px 0 64px" }}>

            <div style={{ marginBottom:32 }}>
              <span style={{ fontFamily:"'Courier New', monospace", fontSize:11, color: C.textMuted, letterSpacing:2 }}>SCAN COMPLETE · {new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}).toUpperCase()}</span>
              <h2 style={{ fontFamily:"'Georgia', serif", fontSize:26, fontWeight:700, marginTop:8, marginBottom:4 }}>Compliance Exposure Report</h2>
              <p style={{ fontSize:14, color: C.textSub }}>Based on your inputs. This is a starting point — consult a legal professional for your specific situation.</p>
            </div>

            {/* Summary row */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:36 }}>
              {[
                { n: report.length, label:"Frameworks triggered", color:"#f87171" },
                { n: totalHigh,     label:"High priority actions", color:"#f87171" },
                { n: totalMed,      label:"Medium priority",       color:"#fbbf24" },
                { n: totalLow,      label:"Informational",         color:"#58a6ff" },
              ].map((s,i)=>(
                <div key={i} style={{ background: C.surface, border:`1px solid ${C.border}`, borderTop:`2px solid ${s.color}`, padding:"18px 16px", borderRadius:2 }}>
                  <div style={{ fontFamily:"'Georgia', serif", fontSize:32, fontWeight:700, color: s.color }}>{s.n}</div>
                  <div style={{ fontFamily:"'Courier New', monospace", fontSize:11, color: C.textMuted, marginTop:4, letterSpacing:0.5 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Priority legend */}
            <div style={{ display:"flex", gap:20, padding:"12px 16px", background: C.surface, border:`1px solid ${C.border}`, borderRadius:2, marginBottom:28, flexWrap:"wrap" }}>
              {[["high","#f87171","High priority"],["medium","#fbbf24","Medium priority"],["low","#58a6ff","Informational"]].map(([,c,l])=>(
                <div key={l} style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:c }} />
                  <span style={{ fontFamily:"'Courier New', monospace", fontSize:11, color: C.textSub }}>{l}</span>
                </div>
              ))}
            </div>

            {/* Framework blocks */}
            {report.map(fw => {
              const meta = FW_META[fw.id];
              const st = STATUS_META[fw.status];
              return (
                <div key={fw.id} style={{ marginBottom:20, border:`1px solid ${C.border}`, borderRadius:2, overflow:"hidden" }}>
                  {/* Header */}
                  <div style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 20px", background: C.surface, borderBottom:`1px solid ${C.border}` }}>
                    <div style={{ width:4, height:40, background: meta.color, borderRadius:2, flexShrink:0 }} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"'Georgia', serif", fontSize:17, fontWeight:700, color: meta.color }}>{meta.label}</div>
                      <div style={{ fontFamily:"'Courier New', monospace", fontSize:11, color: C.textMuted, marginTop:2 }}>{meta.full}</div>
                    </div>
                    <div style={{ fontFamily:"'Courier New', monospace", fontSize:10, padding:"4px 10px", background: st.bg, color: st.color, borderRadius:2, letterSpacing:1 }}>{st.label}</div>
                  </div>

                  {/* Requirements */}
                  {fw.reqs.map((req,i)=>(
                    <div key={i} style={{ display:"flex", gap:14, padding:"16px 20px", borderBottom: i<fw.reqs.length-1?`1px solid ${C.border}`:"none", background: i%2===0 ? C.bg : C.surface }}>
                      <div style={{ paddingTop:5, flexShrink:0 }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background: PRIORITY_COLOR[req.p] }} />
                      </div>
                      <div>
                        <div style={{ fontFamily:"'Georgia', serif", fontSize:14, fontWeight:600, color: C.text, marginBottom:4 }}>{req.t}</div>
                        <div style={{ fontSize:13, color: C.textSub, lineHeight:1.65 }}>{req.d}</div>
                        <div style={{ fontFamily:"'Courier New', monospace", fontSize:11, color: C.textMuted, marginTop:6 }}>{req.ref}</div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}

            {/* Disclaimer */}
            <div style={{ marginTop:32, padding:"16px 20px", background: C.surface, border:`1px solid ${C.border}`, borderRadius:2 }}>
              <p style={{ fontFamily:"'Courier New', monospace", fontSize:12, color: C.textMuted, lineHeight:1.7 }}>
                <strong style={{ color: C.textSub }}>Disclaimer:</strong> This tool is for awareness and educational purposes only. It does not constitute legal advice. Regulatory applicability depends on your specific circumstances. Consult a qualified legal or compliance professional before making decisions.
              </p>
            </div>
          </div>
        )}

        {/* FOOTER */}
        {!ran && (
          <div style={{ padding:"36px 0", borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:20 }}>
            <div>
              <div style={{ fontFamily:"'Courier New', monospace", fontSize:12, color: C.textMuted, marginBottom:12 }}>Official Sources</div>
              <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
                {[["GDPR Full Text","https://gdpr-info.eu"],["BSI","https://bsi.bund.de"],["NIS2 Directive","https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022L2555"],["DORA","https://www.eiopa.europa.eu/dora_en"]].map(([l,h])=>(
                  <a key={l} href={h} target="_blank" rel="noreferrer" style={{ fontFamily:"'Courier New', monospace", fontSize:12, color:"#58a6ff", textDecoration:"none" }}>{l} →</a>
                ))}
              </div>
            </div>
            <div style={{ fontFamily:"'Courier New', monospace", fontSize:11, color: C.textMuted, lineHeight:1.7, maxWidth:360 }}>
              Open source · No data collected · For educational purposes only · Built as a GRC portfolio project
            </div>
          </div>
        )}

      </div>
    </div>
  );
}