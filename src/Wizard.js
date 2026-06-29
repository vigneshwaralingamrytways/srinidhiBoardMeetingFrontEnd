const STEPS = ["DETAILS", "QUORUM", "CHAIRPERSON", "BOARD PACK", "AGENDA", "RESOLUTIONS", "OTHER AGENDA", "TASKS", "MOM"];

export default function Wizard({ step, setStep }) {
  return (
    <div
      className="co-wizard"
      style={{
        gridTemplateColumns: `repeat(${STEPS.length}, minmax(0, 1fr))`,
        gap: 2,
        marginBottom: 8,
        padding: "3px 0",
      }}
    >
      {STEPS.map((label, index) => (
        <button
          key={label}
          className={`co-step ${step === index ? "active" : ""} ${step > index ? "done" : ""}`}
          onClick={() => setStep(index)}
          style={{ padding: "6px 2px", gap: 2 }}
        >
          <span style={{ width: 19, height: 19, fontSize: 10, flexShrink: 0 }}>{index + 1}</span>
          <em style={{ fontSize: 12, letterSpacing: "0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>{label}</em>
        </button>
      ))}
    </div>
  );
}

export { STEPS };
