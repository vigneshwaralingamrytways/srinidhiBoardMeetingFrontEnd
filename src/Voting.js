import { useState } from "react";
import { DATA } from "./MeetingData";
import "./Voting.css";

function VoteCard({ vote }) {
  const [choice, setChoice] = useState(vote.userChoice);
  const [cast, setCast] = useState(vote.userVoted);
  const total = Object.values(vote.results).reduce((a, b) => a + b, 0);

  return (
    <div className="vt-card">
      <div className="vt-vote-header">
        <div>
          <div className="vt-vote-title">{vote.title}</div>
          <div className="vt-deadline">Deadline: {vote.deadline}</div>
        </div>
        <span className={`vt-vote-status vs-${vote.status}`}>{vote.status.toUpperCase()}</span>
      </div>
      <div className="vt-options">
        {vote.options.map((option) => {
          const count = vote.results[option] || 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const selected = choice === option;
          return (
            <div key={option} className={`vt-option ${selected ? "vo-selected" : ""}`} onClick={() => { if (!cast && vote.status === "active") setChoice(option); }}>
              <div className="vt-opt-top">
                <span style={{ display: "flex", alignItems: "center" }}><span className="vt-check">{selected ? "?" : ""}</span><span className="vt-opt-label">{option}</span></span>
                {(cast || vote.status === "closed") && <span className="vt-opt-count">{count} votes</span>}
              </div>
              {(cast || vote.status === "closed") && (
                <>
                  <div className="vt-opt-bar"><div className="vt-opt-fill" style={{ width: `${pct}%` }} /></div>
                  <div className="vt-opt-pct">{pct}%</div>
                </>
              )}
            </div>
          );
        })}
      </div>
      {!cast && vote.status === "active" && <button className="vt-btn vt-btn-cast" disabled={!choice} onClick={() => setCast(true)}>Cast Vote</button>}
      {cast && <div className="vt-your-vote">? You voted: <strong>{choice}</strong></div>}
      <div className="vt-total">{total} total votes · {DATA.participants.length} participants</div>
    </div>
  );
}

export default function Voting() {
  const [tab, setTab] = useState("active");
  const [newQuestion, setNewQuestion] = useState("Approve circulated board resolution and decision");
  const [newOptions, setNewOptions] = useState(["Approve", "Reject"]);
  const [optInput, setOptInput] = useState("");
  const filtered = DATA.votes.filter((vote) => tab === "active" ? vote.status === "active" || vote.status === "pending" : vote.status === "closed");
  const addOption = () => {
    if (optInput.trim()) {
      setNewOptions((prev) => [...prev, optInput.trim()]);
      setOptInput("");
    }
  };

  return (
    <div className="vt-wrap">
      <div className="vt-inner">
        <div className="vt-title">Voting</div>
        <div className="vt-sub">Vote on board resolutions and recorded decisions sent to all members</div>
        <div className="vt-tabs">
          {[["active", "Active Votes"], ["closed", "Closed"], ["create", "Create Vote"]].map(([id, label]) => (
            <div key={id} className={`vt-tab ${tab === id ? "vt-active" : ""}`} onClick={() => setTab(id)}>{label}</div>
          ))}
        </div>
        {tab !== "create" && filtered.map((vote) => <VoteCard key={vote.id} vote={vote} />)}
        {tab === "create" && (
          <div className="vt-card">
            <div className="vt-vote-title" style={{ marginBottom: 24 }}>New Vote</div>
            <div className="vt-create">
              <div>
                <div className="vt-create-label">Question</div>
                <input className="vt-create-input" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} />
              </div>
              <div>
                <div className="vt-create-label">Options</div>
                <div className="vt-option-pills">
                  {newOptions.map((option, index) => (
                    <div key={option} className="vt-opt-pill">{option}<button onClick={() => setNewOptions((prev) => prev.filter((_, i) => i !== index))}>×</button></div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <input className="vt-create-input" placeholder="Add option..." value={optInput} onChange={(e) => setOptInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addOption()} />
                  <button className="vt-btn vt-btn-cast" onClick={addOption}>Add</button>
                </div>
              </div>
              <button className="vt-btn vt-btn-cast" disabled={!newQuestion.trim() || newOptions.length < 2} style={{ alignSelf: "flex-start" }}>Launch Vote</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}










 /* -- Step 4  Statutory & Compliance -- */
    // <div key="step4">
    //   <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 28, lineHeight: 1.7 }}>
    //     Required for legal registration and annual board filings (e.g. Companies Act / MCA).
    //   </p>
    //   <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
    //     <Field label="Director Identification Number (DIN)">
    //       <input value={form.profile.din} onChange={e => setProfile("din", e.target.value)} style={inputStyle} placeholder="e.g. 00123456" />
    //     </Field>
    //     <Field label="PAN Card / Tax ID Number">
    //       <input value={form.profile.panCard} onChange={e => setProfile("panCard", e.target.value)} style={inputStyle} placeholder="e.g. ABCDE1234F" />
    //     </Field>
    //     <Field label="Declaration of Independence">
    //       <select value={form.profile.declarationOfIndependence} onChange={e => setProfile("declarationOfIndependence", e.target.value)} style={inputStyle}>
    //         <option value="No">No  Executive / Non-Independent</option>
    //         <option value="Yes">Yes  Meets Independent Director Criteria</option>
    //       </select>
    //     </Field>
    //   </div>
    //   <div style={{ marginTop: 20 }}>
    //     <Field label="Directorships in Other Companies">
    //       <textarea value={form.profile.directorshipsOther} onChange={e => setProfile("directorshipsOther", e.target.value)} style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="List all other boards the member currently sits on, including company name and role..." />
    //     </Field>
    //   </div>
    // </div>,

    /* -- Step 5  Financial & Conflict of Interest -- */
    // <div key="step5">
    //   <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 28, lineHeight: 1.7 }}>
    //     Financial disclosures required to prevent conflicts of interest and process remuneration.
    //   </p>
    //   <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    //     <Field label="Shareholding Details (self & immediate family)">
    //       <textarea value={form.profile.shareholdingDetails} onChange={e => setProfile("shareholdingDetails", e.target.value)} style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} placeholder="No. of shares, % holding, held by self or family member..." />
    //     </Field>
    //     <Field label="Related Party Disclosures">
    //       <textarea value={form.profile.relatedPartyDisclosures} onChange={e => setProfile("relatedPartyDisclosures", e.target.value)} style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} placeholder="Any contracts, partnerships, or transactions between the director and the company..." />
    //     </Field>
    //     <Field label="Bank Account Details (for sitting fees / reimbursements)">
    //       <textarea value={form.profile.bankAccountDetails} onChange={e => setProfile("bankAccountDetails", e.target.value)} style={{ ...inputStyle, minHeight: 56, resize: "vertical" }} placeholder="Account number, IFSC / SWIFT, bank name..." />
    //     </Field>
    //   </div>
    // </div>,

    /* -- Step 6  Skills & Signature -- */
    // <div key="step6">
    //   <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 24, lineHeight: 1.7 }}>
    //     Select areas of expertise for board composition reporting, then capture a digital signature.
    //   </p>
    //   <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 12 }}>Skills & Expertise Matrix</p>
    //   <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,4fr))", gap: 10, marginBottom: 28 }}>
    //     {SKILL_OPTIONS.map(skill => {
    //       const selected = form.profile.skills.includes(skill);
    //       return (
    //         <button key={skill} onClick={() => toggleSkill(skill)} style={{ textAlign: "left", background: selected ? "var(--gold)18" : "var(--bg3)", border: `1px solid ${selected ? "var(--gold)" : "var(--border2)"}`, color: selected ? "var(--gold)" : "var(--text2)", padding: "10px 14px", fontSize: 11, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", ...buttonBase, textTransform: "none", letterSpacing: 0 }}>
    //           <span style={{ width: 14, height: 14, border: `1px solid ${selected ? "var(--gold)" : "var(--border2)"}`, background: selected ? "var(--gold)" : "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    //             {selected && <FaCheck size={8} color="var(--bg)" />}
    //           </span>
    //           {skill}
    //         </button>
    //       );
    //     })}
    //   </div>
    //   <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 12 }}>Digital Signature</p>
    //   <SignaturePad value={form.profile.signature} onChange={v => setProfile("signature", v)} />
    // </div>,