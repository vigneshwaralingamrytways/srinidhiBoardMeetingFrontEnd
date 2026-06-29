import { useState, useEffect } from "react";
import {
  FaCheck, FaPencilAlt, FaTasks, FaFilePdf, FaFileImage, FaFile, FaFileWord, FaFileExcel,
  FaTimes, FaDownload, FaEye, FaPlus, FaEnvelope, FaPaperPlane, FaExclamationCircle,
  FaRegClock, FaTrash, FaBalanceScale, FaFolderOpen, FaListAlt, FaChevronLeft,
  FaChevronRight, FaSitemap,
} from "react-icons/fa";
import { TbRoute } from "react-icons/tb";
import RichTextEditor from "./Richtexteditor";
import DocZoomViewer from "./DoczoomViewer";
import ResolutionPanel from "./ResolutionPanel";
import BoardPackPanel from "./AgendaBoardPack";
import TaskPanel from "./TaskPanel";
import { RESOLUTIONS as SEED_RESOLUTIONS } from "./ConductMeetingData";

// ---------------------------------------------------------------------------
// Sample board-pack docs with live PDF urls (used in projector Board Pack view)
// ---------------------------------------------------------------------------
const SAMPLE_BOARD_PACK_DOCS = [
  {
    id: "bp-1",
    title: "Board Charter & Governance Policy",
    type: "PDF",
    pages: 18,
    size: "1.4 MB",
    url: "https://www.w3.org/WAI/WCAG21/wcag21.pdf",
    description: "<p>Outlines the board\'s roles, responsibilities, governance structure and operating procedures that guide the conduct of all board meetings.</p>",
  },
  {
    id: "bp-2",
    title: "Audit Committee Report - Q3",
    type: "PDF",
    pages: 6,
    size: "320 KB",
    url: "https://www.africau.edu/images/general/sample.pdf",
    description: "<p>Summary of audit findings, risk assessments and recommended corrective actions arising from the Q3 internal committee review.</p>",
  },
  {
    id: "bp-3",
    title: "Q4 Financial Overview",
    type: "PDF",
    pages: 12,
    size: "4.8 MB",
    url: "https://www.orimi.com/pdf-test.pdf",
    description: "<p>Revenue, costs and margin trends for the quarter. Includes regional breakdown, product-line performance and forecast comparison.</p>",
  },
  {
    id: "bp-4",
    title: "Supporting Data Pack",
    type: "PDF",
    pages: 9,
    size: "2.1 MB",
    url: "https://pdfobject.com/pdf/sample.pdf",
    description: "<p>Supplementary data tables and charts that support the board\'s quarterly review discussion and decision-making.</p>",
  },
];

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const AGENDA_PHASES = [
  { id: "pre", label: "Pre-Meeting", description: "Background, objectives & preparation notes", color: "#7a83b8", borderColor: "rgba(122,131,184,0.35)", bg: "rgba(122,131,184,0.10)" },
  { id: "conduct", label: "In Meeting", description: "Live discussion notes, acknowledgements & actions", color: "#D4A853", borderColor: "rgba(212,168,83,0.40)", bg: "rgba(212,168,83,0.10)" },
  { id: "post", label: "Post-Meeting", description: "Follow-up notes, decisions & outcomes", color: "#4db896", borderColor: "rgba(77,184,150,0.35)", bg: "rgba(77,184,150,0.08)" },
];


const SECTIONS = [
  { id: "discussion", label: "Discussion", icon: <FaListAlt />, color: "#7a83b8" },
  { id: "resolutions", label: "Resolutions", icon: <FaBalanceScale />, color: "#D4A853" },
  { id: "boardpack", label: "Board Pack", icon: <FaFolderOpen />, color: "#6aaaee" },
  { id: "tasks", label: "Tasks", icon: <FaTasks />, color: "#4db896" },
];

const OPEN_AGENDA_TYPES = [
  { id: "immediate", label: "Address Immediately", icon: <FaExclamationCircle />, color: "#e06060", bg: "rgba(220,80,80,0.10)", border: "rgba(220,80,80,0.28)" },
  { id: "next", label: "Next Meeting", icon: <FaRegClock />, color: "#D4A853", bg: "rgba(212,168,83,0.10)", border: "rgba(212,168,83,0.28)" },
];

// Task type options
const TASK_TYPES = [
  { id: "internal", label: "Internal", color: "#7a83b8", bg: "rgba(122,131,184,0.12)", border: "rgba(122,131,184,0.30)" },
  { id: "atr", label: "ATR", color: "#4db896", bg: "rgba(77,184,150,0.12)", border: "rgba(77,184,150,0.30)" },
];

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
function DocIcon({ name = "", size = 14 }) {
  const ext = (name.split(".").pop() || "").toLowerCase();
  if (["pdf"].includes(ext)) return <FaFilePdf style={{ fontSize: size, color: "#e06060" }} />;
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return <FaFileImage style={{ fontSize: size, color: "#6aaaee" }} />;
  if (["doc", "docx"].includes(ext)) return <FaFileWord style={{ fontSize: size, color: "#6aaaee" }} />;
  if (["xls", "xlsx", "csv"].includes(ext)) return <FaFileExcel style={{ fontSize: size, color: "#4db896" }} />;
  return <FaFile style={{ fontSize: size, color: "#7a83b8" }} />;
}

function PhaseDot({ has, color }) {
  return (
    <span style={{
      width: 7, height: 7, borderRadius: "50%", display: "inline-block", flexShrink: 0,
      background: has ? color : "rgba(255,255,255,0.08)",
      border: `1.5px solid ${has ? color : "rgba(255,255,255,0.12)"}`,
    }} />
  );
}

function Avatar({ person, size = 20, border = "rgba(255,255,255,0.10)", opacity = 1 }) {
  return (
    <div title={person.name} style={{
      width: size, height: size, borderRadius: "50%", overflow: "hidden",
      background: person.color, border: `1.5px solid ${border}`, flexShrink: 0, opacity
    }}>
      <img
        src={person.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=0D1117&color=fff`}
        alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// AGENDA PROJECTOR VIEW  shown when "View" is clicked on a card
// ---------------------------------------------------------------------------
function AgendaProjectorView({
  agendaItems,
  currentIndex,
  onNavigate,
  onClose,
  onOpenResolution,
  onOpenBoardPack,
}) {
  const item = agendaItems[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < agendaItems.length - 1;

  if (!item) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(4,6,18,0.97)",
      display: "flex", flexDirection: "column",
      backdropFilter: "blur(6px)",
    }}>
      {/* -- Top bar -- */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 28px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "#07091a",
        flexShrink: 0,
      }}>
        {/* Left: counter + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(212,168,83,0.10)", border: "1px solid rgba(212,168,83,0.30)",
            borderRadius: 8, padding: "4px 12px", flexShrink: 0,
          }}>
            <span style={{ color: "#D4A853", fontWeight: 800, fontSize: 12 }}>
              {currentIndex + 1}
            </span>
            <span style={{ color: "#596197", fontSize: 11 }}>/ {agendaItems.length}</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#f4f0ff", fontWeight: 800, fontSize: 18, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.title}
            </div>
            <div style={{ color: "#596197", fontSize: 12, marginTop: 2 }}>
              {item.duration} min · {item.type}
            </div>
          </div>
        </div>

        {/* Right: Resolution + BoardPack + Close */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => onOpenResolution(item.id)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "8px 16px", borderRadius: 10,
              border: "1px solid rgba(212,168,83,0.35)",
              color: "#D4A853", background: "rgba(212,168,83,0.08)",
              fontSize: 12, fontWeight: 800, cursor: "pointer",
            }}
          >
            <FaBalanceScale style={{ fontSize: 11 }} /> Resolutions
          </button>
          <button
            onClick={() => onOpenBoardPack(item.id)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "8px 16px", borderRadius: 10,
              border: "1px solid rgba(106,170,238,0.35)",
              color: "#6aaaee", background: "rgba(106,170,238,0.08)",
              fontSize: 12, fontWeight: 800, cursor: "pointer",
            }}
          >
            <FaFolderOpen style={{ fontSize: 11 }} /> Board Pack
          </button>
          <button
            onClick={onClose}
            style={{
              width: 34, height: 34, borderRadius: 9,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.04)",
              color: "#8b93c8", display: "grid", placeItems: "center",
              cursor: "pointer", fontSize: 15, flexShrink: 0,
            }}
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* -- Main content  description as full-width projector slide -- */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "48px 64px",
        display: "flex", flexDirection: "column", justifyContent: "center",
        width: "100%", boxSizing: "border-box",
        background: "#04060e",
      }}>
        <div style={{
          width: "100%", maxWidth: 860, margin: "0 auto",
          background: "#0e1230", borderRadius: 18,
          padding: "48px 56px", boxSizing: "border-box",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
        }}>
          <div style={{ color: "#D4A853", fontSize: 11, letterSpacing: "0.18em", fontWeight: 800, marginBottom: 18 }}>
            AGENDA ITEM {currentIndex + 1} OF {agendaItems.length}
          </div>
          <div style={{ color: "#f4f0ff", fontWeight: 800, fontSize: 28, lineHeight: 1.3, marginBottom: 24 }}>
            {item.title}
          </div>
          {item.description ? (
            <div style={{ color: "#a0a8d8", fontSize: 16, lineHeight: 1.9, fontWeight: 400 }}>
              {item.description}
            </div>
          ) : (
            <div style={{ color: "#3d4570", fontSize: 14, fontStyle: "italic" }}>
              No description for this agenda item.
            </div>
          )}
          {item.presenter && (
            <div style={{
              marginTop: 32, display: "inline-flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 20,
              background: "rgba(122,131,184,0.10)",
              border: "1px solid rgba(122,131,184,0.18)",
            }}>
              <span style={{ color: "#596197", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em" }}>PRESENTER</span>
              <span style={{ color: "#8b93c8", fontSize: 13, fontWeight: 600 }}>{item.presenter}</span>
              {item.duration && <span style={{ color: "#596197", fontSize: 12 }}>{"·"} {item.duration} min</span>}
            </div>
          )}
        </div>
      </div>

      {/* -- Bottom nav -- */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 28px",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        background: "#07091a", flexShrink: 0,
      }}>
        <button
          disabled={!hasPrev}
          onClick={() => onNavigate(currentIndex - 1)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 10,
            border: `1px solid ${hasPrev ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.05)"}`,
            background: hasPrev ? "rgba(255,255,255,0.04)" : "transparent",
            color: hasPrev ? "#8b93c8" : "#2e3460",
            fontSize: 13, fontWeight: 700, cursor: hasPrev ? "pointer" : "not-allowed",
          }}
        >
          <FaChevronLeft style={{ fontSize: 11 }} />
          {hasPrev ? agendaItems[currentIndex - 1].title : "Previous"}
        </button>

        {/* Dot indicators */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {agendaItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(idx)}
              style={{
                width: idx === currentIndex ? 20 : 7,
                height: 7, borderRadius: 999,
                background: idx === currentIndex ? "#D4A853" : "rgba(255,255,255,0.12)",
                border: "none", cursor: "pointer",
                transition: "all 0.2s ease",
                padding: 0,
              }}
            />
          ))}
        </div>

        <button
          disabled={!hasNext}
          onClick={() => onNavigate(currentIndex + 1)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 10,
            border: `1px solid ${hasNext ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.05)"}`,
            background: hasNext ? "rgba(255,255,255,0.04)" : "transparent",
            color: hasNext ? "#8b93c8" : "#2e3460",
            fontSize: 13, fontWeight: 700, cursor: hasNext ? "pointer" : "not-allowed",
          }}
        >
          {hasNext ? agendaItems[currentIndex + 1].title : "Next"}
          <FaChevronRight style={{ fontSize: 11 }} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Agenda list card
// ---------------------------------------------------------------------------
function AgendaCard({ item, agendaWork, agendaAcknowledgements, attendance, participants, openAgendaItems, isActive, onView, onEdit, onDelete }) {
  const present = participants.filter(p => attendance[p.id] === "physical" || attendance[p.id] === "electronic");
  const acks = agendaAcknowledgements[item.id] || {};
  const ackCount = present.filter(p => acks[p.id]).length;
  const allAcked = present.length > 0 && ackCount === present.length;
  const ackedList = present.filter(p => acks[p.id]);
  const pendingList = present.filter(p => !acks[p.id]);
  const taskCount = (agendaWork[item.id]?.tasks || []).filter(t => t.linkedType === "agenda").length;
  const itemDocs = item.documents || item.docs || item.files || [];
  const openCount = (openAgendaItems[item.id] || []).length;
  const work = agendaWork[item.id] || {};

  return (
    <div style={{
      background: isActive ? "rgba(212,168,83,0.06)" : "#0b0e22",
      border: `1px solid ${isActive ? "rgba(212,168,83,0.30)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 16, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12,
      transition: "border-color 0.18s",
    }}>
      {/* Title + actions */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#f4f0ff", fontWeight: 700, fontSize: 15, lineHeight: 1.4, marginBottom: 3 }}>{item.title}</div>
          <div style={{ color: "#596197", fontSize: 12 }}>{item.duration} min · {item.type}</div>
          {/* Description  max 2 lines */}
          {item.description && (
            <div style={{
              color: "#4e568e", fontSize: 11, lineHeight: 1.5, marginTop: 5,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
              overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {item.description}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={() => onView(item.id)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 9,
              border: "1px solid rgba(106,170,238,0.30)", color: "#6aaaee", background: "rgba(106,170,238,0.07)",
              fontSize: 12, fontWeight: 700, cursor: "pointer"
            }}>
            <FaEye style={{ fontSize: 11 }} /> View
          </button>
          <button onClick={() => onEdit(item.id)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 9,
              border: "1px solid rgba(212,168,83,0.30)", color: "#D4A853", background: "rgba(212,168,83,0.07)",
              fontSize: 12, fontWeight: 700, cursor: "pointer"
            }}>
            <FaPencilAlt style={{ fontSize: 10 }} /> Edit
          </button>
          <button onClick={() => onDelete(item.id)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 10px", borderRadius: 9,
              border: "1px solid rgba(220,80,80,0.28)", color: "#e06060", background: "rgba(220,80,80,0.06)",
              fontSize: 12, fontWeight: 700, cursor: "pointer"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(220,80,80,0.14)"; e.currentTarget.style.borderColor = "rgba(220,80,80,0.50)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(220,80,80,0.06)"; e.currentTarget.style.borderColor = "rgba(220,80,80,0.28)"; }}
          >
            <FaTrash style={{ fontSize: 10 }} />
          </button>
        </div>
      </div>

      {/* Phase dots + badges */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {AGENDA_PHASES.map(phase => {
            const has = phase.id === "pre" ? !!work.preNote : phase.id === "conduct" ? !!work.note : !!work.postNote;
            return (
              <div key={phase.id} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: has ? phase.color : "#3d4570" }}>
                <PhaseDot has={has} color={phase.color} />
                {phase.label.split(" ")[0]}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {itemDocs.length > 0 && <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999, background: "rgba(106,170,238,0.12)", color: "#6aaaee" }}>{itemDocs.length} doc{itemDocs.length > 1 ? "s" : ""}</span>}
          {taskCount > 0 && <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999, background: "rgba(122,131,184,0.12)", color: "#7a83b8" }}>{taskCount} task{taskCount > 1 ? "s" : ""}</span>}
          {openCount > 0 && <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999, background: "rgba(212,168,83,0.12)", color: "#D4A853" }}>{openCount} open</span>}
          <span style={{
            fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999,
            background: allAcked ? "rgba(77,184,150,0.15)" : "rgba(212,168,83,0.10)",
            color: allAcked ? "#4db896" : "#d4a853"
          }}>
            {ackCount}/{present.length} ack'd
          </span>
          {allAcked && <span style={{ color: "#4db896", fontSize: 9, fontWeight: 800, letterSpacing: 1 }}>ALL DONE</span>}
        </div>
      </div>

      {/* Avatars */}
      {present.length > 0 && (
        <div style={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
          {ackedList.map(p => <Avatar key={p.id} person={p} border="#4db896" />)}
          {pendingList.map(p => <Avatar key={p.id} person={p} border="rgba(220,80,80,0.4)" opacity={0.45} />)}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Open Agenda Manager (unchanged)
// ---------------------------------------------------------------------------
function OpenAgendaManager({ agendaId, openItems, onAdd, onRemove, participants }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ title: "", details: "", type: "next", notifyAll: true, assignedTo: [], dueDate: "" });

  const handleAdd = () => {
    if (!draft.title.trim()) return;
    onAdd(agendaId, { ...draft, title: draft.title.trim(), id: Date.now() + Math.random(), createdAt: new Date().toLocaleString() });
    setDraft({ title: "", details: "", type: "next", notifyAll: true, assignedTo: [], dueDate: "" });
    setAdding(false);
  };

  const toggleAssignee = pid => setDraft(d => ({
    ...d, assignedTo: d.assignedTo.includes(pid) ? d.assignedTo.filter(x => x !== pid) : [...d.assignedTo, pid],
  }));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#e8a445", fontSize: 10, letterSpacing: "0.16em", fontWeight: 800 }}>OPEN AGENDA ITEMS</span>
          {openItems.length > 0 && <span style={{ background: "rgba(212,168,83,0.15)", color: "#D4A853", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20 }}>{openItems.length}</span>}
        </div>
        <button onClick={() => setAdding(v => !v)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 9,
            border: "1px solid rgba(212,168,83,0.35)", color: "#D4A853", background: adding ? "rgba(212,168,83,0.12)" : "transparent",
            fontSize: 11, fontWeight: 700, cursor: "pointer"
          }}>
          <FaPlus style={{ fontSize: 9 }} /> Add Open Item
        </button>
      </div>

      {adding && (
        <div style={{ marginBottom: 18, padding: "18px 20px", borderRadius: 14, border: "1px solid rgba(212,168,83,0.22)", background: "rgba(212,168,83,0.04)" }}>
          <div style={{ color: "#D4A853", fontSize: 10, letterSpacing: "0.16em", fontWeight: 800, marginBottom: 14 }}>NEW OPEN AGENDA ITEM</div>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.14em", fontWeight: 700, marginBottom: 6 }}>TITLE</div>
              <input className="co-input" value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="Brief summary" autoFocus />
            </div>
            <div>
              <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.14em", fontWeight: 700, marginBottom: 6 }}>DETAILS / CONTEXT</div>
              <textarea className="co-rich-textarea" style={{ minHeight: 80 }} value={draft.details}
                onChange={e => setDraft(d => ({ ...d, details: e.target.value }))} placeholder="Describe the issue or background" />
            </div>
            <div>
              <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.14em", fontWeight: 700, marginBottom: 8 }}>HOW TO ADDRESS</div>
              <div style={{ display: "flex", gap: 8 }}>
                {OPEN_AGENDA_TYPES.map(t => {
                  const sel = draft.type === t.id;
                  return (
                    <button key={t.id} onClick={() => setDraft(d => ({ ...d, type: t.id }))}
                      style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                        fontWeight: 700, fontSize: 12, border: sel ? `1px solid ${t.border}` : "1px solid rgba(255,255,255,0.08)",
                        background: sel ? t.bg : "#090c20", color: sel ? t.color : "#596197"
                      }}>
                      {t.icon} {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.14em", fontWeight: 700, marginBottom: 8 }}>SEND DETAILS TO</div>
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  {participants.map(p => {
                    const sel = draft.assignedTo.includes(p.id);
                    return (
                      <button key={p.id} onClick={() => toggleAssignee(p.id)}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999,
                          border: sel ? "1.5px solid rgba(212,168,83,0.5)" : "1.5px solid rgba(255,255,255,0.08)",
                          background: sel ? "rgba(212,168,83,0.12)" : "transparent", color: sel ? "#D4A853" : "#596197",
                          fontSize: 11, fontWeight: 700, cursor: "pointer"
                        }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", overflow: "hidden", background: p.color, flexShrink: 0 }}>
                          <img src={p.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0D1117&color=fff`} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        {p.name.split(" ")[0]}
                        {sel && <FaCheck style={{ fontSize: 8 }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.14em", fontWeight: 700, marginBottom: 6 }}>DUE / TARGET DATE</div>
                <input className="co-input" type="date" value={draft.dueDate} onChange={e => setDraft(d => ({ ...d, dueDate: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={() => setDraft(d => ({ ...d, notifyAll: !d.notifyAll }))}
                style={{
                  width: 34, height: 20, borderRadius: 999, border: "none", cursor: "pointer",
                  background: draft.notifyAll ? "#D4A853" : "rgba(255,255,255,0.10)", position: "relative", flexShrink: 0
                }}>
                <span style={{ position: "absolute", top: 2, left: draft.notifyAll ? 16 : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
              </button>
              <div>
                <div style={{ color: "#c8cde8", fontSize: 12, fontWeight: 700 }}>Notify all meeting members</div>
                <div style={{ color: "#4e568e", fontSize: 10 }}>Send this open item details to all participants</div>
              </div>
              <FaEnvelope style={{ color: draft.notifyAll ? "#D4A853" : "#3d4570", fontSize: 14, marginLeft: "auto", flexShrink: 0 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="co-ghost-btn" onClick={() => setAdding(false)}>Cancel</button>
              <button className="co-gold-btn" disabled={!draft.title.trim()} style={{ opacity: draft.title.trim() ? 1 : 0.4 }} onClick={handleAdd}>
                <FaPaperPlane style={{ fontSize: 11, marginRight: 6 }} /> Save & Notify
              </button>
            </div>
          </div>
        </div>
      )}

      {openItems.length === 0 && !adding && (
        <div style={{ padding: "18px 16px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.07)", color: "#3d4570", fontSize: 12, fontStyle: "italic", textAlign: "center" }}>
          No open agenda items yet. Use "Add Open Item" to flag unresolved matters.
        </div>
      )}

      {openItems.map(item => {
        const typeConf = OPEN_AGENDA_TYPES.find(t => t.id === item.type) || OPEN_AGENDA_TYPES[1];
        const assignees = (item.assignedTo || []).map(id => participants.find(p => p.id === id)).filter(Boolean);
        return (
          <div key={item.id} style={{ marginBottom: 10, padding: "14px 16px", borderRadius: 14, border: `1px solid ${typeConf.border}`, background: typeConf.bg }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                <span style={{ color: typeConf.color, fontSize: 14, flexShrink: 0 }}>{typeConf.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: "#f4f0ff", fontWeight: 700, fontSize: 13, lineHeight: 1.4 }}>{item.title}</div>
                  <div style={{ color: "#4e568e", fontSize: 10, marginTop: 2 }}>{item.createdAt}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999, background: typeConf.bg, color: typeConf.color, border: `1px solid ${typeConf.border}` }}>{typeConf.label}</span>
                <button onClick={() => onRemove(agendaId, item.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#3d4570", padding: "4px 6px", borderRadius: 6 }}
                  onMouseEnter={e => e.currentTarget.style.color = "#e06060"}
                  onMouseLeave={e => e.currentTarget.style.color = "#3d4570"}>
                  <FaTrash style={{ fontSize: 11 }} />
                </button>
              </div>
            </div>
            {item.details && (
              <div style={{ color: "#8b93c8", fontSize: 12, lineHeight: 1.7, marginBottom: 10, padding: "8px 10px", background: "rgba(0,0,0,0.2)", borderRadius: 8 }}>{item.details}</div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              {assignees.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <FaEnvelope style={{ color: "#4e568e", fontSize: 10 }} />
                  <div style={{ display: "flex", gap: 3 }}>{assignees.map(p => <Avatar key={p.id} person={p} size={20} border="rgba(255,255,255,0.12)" />)}</div>
                  <span style={{ color: "#596197", fontSize: 10 }}>notified</span>
                </div>
              )}
              {item.notifyAll && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#D4A853", fontSize: 10, fontWeight: 700 }}><FaEnvelope style={{ fontSize: 9 }} /> All Members</span>}
              {item.dueDate && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#596197", fontSize: 10 }}><FaRegClock style={{ fontSize: 9 }} /> Due: {item.dueDate}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail panel  shown when user clicks Edit on a card
// ---------------------------------------------------------------------------
function AgendaDetailPanel({
  activeAgenda, activeWork, updateNote,
  participants, attendance, agendaAcknowledgements, toggleAgendaAck, ackAllAgenda,
  openAgendaItems, addOpenAgendaItem, updateOpenAgendaItem, removeOpenAgendaItem,
  onBack, initialEditMode,
}) {
  const [activeSection, setActiveSection] = useState("discussion");
  const [activePhase,   setActivePhase]   = useState("conduct");
  const [showAckPanel,  setShowAckPanel]  = useState(false);
  const [editMode,      setEditMode]      = useState(initialEditMode || false);
  const [editDraft,     setEditDraft]     = useState({ title: activeAgenda.title || "", description: activeAgenda.description || "", taskType: activeAgenda.taskType || "internal" });
  const [viewDoc,       setViewDoc]       = useState(null);
  const [taskPrefill,   setTaskPrefill]   = useState("");
  const [showPhaseDropdown,   setShowPhaseDropdown]   = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);

  useEffect(() => {
    setEditMode(initialEditMode || false);
    setEditDraft({ title: activeAgenda.title || "", description: activeAgenda.description || "", taskType: activeAgenda.taskType || "internal" });
    setActiveSection("discussion");
    setActivePhase("conduct");
    setShowAckPanel(false);
    setShowPhaseDropdown(false);
    setShowSectionDropdown(false);
  }, [activeAgenda.id, initialEditMode]);

  const present     = participants.filter(p => attendance[p.id] === "physical" || attendance[p.id] === "electronic");
  const activeAcks  = agendaAcknowledgements[activeAgenda.id] || {};
  const ackedList   = present.filter(p => activeAcks[p.id]);
  const pendingList = present.filter(p => !activeAcks[p.id]);
  const allAcked    = present.length > 0 && ackedList.length === present.length;
  const activeOpenItems = openAgendaItems[activeAgenda.id] || [];
  const currentPhase    = AGENDA_PHASES.find(p => p.id === activePhase);
  const extraSections   = SECTIONS.filter(s => s.id !== "discussion");
  const activeExtraSection = extraSections.find(s => s.id === activeSection);

  const handleAddOpen    = (aid, item) => addOpenAgendaItem    ? addOpenAgendaItem(aid, item)    : null;
  const handleRemoveOpen = (aid, id)   => removeOpenAgendaItem ? removeOpenAgendaItem(aid, id)   : null;
  const handleNavigateToTasks = (prefill = "") => { setTaskPrefill(prefill); setActiveSection("tasks"); };

  const currentTaskType = TASK_TYPES.find(t => t.id === (editDraft.taskType || "internal")) || TASK_TYPES[0];

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {viewDoc && (
        <DocZoomViewer
          title={viewDoc.name || viewDoc.title || "Document"}
          meta="Agenda Document"
          url={viewDoc.url || viewDoc.fileUrl || null}
          downloadUrl={viewDoc.url || viewDoc.fileUrl || null}
          onClose={() => setViewDoc(null)}
        />
      )}

      {/* -- Single compact top bar -- */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "#07091a",
        flexWrap: "nowrap",
        minHeight: 52,
      }}>
        {/* Back */}
        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "6px 12px", borderRadius: 9,
          border: "1px solid rgba(255,255,255,0.10)", color: "#8b93c8",
          background: "rgba(255,255,255,0.03)", fontSize: 11, fontWeight: 700,
          cursor: "pointer", flexShrink: 0,
        }}>
          <FaChevronLeft style={{ fontSize: 9 }} /> Back
        </button>

        {/* Title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {editMode
            ? <input className="co-input" value={editDraft.title}
                onChange={e => setEditDraft(d => ({ ...d, title: e.target.value }))}
                placeholder="Agenda title"
                style={{ fontSize: 13, fontWeight: 700, padding: "4px 8px" }} />
            : <div style={{ color: "#f4f0ff", fontWeight: 700, fontSize: 14,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {activeAgenda.title}
              </div>
          }
        </div>

        {/* -- Controls cluster -- */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>

          {/* Discussion / More section switcher */}
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.04)", borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", overflow: "visible", position: "relative" }}>
            {/* Discussion pill */}
            <button
              onClick={() => { setActiveSection("discussion"); setShowSectionDropdown(false); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "5px 11px", borderRadius: "8px 0 0 8px",
                border: "none",
                background: activeSection === "discussion" ? "rgba(122,131,184,0.18)" : "transparent",
                color: activeSection === "discussion" ? "#7a83b8" : "#4e568e",
                fontSize: 11, fontWeight: 800, cursor: "pointer",
                borderRight: "1px solid rgba(255,255,255,0.07)",
              }}>
              <FaListAlt style={{ fontSize: 10 }} />
              Discussion
            </button>

            {/* More dropdown trigger */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => { setShowSectionDropdown(v => !v); setShowPhaseDropdown(false); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "5px 10px", borderRadius: "0 8px 8px 0",
                  border: "none",
                  background: activeExtraSection ? `${activeExtraSection.color}20` : "transparent",
                  color: activeExtraSection ? activeExtraSection.color : "#4e568e",
                  fontSize: 11, fontWeight: 800, cursor: "pointer",
                }}>
                {activeExtraSection
                  ? <><span style={{ display: "flex", fontSize: 11 }}>{activeExtraSection.icon}</span>{activeExtraSection.label}</>
                  : "More"
                }
                <FaChevronRight style={{ fontSize: 8, transform: showSectionDropdown ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.18s" }} />
              </button>

              {showSectionDropdown && (
                <>
                  <div style={{ position: "fixed", inset: 0, zIndex: 299 }} onClick={() => setShowSectionDropdown(false)} />
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 300,
                    background: "#0e1230", border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                    overflow: "hidden", minWidth: 160,
                  }}>
                    {extraSections.map((sec, i) => {
                      const isAct = activeSection === sec.id;
                      return (
                        <button key={sec.id}
                          onClick={() => { setActiveSection(sec.id); setShowSectionDropdown(false); }}
                          style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 10,
                            padding: "11px 16px",
                            background: isAct ? `${sec.color}18` : "transparent",
                            borderBottom: i < extraSections.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                            border: "none", cursor: "pointer", transition: "background 0.15s",
                          }}
                          onMouseEnter={e => { if (!isAct) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                          onMouseLeave={e => { if (!isAct) e.currentTarget.style.background = "transparent"; }}>
                          <span style={{ fontSize: 13, color: isAct ? sec.color : "#4e568e", display: "flex" }}>{sec.icon}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: isAct ? sec.color : "#8b93c8" }}>{sec.label}</span>
                          {isAct && <FaCheck style={{ fontSize: 9, color: sec.color, marginLeft: "auto" }} />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Phase dropdown (only when in Discussion) */}
          {activeSection === "discussion" && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => { setShowPhaseDropdown(v => !v); setShowSectionDropdown(false); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "5px 11px", borderRadius: 9,
                  border: `1px solid ${currentPhase.borderColor}`,
                  background: currentPhase.bg,
                  color: currentPhase.color,
                  fontSize: 11, fontWeight: 800, cursor: "pointer",
                }}>
                {currentPhase.label}
                {AGENDA_PHASES.some(ph => {
                  const has = ph.id === "pre" ? !!(activeWork.preNote) : ph.id === "conduct" ? !!(activeWork.note) : !!(activeWork.postNote);
                  return has;
                }) && <span style={{ width: 5, height: 5, borderRadius: "50%", background: currentPhase.color, opacity: 0.9 }} />}
                <FaChevronRight style={{ fontSize: 8, transform: showPhaseDropdown ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.18s" }} />
              </button>

              {showPhaseDropdown && (
                <>
                  <div style={{ position: "fixed", inset: 0, zIndex: 299 }} onClick={() => setShowPhaseDropdown(false)} />
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 300,
                    background: "#0e1230", border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                    overflow: "hidden", minWidth: 220,
                  }}>
                    {AGENDA_PHASES.map((phase, i) => {
                      const isAct = activePhase === phase.id;
                      const hasCon = phase.id === "pre" ? !!(activeWork.preNote) : phase.id === "conduct" ? !!(activeWork.note) : !!(activeWork.postNote);
                      return (
                        <button key={phase.id}
                          onClick={() => { setActivePhase(phase.id); setShowPhaseDropdown(false); }}
                          style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 12,
                            padding: "12px 16px",
                            background: isAct ? phase.bg : "transparent",
                            borderBottom: i < AGENDA_PHASES.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                            border: "none", cursor: "pointer", transition: "background 0.15s",
                          }}
                          onMouseEnter={e => { if (!isAct) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                          onMouseLeave={e => { if (!isAct) e.currentTarget.style.background = isAct ? phase.bg : "transparent"; }}>
                          <div style={{ flex: 1, textAlign: "left" }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: isAct ? phase.color : "#8b93c8", letterSpacing: "0.05em" }}>{phase.label}</div>
                            <div style={{ fontSize: 10, color: "#4e568e", marginTop: 2 }}>{phase.description}</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                            {hasCon && <span style={{ width: 5, height: 5, borderRadius: "50%", background: phase.color }} />}
                            {isAct && <FaCheck style={{ fontSize: 9, color: phase.color }} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Ack button */}
          <button
            onClick={() => setShowAckPanel(v => !v)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "5px 11px", borderRadius: 9,
              border: showAckPanel ? "1px solid rgba(212,168,83,0.5)" : "1px solid rgba(255,255,255,0.10)",
              background: showAckPanel ? "rgba(212,168,83,0.10)" : "rgba(255,255,255,0.03)",
              color: allAcked ? "#4db896" : showAckPanel ? "#D4A853" : "#6670aa",
              fontSize: 11, fontWeight: 800, cursor: "pointer",
            }}>
            {allAcked && <FaCheck style={{ fontSize: 8 }} />}
            {ackedList.length}/{present.length} Ack'd
          </button>

          {/* Edit / Done */}
          {editMode
            ? <button className="co-gold-btn" style={{ fontSize: 11, padding: "5px 13px" }} onClick={() => setEditMode(false)}>
                <FaCheck style={{ fontSize: 9, marginRight: 5 }} /> Done
              </button>
            : <button className="co-ghost-btn" style={{ fontSize: 11, padding: "5px 11px", borderColor: "rgba(255,255,255,0.12)", color: "#8b93c8" }} onClick={() => setEditMode(true)}>
                <FaPencilAlt style={{ fontSize: 9, marginRight: 5 }} /> Edit
              </button>
          }
        </div>
      </div>

      {/* -- Content -- */}
      <div style={{ padding: "20px 24px" }}>

        {activeSection === "discussion" && (
          <>
            {/* Ack panel */}
            {showAckPanel && (
              <div style={{ marginBottom: 20, border: allAcked ? "1px solid rgba(77,184,150,0.25)" : "1px solid rgba(212,168,83,0.15)", borderRadius: 16, background: "#07091a", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: allAcked ? "rgba(77,184,150,0.05)" : "transparent" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#4e568e", fontSize: 10, letterSpacing: 2, fontWeight: 700 }}>ACKNOWLEDGEMENTS</span>
                    {allAcked
                      ? <span style={{ background: "rgba(77,184,150,0.15)", color: "#4db896", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999 }}>All Acknowledged</span>
                      : <span style={{ background: "rgba(220,80,80,0.12)", color: "#e06060", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999 }}>{pendingList.length} Pending</span>}
                  </div>
                  {!allAcked && present.length > 0 && (
                    <button className="co-ghost-btn" style={{ fontSize: 11, padding: "5px 12px", borderColor: "rgba(77,184,150,0.25)", color: "#4db896" }} onClick={() => ackAllAgenda(activeAgenda.id)}>Acknowledge All</button>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {present.length === 0 && <div style={{ padding: 18, color: "#3d4570", fontSize: 12, textAlign: "center" }}>No present participants. Mark attendance first.</div>}
                  {present.map((person, idx) => {
                    const hasAcked = !!activeAcks[person.id];
                    return (
                      <div key={person.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "10px 16px", borderBottom: idx < present.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: hasAcked ? "rgba(77,184,150,0.04)" : "transparent" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                          <div style={{ position: "relative", flexShrink: 0 }}>
                            <div className="co-avatar" style={{ width: 30, height: 30, fontSize: 10, background: person.color, overflow: "hidden", padding: 0, border: hasAcked ? "2px solid #4db896" : "2px solid rgba(255,255,255,0.08)" }}>
                              <img src={person.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=0D1117&color=fff`} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                            </div>
                            {hasAcked && <div style={{ position: "absolute", bottom: -2, right: -2, width: 12, height: 12, borderRadius: "50%", background: "#4db896", display: "grid", placeItems: "center", fontSize: 6, color: "#fff" }}><FaCheck /></div>}
                          </div>
                          <div>
                            <div style={{ color: "#f4f0ff", fontWeight: 700, fontSize: 12 }}>{person.name}</div>
                            <div className="co-muted" style={{ fontSize: 10 }}>
                              {attendance[person.id] === "physical" ? "Physical" : "Electronic"}
                              {hasAcked && <span style={{ marginLeft: 8, color: "#4db896" }}>Acknowledged</span>}
                            </div>
                          </div>
                        </div>
                        <button className="co-ghost-btn"
                          style={{ fontSize: 11, padding: "4px 12px", borderColor: hasAcked ? "rgba(220,80,80,0.25)" : "rgba(77,184,150,0.25)", color: hasAcked ? "#e06060" : "#4db896" }}
                          onClick={() => toggleAgendaAck(activeAgenda.id, person.id)}>
                          {hasAcked ? "Revoke" : "Acknowledge"}
                        </button>
                      </div>
                    );
                  })}
                </div>
                {allAcked && present.length > 0 && (
                  <div style={{ padding: "8px 16px", background: "rgba(77,184,150,0.06)", borderTop: "1px solid rgba(77,184,150,0.15)", color: "#4db896", fontSize: 11, fontWeight: 700, textAlign: "center" }}>
                    All {present.length} present participants acknowledged this item
                  </div>
                )}
              </div>
            )}

            {/* Phase content card  header acts as the phase label */}
            <div style={{ border: `1px solid ${currentPhase.borderColor}`, borderRadius: 16, overflow: "hidden", marginBottom: 20, background: "rgba(8,11,29,0.8)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: `1px solid ${currentPhase.borderColor}`, background: currentPhase.bg }}>
                <span style={{ color: currentPhase.color, fontWeight: 800, fontSize: 11, letterSpacing: "0.07em" }}>{currentPhase.label.toUpperCase()}</span>
                <span style={{ color: "#4e568e", fontSize: 10 }}>{currentPhase.description}</span>
              </div>
              <div style={{ padding: "16px 18px" }}>
                {activePhase === "pre"     && <PrePhaseContent     agendaItem={activeAgenda} agendaWork={activeWork} onChange={val => updateNote(val, "preNote")}  onViewDoc={setViewDoc} />}
                {activePhase === "conduct" && <ConductPhaseContent agendaItem={activeAgenda} activeWork={activeWork} updateNote={updateNote} editMode={editMode} editDraft={editDraft} setEditDraft={setEditDraft} taskTypes={TASK_TYPES} />}
                {activePhase === "post"    && <PostPhaseContent    agendaItem={activeAgenda} agendaWork={activeWork} onChange={val => updateNote(val, "postNote")} />}
              </div>
            </div>

            {/* Open Agenda */}
            <div style={{ border: "1px solid rgba(212,168,83,0.20)", borderRadius: 16, overflow: "hidden", marginBottom: 20, background: "rgba(8,11,29,0.6)" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(212,168,83,0.12)", background: "rgba(212,168,83,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FaExclamationCircle style={{ color: "#D4A853", fontSize: 11 }} />
                  <span style={{ color: "#D4A853", fontWeight: 800, fontSize: 11, letterSpacing: "0.06em" }}>OPEN AGENDA</span>
                  <span style={{ color: "#4e568e", fontSize: 10 }}> Items to address immediately or carry to the next meeting</span>
                </div>
              </div>
              <div style={{ padding: "14px 16px" }}>
                <OpenAgendaManager
                  agendaId={activeAgenda.id}
                  openItems={activeOpenItems}
                  onAdd={handleAddOpen}
                  onRemove={handleRemoveOpen}
                  participants={participants}
                />
              </div>
            </div>

            {/* Quick nav */}
            <div className="co-agenda-bottom-actions">
              <div className="co-agenda-bottom-btns">
                <button className="co-agenda-quick-btn co-agenda-quick-res" onClick={() => { setActiveSection("resolutions"); setShowSectionDropdown(false); }}>
                  <span className="co-quick-icon">§</span><span>Resolution</span>
                </button>
                <button className="co-agenda-quick-btn co-agenda-quick-dec" onClick={() => { setActiveSection("resolutions"); setShowSectionDropdown(false); }}>
                  <span className="co-quick-icon"><TbRoute /></span><span>Decision</span>
                </button>
                <button className="co-agenda-quick-btn" style={{ borderColor: "rgba(122,131,184,0.3)", color: "#7a83b8" }} onClick={() => handleNavigateToTasks()}>
                  <span className="co-quick-icon"><FaTasks style={{ fontSize: 12 }} /></span><span>Tasks</span>
                </button>
              </div>
            </div>
          </>
        )}

        {activeSection === "resolutions" && <ResolutionPanel agendaId={activeAgenda.id} agendaName={activeAgenda.title} onAddTask={r => handleNavigateToTasks(`Follow-up on: ${r.title}`)} />}
        {activeSection === "boardpack"   && <BoardPackPanel  agendaId={activeAgenda.id} agendaName={activeAgenda.title} />}
        {activeSection === "tasks"       && <TaskPanel       agendaId={activeAgenda.id} agendaName={activeAgenda.title} prefillTitle={taskPrefill} />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Phase sub-components
// ---------------------------------------------------------------------------
function PrePhaseContent({ agendaItem, agendaWork, onChange, onViewDoc }) {
  const docs = agendaItem.documents || agendaItem.docs || agendaItem.files || [];
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Description moved to top */}
      {agendaItem.description && (
        <div>
          <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: "0.16em", fontWeight: 700, marginBottom: 8 }}>AGENDA DESCRIPTION</div>
          <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(122,131,184,0.06)", border: "1px solid rgba(122,131,184,0.14)", color: "#8b93c8", fontSize: 13, lineHeight: 1.7 }}>{agendaItem.description}</div>
        </div>
      )}
      {docs.length > 0 && (
        <div>
          <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: "0.16em", fontWeight: 700, marginBottom: 8 }}>REFERENCE DOCUMENTS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {docs.map((doc, i) => {
              const label = doc.name || doc.title || `Document ${i + 1}`;
              return (
                <button key={i} onClick={() => onViewDoc(doc)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 13px", borderRadius: 10, background: "rgba(106,170,238,0.06)", border: "1px solid rgba(106,170,238,0.18)", cursor: "pointer", textAlign: "left" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(106,170,238,0.40)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(106,170,238,0.18)"}>
                  <DocIcon name={label} size={14} />
                  <span style={{ color: "#8bbfe8", fontWeight: 600, fontSize: 12, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
                  <FaEye style={{ fontSize: 11, color: "#6aaaee", flexShrink: 0 }} />
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div>
        <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: "0.16em", fontWeight: 700, marginBottom: 8 }}>PREPARATION NOTES</div>
        <RichTextEditor value={agendaWork.preNote || ""} onChange={onChange} placeholder="Add pre-meeting notes, context, reference documents, or objectives" minHeight={120} />
      </div>
      {agendaItem.presenter && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(122,131,184,0.06)", border: "1px solid rgba(122,131,184,0.12)", borderRadius: 10 }}>
          <span style={{ color: "#4e568e", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>PRESENTER</span>
          <span style={{ color: "#8b93c8", fontSize: 13, fontWeight: 600 }}>{agendaItem.presenter}</span>
          {agendaItem.duration && (<><span style={{ color: "#3d4570", fontSize: 12 }}>·</span><span style={{ color: "#596197", fontSize: 12 }}>{agendaItem.duration} min</span></>)}
        </div>
      )}
    </div>
  );
}

function ConductPhaseContent({ agendaItem, activeWork, updateNote, editMode, editDraft, setEditDraft, taskTypes }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Description at top */}
      {agendaItem.description && !editMode && (
        <div>
          <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: "0.16em", fontWeight: 700, marginBottom: 8 }}>AGENDA DESCRIPTION</div>
          <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(212,168,83,0.04)", border: "1px solid rgba(212,168,83,0.12)", color: "#8b93c8", fontSize: 13, lineHeight: 1.7 }}>{agendaItem.description}</div>
        </div>
      )}
      <div>
        <div style={{ color: "#D4A853", fontSize: 10, letterSpacing: "0.16em", fontWeight: 700, marginBottom: 8 }}>LIVE DISCUSSION NOTES</div>
        {editMode ? (
          <div style={{ display: "grid", gap: 10 }}>
            {/* Description edit field */}
            <div>
              <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: "0.14em", fontWeight: 700, marginBottom: 6 }}>AGENDA DESCRIPTION</div>
              <textarea className="co-rich-textarea" value={editDraft.description || ""} onChange={e => setEditDraft(d => ({ ...d, description: e.target.value }))} placeholder="Agenda description" rows={3} style={{ width: "100%", fontSize: 14, lineHeight: 1.8 }} />
            </div>
            {/* Task Type selector */}
            <div>
              <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: "0.14em", fontWeight: 700, marginBottom: 8 }}>TASK TYPE</div>
              <div style={{ display: "flex", gap: 8 }}>
                {(taskTypes || []).map(t => {
                  const sel = (editDraft.taskType || "internal") === t.id;
                  return (
                    <button key={t.id} onClick={() => setEditDraft(d => ({ ...d, taskType: t.id }))}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 7,
                        padding: "7px 18px", borderRadius: 9, cursor: "pointer",
                        border: sel ? `1px solid ${t.border}` : "1px solid rgba(255,255,255,0.08)",
                        background: sel ? t.bg : "transparent",
                        color: sel ? t.color : "#596197",
                        fontSize: 12, fontWeight: 800, transition: "all 0.15s",
                      }}>
                      {sel && <FaCheck style={{ fontSize: 8 }} />}
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <RichTextEditor value={activeWork.note} onChange={updateNote} placeholder="Capture key points, observations, and questions" minHeight={140} />
          </div>
        ) : (
          <RichTextEditor value={activeWork.note || ""} onChange={updateNote} placeholder="Capture key points, observations, and questions from the live discussion" minHeight={140} />
        )}
      </div>
    </div>
  );
}

function PostPhaseContent({ agendaItem, agendaWork, onChange }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* Description at top */}
      {agendaItem.description && (
        <div>
          <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: "0.16em", fontWeight: 700, marginBottom: 8 }}>AGENDA DESCRIPTION</div>
          <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(77,184,150,0.04)", border: "1px solid rgba(77,184,150,0.10)", color: "#8b93c8", fontSize: 13, lineHeight: 1.7 }}>{agendaItem.description}</div>
        </div>
      )}
      <div>
        <div style={{ color: "#4db896", fontSize: 10, letterSpacing: "0.16em", fontWeight: 700, marginBottom: 8 }}>POST-MEETING NOTES</div>
        <RichTextEditor value={agendaWork.postNote || ""} onChange={onChange} placeholder="Record outcomes, follow-up actions, or anything that came up after the meeting" minHeight={120} />
      </div>
      <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(77,184,150,0.04)", border: "1px solid rgba(77,184,150,0.12)" }}>
        <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: "0.14em", fontWeight: 700, marginBottom: 6 }}>QUICK CHECKLIST</div>
        {["Decisions recorded", "Action items assigned", "Follow-up dates confirmed", "Resolutions approved"].map(item => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ width: 14, height: 14, border: "1px solid rgba(77,184,150,0.3)", borderRadius: 4, display: "inline-block", flexShrink: 0 }} />
            <span style={{ color: "#596197", fontSize: 12 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ROOT EXPORT
// ---------------------------------------------------------------------------
export default function AgendaDiscussion({
  agendaItems: agendaItemsProp, agendaWork, activeAgenda, activeWork,
  setActiveAgendaId, updateNote,
  goToStep, setResAgendaId, setDecAgendaId,
  participants, attendance,
  agendaAcknowledgements, toggleAgendaAck, ackAllAgenda,
  addTask, updateTask, removeTask,
  openAgendaItems = {}, addOpenAgendaItem, updateOpenAgendaItem, removeOpenAgendaItem,
}) {
  // Local agenda items state so we can delete
  const [agendaItems, setAgendaItems] = useState(agendaItemsProp);

  // Sync if parent prop changes (e.g. hot-reload / re-mount)
  useEffect(() => {
    setAgendaItems(agendaItemsProp);
  }, [agendaItemsProp]);

  // -- Detail panel (Edit) state --
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const [startEdit, setStartEdit] = useState(false);

  // -- Projector (View) state --
  const [projectorIndex, setProjectorIndex] = useState(null);
  const [projectorSubPanel, setProjectorSubPanel] = useState(null);

  // Open edit/detail panel (Edit button)
  const openDetail = (id, edit = false) => {
    setActiveAgendaId(id);
    setDetailId(id);
    setStartEdit(edit);
    setShowDetail(true);
  };

  // Open projector (View button)
  const openProjector = (id) => {
    const idx = agendaItems.findIndex(a => a.id === id);
    if (idx === -1) return;
    setActiveAgendaId(id);
    setProjectorIndex(idx);
    setProjectorSubPanel(null);
  };

  const closeProjector = () => {
    setProjectorIndex(null);
    setProjectorSubPanel(null);
  };

  // Delete agenda item
  const handleDeleteAgenda = (id) => {
    setAgendaItems(prev => prev.filter(a => a.id !== id));
    // If currently viewing the deleted item, go back to list
    if (detailId === id) {
      setShowDetail(false);
      setDetailId(null);
    }
  };

  const goBack = () => setShowDetail(false);

  // Use local agendaItems for the active agenda lookup
  const localActiveAgenda = agendaItems.find(i => i.id === (activeAgenda?.id)) || agendaItems[0] || activeAgenda;

  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      {/* -- Projector overlay (View) -- */}
      {projectorIndex !== null && projectorSubPanel === null && (
        <AgendaProjectorView
          agendaItems={agendaItems}
          currentIndex={projectorIndex}
          onNavigate={(idx) => {
            setProjectorIndex(idx);
            setActiveAgendaId(agendaItems[idx].id);
          }}
          onClose={closeProjector}
          onOpenResolution={(agendaId) => {
            const ress = (SEED_RESOLUTIONS || []).filter(r => r.agendaId === agendaId);
            const slides = ress.length > 0
              ? ress.map(r => ({ title: r.title || "Resolution", body: r.description || "<p>No description.</p>" }))
              : [{ title: "No Resolutions", body: "<p>No resolutions are linked to this agenda item.</p>" }];
            setProjectorSubPanel({ type: "resolution", agendaId, slides });
          }}
          onOpenBoardPack={(agendaId) => {
            const slides = SAMPLE_BOARD_PACK_DOCS.map(d => ({
              title: d.title,
              body: d.description || "<p>No description.</p>",
              pdfUrl: d.url,
              meta: d.type + " · " + d.pages + " pages · " + d.size,
            }));
            setProjectorSubPanel({ type: "boardpack", agendaId, slides });
          }}
        />
      )}

      {/* -- Resolution projector sub-panel -- */}
      {projectorIndex !== null && projectorSubPanel?.type === "resolution" && (
        <DocZoomViewer
          title={"Resolutions  " + (agendaItems.find(a => a.id === projectorSubPanel.agendaId)?.title || "")}
          meta={String(projectorSubPanel.slides?.length || 0) + " resolution" + ((projectorSubPanel.slides?.length || 0) !== 1 ? "s" : "") + " linked to this agenda item"}
          slides={projectorSubPanel.slides || []}
          fullWidth
          onClose={() => setProjectorSubPanel(null)}
        />
      )}

      {/* -- Board Pack projector sub-panel -- */}
      {projectorIndex !== null && projectorSubPanel?.type === "boardpack" && (
        <DocZoomViewer
          title={"Board Pack  " + (agendaItems.find(a => a.id === projectorSubPanel.agendaId)?.title || "")}
          meta={String(projectorSubPanel.slides?.length || 0) + " document" + ((projectorSubPanel.slides?.length || 0) !== 1 ? "s" : "") + " linked to this agenda item"}
          slides={projectorSubPanel.slides || []}
          fullWidth
          onClose={() => setProjectorSubPanel(null)}
        />
      )}

      {/*
        Slide track  list panel | detail panel
      */}
      <div style={{
        display: "flex",
        width: "200%",
        transform: showDetail ? "translateX(-50%)" : "translateX(0%)",
        transition: "transform 0.30s cubic-bezier(0.4,0,0.2,1)",
        alignItems: "flex-start",
      }}>

        {/* PANEL 1: LIST */}
        <div style={{ width: "50%", minWidth: 0, background: "#080b1d" }}>
          <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 style={{ color: "#f4f0ff", fontWeight: 800, fontSize: 18, margin: "0 0 4px" }}>Agenda Items</h2>
            <p style={{ color: "#596197", fontSize: 13, margin: 0 }}>{agendaItems.length} item{agendaItems.length !== 1 ? "s" : ""}  click View or Edit to open</p>
          </div>
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            {agendaItems.map(item => (
              <AgendaCard
                key={item.id}
                item={item}
                agendaWork={agendaWork}
                agendaAcknowledgements={agendaAcknowledgements}
                attendance={attendance}
                participants={participants}
                openAgendaItems={openAgendaItems}
                isActive={detailId === item.id && showDetail}
                onView={id => openProjector(id)}
                onEdit={id => openDetail(id, true)}
                onDelete={handleDeleteAgenda}
              />
            ))}
            {agendaItems.length === 0 && (
              <div style={{ padding: "32px 16px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.07)", color: "#3d4570", fontSize: 13, fontStyle: "italic", textAlign: "center" }}>
                All agenda items have been removed.
              </div>
            )}
          </div>
        </div>

        {/* PANEL 2: DETAIL (Edit) */}
        <div style={{ width: "50%", minWidth: 0, background: "#080b1d" }}>
          {localActiveAgenda
            ? <AgendaDetailPanel
              key={localActiveAgenda.id}
              activeAgenda={localActiveAgenda}
              activeWork={activeWork}
              updateNote={updateNote}
              participants={participants}
              attendance={attendance}
              agendaAcknowledgements={agendaAcknowledgements}
              toggleAgendaAck={toggleAgendaAck}
              ackAllAgenda={ackAllAgenda}
              openAgendaItems={openAgendaItems}
              addOpenAgendaItem={addOpenAgendaItem}
              updateOpenAgendaItem={updateOpenAgendaItem}
              removeOpenAgendaItem={removeOpenAgendaItem}
              onBack={goBack}
              initialEditMode={startEdit}
            />
            : <div style={{ padding: 40, color: "#3d4570", fontSize: 13, textAlign: "center" }}>Select an agenda item to view details.</div>
          }
        </div>

      </div>
    </div>
  );
}
