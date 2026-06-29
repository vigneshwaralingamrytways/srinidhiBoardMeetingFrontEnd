
import { DAYS } from "./MeetingData.js";
import { getDaysInMonth, getFirstDayOfMonth, fmtDate, isToday } from "./dataHelpers.js";

export default function Calendar({ t, bookings, year, month, onDayClick }) {
  const days     = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  /* Build flat cell array: null = empty leading cell, number = day */
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];

  return (
    <div>
      {/* -- Weekday headers -- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
        {DAYS.map((d) => (
          <div
            key={d}
            style={{
              textAlign:     "center",
              fontSize:      11,
              fontWeight:    600,
              color:         t.textMuted,
              textTransform: "uppercase",
              letterSpacing: 1,
              padding:       "6px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* -- Day grid -- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={`empty-${i}`} />;

          const dateStr     = fmtDate(year, month, d);
          const dayBookings = bookings.filter((b) => b.date === dateStr);
          const today       = isToday(year, month, d);

          return (
            <div
              key={dateStr}
              onClick={() => onDayClick({ y: year, m: month, d })}
              style={{
                background:   t.calDayBg,
                border:       `1px solid ${today ? t.accent : t.border}`,
                borderRadius: 8,
                padding:      "6px 8px",
                minHeight:    70,
                cursor:       "pointer",
                transition:   "all 0.18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background    = t.calDayHover;
                e.currentTarget.style.borderColor   = t.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background  = t.calDayBg;
                e.currentTarget.style.borderColor = today ? t.accent : t.border;
              }}
            >
              {/* Day number */}
              <div
                style={{
                  fontSize:   12,
                  fontWeight: today ? 700 : 500,
                  color:      today ? t.accent : t.text,
                  marginBottom: 4,
                }}
              >
                {d}
              </div>

              {/* Booking chips (max 2 visible) */}
              {dayBookings.slice(0, 2).map((b) => (
                <div
                  key={b.id}
                  style={{
                    background:   b.color + "22",
                    borderLeft:   `2.5px solid ${b.color}`,
                    borderRadius: 3,
                    padding:      "2px 5px",
                    marginBottom: 2,
                  }}
                >
                  <div
                    style={{
                      fontSize:     10,
                      color:        b.color,
                      fontWeight:   600,
                      whiteSpace:   "nowrap",
                      overflow:     "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {b.title}
                  </div>
                </div>
              ))}

              {/* Overflow indicator */}
              {dayBookings.length > 2 && (
                <div style={{ fontSize: 10, color: t.textMuted }}>
                  +{dayBookings.length - 2} more
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
