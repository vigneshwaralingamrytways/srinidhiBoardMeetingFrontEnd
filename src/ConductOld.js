import { useEffect, useMemo, useState, useRef } from "react";
import { DATA } from "./MeetingData";
import "./ConductMeeting.css";
import BoardPack from "./BoardPack";
import { TbRoute } from "react-icons/tb";
import { FaCheck, FaTimes, FaPencilAlt, FaUser, FaFileAlt, FaBalanceScale, FaTasks, FaCrown, FaFilePdf, FaDownload, FaFile, FaTrash } from "react-icons/fa";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
} from "react-icons/fa";


const STEPS = ["DETAILS", "QUORUM", "CHAIRPERSON", "BOARD PACK", "AGENDA", "RESOLUTIONS", "DECISIONS", "TASKS", "MOM"];

const VOTE_OPTIONS = ["Approve", "Reject", "Abstain"];
const ATTENDANCE_MODES = ["physical", "electronic", "absent"];
const TASK_STATUSES = ["Pending", "In Progress", "Done"];

const toObj = (r) => (typeof r === "string" ? { title: r, description: "" } : r);

const normalizeAttendance = (mode) => {
  if (mode === "online") return "electronic";
  if (mode === "offline") return "physical";
  return mode || "absent";
};

const createAttendance = () =>
  Object.fromEntries(DATA.participants.map((p) => [p.id, normalizeAttendance(p.attendance)]));

const createAgendaWork = () =>
  Object.fromEntries(
    DATA.agendaItems.map((item) => [
      item.id,
      {
        note: item.discussion || item.description || "",
        resolutions: (item.resolutions || []).map(toObj),
        decisions: (item.decisions || []).map(toObj),
        resolutionInput: { title: "", description: "", categoryType: "" },
        decisionInput: { title: "", description: "" },
        tasks: (item.tasks || []).map((t) => ({ ...t })),
      },
    ])
  );


const createChairVotes = () => ({ ...(DATA.chairpersonElection?.votes || {}) });

const createAgendaAcknowledgements = () => ({ ...(DATA.agendaAcknowledgements || {}) });

const createSavedMoms = () => DATA.previousMoms || [];

const createMomAcknowledgements = () => {
  const fromMoms = Object.fromEntries(
    (DATA.previousMoms || []).map((mom) => [mom.id, mom.acknowledgements || {}])
  );
  return { ...fromMoms, ...(DATA.momAcknowledgements || {}) };
};

export default function ConductMeeting({ onEditMeeting }) {
  const [step, setStep] = useState(0);
  const [meeting, setMeeting] = useState(null);
  const [activeAgendaId, setActiveAgendaId] = useState(DATA.agendaItems[0]?.id);
  const [resAgendaId, setResAgendaId] = useState(DATA.agendaItems[0]?.id);
  const [decAgendaId, setDecAgendaId] = useState(DATA.agendaItems[0]?.id);
  const [attendance, setAttendance] = useState(createAttendance);
  const [agendaWork, setAgendaWork] = useState(createAgendaWork);
  const [votes, setVotes] = useState({});
  const [chairVotes, setChairVotes] = useState(createChairVotes);
  const [signed, setSigned] = useState({});
  const [finished, setFinished] = useState(false);
  const [savedMoms, setSavedMoms] = useState(createSavedMoms);
  const [momAcknowledgements, setMomAcknowledgements] = useState(createMomAcknowledgements);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [timerStopped, setTimerStopped] = useState(false);
  const [votingModal, setVotingModal] = useState(null);
  const [momData, setMomData] = useState({ chairperson: "", secretary: "", notes: "", actionItems: "" });
  const [editedMeetings, setEditedMeetings] = useState({});
  const [selectedBoardPack, setSelectedBoardPack] = useState([]);
  const [agendaAcknowledgements, setAgendaAcknowledgements] = useState(createAgendaAcknowledgements);
  const [meetingCancelled, setMeetingCancelled] = useState(false);
  const [showAckWarning, setShowAckWarning] = useState(false);
  const [viewDoc, setViewDoc] = useState(null);
  const [boardPackAcks, setBoardPackAcks] = useState({});
  const activeAgenda = DATA.agendaItems.find((i) => i.id === activeAgendaId) || DATA.agendaItems[0];
  const activeWork = agendaWork[activeAgenda?.id] || {
    note: "", resolutions: [], decisions: [], tasks: [],
    resolutionInput: { title: "", description: "" },
    decisionInput: { title: "", description: "" },
  };

  /* Add this hook at the top of your ConductMeeting component */
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const voteItems = useMemo(
    () =>
      DATA.agendaItems.flatMap((agenda) => {
        const work = agendaWork[agenda.id] || {};
        return (work.resolutions || []).map((res, index) => ({
          id: getVoteItemId("resolution", agenda.id, index),
          type: "Resolution",
          agendaId: agenda.id,
          agendaTitle: agenda.title,
          title: res.title || "",
        }));
      }),
    [agendaWork]
  );

  const approvedItems = voteItems.filter((i) => getVoteResult(i.id, votes).status === "Approved");
  const selectedMeeting = meeting ? { ...meeting, ...(editedMeetings[meeting.id] || {}) } : null;

  useEffect(() => {
    if (!meeting || timerStopped || finished) return undefined;
    const t = setInterval(() => setDurationSeconds((c) => c + 1), 1000);
    return () => clearInterval(t);
  }, [meeting, timerStopped, finished]);

  /* -- Helpers -- */
  const chooseMeeting = (item) => {
    setMeeting(item);
    setStep(0); setFinished(false); setDurationSeconds(0); setTimerStopped(false);
    setVotes({}); setSigned({}); setAgendaAcknowledgements(createAgendaAcknowledgements()); setMeetingCancelled(false); setShowAckWarning(false); setChairVotes(createChairVotes()); setMomAcknowledgements(createMomAcknowledgements());
    setAttendance(createAttendance()); setAgendaWork(createAgendaWork()); setSavedMoms(createSavedMoms());
    setMomData({ chairperson: DATA.chairpersonElection?.electedPersonId || "", secretary: "", notes: "", actionItems: "" });
    setActiveAgendaId(DATA.agendaItems[0]?.id);
    setResAgendaId(DATA.agendaItems[0]?.id);
    setDecAgendaId(DATA.agendaItems[0]?.id);
  };

  const goToStep = (nextStep) => {
    if (!meeting) return;
    if (nextStep >= 9) setTimerStopped(true);
    setStep(nextStep);
  };

  const resetToMeetingList = () => {
    setMeeting(null); setStep(0); setFinished(false); setDurationSeconds(0); setTimerStopped(false);
    setVotes({}); setSigned({}); setAgendaAcknowledgements(createAgendaAcknowledgements()); setMeetingCancelled(false); setShowAckWarning(false); setChairVotes(createChairVotes()); setMomAcknowledgements(createMomAcknowledgements());
    setAttendance(createAttendance()); setAgendaWork(createAgendaWork()); setSavedMoms(createSavedMoms());
    setMomData({ chairperson: DATA.chairpersonElection?.electedPersonId || "", secretary: "", notes: "", actionItems: "" });
    setActiveAgendaId(DATA.agendaItems[0]?.id);
    setResAgendaId(DATA.agendaItems[0]?.id);
    setDecAgendaId(DATA.agendaItems[0]?.id);
  };

  /* -- Agenda work mutations -- */
  const updateAgendaField = (agendaId, key, value) =>
    setAgendaWork((cur) => ({ ...cur, [agendaId]: { ...cur[agendaId], [key]: value } }));

  const updateInputField = (agendaId, inputKey, field, value) =>
    setAgendaWork((cur) => ({
      ...cur,
      [agendaId]: {
        ...cur[agendaId],
        [inputKey]: { ...(cur[agendaId]?.[inputKey] || { title: "", description: "" }), [field]: value },
      },
    }));

  const addOutput = (agendaId, key, inputKey) => {
    const inp = agendaWork[agendaId]?.[inputKey] || { title: "", description: "", categoryType: "" };
    if (!inp.title.trim()) return;
    const newItem = { title: inp.title.trim(), description: inp.description.trim() };
    if (inputKey === "resolutionInput") newItem.categoryType = inp.categoryType || "";
    setAgendaWork((cur) => ({
      ...cur,
      [agendaId]: {
        ...cur[agendaId],
        [key]: [...(cur[agendaId][key] || []), newItem],
        [inputKey]: inputKey === "resolutionInput"
          ? { title: "", description: "", categoryType: "" }
          : { title: "", description: "" },
      },
    }));
  };

  const updateOutput = (agendaId, key, index, field, value) =>
    setAgendaWork((cur) => ({
      ...cur,
      [agendaId]: {
        ...cur[agendaId],
        [key]: cur[agendaId][key].map((it, i) => i === index ? { ...it, [field]: value } : it),
      },
    }));

  const removeOutput = (agendaId, key, index) =>
    setAgendaWork((cur) => ({
      ...cur,
      [agendaId]: { ...cur[agendaId], [key]: cur[agendaId][key].filter((_, i) => i !== index) },
    }));

  /* -- Task mutations -- */
  const addTask = (agendaId, task) =>
    setAgendaWork((cur) => ({
      ...cur,
      [agendaId]: {
        ...cur[agendaId],
        tasks: [...(cur[agendaId].tasks || []), { id: Date.now() + Math.random(), ...task }],
      },
    }));

  const updateTask = (agendaId, taskId, field, value) =>
    setAgendaWork((cur) => ({
      ...cur,
      [agendaId]: {
        ...cur[agendaId],
        tasks: (cur[agendaId].tasks || []).map((t) =>
          t.id === taskId ? { ...t, [field]: value } : t
        ),
      },
    }));

  const removeTask = (agendaId, taskId) =>
    setAgendaWork((cur) => ({
      ...cur,
      [agendaId]: {
        ...cur[agendaId],
        tasks: (cur[agendaId].tasks || []).filter((t) => t.id !== taskId),
      },
    }));

  /* -- Voting -- */
  const recordVote = (itemId, participantId, choice) =>
    setVotes((cur) => ({ ...cur, [itemId]: { ...(cur[itemId] || {}), [participantId]: choice } }));

  const acceptAllMembers = (itemId) => {
    const all = {};
    DATA.participants.forEach((p) => { all[p.id] = "Approve"; });
    setVotes((cur) => ({ ...cur, [itemId]: all }));
  };

  const finishMeeting = () => { setTimerStopped(true); setFinished(true); };

  const toggleAgendaAck = (agendaId, participantId) => {
    setAgendaAcknowledgements((cur) => {
      const existing = cur[agendaId] || {};
      return { ...cur, [agendaId]: { ...existing, [participantId]: !existing[participantId] } };
    });
  };

  const ackAllAgenda = (agendaId) => {
    const all = {};
    DATA.participants.forEach((p) => { all[p.id] = true; });
    setAgendaAcknowledgements((cur) => ({ ...cur, [agendaId]: all }));
  };

  const allAgendaAcknowledged = () => {
    const present = DATA.participants.filter(
      (p) => attendance[p.id] === "physical" || attendance[p.id] === "electronic"
    );
    if (present.length === 0) return true;
    return DATA.agendaItems.every((item) => {
      const acks = agendaAcknowledgements[item.id] || {};
      return present.every((p) => acks[p.id]);
    });
  };

  const modalItem = votingModal ? voteItems.find((i) => i.id === votingModal.id) || votingModal : null;

  const taskProps = { participants: DATA.participants, addTask, updateTask, removeTask };

  const outputStepProps = (type) => ({
    agendaItems: DATA.agendaItems,
    agendaWork,
    participants: DATA.participants,
    votes,
    recordVote,
    acceptAllMembers,
    openVotingModal: setVotingModal,
    activeAgendaId: type === "resolution" ? resAgendaId : decAgendaId,
    setActiveAgendaId: type === "resolution" ? setResAgendaId : setDecAgendaId,
    addOutput,
    updateOutput,
    removeOutput,
    updateInputField,
    showVoting: type === "resolution",
    type,
    goToStep,
    ...taskProps,
  });

  const displayMeetings = DATA.meetings.map((m) =>
    editedMeetings[m.id] ? { ...m, ...editedMeetings[m.id] } : m
  );

  return (
    <div className="co-shell">
      {votingModal && modalItem && (
        <VotingModal
          item={modalItem}
          participants={DATA.participants}
          votes={votes}
          recordVote={recordVote}
          onAcceptAll={() => acceptAllMembers(modalItem.id)}
          onClose={() => setVotingModal(null)}
        />
      )}

      {viewDoc && (
        <BoardPackDocModal
          doc={viewDoc}
          participants={DATA.participants}
          acks={boardPackAcks}
          setAcks={setBoardPackAcks}
          onClose={() => setViewDoc(null)}
        />
      )}

      <main className="co-main" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        <div className="co-head" style={{ padding: "0", marginBottom: 4, marginTop: -16, flexShrink: 0 }}>
          {meeting && <button className="co-ghost-btn" onClick={resetToMeetingList}>Meeting List</button>}
          <button
            className="co-theme-toggle"
            onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        </div>

        {finished ? (
          <SuccessSummary
            meeting={selectedMeeting} participants={DATA.participants} attendance={attendance}
            agendaItems={DATA.agendaItems} voteItems={voteItems} approvedItems={approvedItems}
            signed={signed} votes={votes} durationSeconds={durationSeconds}
            agendaWork={agendaWork}
            onBack={() => setFinished(false)} onNextMeeting={resetToMeetingList}
          />
        ) : (
          <>
            {!meeting && (
              <MeetingList
                meetings={displayMeetings}
                onSelect={chooseMeeting}
                onEdit={(m) => onEditMeeting && onEditMeeting(m)}
              />
            )}

            {meeting && (
              <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", minHeight: 0 }}>
                <Wizard step={step} setStep={goToStep} />

                <div style={{ flex: 1, overflowY: "auto", minHeight: 0, scrollbarWidth: "thin", scrollbarColor: "rgba(212,168,83,0.2) transparent" }}>
                  {step === 0 && (
                    <MeetingDetails meeting={selectedMeeting} durationSeconds={durationSeconds} timerStopped={timerStopped} />
                  )}
                  {step === 1 && (
                    <Attendance participants={DATA.participants} attendance={attendance} setAttendance={setAttendance} />
                  )}
                  {step === 2 && (
                    <ChairpersonElection
                      participants={DATA.participants}
                      attendance={attendance}
                      chairVotes={chairVotes}
                      setChairVotes={setChairVotes}
                    />
                  )}
                  {step === 3 && (
                    <section className="co-panel">
                      <BoardPack
                        selected={selectedBoardPack}
                        setSelected={setSelectedBoardPack}
                        onDocClick={(doc) => setViewDoc(doc)}
                      />

                      {/* SIGNED SECTION  commented out
    {selectedBoardPack.length > 0 && (
      <div style={{ marginTop: 28, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 24 }}>
        <div className="co-panel-head" style={{ marginBottom: 18 }}>
          <div>
            <h2>Sign Documents</h2>
            <p>Collect participant signatures for the selected board pack documents</p>
          </div>
          <span style={{
            background: "rgba(212,168,83,0.10)",
            color: "#D4A853",
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 999,
            letterSpacing: "0.06em",
          }}>
            {selectedBoardPack.length} DOC{selectedBoardPack.length > 1 ? "S" : ""}
          </span>
        </div>
        {selectedBoardPack.map((doc) => {
          const docKey = doc.id ?? doc.name ?? doc;
          const docLabel = doc.name || doc.title || doc;
          return (
            <div key={docKey} className="co-sign-card">
              <div>
                <b>{docLabel}</b>
                <span>Board Pack Document</span>
              </div>
              <div className="co-signer-grid">
                {DATA.participants.map((person) => {
                  const signKey = `bp-${docKey}-${person.id}`;
                  return (
                    <button
                      key={person.id}
                      className={signed[signKey] ? "signed" : ""}
                      onClick={() => setSigned((cur) => ({ ...cur, [signKey]: !cur[signKey] }))}
                    >
                      {person.initials} {signed[signKey] ? " Signed" : "Pending"}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    )}
    */}
                    </section>
                  )}


                  {step === 4 && (
                    <AgendaDiscussion
                      agendaItems={DATA.agendaItems}
                      agendaWork={agendaWork}
                      activeAgenda={activeAgenda}
                      activeWork={activeWork}
                      setActiveAgendaId={(id) => setActiveAgendaId(id)}
                      updateNote={(val) => updateAgendaField(activeAgenda.id, "note", val)}
                      goToStep={goToStep}
                      setResAgendaId={setResAgendaId}
                      setDecAgendaId={setDecAgendaId}
                      participants={DATA.participants}
                      attendance={attendance}
                      agendaAcknowledgements={agendaAcknowledgements}
                      toggleAgendaAck={toggleAgendaAck}
                      ackAllAgenda={ackAllAgenda}
                      {...taskProps}
                    />
                  )}

                  {/* Agenda Ack Warning Modal */}
                  {showAckWarning && (
                    <div className="co-modal-overlay">
                      <div className="co-modal" style={{ padding: "32px 28px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: "50%", display: "grid", placeItems: "center",
                            background: "rgba(220,80,80,0.15)", color: "#e06060", fontSize: 20, fontWeight: 900, flexShrink: 0,
                          }}>!</div>
                          <div>
                            <div style={{ color: "#fff", fontSize: 16, fontWeight: 800, marginBottom: 4 }}>
                              Agenda Not Fully Acknowledged
                            </div>
                            <div style={{ color: "#596197", fontSize: 13 }}>
                              Not all present participants have acknowledged every agenda item. The meeting cannot proceed without full acknowledgement.
                            </div>
                          </div>
                        </div>
                        <div style={{
                          padding: "14px 16px", borderRadius: 12,
                          background: "rgba(220,80,80,0.06)", border: "1px solid rgba(220,80,80,0.18)",
                          color: "#c07070", fontSize: 12, lineHeight: 1.7, marginBottom: 22,
                        }}>
                          {DATA.agendaItems.map((item) => {
                            const present = DATA.participants.filter(
                              (p) => attendance[p.id] === "physical" || attendance[p.id] === "electronic"
                            );
                            const acks = agendaAcknowledgements[item.id] || {};
                            const pending = present.filter((p) => !acks[p.id]);
                            if (pending.length === 0) return null;
                            return (
                              <div key={item.id} style={{ marginBottom: 6 }}>
                                <span style={{ color: "#d4a853", fontWeight: 700 }}>{item.title}</span>
                                <span style={{ marginLeft: 8 }}>â {pending.map((p) => p.name).join(", ")} pending</span>
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                          <button className="co-ghost-btn" onClick={() => setShowAckWarning(false)}>Go Back</button>
                          <button
                            className="co-ghost-btn"
                            style={{ borderColor: "rgba(220,80,80,0.35)", color: "#e06060" }}
                            onClick={() => { setShowAckWarning(false); setMeetingCancelled(true); setTimerStopped(true); }}
                          >
                            Cancel Meeting
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Meeting Cancelled Screen */}
                {meetingCancelled && (
                  <div style={{
                    marginTop: 32, padding: "48px 32px",
                    border: "1px solid rgba(220,80,80,0.22)", borderRadius: 24,
                    background: "#0d1028", textAlign: "center",
                  }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: "50%", background: "rgba(220,80,80,0.15)",
                      color: "#e06060", fontSize: 26, fontWeight: 900,
                      display: "grid", placeItems: "center", margin: "0 auto 20px",
                    }}>?</div>
                    <div style={{ color: "#e06060", fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Meeting Cancelled</div>
                    <div style={{ color: "#596197", fontSize: 14, marginBottom: 32 }}>
                      This meeting was cancelled because not all agenda items were acknowledged by the required participants.
                    </div>
                    <button className="co-ghost-btn" onClick={resetToMeetingList}>Back to Meeting List</button>
                  </div>
                )}
                {step === 5 && <OutputStep {...outputStepProps("resolution")} />}
                {step === 6 && <OutputStep {...outputStepProps("decision")} />}
                {step === 7 && (
                  <TasksOverview
                    agendaItems={DATA.agendaItems}
                    agendaWork={agendaWork}
                    participants={DATA.participants}
                    updateTask={updateTask}
                    addTask={addTask}
                    removeTask={removeTask}
                  />
                )}
                {step === 8 && (
                  <MOM
                    agendaItems={DATA.agendaItems}
                    agendaWork={agendaWork}
                    momData={momData}
                    setMomData={setMomData}
                    savedMoms={savedMoms}
                    setSavedMoms={setSavedMoms}
                    participants={DATA.participants}
                    momAcknowledgements={momAcknowledgements}
                    setMomAcknowledgements={setMomAcknowledgements}
                  />
                )}

                {!meetingCancelled && (
                  <div className="co-footer-actions">
                    <button className="co-ghost-btn" disabled={step === 0} onClick={() => goToStep(Math.max(0, step - 1))}>
                      Back
                    </button>
                    <button
                      className="co-gold-btn"
                      onClick={() => {
                        if (step === STEPS.length - 1) {
                          finishMeeting();
                        } else if (step === 3 && !allAgendaAcknowledged()) {
                          setShowAckWarning(true);
                        } else {
                          goToStep(step + 1);
                        }
                      }}
                    >
                      {step === STEPS.length - 1 ? "Finish Meeting" : "Continue"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}


/* -------------------------------------------------------------------
   TASK SECTION
------------------------------------------------------------------- */
function TaskSection({ agendaId, linkedType, linkedIndex, tasks, participants, addTask, updateTask, removeTask }) {
  const [input, setInput] = useState({ title: "", assigneeId: "", dueDate: "", status: "Pending" });
  const [collapsed, setCollapsed] = useState(false);

  const filteredTasks = (tasks || []).filter(
    (t) => t.linkedType === linkedType && t.linkedIndex === linkedIndex
  );

  const handleAdd = () => {
    if (!input.title.trim()) return;
    addTask(agendaId, {
      title: input.title.trim(),
      assigneeId: input.assigneeId,
      dueDate: input.dueDate,
      status: input.status,
      linkedType,
      linkedIndex,
    });
    setInput({ title: "", assigneeId: "", dueDate: "", status: "Pending" });
  };

  const statusColor = (s) => {
    if (s === "Done") return "#4ade80";
    if (s === "In Progress") return "#D4A853";
    return "#7a83b8";
  };

  return (
    <div style={{ marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: collapsed ? 0 : 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FaTasks style={{ color: "#D4A853", fontSize: 12 }} />
          <label className="co-label" style={{ margin: 0 }}>
            TASKS
            {filteredTasks.length > 0 && (
              <span style={{
                marginLeft: 8, background: "rgba(212,168,83,0.15)", color: "#D4A853",
                fontSize: 10, padding: "2px 7px", borderRadius: 20, fontWeight: 700,
              }}>
                {filteredTasks.length}
              </span>
            )}
          </label>
        </div>
        <button
          className="co-ghost-btn"
          style={{ fontSize: 11, padding: "4px 10px" }}
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? "Show" : "Hide"}
        </button>
      </div>

      {!collapsed && (
        <>
          <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
            <input
              className="co-input"
              value={input.title}
              onChange={(e) => setInput((s) => ({ ...s, title: e.target.value }))}
              placeholder="Task title"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <select
                className="co-input"
                style={{ flex: 1, minWidth: 140 }}
                value={input.assigneeId}
                onChange={(e) => setInput((s) => ({ ...s, assigneeId: e.target.value }))}
              >
                <option value="">Assign toâ¦</option>
                {participants.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <input
                className="co-input"
                type="date"
                style={{ flex: 1, minWidth: 130 }}
                value={input.dueDate}
                onChange={(e) => setInput((s) => ({ ...s, dueDate: e.target.value }))}
              />
              <button className="co-gold-btn" onClick={handleAdd} style={{ whiteSpace: "nowrap" }}>
                Add Task
              </button>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="co-muted" style={{ fontSize: 12, fontStyle: "italic", paddingBottom: 4 }}>
              No tasks assigned yet. Add one above.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredTasks.map((task) => {
                const assignee = participants.find((p) => p.id === task.assigneeId);
                return (
                  <div
                    key={task.id}
                    style={{
                      background: "#080b1d",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 12,
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: statusColor(task.status),
                      marginTop: 5, flexShrink: 0,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                        <span style={{ color: "#f4f0ff", fontWeight: 600, fontSize: 13 }}>{task.title}</span>
                        <select
                          className="co-input"
                          style={{ width: "auto", fontSize: 11, padding: "3px 8px", minWidth: 100 }}
                          value={task.status}
                          onChange={(e) => updateTask(agendaId, task.id, "status", e.target.value)}
                        >
                          {TASK_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        {assignee ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div className="co-avatar co-avatar-sm" style={{ background: assignee.color, overflow: "hidden", padding: 0, width: 20, height: 20 }}>
                              <img src={assignee.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(assignee.name)}&background=0D1117&color=fff`} alt={assignee.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                            </div>
                            <span className="co-muted" style={{ fontSize: 11 }}>{assignee.name}</span>
                          </div>
                        ) : (
                          <span className="co-muted" style={{ fontSize: 11 }}>Unassigned</span>
                        )}
                        <select
                          className="co-input"
                          style={{ fontSize: 11, padding: "3px 8px", width: "auto", minWidth: 120 }}
                          value={task.assigneeId || ""}
                          onChange={(e) => updateTask(agendaId, task.id, "assigneeId", e.target.value)}
                        >
                          <option value="">Reassignâ¦</option>
                          {participants.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        {task.dueDate && (
                          <span className="co-muted" style={{ fontSize: 11 }}>Due: {task.dueDate}</span>
                        )}
                        <input
                          className="co-input"
                          type="date"
                          style={{ fontSize: 11, padding: "3px 8px", width: "auto" }}
                          value={task.dueDate || ""}
                          onChange={(e) => updateTask(agendaId, task.id, "dueDate", e.target.value)}
                        />
                      </div>
                    </div>
                    <button className="co-rich-remove-btn" style={{ flexShrink: 0 }} onClick={() => removeTask(agendaId, task.id)}>
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------
   VOTING MODAL
------------------------------------------------------------------- */
function VotingModal({ item, participants, votes, recordVote, onAcceptAll, onClose }) {
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
                  {approved.length} accepted Â· {rejected.length} rejected Â· {participants.length} total
                </div>
              </div>
            </div>

            <div className="co-modal-result-cards">
              {[
                { key: "approve", label: "Accepted", icon: <FaCheck />, list: approved },
                { key: "reject", label: "Rejected", icon: <FaTimes />, list: rejected },
              ].map(({ key, label, icon, list }) => (
                <div
                  key={key}
                  className={`co-modal-result-card ${key} ${resultView === key ? "open" : ""}`}
                  onClick={() => setResultView(resultView === key ? null : key)}
                >
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

/* -------------------------------------------------------------------
   WIZARD
------------------------------------------------------------------- */
function Wizard({ step, setStep }) {
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

/* -------------------------------------------------------------------
   MEETING LIST
------------------------------------------------------------------- */
function MeetingList({ meetings, onSelect, onEdit }) {
  const [activeCompany, setActiveCompany] = useState("All");

  const companies = useMemo(() => {
    const unique = [...new Set(meetings.map((m) => m.company).filter(Boolean))];
    return ["All", ...unique];
  }, [meetings]);

  const filtered = activeCompany === "All"
    ? meetings
    : meetings.filter((m) => m.company === activeCompany);

  return (
    <section className="co-panel" style={{ marginTop: -12 }}>
      <div className="co-panel-head" style={{ marginBottom: 12 }}>
        <div>
          <h2>Meeting List</h2>
          <p>Select the active meeting to start the conduct wizard</p>
        </div>
      </div>

      {companies.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {companies.map((company) => {
            const isActive = activeCompany === company;
            const count = company === "All" ? meetings.length : meetings.filter((m) => m.company === company).length;
            return (
              <button
                key={company}
                onClick={() => setActiveCompany(company)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "6px 14px", borderRadius: 999,
                  border: isActive ? "1.5px solid #D4A853" : "1.5px solid rgba(255,255,255,0.08)",
                  background: isActive ? "rgba(212,168,83,0.13)" : "rgba(255,255,255,0.03)",
                  color: isActive ? "#D4A853" : "#596197",
                  fontSize: 12, fontWeight: isActive ? 700 : 500, cursor: "pointer",
                  transition: "all 0.18s ease", letterSpacing: isActive ? "0.04em" : "0.02em",
                }}
              >
                {company !== "All" && (
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: isActive ? "#D4A853" : "#596197", flexShrink: 0, transition: "background 0.18s ease" }} />
                )}
                {company}
                <span style={{
                  background: isActive ? "rgba(212,168,83,0.18)" : "rgba(255,255,255,0.06)",
                  color: isActive ? "#D4A853" : "#7a83b8",
                  borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 700,
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="co-output-empty-state">
          <div className="co-output-empty-title">No Meetings Found</div>
          <div className="co-output-empty-sub">No meetings are linked to <strong style={{ color: "#D4A853" }}>{activeCompany}</strong>.</div>
        </div>
      ) : (
        <div className="co-meeting-grid" style={{ maxHeight: 520, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "thin", scrollbarColor: "rgba(212,168,83,0.2) transparent", paddingRight: 4, marginTop: -4 }}>
          {filtered.slice(0, 3).map((item) => (
            <div key={item.id} className="co-meeting-card-wrap">
              <button className="co-meeting-card" onClick={() => onSelect(item)}>
                <div>
                  <div className="co-meeting-title">{item.title}</div>
                  <div className="co-muted">{item.type || "Board Meeting"} / {item.date} / {item.time}</div>
                  {item.company && (
                    <div style={{ marginTop: 6 }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        background: "rgba(212,168,83,0.08)", border: "1px solid rgba(212,168,83,0.18)",
                        color: "#D4A853", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                        padding: "3px 10px", borderRadius: 999,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#D4A853" }} />
                        {item.company}
                      </span>
                    </div>
                  )}
                </div>
                <div className="co-meeting-meta">
                  <span>{item.location}</span>
                  <b>{item.status}</b>
                </div>
              </button>
              <button className="co-meeting-edit-btn" onClick={(e) => { e.stopPropagation(); onEdit(item); }} title="Edit meeting details">
                <FaPencilAlt />
                <span>Edit</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------
   MEETING DETAILS
------------------------------------------------------------------- */
function MeetingDetails({ meeting, durationSeconds, timerStopped }) {
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

function Field({ label, value, wide, large }) {
  return (
    <div className={wide ? "co-field wide" : "co-field"}>
      <label>{label}</label>
      <div className={large ? "co-input large" : "co-input"}>{value}</div>
    </div>
  );
}

/* -------------------------------------------------------------------
   ATTENDANCE
------------------------------------------------------------------- */
function Attendance({ participants, attendance, setAttendance }) {
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
              <img src={person.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=0D1117&color=fff`} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
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
/* -------------------------------------------------------------------
   CHAIRPERSON ELECTION  ? REDESIGNED: Select ? Confirm ? Elected (solo)
------------------------------------------------------------------- */
function ChairpersonElection({ participants, attendance, chairVotes, setChairVotes }) {
  const present = participants.filter(
    (p) => attendance[p.id] === "physical" || attendance[p.id] === "electronic"
  );

  // Phase: "select" | "elected"
  const [phase, setPhase] = useState("select");
  const [selectedId, setSelectedId] = useState(null);
  const [electedId, setElectedId] = useState(() => {
    // Pre-populate from DATA if already set
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

  const handleSelect = (uid) => {
    setSelectedId((prev) => (prev === uid ? null : uid));
  };

  const handleElect = () => {
    if (!selectedId) return;
    // Record all present members as voting for selected (or just store selection)
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
      {/* Header */}
      <div className="co-panel-head">
        <div>
          <h2>Chairperson Selection</h2>
          <p>Select a member to chair this meeting</p>
        </div>
        {phase === "elected" && (
          <button className="co-ghost-btn" onClick={handleChange}>Change Chairperson</button>
        )}
      </div>

      {/* Mini step indicator */}
      <div style={{ display: "flex", gap: 0, marginBottom: 28, background: "#080a1c", borderRadius: 14, border: "1px solid rgba(212,168,83,0.10)", overflow: "hidden" }}>
        {STEPS_CHAIR.map((label, i) => {
          const stepIdx = phase === "select" ? 0 : 1;
          const isDone = stepIdx > i;
          const isActive = stepIdx === i;
          return (
            <div key={label} style={{
              flex: 1, display: "flex", alignItems: "center", gap: 10,
              padding: "12px 18px",
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

      {/* -- Phase: SELECT -- */}
      {phase === "select" && (
        <>
          <p style={{ color: "#596197", fontSize: 13, marginBottom: 20 }}>
            Click on a member to select them as chairperson, then confirm below.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
            {present.map((p) => {
              const isSelected = selectedId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  style={{
                    position: "relative", display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 10, padding: "20px 14px 16px",
                    background: isSelected ? "rgba(212,168,83,0.12)" : "rgba(255,255,255,0.03)",
                    border: isSelected ? "1.5px solid #D4A853" : "1.5px solid rgba(255,255,255,0.07)",
                    borderRadius: 18, cursor: "pointer",
                    transition: "all 0.18s ease",
                    boxShadow: isSelected ? "0 0 24px rgba(212,168,83,0.15)" : "none",
                    outline: "none",
                  }}
                >
                  {/* Selected ring */}
                  {isSelected && (
                    <div style={{
                      position: "absolute", inset: -3, borderRadius: 21,
                      border: "2px solid rgba(212,168,83,0.35)", pointerEvents: "none",
                    }} />
                  )}

                  {/* Avatar */}
                  <div style={{
                    width: 58, height: 58, borderRadius: "50%",
                    border: isSelected ? "2.5px solid #D4A853" : "2px solid rgba(255,255,255,0.10)",
                    overflow: "hidden", background: p.color,
                    boxShadow: isSelected ? "0 0 18px rgba(212,168,83,0.30)" : "none",
                    transition: "all 0.18s ease",
                    flexShrink: 0,
                  }}>
                    <img
                      src={p.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0D1117&color=fff`}
                      alt={p.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  {/* Name & role */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: isSelected ? "#f4f0ff" : "#c8cde8", fontWeight: 700, fontSize: 13, marginBottom: 3 }}>
                      {p.name}
                    </div>
                    <div style={{ color: "#596197", fontSize: 11, textTransform: "capitalize" }}>{p.role}</div>
                  </div>

                  {/* Badge */}
                  {isSelected ? (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      background: "#D4A853", color: "#080b1d",
                      fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 99,
                      letterSpacing: "0.08em",
                    }}>
                      <FaCheck style={{ fontSize: 8 }} /> SELECTED
                    </span>
                  ) : (
                    <span style={{ color: "#3d4570", fontSize: 11, fontStyle: "italic" }}>Click to select</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 18px", borderRadius: 14,
            background: "#080a1c", border: "1px solid rgba(212,168,83,0.10)",
            flexWrap: "wrap", gap: 12,
          }}>
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
            <button
              className="co-gold-btn"
              disabled={!selectedId}
              onClick={handleElect}
              style={{ opacity: selectedId ? 1 : 0.4 }}
            >
              Confirm as Chairperson
            </button>
          </div>
        </>
      )}

      {/* -- Phase: ELECTED -- */}
      {phase === "elected" && electedPerson && (
        <div>
          {/* Elected hero card */}
          <div style={{
            position: "relative", borderRadius: 20, overflow: "hidden",
            background: "linear-gradient(135deg, rgba(212,168,83,0.15) 0%, rgba(212,168,83,0.04) 100%)",
            border: "1.5px solid rgba(212,168,83,0.40)",
            marginBottom: 24,
          }}>
            {/* Crown watermark */}
            <div style={{
              position: "absolute", top: 12, right: 20, fontSize: 72,
              opacity: 0.06, color: "#D4A853", pointerEvents: "none",
            }}>
              <FaCrown />
            </div>

            <div style={{ padding: "32px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
              {/* Avatar with crown badge */}
              <div style={{ position: "relative" }}>
                <div style={{
                  width: 88, height: 88, borderRadius: "50%",
                  border: "3px solid #D4A853",
                  overflow: "hidden", background: electedPerson.color,
                  boxShadow: "0 0 32px rgba(212,168,83,0.30)",
                }}>
                  <img
                    src={electedPerson.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(electedPerson.name)}&background=0D1117&color=fff`}
                    alt={electedPerson.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{
                  position: "absolute", bottom: -4, right: -4,
                  width: 28, height: 28, borderRadius: "50%",
                  background: "#D4A853", display: "grid", placeItems: "center",
                  fontSize: 12, color: "#080b1d",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
                }}>
                  <FaCrown />
                </div>
              </div>

              {/* Label */}
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", color: "#D4A853", textTransform: "uppercase" }}>
                Meeting Chairperson
              </div>

              {/* Name */}
              <div style={{ color: "#f4f0ff", fontSize: 22, fontWeight: 900, lineHeight: 1.2 }}>
                {electedPerson.name}
              </div>
              <div style={{ color: "#7a83b8", fontSize: 13, textTransform: "capitalize" }}>{electedPerson.role}</div>

              {/* Confirmed badge */}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(212,168,83,0.18)", color: "#D4A853",
                border: "1px solid rgba(212,168,83,0.35)",
                fontSize: 11, fontWeight: 800, padding: "5px 16px", borderRadius: 99,
                letterSpacing: "0.1em",
              }}>
                <FaCheck style={{ fontSize: 9 }} /> CONFIRMED
              </span>
            </div>
          </div>

          {/* Elected time stamp */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            color: "#4e568e", fontSize: 11, marginBottom: 8,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
            Chairperson confirmed for this session
          </div>
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------
   AGENDA DISCUSSION 
------------------------------------------------------------------- */
function AgendaDiscussion({
  agendaItems, agendaWork, activeAgenda, activeWork,
  setActiveAgendaId, updateNote,
  goToStep, setResAgendaId, setDecAgendaId,
  participants, attendance,
  agendaAcknowledgements, toggleAgendaAck, ackAllAgenda,
  addTask, updateTask, removeTask,
}) {
  const [showAckPanel, setShowAckPanel] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDraft, setEditDraft] = useState({});

  const handleNavigateToRes = (agendaId) => { setResAgendaId(agendaId); goToStep(5); };
  const handleNavigateToDec = (agendaId) => { setDecAgendaId(agendaId); goToStep(6); };

  const present = participants.filter(
    (p) => attendance[p.id] === "physical" || attendance[p.id] === "electronic"
  );

  const getAckCount = (agendaId) => {
    const acks = agendaAcknowledgements[agendaId] || {};
    return present.filter((p) => acks[p.id]).length;
  };

  const activeAcks = agendaAcknowledgements[activeAgenda.id] || {};
  const ackedList = present.filter((p) => activeAcks[p.id]);
  const pendingList = present.filter((p) => !activeAcks[p.id]);
  const allAcked = present.length > 0 && ackedList.length === present.length;

  // When switching agenda items, reset ack panel to open
  const handleSelectAgenda = (id) => {
    setActiveAgendaId(id);
    setShowAckPanel(false);
    setEditMode(false);
    setEditDraft({});
  };

  const enterEditMode = () => {
    setEditDraft({
      title: activeAgenda.title || "",
      presenter: activeAgenda.presenter || "",
      duration: activeAgenda.duration || "",
      type: activeAgenda.type || "",
      description: activeAgenda.description || "",
      discussion: activeAgenda.discussion || "",
    });
    setEditMode(true);
  };

  const displayAgenda = editMode ? { ...activeAgenda, ...editDraft } : activeAgenda;

  return (
    <section className="co-agenda-layout">
      {/* LEFT â agenda list */}
      <div className="co-panel">
        <div className="co-panel-head">
          <div><h2>Agenda Items</h2><p>Select an item to review</p></div>
        </div>
        <div className="co-agenda-list co-agenda-list-nav">
          {agendaItems.map((item) => {
            const isActive = activeAgenda.id === item.id;
            const taskCount = (agendaWork[item.id]?.tasks || []).filter((t) => t.linkedType === "agenda").length;
            const ackCount = getAckCount(item.id);
            const itemAllAcked = present.length > 0 && ackCount === present.length;
            const ackedParticipants = present.filter((p) => (agendaAcknowledgements[item.id] || {})[p.id]);
            const pendingParticipants = present.filter((p) => !(agendaAcknowledgements[item.id] || {})[p.id]);

            return (
              <div key={item.id} className={`co-agenda-item-wrap ${isActive ? "active" : ""}`}>
                <button
                  className={`co-agenda-item-main ${isActive ? "active" : ""}`}
                  onClick={() => handleSelectAgenda(item.id)}
                >
                  <span className="co-agenda-item-title">{item.title}</span>
                  <em style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span>{item.duration} min / {item.type}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      {taskCount > 0 && (
                        <span className="co-output-step-count">{taskCount} task{taskCount > 1 ? "s" : ""}</span>
                      )}
                      <span style={{
                        fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 999,
                        background: itemAllAcked ? "rgba(77,184,150,0.15)" : "rgba(212,168,83,0.10)",
                        color: itemAllAcked ? "#4db896" : "#d4a853",
                      }}>
                        {ackCount}/{present.length}
                      </span>
                    </span>
                  </em>

                  {/* Inline ack avatar strip in sidebar */}
                  {present.length > 0 && (
                    <div style={{ marginTop: 8, display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                      {ackedParticipants.map((p) => (
                        <div
                          key={p.id}
                          title={`${p.name} â Acknowledged`}
                          style={{
                            width: 20, height: 20, borderRadius: "50%",
                            border: "1.5px solid #4db896",
                            overflow: "hidden", background: p.color, flexShrink: 0,
                          }}
                        >
                          <img src={p.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0D1117&color=fff`} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      ))}
                      {pendingParticipants.map((p) => (
                        <div
                          key={p.id}
                          title={`${p.name} â Pending`}
                          style={{
                            width: 20, height: 20, borderRadius: "50%",
                            border: "1.5px solid rgba(220,80,80,0.4)",
                            overflow: "hidden", background: p.color, flexShrink: 0,
                            opacity: 0.45,
                          }}
                        >
                          <img src={p.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0D1117&color=fff`} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      ))}
                      {itemAllAcked && (
                        <span style={{ color: "#4db896", fontSize: 9, fontWeight: 800, letterSpacing: 1 }}>ALL DONE</span>
                      )}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>


      {/* RIGHT - active agenda */}
      <div className="co-panel co-agenda-full">
        <div className="co-panel-head">
          <div style={{ flex: 1, minWidth: 0 }}>
            {editMode ? (
              <div style={{ display: "grid", gap: 8 }}>
                <input
                  className="co-input"
                  value={editDraft.title}
                  onChange={(e) => setEditDraft((d) => ({ ...d, title: e.target.value }))}
                  placeholder="Agenda title"
                  style={{ fontSize: 15, fontWeight: 700 }}
                />

              </div>
            ) : (
              <>
                <h2>{displayAgenda.title}</h2>


                {displayAgenda.description && (
                  <p style={{ color: "#8b93c8", fontSize: 13, lineHeight: 1.6, marginTop: 4 }}>{displayAgenda.description}</p>
                )}
              </>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <button
              className="co-ghost-btn"
              style={{
                fontSize: 11, padding: "5px 12px",
                borderColor: showAckPanel ? "rgba(212,168,83,0.5)" : "rgba(255,255,255,0.1)",
                color: showAckPanel ? "#d4a853" : "#6670aa",
              }}
              onClick={() => setShowAckPanel((v) => !v)}
            >
              {ackedList.length}/{present.length} Ack'd
            </button>
            {editMode ? (
              <button
                className="co-gold-btn"
                style={{ fontSize: 11, padding: "5px 14px" }}
                onClick={() => setEditMode(false)}
              >
                <FaCheck style={{ fontSize: 9, marginRight: 5 }} />Done
              </button>
            ) : (
              <button
                className="co-ghost-btn"
                style={{ fontSize: 11, padding: "5px 12px", borderColor: "rgba(255,255,255,0.12)", color: "#8b93c8" }}
                onClick={enterEditMode}
              >
                <FaPencilAlt style={{ fontSize: 9, marginRight: 5 }} />Edit
              </button>
            )}
          </div>
        </div>

        {/* ACKNOWLEDGEMENT PANEL â now always open by default, togglable */}
        {showAckPanel && (
          <div style={{
            marginBottom: 22,
            border: allAcked ? "1px solid rgba(77,184,150,0.25)" : "1px solid rgba(212,168,83,0.15)",
            borderRadius: 16,
            background: "#07091a",
            overflow: "hidden",
            transition: "border-color 0.2s",
          }}>
            {/* Header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "14px 18px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: allAcked ? "rgba(77,184,150,0.05)" : "transparent",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#4e568e", fontSize: 10, letterSpacing: 2, fontWeight: 700 }}>
                  ACKNOWLEDGEMENTS
                </span>
                {allAcked ? (
                  <span style={{ background: "rgba(77,184,150,0.15)", color: "#4db896", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999 }}>
                    All Acknowledged
                  </span>
                ) : (
                  <span style={{ background: "rgba(220,80,80,0.12)", color: "#e06060", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999 }}>
                    {pendingList.length} Pending
                  </span>
                )}
              </div>
              {!allAcked && present.length > 0 && (
                <button
                  className="co-ghost-btn"
                  style={{ fontSize: 11, padding: "5px 12px", borderColor: "rgba(77,184,150,0.25)", color: "#4db896" }}
                  onClick={() => ackAllAgenda(activeAgenda.id)}
                >
                  Acknowledge All
                </button>
              )}
            </div>

            {/* Participant ack rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {present.length === 0 && (
                <div style={{ padding: "18px", color: "#3d4570", fontSize: 12, textAlign: "center" }}>
                  No present participants. Mark attendance first.
                </div>
              )}
              {present.map((person, idx) => {
                const hasAcked = !!activeAcks[person.id];
                return (
                  <div
                    key={person.id}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
                      padding: "12px 18px",
                      borderBottom: idx < present.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      background: hasAcked ? "rgba(77,184,150,0.04)" : "transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                      {/* Avatar with ack ring */}
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <div
                          className="co-avatar"
                          style={{
                            width: 34, height: 34, fontSize: 10,
                            background: person.color, overflow: "hidden", padding: 0,
                            border: hasAcked ? "2px solid #4db896" : "2px solid rgba(255,255,255,0.08)",
                            transition: "border-color 0.2s",
                          }}
                        >
                          <img src={person.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=0D1117&color=fff`} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                        </div>
                        {hasAcked && (
                          <div style={{
                            position: "absolute", bottom: -2, right: -2,
                            width: 14, height: 14, borderRadius: "50%",
                            background: "#4db896", display: "grid", placeItems: "center",
                            fontSize: 7, color: "#fff",
                          }}>
                            <FaCheck />
                          </div>
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ color: "#f4f0ff", fontWeight: 700, fontSize: 13 }}>{person.name}</div>
                        <div className="co-muted" style={{ fontSize: 11 }}>
                          {attendance[person.id] === "physical" ? " Physical" : " Electronic"}
                          {hasAcked && <span style={{ marginLeft: 8, color: "#4db896" }}> Acknowledged</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <button
                        className="co-ghost-btn"
                        style={{
                          fontSize: 11, padding: "5px 14px",
                          borderColor: hasAcked ? "rgba(220,80,80,0.25)" : "rgba(77,184,150,0.25)",
                          color: hasAcked ? "#e06060" : "#4db896",
                        }}
                        onClick={() => toggleAgendaAck(activeAgenda.id, person.id)}
                      >
                        {hasAcked ? "Revoke" : "Acknowledge"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* All acked footer */}
            {allAcked && present.length > 0 && (
              <div style={{
                padding: "10px 18px",
                background: "rgba(77,184,150,0.06)",
                borderTop: "1px solid rgba(77,184,150,0.15)",
                color: "#4db896", fontSize: 12, fontWeight: 700, textAlign: "center",
              }}>
                All {present.length} present participants have acknowledged this agenda item
              </div>
            )}
          </div>
        )}

        <div className="co-agenda-para-block">
          {editMode ? (
            <div style={{ display: "grid", gap: 12, padding: "20px 24px" }}>
              <div>
                <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: "0.18em", fontWeight: 700, marginBottom: 6 }}>DESCRIPTION</div>
                <textarea
                  className="co-rich-textarea"
                  value={editDraft.description}
                  onChange={(e) => setEditDraft((d) => ({ ...d, description: e.target.value }))}
                  placeholder="Agenda description"
                  rows={3}
                  style={{ width: "100%", fontSize: 14, lineHeight: 1.8 }}
                />
              </div>
              <div>
                <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: "0.18em", fontWeight: 700, marginBottom: 6 }}>DETAIL DESCRIPTION</div>
                <RichTextEditor
                  value={activeWork.note}
                  onChange={updateNote}
                  placeholder="Capture key points, observations, and questions from the discussion"
                  minHeight={140}
                />
              </div>
            </div>
          ) : (
            <>
              {activeWork.note ? (
                <div style={{ padding: "20px 24px" }}>
                  <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: "0.18em", fontWeight: 700, marginBottom: 8 }}>DETAIL DESCRIPTION</div>

                  <div
                    className="co-rich-editor"
                    style={{ minHeight: 60, padding: "10px 14px", background: "#080b1d", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", color: "#c5cce8", fontSize: 14, lineHeight: 1.8 }}
                    dangerouslySetInnerHTML={{ __html: activeWork.note }}
                  />
                </div>
              ) : (
                <p className="co-agenda-para-text" style={{ fontSize: 14, lineHeight: 2, padding: "20px 24px", minHeight: 80, color: "#3d4570", fontStyle: "italic" }}>
                  No detail description yet  click Edit to add one.
                </p>
              )}
            </>
          )}
        </div>

        <div className="co-agenda-bottom-actions">
          {/* <div className="co-agenda-bottom-label">Quick Navigate</div> */}
          <div className="co-agenda-bottom-btns">
            <button className="co-agenda-quick-btn co-agenda-quick-res" onClick={() => handleNavigateToRes(activeAgenda.id)}>
              <span className="co-quick-icon">§</span>
              <span>Resolution</span>
            </button>
            <button className="co-agenda-quick-btn co-agenda-quick-dec" onClick={() => handleNavigateToDec(activeAgenda.id)}>
              <span className="co-quick-icon"><TbRoute /></span>
              <span>Decision</span>
            </button>
            <button className="co-agenda-quick-btn" style={{ borderColor: "rgba(122,131,184,0.3)", color: "#7a83b8" }} onClick={() => goToStep(7)}>
              <span className="co-quick-icon"><FaTasks style={{ fontSize: 12 }} /></span>
              <span>Tasks</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------
   RICH TEXT EDITOR
------------------------------------------------------------------- */
function RichTextEditor({ value, onChange, placeholder = "Type here...", minHeight = 140 }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleCommand = (command) => {
    editorRef.current?.focus();
    document.execCommand("styleWithCSS", false, true);
    document.execCommand(command, false, null);
    handleInput();
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    if (html === "<br>" || html === "<div><br></div>" || html === "&nbsp;") {
      onChange(""); return;
    }
    onChange(html);
  };

  const preventBlur = (e) => { e.preventDefault(); };

  return (
    <div className="co-rich-editor-wrap">
      <div className="co-rich-toolbar">
        <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("bold")}><FaBold /></button>
        <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("italic")}><FaItalic /></button>
        <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("underline")}><FaUnderline /></button>
        <div className="co-rich-divider" />
        <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("justifyLeft")}><FaAlignLeft /></button>
        <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("justifyCenter")}><FaAlignCenter /></button>
        <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("justifyRight")}><FaAlignRight /></button>
        <div className="co-rich-divider" />
        <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("insertUnorderedList")}><FaListUl /></button>
        <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("insertOrderedList")}><FaListOl /></button>
      </div>
      <div
        ref={editorRef}
        className="co-rich-editor"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={handleInput}
        spellCheck={false}
        dir="ltr"
        style={{ minHeight }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------
   OUTPUT STEP â Resolutions & Decisions
------------------------------------------------------------------- */
function OutputStep({
  type, agendaItems, agendaWork, activeAgendaId, setActiveAgendaId,
  participants, votes, recordVote, acceptAllMembers, openVotingModal,
  addOutput, updateOutput, removeOutput, updateInputField, showVoting,
  addTask, updateTask, removeTask, goToStep,
}) {
  const [editingCard, setEditingCard] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [addingFor, setAddingFor] = useState(null);
  const [votedMembersPopup, setVotedMembersPopup] = useState(false);

  const isResolution = type === "resolution";
  const itemKey = isResolution ? "resolutions" : "decisions";
  const inputKey = isResolution ? "resolutionInput" : "decisionInput";
  const label = isResolution ? "Resolution" : "Decision";
  const pluralLabel = isResolution ? "Resolutions" : "Decisions";

  const CATEGORY_TYPES = ["MCA", "Not MCA"];

  const allItems = agendaItems.flatMap((agenda) =>
    (agendaWork[agenda.id]?.[itemKey] || []).map((item, index) => ({
      item, index,
      agendaId: agenda.id,
      agendaTitle: agenda.title,
      agendaPresenter: agenda.presenter,
      agendaDuration: agenda.duration,
      voteId: showVoting ? getVoteItemId(type, agenda.id, index) : null,
    }))
  );

  const activeEntry = selectedItem
    ? allItems.find((e) => e.agendaId === selectedItem.agendaId && e.index === selectedItem.index)
    : allItems[0] || null;

  const activeAgenda = activeEntry ? agendaItems.find((a) => a.id === activeEntry.agendaId) : null;
  const activeWork = activeEntry ? agendaWork[activeEntry.agendaId] || {} : {};

  const addInputVal = addingFor
    ? agendaWork[addingFor]?.[inputKey] || { title: "", description: "", categoryType: "" }
    : { title: "", description: "", categoryType: "" };

  const grouped = agendaItems
    .map((agenda) => ({
      agenda,
      items: (agendaWork[agenda.id]?.[itemKey] || []).map((item, index) => ({ item, index, agendaId: agenda.id })),
    }))
    .filter((g) => g.items.length > 0 || true);

  const isSelected = (agendaId, index) =>
    activeEntry?.agendaId === agendaId && activeEntry?.index === index;

  const categoryBadgeStyle = (cat) => ({
    fontSize: 10, fontWeight: 800, letterSpacing: 1, padding: "3px 10px", borderRadius: 999,
    background: cat === "MCA" ? "rgba(80,140,220,0.15)" : "rgba(180,100,220,0.13)",
    color: cat === "MCA" ? "#6aaaee" : "#c47ae8",
    border: `1px solid ${cat === "MCA" ? "rgba(80,140,220,0.25)" : "rgba(180,100,220,0.22)"}`,
  });

  return (
    <section className="co-agenda-layout">
      {/* LEFT PANEL */}
      <div className="co-panel" style={{ display: "flex", flexDirection: "column", gap: 0, height: "fit-content", position: "sticky", top: 0 }}>
        <div className="co-panel-head">
          <div>
            <h2>{pluralLabel}</h2>
            <p>{allItems.length} total across all agenda items</p>
          </div>
        </div>

        <div style={{ padding: "0 0 12px 0", flexShrink: 0 }}>
          <button
            className={`co-agenda-quick-btn ${isResolution ? "co-agenda-quick-res" : "co-agenda-quick-dec"}`}
            style={{ width: "100%", justifyContent: "center", fontSize: 12 }}
            onClick={() => { setAddingFor(addingFor ? null : (activeEntry?.agendaId || agendaItems[0]?.id)); setSelectedItem(null); }}
          >
            <span className="co-quick-icon" style={{ fontSize: 14 }}>{isResolution ? "§" : ""}</span>
            <span> Add {label}</span>
          </button>
        </div>

        <div className="co-agenda-list" style={{ flex: 1, maxHeight: 480, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "thin", scrollbarColor: "rgba(212,168,83,0.2) transparent" }}>
          <div className="co-output-left-scroll" style={{ height: "100%", overflowY: "auto" }}>
            {grouped.map(({ agenda, items }) => (
              <div key={agenda.id}>
                <div style={{
                  padding: "8px 12px 6px", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#3d4570",
                  textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.04)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  position: "sticky", top: 0, background: "#0d1024", zIndex: 1,
                }}>
                  <span style={{ color: "#4f578f" }}>{agenda.title}</span>
                  <span style={{ background: "rgba(212,168,83,0.10)", color: "#D4A853", borderRadius: 20, padding: "1px 7px", fontSize: 9, fontWeight: 700 }}>
                    {items.length}
                  </span>
                </div>

                {items.length === 0 ? (
                  <div style={{ padding: "10px 14px", fontSize: 11, color: "#3d4570", fontStyle: "italic" }}>
                    No {pluralLabel.toLowerCase()} yet
                  </div>
                ) : (
                  items.map(({ item, index, agendaId }) => {
                    const voteId = showVoting ? getVoteItemId(type, agendaId, index) : null;
                    const result = showVoting ? getVoteResult(voteId, votes) : null;
                    const active = isSelected(agendaId, index);
                    return (
                      <div key={`${agendaId}-${index}`} style={{ display: "flex", alignItems: "center", position: "relative" }}>
                        <button
                          className={active ? "active" : ""}
                          onClick={() => { setSelectedItem({ agendaId, index }); setAddingFor(null); setEditingCard(false); }}
                          style={{ flex: 1, textAlign: "left", paddingRight: 32 }}
                        >
                          <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <span style={{ color: active ? "#f4f0ff" : "#8b93c8", fontWeight: 600, fontSize: 12, lineHeight: 1.4 }}>
                              {isResolution ? "" : ""}&nbsp;{item.title || `${label} ${index + 1}`}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                              {isResolution && item.categoryType && (
                                <span style={{ fontSize: 9, fontWeight: 800, padding: "1px 7px", borderRadius: 999, background: item.categoryType === "MCA" ? "rgba(80,140,220,0.15)" : "rgba(180,100,220,0.12)", color: item.categoryType === "MCA" ? "#6aaaee" : "#c47ae8" }}>
                                  {item.categoryType}
                                </span>
                              )}
                              {showVoting && result && (
                                <span style={{
                                  fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20,
                                  background: result.status === "Approved" ? "rgba(74,222,128,0.12)" : result.status === "Pending" ? "rgba(212,168,83,0.12)" : "rgba(255,255,255,0.05)",
                                  color: result.status === "Approved" ? "#4ade80" : result.status === "Pending" ? "#D4A853" : "#4f578f",
                                }}>
                                  {result.status}
                                </span>
                              )}
                            </span>
                          </span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (active) { setSelectedItem(null); setEditingCard(false); }
                            removeOutput(agendaId, itemKey, index);
                          }}
                          style={{
                            position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                            background: "none", border: "none", cursor: "pointer",
                            color: "#3d4570", padding: "4px 6px", borderRadius: 6,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "color 0.15s",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "#e06060"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "#3d4570"}
                          title={`Delete ${label}`}
                        >
                          <FaTrash style={{ fontSize: 10 }} />
                        </button>
                      </div>
                    );
                  })
                )}

                <button
                  style={{ width: "100%", textAlign: "left", padding: "7px 14px", background: "transparent", border: "none", color: "#3d4570", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                  onClick={() => { setAddingFor(addingFor === agenda.id ? null : agenda.id); setSelectedItem(null); }}
                >
                  <span style={{ fontSize: 14, lineHeight: 1 }}>+</span>
                  <span>Add to {agenda.title}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="co-panel co-agenda-full co-output-rich-panel">

        {/* ADD FORM */}
        {addingFor && (() => {
          const ag = agendaItems.find((a) => a.id === addingFor);
          return (
            <>
              <div className="co-panel-head" style={{ marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "#4f578f", marginBottom: 6, textTransform: "uppercase" }}>
                    Adding {label} to
                  </div>
                  <h2>{ag?.title}</h2>
                  {/* <p>{ag?.duration} min</p> */}
                </div>
                <div className="co-output-step-badge">
                  <span>{pluralLabel}</span>
                  <strong>{(agendaWork[addingFor]?.[itemKey] || []).length}</strong>
                </div>
              </div>

              <div className="co-output-add-area">
                <label className="co-label" style={{ marginBottom: 10 }}>ADD {label.toUpperCase()}</label>
                <div style={{ display: "grid", gap: 10 }}>
                  <input
                    className="co-input"
                    value={addInputVal.title}
                    onChange={(e) => updateInputField(addingFor, inputKey, "title", e.target.value)}
                    placeholder={`${label} title`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const newIndex = (agendaWork[addingFor]?.[itemKey] || []).length;
                        addOutput(addingFor, itemKey, inputKey);
                        setSelectedItem({ agendaId: addingFor, index: newIndex });
                        setAddingFor(null);
                      }
                    }}
                    autoFocus
                  />
                  <textarea
                    className="co-textarea"
                    style={{ minHeight: 80 }}
                    value={addInputVal.description}
                    onChange={(e) => updateInputField(addingFor, inputKey, "description", e.target.value)}
                    placeholder={`${label} description (optional)`}
                  />

                  {isResolution && (
                    <div>
                      <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: "0.18em", fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>Category Type</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {CATEGORY_TYPES.map((cat) => {
                          const selected = addInputVal.categoryType === cat;
                          return (
                            <button
                              key={cat}
                              onClick={() => updateInputField(addingFor, inputKey, "categoryType", selected ? "" : cat)}
                              style={{
                                flex: 1, padding: "9px 14px", borderRadius: 10, cursor: "pointer",
                                fontWeight: 800, fontSize: 12, letterSpacing: 0.5,
                                border: selected ? `1px solid ${cat === "MCA" ? "rgba(80,140,220,0.55)" : "rgba(180,100,220,0.5)"}` : "1px solid rgba(255,255,255,0.08)",
                                background: selected ? (cat === "MCA" ? "rgba(80,140,220,0.15)" : "rgba(180,100,220,0.12)") : "#090c20",
                                color: selected ? (cat === "MCA" ? "#6aaaee" : "#c47ae8") : "#596197",
                                transition: "all 0.15s",
                              }}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <button className="co-ghost-btn" onClick={() => setAddingFor(null)}>Cancel</button>
                    <button
                      className="co-gold-btn"
                      onClick={() => {
                        const newIndex = (agendaWork[addingFor]?.[itemKey] || []).length;
                        addOutput(addingFor, itemKey, inputKey);
                        setSelectedItem({ agendaId: addingFor, index: newIndex });
                        setAddingFor(null);
                      }}
                    >
                      Add {label}
                    </button>
                  </div>
                </div>
              </div>
            </>
          );
        })()}

        {/* EMPTY STATE */}
        {!addingFor && allItems.length === 0 && (
          <div className="co-output-empty-state">
            <div className="co-output-empty-icon">{isResolution ? "" : ""}</div>
            <div className="co-output-empty-title">No {pluralLabel} Yet</div>
            <div className="co-output-empty-sub">Click "+ Add {label}" or use the quick-add links under each agenda group on the left.</div>
          </div>
        )}

        {/* DETAIL VIEW */}
        {!addingFor && activeEntry && (
          <>
            {/* Voted Members Popup */}
            {votedMembersPopup && showVoting && (() => {
              const result = getVoteResult(activeEntry.voteId, votes);
              const itemVotes = votes[activeEntry.voteId] || {};
              const votedMembers = participants.filter((p) => itemVotes[p.id]);
              return (
                <div
                  style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.65)" }}
                  onClick={() => setVotedMembersPopup(false)}
                >
                  <div
                    style={{ background: "#0d1024", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "24px 22px", minWidth: 320, maxWidth: 420, width: "90%" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div style={{ color: "#f4f0ff", fontWeight: 800, fontSize: 14 }}>Voted Members</div>
                      <button style={{ background: "none", border: "none", color: "#596197", cursor: "pointer", fontSize: 14, display: "grid", placeItems: "center" }} onClick={() => setVotedMembersPopup(false)}>
                        <FaTimes />
                      </button>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20, background: "rgba(74,222,128,0.10)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.18)" }}>
                        {result.approve} Approved
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20, background: "rgba(220,80,80,0.10)", color: "#e06060", border: "1px solid rgba(220,80,80,0.18)" }}>
                        {result.reject} Rejected
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20, background: "rgba(255,255,255,0.05)", color: "#596197", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {participants.length - votedMembers.length} Not voted
                      </span>
                    </div>
                    {votedMembers.length === 0 ? (
                      <div style={{ color: "#596197", fontSize: 12, textAlign: "center", padding: "24px 0" }}>No votes cast yet</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "rgba(212,168,83,0.2) transparent" }}>
                        {votedMembers.map((person) => {
                          const vote = itemVotes[person.id];
                          return (
                            <div key={person.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "#080b1d", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)" }}>
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: person.color, overflow: "hidden", flexShrink: 0 }}>
                                <img src={person.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=0D1117&color=fff`} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ color: "#f4f0ff", fontWeight: 600, fontSize: 12 }}>{person.name}</div>
                                <div style={{ color: "#596197", fontSize: 10 }}>{person.role}</div>
                              </div>
                              <span style={{
                                fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                                background: vote === "Approve" ? "rgba(74,222,128,0.12)" : "rgba(220,80,80,0.10)",
                                color: vote === "Approve" ? "#4ade80" : "#e06060",
                                border: `1px solid ${vote === "Approve" ? "rgba(74,222,128,0.2)" : "rgba(220,80,80,0.2)"}`,
                              }}>
                                {vote}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Breadcrumb: Agenda Title / Category (resolution) / Item Title / Status */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "10px 16px", background: "#080b1d", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, flexWrap: "wrap" }}>
              <span style={{ background: "rgba(212,168,83,0.10)", color: "#D4A853", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999, letterSpacing: "0.06em" }}>
                {activeEntry.agendaTitle}
              </span>
              {isResolution && (
                <>
                  <span style={{ color: "#3d4570", fontSize: 12 }}>/</span>
                  <span style={activeEntry.item.categoryType ? categoryBadgeStyle(activeEntry.item.categoryType) : { fontSize: 10, fontWeight: 800, letterSpacing: 1, padding: "3px 10px", borderRadius: 999, background: "rgba(255,255,255,0.05)", color: "#596197", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {activeEntry.item.categoryType || "MCA"}
                  </span>
                </>
              )}
              <span style={{ color: "#3d4570", fontSize: 12 }}>/</span>
              <span style={{ background: "rgba(255,255,255,0.04)", color: "#8b93c8", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
                {activeEntry.item.title || `${label} ${activeEntry.index + 1}`}
              </span>
              {showVoting && (() => {
                const result = getVoteResult(activeEntry.voteId, votes);
                return (
                  <>
                    <span style={{ color: "#3d4570", fontSize: 12 }}>/</span>
                    <span
                      onClick={() => setVotedMembersPopup(true)}
                      style={{
                        cursor: "pointer", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                        background: result.status === "Approved" ? "rgba(74,222,128,0.12)" : result.status === "Pending" ? "rgba(212,168,83,0.12)" : "rgba(255,255,255,0.05)",
                        color: result.status === "Approved" ? "#4ade80" : result.status === "Pending" ? "#D4A853" : "#4f578f",
                        border: `1px solid ${result.status === "Approved" ? "rgba(74,222,128,0.22)" : result.status === "Pending" ? "rgba(212,168,83,0.22)" : "rgba(255,255,255,0.08)"}`,
                        transition: "opacity 0.15s",
                      }}
                      title="Click to see voted members"
                    >
                      {result.status}
                    </span>
                  </>
                );
              })()}
            </div>

            {editingCard ? (
              <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
                <div>
                  <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 6, fontWeight: 700 }}>DESCRIPTION</div>
                  <RichTextEditor
                    value={activeEntry.item.description || ""}
                    placeholder={`Describe this ${label.toLowerCase()}`}
                    onChange={(html) => updateOutput(activeEntry.agendaId, itemKey, activeEntry.index, "description", html)}
                  />
                </div>
                {isResolution && (
                  <div>
                    <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 8, fontWeight: 700 }}>CATEGORY TYPE</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {CATEGORY_TYPES.map((cat) => {
                        const selected = activeEntry.item.categoryType === cat;
                        return (
                          <button key={cat} onClick={() => updateOutput(activeEntry.agendaId, itemKey, activeEntry.index, "categoryType", selected ? "" : cat)}
                            style={{ flex: 1, padding: "9px 14px", borderRadius: 10, cursor: "pointer", fontWeight: 800, fontSize: 12, letterSpacing: 0.5, border: selected ? `1px solid ${cat === "MCA" ? "rgba(80,140,220,0.55)" : "rgba(180,100,220,0.5)"}` : "1px solid rgba(255,255,255,0.08)", background: selected ? (cat === "MCA" ? "rgba(80,140,220,0.15)" : "rgba(180,100,220,0.12)") : "#090c20", color: selected ? (cat === "MCA" ? "#6aaaee" : "#c47ae8") : "#596197", transition: "all 0.15s" }}>
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ marginBottom: 20 }}>
                <div style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#080b1d", borderRadius: 14, padding: "14px 16px" }}>
                  <RichTextEditor
                    value={activeEntry.item.description || ""}
                    placeholder={`No description yet  click Edit to add one`}
                    readOnly
                  />
                </div>
              </div>
            )}

            {showVoting && (() => {
              const result = getVoteResult(activeEntry.voteId, votes);
              const totalVoted = result.approve + result.reject + result.abstain;
              const pct = participants.length > 0 ? Math.round((totalVoted / participants.length) * 100) : 0;
              return (
                <>

                  <div className="co-rich-actions">
                    <button className="co-ghost-btn co-accept-all-btn" onClick={() => acceptAllMembers(activeEntry.voteId)}>
                      &nbsp;&nbsp;Acknowledge
                    </button>



                  </div>
                </>
              );
            })()}

            <div style={{ marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
              {(() => {
                const linkedTasks = (activeWork.tasks || []).filter(
                  (t) => t.linkedType === type && t.linkedIndex === activeEntry.index
                );
                return (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

                      {linkedTasks.length > 0 && (
                        <span style={{ background: "rgba(212,168,83,0.15)", color: "#D4A853", fontSize: 10, padding: "2px 7px", borderRadius: 20, fontWeight: 700 }}>
                          {linkedTasks.length}
                        </span>
                      )}
                    </div>
                    <button
                      className="co-ghost-btn"
                      style={{ fontSize: 11, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}
                      onClick={() => goToStep(7)}
                    >
                      <FaTasks style={{ fontSize: 10 }} />
                      Go to Tasks
                    </button>
                  </div>
                );
              })()}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------
   TASKS OVERVIEW
------------------------------------------------------------------- */
function TasksOverview({ agendaItems, agendaWork, participants, updateTask, addTask, removeTask }) {
  const [filter, setFilter] = useState("All");
  const [addingTask, setAddingTask] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskInput, setTaskInput] = useState({
    title: "", description: "", assigneeId: "", dueDate: "", status: "Pending",
    agendaId: "", linkedType: "agenda", linkedIndex: 0,
  });

  const allTasks = agendaItems.flatMap((agenda) =>
    (agendaWork[agenda.id]?.tasks || []).map((t) => ({ ...t, agendaId: agenda.id, agendaTitle: agenda.title }))
  );

  const counts = {
    All: allTasks.length,
    Pending: allTasks.filter((t) => t.status === "Pending").length,
    "In Progress": allTasks.filter((t) => t.status === "In Progress").length,
    Done: allTasks.filter((t) => t.status === "Done").length,
  };

  const filtered = filter === "All" ? allTasks : allTasks.filter((t) => t.status === filter);
  const selectedTask = selectedTaskId ? allTasks.find((t) => t.id === selectedTaskId) : null;

  const statusColor = (s) => {
    if (s === "Done") return "#4ade80";
    if (s === "In Progress") return "#D4A853";
    return "#7a83b8";
  };

  const sourceLabel = (task) => {
    if (task.linkedType === "agenda") return "Agenda";
    if (task.linkedType === "resolution") return "Resolution";
    if (task.linkedType === "decision") return "Decision";
    return task.linkedType;
  };

  const sourceColor = (task) => {
    if (task.linkedType === "resolution") return { bg: "rgba(100,130,220,0.10)", color: "#7a9fd4" };
    if (task.linkedType === "decision") return { bg: "rgba(180,120,220,0.10)", color: "#b47ad4" };
    return { bg: "rgba(212,168,83,0.08)", color: "#D4A853" };
  };

  const donePercent = allTasks.length > 0 ? Math.round((counts.Done / allTasks.length) * 100) : 0;

  const handleAddTask = () => {
    if (!taskInput.title.trim() || !taskInput.agendaId) return;
    addTask(taskInput.agendaId, {
      title: taskInput.title.trim(),
      description: taskInput.description.trim(),
      assigneeId: taskInput.assigneeId,
      dueDate: taskInput.dueDate,
      status: taskInput.status,
      linkedType: taskInput.linkedType,
      linkedIndex: taskInput.linkedIndex,
    });
    setTaskInput({ title: "", description: "", assigneeId: "", dueDate: "", status: "Pending", agendaId: "", linkedType: "agenda", linkedIndex: 0 });
    setAddingTask(false);
  };

  return (
    <section className="co-agenda-layout">
      {/* LEFT PANEL */}
      <div className="co-panel" style={{ display: "flex", flexDirection: "column", gap: 0, height: "fit-content", position: "sticky", top: 0 }}>
        <div className="co-panel-head">
          <div>
            <h2>Tasks</h2>
            <p>{allTasks.length} total action items</p>
          </div>
        </div>

        {/* Add Task button */}
        <div style={{ padding: "0 0 12px 0", flexShrink: 0 }}>
          <button
            className="co-agenda-quick-btn"
            style={{ width: "100%", justifyContent: "center", fontSize: 12, borderColor: "rgba(212,168,83,0.3)", color: "#D4A853" }}
            onClick={() => { setAddingTask(true); setSelectedTaskId(null); }}
          >
            <FaTasks style={{ fontSize: 12 }} />
            <span>&nbsp;Add Task</span>
          </button>
        </div>

        {/* Status filter chips */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", padding: "0 0 12px 0", flexShrink: 0 }}>
          {["All", "Pending", "In Progress", "Done"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontSize: 10, padding: "4px 10px", borderRadius: 20, border: "1px solid",
                cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", gap: 5,
                borderColor: filter === f ? "rgba(212,168,83,0.5)" : "rgba(255,255,255,0.07)",
                background: filter === f ? "rgba(212,168,83,0.12)" : "transparent",
                color: filter === f ? "#D4A853" : "#4e568e",
              }}
            >
              {f !== "All" && <span style={{ width: 5, height: 5, borderRadius: "50%", background: statusColor(f), display: "inline-block" }} />}
              {f}
              <span style={{ background: "rgba(255,255,255,0.07)", borderRadius: 20, padding: "0 5px", fontSize: 9, fontWeight: 700 }}>
                {f === "All" ? counts.All : counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* Progress bar */}
        {allTasks.length > 0 && (
          <div style={{ marginBottom: 12, flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ color: "#4e568e", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>COMPLETION</span>
              <span style={{ color: "#4ade80", fontSize: 10, fontWeight: 700 }}>{donePercent}%</span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${donePercent}%`, background: "linear-gradient(90deg,#4ade80,#22d3ee)", borderRadius: 99, transition: "width 0.4s" }} />
            </div>
          </div>
        )}

        {/* Task list */}
        <div className="co-agenda-list" style={{ flex: 1, maxHeight: 420, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "rgba(212,168,83,0.2) transparent" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "18px 14px", color: "#3d4570", fontSize: 12, textAlign: "center", fontStyle: "italic" }}>
              {filter === "All" ? "No tasks yet. Click Add Task to create one." : `No ${filter} tasks.`}
            </div>
          ) : (
            filtered.map((task) => {
              const isActive = selectedTaskId === task.id;
              const sc = sourceColor(task);
              const assignee = participants.find((p) => p.id === task.assigneeId);
              return (
                <button
                  key={task.id}
                  className={isActive ? "active" : ""}
                  onClick={() => { setSelectedTaskId(task.id); setAddingTask(false); }}
                  style={{ width: "100%", textAlign: "left" }}
                >
                  <span style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusColor(task.status), flexShrink: 0, display: "inline-block" }} />
                      <span style={{ color: isActive ? "#f4f0ff" : "#8b93c8", fontWeight: 600, fontSize: 12, lineHeight: 1.4, flex: 1, minWidth: 0 }}>
                        {task.title}
                      </span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap", paddingLeft: 13 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 7px", borderRadius: 999, background: sc.bg, color: sc.color }}>
                        {sourceLabel(task)}
                      </span>
                      {assignee && (
                        <span style={{ fontSize: 9, color: "#4e568e" }}>{assignee.name}</span>
                      )}
                      {task.dueDate && (
                        <span style={{ fontSize: 9, color: "#4e568e" }}>Due: {task.dueDate}</span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="co-panel co-agenda-full co-output-rich-panel">

        {/* ADD FORM */}
        {addingTask && (
          <>
            <div className="co-panel-head" style={{ marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "#4f578f", marginBottom: 6, textTransform: "uppercase" }}>New Task</div>
                <h2>Add Task</h2>
                <p>Fill in the details below to create a new action item</p>
              </div>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 6, fontWeight: 700 }}>TASK TITLE</div>
                <input
                  className="co-input"
                  value={taskInput.title}
                  onChange={(e) => setTaskInput((s) => ({ ...s, title: e.target.value }))}
                  placeholder="Enter task title"
                  autoFocus
                />
              </div>

              <div>
                <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 6, fontWeight: 700 }}>DESCRIPTION</div>
                <textarea
                  className="co-rich-textarea"
                  style={{ minHeight: 90 }}
                  value={taskInput.description}
                  onChange={(e) => setTaskInput((s) => ({ ...s, description: e.target.value }))}
                  placeholder="Describe the task, context, or expected outcome"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 6, fontWeight: 700 }}>LINKED AGENDA</div>
                  <select
                    className="co-input"
                    value={taskInput.agendaId}
                    onChange={(e) => setTaskInput((s) => ({ ...s, agendaId: e.target.value }))}
                  >
                    <option value="">Select agenda</option>
                    {agendaItems.map((a) => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 6, fontWeight: 700 }}>SOURCE TYPE</div>
                  <select
                    className="co-input"
                    value={taskInput.linkedType}
                    onChange={(e) => setTaskInput((s) => ({ ...s, linkedType: e.target.value }))}
                  >
                    <option value="agenda">Agenda</option>
                    <option value="resolution">Resolution</option>
                    <option value="decision">Decision</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 6, fontWeight: 700 }}>ASSIGNEE</div>
                  <select
                    className="co-input"
                    value={taskInput.assigneeId}
                    onChange={(e) => setTaskInput((s) => ({ ...s, assigneeId: e.target.value }))}
                  >
                    <option value="">Assign to</option>
                    {participants.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 6, fontWeight: 700 }}>DUE DATE</div>
                  <input
                    className="co-input"
                    type="date"
                    value={taskInput.dueDate}
                    onChange={(e) => setTaskInput((s) => ({ ...s, dueDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 8, fontWeight: 700 }}>STATUS</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {TASK_STATUSES.map((s) => {
                    const sel = taskInput.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setTaskInput((st) => ({ ...st, status: s }))}
                        style={{
                          flex: 1, padding: "8px 10px", borderRadius: 10, cursor: "pointer",
                          fontWeight: 700, fontSize: 11,
                          border: sel ? `1px solid ${statusColor(s)}` : "1px solid rgba(255,255,255,0.08)",
                          background: sel ? `${statusColor(s)}18` : "#090c20",
                          color: sel ? statusColor(s) : "#596197",
                          transition: "all 0.15s",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor(s), display: "inline-block" }} />
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 4 }}>
                <button className="co-ghost-btn" onClick={() => setAddingTask(false)}>Cancel</button>
                <button
                  className="co-gold-btn"
                  disabled={!taskInput.title.trim() || !taskInput.agendaId}
                  style={{ opacity: !taskInput.title.trim() || !taskInput.agendaId ? 0.4 : 1 }}
                  onClick={handleAddTask}
                >
                  Add Task
                </button>
              </div>
            </div>
          </>
        )}

        {/* TASK DETAIL VIEW */}
        {!addingTask && selectedTask && (() => {
          const assignee = participants.find((p) => p.id === selectedTask.assigneeId);
          const sc = sourceColor(selectedTask);
          const agendaTitle = agendaItems.find((a) => a.id === selectedTask.agendaId)?.title || "";
          return (
            <>
              {/* Breadcrumb */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "10px 16px", background: "#080b1d", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, flexWrap: "wrap" }}>
                <span style={{ background: "rgba(212,168,83,0.10)", color: "#D4A853", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999 }}>
                  {agendaTitle}
                </span>
                <span style={{ color: "#3d4570", fontSize: 12 }}>/</span>
                <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 9px", borderRadius: 999, background: sc.bg, color: sc.color }}>
                  {sourceLabel(selectedTask)}
                </span>
                <span style={{ color: "#3d4570", fontSize: 12 }}>/</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                  background: `${statusColor(selectedTask.status)}18`,
                  color: statusColor(selectedTask.status),
                  border: `1px solid ${statusColor(selectedTask.status)}33`,
                }}>
                  {selectedTask.status}
                </span>
              </div>

              <div className="co-panel-head" style={{ marginBottom: 16 }}>
                <div>
                  <div className="co-rich-card-num" style={{ marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
                    <FaTasks style={{ color: "#D4A853", fontSize: 14 }} />
                    <strong style={{ fontSize: 15, color: "#f4f0ff" }}>{selectedTask.title}</strong>
                  </div>
                </div>
                <button
                  className="co-rich-remove-btn"
                  onClick={() => { removeTask(selectedTask.agendaId, selectedTask.id); setSelectedTaskId(null); }}
                >
                  Remove
                </button>
              </div>

              {/* Description */}
              <div style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#080b1d", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
                <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 8, fontWeight: 700 }}>DESCRIPTION</div>
                <RichTextEditor
                  value={selectedTask.description || ""}
                  placeholder="No description yet  click edit to add one"
                  onChange={(html) => updateTask(selectedTask.agendaId, selectedTask.id, "description", html)}
                />
              </div>

              {/* Details grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#080b1d", borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 8, fontWeight: 700 }}>ASSIGNEE</div>
                  {assignee ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: assignee.color, overflow: "hidden", flexShrink: 0 }}>
                        <img src={assignee.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(assignee.name)}&background=0D1117&color=fff`} alt={assignee.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div>
                        <div style={{ color: "#f4f0ff", fontSize: 12, fontWeight: 600 }}>{assignee.name}</div>
                        <div style={{ color: "#596197", fontSize: 10 }}>{assignee.role}</div>
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: "#3d4570", fontSize: 12, fontStyle: "italic" }}>Unassigned</span>
                  )}
                </div>
                <div style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#080b1d", borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 8, fontWeight: 700 }}>DUE DATE</div>
                  <div style={{ color: selectedTask.dueDate ? "#f4f0ff" : "#3d4570", fontSize: 13, fontWeight: 600, fontStyle: selectedTask.dueDate ? "normal" : "italic" }}>
                    {selectedTask.dueDate || "Not set"}
                  </div>
                </div>
              </div>

              {/* Status changer */}
              <div style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#080b1d", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
                <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 10, fontWeight: 700 }}>UPDATE STATUS</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {TASK_STATUSES.map((s) => {
                    const sel = selectedTask.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => updateTask(selectedTask.agendaId, selectedTask.id, "status", s)}
                        style={{
                          flex: 1, padding: "8px 10px", borderRadius: 10, cursor: "pointer",
                          fontWeight: 700, fontSize: 11,
                          border: sel ? `1px solid ${statusColor(s)}` : "1px solid rgba(255,255,255,0.08)",
                          background: sel ? `${statusColor(s)}18` : "#090c20",
                          color: sel ? statusColor(s) : "#596197",
                          transition: "all 0.15s",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor(s), display: "inline-block" }} />
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reassign */}
              <div style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#080b1d", borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 8, fontWeight: 700 }}>REASSIGN</div>
                <select
                  className="co-input"
                  value={selectedTask.assigneeId || ""}
                  onChange={(e) => updateTask(selectedTask.agendaId, selectedTask.id, "assigneeId", e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {participants.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </>
          );
        })()}

        {/* EMPTY STATE */}
        {!addingTask && !selectedTask && (
          <div className="co-output-empty-state">
            <div className="co-output-empty-icon"><FaTasks /></div>
            <div className="co-output-empty-title">No Task Selected</div>
            <div className="co-output-empty-sub">Click "Add Task" to create a new task, or select one from the list to view its details.</div>
          </div>
        )}
      </div>
    </section>
  );
}

function TaskList({ tasks, participants, updateTask, statusColor, sourceLabel, sourceColor }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {tasks.map((task) => {
        const assignee = participants.find((p) => p.id === task.assigneeId);
        const sc = sourceColor(task);
        return (
          <div key={task.id} style={{ background: "#080b1d", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(task.status), flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                <span style={{ color: "#f4f0ff", fontWeight: 600, fontSize: 13 }}>{task.title}</span>
                <span style={{ background: sc.bg, color: sc.color, fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>{sourceLabel(task)}</span>
                {task.agendaTitle && <span style={{ color: "#3d4570", fontSize: 10 }}>{task.agendaTitle}</span>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                {assignee ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div className="co-avatar co-avatar-sm" style={{ background: assignee.color, overflow: "hidden", padding: 0, width: 18, height: 18 }}>
                      <img src={assignee.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(assignee.name)}&background=0D1117&color=fff`} alt={assignee.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                    </div>
                    <span className="co-muted" style={{ fontSize: 11 }}>{assignee.name}</span>
                  </div>
                ) : (
                  <span className="co-muted" style={{ fontSize: 11 }}>Unassigned</span>
                )}
                {task.dueDate && <span className="co-muted" style={{ fontSize: 11 }}>Due: {task.dueDate}</span>}
              </div>
            </div>
            <select className="co-input" style={{ width: "auto", fontSize: 11, padding: "5px 10px", minWidth: 115, flexShrink: 0 }} value={task.status} onChange={(e) => updateTask(task.agendaId, task.id, "status", e.target.value)}>
              {TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        );
      })}
    </div>
  );
}
/* -------------------------------------------------------------------
   MOM 
------------------------------------------------------------------- */
function MOM({
  agendaItems,
  agendaWork,
  momData,
  setMomData,
  savedMoms,
  setSavedMoms,
  participants,
  momAcknowledgements,
  setMomAcknowledgements,
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
      description: momData.notes,   // HTML from rich text editor
      createdAt: new Date().toLocaleString(),
    };
    setSavedMoms((prev) => [...prev, newMom]);
    // Initialise a fresh ack entry for this MOM so it's ready immediately
    setMomAcknowledgements((cur) => ({ ...cur, [newMom.id]: {} }));
    setMomData((d) => ({ ...d, secretary: "", notes: "" }));
  };

  /* Per-MOM toggle â keyed by mom.id */
  const toggleAck = (momId, participantId) => {
    setMomAcknowledgements((cur) => {
      const existing = cur[momId] || {};
      return { ...cur, [momId]: { ...existing, [participantId]: !existing[participantId] } };
    });
  };

  /* Acknowledge all participants for a specific MOM */
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

      {/* Form */}
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
        <button className="co-btn co-btn-primary" onClick={handleSaveMOM}>
          Save MOM
        </button>
      </div>



    </section>
  );
}



/* -------------------------------------------------------------------
   BOARD PACK DOC MODAL
------------------------------------------------------------------- */
function BoardPackDocModal({ doc, participants, acks, setAcks, onClose }) {
  const docKey = doc.id ?? doc.name ?? doc;
  const docLabel = doc.name || doc.title || doc;
  const docUrl = doc.url || doc.fileUrl || null;

  const toggleAck = (participantId) => {
    setAcks((cur) => ({
      ...cur,
      [docKey]: { ...(cur[docKey] || {}), [participantId]: !(cur[docKey]?.[participantId]) },
    }));
  };

  const ackAll = () => {
    const all = {};
    participants.forEach((p) => { all[p.id] = true; });
    setAcks((cur) => ({ ...cur, [docKey]: all }));
  };

  const handleDownload = () => {
    if (docUrl) {
      const a = document.createElement("a");
      a.href = docUrl;
      a.download = docLabel;
      a.click();
    }
  };

  const docAcks = acks[docKey] || {};
  const ackedList = participants.filter((p) => !!docAcks[p.id]);
  const allAcked = participants.length > 0 && ackedList.length === participants.length;

  return (
    <div
      className="co-modal-overlay"
      onClick={onClose}
      style={{ zIndex: 9999, alignItems: "center", justifyContent: "center" }}
    >
      <div
        className="co-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(860px, 96vw)", maxHeight: "90vh", display: "flex", flexDirection: "column", padding: 0, overflow: "hidden", borderRadius: 20 }}
      >

        {/* -- Header -- */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0, gap: 12, flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: "rgba(212,168,83,0.12)", color: "#D4A853",
              display: "grid", placeItems: "center", fontSize: 16,
            }}>
              <FaFilePdf />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: "#f4f0ff", fontWeight: 800, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {docLabel}
              </div>
              <div style={{ color: "#596197", fontSize: 11, marginTop: 2 }}>Board Pack Document</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {/* Download btn */}
            <button
              onClick={handleDownload}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "8px 16px", borderRadius: 10, cursor: docUrl ? "pointer" : "not-allowed",
                border: "1px solid rgba(212,168,83,0.35)", color: "#D4A853",
                background: "rgba(212,168,83,0.08)", fontSize: 12, fontWeight: 700,
                opacity: docUrl ? 1 : 0.45,
              }}
              title={docUrl ? "Download document" : "No file URL available"}
            >
              <FaDownload />
            </button>

            {/* Close btn */}
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: 8, cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.10)", color: "#596197",
                background: "transparent", display: "grid", placeItems: "center", fontSize: 14,
              }}
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* -- Scrollable body -- */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

          {/* Left: Document preview */}
          <div style={{
            flex: 1, minWidth: 0, overflow: "auto",
            borderRight: "1px solid rgba(255,255,255,0.07)",
            background: "#07091a",
          }}>
            {docUrl ? (
              docUrl.match(/\.(pdf)$/i) ? (
                <iframe
                  src={docUrl}
                  title={docLabel}
                  style={{ width: "100%", height: "100%", minHeight: 480, border: "none" }}
                />
              ) : docUrl.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i) ? (
                <img
                  src={docUrl}
                  alt={docLabel}
                  style={{ width: "100%", height: "auto", display: "block", padding: 24 }}
                />
              ) : (
                <div style={{ display: "grid", placeItems: "center", height: "100%", minHeight: 300, padding: 32, textAlign: "center" }}>
                  <div>
                    <div style={{ fontSize: 48, marginBottom: 16 }}><FaFile /></div>
                    <div style={{ color: "#f4f0ff", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{docLabel}</div>
                    <div style={{ color: "#596197", fontSize: 13, marginBottom: 24 }}>
                      This file type cannot be previewed directly.<br />Use the Download button to open it.
                    </div>
                    <button
                      onClick={handleDownload}
                      style={{
                        padding: "10px 24px", borderRadius: 10, cursor: docUrl ? "pointer" : "not-allowed",
                        border: "1px solid rgba(212,168,83,0.35)", color: "#D4A853",
                        background: "rgba(212,168,83,0.10)", fontSize: 13, fontWeight: 700,
                        opacity: docUrl ? 1 : 0.45,
                      }}
                    >
                      Download to View
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div style={{ display: "grid", placeItems: "center", height: "100%", minHeight: 300, padding: 32, textAlign: "center" }}>
                <div>
                  <div style={{ fontSize: 48, marginBottom: 16 }}><FaFile /></div>
                  <div style={{ color: "#f4f0ff", fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{docLabel}</div>
                  <div style={{ color: "#3d4570", fontSize: 13 }}>No file preview available</div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Acknowledgement panel */}
          <div style={{
            width: 260, flexShrink: 0, overflow: "auto",
            background: "#090c20", display: "flex", flexDirection: "column",
          }}>
            {/* Ack header */}
            <div style={{
              padding: "16px 18px 12px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#4e568e", fontSize: 10, letterSpacing: 2, fontWeight: 700 }}>
                  ACKNOWLEDGEMENTS
                </span>
                {allAcked
                  ? <span style={{ background: "rgba(77,184,150,0.15)", color: "#4db896", fontSize: 10, fontWeight: 800, padding: "2px 9px", borderRadius: 999 }}> All Done</span>
                  : <span style={{ background: "rgba(220,80,80,0.10)", color: "#e06060", fontSize: 10, fontWeight: 800, padding: "2px 9px", borderRadius: 999 }}>{participants.length - ackedList.length} Pending</span>
                }
              </div>

              {/* Progress bar */}
              <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden", marginBottom: 10 }}>
                <div style={{
                  height: "100%",
                  width: `${participants.length > 0 ? Math.round((ackedList.length / participants.length) * 100) : 0}%`,
                  background: allAcked ? "#4db896" : "linear-gradient(90deg,#D4A853,#f0c060)",
                  borderRadius: 99, transition: "width 0.3s ease",
                }} />
              </div>

              {!allAcked && (
                <button
                  onClick={ackAll}
                  style={{
                    width: "100%", padding: "7px 0", borderRadius: 8, cursor: "pointer",
                    border: "1px solid rgba(77,184,150,0.28)", color: "#4db896",
                    background: "rgba(77,184,150,0.06)", fontSize: 11, fontWeight: 700,
                  }}
                >
                  Acknowledge All
                </button>
              )}
            </div>

            {/* Participant rows */}
            <div style={{ flex: 1, overflow: "auto", padding: "10px 0" }}>
              {participants.map((person) => {
                const hasAcked = !!docAcks[person.id];
                return (
                  <div
                    key={person.id}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      gap: 10, padding: "10px 18px",
                      background: hasAcked ? "rgba(77,184,150,0.04)" : "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      transition: "background 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: person.color,
                          border: hasAcked ? "2px solid #4db896" : "2px solid rgba(255,255,255,0.08)",
                          display: "grid", placeItems: "center",
                          color: "#fff", fontSize: 10, fontWeight: 800,
                          transition: "border-color 0.2s",
                        }}>
                          {person.initials}
                        </div>
                        {hasAcked && (
                          <div style={{
                            position: "absolute", bottom: -2, right: -2,
                            width: 13, height: 13, borderRadius: "50%",
                            background: "#4db896", display: "grid", placeItems: "center",
                            fontSize: 7, color: "#fff",
                          }}></div>
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ color: "#f4f0ff", fontWeight: 700, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{person.name}</div>
                        <div style={{ color: hasAcked ? "#4db896" : "#596197", fontSize: 10 }}>
                          {hasAcked ? "Acknowledged" : person.role}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleAck(person.id)}
                      style={{
                        fontSize: 10, padding: "4px 10px", borderRadius: 7, cursor: "pointer", flexShrink: 0,
                        border: `1px solid ${hasAcked ? "rgba(220,80,80,0.28)" : "rgba(77,184,150,0.28)"}`,
                        color: hasAcked ? "#e06060" : "#4db896",
                        background: "transparent", fontWeight: 700, transition: "all 0.15s",
                      }}
                    >
                      {hasAcked ? "Revoke" : "Ack"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            {allAcked && (
              <div style={{
                padding: "12px 18px",
                background: "rgba(77,184,150,0.06)",
                borderTop: "1px solid rgba(77,184,150,0.15)",
                color: "#4db896", fontSize: 11, fontWeight: 700, textAlign: "center",
              }}>
                All {participants.length} acknowledged
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
   SUCCESS SUMMARY
------------------------------------------------------------------- */
function SuccessSummary({
  meeting, participants, attendance, agendaItems, voteItems, approvedItems,
  signed, votes, durationSeconds, agendaWork, onBack, onNextMeeting,
}) {
  const physicalCount = Object.values(attendance).filter((v) => v === "physical").length;
  const electronicCount = Object.values(attendance).filter((v) => v === "electronic").length;
  const absentCount = Object.values(attendance).filter((v) => v === "absent").length;
  const signedCount = Object.values(signed).filter(Boolean).length;
  const totalSignatures = approvedItems.length * participants.length;

  const allTasks = agendaItems.flatMap((agenda) =>
    ((agendaWork[agenda.id]?.tasks) || []).map((t) => ({ ...t, agendaTitle: agenda.title }))
  );

  const statusColor = (s) => {
    if (s === "Done") return "#4ade80";
    if (s === "In Progress") return "#D4A853";
    return "#7a83b8";
  };

  const tasksByStatus = {
    Pending: allTasks.filter((t) => t.status === "Pending"),
    "In Progress": allTasks.filter((t) => t.status === "In Progress"),
    Done: allTasks.filter((t) => t.status === "Done"),
  };

  return (
    <section className="co-panel co-success-panel">
      <div className="co-success-mark">OK</div>
      <div className="co-panel-head">
        <div>
          <h2>Meeting Completed Successfully</h2>
          <p>All meeting details, attendance, voting, print pack, and signing status are summarized below</p>
        </div>
        <div className="co-success-actions">
          <button className="co-ghost-btn" onClick={onBack}>Back</button>
          <button className="co-gold-btn" onClick={onNextMeeting}>Next Meeting</button>
        </div>
      </div>
      <div className="co-success-grid">
        <div><span>Meeting</span>         <strong>{meeting.title}</strong></div>
        <div><span>Date & Time</span>     <strong>{meeting.date} / {meeting.time || "09:00 AM"}</strong></div>
        <div><span>Duration</span>        <strong>{formatDuration(durationSeconds)}</strong></div>
        <div><span>Location</span>        <strong>{meeting.location}</strong></div>
        <div><span>Agenda Items</span>    <strong>{agendaItems.length}</strong></div>
        <div><span>Participants</span>    <strong>{participants.length}</strong></div>
        <div><span>Attendance</span>      <strong>{physicalCount} Physical / {electronicCount} Electronic / {absentCount} Absent</strong></div>
        <div><span>Voting Items</span>    <strong>{voteItems.length}</strong></div>
        <div><span>Approved Items</span>  <strong>{approvedItems.length}</strong></div>
        <div><span>Signatures</span>      <strong>{signedCount} / {totalSignatures || 0}</strong></div>
        <div><span>Total Tasks</span>     <strong>{allTasks.length}</strong></div>
        <div><span>Tasks Done</span>      <strong>{tasksByStatus["Done"].length} / {allTasks.length}</strong></div>
      </div>

      <div className="co-success-section">
        <h3>Approved Resolutions</h3>
        {approvedItems.length === 0 ? (
          <div className="co-empty">No approved items were recorded.</div>
        ) : (
          approvedItems.map((item) => {
            const result = getVoteResult(item.id, votes);
            return (
              <div key={item.id} className="co-summary-row">
                <div><b>{item.type}: {item.title}</b><span>{item.agendaTitle}</span></div>
                <em>Approve {result.approve} / Reject {result.reject} / Abstain {result.abstain}</em>
              </div>
            );
          })
        )}
      </div>

      {allTasks.length > 0 && (
        <div className="co-success-section">
          <h3>Task Summary</h3>
          <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            {Object.entries(tasksByStatus).map(([status, list]) => (
              <div key={status} style={{ background: "#080b1d", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(status) }} />
                <span className="co-muted" style={{ fontSize: 12 }}>{status}</span>
                <strong style={{ color: "#f4f0ff", fontSize: 14 }}>{list.length}</strong>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {allTasks.map((task) => {
              const assignee = participants.find((p) => p.id === task.assigneeId);
              return (
                <div key={task.id} className="co-summary-row" style={{ alignItems: "center" }}>
                  <div>
                    <b>{task.title}</b>
                    <span>{task.agendaTitle}{task.linkedType !== "agenda" && ` Â· ${task.linkedType} ${task.linkedIndex + 1}`}</span>
                  </div>
                  <em style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    {assignee && <span>{assignee.name}</span>}
                    {task.dueDate && <span>Due: {task.dueDate}</span>}
                    <span style={{ background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "2px 10px", color: statusColor(task.status), fontSize: 11, fontWeight: 700 }}>
                      {task.status}
                    </span>
                  </em>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------
   HELPERS
------------------------------------------------------------------- */
function getVoteItemId(type, agendaId, index) {
  return `${type}-${agendaId}-${index}`;
}

function getVoteResult(itemId, votes) {
  const itemVotes = Object.values(votes[itemId] || {});
  const approve = itemVotes.filter((v) => v === "Approve").length;
  const reject = itemVotes.filter((v) => v === "Reject").length;
  const abstain = itemVotes.filter((v) => v === "Abstain").length;
  const status = approve > reject && approve > 0 ? "Approved" : itemVotes.length ? "Pending" : "Waiting";
  return { approve, reject, abstain, status };
}

function formatDuration(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

