import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaFile, FaUser } from "react-icons/fa";
import "./ViewMeeting.css"



/* ---------------------------------------------
   STATIC DATA
--------------------------------------------- */
const PARTICIPANTS = [
  { id: "p1", name: "Arjun Mehta", role: "Chairman", color: "#3b4fa8", initials: "AM" },
  { id: "p2", name: "Priya Sharma", role: "Managing Director", color: "#a8503b", initials: "PS" },
  { id: "p3", name: "Rahul Nair", role: "CFO", color: "#3ba872", initials: "RN" },
  { id: "p4", name: "Divya Kapoor", role: "Company Secretary", color: "#8e3ba8", initials: "DK" },
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
    moms: [
      {
        id: "mom-1a",
        title: "Q1 Financial Review  Minutes",
        description: "Reviewed Q1 revenue figures. Board approved budget reallocation of 2.4 Cr to marketing. CFO to present revised forecast by April 10.",
        createdAt: "15 Mar 2025, 11:42 AM",
        agendaSummary: [
          { title: "Financial Performance Review", note: "Revenue up 18% YoY. EBITDA margin improved to 22%." },
          { title: "Budget Reallocation", note: "Marketing budget increased from 1.8 Cr to 2.4 Cr." },
        ],
      },
      {
        id: "mom-1b",
        title: "Strategy Alignment  Minutes",
        description: "Discussed entering Southeast Asian markets. Approved preliminary feasibility study. MD to lead the initiative.",
        createdAt: "15 Mar 2025, 12:30 PM",
        agendaSummary: [
          { title: "Market Expansion", note: "SEA market entry proposed. Feasibility study budget: 15 L." },
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
    moms: [
      {
        id: "mom-2a",
        title: "Internal Audit Findings  Minutes",
        description: "Internal audit report for FY24-25 presented. Three high-priority findings raised. Management responses due within 30 days.",
        createdAt: "02 Apr 2025, 04:15 PM",
        agendaSummary: [
          { title: "Audit Report Review", note: "3 high-priority, 7 medium-priority findings." },
          { title: "Management Response Timeline", note: "Responses due by 02 May 2025." },
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
    moms: [
      {
        id: "mom-3a",
        title: "AGM Pre-Meeting Notes",
        description: "Shareholder agenda circulated. Proxy forms collected from 142 shareholders. Final agenda approved by Company Secretary.",
        createdAt: "18 May 2025, 02:00 PM",
        agendaSummary: [
          { title: "Shareholder Communication", note: "Notices sent to 380 shareholders." },
          { title: "Proxy Collection", note: "142 proxies received and verified." },
        ],
      },
    ],
  },
];

/* ---------------------------------------------
   HELPERS
--------------------------------------------- */
const Avatar = ({ person, size = 36, hasAcked = false }) => (
  <div style={{ position: "relative", flexShrink: 0 }}>
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: person.color,
      border: hasAcked ? "2px solid #4db896" : "2px solid rgba(255,255,255,0.10)",
      display: "grid", placeItems: "center",
      color: "#fff", fontSize: size * 0.33, fontWeight: 800,
      fontFamily: "'DM Mono', monospace",
      transition: "border-color 0.2s",
    }}>
      {person.initials}
    </div>
    {hasAcked && (
      <div style={{
        position: "absolute", bottom: -2, right: -2,
        width: 14, height: 14, borderRadius: "50%",
        background: "#4db896", display: "grid", placeItems: "center",
        fontSize: 7, color: "#fff", fontWeight: 900,
      }}></div>
    )}
  </div>
);

const StatusPill = ({ status }) => {
  const map = {
    Completed: { bg: "rgba(77,184,150,0.12)", color: "#4db896", border: "rgba(77,184,150,0.25)" },
    Scheduled: { bg: "rgba(212,168,83,0.12)", color: "#D4A853", border: "rgba(212,168,83,0.25)" },
    Cancelled: { bg: "rgba(220,80,80,0.12)", color: "#e06060", border: "rgba(220,80,80,0.25)" },
  };
  const s = map[status] || map.Scheduled;
  return (
    <span style={{
      fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace",
    }}>
      {status.toUpperCase()}
    </span>
  );
};

/* ---------------------------------------------
   MEETING LIST
--------------------------------------------- */
function MeetingList({ meetings, onSelect, darkMode }) {
  const companies = ["All", ...Array.from(new Set(meetings.map((m) => m.company).filter(Boolean)))];
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? meetings : meetings.filter((m) => m.company === active);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: darkMode ? "#f4f0ff" : "#111827", fontSize: 20, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.01em" }}>
          Meeting List
        </h2>
        <p style={{ color: darkMode ? "#596197" : "#6b7280", fontSize: 13, margin: 0 }}>
          Select a meeting to view its Minutes of Meeting and acknowledgements
        </p>
      </div>

      {/* Company filter tabs */}
      {/* {companies.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {companies.map((co) => {
            const isActive = active === co;
            const count = co === "All" ? meetings.length : meetings.filter((m) => m.company === co).length;
            return (
              <button
                key={co}
                onClick={() => setActive(co)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "6px 14px", borderRadius: 999, cursor: "pointer",
                  border: isActive ? "1.5px solid #D4A853" : "1.5px solid rgba(255,255,255,0.08)",
                  background: isActive ? "rgba(212,168,83,0.12)" : "rgba(255,255,255,0.03)",
                  color: isActive ? "#D4A853" : "#596197",
                  fontSize: 12, fontWeight: isActive ? 700 : 500,
                  transition: "all 0.18s ease",
                }}
              >
                {co !== "All" && (
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: isActive ? "#D4A853" : "#596197" }} />
                )}
                {co}
                <span style={{
                  background: isActive ? "rgba(212,168,83,0.18)" : "rgba(255,255,255,0.06)",
                  color: isActive ? "#D4A853" : "#7a83b8",
                  borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 700,
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )} */}

      {/* Meeting cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 20px", borderRadius: 16, cursor: "pointer",
              border: "1.5px solid rgba(255,255,255,0.07)",
              background: darkMode ? "#090c22" : "#ffffff",
              textAlign: "left", width: "100%",
              transition: "all 0.18s ease",
              gap: 16,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(212,168,83,0.35)";
              e.currentTarget.style.background = "#0c1028";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              e.currentTarget.style.background = "#090c22";
            }}
          >
            {/* Left: info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                <span style={{ color: darkMode ? "#f4f0ff" : "#111827", fontSize: 15, fontWeight: 700 }}>{item.title}</span>
                <StatusPill status={item.status} />
              </div>
              <div style={{ color: darkMode ? "#596197" : "#6b7280", fontSize: 12, marginBottom: 6 }}>
                {item.type} &nbsp;·&nbsp; {item.date} &nbsp;·&nbsp; {item.time}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ color: "#3d4570", fontSize: 11 }}> {item.location}</span>
                {item.company && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.18)",
                    color: "#D4A853", fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 999,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#D4A853" }} />
                    {item.company}
                  </span>
                )}
              </div>
            </div>

            {/* Right: MOM count + arrow */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#D4A853", fontSize: 20, fontWeight: 800, lineHeight: 1 }}>
                  {item.moms.length}
                </div>
                <div style={{ color: darkMode ? "#596197" : "#6b7280", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" }}>
                  MOM{item.moms.length !== 1 ? "S" : ""}
                </div>
              </div>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: "rgba(212,168,83,0.10)", color: "#D4A853",
                display: "grid", placeItems: "center", fontSize: 14, fontWeight: 900,
              }}><FaArrowRight /></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------
   MOM CARD
--------------------------------------------- */
function MOMCard({ mom, darkMode }) {
  return (
    <div style={{
      border: "1.5px solid rgba(255,255,255,0.08)",
      borderRadius: 18, background: darkMode ? "#090c20" : "#ffffff", overflow: "hidden",
    }}>
      <div style={{ padding: "20px 22px 22px" }}>
        {/* MOM Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "rgba(212,168,83,0.12)", color: "#d4a853",
            display: "grid", placeItems: "center", fontSize: 13,
          }}>
            <FaFile />
          </div>
          <div>
            <div style={{ color: "#d4a853", fontSize: 10, fontWeight: 800, letterSpacing: 1.5 }}>MOM RECORD</div>
            <div style={{ color: darkMode ? "#596197" : "#6b7280", fontSize: 11, marginTop: 1 }}>{mom.createdAt}</div>
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: 2, marginBottom: 5, fontWeight: 700 }}>TITLE</div>
          <div style={{ color: "#2d346eff", fontSize: 15, fontWeight: 700, lineHeight: 1.5 }}>{mom.title}</div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: mom.agendaSummary?.length ? 14 : 0 }}>
          <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: 2, marginBottom: 5, fontWeight: 700 }}>DESCRIPTION</div>
          <div style={{ color: "#7a83b8", fontSize: 13, lineHeight: 1.8 }}>{mom.description}</div>
        </div>

        {/* Agenda summary */}
        {mom.agendaSummary?.length > 0 && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: 2, marginBottom: 8, fontWeight: 700 }}>AGENDA NOTES</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {mom.agendaSummary.map((item, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ color: "#D4A853", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ color: darkMode ? "#596197" : "#6b7280", fontSize: 12, lineHeight: 1.6 }}>{item.note}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
/* ---------------------------------------------
   MEETING MOM VIEW
--------------------------------------------- */
function MeetingMOMView({
  meeting,
  participants,
  onBack,
  darkMode,
}) {
  const [allAcked, setAllAcked] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const totalPossible = meeting.moms.length * participants.length;

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {/* Back button + heading */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, gap: 16, flexWrap: "wrap" }}>
        <div>
          <button
            onClick={onBack}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "transparent", border: "1px solid rgba(255,255,255,0.10)",
              color: "#7a83b8", fontSize: 12, padding: "6px 14px", borderRadius: 8,
              cursor: "pointer", marginBottom: 14, fontWeight: 600,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,168,83,0.35)"; e.currentTarget.style.color = "#D4A853"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.color = "#7a83b8"; }}
          >
            <FaArrowLeft /> Meeting List
          </button>
          <h2 style={{ color: darkMode ? "#f4f0ff" : "#111827", fontSize: 20, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.01em" }}>
            {meeting.title}
          </h2>
          <div style={{ color: darkMode ? "#596197" : "#6b7280", fontSize: 12 }}>
            {meeting.type} &nbsp;·&nbsp; {meeting.date} &nbsp;·&nbsp; {meeting.time} &nbsp;·&nbsp; {meeting.location}
          </div>
        </div>

        {/* Progress summary + Ack btn + Members toggle */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
          background: darkMode ? "#090c22" : "#ffffff", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, padding: "12px 14px",
        }}>
          {/* Total acks badge */}
          <div style={{ textAlign: "center", minWidth: 48 }}>
            <div style={{ color: allAcked ? "#4db896" : "#D4A853", fontSize: 22, fontWeight: 800, lineHeight: 1 }}>
              {allAcked ? totalPossible : 0}/{totalPossible}
            </div>
            <div style={{ color: darkMode ? "#596197" : "#6b7280", fontSize: 10, fontWeight: 700, marginTop: 2, letterSpacing: "0.08em" }}>
              TOTAL ACKS
            </div>
          </div>

          <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.06)" }} />

          {/* MOMs count */}
          <div style={{ textAlign: "center", minWidth: 36 }}>
            <div style={{ color: darkMode ? "#f4f0ff" : "#111827", fontSize: 22, fontWeight: 800, lineHeight: 1 }}>
              {meeting.moms.length}
            </div>
            <div style={{ color: darkMode ? "#596197" : "#6b7280", fontSize: 10, fontWeight: 700, marginTop: 2, letterSpacing: "0.08em" }}>
              MOM{meeting.moms.length !== 1 ? "S" : ""}
            </div>
          </div>

          <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.06)" }} />

          {/* Acknowledge All btn */}
          {!allAcked ? (
            <button
              onClick={() => setAllAcked(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "8px 16px", borderRadius: 10, cursor: "pointer",
                border: "1.5px solid rgba(77,184,150,0.35)",
                background: "rgba(77,184,150,0.08)", color: "#4db896",
                fontSize: 12, fontWeight: 800, whiteSpace: "nowrap",
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(77,184,150,0.16)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(77,184,150,0.08)"; }}
            >
              Acknowledge
            </button>
          ) : (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "8px 16px", borderRadius: 10,
              border: "1.5px solid rgba(77,184,150,0.25)",
              background: "rgba(77,184,150,0.07)", color: "#4db896",
              fontSize: 12, fontWeight: 800, whiteSpace: "nowrap",
            }}>
              Acknowledged
            </div>
          )}

          {/* Members toggle icon */}
          <button
            onClick={() => setShowMembers((s) => !s)}
            title="View members"
            style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              border: showMembers ? "1.5px solid rgba(212,168,83,0.40)" : "1.5px solid rgba(255,255,255,0.10)",
              background: showMembers ? "rgba(212,168,83,0.10)" : "rgba(255,255,255,0.03)",
              color: showMembers ? "#D4A853" : "#596197",
              cursor: "pointer", fontSize: 15, display: "grid", placeItems: "center",
              transition: "all 0.18s",
            }}
          >
            <FaUser />
          </button>
        </div>
      </div>

      {/* Members panel  hidden by default */}
      {showMembers && (
        <div style={{
          marginBottom: 18,
          background: darkMode ? "#090c22" : "#ffffff",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, padding: "14px 18px",
          display: "flex", flexWrap: "wrap", gap: 10,
        }}>
          {participants.map((person) => (
            <div
              key={person.id}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 10, padding: "8px 14px",
              }}
            >
              <Avatar person={person} size={28} />
              <div>
                <div style={{ color: darkMode ? "#f4f0ff" : "#111827", fontSize: 12, fontWeight: 700 }}>{person.name}</div>
                <div style={{ color: darkMode ? "#596197" : "#6b7280", fontSize: 10 }}>{person.role}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MOM cards */}
      {meeting.moms.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "64px 32px",
          border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18,
          background: darkMode ? "#090c22" : "#ffffff", color: "#3d4570",
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}></div>
          <div style={{ fontSize: 14, fontWeight: 700, color: darkMode ? "#596197" : "#6b7280" }}>No MOMs recorded for this meeting</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {meeting.moms.map((mom) => (
            <MOMCard key={mom.id} mom={mom} darkMode={darkMode} />
          ))}
        </div>
      )}
    </div>
  );
}
/* ---------------------------------------------
   ROOT EXPORT
--------------------------------------------- */
export default function MeetingListWithMOM() {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`meeting-container ${darkMode ? "dark-theme" : "light-theme"}`}>
      <div style={{ width: "100%" }}>
        <button
          className="theme-toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {selectedMeeting ? (
          <MeetingMOMView
            meeting={selectedMeeting}
            participants={PARTICIPANTS}
            onBack={() => setSelectedMeeting(null)}
            darkMode={darkMode}
          />
        ) : (
          <MeetingList
            meetings={MEETINGS}
            onSelect={setSelectedMeeting}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
}