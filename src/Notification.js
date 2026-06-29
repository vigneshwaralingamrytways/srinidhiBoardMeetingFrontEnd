import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { DATA } from "./MeetingData";
import {
  FaPaperPlane, FaCheck, FaRedo, FaUser, FaTimes, FaSearch,
  FaCalendarAlt, FaMapMarkerAlt, FaClock, FaBuilding,
} from "react-icons/fa";


// Resend
function ResendModal({ meeting, participants, onClose, onConfirm }) {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const filtered = participants.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.role || "").toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) =>
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );

  const selectAll = () => setSelected(filtered.map((p) => p.id));
  const clearAll = () => setSelected([]);

  const handleSend = () => {
    if (!selected.length) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setDone(true);
      setTimeout(() => {
        onConfirm(selected);
        onClose();
      }, 1400);
    }, 1800);
  };

  return createPortal(
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(4,6,20,0.88)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#0b0e22",
          border: "1px solid rgba(212,168,83,0.18)",
          borderRadius: 20,
          width: "min(520px, 92vw)",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14,
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "#D4A853", marginBottom: 4, textTransform: "uppercase" }}>
              Resend Invite
            </div>
            <div style={{ color: "#f4f0ff", fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{meeting.title}</div>
            <div style={{ color: "#596197", fontSize: 12, marginTop: 3 }}>
              {meeting.date} &nbsp;·&nbsp; {meeting.time || "09:00 AM"}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#596197", cursor: "pointer", padding: 4, flexShrink: 0, fontSize: 14, display: "grid", placeItems: "center" }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Search + select controls */}
        <div style={{ padding: "14px 24px 10px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ position: "relative", marginBottom: 10 }}>
            <FaSearch style={{
              position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
              color: "#4e568e", fontSize: 11, pointerEvents: "none",
            }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search participants"
              style={{
                width: "100%", padding: "9px 12px 9px 32px",
                background: "#080b1d", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10, color: "#f4f0ff", fontSize: 12,
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ color: "#4e568e", fontSize: 11, flex: 1 }}>
              {selected.length} of {participants.length} selected
            </span>
            <button
              onClick={selectAll}
              style={{ background: "none", border: "none", color: "#D4A853", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "3px 8px" }}
            >
              Select All
            </button>
            <button
              onClick={clearAll}
              style={{ background: "none", border: "none", color: "#596197", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: "3px 8px" }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Participant list */}
        <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "rgba(212,168,83,0.2) transparent" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "32px 24px", textAlign: "center", color: "#3d4570", fontSize: 13 }}>
              No participants found
            </div>
          ) : (
            filtered.map((person, idx) => {
              const isSelected = selected.includes(person.id);
              return (
                <div
                  key={person.id}
                  onClick={() => toggle(person.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 24px",
                    borderBottom: idx < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    background: isSelected ? "rgba(212,168,83,0.05)" : "transparent",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: person.color || "#2a3060",
                    overflow: "hidden", flexShrink: 0,
                    border: isSelected ? "2px solid #D4A853" : "2px solid rgba(255,255,255,0.08)",
                    transition: "border-color 0.15s",
                  }}>
                    <img
                      src={person.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=0D1117&color=fff`}
                      alt={person.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: isSelected ? "#f4f0ff" : "#c5cce8", fontWeight: 600, fontSize: 13 }}>{person.name}</div>
                    <div style={{ color: "#4e568e", fontSize: 11 }}>{person.email || person.role}</div>
                  </div>

                  {/* Checkbox */}
                  <div style={{
                    width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                    border: isSelected ? "none" : "1.5px solid rgba(255,255,255,0.15)",
                    background: isSelected ? "#D4A853" : "transparent",
                    display: "grid", placeItems: "center",
                    transition: "all 0.15s",
                  }}>
                    {isSelected && <FaCheck style={{ fontSize: 9, color: "#080b1d" }} />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 24px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10,
        }}>
          <button
            onClick={onClose}
            style={{
              padding: "9px 18px", borderRadius: 10, cursor: "pointer",
              background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
              color: "#596197", fontSize: 12, fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!selected.length || sending || done}
            style={{
              padding: "9px 22px", borderRadius: 10, cursor: selected.length && !sending && !done ? "pointer" : "not-allowed",
              background: done ? "rgba(77,184,150,0.18)" : selected.length ? "#D4A853" : "rgba(212,168,83,0.2)",
              border: done ? "1px solid rgba(77,184,150,0.35)" : "none",
              color: done ? "#4db896" : selected.length ? "#080b1d" : "#7a6030",
              fontSize: 12, fontWeight: 800, letterSpacing: "0.04em",
              display: "flex", alignItems: "center", gap: 7,
              transition: "all 0.2s",
            }}
          >
            {done ? (
              <><FaCheck style={{ fontSize: 10 }} /> Sent!</>
            ) : sending ? (
              <><SpinnerDot /> Sending</>
            ) : (
              <><FaPaperPlane style={{ fontSize: 10 }} /> Resend to {selected.length || ""} {selected.length ? `Participant${selected.length > 1 ? "s" : ""}` : "Participants"}</>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* -------------------------------------------------------------------
   TINY SPINNER
------------------------------------------------------------------- */
function SpinnerDot() {
  return (
    <span style={{
      width: 10, height: 10, borderRadius: "50%",
      border: "2px solid rgba(8,11,29,0.3)",
      borderTopColor: "#080b1d",
      display: "inline-block",
      animation: "mi-spin 0.7s linear infinite",
    }} />
  );
}

/* -------------------------------------------------------------------
   MEETING INVITE CARD
------------------------------------------------------------------- */
function MeetingInviteCard({ meeting, participants, sendState, onSend, theme }) {
  const [showResend, setShowResend] = useState(false);
  const isSending = sendState === "sending";
  const isSent = sendState === "sent";
  const isLight = theme === "light";

  const surface = isLight ? "#ECEAE4" : "#0b0e22";
  const border = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.07)";
  const textPrimary = isLight ? "#1A1714" : "#f4f0ff";
  const textMuted = isLight ? "#6A6560" : "#596197";
  const gold = isLight ? "#A0732A" : "#D4A853";
  

  const handleResendConfirm = (selectedIds) => {
    setShowResend(false);
  };

  return (
    <>
      <div style={{
        background: "#0b0e22",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "18px 20px",
        display: "flex", flexDirection: "column", gap: 14,
        transition: "border-color 0.2s, box-shadow 0.2s",
        ...(isSent ? { borderColor: "rgba(77,184,150,0.22)", boxShadow: "0 0 0 1px rgba(77,184,150,0.08)" } : {}),
      }}>

        {/* Top row: title + status badge */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#f4f0ff", fontWeight: 700, fontSize: 14, lineHeight: 1.3, marginBottom: 4 }}>
              {meeting.title}
            </div>
            {meeting.company && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.16)",
                color: "#D4A853", fontSize: 9, fontWeight: 800, letterSpacing: "0.1em",
                padding: "2px 8px", borderRadius: 999, textTransform: "uppercase",
              }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#D4A853" }} />
                {meeting.company}
              </span>
            )}
          </div>
          {isSent && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "rgba(77,184,150,0.12)", border: "1px solid rgba(77,184,150,0.25)",
              color: "#4db896", fontSize: 9, fontWeight: 800, letterSpacing: "0.1em",
              padding: "3px 10px", borderRadius: 999, flexShrink: 0,
            }}>
              <FaCheck style={{ fontSize: 8 }} /> SENT
            </span>
          )}
        </div>

        {/* Meta details */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            { icon: <FaCalendarAlt />, text: meeting.date },
            { icon: <FaClock />, text: meeting.time || "09:00 AM" },
            { icon: <FaMapMarkerAlt />, text: meeting.location },
            { icon: <FaBuilding />, text: meeting.type || "Board Meeting" },
          ].map(({ icon, text }, i) => text && (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, color: "#596197", fontSize: 11 }}>
              <span style={{ color: "#4e568e", fontSize: 10 }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>

        {/* Participant avatars */}
        {participants.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {participants.slice(0, 6).map((p, i) => (
              <div
                key={p.id}
                title={p.name}
                style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: p.color || "#2a3060",
                  border: "2px solid #0b0e22",
                  overflow: "hidden", flexShrink: 0,
                  marginLeft: i === 0 ? 0 : -8,
                }}
              >
                <img
                  src={p.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0D1117&color=fff`}
                  alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
            {participants.length > 6 && (
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: "#1a1f3d", border: "2px solid #0b0e22",
                display: "grid", placeItems: "center",
                color: "#596197", fontSize: 9, fontWeight: 700,
                marginLeft: -8, flexShrink: 0,
              }}>
                +{participants.length - 6}
              </div>
            )}
            <span style={{ color: "#4e568e", fontSize: 11, marginLeft: 10 }}>
              {participants.length} participant{participants.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Action row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, paddingTop: 4, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {isSent ? (
            <>
              <span style={{ color: "#4db896", fontSize: 11, fontWeight: 600, flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
                <FaCheck style={{ fontSize: 9 }} /> Invite sent successfully
              </span>
              <button
                onClick={() => setShowResend(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", borderRadius: 9, cursor: "pointer",
                  background: "transparent",
                  border: "1px solid rgba(212,168,83,0.3)",
                  color: "#D4A853", fontSize: 11, fontWeight: 700,
                  transition: "all 0.15s",
                }}
              >
                <FaRedo style={{ fontSize: 9 }} /> Resend
              </button>
            </>
          ) : (
            <button
              onClick={() => !isSending && onSend(meeting.id)}
              disabled={isSending}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 20px", borderRadius: 10, cursor: isSending ? "not-allowed" : "pointer",
                background: isSending ? "rgba(212,168,83,0.15)" : "#D4A853",
                border: "none",
                color: isSending ? "#7a6030" : "#080b1d",
                fontSize: 12, fontWeight: 800, letterSpacing: "0.04em",
                transition: "all 0.2s",
                minWidth: 110, justifyContent: "center",
              }}
            >
              {isSending ? (
                <><SpinnerDot /> Sending</>
              ) : (
                <><FaPaperPlane style={{ fontSize: 10 }} /> Send Invite</>
              )}
            </button>
          )}
        </div>
      </div>

      {showResend && (
        <ResendModal
          meeting={meeting}
          participants={participants}
          onClose={() => setShowResend(false)}
          onConfirm={handleResendConfirm}
        />
      )}
    </>
  );
}

/* -------------------------------------------------------------------
   MAIN COMPONENT  MeetingInvite
------------------------------------------------------------------- */
export default function MeetingInvite() {
  const meetings = DATA.meetings;
  const participants = DATA.participants;

  const [activeCompany, setActiveCompany] = useState("All");
  const [sendStates, setSendStates] = useState({});
  const [theme, setTheme] = useState("dark");

  const companies = useMemo(() => {
    const unique = [...new Set(meetings.map((m) => m.company).filter(Boolean))];
    return ["All", ...unique];
  }, [meetings]);

  const filtered = activeCompany === "All"
    ? meetings
    : meetings.filter((m) => m.company === activeCompany);

  const handleSend = (meetingId) => {
    setSendStates((cur) => ({ ...cur, [meetingId]: "sending" }));
    setTimeout(() => {
      setSendStates((cur) => ({ ...cur, [meetingId]: "sent" }));
    }, 2200);
  };

  const sentCount = Object.values(sendStates).filter((v) => v === "sent").length;

  const isLight = theme === "light";
  const bg = isLight ? "#F5F3EF" : "#080b1d";
  const surface = isLight ? "#ECEAE4" : "#0b0e22";
  const border = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.06)";
  const textPrimary = isLight ? "#1A1714" : "#f4f0ff";
  const textMuted = isLight ? "#6A6560" : "#596197";
  const gold = isLight ? "#A0732A" : "#D4A853";
  const goldBg = isLight ? "rgba(160,115,42,0.10)" : "rgba(212,168,83,0.12)";
  const goldBorder = isLight ? "rgba(160,115,42,0.25)" : "rgba(212,168,83,0.18)";

  return (
    <>
      <style>{`
        @keyframes mi-spin { to { transform: rotate(360deg); } }
        @keyframes mi-fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .mi-card-enter { animation: mi-fadein 0.3s ease forwards; }
      `}</style>

      <section style={{
        background: bg,
        borderRadius: 20,
        border: `1px solid ${border}`,
        padding: "24px",
        width: "100%",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
          <div>
            <h2 style={{ color: textPrimary, fontSize: 18, fontWeight: 800, margin: 0, letterSpacing: "-0.01em" }}>
              Meeting Invites
            </h2>
            <p style={{ color: textMuted, fontSize: 13, margin: "4px 0 0" }}>
              Send or resend invite notifications to participants
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {sentCount > 0 && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: "rgba(77,184,150,0.12)", border: "1px solid rgba(77,184,150,0.22)",
                color: "#4db896", fontSize: 11, fontWeight: 800,
                padding: "5px 12px", borderRadius: 999, flexShrink: 0,
              }}>
                <FaCheck style={{ fontSize: 9 }} /> {sentCount} sent
              </span>
            )}
            <button
              onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
              style={{
                padding: "5px 12px", borderRadius: 999, cursor: "pointer",
                background: goldBg, border: `1px solid ${goldBorder}`,
                color: gold, fontSize: 13, fontWeight: 700,
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              {theme === "dark" ? "Dark" : "Light"}
            </button>
          </div>
        </div>

        {/* Company filter */}
        {/* {companies.length > 1 && (
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 20 }}>
            {companies.map((company) => {
              const isActive = activeCompany === company;
              const count = company === "All" ? meetings.length : meetings.filter((m) => m.company === company).length;
              return (
                <button
                  key={company}
                  onClick={() => setActiveCompany(company)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "5px 12px", borderRadius: 999,
                    border: isActive ? `1.5px solid ${gold}` : `1.5px solid ${border}`,
                    background: isActive ? goldBg : "transparent",
                    color: isActive ? gold : textMuted,
                    fontSize: 11, fontWeight: isActive ? 700 : 500, cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {company !== "All" && (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: isActive ? gold : textMuted, flexShrink: 0 }} />
                  )}
                  {company}
                  <span style={{
                    background: isActive ? goldBg : (isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"),
                    color: isActive ? gold : textMuted,
                    borderRadius: 20, padding: "1px 6px", fontSize: 9, fontWeight: 700,
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )} */}

        {/* Meeting cards */}
        {filtered.length === 0 ? (
          <div style={{ padding: "40px 24px", textAlign: "center", color: textMuted, fontSize: 13 }}>
            No meetings found for <strong style={{ color: gold }}>{activeCompany}</strong>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((meeting) => (
              <div key={meeting.id} className="mi-card-enter">
                <MeetingInviteCard
                  meeting={meeting}
                  participants={participants}
                  sendState={sendStates[meeting.id] || null}
                  onSend={handleSend}
                  theme={theme}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
