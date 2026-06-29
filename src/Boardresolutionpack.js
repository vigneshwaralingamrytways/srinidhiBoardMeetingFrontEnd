import { useState } from "react";
import { FaCheck, FaEdit, FaEye, FaTrash, FaTimes, FaTable, FaTh, FaChevronLeft, FaChevronRight, FaFile } from "react-icons/fa";

// -- Static Data --------------------------------------------------------------

const AGENDA_ITEMS = [
  { id: 1, title: "Opening & Roll Call" },
  { id: 2, title: "Q3 Financial Review" },
  { id: 3, title: "Product Roadmap 2025" },
  { id: 4, title: "Vendor Contract Decision" },
  { id: 5, title: "Board Resolution Drafting" },
  { id: 6, title: "Risk Register Update" },
  { id: 7, title: "Compliance Calendar" },
  { id: 8, title: "Closing Actions" },
];

const INITIAL_RESOLUTIONS = [
  { id: 1, title: "Approve the Meeting Agenda", agendaId: 1, description: "<p>The board is requested to formally <strong>approve the circulated meeting agenda</strong> as the order of business for this session.</p><ul><li>Agenda was circulated 5 days prior to the meeting</li><li>No objections were received before the meeting</li></ul>" },
  { id: 2, title: "Confirm Quorum and Attendance", agendaId: 1, description: "<p>Confirm that a <strong>valid quorum is present</strong> as required under the Articles of Association. The attendance register has been verified.</p><ul><li>Minimum quorum required: 3 members</li><li>Present: 5 members (4 voting, 1 observer)</li></ul>" },
  { id: 3, title: "Approve Q3 Financial Report 2024", agendaId: 2, description: "<p>The board resolves to <strong>formally approve the Q3 Financial Report 2024</strong> as presented by the CFO, subject to audit committee sign-off.</p><ul><li>Revenue: ?42.3 Cr vs target ?40 Cr</li><li>EBITDA margin: 18.4%</li><li>Cash position: ?9.1 Cr</li></ul><blockquote>Finance team has confirmed all figures are audited and reconciled as of 30 September 2024.</blockquote>" },
  { id: 4, title: "Approve Q3 Budget Extension", agendaId: 2, description: "<p>Approve an <strong>extension of ?3.2 Cr</strong> to the Q3 operational budget to cover unplanned infrastructure and compliance costs.</p><blockquote>Extension is within the 8% variance threshold approved at the start of the fiscal year.</blockquote><ul><li>Infrastructure: ?1.8 Cr</li><li>Compliance: ?1.4 Cr</li></ul>" },
  { id: 5, title: "Authorize Finance Team for Audit Responses", agendaId: 2, description: "<p>The finance team is <strong>authorized to prepare and submit</strong> formal responses to all observations raised in the Q3 audit report without requiring further board approval for individual line items.</p>" },
  { id: 6, title: "Adopt 2025 Product Roadmap", agendaId: 3, description: "<p>The board resolves to <strong>formally adopt the 2025 Product Roadmap</strong> covering Q1Q4 delivery milestones across all product verticals.</p><ul><li>4 major platform releases planned</li><li>2 new modules: AI Analytics and Client Portal v2</li><li>Mobile-first redesign scheduled for Q3</li></ul>" },
  { id: 7, title: "Approve Roadmap Funding Envelope", agendaId: 3, description: "<p>Approve a total <strong>funding envelope of ?18.5 Cr</strong> for product development in FY2025, inclusive of engineering headcount, infrastructure, and tooling.</p>" },
  { id: 8, title: "Authorize Vendor Contract", agendaId: 4, description: "<p>The board resolves to <strong>authorize the execution of the vendor contract</strong> with the selected vendor, subject to satisfactory completion of legal review.</p><ul><li>Contract value: ?4.8 Cr over 3 years</li><li>SLA: 99.9% uptime with penalty clauses</li></ul>" },
  { id: 9, title: "Approve Data Processing Addendum", agendaId: 4, description: "<p>Approve the <strong>Data Processing Addendum (DPA)</strong> subject to final review by the legal team to ensure DPDPA 2023 compliance before contract execution.</p>" },
  { id: 10, title: "Accept Updated Risk Register", agendaId: 6, description: "<p>The board resolves to <strong>accept the updated risk register for Q4 2024</strong>, acknowledging all changes to risk ratings, mitigation status, and ownership assignments.</p><ul><li>3 risks upgraded to High severity</li><li>2 risks formally closed</li><li>1 new risk added: Vendor dependency</li></ul>" },
  { id: 11, title: "Approve Compliance Calendar Updates", agendaId: 7, description: "<p>Formally approve the <strong>updated compliance calendar for Q4 2024 and H1 2025</strong>, including all statutory filing deadlines, license renewal dates, and policy review windows.</p>" },
  { id: 12, title: "Approve Meeting Agenda (General)", agendaId: null, description: "<p>General resolution to <strong>approve and adopt the full order of business</strong> circulated for this meeting as the formal agenda.</p>" },
  { id: 13, title: "Approve Previous Meeting Minutes", agendaId: null, description: "<p>General resolution to <strong>approve and adopt the minutes</strong> of the previous board meeting (Q3 Board Review, Oct 20 2024) as a true and accurate record.</p>" },
  { id: 14, title: "Authorize Digital Signing of Resolutions", agendaId: null, description: "<p>Authorize the use of the <strong>approved e-signing platform</strong> for digital signature of all board resolutions, confirming such signatures are legally valid and binding under applicable law.</p>" },
];

const BOARD_PACK = [
  {
    id: 1, title: "Q3 Financial Report 2024", type: "PDF", pages: 24, size: "2.4 MB", agendaId: 2,
    slides: [
      { title: "Executive Summary", content: "<p>Q3 2024 closed with revenue of <strong>?42.3 Cr</strong> against a target of ?40 Cr, marking a 5.75% outperformance. EBITDA margin held at 18.4%.</p><ul><li>Cash reserves: ?9.1 Cr</li><li>Operating costs within approved envelope</li><li>Three audit observations raised  responses in progress</li></ul>" },
      { title: "Revenue Performance", content: "<p>Product revenue grew <strong>12% YoY</strong> driven by expansion of enterprise accounts. Services revenue remained flat.</p><ul><li>Enterprise: ?28.4 Cr (+18% YoY)</li><li>SMB: ?9.3 Cr (+4% YoY)</li><li>Services: ?4.6 Cr (flat)</li></ul>" },
      { title: "Budget Variance Analysis", content: "<p>Operational expenditure exceeded budget by <strong>?3.2 Cr</strong> primarily due to unplanned infrastructure upgrades and compliance advisory costs.</p><blockquote>Extension request is within the 8% variance threshold pre-approved by the board for the fiscal year.</blockquote>" },
      { title: "Audit Observations", content: "<p>The Q3 statutory audit raised <strong>three observations</strong>:</p><ul><li>Reconciliation gap in intercompany transfers  remediation in progress</li><li>Delayed filing of two vendor invoices  process fix applied</li><li>Depreciation schedule requires realignment  CFO action by Nov 30</li></ul>" },
    ],
  },
  {
    id: 2, title: "Product Roadmap Appendix", type: "PDF", pages: 18, size: "1.8 MB", agendaId: 3,
    slides: [
      { title: "2025 Roadmap Overview", content: "<p>The 2025 product roadmap covers <strong>four major release cycles</strong> across Q1Q4, with two new modules and a mobile-first platform redesign.</p><ul><li>Q1: Platform stability and technical debt resolution</li><li>Q2: AI Analytics module launch</li><li>Q3: Mobile-first redesign go-live</li><li>Q4: Client Portal v2</li></ul>" },
      { title: "Funding Envelope", content: "<p>Total approved envelope: <strong>?18.5 Cr</strong> covering engineering headcount (?11 Cr), infrastructure (?4.5 Cr), and tooling and licensing (?3 Cr).</p>" },
      { title: "Hiring Plan", content: "<p>Roadmap delivery requires <strong>12 additional engineers</strong> and 3 product managers to be onboarded by end of Q1 2025.</p><ul><li>6 backend engineers  Q1 start</li><li>4 frontend engineers  Q1 start</li><li>2 DevOps  Q2 start</li><li>3 product managers  rolling Q1Q2</li></ul>" },
    ],
  },
  {
    id: 3, title: "Vendor Comparison Matrix", type: "XLS", pages: 8, size: "0.9 MB", agendaId: 4,
    slides: [
      { title: "Shortlisted Vendors Overview", content: "<p>Three vendors were evaluated across <strong>14 criteria</strong> including pricing, SLA commitments, implementation timeline, and DPDPA compliance readiness.</p>" },
      { title: "Commercial Summary", content: "<p>Selected vendor offers the strongest commercial terms at <strong>?4.8 Cr over 36 months</strong> with a 99.9% uptime SLA backed by a penalty clause structure.</p><ul><li>Year 1: ?1.8 Cr (includes onboarding)</li><li>Year 2: ?1.5 Cr</li><li>Year 3: ?1.5 Cr</li></ul>" },
      { title: "Legal and Compliance Status", content: "<p>DPA review is <strong>in progress</strong>. Legal counsel has identified two clauses requiring renegotiation before the board can authorize execution.</p>" },
    ],
  },
  {
    id: 4, title: "Risk Register  Q4 2024", type: "XLS", pages: 6, size: "0.7 MB", agendaId: 6,
    slides: [
      { title: "Risk Summary", content: "<p>The Q4 2024 risk register contains <strong>18 active risks</strong>, of which 3 have been upgraded to High severity since the last review.</p>" },
      { title: "High-Severity Risks", content: "<ul><li><strong>Vendor dependency risk</strong>  single-source critical supplier, escalated to Risk Committee</li><li><strong>Data breach exposure</strong>  legacy API endpoints identified, patching in progress</li><li><strong>Regulatory deadline risk</strong>  DPDPA filing due Dec 31, resources allocated</li></ul>" },
      { title: "Mitigations and Owners", content: "<p>Each high-severity risk has a named <strong>risk owner and mitigation plan</strong> with monthly review cadence tracked via the Risk Committee.</p>" },
    ],
  },
  {
    id: 5, title: "Compliance Calendar  Q4 2024 & H1 2025", type: "PDF", pages: 5, size: "0.5 MB", agendaId: 7,
    slides: [
      { title: "Key Deadlines  Q4 2024", content: "<ul><li><strong>Oct 31</strong>  GST monthly filing</li><li><strong>Nov 15</strong>  TDS payment due</li><li><strong>Dec 31</strong>  DPDPA compliance report to regulator</li><li><strong>Dec 31</strong>  Annual return filing</li></ul>" },
      { title: "Key Deadlines  H1 2025", content: "<ul><li><strong>Jan 15</strong>  Advance tax payment Q3</li><li><strong>Mar 31</strong>  FY end compliance review</li><li><strong>Apr 30</strong>  Annual audit submission</li><li><strong>Jun 30</strong>  Board charter renewal</li></ul>" },
    ],
  },
  {
    id: 6, title: "Board Meeting Agenda Pack", type: "PDF", pages: 10, size: "1.1 MB", agendaId: null,
    slides: [
      { title: "Full Agenda", content: "<ol style='padding-left:18px;line-height:2'><li>Opening and Roll Call  5 min</li><li>Q3 Financial Review  20 min</li><li>Product Roadmap 2025  30 min</li><li>Vendor Contract Decision  15 min</li><li>Board Resolution Drafting  15 min</li><li>Risk Register Update  20 min</li><li>Compliance Calendar  10 min</li><li>Closing Actions  10 min</li></ol>" },
    ],
  },
  {
    id: 7, title: "Previous Meeting Minutes (Q3)", type: "PDF", pages: 6, size: "0.6 MB", agendaId: null,
    slides: [
      { title: "Q3 Board Review  Key Outcomes", content: "<p>Minutes from the <strong>Q3 Board Review held October 20, 2024</strong>.</p><ul><li>Q3 financial performance reviewed and approved</li><li>Budget extension for voting approved</li><li>Finance team authorized to submit audit responses</li><li>Vendor shortlisting initiated</li></ul>" },
    ],
  },
];

// -- Helpers -------------------------------------------------------------------

const getAgendaTitle = (id) => AGENDA_ITEMS.find((a) => a.id === id)?.title || null;

const s = {
  wrap: { background: "#06081a", borderRadius: 12, padding: 14, fontFamily: "system-ui,sans-serif", color: "#fff", minHeight: 520, display: "flex", flexDirection: "column", gap: 10 },
  tabRow: { display: "flex", gap: 6, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 8 },
  tab: (active) => ({ padding: "6px 16px", borderRadius: "8px 8px 0 0", border: active ? "1px solid rgba(212,168,83,0.35)" : "1px solid transparent", borderBottom: active ? "1px solid #06081a" : "transparent", background: active ? "rgba(212,168,83,0.12)" : "transparent", color: active ? "#D4A853" : "rgba(255,255,255,0.4)", cursor: "pointer", fontWeight: 600, fontSize: 12 }),
  content: { display: "flex", gap: 12, flex: 1, minHeight: 0 },
  left: { width: 230, flexShrink: 0, display: "flex", flexDirection: "column", gap: 6, overflowY: "auto", maxHeight: 460, scrollbarWidth: "thin" },
  right: { flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 16, overflowY: "auto", maxHeight: 460, scrollbarWidth: "thin" },
  secLabel: { fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)", padding: "6px 8px 3px" },
  item: (active) => ({ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 10px", borderRadius: 8, cursor: "pointer", border: `1px solid ${active ? "rgba(212,168,83,0.35)" : "transparent"}`, background: active ? "rgba(212,168,83,0.1)" : "transparent", transition: "all 0.15s" }),
  num: (active) => ({ width: 20, height: 20, borderRadius: "50%", background: active ? "#D4A853" : "rgba(255,255,255,0.08)", color: active ? "#06081a" : "rgba(255,255,255,0.45)", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }),
  itemTitle: { fontSize: 11, fontWeight: 600, lineHeight: 1.35, color: "#fff" },
  itemMeta: { fontSize: 10, color: "rgba(255,255,255,0.38)", marginTop: 2 },
  tagAgenda: { display: "inline-block", fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "rgba(77,184,150,0.15)", color: "#4DB896", border: "1px solid rgba(77,184,150,0.3)", marginTop: 3 },
  tagCommon: { display: "inline-block", fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "rgba(74,158,212,0.15)", color: "#4A9ED4", border: "1px solid rgba(74,158,212,0.3)", marginTop: 3 },
  divider: { height: 1, background: "rgba(255,255,255,0.07)", margin: "4px 0" },
  filterRow: { display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" },
  filterBtn: (active) => ({ padding: "4px 11px", borderRadius: 20, border: `1px solid ${active ? "rgba(212,168,83,0.35)" : "rgba(255,255,255,0.12)"}`, background: active ? "rgba(212,168,83,0.12)" : "transparent", color: active ? "#D4A853" : "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 600, cursor: "pointer" }),
  detailTitle: { fontSize: 16, fontWeight: 700, lineHeight: 1.3, color: "#fff", marginBottom: 12 },
  detailBody: { fontSize: 13, lineHeight: 1.75, color: "rgba(255,255,255,0.72)" },
  agendaBadge: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "rgba(212,168,83,0.15)", color: "#D4A853", border: "1px solid rgba(212,168,83,0.35)", marginBottom: 8 },
  actionRow: { display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" },
  btnGold: { padding: "7px 14px", borderRadius: 7, border: "none", background: "#D4A853", color: "#06081a", fontWeight: 700, fontSize: 11, cursor: "pointer" },
  btnOutline: { padding: "7px 14px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.18)", background: "transparent", color: "rgba(255,255,255,0.7)", fontSize: 11, cursor: "pointer" },
  btnDanger: { padding: "7px 14px", borderRadius: 7, border: "1px solid rgba(220,80,80,0.3)", background: "rgba(220,80,80,0.12)", color: "#e07070", fontSize: 11, cursor: "pointer" },
  editField: { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "8px 10px", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none", resize: "vertical" },
  emptyState: { textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.28)", fontSize: 13 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 },
  projCard: { background: "#0e1230", border: "1px solid rgba(212,168,83,0.25)", borderRadius: 16, maxWidth: 680, width: "100%", padding: "40px 48px", position: "relative" },
  projSub: { fontSize: 11, color: "#D4A853", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 },
  projTitle: { fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 22 },
  projBody: { fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.78)" },
  projNav: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 28, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.08)" },
  projCounter: { fontSize: 12, color: "rgba(255,255,255,0.38)" },
  closeBtn: { position: "absolute", top: 14, right: 18, background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 22, cursor: "pointer", lineHeight: 1 },
  docOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 1000, display: "flex", flexDirection: "column" },
  docBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)", background: "#0e1230" },
  docBarTitle: { fontSize: 14, fontWeight: 600, color: "#fff" },
  docContent: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  docSlide: { padding: "40px 60px", maxWidth: 700, width: "100%" },
  docSlideNum: { fontSize: 11, color: "rgba(212,168,83,0.7)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 },
  docSlideTitle: { fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 18, lineHeight: 1.25 },
  docSlideBody: { fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.72)" },
  docNavRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 20, padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,0.08)", background: "#0e1230" },
  docNavBtn: { width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  vtToggle: { display: "flex", gap: 3, background: "rgba(255,255,255,0.06)", borderRadius: 7, padding: 3 },
  vtBtn: (active) => ({ padding: "5px 10px", borderRadius: 5, border: "none", background: active ? "rgba(212,168,83,0.18)" : "transparent", color: active ? "#D4A853" : "rgba(255,255,255,0.38)", fontSize: 11, cursor: "pointer" }),
  bpGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 10, marginTop: 12 },
  bpCard: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 10px", cursor: "pointer", transition: "all 0.15s" },
  fileTypeBadge: (type) => ({ display: "inline-block", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 5, background: type === "PDF" ? "rgba(220,80,80,0.15)" : "rgba(77,184,150,0.15)", color: type === "PDF" ? "#e07070" : "#4DB896" }),
  tbl: { width: "100%", borderCollapse: "collapse", fontSize: 12 },
  th: { padding: "8px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.3)", borderBottom: "1px solid rgba(255,255,255,0.08)" },
  td: { padding: "9px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.72)", verticalAlign: "middle" },
};

// -- Projector Overlay ---------------------------------------------------------

function ProjectorOverlay({ items, index, onNav, onClose }) {
  const item = items[index];
  if (!item) return null;
  const at = item.agendaId ? getAgendaTitle(item.agendaId) : "General Resolution";
  return (
    <div style={s.overlay}>
      <div style={s.projCard}>
        <button style={s.closeBtn} onClick={onClose}>×</button>
        <div style={s.projSub}>{at}</div>
        <div style={s.projTitle}>{item.title}</div>
        <div style={s.projBody} dangerouslySetInnerHTML={{ __html: item.description }} />
        <div style={s.projNav}>
          <button style={s.btnOutline} onClick={() => onNav(-1)}>? Prev</button>
          <span style={s.projCounter}>{index + 1} / {items.length}</span>
          <button style={s.btnOutline} onClick={() => onNav(1)}>Next ?</button>
        </div>
      </div>
    </div>
  );
}

// -- Doc Slide Overlay ---------------------------------------------------------

function DocSlideOverlay({ doc, slideIdx, onNav, onClose }) {
  if (!doc) return null;
  const slide = doc.slides[slideIdx];
  return (
    <div style={s.docOverlay}>
      <div style={s.docBar}>
        <div style={s.docBarTitle}>{doc.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.38)" }}>{slideIdx + 1} / {doc.slides.length}</span>
          <button style={{ ...s.btnOutline, fontSize: 12 }} onClick={onClose}>? Close</button>
        </div>
      </div>
      <div style={s.docContent}>
        <div style={s.docSlide}>
          <div style={s.docSlideNum}>Section {slideIdx + 1} of {doc.slides.length}</div>
          <div style={s.docSlideTitle}>{slide.title}</div>
          <div style={s.docSlideBody} dangerouslySetInnerHTML={{ __html: slide.content }} />
        </div>
      </div>
      <div style={s.docNavRow}>
        <button style={s.docNavBtn} onClick={() => onNav(-1)}></button>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.38)" }}>{slideIdx + 1} of {doc.slides.length}</span>
        <button style={s.docNavBtn} onClick={() => onNav(1)}></button>
      </div>
    </div>
  );
}

// -- Resolutions Panel ---------------------------------------------------------

function ResolutionsPanel({ initialAgendaId = null }) {
  const [resolutions, setResolutions] = useState(INITIAL_RESOLUTIONS);
  const [filter, setFilter] = useState(initialAgendaId ? "agenda" : "all");
  const [activeId, setActiveId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [projOpen, setProjOpen] = useState(false);
  const [projIdx, setProjIdx] = useState(0);

  const filtered = filter === "all" ? resolutions
    : filter === "agenda" ? resolutions.filter((r) => r.agendaId)
    : resolutions.filter((r) => !r.agendaId);

  const agendaRes = filtered.filter((r) => r.agendaId);
  const commonRes = filtered.filter((r) => !r.agendaId);
  const active = resolutions.find((r) => r.id === activeId) || null;

  const selectRes = (id) => { setActiveId(id); setEditMode(false); };
  const startEdit = () => {
    if (!active) return;
    setEditTitle(active.title);
    setEditBody(active.description.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
    setEditMode(true);
  };
  const saveEdit = () => {
    setResolutions((prev) => prev.map((r) => r.id === activeId ? { ...r, title: editTitle, description: `<p>${editBody.replace(/\n/g, "</p><p>")}</p>` } : r));
    setEditMode(false);
  };
  const deleteRes = (id) => { setResolutions((prev) => prev.filter((r) => r.id !== id)); setActiveId(null); };
  const openProj = () => {
    const idx = filtered.findIndex((r) => r.id === activeId);
    setProjIdx(idx >= 0 ? idx : 0);
    setProjOpen(true);
  };

  const renderListSection = (items, tag) => items.map((r) => {
    const at = getAgendaTitle(r.agendaId);
    return (
      <div key={r.id} style={s.item(activeId === r.id)} onClick={() => selectRes(r.id)}>
        <div style={s.num(activeId === r.id)}>{r.id}</div>
        <div>
          <div style={s.itemTitle}>{r.title}</div>
          {at && <div style={s.itemMeta}>{at}</div>}
          <span style={tag === "agenda" ? s.tagAgenda : s.tagCommon}>{tag === "agenda" ? "Agenda" : "General"}</span>
        </div>
      </div>
    );
  });

  return (
    <>
      {projOpen && (
        <ProjectorOverlay
          items={filtered}
          index={projIdx}
          onNav={(d) => setProjIdx((i) => (i + d + filtered.length) % filtered.length)}
          onClose={() => setProjOpen(false)}
        />
      )}

      <div style={s.filterRow}>
        {["all", "agenda", "common"].map((f) => (
          <button key={f} style={s.filterBtn(filter === f)} onClick={() => { setFilter(f); setActiveId(null); }}>
            {f === "all" ? "All" : f === "agenda" ? "Agenda-Linked" : "General"}
          </button>
        ))}
      </div>

      {/* Left list */}
      <div style={s.content}>
        <div style={s.left}>
          {agendaRes.length > 0 && filter !== "common" && (
            <>
              <div style={s.secLabel}>Agenda-Linked</div>
              {renderListSection(agendaRes, "agenda")}
            </>
          )}
          {agendaRes.length > 0 && commonRes.length > 0 && filter === "all" && <div style={s.divider} />}
          {commonRes.length > 0 && filter !== "agenda" && (
            <>
              <div style={s.secLabel}>General</div>
              {renderListSection(commonRes, "common")}
            </>
          )}
        </div>

        {/* Right detail */}
        <div style={s.right}>
          {!active ? (
            <div style={s.emptyState}>Select a resolution to view details</div>
          ) : editMode ? (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>Title</div>
              <input style={{ ...s.editField, height: 36, resize: "none", marginBottom: 12, display: "block" }} value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>Description</div>
              <textarea style={{ ...s.editField, minHeight: 160, marginBottom: 12 }} value={editBody} onChange={(e) => setEditBody(e.target.value)} />
              {active.agendaId && (
                <div style={{ marginBottom: 14 }}>
                  <span style={s.agendaBadge}>?? {getAgendaTitle(active.agendaId)}</span>
                </div>
              )}
              <div style={s.actionRow}>
                <button style={s.btnGold} onClick={saveEdit}>Save Changes</button>
                <button style={s.btnOutline} onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              {active.agendaId
                ? <div style={s.agendaBadge}>?? {getAgendaTitle(active.agendaId)}</div>
                : <span style={{ ...s.tagCommon, display: "inline-block", marginBottom: 10 }}>General Resolution</span>
              }
              <div style={s.detailTitle}>{active.title}</div>
              <div style={s.detailBody} dangerouslySetInnerHTML={{ __html: active.description }} />
              <div style={s.actionRow}>
                <button style={s.btnGold} onClick={openProj}>?? Projector View</button>
                <button style={s.btnOutline} onClick={startEdit}><FaEdit style={{ marginRight: 5 }} />Edit</button>
                <button style={s.btnDanger} onClick={() => deleteRes(active.id)}><FaTrash style={{ marginRight: 5 }} />Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// -- Board Pack Panel ----------------------------------------------------------

function BoardPackPanel({ initialAgendaId = null }) {
  const [filter, setFilter] = useState(initialAgendaId ? "agenda" : "all");
  const [activeId, setActiveId] = useState(initialAgendaId ? BOARD_PACK.find((d) => d.agendaId === initialAgendaId)?.id || null : null);
  const [view, setView] = useState("grid");
  const [docId, setDocId] = useState(null);
  const [slideIdx, setSlideIdx] = useState(0);

  const filtered = filter === "all" ? BOARD_PACK
    : filter === "agenda" ? BOARD_PACK.filter((d) => d.agendaId)
    : BOARD_PACK.filter((d) => !d.agendaId);

  const agendaDocs = filtered.filter((d) => d.agendaId);
  const commonDocs = filtered.filter((d) => !d.agendaId);
  const active = BOARD_PACK.find((d) => d.id === activeId) || null;
  const previewDoc = BOARD_PACK.find((d) => d.id === docId) || null;

  const openDoc = (id, slide = 0) => { setDocId(id); setSlideIdx(slide); };

  const renderListItem = (d) => {
    const at = getAgendaTitle(d.agendaId);
    return (
      <div key={d.id} style={s.item(activeId === d.id)} onClick={() => setActiveId(d.id)}>
        <div style={{ ...s.num(activeId === d.id), width: 28, height: 22, borderRadius: 5, fontSize: 8 }}>
          <span style={s.fileTypeBadge(d.type)}>{d.type}</span>
        </div>
        <div>
          <div style={s.itemTitle}>{d.title}</div>
          {at && <div style={s.itemMeta}>{at}</div>}
          <div style={s.itemMeta}>{d.pages} pp · {d.size}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      {previewDoc && (
        <DocSlideOverlay
          doc={previewDoc}
          slideIdx={slideIdx}
          onNav={(d) => setSlideIdx((i) => (i + d + previewDoc.slides.length) % previewDoc.slides.length)}
          onClose={() => setDocId(null)}
        />
      )}

      <div style={s.filterRow}>
        {["all", "agenda", "common"].map((f) => (
          <button key={f} style={s.filterBtn(filter === f)} onClick={() => { setFilter(f); setActiveId(null); }}>
            {f === "all" ? "All" : f === "agenda" ? "Agenda Docs" : "Common Docs"}
          </button>
        ))}
      </div>

      <div style={s.content}>
        {/* Left list */}
        <div style={s.left}>
          {agendaDocs.length > 0 && filter !== "common" && (
            <>
              <div style={s.secLabel}>Agenda-Linked</div>
              {agendaDocs.map(renderListItem)}
            </>
          )}
          {agendaDocs.length > 0 && commonDocs.length > 0 && filter === "all" && <div style={s.divider} />}
          {commonDocs.length > 0 && filter !== "agenda" && (
            <>
              <div style={s.secLabel}>Common Docs</div>
              {commonDocs.map(renderListItem)}
            </>
          )}
        </div>

        {/* Right detail */}
        <div style={s.right}>
          {!active ? (
            <div style={s.emptyState}>Select a document to view details</div>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12, gap: 8 }}>
                <div>
                  {active.agendaId
                    ? <div style={s.agendaBadge}>?? {getAgendaTitle(active.agendaId)}</div>
                    : <span style={{ ...s.tagCommon, display: "inline-block", marginBottom: 8 }}>Common Document</span>
                  }
                  <div style={s.detailTitle}>{active.title}</div>
                  <div style={{ display: "flex", gap: 14, fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 14 }}>
                    <span style={s.fileTypeBadge(active.type)}>{active.type}</span>
                    <span>{active.pages} pages</span>
                    <span>{active.size}</span>
                  </div>
                </div>
                <div style={s.vtToggle}>
                  <button style={s.vtBtn(view === "grid")} title="Grid view" onClick={() => setView("grid")}><FaTh /></button>
                  <button style={s.vtBtn(view === "table")} title="Table view" onClick={() => setView("table")}><FaTable /></button>
                </div>
              </div>

              <div style={s.actionRow}>
                <button style={s.btnGold} onClick={() => openDoc(active.id, 0)}>?? View as Slides</button>
              </div>

              <div style={{ marginTop: 18 }}>
                <div style={{ ...s.secLabel, padding: 0, marginBottom: 10 }}>Document Sections</div>

                {view === "grid" ? (
                  <div style={s.bpGrid}>
                    {active.slides.map((sl, i) => (
                      <div key={i} style={s.bpCard} onClick={() => openDoc(active.id, i)}>
                        <div style={{ fontSize: 22, marginBottom: 8 }}>??</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#fff", marginBottom: 4, lineHeight: 1.3 }}>{sl.title}</div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.38)" }}>Section {i + 1} · click to view</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <table style={s.tbl}>
                    <thead>
                      <tr>
                        <th style={s.th}>#</th>
                        <th style={s.th}>Section</th>
                        <th style={s.th}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {active.slides.map((sl, i) => (
                        <tr key={i}>
                          <td style={{ ...s.td, width: 32, color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{i + 1}</td>
                          <td style={s.td}>{sl.title}</td>
                          <td style={{ ...s.td, width: 80 }}>
                            <button style={{ ...s.btnOutline, fontSize: 10, padding: "4px 10px" }} onClick={() => openDoc(active.id, i)}>
                              <FaEye style={{ marginRight: 4 }} />View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// -- Root Component ------------------------------------------------------------

export default function ResolutionsBoardPack({ initialTab = "res", initialAgendaId = null }) {
  const [tab, setTab] = useState(initialTab);

  return (
    <div style={s.wrap}>
      <div style={s.tabRow}>
        <button style={s.tab(tab === "res")} onClick={() => setTab("res")}>Resolutions</button>
        <button style={s.tab(tab === "bp")} onClick={() => setTab("bp")}>Board Pack</button>
      </div>
      {tab === "res" && <ResolutionsPanel initialAgendaId={initialAgendaId} />}
      {tab === "bp" && <BoardPackPanel initialAgendaId={initialAgendaId} />}
    </div>
  );
}
