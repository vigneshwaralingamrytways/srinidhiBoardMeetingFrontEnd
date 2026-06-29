import { useState, useEffect } from "react";
import RichTextEditor from "./Richtexteditor";

export default function MOM({
  agendaItems, agendaWork, momData, setMomData,
  savedMoms, setSavedMoms, participants,
  momAcknowledgements, setMomAcknowledgements,
}) {
  const set = (key) => (e) => setMomData((d) => ({ ...d, [key]: e.target.value }));
  const [visibleAcknowledgedMoms, setVisibleAcknowledgedMoms] = useState({});

  useEffect(() => {
    setVisibleAcknowledgedMoms((cur) => {
      const next = { ...cur };
      savedMoms.forEach((mom) => {
        const acks = momAcknowledgements[mom.id] || {};
        const allAcked = participants.length > 0 && participants.every((p) => !!acks[p.id]);
        if (allAcked && next[mom.id] === undefined) next[mom.id] = false;
        if (!allAcked) delete next[mom.id];
      });
      return next;
    });
  }, [savedMoms, momAcknowledgements, participants]);

  const handleSaveMOM = () => {
    if (!momData.secretary && !momData.notes) return;
    const newMom = {
      id: Date.now(),
      title: momData.secretary,
      description: momData.notes,
      createdAt: new Date().toLocaleString(),
    };
    setSavedMoms((prev) => [...prev, newMom]);
    setMomAcknowledgements((cur) => ({ ...cur, [newMom.id]: {} }));
    setMomData((d) => ({ ...d, secretary: "", notes: "" }));
  };

  const toggleAck = (momId, participantId) => {
    setMomAcknowledgements((cur) => {
      const existing = cur[momId] || {};
      return { ...cur, [momId]: { ...existing, [participantId]: !existing[participantId] } };
    });
  };

  const ackAll = (momId) => {
    const all = {};
    participants.forEach((p) => { all[p.id] = true; });
    setMomAcknowledgements((cur) => ({ ...cur, [momId]: all }));
  };

  return (
    <section className="co-panel">
      <div className="co-panel-head">
        <div>
          <h2>Minutes of Meeting</h2>
          <p>Record the official minutes, action items, and notes arising from this meeting</p>
        </div>
        {savedMoms.length > 0 && (
          <span style={{ background: "rgba(212,168,83,0.10)", color: "#D4A853", fontSize: 11, fontWeight: 800, padding: "4px 14px", borderRadius: 999, letterSpacing: "0.06em" }}>
            {savedMoms.length} MOM{savedMoms.length > 1 ? "s" : ""} saved
          </span>
        )}
      </div>

      <div className="co-form-grid" style={{ marginBottom: 24 }}>
        <div className="co-field">
          <label>Minutes Of Meeting Title</label>
          <input className="co-input" value={momData.secretary} onChange={set("secretary")} placeholder="Title of the MOM" />
        </div>
        <div className="co-field wide">
          <label>MINUTES SUMMARY</label>
          <RichTextEditor
            value={momData.notes}
            onChange={(value) => setMomData((d) => ({ ...d, notes: value }))}
            placeholder="Enter MOM notes..."
            minHeight={180}
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 32 }}>
        <button className="co-btn co-btn-primary" onClick={handleSaveMOM}>Save MOM</button>
      </div>
    </section>
  );
}
