import { useState, useMemo } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { FiArrowLeft, FiArrowRight, FiCalendar, FiList } from "react-icons/fi";

export default function CalendarMeetingList({ meetings, onSelect, onEdit }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState("calendar"); // "calendar" | "list"

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Map meetings by date string "YYYY-MM-DD"
  const meetingsByDate = useMemo(() => {
    const map = {};
    meetings.forEach((m) => {
      if (!m.date) return;
      const parsed = parseMeetingDate(m.date);
      if (!parsed) return;
      const key = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
      if (!map[key]) map[key] = [];
      map[key].push(m);
    });
    return map;
  }, [meetings]);

  const selectedKey = selectedDate
    ? `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
    : null;
  const selectedMeetings = selectedKey ? (meetingsByDate[selectedKey] || []) : [];

  const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDate(null);
  };

  const statusColor = (status) => {
    if (!status) return "#596197";
    const s = status.toLowerCase();
    if (s.includes("complet") || s.includes("done")) return "#4ade80";
    if (s.includes("cancel")) return "#e06060";
    if (s.includes("progress") || s.includes("active") || s.includes("session")) return "#D4A853";
    return "#7a83b8";
  };

  // Build grid cells: empty leading + day cells
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Navigate directly to the wizard for a meeting (with edit option exposed separately)
  const handleSelect = (item) => onSelect(item);
  const handleEdit = (e, item) => { e.stopPropagation(); onEdit(item); };

  return (
    <section className="co-panel" style={{ marginTop: -12 }}>
      {/* Header */}
      <div className="co-panel-head" style={{ marginBottom: 16 }}>
        <div>
          <h2>{viewMode === "calendar" ? "Meeting Calendar" : "Meeting List"}</h2>
          <p>{viewMode === "calendar" ? "Click a date to view scheduled meetings" : "Select a meeting to start the conduct wizard"}</p>
        </div>

        {/* View toggle */}
        <div style={{ display: "flex", gap: 4, background: "#080a1c", border: "1px solid rgba(212,168,83,0.10)", borderRadius: 12, padding: 4 }}>
          <button
            onClick={() => setViewMode("calendar")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 9, border: "none", cursor: "pointer",
              background: viewMode === "calendar" ? "rgba(212,168,83,0.15)" : "transparent",
              color: viewMode === "calendar" ? "#D4A853" : "#596197",
              fontSize: 12, fontWeight: 700, transition: "all 0.15s",
            }}
          >
            <FiCalendar /> Calendar
          </button>
          <button
            onClick={() => setViewMode("list")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 9, border: "none", cursor: "pointer",
              background: viewMode === "list" ? "rgba(212,168,83,0.15)" : "transparent",
              color: viewMode === "list" ? "#D4A853" : "#596197",
              fontSize: 12, fontWeight: 700, transition: "all 0.15s",
            }}
          >
            <FiList /> List
          </button>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <>
          {/* Calendar nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <button onClick={prevMonth} className="co-ghost-btn" style={{ padding: "6px 14px" }}><FiArrowLeft /></button>
            <span style={{ color: "#f4f0ff", fontWeight: 800, fontSize: 16, letterSpacing: "0.04em" }}>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} className="co-ghost-btn" style={{ padding: "6px 14px" }}><FiArrowRight /></button>
          </div>

          {/* Day labels */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 8 }}>
            {DAYS.map((d) => (
              <div key={d} style={{ textAlign: "center", color: "#3d4570", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", padding: "4px 0" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 24 }}>
            {cells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} />;
              const key = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayMeetings = meetingsByDate[key] || [];
              const isToday = key === todayKey;
              const isSelected = selectedDate === day;
              const hasMeetings = dayMeetings.length > 0;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : day)}
                  style={{
                    position: "relative",
                    minHeight: 64,
                    padding: "8px 6px 6px",
                    borderRadius: 12,
                    border: isSelected
                      ? "1.5px solid #D4A853"
                      : isToday
                        ? "1.5px solid rgba(212,168,83,0.4)"
                        : hasMeetings
                          ? "1.5px solid rgba(255,255,255,0.08)"
                          : "1.5px solid transparent",
                    background: isSelected
                      ? "rgba(212,168,83,0.12)"
                      : isToday
                        ? "rgba(212,168,83,0.05)"
                        : hasMeetings
                          ? "rgba(255,255,255,0.03)"
                          : "transparent",
                    cursor: hasMeetings ? "pointer" : "default",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    transition: "all 0.15s ease",
                    outline: "none",
                  }}
                >
                  <span style={{
                    fontSize: 13, fontWeight: isToday ? 900 : 600,
                    color: isToday ? "#D4A853" : isSelected ? "#f4f0ff" : hasMeetings ? "#c8cde8" : "#3d4570",
                    lineHeight: 1,
                  }}>
                    {day}
                  </span>
                  {isToday && (
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#D4A853" }} />
                  )}
                  {/* Meeting dots */}
                  {hasMeetings && (
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center", maxWidth: "100%" }}>
                      {dayMeetings.slice(0, 3).map((m, i) => (
                        <span
                          key={i}
                          style={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: statusColor(m.status),
                            flexShrink: 0,
                          }}
                        />
                      ))}
                      {dayMeetings.length > 3 && (
                        <span style={{ color: "#596197", fontSize: 8, fontWeight: 700 }}>+{dayMeetings.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected date meetings */}
          {selectedDate && (
            <div>
              <div style={{
                fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: "#4e568e",
                textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 10,
              }}>
                {MONTHS[viewMonth]} {selectedDate}, {viewYear}
                <span style={{ background: "rgba(212,168,83,0.10)", color: "#D4A853", borderRadius: 20, padding: "1px 8px", fontSize: 10, fontWeight: 700 }}>
                  {selectedMeetings.length} meeting{selectedMeetings.length !== 1 ? "s" : ""}
                </span>
              </div>

              {selectedMeetings.length === 0 ? (
                <div style={{ color: "#3d4570", fontSize: 13, fontStyle: "italic", padding: "16px 0" }}>
                  No meetings scheduled for this date.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {selectedMeetings.map((item) => (
                    <div key={item.id} className="co-meeting-card-wrap">
                      <button className="co-meeting-card" onClick={() => handleSelect(item)}>
                        <div>
                          <div className="co-meeting-title">{item.title}</div>
                          <div className="co-muted">{item.type || "Board Meeting"} / {item.time}</div>
                        </div>
                        <div className="co-meeting-meta">
                          <span>{item.location}</span>
                          <b style={{ color: statusColor(item.status) }}>{item.status}</b>
                        </div>
                      </button>
                      <button className="co-meeting-edit-btn" onClick={(e) => handleEdit(e, item)} title="Edit meeting details">
                        <FaPencilAlt />
                        <span>Edit</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            {[
              { label: "Completed", color: "#4ade80" },
              { label: "In Progress", color: "#D4A853" },
              { label: "Cancelled", color: "#e06060" },
              { label: "Scheduled", color: "#7a83b8" },
            ].map(({ label, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                <span style={{ color: "#4e568e", fontSize: 11 }}>{label}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <MeetingListView meetings={meetings} onSelect={handleSelect} onEdit={onEdit} statusColor={statusColor} />
      )}
    </section>
  );
}

/* -------------------------------------------------------------------
   MEETING LIST VIEW (card grid, no company grouping)
------------------------------------------------------------------- */
function MeetingListView({ meetings, onSelect, onEdit, statusColor }) {
  if (!meetings || meetings.length === 0) {
    return (
      <div className="co-output-empty-state">
        <div className="co-output-empty-title">No Meetings Found</div>
        <div className="co-output-empty-sub">There are no meetings scheduled yet.</div>
      </div>
    );
  }

  return (
    <div className="co-meeting-grid" style={{ maxHeight: 520, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "thin", scrollbarColor: "rgba(212,168,83,0.2) transparent", paddingRight: 4, marginTop: -4 }}>
      {meetings.map((item) => (
        <div key={item.id} className="co-meeting-card-wrap">
          <button className="co-meeting-card" onClick={() => onSelect(item)}>
            <div>
              <div className="co-meeting-title">{item.title}</div>
              <div className="co-muted">{item.type || "Board Meeting"} / {item.date} / {item.time}</div>
            </div>
            <div className="co-meeting-meta">
              <span>{item.location}</span>
              <b style={{ color: statusColor(item.status) }}>{item.status}</b>
            </div>
          </button>
          <button className="co-meeting-edit-btn" onClick={(e) => { e.stopPropagation(); onEdit(item); }} title="Edit meeting details">
            <FaPencilAlt />
            <span>Edit</span>
          </button>
        </div>
      ))}
    </div>
  );
}

// Parse common date formats -> Date object or null
function parseMeetingDate(str) {
  if (!str) return null;
  // "YYYY-MM-DD"
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return new Date(str);
  // "DD/MM/YYYY"
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    const [d, m, y] = str.split("/");
    return new Date(`${y}-${m}-${d}`);
  }
  // "DD MMM YYYY" e.g. "15 Jan 2025"
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}
