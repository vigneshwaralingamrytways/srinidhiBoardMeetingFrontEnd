import { useState } from "react";
import {
  FaTasks, FaUpload, FaBell, FaFileAlt, FaStickyNote,
  FaTrash, FaCheck, FaPlus, FaFilePdf, FaFileWord, FaFileExcel, FaFile,
} from "react-icons/fa";
import { TASK_STATUSES } from "./Helpers";
import { RichTextEditor } from "./OutputStep";

const TABS = [
  { id: "tasks", label: "Tasks", icon: <FaTasks /> },
  { id: "documents", label: "Documents & Notifications", icon: <FaUpload /> },
  { id: "atr", label: "Action Taken & Notes", icon: <FaFileAlt /> },
  { id: "open", label: "Open Agenda Items", icon: <FaStickyNote /> },
];

export default function TasksOverview({
  agendaItems, agendaWork, participants, updateTask, addTask, removeTask,
  openAgendaItems = {}, addOpenAgendaItem, updateOpenAgendaItem, removeOpenAgendaItem,
}) {
  const [tab, setTab] = useState("tasks");

  return (
    <section className="co-panel" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div className="co-panel-head" style={{ marginBottom: 14 }}>
        <div>
          <h2>Tasks & Post-Meeting Actions</h2>
          <p>Track action items, share documents, record outcomes, and raise new agenda points</p>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "8px 16px", borderRadius: 10, cursor: "pointer",
                border: active ? "1.5px solid #D4A853" : "1.5px solid rgba(255,255,255,0.08)",
                background: active ? "rgba(212,168,83,0.12)" : "rgba(255,255,255,0.02)",
                color: active ? "#D4A853" : "#596197",
                fontSize: 12, fontWeight: 700, transition: "all 0.15s ease",
              }}
            >
              {t.icon} {t.label}
            </button>
          );
        })}
      </div>

      {tab === "tasks" && (
        <TasksTab
          agendaItems={agendaItems}
          agendaWork={agendaWork}
          participants={participants}
          updateTask={updateTask}
          addTask={addTask}
          removeTask={removeTask}
        />
      )}

      {tab === "documents" && <DocumentsTab participants={participants} />}

      {tab === "atr" && (
        <ActionTakenTab agendaItems={agendaItems} participants={participants} />
      )}

      {tab === "open" && (
        <OpenAgendaTab
          agendaItems={agendaItems}
          participants={participants}
          openAgendaItems={openAgendaItems}
          addOpenAgendaItem={addOpenAgendaItem}
          updateOpenAgendaItem={updateOpenAgendaItem}
          removeOpenAgendaItem={removeOpenAgendaItem}
        />
      )}
    </section>
  );
}

/* =====================================================================
   TAB 1  TASKS (left list + right detail, same as before)
===================================================================== */
function TasksTab({ agendaItems, agendaWork, participants, updateTask, addTask, removeTask }) {
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

        {!addingTask && selectedTask && (() => {
          const assignee = participants.find((p) => p.id === selectedTask.assigneeId);
          const sc = sourceColor(selectedTask);
          const agendaTitle = agendaItems.find((a) => a.id === selectedTask.agendaId)?.title || "";
          return (
            <>
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

              <div style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#080b1d", borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
                <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 8, fontWeight: 700 }}>DESCRIPTION</div>
                <RichTextEditor
                  value={selectedTask.description || ""}
                  placeholder="No description yet  click edit to add one"
                  onChange={(html) => updateTask(selectedTask.agendaId, selectedTask.id, "description", html)}
                />
              </div>

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

/* =====================================================================
   TAB 2  DOCUMENT UPLOAD & NOTIFICATIONS (post-meeting)
===================================================================== */
function DocumentsTab({ participants }) {
  const [docs, setDocs] = useState([]);

  const fileIcon = (name = "") => {
    const ext = name.split(".").pop().toLowerCase();
    if (ext === "pdf") return <FaFilePdf style={{ color: "#e06060" }} />;
    if (["doc", "docx"].includes(ext)) return <FaFileWord style={{ color: "#6aaaee" }} />;
    if (["xls", "xlsx", "csv"].includes(ext)) return <FaFileExcel style={{ color: "#4ade80" }} />;
    return <FaFile style={{ color: "#D4A853" }} />;
  };

  const formatSize = (bytes) => {
    if (!bytes) return "";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const handleFiles = (fileList) => {
    const newDocs = Array.from(fileList).map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toLocaleString(),
      notified: false,
      notifiedAt: null,
    }));
    setDocs((cur) => [...newDocs, ...cur]);
  };

  const sendNotification = (docId) => {
    setDocs((cur) => cur.map((d) => d.id === docId ? { ...d, notified: true, notifiedAt: new Date().toLocaleString() } : d));
  };

  const removeDoc = (docId) => setDocs((cur) => cur.filter((d) => d.id !== docId));

  return (
    <div>
      {/* Upload area */}
      <label
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
          border: "1.5px dashed rgba(212,168,83,0.30)", borderRadius: 16, padding: "32px 20px",
          cursor: "pointer", background: "rgba(212,168,83,0.03)", marginBottom: 22, textAlign: "center",
        }}
      >
        <FaUpload style={{ fontSize: 26, color: "#D4A853" }} />
        <div style={{ color: "#f4f0ff", fontWeight: 700, fontSize: 14 }}>Upload post-meeting documents</div>
        <div style={{ color: "#596197", fontSize: 12 }}>Signed minutes, approved resolutions, reports, attachments</div>
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={(e) => { if (e.target.files?.length) { handleFiles(e.target.files); e.target.value = ""; } }}
        />
        <span className="co-gold-btn" style={{ pointerEvents: "none", marginTop: 4 }}>Choose Files</span>
      </label>

      {/* Document list */}
      {docs.length === 0 ? (
        <div className="co-output-empty-state">
          <div className="co-output-empty-icon"><FaUpload /></div>
          <div className="co-output-empty-title">No Documents Uploaded</div>
          <div className="co-output-empty-sub">Upload signed documents above, then notify participants once ready.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {docs.map((doc) => (
            <div key={doc.id} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
              background: "#080b1d", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12,
            }}>
              <div style={{ fontSize: 22, flexShrink: 0 }}>{fileIcon(doc.name)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "#f4f0ff", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.name}</div>
                <div style={{ color: "#596197", fontSize: 11, marginTop: 2 }}>
                  {formatSize(doc.size)} · Uploaded {doc.uploadedAt}
                  {doc.notified && <span style={{ color: "#4db896", marginLeft: 8 }}>· Notified {doc.notifiedAt}</span>}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                {doc.notified ? (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(77,184,150,0.12)", color: "#4db896",
                    border: "1px solid rgba(77,184,150,0.25)", borderRadius: 999,
                    fontSize: 11, fontWeight: 800, padding: "5px 12px",
                  }}>
                    <FaCheck style={{ fontSize: 9 }} /> Notified {participants.length} member{participants.length !== 1 ? "s" : ""}
                  </span>
                ) : (
                  <button
                    className="co-ghost-btn"
                    style={{ fontSize: 11, padding: "6px 14px", borderColor: "rgba(212,168,83,0.3)", color: "#D4A853", display: "flex", alignItems: "center", gap: 6 }}
                    onClick={() => sendNotification(doc.id)}
                  >
                    <FaBell style={{ fontSize: 10 }} /> Notify Members
                  </button>
                )}
                <button
                  onClick={() => removeDoc(doc.id)}
                  title="Remove document"
                  style={{ background: "none", border: "none", color: "#3d4570", cursor: "pointer", padding: "6px", display: "flex" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#e06060"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#3d4570"}
                >
                  <FaTrash style={{ fontSize: 11 }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =====================================================================
   TAB 3  ACTION TAKEN REPORT & PERSONAL NOTES (per agenda item)
===================================================================== */
function ActionTakenTab({ agendaItems, participants }) {
  const [activeAgendaId, setActiveAgendaId] = useState(agendaItems[0]?.id);
  const [reports, setReports] = useState({});       // { [agendaId]: html }
  const [personalNotes, setPersonalNotes] = useState({}); // { [agendaId]: { [participantId]: text } }

  const activeAgenda = agendaItems.find((a) => a.id === activeAgendaId) || agendaItems[0];

  const setReport = (html) => setReports((cur) => ({ ...cur, [activeAgenda.id]: html }));

  const setNote = (participantId, value) =>
    setPersonalNotes((cur) => ({
      ...cur,
      [activeAgenda.id]: { ...(cur[activeAgenda.id] || {}), [participantId]: value },
    }));

  if (!activeAgenda) {
    return (
      <div className="co-output-empty-state">
        <div className="co-output-empty-title">No Agenda Items</div>
        <div className="co-output-empty-sub">Add agenda items before recording action taken reports.</div>
      </div>
    );
  }

  return (
    <section className="co-agenda-layout">
      {/* LEFT: agenda picker */}
      <div className="co-panel" style={{ display: "flex", flexDirection: "column", gap: 0, height: "fit-content", position: "sticky", top: 0 }}>
        <div className="co-panel-head">
          <div>
            <h2>Agenda Items</h2>
            <p>Select an item to add its ATR & notes</p>
          </div>
        </div>
        <div className="co-agenda-list" style={{ maxHeight: 480, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "rgba(212,168,83,0.2) transparent" }}>
          {agendaItems.map((agenda) => {
            const active = activeAgenda.id === agenda.id;
            const hasReport = !!reports[agenda.id];
            return (
              <button
                key={agenda.id}
                className={active ? "active" : ""}
                onClick={() => setActiveAgendaId(agenda.id)}
                style={{ width: "100%", textAlign: "left" }}
              >
                <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ color: active ? "#f4f0ff" : "#8b93c8", fontWeight: 600, fontSize: 12 }}>{agenda.title}</span>
                  {hasReport && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#4db896", background: "rgba(77,184,150,0.10)", borderRadius: 999, padding: "1px 8px", width: "fit-content" }}>
                      ATR added
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT: ATR + personal notes */}
      <div className="co-panel co-agenda-full co-output-rich-panel">
        <div className="co-panel-head" style={{ marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "#4f578f", marginBottom: 6, textTransform: "uppercase" }}>
              Action Taken Report
            </div>
            <h2>{activeAgenda.title}</h2>
            <p>Record what was done after the meeting for this agenda item</p>
          </div>
        </div>

        <div style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#080b1d", borderRadius: 14, padding: "14px 16px", marginBottom: 24 }}>
          <RichTextEditor
            value={reports[activeAgenda.id] || ""}
            onChange={setReport}
            placeholder="Describe the action taken for this agenda item after the meeting"
            minHeight={140}
          />
        </div>

        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "#4f578f", marginBottom: 12, textTransform: "uppercase" }}>
          Personal Notes for Members
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {participants.map((person) => (
            <div key={person.id} style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#080b1d", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: person.color, overflow: "hidden", flexShrink: 0 }}>
                  <img src={person.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=0D1117&color=fff`} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{ color: "#f4f0ff", fontSize: 12, fontWeight: 700 }}>{person.name}</div>
                  <div style={{ color: "#596197", fontSize: 10, textTransform: "capitalize" }}>{person.role}</div>
                </div>
              </div>
              <textarea
                className="co-rich-textarea"
                style={{ minHeight: 60, width: "100%" }}
                placeholder={`Private note for ${person.name}`}
                value={(personalNotes[activeAgenda.id] || {})[person.id] || ""}
                onChange={(e) => setNote(person.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   TAB 4  OPEN AGENDA ITEMS (raised after the meeting)
===================================================================== */
function OpenAgendaTab({ agendaItems, participants, openAgendaItems, addOpenAgendaItem, updateOpenAgendaItem, removeOpenAgendaItem }) {
  const GENERAL_KEY = "general";
  const groupOptions = [{ id: GENERAL_KEY, title: "General / New Topic" }, ...agendaItems];

  const [form, setForm] = useState({
    groupId: GENERAL_KEY,
    title: "",
    details: "",
    type: "Next Meeting", // "Immediate" | "Next Meeting"
    notifyAll: true,
    assignedTo: "",
    dueDate: "",
  });

  const resetForm = () => setForm({ groupId: GENERAL_KEY, title: "", details: "", type: "Next Meeting", notifyAll: true, assignedTo: "", dueDate: "" });

  const handleAdd = () => {
    if (!form.title.trim() || !addOpenAgendaItem) return;
    addOpenAgendaItem(form.groupId, {
      id: Date.now() + Math.random(),
      title: form.title.trim(),
      details: form.details.trim(),
      type: form.type,
      notifyAll: form.notifyAll,
      assignedTo: form.assignedTo,
      dueDate: form.dueDate,
      createdAt: new Date().toLocaleString(),
      status: "Open",
    });
    resetForm();
  };

  const allOpenItems = Object.entries(openAgendaItems || {}).flatMap(([groupId, items]) =>
    (items || []).map((item) => ({ ...item, groupId }))
  );

  const groupTitle = (groupId) => {
    if (groupId === GENERAL_KEY) return "General / New Topic";
    return agendaItems.find((a) => a.id === groupId)?.title || "Unknown Agenda";
  };

  const typeColor = (t) => (t === "Immediate" ? { bg: "rgba(220,80,80,0.10)", color: "#e06060" } : { bg: "rgba(212,168,83,0.10)", color: "#D4A853" });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {/* LEFT: add form */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "#4f578f", marginBottom: 14, textTransform: "uppercase" }}>
          Raise New Open Agenda Item
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 6, fontWeight: 700 }}>RELATED AGENDA</div>
            <select className="co-input" value={form.groupId} onChange={(e) => setForm((f) => ({ ...f, groupId: e.target.value }))}>
              {groupOptions.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
            </select>
          </div>

          <div>
            <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 6, fontWeight: 700 }}>TITLE</div>
            <input className="co-input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="New agenda topic title" />
          </div>

          <div>
            <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 6, fontWeight: 700 }}>DETAILS</div>
            <textarea className="co-rich-textarea" style={{ minHeight: 90 }} value={form.details} onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))} placeholder="Describe the topic to be addressed" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 8, fontWeight: 700 }}>WHEN TO ADDRESS</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["Immediate", "Next Meeting"].map((t) => {
                  const sel = form.type === t;
                  const tc = typeColor(t);
                  return (
                    <button
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, type: t }))}
                      style={{
                        flex: 1, padding: "8px 10px", borderRadius: 10, cursor: "pointer",
                        fontWeight: 700, fontSize: 11,
                        border: sel ? `1px solid ${tc.color}` : "1px solid rgba(255,255,255,0.08)",
                        background: sel ? tc.bg : "#090c20",
                        color: sel ? tc.color : "#596197",
                        transition: "all 0.15s",
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 6, fontWeight: 700 }}>ASSIGN TO</div>
              <select className="co-input" value={form.assignedTo} onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))}>
                <option value="">Unassigned</option>
                {participants.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 6, fontWeight: 700 }}>TARGET DATE</div>
              <input className="co-input" type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                onClick={() => setForm((f) => ({ ...f, notifyAll: !f.notifyAll }))}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "9px 12px", borderRadius: 10, cursor: "pointer", fontSize: 11, fontWeight: 700,
                  border: form.notifyAll ? "1px solid rgba(77,184,150,0.35)" : "1px solid rgba(255,255,255,0.08)",
                  background: form.notifyAll ? "rgba(77,184,150,0.10)" : "#090c20",
                  color: form.notifyAll ? "#4db896" : "#596197",
                }}
              >
                <FaBell style={{ fontSize: 10 }} />
                {form.notifyAll ? "Will notify all members" : "Notification off"}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="co-gold-btn" disabled={!form.title.trim()} style={{ opacity: form.title.trim() ? 1 : 0.4 }} onClick={handleAdd}>
              <FaPlus style={{ fontSize: 10, marginRight: 6 }} /> Add Open Agenda Item
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: list of open items */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "#4f578f", marginBottom: 14, textTransform: "uppercase" }}>
          Open Agenda Items ({allOpenItems.length})
        </div>

        {allOpenItems.length === 0 ? (
          <div className="co-output-empty-state">
            <div className="co-output-empty-icon"><FaStickyNote /></div>
            <div className="co-output-empty-title">No Open Items Yet</div>
            <div className="co-output-empty-sub">Items raised here will be shared with members and addressed immediately or carried to the next meeting.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 520, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "rgba(212,168,83,0.2) transparent" }}>
            {allOpenItems.map((item) => {
              const assignee = participants.find((p) => p.id === item.assignedTo);
              const tc = typeColor(item.type);
              return (
                <div key={item.id} style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#080b1d", borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: "#f4f0ff", fontWeight: 700, fontSize: 13 }}>{item.title}</div>
                      <div style={{ color: "#596197", fontSize: 11, marginTop: 2 }}>{groupTitle(item.groupId)}</div>
                    </div>
                    <button
                      onClick={() => removeOpenAgendaItem && removeOpenAgendaItem(item.groupId, item.id)}
                      title="Remove"
                      style={{ background: "none", border: "none", color: "#3d4570", cursor: "pointer", flexShrink: 0 }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#e06060"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "#3d4570"}
                    >
                      <FaTrash style={{ fontSize: 11 }} />
                    </button>
                  </div>

                  {item.details && (
                    <div style={{ color: "#8b93c8", fontSize: 12, lineHeight: 1.6, marginBottom: 8, whiteSpace: "pre-wrap" }}>{item.details}</div>
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 9px", borderRadius: 999, background: tc.bg, color: tc.color }}>
                      {item.type}
                    </span>
                    {item.notifyAll && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 999, background: "rgba(77,184,150,0.10)", color: "#4db896", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <FaBell style={{ fontSize: 9 }} /> Notified
                      </span>
                    )}
                    {assignee && <span style={{ fontSize: 10, color: "#4e568e" }}>{assignee.name}</span>}
                    {item.dueDate && <span style={{ fontSize: 10, color: "#4e568e" }}>Target: {item.dueDate}</span>}
                  </div>

                  {/* Status toggle (Open / Addressed) */}
                  <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                    {["Open", "Addressed"].map((s) => {
                      const sel = (item.status || "Open") === s;
                      return (
                        <button
                          key={s}
                          onClick={() => updateOpenAgendaItem && updateOpenAgendaItem(item.groupId, { ...item, status: s })}
                          style={{
                            flex: 1, padding: "6px 10px", borderRadius: 8, cursor: "pointer",
                            fontWeight: 700, fontSize: 10,
                            border: sel ? "1px solid rgba(212,168,83,0.4)" : "1px solid rgba(255,255,255,0.08)",
                            background: sel ? "rgba(212,168,83,0.10)" : "#090c20",
                            color: sel ? "#D4A853" : "#596197",
                          }}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
