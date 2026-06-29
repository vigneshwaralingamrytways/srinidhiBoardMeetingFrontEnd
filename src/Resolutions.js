import { useState, useMemo } from "react";
import { AGENDA } from "./agenda";
import { USERS } from "./users";
import styles from "./Resolutions.module.css";

/* --- helpers --- */
function voteId(agendaId, idx) {
  return `res-${agendaId}-${idx}`;
}

function toResolution(item, agendaTitle = "Agenda", index) {
  if (typeof item === "string") return { title: item, description: "" };
  if (item?.title) return { title: item.title, description: item.description || "" };
  return {
    title: `Sample Resolution ${index + 1}`,
    description: `Sample resolution linked to ${agendaTitle}.`,
  };
}

function getAgendaSampleResolutions(agenda) {
  const agendaSamples = agenda?.resolutions || agenda?.sampleResolutions || [];
  if (agendaSamples.length > 0) {
    return agendaSamples.map((item, index) => toResolution(item, agenda?.title, index));
  }

  return [
    {
      title: `Approve ${agenda?.title || "Agenda"} Resolution`,
      description: `Resolved that the board approves the matter placed under ${agenda?.title || "this agenda item"}.`,
    },
  ];
}

function getResolutionsFor(work = {}, agendaId) {
  const agenda = AGENDA.find((a) => a.id === agendaId);
  const stored = work[agendaId]?.resolutions;
  return stored?.length ? stored : getAgendaSampleResolutions(agenda);
}

function getResult(votes = {}) {
  const vals = Object.values(votes);
  const approve = vals.filter((v) => v === "Approve").length;
  const reject = vals.filter((v) => v === "Reject").length;
  const abstain = vals.filter((v) => v === "Abstain").length;
  const status = approve > reject && approve > 0 ? "Approved" : vals.length ? "Pending" : "Waiting";
  return { approve, reject, abstain, status, total: vals.length };
}

/* --- VotingModal --- */
function VotingModal({ resolution, agendaTitle, votes, onVote, onAcceptAll, onClose }) {
  const [showResult, setShowResult] = useState(null);
  const itemVotes = votes || {};
  const { approve, reject, abstain, status, total } = getResult(itemVotes);
  const allVoted = total >= USERS.length;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHead}>
          <div>
            <div className={styles.modalTag}>RESOLUTION VOTE</div>
            <h3 className={styles.modalTitle}>{resolution.title}</h3>
            <div className={styles.modalSub}>{agendaTitle}</div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>x</button>
        </div>

        {!allVoted && (
          <>
            <button className={styles.acceptAllBtn} onClick={onAcceptAll}>
              Accepted by All Members
            </button>

            <div className={styles.voterList}>
              {USERS.map((u) => {
                const cast = itemVotes[u.id];
                return (
                  <div key={u.id} className={styles.voterRow}>
                    <div className={styles.voterAv} style={{ background: u.color }}>{u.initials}</div>
                    <div className={styles.voterInfo}>
                      <span className={styles.voterName}>{u.name}</span>
                      <span className={styles.voterRole}>{u.role}</span>
                    </div>
                    {cast && (
                      <span className={[styles.castBadge, styles[`cast_${cast.toLowerCase()}`]].join(" ")}>
                        {cast}
                      </span>
                    )}
                    <div className={styles.voteOpts}>
                      {["Approve", "Reject", "Abstain"].map((opt) => (
                        <button
                          key={opt}
                          className={[styles.voteOptBtn, cast === opt ? styles[`opt_${opt.toLowerCase()}`] : ""].join(" ")}
                          onClick={() => onVote(u.id, opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.liveTally}>
              <div className={styles.tallyChip + " " + styles.tallyApprove}><strong>{approve}</strong><span>Approve</span></div>
              <div className={styles.tallySep} />
              <div className={styles.tallyChip + " " + styles.tallyReject}><strong>{reject}</strong><span>Reject</span></div>
              <div className={styles.tallySep} />
              <div className={styles.tallyChip + " " + styles.tallyAbstain}><strong>{abstain}</strong><span>Abstain</span></div>
            </div>
          </>
        )}

        {allVoted && (
          <div className={styles.resultPhase}>
            <div className={[styles.verdictBanner, status === "Approved" ? styles.verdictApproved : styles.verdictRejected].join(" ")}>
              <span className={styles.verdictIcon}>{status === "Approved" ? "Approved" : "Rejected"}</span>
              <div>
                <strong>{status}</strong>
                <div className={styles.verdictSub}>{approve} approved · {reject} rejected · {abstain} abstained</div>
              </div>
            </div>

            <div className={styles.resultCards}>
              {[{ key: "approve", label: "Approved", list: USERS.filter((u) => itemVotes[u.id] === "Approve") },
                { key: "reject", label: "Rejected", list: USERS.filter((u) => itemVotes[u.id] === "Reject") }].map(({ key, label, list }) => (
                <div
                  key={key}
                  className={[styles.resultCard, styles[`rc_${key}`], showResult === key ? styles.rcOpen : ""].join(" ")}
                  onClick={() => setShowResult(showResult === key ? null : key)}
                >
                  <div className={styles.rcHead}>
                    <span className={[styles.rcLabel, styles[`rcLabel_${key}`]].join(" ")}>{label}</span>
                    <strong className={styles[`rcNum_${key}`]}>{list.length}</strong>
                  </div>
                  {showResult === key && (
                    <div className={styles.rcMembers}>
                      {list.map((u) => (
                        <div key={u.id} className={styles.rcMemberRow}>
                          <div className={styles.rcMemberAv} style={{ background: u.color }}>{u.initials}</div>
                          <span>{u.name}</span>
                        </div>
                      ))}
                      {list.length === 0 && <div className={styles.rcEmpty}>None</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button className={styles.goldBtn} style={{ width: "100%", marginTop: 16 }} onClick={onClose}>Close Results</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* --- Main --- */
export default function Resolutions({ agendaWork = {}, setAgendaWork, votes = {}, setVotes }) {
  const [activeAgendaId, setActiveAgendaId] = useState(AGENDA[0].id);
  const [editingIdx, setEditingIdx] = useState(null);
  const [votingModal, setVotingModal] = useState(null);
  const [inputTitle, setInputTitle] = useState("");
  const [inputDesc, setInputDesc] = useState("");
  const [addingFor, setAddingFor] = useState(null);

  const activeAgenda = AGENDA.find((a) => a.id === activeAgendaId) || AGENDA[0] || {};
  const resolutions = getResolutionsFor(agendaWork, activeAgendaId);

  const totalAll = useMemo(
    () => AGENDA.reduce((s, a) => s + getResolutionsFor(agendaWork, a.id).length, 0),
    [agendaWork]
  );
  const approvedAll = useMemo(
    () => AGENDA.reduce((s, a) =>
      s + getResolutionsFor(agendaWork, a.id).filter((_, i) =>
        getResult(votes[voteId(a.id, i)] || {}).status === "Approved").length, 0),
    [agendaWork, votes]
  );

  /* mutations */
  const addResolution = (agendaId) => {
    if (!inputTitle.trim()) return;
    setAgendaWork((w) => ({
      ...w,
      [agendaId]: {
        ...w[agendaId],
        resolutions: [...getResolutionsFor(w, agendaId), { title: inputTitle.trim(), description: inputDesc.trim() }],
      },
    }));
    setInputTitle("");
    setInputDesc("");
    setAddingFor(null);
  };

  const removeResolution = (agendaId, idx) => {
    setAgendaWork((w) => ({
      ...w,
      [agendaId]: {
        ...w[agendaId],
        resolutions: getResolutionsFor(w, agendaId).filter((_, i) => i !== idx),
      },
    }));
    if (editingIdx === idx) setEditingIdx(null);
  };

  const updateResolution = (agendaId, idx, field, val) => {
    setAgendaWork((w) => ({
      ...w,
      [agendaId]: {
        ...w[agendaId],
        resolutions: getResolutionsFor(w, agendaId).map((r, i) => i === idx ? { ...r, [field]: val } : r),
      },
    }));
  };

  const recordVote = (agendaId, idx, userId, choice) => {
    const id = voteId(agendaId, idx);
    setVotes((v) => ({ ...v, [id]: { ...(v[id] || {}), [userId]: choice } }));
  };

  const acceptAll = (agendaId, idx) => {
    const id = voteId(agendaId, idx);
    const all = Object.fromEntries(USERS.map((u) => [u.id, "Approve"]));
    setVotes((v) => ({ ...v, [id]: all }));
  };

  /* voting modal data */
  const modal = votingModal
    ? { res: getResolutionsFor(agendaWork, votingModal.agendaId)[votingModal.idx], ...votingModal }
    : null;

  return (
    <div className={styles.layout}>
      {/* -- LEFT -- */}
      <div className={styles.leftPanel}>
        <div className={styles.leftHead}>
          <h2 className={styles.heading}>Resolutions</h2>
          <p className={styles.sub}>{totalAll} total · {approvedAll} approved</p>
        </div>

        {/* <button className={styles.goldBtn} style={{ width: "100%", marginBottom: 12, fontSize: 12 }}
          onClick={() => { setAddingFor(activeAgendaId); }}>
          + Add Resolution
        </button> */}

        <div className={styles.agendaNav}>
          {AGENDA.map((a) => {
            const cnt = getResolutionsFor(agendaWork, a.id).length;
            const isActive = a.id === activeAgendaId;
            return (
              <button
                key={a.id}
                className={[styles.agendaNavItem, isActive ? styles.agendaNavActive : ""].join(" ")}
                onClick={() => setActiveAgendaId(a.id)}
              >
                <span className={styles.agendaNavTitle}>{a.title}</span>
                <div className={styles.agendaNavMeta}>
                  <span>{a.duration} min · {a.type}</span>
                  {cnt > 0 && <span className={styles.cntBadge}>{cnt}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* -- RIGHT -- */}
      <div className={styles.rightPanel}>
        {/* agenda header */}
        <div className={styles.agendaHeader}>
          <div className={styles.agendaBreadcrumb}>
            <span className={styles.bcLabel}>AGENDA</span>
            <span className={styles.bcArrow}></span>
            <span className={styles.bcVal}>{activeAgenda.title}</span>
          </div>
          <span className={styles.agendaPresenter}>
            Presenter: <strong>{activeAgenda.presenter}</strong> · {activeAgenda.duration} min
          </span>
        </div>

        {/* add form */}
        {addingFor === activeAgendaId && (
          <div className={styles.addForm}>
            <div className={styles.addFormLabel}>ADD RESOLUTION  {activeAgenda.title}</div>
            <input
              className={styles.inp}
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              placeholder="Resolution title"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && addResolution(activeAgendaId)}
            />
            <textarea
              className={styles.textarea}
              value={inputDesc}
              onChange={(e) => setInputDesc(e.target.value)}
              placeholder="Description (optional)"
              rows={3}
            />
            <div className={styles.addFormActions}>
              <button className={styles.ghostBtn} onClick={() => { setAddingFor(null); setInputTitle(""); setInputDesc(""); }}>Cancel</button>
              <button className={styles.goldBtn} onClick={() => addResolution(activeAgendaId)}>Add Resolution</button>
            </div>
          </div>
        )}

        {/* resolution cards */}
        {resolutions.length === 0 && addingFor !== activeAgendaId ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>§</div>
            <div className={styles.emptyTitle}>No Resolutions Yet</div>
            <div className={styles.emptySub}>Click "+ Add Resolution" to add one for this agenda item.</div>
          </div>
        ) : (
          <div className={styles.resList}>
            {resolutions.map((res, idx) => {
              const vid = voteId(activeAgendaId, idx);
              const result = getResult(votes[vid] || {});
              const pct = USERS.length > 0 ? Math.round((result.total / USERS.length) * 100) : 0;
              const isEditing = editingIdx === idx;

              return (
                <div key={idx} className={styles.resCard}>
                  {/* card header */}
                  <div className={styles.resCardHead}>
                    <div className={styles.resCardNum}>§ {idx + 1}</div>
                    <span className={[styles.statusChip, styles[`st_${result.status.toLowerCase()}`]].join(" ")}>
                      {result.status}
                    </span>
                    <div className={styles.resCardActions}>
                      <button className={styles.ghostBtnSm} onClick={() => setEditingIdx(isEditing ? null : idx)}>
                        {isEditing ? "Done" : "Edit"}
                      </button>
                      <button className={styles.removeBtnSm} onClick={() => removeResolution(activeAgendaId, idx)}>Remove</button>
                    </div>
                  </div>

                  {/* content */}
                  {isEditing ? (
                    <div className={styles.editArea}>
                      <input
                        className={styles.inp}
                        value={res.title}
                        onChange={(e) => updateResolution(activeAgendaId, idx, "title", e.target.value)}
                        placeholder="Resolution title"
                      />
                      <textarea
                        className={styles.textarea}
                        value={res.description}
                        onChange={(e) => updateResolution(activeAgendaId, idx, "description", e.target.value)}
                        placeholder="Description"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <div className={styles.resContent}>
                      <div className={styles.resTitle}>{res.title || <em className={styles.untitled}>Untitled</em>}</div>
                      {res.description && <div className={styles.resDesc}>{res.description}</div>}
                    </div>
                  )}

                  {/* vote progress */}
                  <div className={styles.voteProgressRow}>
                    <div className={styles.voteTrack}>
                      <div className={styles.voteTrackFill} style={{ width: `${pct}%` }} />
                    </div>
                    <span className={styles.voteProgressLabel}>{result.total}/{USERS.length} voted</span>
                  </div>

                  {/* tally */}
                  <div className={styles.tally}>
                    <div className={styles.tallyItem}><strong className={styles.taApprove}>{result.approve}</strong><span>Approve</span></div>
                    <div className={styles.tallySep2} />
                    <div className={styles.tallyItem}><strong className={styles.taReject}>{result.reject}</strong><span>Reject</span></div>
                    <div className={styles.tallySep2} />
                    <div className={styles.tallyItem}><strong className={styles.taAbstain}>{result.abstain}</strong><span>Abstain</span></div>
                  </div>

                  {/* vote actions */}
                  <div className={styles.voteActions}>
                    <button className={styles.acceptAllBtn} onClick={() => acceptAll(activeAgendaId, idx)}>
                      Accepted by All
                    </button>
                    <button className={styles.goldBtn} onClick={() => setVotingModal({ agendaId: activeAgendaId, idx })}>
                      Go for Voting
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* voting modal */}
      {modal && modal.res && (
        <VotingModal
          resolution={modal.res}
          agendaTitle={AGENDA.find((a) => a.id === modal.agendaId)?.title || ""}
          votes={votes[voteId(modal.agendaId, modal.idx)] || {}}
          onVote={(userId, choice) => recordVote(modal.agendaId, modal.idx, userId, choice)}
          onAcceptAll={() => acceptAll(modal.agendaId, modal.idx)}
          onClose={() => setVotingModal(null)}
        />
      )}
    </div>
  );
}
