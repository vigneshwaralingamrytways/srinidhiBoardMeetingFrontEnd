import { useEffect, useMemo, useState } from "react";
import { DATA } from "./MeetingData";
import "./ConductMeeting.css";
import BoardPack from "./BoardPack";

// Separated components
import CalendarMeetingList from "./CalendarMeetingList";
import Wizard, { STEPS } from "./Wizard";
import MeetingDetails from "./MeetingDetails";
import Attendance from "./Attendance";
import ChairpersonElection from "./Chairpersonelection";
import AgendaDiscussion from "./AgendaDiscussion";
import VotingModal from "./Votingmodal";
import MOM from "./MOM";
// import TaskSection from "./Tasksection";
// import RichTextEditor from "./Richtexteditor";
import { getVoteItemId, getVoteResult, formatDuration, normalizeAttendance, toObj, TASK_STATUSES } from "./Helpers";

// Lazy-import heavy panels (kept inline for simplicity; split further if desired)
import OutputStep from "./OutputStep";
import TasksOverview from "./TaskOverview";
import { FaFilePdf, FaDownload, FaTimes, FaFile } from "react-icons/fa";
import BoardPackPanel from "./BoardPackPanel";
// import SuccessSummary from "./SuccessSummary";
// import BoardPackDocModal from "./BoardPackDocModal";

const createAttendance = () =>
  Object.fromEntries(DATA.participants.map((p) => [p.id, normalizeAttendance(p.attendance)]));

const createAgendaWork = () =>
  Object.fromEntries(
    DATA.agendaItems.map((item) => [
      item.id,
      {
        note: item.discussion || item.description || "",
        preNote: "",
        postNote: "",
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
  const [theme, setTheme] = useState("dark");
  // Open agenda items: { [agendaId]: [ { id, title, details, type, notifyAll, assignedTo, dueDate, createdAt } ] }
  const [openAgendaItems, setOpenAgendaItems] = useState({});

  const activeAgenda = DATA.agendaItems.find((i) => i.id === activeAgendaId) || DATA.agendaItems[0];
  const activeWork = agendaWork[activeAgenda?.id] || {
    note: "", preNote: "", postNote: "",
    resolutions: [], decisions: [], tasks: [],
    resolutionInput: { title: "", description: "" },
    decisionInput: { title: "", description: "" },
  };

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

  const chooseMeeting = (item) => {
    setMeeting(item);
    resetState();
    setMomData({ chairperson: DATA.chairpersonElection?.electedPersonId || "", secretary: "", notes: "", actionItems: "" });
  };

  const resetState = () => {
    setStep(0); setFinished(false); setDurationSeconds(0); setTimerStopped(false);
    setVotes({}); setSigned({}); setAgendaAcknowledgements(createAgendaAcknowledgements());
    setMeetingCancelled(false); setShowAckWarning(false);
    setChairVotes(createChairVotes()); setMomAcknowledgements(createMomAcknowledgements());
    setAttendance(createAttendance()); setAgendaWork(createAgendaWork()); setSavedMoms(createSavedMoms());
    setActiveAgendaId(DATA.agendaItems[0]?.id);
    setResAgendaId(DATA.agendaItems[0]?.id);
    setDecAgendaId(DATA.agendaItems[0]?.id);
    setOpenAgendaItems({});
  };

  /* Open agenda mutations */
  const addOpenAgendaItem = (agendaId, item) =>
    setOpenAgendaItems(cur => ({ ...cur, [agendaId]: [...(cur[agendaId] || []), item] }));

  const updateOpenAgendaItem = (agendaId, updated) =>
    setOpenAgendaItems(cur => ({
      ...cur,
      [agendaId]: (cur[agendaId] || []).map(i => i.id === updated.id ? updated : i),
    }));

  const removeOpenAgendaItem = (agendaId, itemId) =>
    setOpenAgendaItems(cur => ({
      ...cur,
      [agendaId]: (cur[agendaId] || []).filter(i => i.id !== itemId),
    }));

  const goToStep = (nextStep) => {
    if (!meeting) return;
    if (nextStep >= 9) setTimerStopped(true);
    setStep(nextStep);
  };

  const resetToMeetingList = () => {
    setMeeting(null);
    resetState();
    setMomData({ chairperson: DATA.chairpersonElection?.electedPersonId || "", secretary: "", notes: "", actionItems: "" });
  };

  /* Agenda work mutations */
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

  /* Task mutations */
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
        tasks: (cur[agendaId].tasks || []).map((t) => t.id === taskId ? { ...t, [field]: value } : t),
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

  /* Voting */
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

  // updateNote supporting phase keys
  const updateNote = (val, key = "note") => updateAgendaField(activeAgenda.id, key, val);

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

      {/* {viewDoc && (
        <BoardPackDocModal
          doc={viewDoc}
          participants={DATA.participants}
          acks={boardPackAcks}
          setAcks={setBoardPackAcks}
          onClose={() => setViewDoc(null)}
        />
      )} */}

      <main className="co-main" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        <div className="co-head" style={{ padding: "0", marginBottom: 4, marginTop: -16, flexShrink: 0 }}>
          {meeting && <button className="co-ghost-btn" onClick={resetToMeetingList}>Home</button>}
          <button
            className="co-theme-toggle"
            onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            <span>{theme === "dark" ? "" : ""}</span>
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
              <CalendarMeetingList
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
                      <BoardPackPanel
                        selected={selectedBoardPack}
                        setSelected={setSelectedBoardPack}
                        onDocClick={(doc) => setViewDoc(doc)}
                      />
                    </section>
                  )}

                  {step === 4 && (
                    <AgendaDiscussion
                      agendaItems={DATA.agendaItems}
                      agendaWork={agendaWork}
                      activeAgenda={activeAgenda}
                      activeWork={activeWork}
                      setActiveAgendaId={(id) => setActiveAgendaId(id)}
                      updateNote={updateNote}
                      goToStep={goToStep}
                      setResAgendaId={setResAgendaId}
                      setDecAgendaId={setDecAgendaId}
                      participants={DATA.participants}
                      attendance={attendance}
                      agendaAcknowledgements={agendaAcknowledgements}
                      toggleAgendaAck={toggleAgendaAck}
                      ackAllAgenda={ackAllAgenda}
                      openAgendaItems={openAgendaItems}
                      addOpenAgendaItem={addOpenAgendaItem}
                      updateOpenAgendaItem={updateOpenAgendaItem}
                      removeOpenAgendaItem={removeOpenAgendaItem}
                      {...taskProps}
                    />
                  )}

                  {/* Agenda Ack Warning Modal */}
                  {showAckWarning && (
                    <div className="co-modal-overlay">
                      <div className="co-modal" style={{ padding: "32px 28px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                          <div style={{ width: 44, height: 44, borderRadius: "50%", display: "grid", placeItems: "center", background: "rgba(220,80,80,0.15)", color: "#e06060", fontSize: 20, fontWeight: 900, flexShrink: 0 }}>!</div>
                          <div>
                            <div style={{ color: "#fff", fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Agenda Not Fully Acknowledged</div>
                            <div style={{ color: "#596197", fontSize: 13 }}>Not all present participants have acknowledged every agenda item.</div>
                          </div>
                        </div>
                        <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(220,80,80,0.06)", border: "1px solid rgba(220,80,80,0.18)", color: "#c07070", fontSize: 12, lineHeight: 1.7, marginBottom: 22 }}>
                          {DATA.agendaItems.map((item) => {
                            const present = DATA.participants.filter((p) => attendance[p.id] === "physical" || attendance[p.id] === "electronic");
                            const acks = agendaAcknowledgements[item.id] || {};
                            const pending = present.filter((p) => !acks[p.id]);
                            if (pending.length === 0) return null;
                            return (
                              <div key={item.id} style={{ marginBottom: 6 }}>
                                <span style={{ color: "#d4a853", fontWeight: 700 }}>{item.title}</span>
                                <span style={{ marginLeft: 8 }}> {pending.map((p) => p.name).join(", ")} pending</span>
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

                  {meetingCancelled && (
                    <div style={{ marginTop: 32, padding: "48px 32px", border: "1px solid rgba(220,80,80,0.22)", borderRadius: 24, background: "#0d1028", textAlign: "center" }}>
                      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(220,80,80,0.15)", color: "#e06060", fontSize: 26, fontWeight: 900, display: "grid", placeItems: "center", margin: "0 auto 20px" }}>?</div>
                      <div style={{ color: "#e06060", fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Meeting Cancelled</div>
                      <div style={{ color: "#596197", fontSize: 14, marginBottom: 32 }}>This meeting was cancelled due to incomplete agenda acknowledgements.</div>
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
                </div>

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
