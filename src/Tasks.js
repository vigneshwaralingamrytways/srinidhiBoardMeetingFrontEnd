import { useState } from "react";
import { AGENDA, SAMPLE_AGENDA_WORK } from "./agenda";
import { USERS } from "./users";
import styles from "./Tasks.module.css";

const TASK_STATUSES = ["Pending", "In Progress", "Done"];

function statusColor(s) {
  if (s === "Done") return "#4ade80";
  if (s === "In Progress") return "#d4a853";
  return "#7a83b8";
}

function sourceLabel(t) {
  if (t.linkedType === "resolution") return "Resolution";
  if (t.linkedType === "decision") return "Decision";
  return "Agenda";
}

function sourceStyle(t) {
  if (t.linkedType === "resolution") return { bg: "rgba(100,130,220,0.10)", color: "#7a9fd4" };
  if (t.linkedType === "decision") return { bg: "rgba(139,92,246,0.10)", color: "#a78bfa" };
  return { bg: "rgba(212,168,83,0.08)", color: "#d4a853" };
}

function cloneSampleWork() {
  return Object.fromEntries(
    Object.entries(SAMPLE_AGENDA_WORK || {}).map(([agendaId, work]) => [
      agendaId,
      {
        ...work,
        tasks: (work.tasks || []).map((task) => ({ ...task })),
      },
    ])
  );
}

function getTasksFor(work = {}, sampleWork = {}, agendaId) {
  const stored = work[agendaId]?.tasks;
  if (stored?.length) return stored;
  return sampleWork[agendaId]?.tasks || [];
}

/* -- TaskRow used in overview -- */
function TaskRow({ task, agendaId, updateTask }) {
  const assignee = USERS.find((u) => u.id === task.assigneeId);
  const sc = sourceStyle(task);
  return (
    <div className={styles.taskRow}>
      <div className={styles.statusDot} style={{ background: statusColor(task.status) }} />
      <div className={styles.taskBody}>
        <div className={styles.taskTopRow}>
          <span className={styles.taskTitle}>{task.title}</span>
          <span className={styles.srcBadge} style={{ background: sc.bg, color: sc.color }}>
            {sourceLabel(task)}
          </span>
        </div>
        <div className={styles.taskMeta}>
          {assignee ? (
            <div className={styles.assigneeChip}>
              <div className={styles.miniAv} style={{ background: assignee.color }}>{assignee.initials}</div>
              <span>{assignee.name}</span>
            </div>
          ) : (
            <span className={styles.muted}>Unassigned</span>
          )}
          {task.dueDate && <span className={styles.muted}>Due: {task.dueDate}</span>}
        </div>
      </div>
      <select
        className={styles.statusSel}
        value={task.status}
        onChange={(e) => updateTask(agendaId, task.id, "status", e.target.value)}
      >
        {TASK_STATUSES.map((s) => <option key={s}>{s}</option>)}
      </select>
    </div>
  );
}

/* -- TaskSection used when adding tasks per agenda item -- */
export function TaskSection({ agendaId, linkedType, linkedIndex, tasks, addTask, updateTask, removeTask }) {
  const [input, setInput] = useState({ title: "", assigneeId: "", dueDate: "", status: "Pending" });
  const [collapsed, setCollapsed] = useState(false);

  const sampleTasks = SAMPLE_AGENDA_WORK?.[agendaId]?.tasks || [];
  const visibleTasks = tasks?.length ? tasks : sampleTasks;
  const filtered = (visibleTasks || []).filter(
    (t) => t.linkedType === linkedType && t.linkedIndex === linkedIndex
  );

  const handleAdd = () => {
    if (!input.title.trim()) return;
    addTask(agendaId, {
      title: input.title.trim(),
      assigneeId: input.assigneeId,
      dueDate: input.dueDate,
      status: "Pending",
      linkedType,
      linkedIndex,
    });
    setInput({ title: "", assigneeId: "", dueDate: "", status: "Pending" });
  };

  return (
    <div className={styles.taskSection}>
      <div className={styles.tsSectionHead}>
        <div className={styles.tsSectionLeft}>
          <span className={styles.tsIcon}>Task</span>
          <span className={styles.tsLabel}>
            TASKS
            {filtered.length > 0 && <span className={styles.tsCnt}>{filtered.length}</span>}
          </span>
        </div>
        <button className={styles.tsToggleBtn} onClick={() => setCollapsed((c) => !c)}>
          {collapsed ? "Show" : "Hide"}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className={styles.tsAddRow}>
            <input
              className={styles.tsInp}
              value={input.title}
              onChange={(e) => setInput((s) => ({ ...s, title: e.target.value }))}
              placeholder="Task title"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <div className={styles.tsAddMeta}>
              <select
                className={styles.tsInp}
                style={{ flex: 1 }}
                value={input.assigneeId}
                onChange={(e) => setInput((s) => ({ ...s, assigneeId: e.target.value }))}
              >
                <option value="">Assign to...</option>
                {USERS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <input
                className={styles.tsInp}
                type="date"
                style={{ flex: 1 }}
                value={input.dueDate}
                onChange={(e) => setInput((s) => ({ ...s, dueDate: e.target.value }))}
              />
              <button className={styles.goldBtn} onClick={handleAdd}>Add Task</button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className={styles.tsEmpty}>No tasks yet. Add one above.</div>
          ) : (
            <div className={styles.tsList}>
              {filtered.map((task) => {
                const assignee = USERS.find((u) => u.id === task.assigneeId);
                return (
                  <div key={task.id} className={styles.tsTaskRow}>
                    <div className={styles.statusDot} style={{ background: statusColor(task.status) }} />
                    <div className={styles.taskBody}>
                      <span className={styles.taskTitle}>{task.title}</span>
                      <div className={styles.taskMeta}>
                        {assignee && (
                          <div className={styles.assigneeChip}>
                            <div className={styles.miniAv} style={{ background: assignee.color }}>{assignee.initials}</div>
                            <span>{assignee.name}</span>
                          </div>
                        )}
                        {task.dueDate && <span className={styles.muted}>Due: {task.dueDate}</span>}
                        <select
                          className={styles.statusSel}
                          value={task.status}
                          onChange={(e) => updateTask(agendaId, task.id, "status", e.target.value)}
                        >
                          {TASK_STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <button className={styles.removeBtn} onClick={() => removeTask(agendaId, task.id)}>x</button>
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

/* -- Main TasksOverview -- */
export default function Tasks({ agendaWork = {}, updateTask }) {
  const [filter, setFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(true);
  const [groupBy, setGroupBy] = useState("source");
  const [sampleWork, setSampleWork] = useState(cloneSampleWork);

  const handleUpdateTask = (agendaId, taskId, field, value) => {
    const hasStoredTask = (agendaWork[agendaId]?.tasks || []).some((task) => task.id === taskId);

    if (hasStoredTask && updateTask) {
      updateTask(agendaId, taskId, field, value);
      return;
    }

    setSampleWork((work) => ({
      ...work,
      [agendaId]: {
        ...work[agendaId],
        tasks: (work[agendaId]?.tasks || []).map((task) =>
          task.id === taskId ? { ...task, [field]: value } : task
        ),
      },
    }));
  };

  const allTasks = AGENDA.flatMap((a) =>
    getTasksFor(agendaWork, sampleWork, a.id).map((t) => ({ ...t, agendaId: a.id, agendaTitle: a.title }))
  );

  const counts = {
    All: allTasks.length,
    Pending: allTasks.filter((t) => t.status === "Pending").length,
    "In Progress": allTasks.filter((t) => t.status === "In Progress").length,
    Done: allTasks.filter((t) => t.status === "Done").length,
  };

  const filtered = filter === "All" ? allTasks : allTasks.filter((t) => t.status === filter);
  const donePercent = allTasks.length > 0 ? Math.round((counts.Done / allTasks.length) * 100) : 0;

  const renderGroup = () => {
    if (groupBy === "flat") {
      return filtered.map((t) => (
        <TaskRow key={t.id} task={t} agendaId={t.agendaId} updateTask={handleUpdateTask} />
      ));
    }
    if (groupBy === "source") {
      return ["agenda", "resolution", "decision"].map((src) => {
        const group = filtered.filter((t) => t.linkedType === src);
        if (!group.length) return null;
        const colors = { agenda: "#d4a853", resolution: "#7a9fd4", decision: "#a78bfa" };
        const labels = { agenda: "Agenda Tasks", resolution: "Resolution Tasks", decision: "Decision Tasks" };
        return (
          <div key={src} className={styles.group}>
            <div className={styles.groupHead} style={{ color: colors[src] }}>
              <span className={styles.groupTitle}>{labels[src].toUpperCase()}</span>
              <span className={styles.groupCnt}>{group.length}</span>
            </div>
            {group.map((t) => (
              <TaskRow key={t.id} task={t} agendaId={t.agendaId} updateTask={handleUpdateTask} />
            ))}
          </div>
        );
      });
    }

    return AGENDA.map((a) => {
      const group = filtered.filter((t) => t.agendaId === a.id);
      if (!group.length) return null;
      return (
        <div key={a.id} className={styles.group}>
          <div className={styles.groupHead} style={{ color: "#d4a853" }}>
            <span className={styles.groupTitle}>{a.title.toUpperCase()}</span>
            <span className={styles.groupCnt}>{group.length}</span>
          </div>
          {group.map((t) => (
            <TaskRow key={t.id} task={t} agendaId={t.agendaId} updateTask={handleUpdateTask} />
          ))}
        </div>
      );
    });
  };

  return (
    <div
      className={`${styles.panel} ${darkMode ? styles.darkTheme : styles.lightTheme
        }`}
    >
      <div className={styles.panelHead}>
        <div>
          <h2 className={styles.heading}>Tasks</h2>
          <p className={styles.sub}>All action items across agenda, resolutions, and decisions</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            className={styles.themeBtn}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light" : "Dark"}
          </button>

          <div className={styles.statChips}>
            {["Pending", "In Progress", "Done"].map((s) => (
              <div key={s} className={styles.statChip}>
                <div className={styles.statDot} style={{ background: statusColor(s) }} />
                <span className={styles.statLabel}>{s}</span>
                <strong className={styles.statNum}>{counts[s]}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* overall progress */}
      {allTasks.length > 0 && (
        <div className={styles.overallProgress}>
          <div className={styles.progressLabelRow}>
            <span className={styles.progressLabelText}>OVERALL COMPLETION</span>
            <span className={styles.progressPct}>{donePercent}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${donePercent}%` }} />
          </div>
          <div className={styles.progressStripes}>
            {allTasks.map((t) => (
              <div key={t.id} className={styles.stripe} style={{ background: statusColor(t.status) }} />
            ))}
          </div>
        </div>
      )}

      {/* filter + group bar */}
      <div className={styles.filterBar}>
        {["All", "Pending", "In Progress", "Done"].map((f) => (
          <button
            key={f}
            className={[styles.filterBtn, filter === f ? styles.filterActive : ""].join(" ")}
            onClick={() => setFilter(f)}
          >
            {f !== "All" && (
              <span className={styles.filterDot} style={{ background: statusColor(f) }} />
            )}
            {f}
            {counts[f] > 0 && <span className={styles.filterCnt}>{counts[f]}</span>}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <select
          className={styles.groupSel}
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
        >
          <option value="source">Group by source</option>
          <option value="agenda">Group by agenda</option>
          <option value="flat">No grouping</option>
        </select>
      </div>

      {/* task list */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>Task</div>
          <div className={styles.emptyTitle}>{filter === "All" ? "No Tasks Yet" : `No ${filter} Tasks`}</div>
          <div className={styles.emptySub}>Tasks added in Agenda, Resolutions, and Decisions steps will appear here.</div>
        </div>
      ) : (
        <div className={styles.taskListWrap}>{renderGroup()}</div>
      )}
    </div>
  );
}
