import { useState, useMemo } from "react";
import {
  FaEdit, FaTrash, FaCheck, FaPlus, FaSitemap, FaGlobe,
  FaChevronRight, FaRegClock,
} from "react-icons/fa";
import { TASKS as SEED_TASKS, getAgendaTitleById, getParticipantById, PARTICIPANTS } from "./ConductMeetingData";



const STATUS_OPTS = ["Pending", "In Progress", "Completed"];
const PRIORITY_OPTS = ["Low", "Medium", "High"];

const statusColor = (status) =>
  status === "Completed" ? "#4db896" : status === "In Progress" ? "#6aaaee" : "#D4A853";

const priorityColor = (p) =>
  p === "High" ? "#e06060" : p === "Medium" ? "#D4A853" : "#596197";

export default function TaskPanel({ agendaId, agendaName, prefillTitle = "" }) {
  const [tasks, setTasks] = useState(SEED_TASKS);
  const [scope, setScope] = useState(agendaId ? "agenda" : "all"); // agenda | common | all
  const [activeId, setActiveId] = useState(null);
  const [mode, setMode] = useState("view"); // view | edit
  const [showAdd, setShowAdd] = useState(!!prefillTitle);
  const [draft, setDraft] = useState({
    title: prefillTitle,
    description: "",
    assigneeId: PARTICIPANTS[0]?.id || null,
    dueDate: "",
    priority: "Medium",
    taskType: "Internal",
  });

  const scopedTasks = useMemo(() => {
    if (scope === "agenda") return tasks.filter((t) => t.agendaId === agendaId);
    if (scope === "common") return tasks.filter((t) => !t.agendaId);
    return tasks;
  }, [tasks, scope, agendaId]);

  const activeTask = tasks.find((t) => t.id === activeId) || null;

  const selectTask = (task) => { setActiveId(task.id); setMode("view"); };

  const updateTask = (id, patch) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const addTask = () => {
    if (!draft.title.trim()) return;
    const newTask = {
      id: `t${Date.now()}`,
      title: draft.title.trim(),
      description: draft.description?.trim()
        ? `<p>${draft.description.trim()}</p>`
        : "",
      agendaId: scope === "common" ? null : agendaId,
      assigneeId: draft.assigneeId,
      dueDate: draft.dueDate,
      status: "Pending",
      priority: draft.priority,
      taskType: draft.taskType,
    };
    setTasks((prev) => [...prev, newTask]);
    setDraft({ title: "", description: "", assigneeId: PARTICIPANTS[0]?.id || null, dueDate: "", priority: "Medium" });
    setShowAdd(false);
    setActiveId(newTask.id);
  };

  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <div>
          <div style={S.eyebrow}>TASKS</div>
          <div style={S.headTitle}>
            {scope === "agenda" && agendaName ? `Linked to "${agendaName}"` : scope === "common" ? "Common Tasks" : "All Tasks"}
          </div>
        </div>
        {/* <button style={S.addBtn} onClick={() => { setShowAdd((v) => !v); setActiveId(null); }}>
          <FaPlus style={{ fontSize: 10, marginRight: 6 }} /> Add Task
        </button> */}
      </div>

      <div style={S.toggleRow}>
        {agendaId != null && (
          <button style={S.toggleBtn(scope === "agenda")} onClick={() => { setScope("agenda"); setActiveId(null); setShowAdd(false); }}>
            <FaSitemap size={10} style={{ marginRight: 5 }} /> This Agenda
          </button>
        )}
        <button style={S.toggleBtn(scope === "common")} onClick={() => { setScope("common"); setActiveId(null); setShowAdd(false); }}>
          <FaGlobe size={10} style={{ marginRight: 5 }} /> Common
        </button>
        <button style={S.toggleBtn(scope === "all")} onClick={() => { setScope("all"); setActiveId(null); setShowAdd(false); }}>
          All
        </button>
      </div>

      <div style={S.splitRow}>
        {/* LEFT  list */}
        <div style={S.left}>
          {showAdd && (
            <AddTaskForm
              draft={draft}
              setDraft={setDraft}
              scope={scope}
              agendaName={agendaName}
              onAdd={addTask}
              onCancel={() => setShowAdd(false)}
            />
          )}

          {scopedTasks.length === 0 ? (
            <div style={S.emptySm}>No tasks in this view yet.</div>
          ) : (
            scopedTasks.map((task) => {
              const linkedTitle = task.agendaId ? getAgendaTitleById(task.agendaId) : null;
              const assignee = getParticipantById(task.assigneeId);
              const isActive = activeId === task.id;
              return (
                <div key={task.id} style={S.row(isActive)} onClick={() => selectTask(task)}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={S.rowTitle}>{task.title}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={S.statusBadge(task.status)}>{task.status}</span>
                      {linkedTitle ? <span style={S.badge("agenda")}>{linkedTitle}</span> : <span style={S.badge("common")}>Common</span>}
                      {assignee && <span style={S.metaTxt}>{assignee.name.split(" ")[0]}</span>}
                    </div>
                  </div>
                  <FaChevronRight size={10} style={{ color: "#3d4570", flexShrink: 0 }} />
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT  detail / edit */}
        <div style={S.right}>
          {!activeTask ? (
            <div style={S.emptyBig}>Select a task to view its details</div>
          ) : mode === "edit" ? (
            <EditTaskForm task={activeTask} onSave={(patch) => { updateTask(activeTask.id, patch); setMode("view"); }} onCancel={() => setMode("view")} />
          ) : (
            <TaskDetail
              task={activeTask}
              agendaTitle={activeTask.agendaId ? getAgendaTitleById(activeTask.agendaId) : null}
              assignee={getParticipantById(activeTask.assigneeId)}
              onEdit={() => setMode("edit")}
              onDelete={() => deleteTask(activeTask.id)}
              onStatusChange={(status) => updateTask(activeTask.id, { status })}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
   Add form (inline, in the left column)
------------------------------------------------------------------- */
function AddTaskForm({ draft, setDraft, scope, agendaName, onAdd, onCancel }) {
  return (
    <div style={S.addBox}>
      <div style={S.addBoxLabel}>
        New task {scope === "common" ? "(common)" : agendaName ? `(linked to "${agendaName}")` : ""}
      </div>
      <input
        style={S.input}
        placeholder="Task title"
        value={draft.title}
        onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
      />
      <textarea
        style={S.textarea}
        rows={2}
        placeholder="Description (optional)"
        value={draft.description}
        onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
      />
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <select
          style={{ ...S.input, flex: 1 }}
          value={draft.assigneeId || ""}
          onChange={(e) => setDraft((p) => ({ ...p, assigneeId: Number(e.target.value) }))}
        >
          {PARTICIPANTS.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <input
          style={{ ...S.input, flex: 1 }}
          type="date"
          value={draft.dueDate}
          onChange={(e) => setDraft((p) => ({ ...p, dueDate: e.target.value }))}
        />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button style={S.ghostBtn} onClick={onCancel}>Cancel</button>
        <button style={S.goldBtn} onClick={onAdd}>Add</button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
   Detail (view) panel
------------------------------------------------------------------- */
function TaskDetail({ task, agendaTitle, assignee, onEdit, onDelete, onStatusChange }) {
  return (
    <div>
      <div style={{ marginBottom: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {agendaTitle ? (
          <span style={S.badgeLg("agenda")}><FaSitemap size={9} style={{ marginRight: 5 }} />{agendaTitle}</span>
        ) : (
          <span style={S.badgeLg("common")}><FaGlobe size={9} style={{ marginRight: 5 }} />Common task</span>
        )}
        <span style={{ ...S.badgeLg("priority"), color: priorityColor(task.priority), borderColor: `${priorityColor(task.priority)}55`, background: `${priorityColor(task.priority)}1a` }}>
          {task.priority} priority
        </span>
      </div>

      <div style={S.detailTitle}>{task.title}</div>

      {task.description && (
        <div style={S.detailBody} dangerouslySetInnerHTML={{ __html: task.description }} />
      )}

      <div style={{ display: "flex", gap: 16, marginTop: 16, marginBottom: 16, flexWrap: "wrap" }}>
        {assignee && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", overflow: "hidden", background: assignee.color, flexShrink: 0 }}>
              <img src={assignee.image} alt={assignee.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <div style={{ color: "#f4f0ff", fontSize: 12, fontWeight: 700 }}>{assignee.name}</div>
              <div style={{ color: "#596197", fontSize: 10 }}>Assignee</div>
            </div>
          </div>
        )}
        {task.dueDate && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#8b93c8", fontSize: 12 }}>
            <FaRegClock style={{ fontSize: 11, color: "#596197" }} /> Due {task.dueDate}
          </div>
        )}
      </div>

      <div style={S.fieldLabel}>Status</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {STATUS_OPTS.map((s) => {
          const selected = task.status === s;
          const c = statusColor(s);
          return (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              style={{
                flex: 1, padding: "8px 10px", borderRadius: 9, cursor: "pointer", fontWeight: 700, fontSize: 11.5,
                border: `1px solid ${selected ? c + "88" : "rgba(255,255,255,0.08)"}`,
                background: selected ? c + "22" : "#090c20",
                color: selected ? c : "#596197",
              }}
            >
              {s}
            </button>
          );
        })}
      </div>

      <div style={S.actionRow}>
        <button style={S.ghostBtn} onClick={onEdit}><FaEdit style={{ marginRight: 6 }} /> Edit</button>
        <button style={S.dangerBtn} onClick={onDelete}><FaTrash size={11} /></button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
   Edit panel
------------------------------------------------------------------- */
function EditTaskForm({ task, onSave, onCancel }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description?.replace(/<[^>]+>/g, "") || "");
  const [taskType, setTaskType] = useState(task.taskType || "Internal");
  const [assigneeId, setAssigneeId] = useState(task.assigneeId);
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [priority, setPriority] = useState(task.priority || "Medium");

  return (
    <div>
      <div style={S.fieldLabel}>Task Title</div>
      <input style={{ ...S.input, marginBottom: 12 }} value={title} onChange={(e) => setTitle(e.target.value)} />

      <div style={S.fieldLabel}>Description</div>
      <textarea style={{ ...S.textarea, minHeight: 90, marginBottom: 12 }} value={description} onChange={(e) => setDescription(e.target.value)} />

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={S.fieldLabel}>Assignee</div>
          <select style={S.input} value={assigneeId || ""} onChange={(e) => setAssigneeId(Number(e.target.value))}>
            {PARTICIPANTS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <div style={S.fieldLabel}>Due Date</div>
          <input style={S.input} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
      </div>

      <div style={S.fieldLabel}>Priority</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {PRIORITY_OPTS.map((p) => {
          const selected = priority === p;
          const c = priorityColor(p);
          return (
            <button
              key={p}
              onClick={() => setPriority(p)}
              style={{
                flex: 1, padding: "9px 14px", borderRadius: 10, cursor: "pointer", fontWeight: 800, fontSize: 12,
                border: `1px solid ${selected ? c + "88" : "rgba(255,255,255,0.08)"}`,
                background: selected ? c + "22" : "#090c20",
                color: selected ? c : "#596197",
              }}
            >
              {p}
            </button>
          );
        })}
      </div>
      <div style={S.fieldLabel}>Task Type</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {["Internal", "ATR"].map((type) => {
          const selected = taskType === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => setTaskType(type)}
              style={{
                flex: 1,
                padding: "9px 14px",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 12,
                border: `1px solid ${selected
                  ? "rgba(212,168,83,0.45)"
                  : "rgba(255,255,255,0.08)"
                  }`,
                background: selected
                  ? "rgba(212,168,83,0.12)"
                  : "#090c20",
                color: selected ? "#D4A853" : "#596197",
              }}
            >
              {type}
            </button>
          );
        })}
      </div>
      <div style={S.actionRow}>
        <button
          style={S.goldBtn}
          onClick={() => onSave({
            title,
            description: description ? `<p>${description}</p>` : "",
            assigneeId,
            dueDate,
            priority,
            taskType,
          })}
        >
          <FaCheck style={{ marginRight: 6 }} /> Save Changes
        </button>
        <button style={S.ghostBtn} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
   Styles (kept consistent with ResolutionPanel / BoardPackPanel)
------------------------------------------------------------------- */
const S = {
  wrap: { display: "flex", flexDirection: "column", gap: 10 },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap" },
  eyebrow: { fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: "#4f578f", marginBottom: 4 },
  headTitle: { fontSize: 15, fontWeight: 700, color: "#f4f0ff" },
  addBtn: { display: "inline-flex", alignItems: "center", padding: "8px 14px", borderRadius: 9, border: "1px solid rgba(212,168,83,0.35)", color: "#D4A853", background: "rgba(212,168,83,0.08)", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  toggleRow: { display: "flex", gap: 6, flexWrap: "wrap" },
  toggleBtn: (active) => ({
    display: "inline-flex", alignItems: "center", padding: "6px 13px", borderRadius: 20,
    border: `1px solid ${active ? "rgba(212,168,83,0.45)" : "rgba(255,255,255,0.08)"}`,
    background: active ? "rgba(212,168,83,0.14)" : "transparent",
    color: active ? "#D4A853" : "#596197", fontSize: 11, fontWeight: 700, cursor: "pointer",
  }),
  splitRow: { display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" },
  left: { flex: "1 1 280px", minWidth: 0, display: "flex", flexDirection: "column", gap: 6, maxHeight: 460, overflowY: "auto" },
  right: { flex: "1 1 340px", minWidth: 0, background: "#080b1d", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 18, minHeight: 220 },
  row: (active) => ({
    display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
    border: `1px solid ${active ? "rgba(212,168,83,0.35)" : "rgba(255,255,255,0.05)"}`,
    background: active ? "rgba(212,168,83,0.08)" : "#080b1d", transition: "all 0.15s",
  }),
  rowTitle: { fontSize: 12.5, fontWeight: 600, color: "#e8e6f8", lineHeight: 1.35 },
  metaTxt: { fontSize: 10.5, color: "#596197" },
  badge: (kind) => ({
    fontSize: 9.5, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
    background: kind === "agenda" ? "rgba(212,168,83,0.12)" : "rgba(106,170,238,0.12)",
    color: kind === "agenda" ? "#D4A853" : "#6aaaee",
  }),
  badgeLg: (kind) => ({
    display: "inline-flex", alignItems: "center", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
    background: kind === "agenda" ? "rgba(212,168,83,0.12)" : kind === "priority" ? "transparent" : "rgba(106,170,238,0.12)",
    color: kind === "agenda" ? "#D4A853" : "#6aaaee",
    border: `1px solid ${kind === "agenda" ? "rgba(212,168,83,0.3)" : "rgba(106,170,238,0.3)"}`,
  }),
  statusBadge: (status) => ({
    fontSize: 9.5, fontWeight: 800, padding: "2px 8px", borderRadius: 20,
    background: `${statusColor(status)}22`, color: statusColor(status),
  }),
  emptySm: { fontSize: 11.5, color: "#3d4570", fontStyle: "italic", padding: "16px 6px", textAlign: "center" },
  emptyBig: { fontSize: 13, color: "#3d4570", textAlign: "center", padding: "60px 10px" },
  detailTitle: { fontSize: 17, fontWeight: 800, color: "#f4f0ff", marginBottom: 12, lineHeight: 1.35 },
  detailBody: { fontSize: 13, lineHeight: 1.8, color: "#8b93c8", marginBottom: 6 },
  actionRow: { display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" },
  goldBtn: { display: "inline-flex", alignItems: "center", padding: "9px 16px", borderRadius: 10, border: "none", background: "#D4A853", color: "#1a1300", fontWeight: 800, fontSize: 12, cursor: "pointer" },
  ghostBtn: { display: "inline-flex", alignItems: "center", padding: "9px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "#8b93c8", fontWeight: 700, fontSize: 12, cursor: "pointer" },
  dangerBtn: { display: "inline-flex", alignItems: "center", padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(220,80,80,0.3)", background: "rgba(220,80,80,0.08)", color: "#e06060", fontWeight: 700, fontSize: 12, cursor: "pointer" },
  fieldLabel: { fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "#4f578f", marginBottom: 7, textTransform: "uppercase" },
  input: { width: "100%", padding: "10px 12px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.10)", background: "#090c20", color: "#f4f0ff", fontSize: 13, outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "10px 12px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.10)", background: "#090c20", color: "#f4f0ff", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 10 },
  addBox: { border: "1px solid rgba(212,168,83,0.2)", background: "rgba(212,168,83,0.04)", borderRadius: 12, padding: 12, marginBottom: 6 },
  addBoxLabel: { fontSize: 10.5, fontWeight: 700, color: "#D4A853", marginBottom: 8 },
};
