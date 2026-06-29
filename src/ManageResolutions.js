import { useMemo, useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
} from "react-icons/fa";
import { INITIAL_CIRCULARS } from "./circularsData";
import "./MeetingResolutions.css";


/* ---------------------------------------------
   STATIC DATA
--------------------------------------------- */
const PARTICIPANTS = [
  { id: "p1", name: "Arjun Mehta", role: "Chairman", color: "#3b4fa8", initials: "AM" },
  { id: "p2", name: "Priya Sharma", role: "Managing Director", color: "#a8503b", initials: "PS" },
  { id: "p3", name: "Rahul Nair", role: "CFO", color: "#3ba872", initials: "RN" },
  { id: "p4", name: "Divya Kapoor", role: "Company Secretary", color: "#8e3ba8", initials: "DK" },
];
const INITIAL_RESOLUTIONS = [
  {
    id: "r1",
    title: "Approval of Q1 Financial Statements",
    description:
      "RESOLVED THAT the audited financial statements of the company for Q1 FY2025 including Balance Sheet, Profit & Loss Account and Cash Flow Statement be and are hereby approved.",
    categoryType: "MCA",
    meetingTitle: "Q1 Board Meeting 2025",
    agendaTitle: "Financial Performance Review",
    date: "2025-03-15",
    time: "10:00 AM",
    status: "Completed",
    votes: { p1: "Approve", p2: "Approve", p3: "Approve", p4: "Approve" },
  },

  {
    id: "r2",
    title: "Ratification of Emergency Expenditure",
    description:
      "RESOLVED THAT the emergency capital expenditure of ?18.5 lakhs incurred for server infrastructure upgrade in February 2025 be and is hereby ratified.",
    categoryType: "Not MCA",
    meetingTitle: "Q1 Board Meeting 2025",
    agendaTitle: "Financial Performance Review",
    date: "2025-03-15",
    time: "10:00 AM",
    status: "Completed",
    votes: { p1: "Approve", p2: "Approve", p3: "Reject", p4: "Approve" },
  },

  {
    id: "r3",
    title: "Marketing Budget Enhancement",
    description:
      "RESOLVED THAT the marketing budget for FY2025 be increased from ?1.8 Crore to ?2.4 Crore with the additional ?60 lakhs to be allocated towards digital campaigns and brand activation.",
    categoryType: "Not MCA",
    meetingTitle: "Q1 Board Meeting 2025",
    agendaTitle: "Budget Reallocation Proposal",
    date: "2025-03-15",
    time: "11:20 AM",
    status: "Completed",
    votes: { p1: "Approve", p2: "Approve", p3: "Approve", p4: "Abstain" },
  },

  {
    id: "r4",
    title: "Interim Dividend Declaration  Q1 FY2025",
    description:
      "RESOLVED THAT an interim dividend of ?2.50 per equity share of ?10/- each be declared and paid to all shareholders registered as on 31st March 2025.",
    categoryType: "MCA",
    meetingTitle: "Q1 Board Meeting 2025",
    agendaTitle: "Dividend Declaration",
    date: "2025-03-15",
    time: "12:00 PM",
    status: "Completed",
    votes: { p1: "Approve", p2: "Approve", p3: "Approve", p4: "Approve" },
  },

  {
    id: "r5",
    title: "Acceptance of Internal Audit Report FY24-25",
    description:
      "RESOLVED THAT the Internal Audit Report for the financial year 2024-25 presented by M/s. Sharma & Associates, Internal Auditors, be and is hereby noted and accepted.",
    categoryType: "MCA",
    meetingTitle: "Audit Committee Meeting",
    agendaTitle: "Internal Audit Report Review",
    date: "2025-04-02",
    time: "03:00 PM",
    status: "Completed",
    votes: { p1: "Approve", p2: "Approve", p3: "Approve", p4: "Approve" },
  },

  {
    id: "r6",
    title: "Action Plan for High-Priority Findings",
    description:
      "RESOLVED THAT the management action plan addressing the three high-priority audit findings related to vendor payment controls be implemented within 45 days from the date of this meeting.",
    categoryType: "Not MCA",
    meetingTitle: "Audit Committee Meeting",
    agendaTitle: "Internal Audit Report Review",
    date: "2025-04-02",
    time: "03:45 PM",
    status: "Completed",
    votes: { p1: "Approve", p2: "Reject", p3: "Approve", p4: "Approve" },
  },

  {
    id: "r7",
    title: "Re-appointment of Internal Auditors",
    description:
      "RESOLVED THAT M/s. Sharma & Associates, Chartered Accountants, be and are hereby re-appointed as Internal Auditors of the Company for FY2025-26 on the same terms and conditions.",
    categoryType: "MCA",
    meetingTitle: "Audit Committee Meeting",
    agendaTitle: "Auditor Appointment",
    date: "2025-04-02",
    time: "04:20 PM",
    status: "Completed",
    votes: { p1: "Approve", p2: "Approve", p3: "Abstain", p4: "Approve" },
  },

  {
    id: "r8",
    title: "Adoption of Annual Financial Statements FY2024-25",
    description:
      "RESOLVED THAT the Audited Balance Sheet as at 31st March 2025, Statement of Profit & Loss for the year ended on that date, together with the Reports of the Board of Directors and Auditors thereon be and are hereby adopted.",
    categoryType: "MCA",
    meetingTitle: "Annual General Meeting 2025",
    agendaTitle: "Annual Accounts Adoption",
    date: "2025-05-20",
    time: "09:30 AM",
    status: "Scheduled",
    votes: { p1: "Approve", p2: "Approve", p3: "Approve", p4: "Approve" },
  },

  {
    id: "r9",
    title: "Re-appointment of Mr. Arjun Mehta as Director",
    description:
      "RESOLVED THAT Mr. Arjun Mehta (DIN: 00123456), who retires by rotation at this Annual General Meeting and being eligible, offers himself for re-appointment, be and is hereby re-appointed as a Director of the Company.",
    categoryType: "MCA",
    meetingTitle: "Annual General Meeting 2025",
    agendaTitle: "Director Re-appointment",
    date: "2025-05-20",
    time: "10:15 AM",
    status: "Scheduled",
    votes: { p1: "Abstain", p2: "Approve", p3: "Approve", p4: "Approve" },
  },

  {
    id: "r10",
    title: "Approval of Director Remuneration",
    description:
      "RESOLVED THAT pursuant to the provisions of the Companies Act 2013, the revised remuneration payable to the Whole-time Director be approved at ?42 lakhs per annum with effect from 1st April 2025.",
    categoryType: "MCA",
    meetingTitle: "Annual General Meeting 2025",
    agendaTitle: "Director Compensation",
    date: "2025-05-20",
    time: "10:45 AM",
    status: "Scheduled",
    votes: { p1: "Abstain", p2: "Approve", p3: "Reject", p4: "Approve" },
  },

  {
    id: "r11",
    title: "ESOP Expansion Approval",
    description:
      "RESOLVED THAT the Employee Stock Option Plan pool be increased by 2% of the paid-up equity share capital of the Company for employee retention and leadership hiring initiatives.",
    categoryType: "Not MCA",
    meetingTitle: "Strategy Committee Meeting",
    agendaTitle: "Talent Retention Planning",
    date: "2025-06-10",
    time: "02:00 PM",
    status: "Scheduled",
    votes: { p1: "Approve", p2: "Approve", p3: "Approve", p4: "Approve" },
  },

  {
    id: "r12",
    title: "Cyber Security Infrastructure Upgrade",
    description:
      "RESOLVED THAT the Company invest ?3.2 Crores towards enterprise-grade cyber security infrastructure, including endpoint protection, SIEM monitoring and disaster recovery systems.",
    categoryType: "MCA",
    meetingTitle: "Technology Governance Meeting",
    agendaTitle: "Cyber Security Review",
    date: "2025-06-18",
    time: "04:00 PM",
    status: "Scheduled",
    votes: { p1: "Approve", p2: "Approve", p3: "Reject", p4: "Approve" },
  },
];
/* ---------------------------------------------
   HELPERS
--------------------------------------------- */
function getVoteResult(votes) {
  const vals = Object.values(votes || {});
  const approve = vals.filter((v) => v === "Approve").length;
  const reject = vals.filter((v) => v === "Reject").length;
  const abstain = vals.filter((v) => v === "Abstain").length;

  const status =
    approve > reject && approve > 0
      ? "Approved"
      : vals.length
        ? "Rejected"
        : "Waiting";

  return { approve, reject, abstain, status };
}

const VOTE_COLOR = {
  Approved: {
    bg: "rgba(74,222,128,0.12)",
    color: "#4ade80",
    border: "rgba(74,222,128,0.25)",
  },
  Rejected: {
    bg: "rgba(220,80,80,0.12)",
    color: "#e06060",
    border: "rgba(220,80,80,0.25)",
  },
  Waiting: {
    bg: "rgba(212,168,83,0.10)",
    color: "#D4A853",
    border: "rgba(212,168,83,0.22)",
  },
};

const CAT_STYLE = {
  MCA: {
    bg: "rgba(80,140,220,0.15)",
    color: "#6aaaee",
    border: "rgba(80,140,220,0.28)",
  },
  "Not MCA": {
    bg: "rgba(180,100,220,0.13)",
    color: "#c47ae8",
    border: "rgba(180,100,220,0.25)",
  },
};

const StatusPill = ({ status }) => {
  const map = {
    Completed: {
      bg: "rgba(77,184,150,0.12)",
      color: "#4db896",
      border: "rgba(77,184,150,0.25)",
    },
    Scheduled: {
      bg: "rgba(212,168,83,0.12)",
      color: "#D4A853",
      border: "rgba(212,168,83,0.25)",
    },
  };

  const s = map[status] || map.Completed;

  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 800,
        padding: "3px 9px",
        borderRadius: 999,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        letterSpacing: "0.08em",
        width: "fit-content",
      }}
    >
      {status.toUpperCase()}
    </span>
  );
};

const Avatar = ({ person, vote }) => {
  const voteColor =
    vote === "Approve"
      ? "#4ade80"
      : vote === "Reject"
        ? "#e06060"
        : vote === "Abstain"
          ? "#D4A853"
          : "rgba(255,255,255,0.12)";

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: person.color,
          border: `2px solid ${voteColor}`,
          display: "grid",
          placeItems: "center",
          color: "#fff",
          fontSize: 10,
          fontWeight: 800,
        }}
      >
        {person.initials}
      </div>

      {vote && (
        <div
          style={{
            position: "absolute",
            bottom: -2,
            right: -2,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: voteColor,
            display: "grid",
            placeItems: "center",
            fontSize: 6,
            color:
              vote === "Approve"
                ? "#052010"
                : vote === "Reject"
                  ? "#200505"
                  : "#201005",
            fontWeight: 900,
          }}
        >
          {vote === "Approve" ? <FaCheck /> : vote === "Reject" ? <FaTimes /> : ""}
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------
   CIRCULAR FORM
--------------------------------------------- */
function CircularForm({ onSave, onCancel, theme, initialData }) {
  const [form, setForm] = useState(
    initialData || {
      title: "",
      description: "",
      categoryType: "MCA",
      date: "",
      time: "",
      status: "Scheduled",
      referenceNo: "",
      issuedBy: "",
    }
  );
  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <div style={{ background: "#090c22", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
      <div style={{ color: "#f4f0ff", fontSize: 18, fontWeight: 800, marginBottom: 20 }}>
        {initialData ? "Edit Circular" : "Add Circular"}
      </div>
      <div style={{ display: "grid", gap: 14 }}>
        {[["Title", "title"], ["Date", "date"], ["Time", "time"]].map(([label, key]) => (
          <div key={key}>
            <div style={{ color: "#596197", fontSize: 11, marginBottom: 6 }}>{label}</div>
            <input
              value={form[key]}
              onChange={(e) => update(key, e.target.value)}
              style={{ width: "100%", background: "#07091a", border: "1px solid rgba(255,255,255,0.08)", color: "#f4f0ff", borderRadius: 10, padding: "12px 14px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        ))}
        <div>
          <div style={{ color: "#596197", fontSize: 11, marginBottom: 6 }}>Description</div>
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            style={{ width: "100%", background: "#07091a", border: "1px solid rgba(255,255,255,0.08)", color: "#f4f0ff", borderRadius: 10, padding: "12px 14px", outline: "none", resize: "vertical", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <select value={form.categoryType} onChange={(e) => update("categoryType", e.target.value)}
            style={{ flex: 1, background: "#07091a", border: "1px solid rgba(255,255,255,0.08)", color: "#f4f0ff", borderRadius: 10, padding: "12px 14px", outline: "none" }}>
            <option>MCA</option>
            <option>Not MCA</option>
          </select>
          <select value={form.status} onChange={(e) => update("status", e.target.value)}
            style={{ flex: 1, background: "#07091a", border: "1px solid rgba(255,255,255,0.08)", color: "#f4f0ff", borderRadius: 10, padding: "12px 14px", outline: "none" }}>
            <option>Scheduled</option>
            <option>Completed</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <button onClick={() => onSave(form)}
            style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80", padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <FaSave /> Save
          </button>
          <button onClick={onCancel}
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#7a83b8", padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontWeight: 700 }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   CIRCULAR CARD
--------------------------------------------- */
function CircularCard({ circular, onEdit, theme, onDelete }) {
  const cs = CAT_STYLE[circular.categoryType] || CAT_STYLE["MCA"];
  return (
    <div style={{ border: "1.5px solid rgba(100,160,255,0.18)", borderRadius: 16, background: "#090c20", overflow: "hidden" }}>
      <div style={{ padding: "18px 20px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, marginBottom: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{ color: "#f4f0ff", fontSize: 17, fontWeight: 800 }}>{circular.title}</span>
              <StatusPill status={circular.status} />
            </div>
            <div style={{ color: "#596197", fontSize: 12, marginBottom: 4 }}>
              {circular.date}{circular.time ? ` · ${circular.time}` : ""}
            </div>
            {/* {circular.referenceNo && (
              <div style={{ color: "#596197", fontSize: 11 }}>Ref: {circular.referenceNo}</div>
            )}
            {circular.issuedBy && (
              <div style={{ color: "#596197", fontSize: 11, marginTop: 2 }}>Issued by: {circular.issuedBy}</div>
            )} */}
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999, background: cs.bg, color: cs.color, border: `1px solid ${cs.border}`, width: "fit-content" }}>
              {circular.categoryType}
            </span>
            <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999, background: "rgba(100,160,255,0.12)", color: "#6aaaff", border: "1px solid rgba(100,160,255,0.25)", width: "fit-content" }}>
              CIRCULAR
            </span>
            <button onClick={onEdit}
              style={{ width: 32, height: 32, borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#D4A853", cursor: "pointer" }}>
              <FaEdit />
            </button>
            <button onClick={onDelete}
              style={{ width: 32, height: 32, borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#e06060", cursor: "pointer" }}>
              <FaTrash />
            </button>
          </div>
        </div>
        {/* Description */}
        <div>
          <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: 2, marginBottom: 6, fontWeight: 700 }}>CIRCULAR TEXT</div>
          <div style={{ color: "#7a83b8", fontSize: 13, lineHeight: 1.85, background: "#080b1d", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "12px 14px" }}>
            {circular.description || <span style={{ color: "#3d4570", fontStyle: "italic" }}>No description provided.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   RESOLUTION FORM
--------------------------------------------- */
function ResolutionForm({ onSave, onCancel, theme, initialData }) {
  const [form, setForm] = useState(
    initialData || {
      title: "",
      description: "",
      categoryType: "MCA",
      meetingTitle: "",
      agendaTitle: "",
      date: "",
      time: "",
      status: "Completed",
      votes: { p1: "Approve", p2: "Approve", p3: "Approve", p4: "Approve" },
    }
  );
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div style={{ background: "#090c22", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
      <div style={{ color: "#f4f0ff", fontSize: 18, fontWeight: 800, marginBottom: 20 }}>
        Edit Resolution
      </div>
      <div style={{ display: "grid", gap: 14 }}>
        {[["Title", "title"], ["Date", "date"], ["Time", "time"]].map(([label, key]) => (
          <div key={key}>
            <div style={{ color: "#596197", fontSize: 11, marginBottom: 6 }}>{label}</div>
            <input
              value={form[key]}
              onChange={(e) => update(key, e.target.value)}
              style={{ width: "100%", background: "#07091a", border: "1px solid rgba(255,255,255,0.08)", color: "#f4f0ff", borderRadius: 10, padding: "12px 14px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        ))}
        <div>
          <div style={{ color: "#596197", fontSize: 11, marginBottom: 6 }}>Description</div>
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            style={{ width: "100%", background: "#07091a", border: "1px solid rgba(255,255,255,0.08)", color: "#f4f0ff", borderRadius: 10, padding: "12px 14px", outline: "none", resize: "vertical", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <select value={form.categoryType} onChange={(e) => update("categoryType", e.target.value)}
            style={{ flex: 1, background: "#07091a", border: "1px solid rgba(255,255,255,0.08)", color: "#f4f0ff", borderRadius: 10, padding: "12px 14px", outline: "none" }}>
            <option>MCA</option>
            <option>Not MCA</option>
          </select>
          <select value={form.status} onChange={(e) => update("status", e.target.value)}
            style={{ flex: 1, background: "#07091a", border: "1px solid rgba(255,255,255,0.08)", color: "#f4f0ff", borderRadius: 10, padding: "12px 14px", outline: "none" }}>
            <option>Completed</option>
            <option>Scheduled</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <button onClick={() => onSave(form)}
            style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80", padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <FaSave /> Save
          </button>
          <button onClick={onCancel}
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#7a83b8", padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontWeight: 700 }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   RESOLUTION CARD
--------------------------------------------- */
function ResolutionCard({
  resolution,
  participants,
  theme,
  onEdit,
  onDelete,
}) {
  const [expanded, setExpanded] = useState(false);
  const result = getVoteResult(resolution.votes);
  const vs = VOTE_COLOR[result.status];
  const cs = CAT_STYLE[resolution.categoryType];
  const total = participants.length;
  const approvePct = total > 0 ? Math.round((result.approve / total) * 100) : 0;

  return (
    <div style={{ border: "1.5px solid rgba(74,222,128,0.18)", borderRadius: 16, background: "#090c20", overflow: "hidden" }}>
      <div style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, marginBottom: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{ color: "#f4f0ff", fontSize: 17, fontWeight: 800 }}>{resolution.title}</span>
              <StatusPill status={resolution.status} />
            </div>
            <div style={{ color: "#596197", fontSize: 12, marginBottom: 4 }}>
              {resolution.meetingTitle} · {resolution.date} · {resolution.time}
            </div>
            <div style={{ color: "#596197", fontSize: 11 }}>{resolution.agendaTitle}</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999, background: cs.bg, color: cs.color, border: `1px solid ${cs.border}`, width: "fit-content" }}>
              {resolution.categoryType}
            </span>
            <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999, background: vs.bg, color: vs.color, border: `1px solid ${vs.border}`, width: "fit-content" }}>
              {result.status}
            </span>
            <button onClick={onEdit}
              style={{ width: 32, height: 32, borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#D4A853", cursor: "pointer" }}>
              <FaEdit />
            </button>
            <button onClick={onDelete}
              style={{ width: 32, height: 32, borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#e06060", cursor: "pointer" }}>
              <FaTrash />
            </button>
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: 2, marginBottom: 6, fontWeight: 700 }}>RESOLUTION TEXT</div>
          <div style={{ color: "#7a83b8", fontSize: 13, lineHeight: 1.85, background: "#080b1d", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "12px 14px" }}>
            {resolution.description}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: "#4e568e", fontSize: 10, fontWeight: 700, letterSpacing: 2 }}>VOTING RESULT</span>
            <span style={{ color: "#4ade80", fontSize: 11, fontWeight: 800 }}>{approvePct}% Approved</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${approvePct}%`, background: "linear-gradient(90deg,#4ade80,#22d3ee)" }} />
          </div>
        </div>
        <button onClick={() => setExpanded((e) => !e)}
          style={{ fontSize: 11, padding: "6px 14px", borderRadius: 8, cursor: "pointer", border: "1px solid rgba(255,255,255,0.10)", color: "#596197", background: "transparent", fontWeight: 600 }}>
          {expanded ? "Hide" : "Show"} Member Votes
        </button>
      </div>
      {expanded && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "#07091a", padding: "16px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {participants.map((person) => {
              const vote = resolution.votes?.[person.id];
              return (
                <div key={person.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar person={person} vote={vote} />
                    <div>
                      <div style={{ color: "#f4f0ff", fontWeight: 700, fontSize: 13 }}>{person.name}</div>
                      <div style={{ color: "#596197", fontSize: 11 }}>{person.role}</div>
                    </div>
                  </div>
                  <span style={{ color: "#4ade80", fontSize: 11, fontWeight: 800 }}>{vote}</span>
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
   ROOT
--------------------------------------------- */
export default function MeetingResolutions() {
  // -- Resolutions state --
  const [resolutions, setResolutions] = useState(INITIAL_RESOLUTIONS);
  const [selectedResId, setSelectedResId] = useState(INITIAL_RESOLUTIONS[0]?.id);
  const [editingResolution, setEditingResolution] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const theme = darkMode
    ? {
      page: "#050816",
      card: "#090c22",
      card2: "#0b0f26",
      panel: "#080b1d",
      border: "rgba(255,255,255,0.07)",
      text: "#f4f0ff",
      textSecondary: "#7a83b8",
      textMuted: "#596197",
    }
    : {
      page: "#f5f7fc",
      card: "#ffffff",
      card2: "#f8faff",
      panel: "#f1f5fb",
      border: "rgba(0,0,0,0.08)",
      text: "#172033",
      textSecondary: "#475569",
      textMuted: "#64748b",
    };
  // -- Circulars state --
  const [circulars, setCirculars] = useState(INITIAL_CIRCULARS);
  const [selectedCircId, setSelectedCircId] = useState(INITIAL_CIRCULARS[0]?.id);

  const [showCircularForm, setShowCircularForm] = useState(false);
  const [editingCircular, setEditingCircular] = useState(null);

  // -- Page: "resolutions" | "circulars" --
  const [page, setPage] = useState("resolutions");

  const selectedResolution = useMemo(() => resolutions.find((r) => r.id === selectedResId), [resolutions, selectedResId]);
  const selectedCircular = useMemo(() => circulars.find((c) => c.id === selectedCircId), [circulars, selectedCircId]);

  // Resolution actions
  const updateResolution = (data) => {
    setResolutions((prev) => prev.map((item) => item.id === editingResolution.id ? { ...item, ...data } : item));
    setEditingResolution(null);
  };
  const removeResolution = (id) => {
    const filtered = resolutions.filter((item) => item.id !== id);
    setResolutions(filtered);
    setSelectedResId(filtered[0]?.id || null);
  };

  // Circular actions
  const addCircular = (data) => {
    const newItem = { ...data, id: Date.now().toString() };
    setCirculars((prev) => [newItem, ...prev]);
    setSelectedCircId(newItem.id);
    setShowCircularForm(false);
    setEditingCircular(null);
    setPage("circulars");
  };
  const updateCircular = (data) => {
    setCirculars((prev) => prev.map((item) => item.id === editingCircular.id ? { ...item, ...data } : item));
    setEditingCircular(null);
  };
  const removeCircular = (id) => {
    const filtered = circulars.filter((item) => item.id !== id);
    setCirculars(filtered);
    setSelectedCircId(filtered[0]?.id || null);
  };

  const TAB_STYLE = (active) => ({
    padding: "8px 20px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
    border: active ? "1.5px solid rgba(212,168,83,0.40)" : "1.5px solid rgba(255,255,255,0.07)",
    background: active ? "rgba(212,168,83,0.10)" : "transparent",
    color: active ? "#D4A853" : "#596197",
    transition: "all 0.18s",
  });

  return (
    <div
      className={`meeting-page ${darkMode ? "theme-dark" : "theme-light"}`}
      style={{
        background: theme.page,
        minHeight: "100vh",
        transition: "all .25s ease",
      }}
    >
      {/* Top nav tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={TAB_STYLE(page === "resolutions")}
            onClick={() => {
              setPage("resolutions");
              setEditingResolution(null);
            }}
          >
            Resolutions
            <span className="count-badge">{resolutions.length}</span>
          </button>

          <button
            style={TAB_STYLE(page === "circulars")}
            onClick={() => {
              setPage("circulars");
              setShowCircularForm(false);
              setEditingCircular(null);
            }}
          >
            Circulars
            <span className="count-badge">{circulars.length}</span>
          </button>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setDarkMode((p) => !p)}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 700,
              border: `1px solid ${theme.border}`,
              background: theme.card,
              color: theme.text,
            }}
          >
            {darkMode ? "Light" : "Dark"}
          </button>

          <button
            onClick={() => {
              setPage("circulars");
              setShowCircularForm(true);
              setEditingCircular(null);
              setSelectedCircId(null);
            }}
            className="add-circular-btn"
          >
            <div className="add-circle">
              <FaPlus />
            </div>
            Add Circular
          </button>
        </div>
      </div>

      {/* --- RESOLUTIONS PAGE --- */}
      {page === "resolutions" && (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          {/* Left panel */}
          <div style={{
            width: 300, flexShrink: 0, background: theme.card,
            border: `1px solid ${theme.border}`, borderRadius: 16, overflow: "hidden", position: "sticky", top: 0, maxHeight: "calc(100vh - 120px)", overflowY: "auto"
          }}>
            <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <h2 style={{ color: "#f4f0ff", fontSize: 18, fontWeight: 800, margin: "0 0 4px" }}>Resolution List</h2>
              <p style={{ color: "#596197", fontSize: 12, margin: 0 }}>Select a resolution to view full details</p>
            </div>
            <div style={{ padding: 10 }}>
              {resolutions.map((item) => {
                const isActive = item.id === selectedResId;
                const result = getVoteResult(item.votes);
                return (
                  <button key={item.id}
                    onClick={() => { setSelectedResId(item.id); setEditingResolution(null); }}
                    style={{ width: "100%", textAlign: "left", padding: "14px 14px", marginBottom: 10, borderRadius: 14, cursor: "pointer", border: isActive ? "1.5px solid rgba(212,168,83,0.35)" : "1.5px solid rgba(255,255,255,0.06)", background: isActive ? "rgba(212,168,83,0.08)" : "#0b0f26" }}>
                    <div style={{ color: "#f4f0ff", fontSize: 13, fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}>{item.title}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                      <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 999, background: CAT_STYLE[item.categoryType].bg, color: CAT_STYLE[item.categoryType].color, border: `1px solid ${CAT_STYLE[item.categoryType].border}` }}>{item.categoryType}</span>
                      <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 999, background: VOTE_COLOR[result.status].bg, color: VOTE_COLOR[result.status].color, border: `1px solid ${VOTE_COLOR[result.status].border}` }}>{result.status}</span>
                    </div>
                    <div style={{ color: "#596197", fontSize: 11 }}>{item.meetingTitle}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {editingResolution ? (
              <ResolutionForm
                initialData={editingResolution}
                theme={theme}
                onSave={updateResolution}
                onCancel={() => setEditingResolution(null)}
              />
            ) : (
              selectedResolution && (
                <ResolutionCard
                  resolution={selectedResolution}
                  participants={PARTICIPANTS}
                  theme={theme}
                  onEdit={() => setEditingResolution(selectedResolution)}
                  onDelete={() => removeResolution(selectedResolution.id)}
                />
              )
            )}
          </div>
        </div>
      )}

      {/* --- CIRCULARS PAGE --- */}
      {page === "circulars" && (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          {/* Left panel */}
          <div style={{ width: 300, flexShrink: 0, background: "#090c22", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden", position: "sticky", top: 0, maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
            <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <h2 style={{ color: "#f4f0ff", fontSize: 18, fontWeight: 800, margin: "0 0 4px" }}>Circular List</h2>
              <p style={{ color: "#596197", fontSize: 12, margin: 0 }}>Select a circular to view details</p>
            </div>
            <div style={{ padding: 10 }}>
              {circulars.length === 0 && (
                <div style={{ color: "#3d4570", fontSize: 12, textAlign: "center", padding: "32px 16px" }}>No circulars yet. Add one above.</div>
              )}
              {circulars.map((item) => {
                const isActive = item.id === selectedCircId;
                const cs = CAT_STYLE[item.categoryType] || CAT_STYLE["MCA"];
                return (
                  <button key={item.id}
                    onClick={() => { setSelectedCircId(item.id); setShowCircularForm(false); setEditingCircular(null); }}
                    style={{ width: "100%", textAlign: "left", padding: "14px 14px", marginBottom: 10, borderRadius: 14, cursor: "pointer", border: isActive ? "1.5px solid rgba(100,160,255,0.35)" : "1.5px solid rgba(255,255,255,0.06)", background: isActive ? "rgba(100,160,255,0.07)" : "#0b0f26" }}>
                    <div style={{ color: "#f4f0ff", fontSize: 13, fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}>{item.title}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                      <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 999, background: cs.bg, color: cs.color, border: `1px solid ${cs.border}` }}>{item.categoryType}</span>
                      <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 999, background: "rgba(100,160,255,0.12)", color: "#6aaaff", border: "1px solid rgba(100,160,255,0.22)" }}>CIRCULAR</span>
                    </div>
                    <div style={{ color: "#596197", fontSize: 11 }}>{item.date}{item.referenceNo ? ` · ${item.referenceNo}` : ""}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {showCircularForm ? (
              <CircularForm
                theme={theme}
                onSave={addCircular}
                onCancel={() => setShowCircularForm(false)}
              />
            ) : editingCircular ? (
              <CircularForm initialData={editingCircular} onSave={updateCircular} onCancel={() => setEditingCircular(null)} />
            ) : selectedCircular ? (
              <CircularCard
                circular={selectedCircular}
                theme={theme}
                onEdit={() => {
                  setEditingCircular(selectedCircular);
                }}
                onDelete={() => removeCircular(selectedCircular.id)}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "80px 32px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, background: "#090c22", color: "#3d4570" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}></div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#596197" }}>Add a circular using the button above</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

