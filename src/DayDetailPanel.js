
import { FaClock, FaTimes, FaUser, FaVideo } from "react-icons/fa";
import { MONTHS } from "./MeetingData.js";
import { fmtDate } from "./dataHelpers.js";
import { btnPrimary, tagPill } from "./themes.js";
import { MdMeetingRoom } from "react-icons/md";
import { FaPerson } from "react-icons/fa6";

export default function DayDetailPanel({ t, date, bookings, rooms, onBook, onClose }) {
  const dateStr    = `${MONTHS[date.m]} ${date.d}, ${date.y}`;
  const dateKey    = fmtDate(date.y, date.m, date.d);
  const dayBookings = bookings.filter((b) => b.date === dateKey);

  return (
    <div style={{ padding: "28px 32px" }}>

      {/* -- Header -- */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.text }}>{dateStr}</div>
          <div style={{ fontSize: 13, color: t.textMuted, marginTop: 2 }}>
            {dayBookings.length} meeting{dayBookings.length !== 1 ? "s" : ""} scheduled
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: "transparent", border: "none", color: t.textMuted, fontSize: 20, cursor: "pointer" }}
        >
          <FaTimes/>
        </button>
      </div>

      {/* -- Empty state: show available rooms -- */}
      {dayBookings.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}><FaVideo/></div>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 6 }}>
            No meetings scheduled
          </div>
          <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 24 }}>
            This day is open. Book a meeting room to get started.
          </div>

          {rooms.map((room) => (
            <div
              key={room.id}
              style={{
                background:   t.card,
                border:       `1.5px solid ${t.border}`,
                borderRadius: 12,
                padding:      "14px 16px",
                marginBottom: 10,
                textAlign:    "left",
                transition:   "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = room.color)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = t.border)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* Room info */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: room.color }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{room.name}</span>
                  </div>
                  <div style={{ fontSize: 12, color: t.textMuted }}>
                    {room.floor} · Capacity: {room.capacity}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                    {room.amenities.map((a) => (
                      <span key={a} style={tagPill(t)}>{a}</span>
                    ))}
                  </div>
                </div>

                {/* Book button */}
                <button
                  onClick={() => onBook(date, room.id)}
                  style={{ ...btnPrimary(t), padding: "8px 16px", fontSize: 12 }}
                >
                  Book 
                </button>
              </div>
            </div>
          ))}
        </div>

      ) : (
        /* -- Booked day: show existing meetings -- */
        <>
          {dayBookings.map((b) => {
            const room = rooms.find((r) => r.id === b.room);
            return (
              <div
                key={b.id}
                style={{
                  background:   t.card,
                  border:       `1.5px solid ${b.color}33`,
                  borderLeft:   `4px solid ${b.color}`,
                  borderRadius: 12,
                  padding:      "16px",
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 4 }}>
                      {b.title}
                    </div>
                    <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 8 }}>{b.type}</div>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: t.textMuted }}><FaClock/> {b.time} · {b.duration}</span>
                      <span style={{ fontSize: 12, color: t.textMuted }}><MdMeetingRoom/> {room?.name}</span>
                      <span style={{ fontSize: 12, color: t.textMuted }}><FaUser/> {b.organizer}</span>
                      <span style={{ fontSize: 12, color: t.textMuted }}><FaPerson/> {b.attendees} attendees</span>
                    </div>
                  </div>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: b.color, marginTop: 4 }} />
                </div>
              </div>
            );
          })}

          <button
            onClick={() => onBook(date, null)}
            style={{ ...btnPrimary(t), width: "100%", padding: "12px", marginTop: 8, fontSize: 14 }}
          >
            + Book Another Meeting
          </button>
        </>
      )}
    </div>
  );
}
