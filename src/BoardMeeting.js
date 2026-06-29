import { useState, useCallback } from "react";
import {
  Calendar as CalendarIcon,
  DoorOpen,
  Sun,
  Moon,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Data
import { ROOMS, MONTHS, INITIAL_BOOKINGS } from "./MeetingData.js";

// Styles
import { themes, btnPrimary, btnGhost, card } from "./themes.js";

// Utils
import { fmtDate, isFuture } from "./dataHelpers.js";

// Components
import Calendar       from "./Calendar.js";
import BookingForm    from "./BookingForm.js";
import DayDetailPanel from "./DayDetailPanel.js";

// -- Modal wrapper ---------------------------------------------
function Modal({ t, onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{
        position:       "fixed",
        inset:          0,
        background:     "rgba(0,0,0,0.65)",
        zIndex:         200,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background:   t.modalBg,
          border:       `1px solid ${t.border}`,
          borderRadius: 16,
          width:        "100%",
          maxWidth:     540,
          maxHeight:    "90vh",
          overflowY:    "auto",
          boxShadow:    t.shadow,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// -- Rooms View ------------------------------------------------
function RoomsView({ t, bookings, onBookRoom, onBack }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{
            ...btnGhost(t),
            padding:    "7px 12px",
            display:    "flex",
            alignItems: "center",
            gap:        6,
            fontSize:   13,
            fontWeight: 600,
          }}
        >
          <ChevronLeft size={16} /> Back to Calendar
        </button>
        <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Meeting Rooms</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {ROOMS.map((room) => {
          const roomBookings = bookings.filter((b) => b.room === room.id);
          return (
            <div
              key={room.id}
              style={{
                ...card(t),
                border:     `2px solid ${t.border}`,
                padding:    20,
                transition: "border-color 0.2s, transform 0.2s",
                cursor:     "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = room.color;
                e.currentTarget.style.transform   = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = t.border;
                e.currentTarget.style.transform   = "none";
              }}
            >
              {/* Icon + badge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: room.color + "22",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <DoorOpen size={20} color={room.color} />
                </div>
                <span style={{
                  fontSize: 11, background: room.color + "22",
                  color: room.color, borderRadius: 6,
                  padding: "3px 10px", fontWeight: 600,
                }}>
                  {roomBookings.length} meetings
                </span>
              </div>

              <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 4 }}>{room.name}</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 10 }}>
                {room.floor} · Capacity: {room.capacity}
              </div>

              {/* Amenity pills */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                {room.amenities.map((a) => (
                  <span key={a} style={{
                    fontSize: 11, color: t.textMuted,
                    background: t.accentSoft, borderRadius: 4, padding: "2px 8px",
                  }}>
                    {a}
                  </span>
                ))}
              </div>

              {/* Recent bookings */}
              <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 12, marginBottom: 12 }}>
                {roomBookings.slice(0, 2).map((b) => (
                  <div key={b.id} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 3, borderRadius: 3, background: room.color }} />
                    <div>
                      <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{b.title}</div>
                      <div style={{ fontSize: 11, color: t.textMuted }}>{b.date} · {b.time}</div>
                    </div>
                  </div>
                ))}
                {roomBookings.length === 0 && (
                  <div style={{ fontSize: 12, color: t.textDim, fontStyle: "italic" }}>No bookings yet</div>
                )}
              </div>

              <button
                onClick={() => onBookRoom(room.id)}
                style={{ ...btnPrimary(t), width: "100%", padding: "10px", fontSize: 13 }}
              >
                Book This Room
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -- Calendar View (full-width, no stats, no right sidebar) ----
function CalendarView({ t, bookings, calYear, calMonth, onPrev, onNext, onDayClick }) {
  return (
    <>
      {/* Month nav */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 20,
      }}>
        <button onClick={onPrev} style={{ ...btnGhost(t), padding: "8px 14px", display: "flex", alignItems: "center" }}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>
          {MONTHS[calMonth]} {calYear}
        </div>
        <button onClick={onNext} style={{ ...btnGhost(t), padding: "8px 14px", display: "flex", alignItems: "center" }}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Full-width calendar only */}
      <div style={{ ...card(t), padding: 20 }}>
        <Calendar
          t={t}
          bookings={bookings}
          year={calYear}
          month={calMonth}
          onDayClick={onDayClick}
        />
      </div>
    </>
  );
}

// -- Root App --------------------------------------------------
export default function BoardMeeting() {
  const today = new Date();

  const [theme,       setTheme]       = useState("dark");
  const [bookings,    setBookings]    = useState(INITIAL_BOOKINGS);
  const [calYear,     setCalYear]     = useState(today.getFullYear());
  const [calMonth,    setCalMonth]    = useState(today.getMonth());
  const [activeView,  setActiveView]  = useState("calendar");
  const [modal,       setModal]       = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [preRoom,     setPreRoom]     = useState(null);

  const t = themes[theme];

  // -- Calendar navigation --
  const prevMonth = () => {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11); }
    else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0); }
    else setCalMonth((m) => m + 1);
  };

  // -- Modal openers --
  const openDayDetail  = (date)         => { setSelectedDay(date); setModal("detail"); };
  const openBookForm   = (date, roomId) => { setSelectedDay(date); setPreRoom(roomId); setModal("book"); };
  const openBookDirect = ()             => { setSelectedDay(null); setPreRoom(null);   setModal("book"); };
  const openBookRoom   = (roomId)       => { setSelectedDay(null); setPreRoom(roomId); setModal("book"); };

  // -- Save new booking --
  const handleBook = useCallback((booking) => {
    setBookings((prev) => [...prev, booking]);
    setTimeout(() => setModal(null), 1800);
  }, []);

  // Count meetings this month for header subtitle
  const thisMonthCount = bookings.filter((b) => {
    const [y, m] = b.date.split("-").map(Number);
    return y === calYear && m === calMonth + 1;
  }).length;

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: t.bg, fontFamily: "'Georgia', serif", overflow: "hidden",
    }}>

      {/* -- Main area -- */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{
          background:     t.headerBg,
          borderBottom:   `1px solid ${t.border}`,
          padding:        "0 24px",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          height:         64,
          flexShrink:     0,
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>Meeting Calendar</div>
            <div style={{ fontSize: 12, color: t.textMuted }}>
              {thisMonthCount} meetings in {MONTHS[calMonth]}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* View toggle */}
            <div style={{
              display: "flex", background: t.card,
              border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden",
            }}>
              {[
                { key: "calendar", icon: <CalendarIcon size={14} />, label: "Calendar" },
                { key: "rooms",    icon: <DoorOpen size={14} />,     label: "Rooms"    },
              ].map(({ key, icon, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveView(key)}
                  style={{
                    padding:    "7px 16px",
                    background: activeView === key ? t.accent : "transparent",
                    border:     "none",
                    color:      activeView === key ? "#fff" : t.textMuted,
                    fontSize:   13,
                    fontWeight: 600,
                    cursor:     "pointer",
                    transition: "background 0.15s",
                    fontFamily: "inherit",
                    display:    "flex",
                    alignItems: "center",
                    gap:        6,
                  }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme((th) => th === "dark" ? "light" : "dark")}
              style={{
                ...btnGhost(t),
                padding:    "7px 14px",
                fontSize:   13,
                display:    "flex",
                alignItems: "center",
                gap:        6,
              }}
            >
              {theme === "dark"
                ? <><Sun size={14} /> Light</>
                : <><Moon size={14} /> Dark</>
              }
            </button>

            {/* Book button */}
            <button
              onClick={openBookDirect}
              style={{
                ...btnPrimary(t),
                padding:    "8px 18px",
                fontSize:   13,
                display:    "flex",
                alignItems: "center",
                gap:        6,
              }}
            >
              <Plus size={14} /> Book Meeting
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          {activeView === "calendar" ? (
            <CalendarView
              t={t}
              bookings={bookings}
              calYear={calYear}
              calMonth={calMonth}
              onPrev={prevMonth}
              onNext={nextMonth}
              onDayClick={openDayDetail}
            />
          ) : (
            <RoomsView t={t} bookings={bookings} onBookRoom={openBookRoom} onBack={() => setActiveView("calendar")} />
          )}
        </div>
      </div>

      {/* -- Modals -- */}
      {modal === "detail" && selectedDay && (
        <Modal t={t} onClose={() => setModal(null)}>
          <DayDetailPanel
            t={t}
            date={selectedDay}
            bookings={bookings}
            rooms={ROOMS}
            onBook={openBookForm}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      {modal === "book" && (
        <Modal t={t} onClose={() => setModal(null)}>
          <BookingForm
            t={t}
            preDate={selectedDay ? fmtDate(selectedDay.y, selectedDay.m, selectedDay.d) : ""}
            preRoom={preRoom}
            onBook={handleBook}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
