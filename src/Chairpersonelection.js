import { useState } from "react";
import { FaCheck, FaUser, FaCrown } from "react-icons/fa";

export default function ChairpersonElection({ participants, attendance, chairVotes, setChairVotes }) {
  const present = participants.filter(
    (p) => attendance[p.id] === "physical" || attendance[p.id] === "electronic"
  );

  const [phase, setPhase] = useState("select");
  const [selectedId, setSelectedId] = useState(null);
  const [electedId, setElectedId] = useState(() => {
    const votes = chairVotes || {};
    const tally = {};
    present.forEach((p) => { tally[p.id] = 0; });
    Object.values(votes).forEach((cid) => { if (tally[cid] !== undefined) tally[cid]++; });
    const max = Math.max(0, ...Object.values(tally));
    if (max === 0) return null;
    const winners = present.filter((p) => tally[p.id] === max);
    return winners.length === 1 ? winners[0].id : null;
  });

  const electedPerson = electedId ? participants.find((p) => p.id === electedId) : null;

  const handleSelect = (uid) => setSelectedId((prev) => (prev === uid ? null : uid));

  const handleElect = () => {
    if (!selectedId) return;
    const newVotes = {};
    present.forEach((p) => { newVotes[p.id] = selectedId; });
    setChairVotes(newVotes);
    setElectedId(selectedId);
    setPhase("elected");
  };

  const handleChange = () => {
    setPhase("select");
    setSelectedId(null);
    setElectedId(null);
    setChairVotes({});
  };

  const STEPS_CHAIR = ["Select Member", "Elected"];

  if (present.length === 0) {
    return (
      <section className="co-panel">
        <div className="co-panel-head">
          <div><h2>Chairperson Selection</h2><p>Designate a member to chair this meeting</p></div>
        </div>
        <div className="co-output-empty-state">
          <div className="co-output-empty-icon"><FaUser /></div>
          <div className="co-output-empty-title">No Present Members</div>
          <div className="co-output-empty-sub">Mark attendance first. Only physical and electronic attendees can be elected.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="co-panel">
      <div className="co-panel-head">
        <div><h2>Chairperson Selection</h2><p>Select a member to chair this meeting</p></div>
        {phase === "elected" && (
          <button className="co-ghost-btn" onClick={handleChange}>Change Chairperson</button>
        )}
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", gap: 0, marginBottom: 28, background: "#080a1c", borderRadius: 14, border: "1px solid rgba(212,168,83,0.10)", overflow: "hidden" }}>
        {STEPS_CHAIR.map((label, i) => {
          const stepIdx = phase === "select" ? 0 : 1;
          const isDone = stepIdx > i;
          const isActive = stepIdx === i;
          return (
            <div key={label} style={{
              flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "12px 18px",
              background: isActive ? "rgba(212,168,83,0.10)" : isDone ? "rgba(212,168,83,0.05)" : "transparent",
              borderRight: i < STEPS_CHAIR.length - 1 ? "1px solid rgba(212,168,83,0.10)" : "none",
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%", display: "grid", placeItems: "center", flexShrink: 0,
                fontSize: 11, fontWeight: 800,
                background: isDone ? "#D4A853" : isActive ? "rgba(212,168,83,0.20)" : "rgba(255,255,255,0.05)",
                color: isDone ? "#080b1d" : isActive ? "#D4A853" : "#596197",
                border: isActive ? "1.5px solid rgba(212,168,83,0.5)" : "1.5px solid transparent",
              }}>
                {isDone ? <FaCheck style={{ fontSize: 10 }} /> : i + 1}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? "#D4A853" : isDone ? "#a07830" : "#596197", letterSpacing: "0.06em" }}>
                {label.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>

      {phase === "select" && (
        <>
          <p style={{ color: "#596197", fontSize: 13, marginBottom: 20 }}>
            Click on a member to select them as chairperson, then confirm below.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
            {present.map((p) => {
              const isSelected = selectedId === p.id;
              return (
                <button key={p.id} onClick={() => handleSelect(p.id)} style={{
                  position: "relative", display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 10, padding: "20px 14px 16px",
                  background: isSelected ? "rgba(212,168,83,0.12)" : "rgba(255,255,255,0.03)",
                  border: isSelected ? "1.5px solid #D4A853" : "1.5px solid rgba(255,255,255,0.07)",
                  borderRadius: 18, cursor: "pointer", transition: "all 0.18s ease",
                  boxShadow: isSelected ? "0 0 24px rgba(212,168,83,0.15)" : "none", outline: "none",
                }}>
                  {isSelected && (
                    <div style={{ position: "absolute", inset: -3, borderRadius: 21, border: "2px solid rgba(212,168,83,0.35)", pointerEvents: "none" }} />
                  )}
                  <div style={{
                    width: 58, height: 58, borderRadius: "50%",
                    border: isSelected ? "2.5px solid #D4A853" : "2px solid rgba(255,255,255,0.10)",
                    overflow: "hidden", background: p.color,
                    boxShadow: isSelected ? "0 0 18px rgba(212,168,83,0.30)" : "none", flexShrink: 0,
                  }}>
                    <img src={p.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0D1117&color=fff`} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: isSelected ? "#f4f0ff" : "#c8cde8", fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{p.name}</div>
                    <div style={{ color: "#596197", fontSize: 11, textTransform: "capitalize" }}>{p.role}</div>
                  </div>
                  {isSelected ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#D4A853", color: "#080b1d", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 99, letterSpacing: "0.08em" }}>
                      <FaCheck style={{ fontSize: 8 }} /> SELECTED
                    </span>
                  ) : (
                    <span style={{ color: "#3d4570", fontSize: 11, fontStyle: "italic" }}>Click to select</span>
                  )}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: 14, background: "#080a1c", border: "1px solid rgba(212,168,83,0.10)", flexWrap: "wrap", gap: 12 }}>
            <div>
              {selectedId ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#D4A853", flexShrink: 0 }} />
                  <span style={{ color: "#D4A853", fontWeight: 700, fontSize: 13 }}>
                    {present.find((p) => p.id === selectedId)?.name} selected
                  </span>
                </span>
              ) : (
                <span style={{ color: "#3d4570", fontSize: 13, fontStyle: "italic" }}>No member selected yet</span>
              )}
            </div>
            <button className="co-gold-btn" disabled={!selectedId} onClick={handleElect} style={{ opacity: selectedId ? 1 : 0.4 }}>
              Confirm as Chairperson
            </button>
          </div>
        </>
      )}

      {phase === "elected" && electedPerson && (
        <div>
          <div style={{
            position: "relative", borderRadius: 20, overflow: "hidden",
            background: "linear-gradient(135deg, rgba(212,168,83,0.15) 0%, rgba(212,168,83,0.04) 100%)",
            border: "1.5px solid rgba(212,168,83,0.40)", marginBottom: 24,
          }}>
            <div style={{ position: "absolute", top: 12, right: 20, fontSize: 72, opacity: 0.06, color: "#D4A853", pointerEvents: "none" }}>
              <FaCrown />
            </div>
            <div style={{ padding: "32px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 88, height: 88, borderRadius: "50%", border: "3px solid #D4A853", overflow: "hidden", background: electedPerson.color, boxShadow: "0 0 32px rgba(212,168,83,0.30)" }}>
                  <img src={electedPerson.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(electedPerson.name)}&background=0D1117&color=fff`} alt={electedPerson.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ position: "absolute", bottom: -4, right: -4, width: 28, height: 28, borderRadius: "50%", background: "#D4A853", display: "grid", placeItems: "center", fontSize: 12, color: "#080b1d", boxShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                  <FaCrown />
                </div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", color: "#D4A853", textTransform: "uppercase" }}>Meeting Chairperson</div>
              <div style={{ color: "#f4f0ff", fontSize: 22, fontWeight: 900, lineHeight: 1.2 }}>{electedPerson.name}</div>
              <div style={{ color: "#7a83b8", fontSize: 13, textTransform: "capitalize" }}>{electedPerson.role}</div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(212,168,83,0.18)", color: "#D4A853", border: "1px solid rgba(212,168,83,0.35)", fontSize: 11, fontWeight: 800, padding: "5px 16px", borderRadius: 99, letterSpacing: "0.1em" }}>
                <FaCheck style={{ fontSize: 9 }} /> CONFIRMED
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#4e568e", fontSize: 11, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
            Chairperson confirmed for this session
          </div>
        </div>
      )}
    </section>
  );
}
