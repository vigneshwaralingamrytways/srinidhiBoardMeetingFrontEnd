import { useState } from "react";
import {
  FaCheck, FaPencilAlt, FaTasks, FaFilePdf, FaFileImage, FaFile, FaFileWord, FaFileExcel, FaTimes, FaDownload, FaEye, FaPlus, FaEnvelope, FaPaperPlane, FaExclamationCircle, FaRegClock, FaTrash,
  FaBalanceScale, FaFolderOpen, FaListAlt, FaChevronLeft,
} from "react-icons/fa";
import { TbRoute } from "react-icons/tb";
import RichTextEditor from "./Richtexteditor";
import DocZoomViewer from "./DoczoomViewer";
import ResolutionPanel from "./ResolutionPanel";
import BoardPackPanel from "./AgendaBoardPack";
import TaskPanel from "./TaskPanel";

// --- Phase config -----------------------------------------------------------
const AGENDA_PHASES = [
  {
    id: "pre",
    label: "Pre-Meeting",
    icon: "",
    description: "Background, objectives & preparation notes",
    color: "#7a83b8",
    borderColor: "rgba(122,131,184,0.35)",
    bg: "rgba(122,131,184,0.10)",
  },
  {
    id: "conduct",
    label: "In Meeting",
    icon: "",
    description: "Live discussion notes, acknowledgements & actions",
    color: "#D4A853",
    borderColor: "rgba(212,168,83,0.40)",
    bg: "rgba(212,168,83,0.10)",
  },
  {
    id: "post",
    label: "Post-Meeting",
    icon: "",
    description: "Follow-up notes, decisions & outcomes",
    color: "#4db896",
    borderColor: "rgba(77,184,150,0.35)",
    bg: "rgba(77,184,150,0.08)",
  },
];

// --- Section config (new) -----------------------------------------------------

const SECTIONS = [
  { id: "discussion", label: "Discussion", icon: <FaListAlt />, color: "#7a83b8" },
  { id: "resolutions", label: "Resolutions", icon: <FaBalanceScale />, color: "#D4A853" },
  { id: "boardpack", label: "Board Pack", icon: <FaFolderOpen />, color: "#6aaaee" },
  { id: "tasks", label: "Tasks", icon: <FaTasks />, color: "#4db896" },
];

// --- Open Agenda resolution types --------------------------------------------
const OPEN_AGENDA_TYPES = [
  { id: "immediate", label: "Address Immediately", icon: <FaExclamationCircle />, color: "#e06060", bg: "rgba(220,80,80,0.10)", border: "rgba(220,80,80,0.28)" },
  { id: "next",      label: "Next Meeting",        icon: <FaRegClock />,          color: "#D4A853", bg: "rgba(212,168,83,0.10)", border: "rgba(212,168,83,0.28)" },
];

// --- Doc icon helper ----------------------------------------------------------
function DocIcon({ name = "", size = 14 }) {
  const ext = (name.split(".").pop() || "").toLowerCase();
  if (["pdf"].includes(ext))                    return <FaFilePdf  style={{ fontSize: size, color: "#e06060" }} />;
  if (["png","jpg","jpeg","gif","webp","svg"].includes(ext)) return <FaFileImage style={{ fontSize: size, color: "#6aaaee" }} />;
  if (["doc","docx"].includes(ext))             return <FaFileWord  style={{ fontSize: size, color: "#6aaaee" }} />;
  if (["xls","xlsx","csv"].includes(ext))       return <FaFileExcel style={{ fontSize: size, color: "#4db896" }} />;
  return <FaFile style={{ fontSize: size, color: "#7a83b8" }} />;
}

// --- Agenda Documents Panel ---------------------------------------------------
function AgendaDocsPanel({ agendaItem, onViewDoc }) {
  const docs = agendaItem.documents || agendaItem.docs || agendaItem.files || [];

  if (docs.length === 0) {
    return (
      <div style={{ padding:"14px 16px", borderRadius:12, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", color:"#3d4570", fontSize:12, fontStyle:"italic", textAlign:"center" }}>
        No documents attached to this agenda item
      </div>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {docs.map((doc, i) => {
        const label = doc.name || doc.title || doc.fileName || `Document ${i + 1}`;
        const url   = doc.url  || doc.fileUrl || null;
        return (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", borderRadius:12, background:"#080b1d", border:"1px solid rgba(255,255,255,0.07)", transition:"border-color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,168,83,0.25)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
          >
            <div style={{ width:36, height:36, borderRadius:9, background:"rgba(255,255,255,0.04)", display:"grid", placeItems:"center", flexShrink:0 }}>
              <DocIcon name={label} size={16} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:"#f4f0ff", fontWeight:600, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{label}</div>
              {doc.size && <div style={{ color:"#596197", fontSize:10 }}>{doc.size}</div>}
            </div>
            <div style={{ display:"flex", gap:8, flexShrink:0 }}>
              <button
                onClick={() => onViewDoc(doc)}
                style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, border:"1px solid rgba(212,168,83,0.30)", color:"#D4A853", background:"rgba(212,168,83,0.07)", fontSize:11, fontWeight:700, cursor:"pointer", transition:"all 0.15s" }}
              >
                <FaEye style={{ fontSize:10 }} /> View
              </button>
              {url && (
                <a href={url} download={label}
                  style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"6px 10px", borderRadius:8, border:"1px solid rgba(255,255,255,0.10)", color:"#596197", background:"transparent", fontSize:11, fontWeight:700, textDecoration:"none", cursor:"pointer" }}>
                  <FaDownload style={{ fontSize:10 }} />
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- Open Agenda Manager -----------------------------------------------------
function OpenAgendaManager({ agendaId, openItems, onAdd, onUpdate, onRemove, participants }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ title:"", details:"", type:"next", notifyAll:true, assignedTo:[], dueDate:"" });

  const handleAdd = () => {
    if (!draft.title.trim()) return;
    onAdd(agendaId, { ...draft, title: draft.title.trim(), id: Date.now() + Math.random(), createdAt: new Date().toLocaleString() });
    setDraft({ title:"", details:"", type:"next", notifyAll:true, assignedTo:[], dueDate:"" });
    setAdding(false);
  };

  const toggleAssignee = (pid) => {
    setDraft(d => ({
      ...d,
      assignedTo: d.assignedTo.includes(pid) ? d.assignedTo.filter(x => x !== pid) : [...d.assignedTo, pid],
    }));
  };

  return (
    <div>
      {/* Header row */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ color:"#e8a445", fontSize:10, letterSpacing:"0.16em", fontWeight:800 }}>OPEN AGENDA ITEMS</span>
          {openItems.length > 0 && (
            <span style={{ background:"rgba(212,168,83,0.15)", color:"#D4A853", fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:20 }}>{openItems.length}</span>
          )}
        </div>
        <button
          onClick={() => setAdding(v => !v)}
          style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 14px", borderRadius:9, border:"1px solid rgba(212,168,83,0.35)", color:"#D4A853", background: adding ? "rgba(212,168,83,0.12)" : "transparent", fontSize:11, fontWeight:700, cursor:"pointer", transition:"all 0.15s" }}
        >
          <FaPlus style={{ fontSize:9 }} /> Add Open Item
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div style={{ marginBottom:18, padding:"18px 20px", borderRadius:14, border:"1px solid rgba(212,168,83,0.22)", background:"rgba(212,168,83,0.04)" }}>
          <div style={{ color:"#D4A853", fontSize:10, letterSpacing:"0.16em", fontWeight:800, marginBottom:14 }}>NEW OPEN AGENDA ITEM</div>
          <div style={{ display:"grid", gap:12 }}>
            {/* Title */}
            <div>
              <div style={{ color:"#4f578f", fontSize:10, letterSpacing:"0.14em", fontWeight:700, marginBottom:6 }}>TITLE</div>
              <input className="co-input" value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                placeholder="Brief summary of the open item" autoFocus />
            </div>

            {/* Details */}
            <div>
              <div style={{ color:"#4f578f", fontSize:10, letterSpacing:"0.14em", fontWeight:700, marginBottom:6 }}>DETAILS / CONTEXT</div>
              <textarea className="co-rich-textarea" style={{ minHeight:80 }}
                value={draft.details} onChange={e => setDraft(d => ({ ...d, details: e.target.value }))}
                placeholder="Describe the issue, context, or background" />
            </div>

            {/* Resolution type */}
            <div>
              <div style={{ color:"#4f578f", fontSize:10, letterSpacing:"0.14em", fontWeight:700, marginBottom:8 }}>HOW TO ADDRESS</div>
              <div style={{ display:"flex", gap:8 }}>
                {OPEN_AGENDA_TYPES.map(t => {
                  const sel = draft.type === t.id;
                  return (
                    <button key={t.id} onClick={() => setDraft(d => ({ ...d, type: t.id }))}
                      style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"10px 14px", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:12, border: sel ? `1px solid ${t.border}` : "1px solid rgba(255,255,255,0.08)", background: sel ? t.bg : "#090c20", color: sel ? t.color : "#596197", transition:"all 0.15s" }}>
                      {t.icon} {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notify / Assignees */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <div style={{ color:"#4f578f", fontSize:10, letterSpacing:"0.14em", fontWeight:700, marginBottom:8 }}>SEND DETAILS TO</div>
                <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                  {participants.map(p => {
                    const sel = draft.assignedTo.includes(p.id);
                    return (
                      <button key={p.id} onClick={() => toggleAssignee(p.id)}
                        style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:999, border: sel ? "1.5px solid rgba(212,168,83,0.5)" : "1.5px solid rgba(255,255,255,0.08)", background: sel ? "rgba(212,168,83,0.12)" : "transparent", color: sel ? "#D4A853" : "#596197", fontSize:11, fontWeight:700, cursor:"pointer", transition:"all 0.14s" }}>
                        <div style={{ width:16, height:16, borderRadius:"50%", background:p.color, overflow:"hidden", flexShrink:0 }}>
                          <img src={p.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0D1117&color=fff`} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        </div>
                        {p.name.split(" ")[0]}
                        {sel && <FaCheck style={{ fontSize:8 }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <div style={{ color:"#4f578f", fontSize:10, letterSpacing:"0.14em", fontWeight:700, marginBottom:6 }}>DUE / TARGET DATE</div>
                <input className="co-input" type="date" value={draft.dueDate}
                  onChange={e => setDraft(d => ({ ...d, dueDate: e.target.value }))} />
              </div>
            </div>

            {/* Notify all toggle */}
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
              <button
                onClick={() => setDraft(d => ({ ...d, notifyAll: !d.notifyAll }))}
                style={{ width:34, height:20, borderRadius:999, border:"none", cursor:"pointer", transition:"background 0.2s", background: draft.notifyAll ? "#D4A853" : "rgba(255,255,255,0.10)", position:"relative", flexShrink:0 }}
              >
                <span style={{ position:"absolute", top:2, left: draft.notifyAll ? 16 : 2, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.2s" }} />
              </button>
              <div>
                <div style={{ color:"#c8cde8", fontSize:12, fontWeight:700 }}>Notify all meeting members</div>
                <div style={{ color:"#4e568e", fontSize:10 }}>Send this open item details to all participants via email/notification</div>
              </div>
              <FaEnvelope style={{ color: draft.notifyAll ? "#D4A853" : "#3d4570", fontSize:14, marginLeft:"auto", flexShrink:0 }} />
            </div>

            <div style={{ display:"flex", justifyContent:"flex-end", gap:8 }}>
              <button className="co-ghost-btn" onClick={() => setAdding(false)}>Cancel</button>
              <button className="co-gold-btn" disabled={!draft.title.trim()} style={{ opacity: draft.title.trim() ? 1 : 0.4 }} onClick={handleAdd}>
                <FaPaperPlane style={{ fontSize:11, marginRight:6 }} /> Save & Notify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Open items list */}
      {openItems.length === 0 && !adding && (
        <div style={{ padding:"18px 16px", borderRadius:12, background:"rgba(255,255,255,0.02)", border:"1px dashed rgba(255,255,255,0.07)", color:"#3d4570", fontSize:12, fontStyle:"italic", textAlign:"center" }}>
          No open agenda items yet. Use "Add Open Item" to flag unresolved matters.
        </div>
      )}

      {openItems.map(item => {
        const typeConf = OPEN_AGENDA_TYPES.find(t => t.id === item.type) || OPEN_AGENDA_TYPES[1];
        const assignees = (item.assignedTo || []).map(id => participants.find(p => p.id === id)).filter(Boolean);
        return (
          <div key={item.id} style={{ marginBottom:10, padding:"14px 16px", borderRadius:14, border:`1px solid ${typeConf.border}`, background: typeConf.bg }}>
            {/* Top row */}
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10, marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, minWidth:0 }}>
                <span style={{ color: typeConf.color, fontSize:14, flexShrink:0 }}>{typeConf.icon}</span>
                <div style={{ minWidth:0 }}>
                  <div style={{ color:"#f4f0ff", fontWeight:700, fontSize:13, lineHeight:1.4 }}>{item.title}</div>
                  <div style={{ color:"#4e568e", fontSize:10, marginTop:2 }}>{item.createdAt}</div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                <span style={{ fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:999, background: typeConf.bg, color: typeConf.color, border:`1px solid ${typeConf.border}` }}>
                  {typeConf.label}
                </span>
                <button onClick={() => onRemove(agendaId, item.id)}
                  style={{ background:"none", border:"none", cursor:"pointer", color:"#3d4570", padding:"4px 6px", borderRadius:6, transition:"color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#e06060"}
                  onMouseLeave={e => e.currentTarget.style.color = "#3d4570"}
                >
                  <FaTrash style={{ fontSize:11 }} />
                </button>
              </div>
            </div>

            {/* Details */}
            {item.details && (
              <div style={{ color:"#8b93c8", fontSize:12, lineHeight:1.7, marginBottom:10, padding:"8px 10px", background:"rgba(0,0,0,0.2)", borderRadius:8 }}>
                {item.details}
              </div>
            )}

            {/* Footer meta */}
            <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
              {/* Assignees */}
              {assignees.length > 0 && (
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <FaEnvelope style={{ color:"#4e568e", fontSize:10 }} />
                  <div style={{ display:"flex", gap:3 }}>
                    {assignees.map(p => (
                      <div key={p.id} title={p.name} style={{ width:20, height:20, borderRadius:"50%", overflow:"hidden", background:p.color, border:"1.5px solid rgba(255,255,255,0.12)", flexShrink:0 }}>
                        <img src={p.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0D1117&color=fff`} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      </div>
                    ))}
                  </div>
                  <span style={{ color:"#596197", fontSize:10 }}>notified</span>
                </div>
              )}
              {item.notifyAll && (
                <span style={{ display:"inline-flex", alignItems:"center", gap:4, color:"#D4A853", fontSize:10, fontWeight:700 }}>
                  <FaEnvelope style={{ fontSize:9 }} /> All Members
                </span>
              )}
              {item.dueDate && (
                <span style={{ display:"inline-flex", alignItems:"center", gap:4, color:"#596197", fontSize:10 }}>
                  <FaRegClock style={{ fontSize:9 }} /> Due: {item.dueDate}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- Main AgendaDiscussion ---------------------------------------------------
export default function AgendaDiscussion({
  agendaItems, agendaWork, activeAgenda, activeWork,
  setActiveAgendaId, updateNote,
  goToStep, setResAgendaId, setDecAgendaId,
  participants, attendance,
  agendaAcknowledgements, toggleAgendaAck, ackAllAgenda,
  addTask, updateTask, removeTask,
  // open agenda
  openAgendaItems = {}, addOpenAgendaItem, updateOpenAgendaItem, removeOpenAgendaItem,
}) {
  const [showAckPanel, setShowAckPanel]   = useState(false);
  const [showDocsPanel, setShowDocsPanel] = useState(false);
  const [editMode, setEditMode]           = useState(false);
  const [editDraft, setEditDraft]         = useState({});
  const [activePhase, setActivePhase]     = useState("conduct");
  const [viewDoc, setViewDoc]             = useState(null);

  const [activeSection, setActiveSection] = useState("discussion");
  const [taskPrefill, setTaskPrefill]      = useState("");

  const handleNavigateToRes = id => { setResAgendaId && setResAgendaId(id); setActiveSection("resolutions"); };
  const handleNavigateToDec = id => { setDecAgendaId && setDecAgendaId(id); setActiveSection("resolutions"); };
  const handleNavigateToTasks = (prefill = "") => { setTaskPrefill(prefill); setActiveSection("tasks"); };

  const present = participants.filter(
    p => attendance[p.id] === "physical" || attendance[p.id] === "electronic"
  );

  const getAckCount = id => {
    const acks = agendaAcknowledgements[id] || {};
    return present.filter(p => acks[p.id]).length;
  };

  const activeAcks  = agendaAcknowledgements[activeAgenda.id] || {};
  const ackedList   = present.filter(p => activeAcks[p.id]);
  const pendingList = present.filter(p => !activeAcks[p.id]);
  const allAcked    = present.length > 0 && ackedList.length === present.length;

  const handleSelectAgenda = id => {
    setActiveAgendaId(id);
    setShowAckPanel(false);
    setShowDocsPanel(false);
    setEditMode(false);
    setEditDraft({});
    setActiveSection("discussion");
  };

  const enterEditMode = () => {
    setEditDraft({ title: activeAgenda.title || "", description: activeAgenda.description || "" });
    setEditMode(true);
  };

  const currentPhase  = AGENDA_PHASES.find(p => p.id === activePhase);
  const activeDocs    = activeAgenda.documents || activeAgenda.docs || activeAgenda.files || [];
  const activeOpenItems = openAgendaItems[activeAgenda.id] || [];

  // Default no-op handlers so component is usable without wiring open-agenda state from parent
  const handleAddOpen    = (aid, item) => addOpenAgendaItem    ? addOpenAgendaItem(aid, item)            : null;
  const handleUpdateOpen = (aid, item) => updateOpenAgendaItem ? updateOpenAgendaItem(aid, item)         : null;
  const handleRemoveOpen = (aid, id)   => removeOpenAgendaItem ? removeOpenAgendaItem(aid, id)           : null;

  return (
    <section className="co-agenda-layout">
      {/* Doc viewer modal (zoom-enabled, used for plain agenda attachments) */}
      {viewDoc && (
        <DocZoomViewer
          title={viewDoc.name || viewDoc.title || "Document"}
          meta="Agenda Document"
          url={viewDoc.url || viewDoc.fileUrl || null}
          downloadUrl={viewDoc.url || viewDoc.fileUrl || null}
          onClose={() => setViewDoc(null)}
        />
      )}

      {/* -- LEFT  agenda list ------------------------------------ */}
      <div className="co-panel">
        <div className="co-panel-head">
          <div><h2>Agenda Items</h2><p>Select an item to review</p></div>
        </div>
        <div className="co-agenda-list co-agenda-list-nav">
          {agendaItems.map(item => {
            const isActive           = activeAgenda.id === item.id;
            const taskCount          = (agendaWork[item.id]?.tasks || []).filter(t => t.linkedType === "agenda").length;
            const ackCount           = getAckCount(item.id);
            const itemAllAcked       = present.length > 0 && ackCount === present.length;
            const ackedPart          = present.filter(p => (agendaAcknowledgements[item.id] || {})[p.id]);
            const pendingPart        = present.filter(p => !(agendaAcknowledgements[item.id] || {})[p.id]);
            const hasPreNote         = !!(agendaWork[item.id]?.preNote);
            const hasConductNote     = !!(agendaWork[item.id]?.note);
            const hasPostNote        = !!(agendaWork[item.id]?.postNote);
            const itemDocs           = item.documents || item.docs || item.files || [];
            const openCount          = (openAgendaItems[item.id] || []).length;

            return (
              <div key={item.id} className={`co-agenda-item-wrap ${isActive ? "active" : ""}`}>
                <button className={`co-agenda-item-main ${isActive ? "active" : ""}`} onClick={() => handleSelectAgenda(item.id)}>
                  <span className="co-agenda-item-title">{item.title}</span>

                  {/* Meta row */}
                  <em style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                    <span>{item.duration} min / {item.type}</span>
                    <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                      {/* docs badge */}
                      {itemDocs.length > 0 && (
                        <span style={{ fontSize:10, fontWeight:800, padding:"2px 7px", borderRadius:999, background:"rgba(106,170,238,0.12)", color:"#6aaaee" }}>
                          {itemDocs.length} doc{itemDocs.length > 1 ? "s" : ""}
                        </span>
                      )}
                      {taskCount > 0 && (
                        <span className="co-output-step-count">{taskCount} task{taskCount > 1 ? "s" : ""}</span>
                      )}
                      {/* open agenda badge */}
                      {openCount > 0 && (
                        <span style={{ fontSize:10, fontWeight:800, padding:"2px 7px", borderRadius:999, background:"rgba(212,168,83,0.12)", color:"#D4A853" }}>
                          {openCount} open
                        </span>
                      )}
                      <span style={{ fontSize:10, fontWeight:800, padding:"2px 7px", borderRadius:999, background: itemAllAcked ? "rgba(77,184,150,0.15)" : "rgba(212,168,83,0.10)", color: itemAllAcked ? "#4db896" : "#d4a853" }}>
                        {ackCount}/{present.length}
                      </span>
                    </span>
                  </em>

                  {/* Phase dots */}
                  <div style={{ display:"flex", gap:5, marginTop:6, alignItems:"center" }}>
                    {AGENDA_PHASES.map(phase => {
                      const has = phase.id === "pre" ? hasPreNote : phase.id === "conduct" ? hasConductNote : hasPostNote;
                      return (
                        <div key={phase.id} title={phase.label} style={{ display:"flex", alignItems:"center", gap:3, fontSize:9, fontWeight:700, color: has ? phase.color : "#3d4570" }}>
                          <span style={{ width:6, height:6, borderRadius:"50%", background: has ? phase.color : "rgba(255,255,255,0.08)", border:`1px solid ${has ? phase.color : "rgba(255,255,255,0.10)"}`, display:"inline-block" }} />
                          <span style={{ letterSpacing:"0.05em" }}>{phase.label.split(" ")[0]}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Ack avatars */}
                  {present.length > 0 && (
                    <div style={{ marginTop:6, display:"flex", gap:3, flexWrap:"wrap", alignItems:"center" }}>
                      {ackedPart.map(p => (
                        <div key={p.id} title={`${p.name}  Acknowledged`}
                          style={{ width:18, height:18, borderRadius:"50%", border:"1.5px solid #4db896", overflow:"hidden", background:p.color, flexShrink:0 }}>
                          <img src={p.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0D1117&color=fff`} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        </div>
                      ))}
                      {pendingPart.map(p => (
                        <div key={p.id} title={`${p.name}  Pending`}
                          style={{ width:18, height:18, borderRadius:"50%", border:"1.5px solid rgba(220,80,80,0.4)", overflow:"hidden", background:p.color, flexShrink:0, opacity:0.45 }}>
                          <img src={p.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0D1117&color=fff`} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        </div>
                      ))}
                      {itemAllAcked && <span style={{ color:"#4db896", fontSize:9, fontWeight:800, letterSpacing:1 }}>ALL DONE</span>}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* -- RIGHT  active agenda detail -------------------------- */}
      <div className="co-panel co-agenda-full">

        {/* Panel header */}
        <div className="co-panel-head">
          <div style={{ flex:1, minWidth:0 }}>
            {editMode ? (
              <input className="co-input" value={editDraft.title}
                onChange={e => setEditDraft(d => ({ ...d, title: e.target.value }))}
                placeholder="Agenda title" style={{ fontSize:15, fontWeight:700 }} />
            ) : (
              <>
                <h2>{activeAgenda.title}</h2>
                {activeAgenda.description && (
                  <p style={{ color:"#8b93c8", fontSize:13, lineHeight:1.6, marginTop:4 }}>{activeAgenda.description}</p>
                )}
              </>
            )}
          </div>

          {/* Action buttons row */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0, flexWrap:"wrap" }}>
            {/* Documents button  only meaningful in the Discussion section */}
            {activeSection === "discussion" && (
              <button
                className="co-ghost-btn"
                style={{ fontSize:11, padding:"5px 12px", position:"relative",
                  borderColor: showDocsPanel ? "rgba(106,170,238,0.5)" : "rgba(255,255,255,0.1)",
                  color: showDocsPanel ? "#6aaaee" : "#6670aa",
                  display:"flex", alignItems:"center", gap:6 }}
                onClick={() => { setShowDocsPanel(v => !v); setShowAckPanel(false); }}
                title="View agenda documents"
              >
                <FaEye style={{ fontSize:11 }} />
                Docs
                {activeDocs.length > 0 && (
                  <span style={{ background:"rgba(106,170,238,0.20)", color:"#6aaaee", fontSize:9, fontWeight:800, padding:"1px 6px", borderRadius:20 }}>
                    {activeDocs.length}
                  </span>
                )}
              </button>
            )}

            {/* Ack button  only meaningful in the Discussion section */}
            {activeSection === "discussion" && (
              <button
                className="co-ghost-btn"
                style={{ fontSize:11, padding:"5px 12px",
                  borderColor: showAckPanel ? "rgba(212,168,83,0.5)" : "rgba(255,255,255,0.1)",
                  color: showAckPanel ? "#d4a853" : "#6670aa" }}
                onClick={() => { setShowAckPanel(v => !v); setShowDocsPanel(false); }}
              >
                {ackedList.length}/{present.length} Ack'd
              </button>
            )}

            {activeSection === "discussion" && (
              editMode ? (
                <button className="co-gold-btn" style={{ fontSize:11, padding:"5px 14px" }} onClick={() => setEditMode(false)}>
                  <FaCheck style={{ fontSize:9, marginRight:5 }} />Done
                </button>
              ) : (
                <button className="co-ghost-btn"
                  style={{ fontSize:11, padding:"5px 12px", borderColor:"rgba(255,255,255,0.12)", color:"#8b93c8" }}
                  onClick={enterEditMode}>
                  <FaPencilAlt style={{ fontSize:9, marginRight:5 }} />Edit
                </button>
              )
            )}
          </div>
        </div>

        {/* -- NEW: Section tabs (Discussion / Resolutions / Board Pack / Tasks) -- */}
        <div style={{ display:"flex", gap:0, marginBottom:18, background:"#080a1c", borderRadius:14, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
          {SECTIONS.map((sec, i) => {
            const isAct = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  padding: "11px 8px",
                  background: isAct ? `${sec.color}1a` : "transparent",
                  borderRight: i < SECTIONS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  border: "none", cursor: "pointer",
                  outline: isAct ? `2px solid ${sec.color}55` : "none", outlineOffset: -2,
                  transition: "all 0.18s ease",
                }}
              >
                <span style={{ fontSize: 13, color: isAct ? sec.color : "#4e568e", display: "flex" }}>{sec.icon}</span>
                <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.04em", color: isAct ? sec.color : "#4e568e" }}>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* SECTION: DISCUSSION (original phase-tab content)              */}
        {/* ============================================================ */}
        {activeSection === "discussion" && (
          <>
            {/* -- Documents panel ----------------------------------- */}
            {showDocsPanel && (
              <div style={{ marginBottom:22, border:"1px solid rgba(106,170,238,0.22)", borderRadius:16, background:"#07091a", overflow:"hidden" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 18px", borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(106,170,238,0.05)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ color:"#4e568e", fontSize:10, letterSpacing:2, fontWeight:700 }}>AGENDA DOCUMENTS</span>
                    <span style={{ background: activeDocs.length > 0 ? "rgba(106,170,238,0.15)" : "rgba(255,255,255,0.05)", color: activeDocs.length > 0 ? "#6aaaee" : "#596197", fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:999 }}>
                      {activeDocs.length} file{activeDocs.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <button onClick={() => setShowDocsPanel(false)}
                    style={{ background:"none", border:"none", color:"#596197", cursor:"pointer", fontSize:13, display:"grid", placeItems:"center" }}>
                    <FaTimes />
                  </button>
                </div>
                <div style={{ padding:"14px 18px" }}>
                  <AgendaDocsPanel agendaItem={activeAgenda} onViewDoc={setViewDoc} />
                </div>
              </div>
            )}

            {/* -- Acknowledgement panel ----------------------------- */}
            {showAckPanel && (
              <div style={{ marginBottom:22, border: allAcked ? "1px solid rgba(77,184,150,0.25)" : "1px solid rgba(212,168,83,0.15)", borderRadius:16, background:"#07091a", overflow:"hidden" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.06)", background: allAcked ? "rgba(77,184,150,0.05)" : "transparent" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ color:"#4e568e", fontSize:10, letterSpacing:2, fontWeight:700 }}>ACKNOWLEDGEMENTS</span>
                    {allAcked
                      ? <span style={{ background:"rgba(77,184,150,0.15)", color:"#4db896", fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:999 }}>All Acknowledged</span>
                      : <span style={{ background:"rgba(220,80,80,0.12)", color:"#e06060", fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:999 }}>{pendingList.length} Pending</span>}
                  </div>
                  {!allAcked && present.length > 0 && (
                    <button className="co-ghost-btn"
                      style={{ fontSize:11, padding:"5px 12px", borderColor:"rgba(77,184,150,0.25)", color:"#4db896" }}
                      onClick={() => ackAllAgenda(activeAgenda.id)}>
                      Acknowledge All
                    </button>
                  )}
                </div>
                <div style={{ display:"flex", flexDirection:"column" }}>
                  {present.length === 0 && (
                    <div style={{ padding:18, color:"#3d4570", fontSize:12, textAlign:"center" }}>No present participants. Mark attendance first.</div>
                  )}
                  {present.map((person, idx) => {
                    const hasAcked = !!activeAcks[person.id];
                    return (
                      <div key={person.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:14, padding:"12px 18px", borderBottom: idx < present.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: hasAcked ? "rgba(77,184,150,0.04)" : "transparent", transition:"background 0.15s" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10, flex:1, minWidth:0 }}>
                          <div style={{ position:"relative", flexShrink:0 }}>
                            <div className="co-avatar" style={{ width:34, height:34, fontSize:10, background:person.color, overflow:"hidden", padding:0, border: hasAcked ? "2px solid #4db896" : "2px solid rgba(255,255,255,0.08)" }}>
                              <img src={person.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=0D1117&color=fff`} alt={person.name} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"50%" }} />
                            </div>
                            {hasAcked && (
                              <div style={{ position:"absolute", bottom:-2, right:-2, width:14, height:14, borderRadius:"50%", background:"#4db896", display:"grid", placeItems:"center", fontSize:7, color:"#fff" }}>
                                <FaCheck />
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{ color:"#f4f0ff", fontWeight:700, fontSize:13 }}>{person.name}</div>
                            <div className="co-muted" style={{ fontSize:11 }}>
                              {attendance[person.id] === "physical" ? "Physical" : "Electronic"}
                              {hasAcked && <span style={{ marginLeft:8, color:"#4db896" }}>Acknowledged</span>}
                            </div>
                          </div>
                        </div>
                        <button className="co-ghost-btn"
                          style={{ fontSize:11, padding:"5px 14px", borderColor: hasAcked ? "rgba(220,80,80,0.25)" : "rgba(77,184,150,0.25)", color: hasAcked ? "#e06060" : "#4db896" }}
                          onClick={() => toggleAgendaAck(activeAgenda.id, person.id)}>
                          {hasAcked ? "Revoke" : "Acknowledge"}
                        </button>
                      </div>
                    );
                  })}
                </div>
                {allAcked && present.length > 0 && (
                  <div style={{ padding:"10px 18px", background:"rgba(77,184,150,0.06)", borderTop:"1px solid rgba(77,184,150,0.15)", color:"#4db896", fontSize:12, fontWeight:700, textAlign:"center" }}>
                    All {present.length} present participants acknowledged this item
                  </div>
                )}
              </div>
            )}

            {/* -- Phase tabs ---------------------------------------- */}
            <div style={{ display:"flex", gap:0, marginBottom:22, background:"#080a1c", borderRadius:14, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
              {AGENDA_PHASES.map((phase, i) => {
                const isAct = activePhase === phase.id;
                const hasCon = phase.id === "pre" ? !!(activeWork.preNote) : phase.id === "conduct" ? !!(activeWork.note) : !!(activeWork.postNote);
                return (
                  <button key={phase.id} onClick={() => setActivePhase(phase.id)}
                    style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5, padding:"12px 10px",
                      background: isAct ? phase.bg : "transparent",
                      borderRight: i < AGENDA_PHASES.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      border:"none", cursor:"pointer",
                      outline: isAct ? `2px solid ${phase.borderColor}` : "none", outlineOffset:-2,
                      transition:"all 0.18s ease", borderRadius:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:14, color: isAct ? phase.color : "#3d4570" }}>{phase.icon}</span>
                      <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.05em", color: isAct ? phase.color : "#4e568e" }}>{phase.label.toUpperCase()}</span>
                      {hasCon && <span style={{ width:6, height:6, borderRadius:"50%", background:phase.color, opacity: isAct ? 1 : 0.5 }} />}
                    </div>
                    <span style={{ fontSize:10, color: isAct ? phase.color : "#3d4570", opacity:0.8, textAlign:"center", lineHeight:1.3 }}>{phase.description}</span>
                  </button>
                );
              })}
            </div>

            {/* -- Phase content -------------------------------------- */}
            <div style={{ border:`1px solid ${currentPhase.borderColor}`, borderRadius:16, overflow:"hidden", marginBottom:22, background:"rgba(8,11,29,0.8)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 18px", borderBottom:`1px solid ${currentPhase.borderColor}`, background:currentPhase.bg }}>
                <span style={{ fontSize:16, color:currentPhase.color }}>{currentPhase.icon}</span>
                <div>
                  <span style={{ color:currentPhase.color, fontWeight:800, fontSize:12, letterSpacing:"0.06em" }}>{currentPhase.label.toUpperCase()}</span>
                  <span style={{ color:"#4e568e", fontSize:11, marginLeft:10 }}>{currentPhase.description}</span>
                </div>
              </div>
              <div style={{ padding:"18px 20px" }}>
                {activePhase === "pre" && (
                  <PrePhaseContent agendaItem={activeAgenda} agendaWork={activeWork} onChange={val => updateNote(val, "preNote")} onViewDoc={setViewDoc} />
                )}
                {activePhase === "conduct" && (
                  <ConductPhaseContent agendaItem={activeAgenda} activeWork={activeWork} updateNote={updateNote} editMode={editMode} editDraft={editDraft} setEditDraft={setEditDraft} />
                )}
                {activePhase === "post" && (
                  <PostPhaseContent agendaItem={activeAgenda} agendaWork={activeWork} onChange={val => updateNote(val, "postNote")} />
                )}
              </div>
            </div>

            {/* -- Open Agenda Items (always visible below phases) --- */}
            <div style={{ border:"1px solid rgba(212,168,83,0.20)", borderRadius:16, overflow:"hidden", marginBottom:22, background:"rgba(8,11,29,0.6)" }}>
              <div style={{ padding:"14px 18px", borderBottom:"1px solid rgba(212,168,83,0.12)", background:"rgba(212,168,83,0.05)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <FaExclamationCircle style={{ color:"#D4A853", fontSize:12 }} />
                  <span style={{ color:"#D4A853", fontWeight:800, fontSize:12, letterSpacing:"0.06em" }}>OPEN AGENDA</span>
                  <span style={{ color:"#4e568e", fontSize:11 }}> Items to address immediately or carry to the next meeting</span>
                </div>
              </div>
              <div style={{ padding:"16px 18px" }}>
                <OpenAgendaManager
                  agendaId={activeAgenda.id}
                  openItems={activeOpenItems}
                  onAdd={handleAddOpen}
                  onUpdate={handleUpdateOpen}
                  onRemove={handleRemoveOpen}
                  participants={participants}
                />
              </div>
            </div>

            {/* -- Quick nav footer ----------------------------------- */}
            <div className="co-agenda-bottom-actions">
              <div className="co-agenda-bottom-btns">
                <button className="co-agenda-quick-btn co-agenda-quick-res" onClick={() => handleNavigateToRes(activeAgenda.id)}>
                  <span className="co-quick-icon">§</span><span>Resolution</span>
                </button>
                <button className="co-agenda-quick-btn co-agenda-quick-dec" onClick={() => handleNavigateToDec(activeAgenda.id)}>
                  <span className="co-quick-icon"><TbRoute /></span><span>Decision</span>
                </button>
                <button className="co-agenda-quick-btn" style={{ borderColor:"rgba(122,131,184,0.3)", color:"#7a83b8" }} onClick={() => handleNavigateToTasks()}>
                  <span className="co-quick-icon"><FaTasks style={{ fontSize:12 }} /></span><span>Tasks</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* ============================================================ */}
        {/* SECTION: RESOLUTIONS (scoped to active agenda, + common)      */}
        {/* ============================================================ */}
        {activeSection === "resolutions" && (
          <ResolutionPanel
            agendaId={activeAgenda.id}
            agendaName={activeAgenda.title}
            onAddTask={(resolution) => handleNavigateToTasks(`Follow-up on: ${resolution.title}`)}
          />
        )}

        {/* ============================================================ */}
        {/* SECTION: BOARD PACK (scoped to active agenda, + common)        */}
        {/* ============================================================ */}
        {activeSection === "boardpack" && (
          <BoardPackPanel
            agendaId={activeAgenda.id}
            agendaName={activeAgenda.title}
          />
        )}

        {/* ============================================================ */}
        {/* SECTION: TASKS (scoped to active agenda, + common)             */}
        {/* ============================================================ */}
        {activeSection === "tasks" && (
          <TaskPanel
            agendaId={activeAgenda.id}
            agendaName={activeAgenda.title}
            prefillTitle={taskPrefill}
          />
        )}

        {/* Back-to-discussion shortcut when in a sub-section */}
        {activeSection !== "discussion" && (
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              className="co-ghost-btn"
              style={{ fontSize: 11, padding: "6px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}
              onClick={() => setActiveSection("discussion")}
            >
              <FaChevronLeft style={{ fontSize: 10 }} /> Back to Discussion
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// --- Phase sub-components ----------------------------------------------------
function PrePhaseContent({ agendaItem, agendaWork, onChange, onViewDoc }) {
  const docs = agendaItem.documents || agendaItem.docs || agendaItem.files || [];
  return (
    <div style={{ display:"grid", gap:16 }}>
      {agendaItem.description && (
        <div>
          <div style={{ color:"#4e568e", fontSize:10, letterSpacing:"0.16em", fontWeight:700, marginBottom:8 }}>AGENDA DESCRIPTION</div>
          <div style={{ padding:"12px 14px", borderRadius:10, background:"rgba(122,131,184,0.06)", border:"1px solid rgba(122,131,184,0.14)", color:"#8b93c8", fontSize:13, lineHeight:1.7 }}>
            {agendaItem.description}
          </div>
        </div>
      )}
      {/* Inline doc list in pre-phase */}
      {docs.length > 0 && (
        <div>
          <div style={{ color:"#4e568e", fontSize:10, letterSpacing:"0.16em", fontWeight:700, marginBottom:8 }}>REFERENCE DOCUMENTS</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {docs.map((doc, i) => {
              const label = doc.name || doc.title || `Document ${i+1}`;
              return (
                <button key={i} onClick={() => onViewDoc(doc)}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 13px", borderRadius:10, background:"rgba(106,170,238,0.06)", border:"1px solid rgba(106,170,238,0.18)", cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(106,170,238,0.40)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(106,170,238,0.18)"}
                >
                  <DocIcon name={label} size={14} />
                  <span style={{ color:"#8bbfe8", fontWeight:600, fontSize:12, flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{label}</span>
                  <FaEye style={{ fontSize:11, color:"#6aaaee", flexShrink:0 }} />
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div>
        <div style={{ color:"#4e568e", fontSize:10, letterSpacing:"0.16em", fontWeight:700, marginBottom:8 }}>PREPARATION NOTES</div>
        <RichTextEditor value={agendaWork.preNote || ""} onChange={onChange}
          placeholder="Add pre-meeting notes, context, reference documents, or objectives" minHeight={120} />
      </div>
      {agendaItem.presenter && (
        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"rgba(122,131,184,0.06)", border:"1px solid rgba(122,131,184,0.12)", borderRadius:10 }}>
          <span style={{ color:"#4e568e", fontSize:10, fontWeight:700, letterSpacing:"0.1em" }}>PRESENTER</span>
          <span style={{ color:"#8b93c8", fontSize:13, fontWeight:600 }}>{agendaItem.presenter}</span>
          {agendaItem.duration && (<><span style={{ color:"#3d4570", fontSize:12 }}>·</span><span style={{ color:"#596197", fontSize:12 }}>{agendaItem.duration} min</span></>)}
        </div>
      )}
    </div>
  );
}

function ConductPhaseContent({ agendaItem, activeWork, updateNote, editMode, editDraft, setEditDraft }) {
  return (
    <div style={{ display:"grid", gap:16 }}>
      <div>
        <div style={{ color:"#D4A853", fontSize:10, letterSpacing:"0.16em", fontWeight:700, marginBottom:8 }}>LIVE DISCUSSION NOTES</div>
        {editMode ? (
          <div style={{ display:"grid", gap:10 }}>
            <textarea className="co-rich-textarea" value={editDraft.description || ""}
              onChange={e => setEditDraft(d => ({ ...d, description: e.target.value }))}
              placeholder="Agenda description" rows={3} style={{ width:"100%", fontSize:14, lineHeight:1.8 }} />
            <RichTextEditor value={activeWork.note} onChange={updateNote}
              placeholder="Capture key points, observations, and questions" minHeight={140} />
          </div>
        ) : (
          <RichTextEditor value={activeWork.note || ""} onChange={updateNote}
            placeholder="Capture key points, observations, and questions from the live discussion" minHeight={140} />
        )}
      </div>
    </div>
  );
}

function PostPhaseContent({ agendaItem, agendaWork, onChange }) {
  return (
    <div style={{ display:"grid", gap:16 }}>
      <div>
        <div style={{ color:"#4db896", fontSize:10, letterSpacing:"0.16em", fontWeight:700, marginBottom:8 }}>POST-MEETING NOTES</div>
        <RichTextEditor value={agendaWork.postNote || ""} onChange={onChange}
          placeholder="Record outcomes, follow-up actions, or anything that came up after the meeting" minHeight={120} />
      </div>
      <div style={{ padding:"12px 14px", borderRadius:10, background:"rgba(77,184,150,0.04)", border:"1px solid rgba(77,184,150,0.12)" }}>
        <div style={{ color:"#4e568e", fontSize:10, letterSpacing:"0.14em", fontWeight:700, marginBottom:6 }}>QUICK CHECKLIST</div>
        {["Decisions recorded","Action items assigned","Follow-up dates confirmed","Resolutions approved"].map(item => (
          <div key={item} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <span style={{ width:14, height:14, border:"1px solid rgba(77,184,150,0.3)", borderRadius:4, display:"inline-block", flexShrink:0 }} />
            <span style={{ color:"#596197", fontSize:12 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
