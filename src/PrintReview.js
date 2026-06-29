import { useState } from "react";
import { FaTimes, FaCheck, FaPrint, FaEye, FaFileAlt, FaStamp, FaDownload, FaChevronDown, FaChevronUp, FaUser } from "react-icons/fa";

/* -------------------------------------------------------------------
   SAMPLE DOCS  injected when no real docs are passed
------------------------------------------------------------------- */
const SAMPLE_DOCS = [
  {
    id: "sd-1",
    name: "Board Resolution  Q1 Budget Approval",
    category: "Resolution",
    pages: 3,
    date: "2025-05-15",
    content: `BOARD RESOLUTION

RESOLVED that the Board of Directors of the Company hereby approves the Q1 Budget for the fiscal year 20252026 as presented by the Chief Financial Officer.

FURTHER RESOLVED that the total capital expenditure of ?2,40,00,000 (Rupees Two Crore Forty Lakhs Only) is sanctioned for the following heads:

  1. Technology Infrastructure    ?80,00,000
  2. Human Resources Expansion    ?60,00,000
  3. Marketing & Brand            ?50,00,000
  4. Operations & Logistics       ?50,00,000

FURTHER RESOLVED that the CFO is authorised to draw and disburse funds as per the approved budget heads with monthly reporting to the Board.

This resolution is passed at the duly convened Board Meeting held on 15th May 2025 with the requisite quorum present.

Certified true copy.`,
  },
  {
    id: "sd-2",
    name: "Director Appointment  Vikram Nair",
    category: "Resolution",
    pages: 2,
    date: "2025-05-15",
    content: `BOARD RESOLUTION

RESOLVED that pursuant to Sections 152, 160 and all other applicable provisions of the Companies Act, 2013, the Board hereby appoints Mr. Vikram Nair (DIN: 09812345) as an Additional Director (Non-Executive Independent) of the Company with effect from 15th May 2025.

FURTHER RESOLVED that Mr. Vikram Nair shall hold office until the conclusion of the next Annual General Meeting.

FURTHER RESOLVED that the Company Secretary is authorised to file the necessary forms with the Registrar of Companies, MCA portal, and to do all other acts, deeds, and things as may be necessary to give effect to this resolution.

This resolution is passed at the duly convened Board Meeting held on 15th May 2025.

Certified true copy.`,
  },
  {
    id: "sd-3",
    name: "Auditor Ratification  FY 2025-26",
    category: "Compliance",
    pages: 2,
    date: "2025-05-15",
    content: `BOARD RESOLUTION

RESOLVED that the Board of Directors hereby ratifies the appointment of M/s. Sharma & Associates, Chartered Accountants (Firm Reg. No. 004567S) as Statutory Auditors of the Company for the financial year 20252026, on the remuneration as may be fixed by the Audit Committee.

FURTHER RESOLVED that the Statutory Auditors shall conduct the audit in accordance with the Standards on Auditing (SAs) issued by ICAI and shall report directly to the Audit Committee.

FURTHER RESOLVED that the Company Secretary be authorised to intimate the auditors of their appointment and to comply with all necessary filing requirements.

Certified true copy.`,
  },
  {
    id: "sd-4",
    name: "MOM  Board Meeting May 2025",
    category: "Minutes",
    pages: 5,
    date: "2025-05-15",
    content: `MINUTES OF THE BOARD MEETING

Date    : 15th May 2025
Time    : 10:00 AM  12:30 PM
Venue   : Boardroom, Registered Office

MEMBERS PRESENT:
   Ms. Priya Sharma          Chairperson
   Mr. Arjun Mehta           Managing Director
   Mr. Vikram Nair           Independent Director
   Ms. Anjali Krishnan       CFO

AGENDA DISCUSSED:

1. FINANCIAL PERFORMANCE REVIEW
   The CFO presented Q4 results. Revenue grew 18% YoY. EBITDA margins improved to 22%. Board noted strong collections and asked for deeper cost analysis in Q1.

2. Q1 BUDGET APPROVAL
   CFO presented the Q1 budget. After deliberation, the Board approved the budget with a total capex of ?2.40 Cr across four heads. Resolution passed unanimously.

3. DIRECTOR APPOINTMENT
   The Board considered the candidature of Mr. Vikram Nair. After due deliberation, appointed him as Additional Non-Executive Independent Director. Resolution passed unanimously.

4. STATUTORY AUDITOR RATIFICATION
   The Board ratified M/s. Sharma & Associates as Statutory Auditors for FY 2025-26. Resolution passed unanimously.

5. ANY OTHER BUSINESS
   The MD apprised the Board of the upcoming product launch planned for July 2025. Board noted and encouraged the management.

MEETING CLOSED at 12:30 PM.

Signed by the Chairperson and Company Secretary.`,
  },
];

const CATEGORY_COLORS = {
  Resolution: { bg: "rgba(100,160,255,0.10)", color: "#7ab4f5", dot: "#7ab4f5" },
  Compliance: { bg: "rgba(180,130,255,0.10)", color: "#c09af5", dot: "#c09af5" },
  Minutes:    { bg: "rgba(212,168,83,0.10)",  color: "#D4A853", dot: "#D4A853" },
  Default:    { bg: "rgba(255,255,255,0.06)", color: "#7a83b8", dot: "#596197" },
};

const catStyle = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS.Default;

const statusColor = (s) => {
  if (s === "signed")   return "#4ade80";
  if (s === "partial")  return "#D4A853";
  return "#596197";
};

/* -------------------------------------------------------------------
   DOCUMENT VIEWER MODAL
------------------------------------------------------------------- */
function DocViewer({ doc, participants, signed, onClose }) {
  const signaturesForDoc = participants.map((p) => ({
    ...p,
    isSigned: !!signed[`bp-${doc.id}-${p.id}`],
  }));

  const signedCount  = signaturesForDoc.filter((p) => p.isSigned).length;
  const totalCount   = participants.length;
  const allSigned    = signedCount === totalCount;
  const noneSigned   = signedCount === 0;
  const verdict      = allSigned ? "signed" : noneSigned ? "pending" : "partial";

  const handlePrintDoc = () => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>${doc.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@400;500&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'EB Garamond', Georgia, serif; color: #1a1a2e; background: #fff; padding: 0; }
            .page { max-width: 720px; margin: 0 auto; padding: 64px 72px; }
            .header { border-bottom: 2px solid #1a1a2e; padding-bottom: 20px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-end; }
            .company { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; }
            .doc-title { font-size: 20px; font-weight: 600; margin-top: 6px; color: #1a1a2e; }
            .meta { font-size: 11px; color: #888; margin-top: 4px; }
            .badge { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; border: 1px solid #1a1a2e; padding: 4px 12px; border-radius: 999px; }
            .content { font-size: 13.5px; line-height: 2; color: #2a2a3e; white-space: pre-wrap; margin-bottom: 48px; }
            .sig-section { border-top: 1.5px solid #ddd; padding-top: 28px; }
            .sig-title { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; margin-bottom: 20px; }
            .sig-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; }
            .sig-block { border-bottom: 1px solid #bbb; padding-bottom: 8px; }
            .sig-line { height: 36px; }
            .sig-name { font-size: 11px; color: #555; margin-top: 6px; }
            .sig-role { font-size: 10px; color: #aaa; }
            .sig-stamp { font-size: 10px; color: #888; margin-top: 4px; font-style: italic; }
            .footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 14px; display: flex; justify-content: space-between; font-size: 10px; color: #bbb; letter-spacing: 0.08em; }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">
              <div>
                <div class="company">Company Secretarial Office</div>
                <div class="doc-title">${doc.name}</div>
                <div class="meta">${doc.category} · ${doc.date} · ${doc.pages} page${doc.pages > 1 ? "s" : ""}</div>
              </div>
              <div class="badge">${verdict === "signed" ? "FULLY SIGNED" : verdict === "partial" ? "PARTIALLY SIGNED" : "PENDING"}</div>
            </div>
            <div class="content">${doc.content || ""}</div>
            <div class="sig-section">
              <div class="sig-title">Authorised Signatures</div>
              <div class="sig-grid">
                ${signaturesForDoc.map((p) => `
                  <div class="sig-block">
                    <div class="sig-line">${p.isSigned ? '<span style="font-size:22px;font-family:Georgia,serif;color:#1a1a2e;font-style:italic">' + p.name.split(" ")[0] + '</span>' : ""}</div>
                    <div class="sig-name">${p.name}</div>
                    <div class="sig-role">${p.role || ""}</div>
                    ${p.isSigned ? `<div class="sig-stamp">Signed · ${doc.date}</div>` : `<div class="sig-stamp">Pending signature</div>`}
                  </div>
                `).join("")}
              </div>
            </div>
            <div class="footer">
              <span>Ref: ${doc.id} · Confidential</span>
              <span>Printed on ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</span>
            </div>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(4,6,20,0.92)", backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#0d1024", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20, width: "100%", maxWidth: 780,
          maxHeight: "92vh", display: "flex", flexDirection: "column",
          overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
          flexShrink: 0,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{
                ...catStyle(doc.category),
                fontSize: 9, fontWeight: 800, letterSpacing: "0.18em",
                padding: "3px 10px", borderRadius: 999, border: `1px solid ${catStyle(doc.category).color}22`,
              }}>
                {doc.category.toUpperCase()}
              </span>
              <span style={{
                fontSize: 9, fontWeight: 800, letterSpacing: "0.12em",
                padding: "3px 10px", borderRadius: 999,
                background: verdict === "signed" ? "rgba(74,222,128,0.10)" : verdict === "partial" ? "rgba(212,168,83,0.10)" : "rgba(255,255,255,0.05)",
                color: statusColor(verdict),
              }}>
                {verdict === "signed" ? "FULLY SIGNED" : verdict === "partial" ? "PARTIALLY SIGNED" : "PENDING"}
              </span>
            </div>
            <h3 style={{ color: "#f4f0ff", fontSize: 17, fontWeight: 700, margin: 0, lineHeight: 1.4 }}>{doc.name}</h3>
            <div style={{ color: "#596197", fontSize: 11, marginTop: 4 }}>
              {doc.date} · {doc.pages} page{doc.pages > 1 ? "s" : ""} · {signedCount}/{totalCount} signatures
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button
              onClick={handlePrintDoc}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(212,168,83,0.12)", border: "1px solid rgba(212,168,83,0.25)",
                color: "#D4A853", borderRadius: 10, padding: "8px 14px",
                fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              <FaPrint style={{ fontSize: 11 }} /> Print
            </button>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                color: "#596197", borderRadius: 10, width: 36, height: 36,
                display: "grid", placeItems: "center", cursor: "pointer", fontSize: 13,
              }}
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Two-pane body */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* Document content pane */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "24px 28px",
            scrollbarWidth: "thin", scrollbarColor: "rgba(212,168,83,0.2) transparent",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}>
            {/* Paper simulation */}
            <div style={{
              background: "#f8f7f2", borderRadius: 12, padding: "40px 44px",
              color: "#1a1a2e", fontFamily: "'Georgia', serif",
              boxShadow: "0 4px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,0,0,0.06)",
            }}>
              <div style={{
                borderBottom: "2px solid #1a1a2e", paddingBottom: 16, marginBottom: 24,
                display: "flex", justifyContent: "space-between", alignItems: "flex-end",
              }}>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#888" }}>
                    Company Secretarial Office
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4, color: "#1a1a2e" }}>{doc.name}</div>
                  <div style={{ fontSize: 10, color: "#888", marginTop: 3 }}>
                    {doc.category} · {doc.date} · {doc.pages} page{doc.pages > 1 ? "s" : ""}
                  </div>
                </div>
                <div style={{
                  fontSize: 9, fontWeight: 800, letterSpacing: "0.12em",
                  border: "1px solid #1a1a2e", padding: "4px 12px", borderRadius: 999,
                  color: "#1a1a2e",
                }}>
                  {verdict === "signed" ? "FULLY SIGNED" : verdict === "partial" ? "PARTIALLY SIGNED" : "PENDING"}
                </div>
              </div>

              <pre style={{
                fontSize: 12.5, lineHeight: 2, color: "#2a2a3e",
                whiteSpace: "pre-wrap", fontFamily: "'Georgia', serif",
                margin: 0, marginBottom: 36,
              }}>
                {doc.content || "No content available for this document."}
              </pre>

              {/* Signature block inside paper */}
              <div style={{ borderTop: "1.5px solid #ddd", paddingTop: 24, marginTop: 8 }}>
                <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa", marginBottom: 20 }}>
                  Authorised Signatures
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
                  {signaturesForDoc.map((p) => (
                    <div key={p.id} style={{ borderBottom: "1px solid #bbb", paddingBottom: 8 }}>
                      <div style={{ height: 40, display: "flex", alignItems: "flex-end" }}>
                        {p.isSigned && (
                          <span style={{
                            fontFamily: "Georgia, serif", fontSize: 22,
                            fontStyle: "italic", color: "#1a1a2e", lineHeight: 1,
                          }}>
                            {p.name.split(" ")[0]}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: "#555", marginTop: 4 }}>{p.name}</div>
                      <div style={{ fontSize: 9, color: "#aaa" }}>{p.role}</div>
                      <div style={{ fontSize: 9, color: p.isSigned ? "#4a9a6a" : "#aaa", marginTop: 2, fontStyle: "italic" }}>
                        {p.isSigned ? `Signed · ${doc.date}` : "Pending signature"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                marginTop: 32, borderTop: "1px solid #eee", paddingTop: 10,
                display: "flex", justifyContent: "space-between",
                fontSize: 9, color: "#ccc", letterSpacing: "0.08em",
              }}>
                <span>Ref: {doc.id} · Confidential</span>
                <span>Printed on {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</span>
              </div>
            </div>
          </div>

          {/* Signature status pane */}
          <div style={{
            width: 220, flexShrink: 0, overflowY: "auto", padding: "20px 16px",
            scrollbarWidth: "thin", scrollbarColor: "rgba(212,168,83,0.2) transparent",
          }}>
            <div style={{
              fontSize: 9, fontWeight: 800, letterSpacing: "0.18em",
              color: "#4f578f", marginBottom: 14, textTransform: "uppercase",
            }}>
              Signature Status
            </div>

            {/* Progress ring-like bar */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#596197", fontSize: 10 }}>Completion</span>
                <span style={{ color: "#4ade80", fontSize: 11, fontWeight: 700 }}>
                  {Math.round((signedCount / totalCount) * 100)}%
                </span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${Math.round((signedCount / totalCount) * 100)}%`,
                  background: "linear-gradient(90deg, #4ade80, #22d3ee)",
                  borderRadius: 99, transition: "width 0.4s ease",
                }} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {signaturesForDoc.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: p.isSigned ? "rgba(74,222,128,0.06)" : "#080b1d",
                    border: `1px solid ${p.isSigned ? "rgba(74,222,128,0.18)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 10, padding: "10px 12px",
                    display: "flex", alignItems: "center", gap: 10,
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: p.color || "#1a1f4b", flexShrink: 0,
                    overflow: "hidden", display: "grid", placeItems: "center",
                  }}>
                    {p.image
                      ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <FaUser style={{ fontSize: 12, color: "#fff" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#c8cefc", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 9, color: p.isSigned ? "#4ade80" : "#596197", marginTop: 1 }}>
                      {p.isSigned ? "? Signed" : "Pending"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
   PRINT REVIEW  main component
------------------------------------------------------------------- */
export default function PrintReview({ docs: propDocs, participants = [], signed = {}, setSigned }) {
  const docs = (propDocs && propDocs.length > 0) ? propDocs : SAMPLE_DOCS;

  const [viewingDoc, setViewingDoc]     = useState(null);
  const [expandedDoc, setExpandedDoc]   = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const getDocStatus = (doc) => {
    const sigs = participants.map((p) => !!signed[`bp-${doc.id}-${p.id}`]);
    const count = sigs.filter(Boolean).length;
    if (count === 0)               return "pending";
    if (count === participants.length) return "signed";
    return "partial";
  };

  const getSignedCount = (doc) =>
    participants.filter((p) => !!signed[`bp-${doc.id}-${p.id}`]).length;

  const toggleSign = (doc, participantId) => {
    const key = `bp-${doc.id}-${participantId}`;
    setSigned?.((cur) => ({ ...cur, [key]: !cur[key] }));
  };

  const signAll = (doc) => {
    setSigned?.((cur) => {
      const next = { ...cur };
      participants.forEach((p) => { next[`bp-${doc.id}-${p.id}`] = true; });
      return next;
    });
  };

  const handlePrintAll = () => {
    const signedDocs = docs.filter((d) => getDocStatus(d) !== "pending");
    if (signedDocs.length === 0) {
      alert("No signed documents to print.");
      return;
    }
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Board Meeting  Full Print Pack</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'EB Garamond', Georgia, serif; color: #1a1a2e; background: #fff; }
            .page { max-width: 720px; margin: 0 auto; padding: 64px 72px; page-break-after: always; }
            .page:last-child { page-break-after: avoid; }
            .header { border-bottom: 2px solid #1a1a2e; padding-bottom: 20px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-end; }
            .company { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; }
            .doc-title { font-size: 18px; font-weight: 600; margin-top: 6px; }
            .meta { font-size: 10px; color: #888; margin-top: 4px; }
            .badge { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; border: 1px solid #1a1a2e; padding: 4px 12px; border-radius: 999px; }
            .content { font-size: 13px; line-height: 2; white-space: pre-wrap; color: #2a2a3e; margin-bottom: 48px; }
            .sig-section { border-top: 1.5px solid #ddd; padding-top: 28px; }
            .sig-title { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; margin-bottom: 20px; }
            .sig-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; }
            .sig-block { border-bottom: 1px solid #bbb; padding-bottom: 8px; }
            .sig-name { font-size: 10px; color: #555; margin-top: 6px; }
            .sig-role { font-size: 9px; color: #aaa; }
            .footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 10px; display: flex; justify-content: space-between; font-size: 9px; color: #bbb; }
          </style>
        </head>
        <body>
          ${signedDocs.map((doc) => {
            const sigs = participants.map((p) => ({
              ...p, isSigned: !!signed[`bp-${doc.id}-${p.id}`],
            }));
            return `
              <div class="page">
                <div class="header">
                  <div>
                    <div class="company">Company Secretarial Office</div>
                    <div class="doc-title">${doc.name}</div>
                    <div class="meta">${doc.category} · ${doc.date} · ${doc.pages} page${doc.pages > 1 ? "s" : ""}</div>
                  </div>
                  <div class="badge">${getDocStatus(doc) === "signed" ? "FULLY SIGNED" : "PARTIALLY SIGNED"}</div>
                </div>
                <div class="content">${doc.content || ""}</div>
                <div class="sig-section">
                  <div class="sig-title">Authorised Signatures</div>
                  <div class="sig-grid">
                    ${sigs.map((p) => `
                      <div class="sig-block">
                        <div style="height:40px;display:flex;align-items:flex-end">
                          ${p.isSigned ? `<span style="font-family:Georgia,serif;font-size:20px;font-style:italic;color:#1a1a2e">${p.name.split(" ")[0]}</span>` : ""}
                        </div>
                        <div class="sig-name">${p.name}</div>
                        <div class="sig-role">${p.role || ""}</div>
                      </div>
                    `).join("")}
                  </div>
                </div>
                <div class="footer">
                  <span>Ref: ${doc.id} · Confidential</span>
                  <span>Printed ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</span>
                </div>
              </div>
            `;
          }).join("")}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  };

  const statuses   = ["All", "signed", "partial", "pending"];
  const statusLabel = { All: "All", signed: "Fully Signed", partial: "Partial", pending: "Pending" };

  const counts = {
    All:     docs.length,
    signed:  docs.filter((d) => getDocStatus(d) === "signed").length,
    partial: docs.filter((d) => getDocStatus(d) === "partial").length,
    pending: docs.filter((d) => getDocStatus(d) === "pending").length,
  };

  const filtered = filterStatus === "All" ? docs : docs.filter((d) => getDocStatus(d) === filterStatus);

  return (
    <>
      {viewingDoc && (
        <DocViewer
          doc={viewingDoc}
          participants={participants}
          signed={signed}
          onClose={() => setViewingDoc(null)}
        />
      )}

      <section
        style={{
          background: "#0a0d20",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20,
          padding: "28px 28px 24px",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          marginBottom: 24, flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <div style={{
              fontSize: 9, fontWeight: 800, letterSpacing: "0.22em",
              color: "#4f578f", marginBottom: 6, textTransform: "uppercase",
            }}>
              Board Pack
            </div>
            <h2 style={{ color: "#f4f0ff", fontSize: 20, fontWeight: 700, margin: 0 }}>Print Review</h2>
            <p style={{ color: "#596197", fontSize: 12, marginTop: 4 }}>
              Review signed documents and print the final pack
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {/* Summary pills */}
            {/* {["signed", "partial", "pending"].map((s) => (
              <div key={s} style={{
                background: "#080b1d", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10, padding: "8px 14px",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: statusColor(s) }} />
                <span style={{ color: "#596197", fontSize: 10 }}>{statusLabel[s]}</span>
                <strong style={{ color: "#f4f0ff", fontSize: 14 }}>{counts[s]}</strong>
              </div>
            ))} */}

            <button
              onClick={handlePrintAll}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #D4A853, #c49340)",
                border: "none", color: "#0a0d20", borderRadius: 12,
                padding: "10px 20px", fontSize: 13, fontWeight: 800,
                cursor: "pointer", letterSpacing: "0.04em", whiteSpace: "nowrap",
              }}
            >
              <FaPrint style={{ fontSize: 12 }} />
              Print All Signed
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {statuses.map((s) => {
            const isActive = filterStatus === s;
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "6px 14px", borderRadius: 999, cursor: "pointer",
                  border: isActive ? "1.5px solid #D4A853" : "1.5px solid rgba(255,255,255,0.07)",
                  background: isActive ? "rgba(212,168,83,0.10)" : "rgba(255,255,255,0.02)",
                  color: isActive ? "#D4A853" : "#596197",
                  fontSize: 11, fontWeight: isActive ? 700 : 500,
                  transition: "all 0.15s ease",
                }}
              >
                {s !== "All" && (
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: isActive ? "#D4A853" : statusColor(s),
                    flexShrink: 0,
                  }} />
                )}
                {statusLabel[s]}
                <span style={{
                  background: isActive ? "rgba(212,168,83,0.15)" : "rgba(255,255,255,0.06)",
                  color: isActive ? "#D4A853" : "#596197",
                  borderRadius: 20, padding: "1px 7px",
                  fontSize: 9, fontWeight: 700,
                }}>
                  {counts[s]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Overall progress bar */}
        {docs.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 7,
            }}>
              <span style={{ color: "#596197", fontSize: 10, letterSpacing: "0.12em" }}>
                OVERALL SIGNING PROGRESS
              </span>
              <span style={{ color: "#4ade80", fontSize: 11, fontWeight: 700 }}>
                {counts.signed}/{docs.length} fully signed
              </span>
            </div>
            <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${Math.round((counts.signed / docs.length) * 100)}%`,
                background: "linear-gradient(90deg, #4ade80, #22d3ee)",
                borderRadius: 99, transition: "width 0.4s ease",
              }} />
            </div>
            <div style={{ display: "flex", gap: 3, marginTop: 5 }}>
              {docs.map((d) => (
                <div
                  key={d.id}
                  title={d.name}
                  style={{
                    flex: 1, height: 3, borderRadius: 99,
                    background: statusColor(getDocStatus(d)),
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Document list */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 10,
          maxHeight: 520, overflowY: "auto",
          scrollbarWidth: "thin", scrollbarColor: "rgba(212,168,83,0.2) transparent",
          paddingRight: 4,
        }}>
          {filtered.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "48px 24px",
              background: "#080b1d", border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 16,
            }}>
              <FaFileAlt style={{ fontSize: 28, color: "#2a3060", marginBottom: 12 }} />
              <div style={{ color: "#596197", fontSize: 14, fontWeight: 600 }}>No documents match this filter</div>
            </div>
          ) : (
            filtered.map((doc) => {
              const status     = getDocStatus(doc);
              const signedCnt  = getSignedCount(doc);
              const isExpanded = expandedDoc === doc.id;
              const cs         = catStyle(doc.category);

              return (
                <div
                  key={doc.id}
                  style={{
                    background: "#080b1d",
                    border: `1px solid ${
                      status === "signed" ? "rgba(74,222,128,0.14)" :
                      status === "partial" ? "rgba(212,168,83,0.14)" :
                      "rgba(255,255,255,0.06)"
                    }`,
                    borderRadius: 14,
                    overflow: "hidden",
                    transition: "border-color 0.2s ease",
                  }}
                >
                  {/* Card header row */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 16px",
                  }}>
                    {/* Icon */}
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      background: cs.bg, display: "grid", placeItems: "center",
                      border: `1px solid ${cs.color}22`,
                    }}>
                      <FaFileAlt style={{ color: cs.color, fontSize: 14 }} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ color: "#f4f0ff", fontWeight: 700, fontSize: 13 }}>{doc.name}</span>
                        <span style={{
                          ...cs,
                          fontSize: 9, fontWeight: 800, letterSpacing: "0.14em",
                          padding: "2px 8px", borderRadius: 999,
                        }}>
                          {doc.category.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ color: "#596197", fontSize: 11 }}>{doc.date}</span>
                        <span style={{ color: "#3a4070", fontSize: 11 }}>·</span>
                        <span style={{ color: "#596197", fontSize: 11 }}>{doc.pages} page{doc.pages > 1 ? "s" : ""}</span>
                        <span style={{ color: "#3a4070", fontSize: 11 }}>·</span>
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          color: statusColor(status),
                        }}>
                          {signedCnt}/{participants.length} signed
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                      {/* Status badge */}
                      <span style={{
                        fontSize: 9, fontWeight: 800, letterSpacing: "0.12em",
                        padding: "4px 10px", borderRadius: 999,
                        background: status === "signed" ? "rgba(74,222,128,0.10)" : status === "partial" ? "rgba(212,168,83,0.10)" : "rgba(255,255,255,0.05)",
                        color: statusColor(status),
                      }}>
                        {status === "signed" ? "SIGNED" : status === "partial" ? "PARTIAL" : "PENDING"}
                      </span>

                      <button
                        onClick={() => setViewingDoc(doc)}
                        title="View document"
                        style={{
                          display: "flex", alignItems: "center", gap: 5,
                          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                          color: "#8b93c8", borderRadius: 8, padding: "6px 12px",
                          fontSize: 11, cursor: "pointer", whiteSpace: "nowrap",
                        }}
                      >
                        <FaEye style={{ fontSize: 10 }} /> View
                      </button>

                      <button
                        onClick={() => setExpandedDoc(isExpanded ? null : doc.id)}
                        title="Manage signatures"
                        style={{
                          display: "flex", alignItems: "center", gap: 5,
                          background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.18)",
                          color: "#D4A853", borderRadius: 8, padding: "6px 12px",
                          fontSize: 11, cursor: "pointer", whiteSpace: "nowrap",
                        }}
                      >
                        <FaStamp style={{ fontSize: 10 }} />
                        Sign
                        {isExpanded
                          ? <FaChevronUp style={{ fontSize: 9 }} />
                          : <FaChevronDown style={{ fontSize: 9 }} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded signing panel */}
                  {isExpanded && (
                    <div style={{
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      padding: "16px 16px 16px",
                      background: "#060919",
                    }}>
                      {/* Sign all + progress */}
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 14, flexWrap: "wrap", gap: 8,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ height: 4, width: 120, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{
                              height: "100%",
                              width: `${Math.round((signedCnt / participants.length) * 100)}%`,
                              background: "linear-gradient(90deg,#4ade80,#22d3ee)",
                              borderRadius: 99,
                            }} />
                          </div>
                          <span style={{ color: "#596197", fontSize: 10 }}>
                            {signedCnt} of {participants.length} signed
                          </span>
                        </div>
                        {status !== "signed" && (
                          <button
                            onClick={() => signAll(doc)}
                            style={{
                              display: "flex", alignItems: "center", gap: 6,
                              background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.18)",
                              color: "#4ade80", borderRadius: 8, padding: "6px 14px",
                              fontSize: 11, fontWeight: 700, cursor: "pointer",
                            }}
                          >
                            <FaCheck style={{ fontSize: 9 }} />
                            Sign All Members
                          </button>
                        )}
                      </div>

                      {/* Participant sign toggles */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                        gap: 8,
                      }}>
                        {participants.map((person) => {
                          const isSigned = !!signed[`bp-${doc.id}-${person.id}`];
                          return (
                            <button
                              key={person.id}
                              onClick={() => toggleSign(doc, person.id)}
                              style={{
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                                background: isSigned ? "rgba(74,222,128,0.07)" : "rgba(255,255,255,0.03)",
                                border: `1px solid ${isSigned ? "rgba(74,222,128,0.22)" : "rgba(255,255,255,0.07)"}`,
                                transition: "all 0.15s ease", textAlign: "left",
                              }}
                            >
                              <div style={{
                                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                                background: person.color || "#1a1f4b", overflow: "hidden",
                                display: "grid", placeItems: "center",
                              }}>
                                {person.image
                                  ? <img src={person.image} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  : <FaUser style={{ fontSize: 11, color: "#fff" }} />}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  color: isSigned ? "#c8fcdc" : "#8b93c8",
                                  fontSize: 11, fontWeight: 600,
                                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                }}>
                                  {person.name}
                                </div>
                                <div style={{ color: isSigned ? "#4ade80" : "#596197", fontSize: 9 }}>
                                  {isSigned ? " Signed" : "Tap to sign"}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}
