const ATTENDANCE_MODES = ["physical", "electronic", "absent"];

export default function Attendance({ participants, attendance, setAttendance }) {
  const physicalCount = Object.values(attendance).filter((v) => v === "physical").length;
  const electronicCount = Object.values(attendance).filter((v) => v === "electronic").length;
  const absentCount = Object.values(attendance).filter((v) => v === "absent").length;

  return (
    <section className="co-panel">
      <div className="co-panel-head">
        <div>
          <h2>QUORUM</h2>
          <p>Mark each participant as physical, electronic, or absent</p>
        </div>
        <div className="co-counts">
          <span>{physicalCount} Physical</span>
          <span>{electronicCount} Electronic</span>
          <span>{absentCount} Absent</span>
        </div>
      </div>
      <div className="co-list">
        {participants.map((person) => (
          <div key={person.id} className="co-person-row">
            <div className="co-avatar" style={{ overflow: "hidden", padding: 0, display: "grid", placeItems: "center", background: person.color }}>
              <img
                src={person.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=0D1117&color=fff`}
                alt={person.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
              />
            </div>
            <div>
              <div className="co-person-name">{person.name}</div>
              <div className="co-muted">{person.email} / {person.role}</div>
            </div>
            <div className="co-segment co-segment-three">
              {ATTENDANCE_MODES.map((mode) => (
                <button
                  key={mode}
                  className={attendance[person.id] === mode ? "selected" : ""}
                  onClick={() => setAttendance((cur) => ({ ...cur, [person.id]: mode }))}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
