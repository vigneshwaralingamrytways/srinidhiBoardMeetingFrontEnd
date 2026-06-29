import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCheck, FaTimes } from "react-icons/fa";

/* ---------------------------------------------
   STATIC DATA
--------------------------------------------- */
const PARTICIPANTS = [
  { id: "p1", name: "Arjun Mehta",   role: "Chairman",          color: "#3b4fa8", initials: "AM" },
  { id: "p2", name: "Priya Sharma",  role: "Managing Director", color: "#a8503b", initials: "PS" },
  { id: "p3", name: "Rahul Nair",    role: "CFO",               color: "#3ba872", initials: "RN" },
  { id: "p4", name: "Divya Kapoor",  role: "Company Secretary", color: "#8e3ba8", initials: "DK" },
];

const MEETINGS = [
  {
    id: "m1",
    title: "Q1 Board Meeting 2025",
    type: "Board Meeting",
    date: "2025-03-15",
    time: "10:00 AM",
    location: "Boardroom A, HQ",
    company: "Srestha Solutions Pvt Ltd",
    status: "Completed",
    agendaItems: [
      {
        id: "ag1",
        title: "Financial Performance Review",
        presenter: "Rahul Nair",
        duration: 30,
        type: "Discussion",
        resolutions: [
          {
            id: "r1",
            title: "Approval of Q1 Financial Statements",
            description: "RESOLVED THAT the audited financial statements of the company for Q1 FY2025 including Balance Sheet, Profit & Loss Account and Cash Flow Statement be and are hereby approved.",
            categoryType: "MCA",
            votes: { p1: "Approve", p2: "Approve", p3: "Approve", p4: "Approve" },
          },
          {
            id: "r2",
            title: "Ratification of Emergency Expenditure",
            description: "RESOLVED THAT the emergency capital expenditure of ?18.5 lakhs incurred for server infrastructure upgrade in February 2025 be and is hereby ratified.",
            categoryType: "Not MCA",
            votes: { p1: "Approve", p2: "Approve", p3: "Reject", p4: "Approve" },
          },
        ],
      },
      {
        id: "ag2",
        title: "Budget Reallocation Proposal",
        presenter: "Priya Sharma",
        duration: 20,
        type: "Resolution",
        resolutions: [
          {
            id: "r3",
            title: "Marketing Budget Enhancement",
            description: "RESOLVED THAT the marketing budget for FY2025 be increased from ?1.8 Crore to ?2.4 Crore with the additional ?60 lakhs to be allocated towards digital campaigns and brand activation.",
            categoryType: "Not MCA",
            votes: { p1: "Approve", p2: "Approve", p3: "Approve", p4: "Abstain" },
          },
        ],
      },
      {
        id: "ag3",
        title: "Dividend Declaration",
        presenter: "Arjun Mehta",
        duration: 15,
        type: "Resolution",
        resolutions: [
          {
            id: "r4",
            title: "Interim Dividend Declaration  Q1 FY2025",
            description: "RESOLVED THAT an interim dividend of ?2.50 per equity share of ?10/- each be declared and paid to all shareholders registered as on 31st March 2025.",
            categoryType: "MCA",
            votes: { p1: "Approve", p2: "Approve", p3: "Approve", p4: "Approve" },
          },
        ],
      },
    ],
  },
  {
    id: "m2",
    title: "Audit Committee Meeting",
    type: "Committee Meeting",
    date: "2025-04-02",
    time: "03:00 PM",
    location: "Conference Room B",
    company: "Srestha Solutions Pvt Ltd",
    status: "Completed",
    agendaItems: [
      {
        id: "ag4",
        title: "Internal Audit Report Review",
        presenter: "Divya Kapoor",
        duration: 45,
        type: "Discussion",
        resolutions: [
          {
            id: "r5",
            title: "Acceptance of Internal Audit Report FY24-25",
            description: "RESOLVED THAT the Internal Audit Report for the financial year 2024-25 presented by M/s. Sharma & Associates, Internal Auditors, be and is hereby noted and accepted.",
            categoryType: "MCA",
            votes: { p1: "Approve", p2: "Approve", p3: "Approve", p4: "Approve" },
          },
          {
            id: "r6",
            title: "Action Plan for High-Priority Findings",
            description: "RESOLVED THAT the management action plan addressing the three high-priority audit findings related to vendor payment controls be implemented within 45 days from the date of this meeting.",
            categoryType: "Not MCA",
            votes: { p1: "Approve", p2: "Reject", p3: "Approve", p4: "Approve" },
          },
        ],
      },
      {
        id: "ag5",
        title: "Re-appointment of Internal Auditors",
        presenter: "Arjun Mehta",
        duration: 10,
        type: "Resolution",
        resolutions: [
          {
            id: "r7",
            title: "Re-appointment of M/s. Sharma & Associates",
            description: "RESOLVED THAT M/s. Sharma & Associates, Chartered Accountants, be and are hereby re-appointed as Internal Auditors of the Company for FY2025-26 on the same terms and conditions.",
            categoryType: "MCA",
            votes: { p1: "Approve", p2: "Approve", p3: "Abstain", p4: "Approve" },
          },
        ],
      },
    ],
  },
  {
    id: "m3",
    title: "Annual General Meeting 2025",
    type: "AGM",
    date: "2025-05-20",
    time: "09:30 AM",
    location: "Grand Ballroom, Taj Hotel",
    company: "VAF Systems Pvt Ltd",
    status: "Scheduled",
    agendaItems: [
      {
        id: "ag6",
        title: "Annual Accounts Adoption",
        presenter: "Rahul Nair",
        duration: 20,
        type: "Ordinary Resolution",
        resolutions: [
          {
            id: "r8",
            title: "Adoption of Annual Financial Statements FY2024-25",
            description: "RESOLVED THAT the Audited Balance Sheet as at 31st March 2025, Statement of Profit & Loss for the year ended on that date, together with the Reports of the Board of Directors and Auditors thereon be and are hereby adopted.",
            categoryType: "MCA",
            votes: { p1: "Approve", p2: "Approve", p3: "Approve", p4: "Approve" },
          },
        ],
      },
      {
        id: "ag7",
        title: "Director Re-appointment",
        presenter: "Arjun Mehta",
        duration: 15,
        type: "Special Resolution",
        resolutions: [
          {
            id: "r9",
            title: "Re-appointment of Mr. Arjun Mehta as Director",
            description: "RESOLVED THAT Mr. Arjun Mehta (DIN: 00123456), who retires by rotation at this Annual General Meeting and being eligible, offers himself for re-appointment, be and is hereby re-appointed as a Director of the Company.",
            categoryType: "MCA",
            votes: { p1: "Abstain", p2: "Approve", p3: "Approve", p4: "Approve" },
          },
          {
            id: "r10",
            title: "Approval of Director Remuneration",
            description: "RESOLVED THAT pursuant to the provisions of the Companies Act 2013, the revised remuneration payable to the Whole-time Director be approved at ?42 lakhs per annum with effect from 1st April 2025.",
            categoryType: "MCA",
            votes: { p1: "Abstain", p2: "Approve", p3: "Reject", p4: "Approve" },
          },
        ],
      },
    ],
  },
];

/* ---------------------------------------------
   HELPERS
--------------------------------------------- */
function getVoteResult(votes) {
  const vals = Object.values(votes || {});
  const approve  = vals.filter((v) => v === "Approve").length;
  const reject   = vals.filter((v) => v === "Reject").length;
  const abstain  = vals.filter((v) => v === "Abstain").length;
  const status   = approve > reject && approve > 0 ? "Approved" : vals.length ? "Rejected" : "Waiting";
  return { approve, reject, abstain, status };
}

const VOTE_COLOR = {
  Approved: { bg: "rgba(74,222,128,0.12)", color: "#4ade80", border: "rgba(74,222,128,0.25)" },
  Rejected: { bg: "rgba(220,80,80,0.12)",  color: "#e06060", border: "rgba(220,80,80,0.25)" },
  Waiting:  { bg: "rgba(212,168,83,0.10)", color: "#D4A853", border: "rgba(212,168,83,0.22)" },
};

const CAT_STYLE = {
  MCA:     { bg: "rgba(80,140,220,0.15)", color: "#6aaaee", border: "rgba(80,140,220,0.28)" },
  "Not MCA": { bg: "rgba(180,100,220,0.13)", color: "#c47ae8", border: "rgba(180,100,220,0.25)" },
};

const StatusPill = ({ status }) => {
  const map = {
    Completed: { bg: "rgba(77,184,150,0.12)", color: "#4db896", border: "rgba(77,184,150,0.25)" },
    Scheduled: { bg: "rgba(212,168,83,0.12)", color: "#D4A853", border: "rgba(212,168,83,0.25)" },
    Cancelled: { bg: "rgba(220,80,80,0.12)",  color: "#e06060", border: "rgba(220,80,80,0.25)" },
  };
  const s = map[status] || map.Scheduled;
  return (
    <span style={{
      fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      letterSpacing: "0.08em",
    }}>
      {status.toUpperCase()}
    </span>
  );
};

const Avatar = ({ person, vote }) => {
  const voteColor = vote === "Approve" ? "#4ade80" : vote === "Reject" ? "#e06060" : vote === "Abstain" ? "#D4A853" : "rgba(255,255,255,0.12)";
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div title={`${person.name}  ${vote || "No vote"}`} style={{
        width: 30, height: 30, borderRadius: "50%",
        background: person.color,
        border: `2px solid ${voteColor}`,
        display: "grid", placeItems: "center",
        color: "#fff", fontSize: 10, fontWeight: 800,
        transition: "border-color 0.2s",
      }}>
        {person.initials}
      </div>
      {vote && (
        <div style={{
          position: "absolute", bottom: -2, right: -2,
          width: 12, height: 12, borderRadius: "50%",
          background: voteColor, display: "grid", placeItems: "center",
          fontSize: 6, color: vote === "Approve" ? "#052010" : vote === "Reject" ? "#200505" : "#201005",
          fontWeight: 900,
        }}>
          {vote === "Approve" ? <FaCheck/> : vote === "Reject" ? <FaTimes/> : ""}
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------
   MEETING LIST
--------------------------------------------- */
function MeetingList({ meetings, onSelect }) {
  const companies = ["All", ...Array.from(new Set(meetings.map((m) => m.company).filter(Boolean)))];
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? meetings : meetings.filter((m) => m.company === active);

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#f4f0ff", fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>
          Meeting List
        </h2>
        <p style={{ color: "#596197", fontSize: 13, margin: 0 }}>
          Select a meeting to view its resolutions and voting results
        </p>
      </div>

      {companies.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {companies.map((co) => {
            const isActive = active === co;
            const count = co === "All" ? meetings.length : meetings.filter((m) => m.company === co).length;
            return (
              <button key={co} onClick={() => setActive(co)} style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "6px 14px", borderRadius: 999, cursor: "pointer",
                border: isActive ? "1.5px solid #D4A853" : "1.5px solid rgba(255,255,255,0.08)",
                background: isActive ? "rgba(212,168,83,0.12)" : "rgba(255,255,255,0.03)",
                color: isActive ? "#D4A853" : "#596197",
                fontSize: 12, fontWeight: isActive ? 700 : 500, transition: "all 0.18s",
              }}>
                {co !== "All" && <span style={{ width: 6, height: 6, borderRadius: "50%", background: isActive ? "#D4A853" : "#596197" }} />}
                {co}
                <span style={{ background: isActive ? "rgba(212,168,83,0.18)" : "rgba(255,255,255,0.06)", color: isActive ? "#D4A853" : "#7a83b8", borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((item) => {
          const totalRes = item.agendaItems.reduce((s, a) => s + a.resolutions.length, 0);
          const approved = item.agendaItems.reduce((s, a) =>
            s + a.resolutions.filter((r) => getVoteResult(r.votes).status === "Approved").length, 0);
          return (
            <button key={item.id} onClick={() => onSelect(item)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 20px", borderRadius: 16, cursor: "pointer",
                border: "1.5px solid rgba(255,255,255,0.07)",
                background: "#090c22", textAlign: "left", width: "100%",
                transition: "all 0.18s", gap: 16,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,168,83,0.35)"; e.currentTarget.style.background = "#0c1028"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "#090c22"; }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ color: "#f4f0ff", fontSize: 15, fontWeight: 700 }}>{item.title}</span>
                  <StatusPill status={item.status} />
                </div>
                <div style={{ color: "#596197", fontSize: 12, marginBottom: 6 }}>
                  {item.type} · {item.date} · {item.time}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ color: "#3d4570", fontSize: 11 }}> {item.location}</span>
                  {item.company && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.18)", color: "#D4A853", fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 999 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#D4A853" }} />
                      {item.company}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#D4A853", fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{totalRes}</div>
                  <div style={{ color: "#596197", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" }}>RESOLUTIONS</div>
                </div>
                {/* <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#4ade80", fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{approved}</div>
                  <div style={{ color: "#596197", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" }}>APPROVED</div>
                </div> */}
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(212,168,83,0.10)", color: "#D4A853", display: "grid", placeItems: "center", fontSize: 16, fontWeight: 900 }}><FaArrowRight/></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------
   RESOLUTION CARD
--------------------------------------------- */
function ResolutionCard({ resolution, index, agendaTitle, participants }) {
  const [expanded, setExpanded] = useState(false);
  const result = getVoteResult(resolution.votes);
  const vs = VOTE_COLOR[result.status] || VOTE_COLOR.Waiting;
  const cs = CAT_STYLE[resolution.categoryType];
  const total = participants.length;
  const approvePct = total > 0 ? Math.round((result.approve / total) * 100) : 0;

  return (
    <div style={{
      border: `1.5px solid ${result.status === "Approved" ? "rgba(74,222,128,0.18)" : result.status === "Rejected" ? "rgba(220,80,80,0.18)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 16, background: "#090c20", overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      {/* -- Card header -- */}
      <div style={{ padding: "18px 20px" }}>
        {/* Top row: breadcrumb + badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: "#3d4570", fontWeight: 700, letterSpacing: "0.15em" }}>SOURCE</span>
          <span style={{ color: "#3d4570" }}></span>
          <span style={{ background: "rgba(212,168,83,0.10)", color: "#D4A853", fontSize: 10, fontWeight: 800, padding: "2px 10px", borderRadius: 999 }}>
            {agendaTitle}
          </span>
          <span style={{ color: "#3d4570" }}></span>
          <span style={{ background: "rgba(255,255,255,0.04)", color: "#8b93c8", fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 999 }}>
            § Resolution {index + 1}
          </span>
        </div>

        {/* Title row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
              <span style={{ color: "#d4a853", fontSize: 15, fontWeight: 900 }}>§</span>
              <span style={{ color: "#f4f0ff", fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}>{resolution.title}</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {resolution.categoryType && cs && (
                <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999, background: cs.bg, color: cs.color, border: `1px solid ${cs.border}` }}>
                  {resolution.categoryType}
                </span>
              )}
              <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999, background: vs.bg, color: vs.color, border: `1px solid ${vs.border}` }}>
                {result.status}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {resolution.description && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: 2, marginBottom: 6, fontWeight: 700 }}>RESOLUTION TEXT</div>
            <div style={{
              color: "#7a83b8", fontSize: 13, lineHeight: 1.85,
              background: "#080b1d", border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 10, padding: "12px 14px",
            }}>
              {resolution.description}
            </div>
          </div>
        )}

        {/* Approve progress bar */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: "#4e568e", fontSize: 10, fontWeight: 700, letterSpacing: 2 }}>VOTING RESULT</span>
            <span style={{ color: result.status === "Approved" ? "#4ade80" : "#e06060", fontSize: 11, fontWeight: 800 }}>
              {approvePct}% Approved
            </span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden", marginBottom: 12 }}>
            <div style={{
              height: "100%", width: `${approvePct}%`,
              background: result.status === "Approved" ? "linear-gradient(90deg,#4ade80,#22d3ee)" : "linear-gradient(90deg,#e06060,#e08060)",
              borderRadius: 99, transition: "width 0.4s ease",
            }} />
          </div>
        </div>

        {/* Tally pills */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Approve", count: result.approve, bg: "rgba(74,222,128,0.10)", color: "#4ade80", border: "rgba(74,222,128,0.22)" },
            { label: "Reject",  count: result.reject,  bg: "rgba(220,80,80,0.10)",  color: "#e06060", border: "rgba(220,80,80,0.22)" },
            { label: "Abstain", count: result.abstain, bg: "rgba(212,168,83,0.10)", color: "#D4A853", border: "rgba(212,168,83,0.22)" },
          ].map(({ label, count, bg, color, border }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "8px 16px" }}>
              <span style={{ color, fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{count}</span>
              <span style={{ color, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" }}>{label.toUpperCase()}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "8px 16px" }}>
            <span style={{ color: "#f4f0ff", fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{total}</span>
            <span style={{ color: "#596197", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" }}>TOTAL</span>
          </div>
        </div>

        {/* Toggle voter breakdown */}
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{
            fontSize: 11, padding: "6px 14px", borderRadius: 8, cursor: "pointer",
            border: "1px solid rgba(255,255,255,0.10)", color: "#596197",
            background: "transparent", fontWeight: 600, transition: "all 0.15s",
            display: "flex", alignItems: "center", gap: 6,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,168,83,0.3)"; e.currentTarget.style.color = "#D4A853"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.color = "#596197"; }}
        >
          {expanded ? " Hide" : "Show"} Member Votes
        </button>
      </div>

      {/* -- Voter breakdown -- */}
      {expanded && (
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          background: "#07091a",
          padding: "16px 20px",
        }}>
          <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: 2, fontWeight: 700, marginBottom: 12 }}>
            INDIVIDUAL VOTES
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {participants.map((person) => {
              const vote = resolution.votes?.[person.id];
              const voteColor = vote === "Approve" ? "#4ade80" : vote === "Reject" ? "#e06060" : vote === "Abstain" ? "#D4A853" : "#3d4570";
              const voteBg   = vote === "Approve" ? "rgba(74,222,128,0.07)" : vote === "Reject" ? "rgba(220,80,80,0.07)" : vote === "Abstain" ? "rgba(212,168,83,0.07)" : "rgba(255,255,255,0.02)";
              const voteBorder = vote === "Approve" ? "rgba(74,222,128,0.18)" : vote === "Reject" ? "rgba(220,80,80,0.18)" : vote === "Abstain" ? "rgba(212,168,83,0.18)" : "rgba(255,255,255,0.06)";
              return (
                <div key={person.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  padding: "10px 14px", borderRadius: 10,
                  border: `1px solid ${voteBorder}`, background: voteBg,
                  transition: "all 0.15s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar person={person} vote={vote} />
                    <div>
                      <div style={{ color: "#f4f0ff", fontWeight: 700, fontSize: 13 }}>{person.name}</div>
                      <div style={{ color: "#596197", fontSize: 11 }}>{person.role}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 800, padding: "4px 14px", borderRadius: 999,
                    background: voteBorder.replace("0.18", "0.12"), color: voteColor,
                    border: `1px solid ${voteBorder}`, letterSpacing: "0.05em",
                  }}>
                    {vote || "No Vote"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------
   MEETING RESOLUTION VIEW
--------------------------------------------- */
function MeetingResolutionView({ meeting, participants, onBack }) {
  const [activeAgendaId, setActiveAgendaId] = useState(meeting.agendaItems[0]?.id || null);

  const allResolutions = meeting.agendaItems.flatMap((a) =>
    a.resolutions.map((r) => ({ ...r, agendaTitle: a.title }))
  );
  const totalApproved = allResolutions.filter((r) => getVoteResult(r.votes).status === "Approved").length;
  const totalRejected = allResolutions.filter((r) => getVoteResult(r.votes).status === "Rejected").length;

  const activeAgenda = meeting.agendaItems.find((a) => a.id === activeAgendaId);

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      {/* Back + header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div>
          <button
            onClick={onBack}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "transparent", border: "1px solid rgba(255,255,255,0.10)",
              color: "#7a83b8", fontSize: 12, padding: "6px 14px", borderRadius: 8,
              cursor: "pointer", marginBottom: 14, fontWeight: 600,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,168,83,0.35)"; e.currentTarget.style.color = "#D4A853"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.color = "#7a83b8"; }}
          >
            <FaArrowLeft/> Meeting List
          </button>
          <h2 style={{ color: "#f4f0ff", fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>
            {meeting.title}
          </h2>
          <div style={{ color: "#596197", fontSize: 12 }}>
            {meeting.type} · {meeting.date} · {meeting.time} · {meeting.location}
          </div>
        </div>

        {/* Summary stats */}
        <div style={{
          display: "flex", alignItems: "center", gap: 0, flexShrink: 0,
          background: "#090c22", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, overflow: "hidden",
        }}>
          {[
            { label: "TOTAL",    value: allResolutions.length, color: "#D4A853" },
            { label: "APPROVED", value: totalApproved,          color: "#4ade80" },
            { label: "REJECTED", value: totalRejected,          color: "#e06060" },
          ].map(({ label, value, color }, i) => (
            <div key={label} style={{
              textAlign: "center", padding: "14px 20px",
              borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <div style={{ color, fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{value}</div>
              <div style={{ color: "#596197", fontSize: 10, fontWeight: 700, marginTop: 2, letterSpacing: "0.08em" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Layout: Left sidebar (agenda tabs) + Right (resolution cards) */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>

        {/* -- LEFT: Agenda sidebar -- */}
        <div style={{
          width: 220, flexShrink: 0,
          background: "#090c22", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16, overflow: "hidden", position: "sticky", top: 0,
        }}>
          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ color: "#4e568e", fontSize: 10, fontWeight: 800, letterSpacing: "0.15em" }}>AGENDA ITEMS</div>
          </div>
          <div style={{ padding: "8px 0" }}>
            {meeting.agendaItems.map((agenda) => {
              const isActive = agenda.id === activeAgendaId;
              const count = agenda.resolutions.length;
              const approvedCount = agenda.resolutions.filter((r) => getVoteResult(r.votes).status === "Approved").length;
              return (
                <button
                  key={agenda.id}
                  onClick={() => setActiveAgendaId(agenda.id)}
                  style={{
                    display: "flex", flexDirection: "column", gap: 4,
                    width: "100%", textAlign: "left", padding: "10px 16px", cursor: "pointer",
                    background: isActive ? "rgba(212,168,83,0.08)" : "transparent",
                    borderLeft: isActive ? "2.5px solid #D4A853" : "2.5px solid transparent",
                    border: "none", transition: "all 0.15s",
                  }}
                >
                  <span style={{ color: isActive ? "#f4f0ff" : "#8b93c8", fontWeight: isActive ? 700 : 500, fontSize: 12, lineHeight: 1.4 }}>
                    {agenda.title}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#596197", fontSize: 10 }}>{agenda.type}</span>
                    <span style={{
                      background: isActive ? "rgba(212,168,83,0.18)" : "rgba(255,255,255,0.06)",
                      color: isActive ? "#D4A853" : "#7a83b8",
                      fontSize: 9, fontWeight: 800, padding: "1px 7px", borderRadius: 20,
                    }}>
                      {approvedCount}/{count} 
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* -- RIGHT: Resolution cards -- */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          {activeAgenda && (
            <>
              {/* Agenda header */}
              <div style={{
                padding: "14px 18px",
                background: "#090c22", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
              }}>
                <div>
                  <div style={{ color: "#D4A853", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", marginBottom: 3 }}>ACTIVE AGENDA</div>
                  <div style={{ color: "#f4f0ff", fontSize: 15, fontWeight: 700 }}>{activeAgenda.title}</div>
                  <div style={{ color: "#596197", fontSize: 11, marginTop: 2 }}>
                    Presenter: {activeAgenda.presenter} · {activeAgenda.duration} min · {activeAgenda.type}
                  </div>
                </div>
                <span style={{
                  background: "rgba(212,168,83,0.10)", color: "#D4A853",
                  fontSize: 11, fontWeight: 800, padding: "5px 14px", borderRadius: 999,
                  border: "1px solid rgba(212,168,83,0.22)",
                }}>
                  {activeAgenda.resolutions.length} Resolution{activeAgenda.resolutions.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Resolution cards */}
              {activeAgenda.resolutions.length === 0 ? (
                <div style={{
                  textAlign: "center", padding: "64px 32px",
                  border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16,
                  background: "#090c22", color: "#3d4570",
                }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>§</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#596197" }}>No resolutions for this agenda item</div>
                </div>
              ) : (
                activeAgenda.resolutions.map((res, idx) => (
                  <ResolutionCard
                    key={res.id}
                    resolution={res}
                    index={idx}
                    agendaTitle={activeAgenda.title}
                    participants={participants}
                  />
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   ROOT EXPORT
--------------------------------------------- */
export default function MeetingResolutions() {
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#06081a",
      padding: "32px 24px",
      boxSizing: "border-box",
    }}>
      <div style={{ width: "100%" }}>
        {selectedMeeting ? (
          <MeetingResolutionView
            meeting={selectedMeeting}
            participants={PARTICIPANTS}
            onBack={() => setSelectedMeeting(null)}
          />
        ) : (
          <MeetingList meetings={MEETINGS} onSelect={setSelectedMeeting} />
        )}
      </div>
    </div>
  );
}
