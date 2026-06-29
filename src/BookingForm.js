
import { useState } from "react";
import { ROOMS, MEETING_TYPES, TIME_SLOTS, DURATIONS, CURRENT_USER } from "./MeetingData.js";
import {
  btnPrimary, btnGhost,
  inputBase, selectBase, fieldLabel, errorMsg,
} from "./themes.js";
import { FaCheck, FaTimes } from "react-icons/fa";

/* -- Tiny controlled-input helpers ------------------------- */
function Field({ t, label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={fieldLabel(t)}>{label}</label>}
      {children}
      {error && <div style={errorMsg}>{error}</div>}
    </div>
  );
}

function TextInput({ t, value, onChange, placeholder, type = "text", hasError }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={inputBase(t, hasError)}
    />
  );
}

function Select({ t, value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={selectBase(t)}
    >
      {options.map((o) =>
        typeof o === "string"
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.id} value={o.id}>{o.name}</option>
      )}
    </select>
  );
}

/* -- Validation --------------------------------------------- */
function validate(form) {
  const e = {};
  if (!form.title.trim())                         e.title     = "Title is required";
  if (!form.date)                                 e.date      = "Date is required";
  if (!form.attendees || isNaN(form.attendees))   e.attendees = "Enter a valid number";
  return e;
}

/* -- Main Component ----------------------------------------- */
export default function BookingForm({ t, preDate = "", preRoom = "r1", onBook, onClose }) {
  const [form, setForm] = useState({
    title:       "",
    type:        "Board Meeting",
    room:        preRoom || "r1",
    date:        preDate,
    time:        "09:00 AM",
    duration:    "1 hour",
    attendees:   "",
    description: "",
  });
  const [errors,    setErrors]    = useState({});
  const [submitted, setSubmitted] = useState(false);

  /* Generic field setter  clears the field's error on change */
  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleSubmit = () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const room = ROOMS.find((r) => r.id === form.room);
    onBook({
      ...form,
      id:        "b" + Date.now(),
      color:     room.color,
      organizer: CURRENT_USER.name,
    });
    setSubmitted(true);
  };

  /* -- Success screen -- */
  if (submitted) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}><FaCheck/></div>
        <div style={{ fontSize: 22, fontWeight: 700, color: t.accent, marginBottom: 8 }}>
          Meeting Booked!
        </div>
        <div style={{ color: t.textMuted, marginBottom: 24 }}>
          Your slot has been confirmed and added to the calendar.
        </div>
        <button onClick={onClose} style={{ ...btnPrimary(t), padding: "10px 28px" }}>
          Close
        </button>
      </div>
    );
  }

  /* -- Form -- */
  return (
    <div style={{ padding: "28px 32px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>Book a Meeting Room</div>
          <div style={{ fontSize: 13, color: t.textMuted, marginTop: 2 }}>
            Fill in the details to reserve your slot
          </div>
        </div>
        <button onClick={onClose} style={{ background: "transparent", border: "none", color: t.textMuted, fontSize: 20, cursor: "pointer" }}>
          <FaTimes/>
        </button>
      </div>

      {/* Title */}
      <Field t={t} label="Meeting Title" error={errors.title}>
        <TextInput t={t} value={form.title} onChange={(v) => set("title", v)}
          placeholder="e.g. Q4 Board Review" hasError={!!errors.title} />
      </Field>

      {/* Type + Room */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field t={t} label="Meeting Type">
          <Select t={t} value={form.type} onChange={(v) => set("type", v)} options={MEETING_TYPES} />
        </Field>
        <Field t={t} label="Room">
          <Select t={t} value={form.room} onChange={(v) => set("room", v)} options={ROOMS} />
        </Field>
      </div>

      {/* Date + Time */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field t={t} label="Date" error={errors.date}>
          <TextInput t={t} type="date" value={form.date} onChange={(v) => set("date", v)} hasError={!!errors.date} />
        </Field>
        <Field t={t} label="Time">
          <Select t={t} value={form.time} onChange={(v) => set("time", v)} options={TIME_SLOTS} />
        </Field>
      </div>

      {/* Duration + Attendees */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field t={t} label="Duration">
          <Select t={t} value={form.duration} onChange={(v) => set("duration", v)} options={DURATIONS} />
        </Field>
        <Field t={t} label="Attendees" error={errors.attendees}>
          <TextInput t={t} value={form.attendees} onChange={(v) => set("attendees", v)}
            placeholder="Number of attendees" hasError={!!errors.attendees} />
        </Field>
      </div>

      {/* Description */}
      <Field t={t} label="Description">
        <textarea
          placeholder="Briefly describe the purpose and objectives..."
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          style={{
            ...inputBase(t),
            resize:     "vertical",
            lineHeight: 1.5,
          }}
        />
      </Field>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
        <button onClick={onClose}     style={{ flex: 1, ...btnGhost(t),   padding: "12px" }}>Cancel</button>
        <button onClick={handleSubmit} style={{ flex: 2, ...btnPrimary(t), padding: "12px", fontSize: 14 }}>
          Confirm Booking 
        </button>
      </div>
    </div>
  );
}
