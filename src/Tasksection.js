import { useState } from "react";
import { FaTasks } from "react-icons/fa";

const TASK_STATUSES = ["Pending", "In Progress", "Done"];

export default function TaskSection({ agendaId, linkedType, linkedIndex, tasks, participants, addTask, updateTask, removeTask }) {
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
              <span style={{ marginLeft: 8, background: "rgba(212,168,83,0.15)", color: "#D4A853", fontSize: 10, padding: "2px 7px", borderRadius: 20, fontWeight: 700 }}>
                {filteredTasks.length}
              </span>
            )}
          </label>
        </div>
        <button className="co-ghost-btn" style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => setCollapsed((c) => !c)}>
          {collapsed ? "Show" : "Hide"}
        </button>
      </div>

      {!collapsed && (
        <>
          <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
            <input className="co-input" value={input.title} onChange={(e) => setInput((s) => ({ ...s, title: e.target.value }))}
              placeholder="Task title" onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <select className="co-input" style={{ flex: 1, minWidth: 140 }} value={input.assigneeId}
                onChange={(e) => setInput((s) => ({ ...s, assigneeId: e.target.value }))}>
                <option value="">Assign to</option>
                {participants.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input className="co-input" type="date" style={{ flex: 1, minWidth: 130 }} value={input.dueDate}
                onChange={(e) => setInput((s) => ({ ...s, dueDate: e.target.value }))} />
              <button className="co-gold-btn" onClick={handleAdd} style={{ whiteSpace: "nowrap" }}>Add Task</button>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="co-muted" style={{ fontSize: 12, fontStyle: "italic", paddingBottom: 4 }}>No tasks assigned yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredTasks.map((task) => {
                const assignee = participants.find((p) => p.id === task.assigneeId);
                return (
                  <div key={task.id} style={{ background: "#080b1d", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(task.status), marginTop: 5, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                        <span style={{ color: "#f4f0ff", fontWeight: 600, fontSize: 13 }}>{task.title}</span>
                        <select className="co-input" style={{ width: "auto", fontSize: 11, padding: "3px 8px", minWidth: 100 }}
                          value={task.status} onChange={(e) => updateTask(agendaId, task.id, "status", e.target.value)}>
                          {TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
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
                        ) : <span className="co-muted" style={{ fontSize: 11 }}>Unassigned</span>}
                        {task.dueDate && <span className="co-muted" style={{ fontSize: 11 }}>Due: {task.dueDate}</span>}
                      </div>
                    </div>
                    <button className="co-rich-remove-btn" style={{ flexShrink: 0 }} onClick={() => removeTask(agendaId, task.id)}>Remove</button>
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
