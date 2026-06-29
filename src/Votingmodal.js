import { useState } from "react";
import { FaCheck, FaTimes, FaUser } from "react-icons/fa";

export default function VotingModal({ item, participants, votes, recordVote, onAcceptAll, onClose }) {
  const [resultView, setResultView] = useState(null);

  const itemVotes = votes[item.id] || {};
  const approved = participants.filter((p) => itemVotes[p.id] === "Approve");
  const rejected = participants.filter((p) => itemVotes[p.id] === "Reject");
  const totalVoted = approved.length + rejected.length;
  const allVoted = totalVoted >= participants.length;
  const verdict = approved.length > rejected.length && approved.length > 0 ? "Approved" : totalVoted ? "Rejected" : "Waiting";

  return (
    <div className="co-modal-overlay" onClick={onClose}>
      <div className="co-modal" onClick={(e) => e.stopPropagation()}>
        <div className="co-modal-head">
          <div>
            <div className="co-doc-top">{item.type}</div>
            <h3 className="co-modal-title">{item.title}</h3>
            <div className="co-muted">{item.agendaTitle}</div>
          </div>
          <button className="co-modal-close" onClick={onClose}><FaTimes /></button>
        </div>

        {!allVoted && (
          <div className="co-modal-accept-row">
            <button className="co-gold-btn co-modal-accept-btn" onClick={onAcceptAll}>
              &nbsp;&nbsp;Accepted by All Members
            </button>
            <span className="co-muted">{totalVoted} / {participants.length} voted</span>
          </div>
        )}

        {!allVoted && (
          <div className="co-modal-voter-list">
            {participants.map((person) => {
              const cast = itemVotes[person.id];
              return (
                <div key={person.id} className="co-modal-voter-row">
                  <div className="co-modal-voter-info">
                    <div className="co-avatar co-avatar-sm" style={{ background: person.color, overflow: "hidden", padding: 0 }}>
                      {person.photo
                        ? <img src={person.photo} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                        : <FaUser style={{ fontSize: 14, color: "#fff" }} />}
                    </div>
                    <div>
                      <div className="co-person-name">{person.name}</div>
                      <div className="co-muted">{person.role}</div>
                    </div>
                    {cast && <span className={`co-cast-badge co-cast-${cast.toLowerCase()}`}>{cast}</span>}
                  </div>
                  <div className="co-vote-options">
                    {["Approve", "Reject"].map((opt) => (
                      <button key={opt} className={cast === opt ? "selected" : ""}
                        onClick={() => recordVote(item.id, person.id, opt)}>{opt}</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!allVoted && (
          <div className="co-modal-live-tally">
            <div className="co-modal-live-count approve"><strong>{approved.length}</strong><span>Accept</span></div>
            <div className="co-modal-live-divider" />
            <div className="co-modal-live-count reject"><strong>{rejected.length}</strong><span>Reject</span></div>
          </div>
        )}

        {allVoted && (
          <div className="co-modal-results-phase">
            <div className={`co-modal-verdict-banner ${verdict === "Approved" ? "approved" : "rejected"}`}>
              <span className="co-modal-verdict-icon">{verdict === "Approved" ? <FaCheck /> : <FaTimes />}</span>
              <div>
                <strong>{verdict}</strong>
                <div className="co-muted" style={{ fontSize: 12, marginTop: 3 }}>
                  {approved.length} accepted · {rejected.length} rejected · {participants.length} total
                </div>
              </div>
            </div>

            <div className="co-modal-result-cards">
              {[
                { key: "approve", label: "Accepted", icon: <FaCheck />, list: approved },
                { key: "reject", label: "Rejected", icon: <FaTimes />, list: rejected },
              ].map(({ key, label, icon, list }) => (
                <div key={key} className={`co-modal-result-card ${key} ${resultView === key ? "open" : ""}`}
                  onClick={() => setResultView(resultView === key ? null : key)}>
                  <div className="co-modal-result-card-head">
                    <div className={`co-modal-result-card-label ${key}`}>
                      <span className="co-modal-result-icon">{icon}</span>
                      <span>{label}</span>
                    </div>
                    <strong className={`co-modal-result-num ${key}`}>{list.length}</strong>
                  </div>
                  {resultView === key && (
                    <div className="co-modal-member-list">
                      {list.length === 0 ? (
                        <div className="co-modal-member-empty">No members {label.toLowerCase()}</div>
                      ) : (
                        list.map((person) => (
                          <div key={person.id} className="co-modal-member-row">
                            <div className="co-avatar co-avatar-sm" style={{ background: person.color, overflow: "hidden", padding: 0 }}>
                              {person.photo
                                ? <img src={person.photo} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                                : <FaUser style={{ fontSize: 14, color: "#fff" }} />}
                            </div>
                            <div>
                              <div className="co-person-name">{person.name}</div>
                              <div className="co-muted">{person.role}</div>
                            </div>
                            <span className={`co-cast-badge co-cast-${key}`}>{label}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="co-modal-close-row">
              <button className="co-gold-btn" onClick={onClose}>Close Results</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
