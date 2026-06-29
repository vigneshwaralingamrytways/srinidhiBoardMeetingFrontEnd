import { formatDuration } from "./Helpers";

export default function MeetingDetails({ meeting, durationSeconds, timerStopped }) {
  return (
    <section className="co-panel">
      <div className="co-panel-head">
        <div><h2>Meeting Details</h2><p>Review the meeting information before attendance marking</p></div>
        <span className="co-live-pill">IN SESSION</span>
      </div>
      <div className="co-form-grid">
        <Field label="MEETING TITLE" value={meeting.title} wide />
        <Field label="MEETING TYPE" value={meeting.type || "Board Meeting"} />
        <Field label="LOCATION / PLATFORM" value={meeting.location} />
        <Field label="DATE" value={meeting.date} />
        <Field label="TIME" value={meeting.time || "09:00 AM"} />
        <Field label="MEETING TIMER" value={`${formatDuration(durationSeconds)} ${timerStopped ? "(Stopped)" : "(Running)"}`} />
        <Field label="DESCRIPTION" value={meeting.description} wide large />
      </div>
    </section>
  );
}

export function Field({ label, value, wide, large }) {
  return (
    <div className={wide ? "co-field wide" : "co-field"}>
      <label>{label}</label>
      <div className={large ? "co-input large" : "co-input"}>{value}</div>
    </div>
  );
}
