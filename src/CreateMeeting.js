import React, { useState, useRef, useEffect, useCallback } from "react";
import { DATA } from "./MeetingData";
import "./CreateMeeting.css";
import { MdEmail } from "react-icons/md";
import {
  FaArrowLeft, FaArrowRight, FaCalendar, FaCheck, FaFile,
  FaPlus, FaSlack, FaVideo, FaTimes, FaEye,
  FaBold, FaItalic, FaUnderline,
  FaAlignLeft, FaAlignCenter, FaAlignRight,
  FaListUl, FaListOl,
} from "react-icons/fa";

/* ---------------------------------------------------------------- */
/* Sample PDF docs                                                    */
/* ---------------------------------------------------------------- */
const SAMPLE_DOCS = [
  { id: "doc-1", type: "PDF", title: "Q4 Financial Report",        pages: "12", size: "1.4 MB", url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf" },
  { id: "doc-2", type: "PDF", title: "Board Meeting Minutes  Oct", pages: "8",  size: "0.9 MB", url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF2.pdf" },
  { id: "doc-3", type: "PDF", title: "Strategic Plan 2025",         pages: "20", size: "2.1 MB", url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF6.pdf" },
  { id: "doc-4", type: "PDF", title: "Risk Assessment Summary",     pages: "5",  size: "0.6 MB", url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF9.pdf" },
];

/* ---------------------------------------------------------------- */
/* Toast notification                                                 */
/* ---------------------------------------------------------------- */
function Toast({ toasts }) {
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 99999,
      display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none",
    }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          display: "flex", alignItems: "center", gap: 10,
          background: t.type === "success" ? "rgba(77,184,150,0.95)" : "rgba(212,168,83,0.95)",
          color: "#06081a", borderRadius: 10, padding: "10px 16px",
          fontSize: 12, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          animation: "toastIn 0.25s ease",
          minWidth: 200, maxWidth: 320,
        }}>
          <FaCheck style={{ flexShrink: 0 }} />
          {t.message}
        </div>
      ))}
      <style>{`@keyframes toastIn { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0);} }`}</style>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2800);
  }, []);
  return { toasts, show };
}

/* ---------------------------------------------------------------- */
/* PDF Popup Viewer                                                   */
/* ---------------------------------------------------------------- */
function DocViewerPopup({ doc, onClose }) {
  if (!doc) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(6,8,26,0.88)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ width: "min(900px, 94vw)", height: "82vh", background: "#0e1022", borderRadius: 12, border: "1px solid rgba(212,168,83,0.25)", display: "flex", flexDirection: "column", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#D4A853", background: "rgba(212,168,83,0.12)", padding: "2px 8px", borderRadius: 4 }}>{doc.type}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{doc.title}</span>
            <span style={{ fontSize: 11, color: "#596197" }}>{doc.pages} pages · {doc.size}</span>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, color: "inherit", cursor: "pointer", width: 28, height: 28, display: "grid", placeItems: "center", fontSize: 13 }}>
            <FaTimes />
          </button>
        </div>
        <iframe src={doc.url} title={doc.title} style={{ flex: 1, border: "none", width: "100%", background: "#fff" }} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Rich Text Editor                                                   */
/* ---------------------------------------------------------------- */
function RichTextEditor({ value, onChange, placeholder = "Type here..." }) {
  const editorRef = useRef(null);
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, []);
  const handleCommand = (cmd) => { document.execCommand(cmd, false, null); editorRef.current.focus(); };
  return (
    <div className="cm-rich-wrap">
      <div className="cm-rich-toolbar">
        {[["bold",<FaBold/>],["italic",<FaItalic/>],["underline",<FaUnderline/>]].map(([cmd,icon]) => (
          <button key={cmd} type="button" className="cm-rich-btn" onMouseDown={(e)=>e.preventDefault()} onClick={()=>handleCommand(cmd)}>{icon}</button>
        ))}
        <div className="cm-rich-divider"/>
        {[["justifyLeft",<FaAlignLeft/>],["justifyCenter",<FaAlignCenter/>],["justifyRight",<FaAlignRight/>]].map(([cmd,icon]) => (
          <button key={cmd} type="button" className="cm-rich-btn" onMouseDown={(e)=>e.preventDefault()} onClick={()=>handleCommand(cmd)}>{icon}</button>
        ))}
        <div className="cm-rich-divider"/>
        <button type="button" className="cm-rich-btn" onMouseDown={(e)=>e.preventDefault()} onClick={()=>handleCommand("insertUnorderedList")}><FaListUl/></button>
        <button type="button" className="cm-rich-btn" onMouseDown={(e)=>e.preventDefault()} onClick={()=>handleCommand("insertOrderedList")}><FaListOl/></button>
      </div>
      <div ref={editorRef} className="cm-rich-editor" contentEditable suppressContentEditableWarning data-placeholder={placeholder} onInput={()=>onChange(editorRef.current.innerHTML)} spellCheck={false} style={{minHeight:56,maxHeight:90,overflowY:"auto"}}/>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* STEP 1  DETAILS                                                   */
/* ---------------------------------------------------------------- */
function StepDetails({ data, onChange }) {
  return (
    <>
      <div className="cm-row-2">
        <div className="cm-field">
          <label className="cm-label">Meeting Title</label>
          <input className="cm-input" placeholder="e.g. Q4 Board Review" value={data.title} onChange={(e)=>onChange("title",e.target.value)}/>
        </div>
        <div className="cm-field">
          <label className="cm-label">Meeting Type</label>
          <select className="cm-select" value={data.type} onChange={(e)=>onChange("type",e.target.value)}>
            {DATA.meetingTypes.map((t)=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="cm-row-2">
        <div className="cm-field">
          <label className="cm-label">Meeting Mode</label>
          <select className="cm-select" value={data.mode} onChange={(e)=>onChange("mode",e.target.value)}>
            <option value="Physical">Physical</option>
            <option value="Online">Online</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div className="cm-field">
          <label className="cm-label">{data.mode==="Online"?"Meeting Link / Platform":data.mode==="Hybrid"?"Venue & Link":"Location"}</label>
          <input className="cm-input" placeholder={data.mode==="Online"?"Zoom / Teams / Meet link":data.mode==="Hybrid"?"Room + Link":"Conference Room A"} value={data.location} onChange={(e)=>onChange("location",e.target.value)}/>
        </div>
      </div>
      <div className="cm-field">
        <label className="cm-label">Date & Time</label>
        <div style={{display:"flex",gap:8}}>
          <input className="cm-input" type="date" value={data.date} onChange={(e)=>onChange("date",e.target.value)} style={{flex:1}}/>
          <input className="cm-input" type="time" value={data.time} onChange={(e)=>onChange("time",e.target.value)} style={{flex:1}}/>
        </div>
      </div>
      <div className="cm-field">
        <label className="cm-label">Description</label>
        <RichTextEditor value={data.description} onChange={(v)=>onChange("description",v)} placeholder="Briefly describe the purpose and objectives..."/>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- */
/* STEP 2  AGENDA                                                    */
/* ---------------------------------------------------------------- */
function StepAgenda({ items, setItems, onLinkNavigate, showToast }) {
  const [draft, setDraft] = useState({ title:"", shortDesc:"", description:"", duration:"15", type:"Discussion", presenter:"" });

  const add = () => {
    if (!draft.title.trim()) return;
    setItems((prev) => [...prev, { id: Date.now(), ...draft }]);
    setDraft({ title:"", shortDesc:"", description:"", duration:"15", type:"Discussion", presenter:"" });
    showToast("Agenda item added");
  };

  return (
    <>
      <div className="cm-card-title" style={{fontSize:13,marginBottom:2}}>Meeting Agenda</div>
      <div className="cm-card-desc" style={{fontSize:11,marginBottom:10}}>Structure your meeting with timed agenda items</div>
      <div style={{display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap",height:"100%"}}>
        {/* LEFT */}
        <div style={{flex:"1 1 300px",minWidth:0,display:"flex",flexDirection:"column"}}>
          <div className="cm-add-title" style={{marginBottom:6}}>Agenda Items</div>
          <div className="cm-agenda-list" style={{flex:1,maxHeight:360,overflowY:"auto",scrollbarWidth:"thin",scrollbarColor:"rgba(212,168,83,0.2) transparent"}}>
            {items.length===0 && <div className="cm-card-desc" style={{fontSize:11,padding:"8px 2px"}}>No agenda items yet.</div>}
            {items.map((item,index)=>(
              <div key={item.id} className="cm-agenda-row" style={{flexDirection:"column",alignItems:"stretch",gap:6}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:8,width:"100%"}}>
                  <div className="cm-agenda-num">{index+1}</div>
                  <div className="cm-agenda-body" style={{flex:1}}>
                    <div className="cm-agenda-title">{item.title}</div>
                    {item.shortDesc && <div style={{fontSize:11,fontWeight:500,color:"#8b92c4",marginTop:2}}>{item.shortDesc}</div>}
                    {item.description && <div className="cm-agenda-desc" dangerouslySetInnerHTML={{__html:item.description}}/>}
                    <div className="cm-agenda-meta">{item.type}{item.presenter?` · ${item.presenter}`:""}</div>
                  </div>
                  <div className="cm-agenda-dur">{item.duration}m</div>
                  <button className="cm-agenda-rm" onClick={()=>setItems((prev)=>prev.filter((x)=>x.id!==item.id))}>×</button>
                </div>
                <div style={{display:"flex",gap:6,paddingLeft:28}}>
                  <button type="button" className="cm-inline-add" style={{fontSize:10,padding:"4px 10px"}} onClick={()=>onLinkNavigate(item,"resolutions")}>Resolutions</button>
                  <button type="button" className="cm-inline-add" style={{fontSize:10,padding:"4px 10px"}} onClick={()=>onLinkNavigate(item,"boardpack")}>Board Pack</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* RIGHT */}
        <div style={{flex:"1 1 300px",minWidth:0}}>
          <div className="cm-add-box">
            <div className="cm-add-title">Add Agenda Item</div>
            <div className="cm-add-row">
              <input className="cm-input" placeholder="Agenda title" value={draft.title} onChange={(e)=>setDraft((p)=>({...p,title:e.target.value}))}/>
              <input className="cm-input cm-add-small" type="number" placeholder="Min" value={draft.duration} onChange={(e)=>setDraft((p)=>({...p,duration:e.target.value}))}/>
            </div>
            <div className="cm-field">
              <input className="cm-input" placeholder="Short description (summary)" value={draft.shortDesc} onChange={(e)=>setDraft((p)=>({...p,shortDesc:e.target.value}))}/>
            </div>
            <div className="cm-field">
              <RichTextEditor value={draft.description} onChange={(v)=>setDraft((p)=>({...p,description:v}))} placeholder="Detailed description..."/>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end"}}>
              <button className="cm-inline-add" onClick={add}>Add</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- */
/* STEP 3  RESOLUTIONS                                               */
/* Left: scrollable list (fixed height, no page scroll)              */
/* Right: add form with Agenda Item selector at top                  */
/* ---------------------------------------------------------------- */
function StepResolutions({ items, setItems, agendaItems, activeAgendaId, onClearLink, showToast }) {
  const [draft, setDraft] = useState({ title:"", description:"", agendaId: activeAgendaId ? String(activeAgendaId) : "" });

  useEffect(() => {
    if (activeAgendaId) setDraft((p) => ({ ...p, agendaId: String(activeAgendaId) }));
  }, [activeAgendaId]);

  const add = () => {
    if (!draft.title.trim()) return;
    setItems((prev) => [...prev, { id: Date.now(), title: draft.title, description: draft.description, agendaId: draft.agendaId || null }]);
    setDraft((p) => ({ ...p, title: "", description: "" }));
    showToast("Resolution added");
  };

  const renderRow = (item, index) => (
    <div key={item.id} className="cm-agenda-row">
      <div className="cm-agenda-num">{index + 1}</div>
      <div className="cm-agenda-body">
        <div className="cm-agenda-title">{item.title}</div>
        {item.description && <div className="cm-agenda-desc" dangerouslySetInnerHTML={{ __html: item.description }} />}
      </div>
      <button className="cm-agenda-rm" onClick={() => setItems((prev) => prev.filter((x) => x.id !== item.id))}>×</button>
    </div>
  );

  const allLinkedGroups = agendaItems.map((a) => ({
    agenda: a,
    resolutions: items.filter((it) => String(it.agendaId) === String(a.id)),
  })).filter((g) => g.resolutions.length > 0);

  const commonItems = items.filter((it) => !it.agendaId);

  return (
    <>
      <div className="cm-card-title" style={{ fontSize: 13, marginBottom: 2 }}>Resolutions</div>
      <div className="cm-card-desc" style={{ fontSize: 11, marginBottom: 10 }}>Add formal resolutions to be voted on or recorded</div>

      <div style={{ display: "flex", gap: 16, alignItems: "stretch", flexWrap: "wrap" }}>
        {/* LEFT  fixed height scrollable list, no overflow to page */}
        <div style={{ flex: "1 1 300px", minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflowY: "auto", maxHeight: 420, scrollbarWidth: "thin", scrollbarColor: "rgba(212,168,83,0.2) transparent" }}>
            {allLinkedGroups.map(({ agenda, resolutions }) => (
              <div key={agenda.id} style={{ marginBottom: 10 }}>
                <div className="cm-add-title" style={{ marginBottom: 4, fontSize: 11 }}>?? {agenda.title}</div>
                <div className="cm-agenda-list">
                  {resolutions.map(renderRow)}
                </div>
              </div>
            ))}
            <div className="cm-add-title" style={{ marginBottom: 4 }}>Common Resolutions</div>
            <div className="cm-agenda-list">
              {commonItems.length ? commonItems.map(renderRow) : (
                <div className="cm-card-desc" style={{ fontSize: 11, padding: "6px 2px" }}>No common resolutions yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT  add form */}
        <div style={{ flex: "1 1 300px", minWidth: 0 }}>
          <div className="cm-add-box">
            <div className="cm-add-title">Add Resolution</div>
            <div className="cm-field">
              <label className="cm-label">Agenda Item</label>
              <select className="cm-select" value={draft.agendaId} onChange={(e) => { setDraft((p) => ({ ...p, agendaId: e.target.value })); if (activeAgendaId) onClearLink(); }}>
                <option value=""> Common Resolution </option>
                {agendaItems.map((a) => <option key={a.id} value={String(a.id)}>{a.title}</option>)}
              </select>
            </div>
            <div className="cm-field">
              <input className="cm-input" placeholder="Resolution title" value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="cm-field">
              <RichTextEditor value={draft.description} onChange={(v) => setDraft((p) => ({ ...p, description: v }))} placeholder="Resolution description" />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="cm-inline-add" onClick={add}>Add</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- */
/* STEP 5  BOARD PACK                                                */
/* Agenda filter ? Left: doc list + view popup; Right: upload panel  */
/* ---------------------------------------------------------------- */
function StepBoardPack({ selected, setSelected, linkedBoardPack, setLinkedBoardPack, agendaItems, activeAgendaId, onClearLink, showToast }) {
  const [filterAgendaId, setFilterAgendaId] = useState(activeAgendaId ? String(activeAgendaId) : "");
  const [viewDoc, setViewDoc] = useState(null);
  const fileInputRef = useRef(null);

  const effectiveAgendaId = activeAgendaId ? String(activeAgendaId) : filterAgendaId || null;
  const linkedAgenda = agendaItems.find((a) => String(a.id) === effectiveAgendaId) || null;
  const currentSelected = linkedAgenda ? (linkedBoardPack[linkedAgenda.id] || []) : selected;

  const handleSetSelected = (updater) => {
    if (linkedAgenda) {
      setLinkedBoardPack((prev) => {
        const prevList = prev[linkedAgenda.id] || [];
        const nextList = typeof updater === "function" ? updater(prevList) : updater;
        return { ...prev, [linkedAgenda.id]: nextList };
      });
    } else {
      setSelected(updater);
    }
  };

  const toggle = (doc) => {
    handleSetSelected((prev = []) => {
      const exists = prev.some((x) => x.id === doc.id);
      return exists ? prev.filter((x) => x.id !== doc.id) : [...prev, doc];
    });
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const uploaded = files.map((file, i) => ({
      id: `upload-${Date.now()}-${i}`,
      type: file.name.split(".").pop()?.toUpperCase() || "FILE",
      title: file.name,
      pages: "-",
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploaded: true,
      file,
      url: URL.createObjectURL(file),
    }));
    handleSetSelected((prev = []) => [...prev, ...uploaded]);
    e.target.value = "";
    showToast(`${files.length} file${files.length > 1 ? "s" : ""} uploaded`);
  };

  const uploadedDocs = selected.filter((x) => x?.uploaded);
  const allDocs = [...SAMPLE_DOCS, ...uploadedDocs];

  return (
    <>
      <DocViewerPopup doc={viewDoc} onClose={() => setViewDoc(null)} />

      <div className="cm-card-title" style={{ fontSize: 13, marginBottom: 2 }}>Board Pack</div>
      <div className="cm-card-desc" style={{ fontSize: 11, marginBottom: 10 }}>Select and attach meeting documents</div>

      {/* Agenda type filter  above the two-column layout */}
      <div className="cm-field" style={{ marginBottom: 12 }}>
        <label className="cm-label">Agenda Item</label>
        <select className="cm-select" value={activeAgendaId ? String(activeAgendaId) : filterAgendaId} onChange={(e) => { setFilterAgendaId(e.target.value); if (activeAgendaId) onClearLink(); }}>
          <option value=""> All / General </option>
          {agendaItems.map((a) => <option key={a.id} value={String(a.id)}>{a.title}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "stretch", flexWrap: "wrap" }}>
        {/* LEFT  document list, fixed scrollable */}
        <div style={{ flex: "1 1 300px", minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div className="cm-add-title" style={{ marginBottom: 6 }}>Documents</div>
          <div style={{ flex: 1, overflowY: "auto", maxHeight: 360, display: "flex", flexDirection: "column", gap: 6, scrollbarWidth: "thin", scrollbarColor: "rgba(212,168,83,0.2) transparent" }}>
            {allDocs.map((doc) => {
              const isSelected = currentSelected.some((x) => x.id === doc.id);
              return (
                <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, cursor: "pointer", transition: "all 0.15s", border: isSelected ? "1px solid rgba(212,168,83,0.5)" : "1px solid rgba(255,255,255,0.07)", background: isSelected ? "rgba(212,168,83,0.08)" : "rgba(255,255,255,0.03)" }} onClick={() => toggle(doc)}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, border: isSelected ? "2px solid #D4A853" : "2px solid rgba(255,255,255,0.18)", background: isSelected ? "#D4A853" : "rgba(255,255,255,0.04)", display: "grid", placeItems: "center", transition: "all 0.15s" }}>
                    {isSelected && <FaCheck style={{ color: "#06081a", fontSize: 9 }} />}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: "#D4A853", background: "rgba(212,168,83,0.12)", padding: "2px 6px", borderRadius: 4, flexShrink: 0 }}>{doc.type}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.title}</div>
                    <div style={{ fontSize: 10, color: "#596197", marginTop: 2 }}>{doc.pages} pages · {doc.size}</div>
                  </div>
                  <button type="button" title="View document" onClick={(e) => { e.stopPropagation(); setViewDoc(doc); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, flexShrink: 0, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "#8b92c4", fontSize: 12, cursor: "pointer" }}>
                    <FaEye />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT  upload + selected summary */}
        <div style={{ flex: "0 1 220px", minWidth: 180 }}>
          <div className="cm-add-box" style={{ gap: 12 }}>
            <div className="cm-add-title">Upload Document</div>
            <div className="cm-card-desc" style={{ fontSize: 11 }}>Add your own files to the board pack</div>
            <button className="cm-btn-ghost" type="button" style={{ width: "100%", padding: "10px 0" }} onClick={() => fileInputRef.current?.click()}>+ Upload File</button>
            <input ref={fileInputRef} type="file" multiple style={{ display: "none" }} onChange={handleUpload} />
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10, marginTop: 4 }}>
              <div style={{ fontSize: 11, color: "#596197", marginBottom: 6 }}>Selected Documents</div>
              <div style={{ maxHeight: 180, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "rgba(212,168,83,0.2) transparent" }}>
                {currentSelected.length === 0
                  ? <div style={{ fontSize: 11, color: "#3D4165" }}>None selected</div>
                  : currentSelected.map((d) => (
                    <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <FaFile style={{ fontSize: 10, color: "#D4A853", flexShrink: 0 }} />
                      <span style={{ fontSize: 11, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.title}</span>
                      <button type="button" onClick={() => handleSetSelected((prev) => prev.filter((x) => x.id !== d.id))} style={{ background: "none", border: "none", color: "#596197", cursor: "pointer", fontSize: 11, flexShrink: 0 }}>×</button>
                    </div>
                  ))}
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#3D4165", textAlign: "center" }}>{currentSelected.length} doc{currentSelected.length !== 1 ? "s" : ""} attached</div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- */
/* STEP 4  PARTICIPANTS                                              */
/* ---------------------------------------------------------------- */
function StepParticipants({ participants, setParticipants, contacts, setContacts, showToast }) {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newParticipant, setNewParticipant] = useState({ name: "", email: "", role: "member" });

  const getInitials = (name) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "NA";
    return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("");
  };

  const addParticipant = () => {
    if (!newParticipant.name.trim() || !newParticipant.email.trim()) return;
    const colors = ["#4A9ED4", "#7A6FDA", "#4DB896", "#D4744A", "#D4A853"];
    const person = { id: Date.now(), name: newParticipant.name.trim(), email: newParticipant.email.trim(), role: newParticipant.role, initials: getInitials(newParticipant.name), color: colors[contacts.length % colors.length] };
    setContacts((prev) => [person, ...prev]);
    setParticipants((prev) => prev.find((x) => x.email === person.email) ? prev : [person, ...prev]);
    setNewParticipant({ name: "", email: "", role: "member" });
    setSearch("");
    setShowAdd(false);
    showToast("Participant added");
  };

  const toggle = (person) => setParticipants((prev) => prev.find((x) => x.id === person.id) ? prev.filter((x) => x.id !== person.id) : [...prev, person]);

  return (
    <>
      <div className="cm-card-title">Participants</div>
      <div className="cm-card-desc">Add attendees and assign their roles</div>
      <div className="cm-field">
        <label className="cm-label">Search Contacts</label>
        <div className="cm-participant-search">
          <input className="cm-input" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="cm-add-person-btn" type="button" onClick={() => setShowAdd(true)}><span>+</span> Add Participant</button>
        </div>
      </div>
      <div className="cm-participant-container" style={{ maxHeight: 280, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "rgba(212,168,83,0.2) transparent" }}>
        {contacts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())).map((person) => {
          const sel = participants.find((x) => x.id === person.id);
          return (
            <div key={person.id} className="cm-participant" style={{ opacity: sel ? 1 : 0.6 }} onClick={() => toggle(person)}>
              <div className="cm-av" style={{ background: person.color }}>{person.initials}</div>
              <div className="cm-p-info"><div className="cm-p-name">{person.name}</div><div className="cm-p-email">{person.email}</div></div>
              <span className={`cm-p-role role-${person.role}`}>{person.role}</span>
              <div className="cm-check" style={{ border: `2px solid ${sel ? "#D4A853" : "rgba(212,168,83,0.15)"}`, background: sel ? "rgba(212,168,83,0.15)" : "transparent" }}>
                {sel ? <FaCheck /> : <FaPlus />}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 12, color: "#3D4165", textAlign: "center" }}>{participants.length} participant{participants.length !== 1 ? "s" : ""} selected</div>

      {showAdd && (
        <div className="cm-modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cm-modal-head">
              <div><div className="cm-modal-title">Add New Participant</div><div className="cm-modal-sub">Enter participant details</div></div>
              <button className="cm-modal-close" type="button" onClick={() => setShowAdd(false)}>x</button>
            </div>
            <div className="cm-field"><label className="cm-label">Full Name</label><input className="cm-input" placeholder="e.g. Anita Rao" value={newParticipant.name} onChange={(e) => setNewParticipant((p) => ({ ...p, name: e.target.value }))} /></div>
            <div className="cm-field"><label className="cm-label">Email</label><input className="cm-input" type="email" placeholder="name@company.com" value={newParticipant.email} onChange={(e) => setNewParticipant((p) => ({ ...p, email: e.target.value }))} /></div>
            <div className="cm-field">
              <label className="cm-label">Role</label>
              <select className="cm-select" value={newParticipant.role} onChange={(e) => setNewParticipant((p) => ({ ...p, role: e.target.value }))}>
                <option value="member">Member</option><option value="observer">Observer</option><option value="host">Host</option>
              </select>
            </div>
            <div className="cm-modal-preview">
              <div className="cm-av" style={{ background: "#D4A853" }}>{getInitials(newParticipant.name)}</div>
              <div className="cm-p-info"><div className="cm-p-name">{newParticipant.name || "Participant Name"}</div><div className="cm-p-email">{newParticipant.email || "participant@company.com"}</div></div>
              <span className={`cm-p-role role-${newParticipant.role}`}>{newParticipant.role}</span>
            </div>
            <div className="cm-modal-actions">
              <button className="cm-btn-back" type="button" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="cm-btn-next" type="button" onClick={addParticipant}>Add Participant</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------------------------------------------------------- */
/* STEP 6  INVITE                                                    */
/* ---------------------------------------------------------------- */
function StepInvite({ meetingData, participants, boardPack, channels, setChannels, meetingLink, setMeetingLink }) {
  const allChannels = [
    { id: "email",    label: "Email",    icon: <MdEmail /> },
    { id: "calendar", label: "Calendar", icon: <FaCalendar /> },
    { id: "slack",    label: "Slack",    icon: <FaSlack /> },
  ];
  const sampleLinks = [
    { id: "meet",  label: "Google Meet",     url: "https://meet.google.com/abc-defg-hij" },
    { id: "teams", label: "Microsoft Teams", url: "https://teams.microsoft.com/l/meetup-join/sample" },
  ];
  const toggle = (ch) => setChannels((prev) => prev.includes(ch) ? prev.filter((x) => x !== ch) : [...prev, ch]);
  const meetingTitle  = meetingData.title || "Board Meeting";
  const safeMeetingLink = meetingLink || "https://meet.google.com/abc-defg-hij";
  const participantEmails = participants.map((p) => p.email).join(",");
  const inviteBody = [`You are invited to ${meetingTitle}.`, `Mode: ${meetingData.mode||"Physical"}`, `Date: ${meetingData.date||"TBD"}  Time: ${meetingData.time||"TBD"}`, `Location: ${meetingData.location||"TBD"}`, `Link: ${safeMeetingLink}`].join("\n");
  const calStart = `${(meetingData.date||"2024-11-15").replaceAll("-","")}T${(meetingData.time||"09:00").replace(":","") }00`;
  const calEnd   = `${(meetingData.date||"2024-11-15").replaceAll("-","")}T${(meetingData.time||"10:00").replace(":","") }00`;
  const channelUrls = {
    email:    `mailto:${participantEmails}?subject=${encodeURIComponent(meetingTitle)}&body=${encodeURIComponent(inviteBody)}`,
    calendar: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(meetingTitle)}&dates=${calStart}/${calEnd}&details=${encodeURIComponent(inviteBody)}&location=${encodeURIComponent(meetingData.location||safeMeetingLink)}&add=${encodeURIComponent(participantEmails)}`,
    slack:    `https://slack.com/share?text=${encodeURIComponent(`${meetingTitle}\n${inviteBody}`)}`,
  };
  return (
    <>
      <div className="cm-card-title" style={{ fontSize: 13, marginBottom: 2 }}>Send Invitations</div>
      <div className="cm-card-desc" style={{ fontSize: 11, marginBottom: 10 }}>Review and dispatch invitations to all participants</div>
      <div className="cm-invite-box">
        <div className="cm-invite-top">
          <div className="cm-invite-ic"><FaFile /></div>
          <div>
            <div className="cm-invite-meeting">{meetingData.title || "Untitled Meeting"}</div>
            <div className="cm-invite-when">{meetingData.date||"TBD"} · {meetingData.time||"TBD"} · {meetingData.location||"Location TBD"}</div>
          </div>
        </div>
        <div className="cm-chips">
          <span className="cm-chip">{meetingData.type}</span>
          <span className="cm-chip">{meetingData.mode}</span>
          <span className="cm-chip">{participants.length} Participants</span>
          <span className="cm-chip">{boardPack.length} Docs</span>
        </div>
      </div>
      <div className="cm-field">
        <label className="cm-label">Meeting Link</label>
        <div className="cm-link-row">
          <input className="cm-input" placeholder="Paste Google Meet, Teams, or Zoom link" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} />
          <a className="cm-join-link" href={meetingLink||"#"} target="_blank" rel="noreferrer" onClick={(e) => !meetingLink && e.preventDefault()}>Join</a>
        </div>
        <div className="cm-sample-links">
          {sampleLinks.map((link) => <button key={link.id} type="button" className={`cm-sample-link ${meetingLink===link.url?"sl-active":""}`} onClick={()=>setMeetingLink(link.url)}>{link.label}</button>)}
        </div>
      </div>
      <div className="cm-label">Send via</div>
      <div className="cm-channel-grid">
        {allChannels.map((ch) => (
          <button key={ch.id} type="button" className={`cm-channel ${channels.includes(ch.id)?"ch-on":""}`} onClick={()=>{ toggle(ch.id); window.open(channelUrls[ch.id],"_blank","noopener,noreferrer"); }}>
            <div className="cm-channel-icon">{ch.icon}</div>
            <div className="cm-channel-lbl">{ch.label}</div>
          </button>
        ))}
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- */
/* ROOT                                                               */
/* ---------------------------------------------------------------- */
export default function CreateMeeting({ editMeeting = null, onEditSave = null }) {
  const isEditMode = !!editMeeting;
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const { toasts, show: showToast } = useToast();

  const [meetingData, setMeetingData] = useState(
    isEditMode
      ? { title: editMeeting.title||"", type: editMeeting.type||"Board Meeting", mode: editMeeting.mode||"Physical", location: editMeeting.location||"", date: editMeeting.date||"", time: editMeeting.time||"", description: editMeeting.description||"" }
      : { title: "Q4 Board Review", type: "Board Meeting", mode: "Physical", location: "Conference Room A", date: "2024-11-15", time: "09:00", description: "" }
  );

  const [agendaItems,         setAgendaItems]         = useState([...DATA.agendaItems]);
  const [resolutionItems,     setResolutionItems]     = useState([...DATA.resolutions]);
  const [participantDirectory,setParticipantDirectory]= useState(isEditMode && editMeeting.participants ? editMeeting.participants : DATA.participants);
  const [participants,        setParticipants]        = useState(isEditMode && editMeeting.participants ? editMeeting.participants : DATA.participants.slice(0,3));
  const [boardPack,           setBoardPack]           = useState(isEditMode && editMeeting.docs ? editMeeting.docs : SAMPLE_DOCS.slice(0,2));
  const [channels,            setChannels]            = useState(["email","calendar"]);
  const [meetingLink,         setMeetingLink]         = useState("https://meet.google.com/abc-defg-hij");
  const [activeAgendaId,      setActiveAgendaId]      = useState(null);
  const [linkedBoardPack,     setLinkedBoardPack]     = useState({});

  const steps = ["Details","Agenda","Resolutions","Participants","Board Pack","Invite"];
  const updateMeeting = (key, value) => setMeetingData((prev) => ({ ...prev, [key]: value }));

  const handleLinkNavigate = (agendaItem, target) => {
    setActiveAgendaId(agendaItem.id);
    setStep(target === "resolutions" ? 2 : 4);
  };
  const handleClearLink = () => setActiveAgendaId(null);

  if (done) {
    return (
      <div className="cm-wrap" style={{ width:"100%", maxWidth:"100%", padding:"0 24px", boxSizing:"border-box" }}>
        <Toast toasts={toasts} />
        <div className="cm-inner" style={{ width:"100%", maxWidth:"100%" }}>
          <div className="cm-card cm-success">
            <div className="cm-success-ring"><FaVideo /></div>
            <div className="cm-success-title">{isEditMode ? "Meeting Updated!" : "Meeting Created!"}</div>
            <div className="cm-success-sub">{isEditMode ? `Changes saved for "${meetingData.title}".` : `Invitations sent to ${participants.length} participants with ${boardPack.length} board pack files.`}</div>
            {isEditMode
              ? <button className="cm-btn-next" style={{ margin:"28px auto 0", justifyContent:"center" }} onClick={() => onEditSave && onEditSave({ ...meetingData, participants, docs: boardPack })}>Back to Meetings</button>
              : <button className="cm-btn-next" style={{ margin:"28px auto 0", justifyContent:"center" }} onClick={() => { setStep(0); setDone(false); }}>Create Another</button>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cm-wrap" style={{ width:"100%", maxWidth:"100%", height:"100%", display:"flex", flexDirection:"column",   boxSizing:"border-box", overflow:"hidden" }}>
      <Toast toasts={toasts} />
      <div className="cm-inner" style={{ width:"100%", maxWidth:"100%", display:"flex", flexDirection:"column", flex:1, minHeight:0 }}>

        {/* Clickable stepper */}
        <div className="cm-stepper" style={{ gap:0, marginBottom:8, padding:"8px 0 4px" }}>
          {steps.map((stepName, index) => (
            <div key={stepName} className={`cm-step ${index < step ? "cs-done" : index === step ? "cs-active" : ""}`} style={{ gap:4, cursor:"pointer" }} onClick={() => setStep(index)} title={stepName}>
              <div className="cm-step-name" style={{ fontSize:9, whiteSpace:"nowrap" }}>{stepName}</div>
              <div className={`cm-step-bar ${index < step ? "sb-done" : ""}`} />
            </div>
          ))}
        </div>

        <div className="cm-wrap" style={{ flex:1, overflowY:"auto", padding:"14px 18px", margin:0, minHeight:0, scrollbarWidth:"thin", scrollbarColor:"rgba(212,168,83,0.2) transparent" }}>
          {step === 0 && <StepDetails data={meetingData} onChange={updateMeeting} />}
          {step === 1 && <StepAgenda items={agendaItems} setItems={setAgendaItems} onLinkNavigate={handleLinkNavigate} showToast={showToast} />}
          {step === 2 && <StepResolutions items={resolutionItems} setItems={setResolutionItems} agendaItems={agendaItems} activeAgendaId={activeAgendaId} onClearLink={handleClearLink} showToast={showToast} />}
          {step === 3 && <StepParticipants participants={participants} setParticipants={setParticipants} contacts={participantDirectory} setContacts={setParticipantDirectory} showToast={showToast} />}
          {step === 4 && <StepBoardPack selected={boardPack} setSelected={setBoardPack} linkedBoardPack={linkedBoardPack} setLinkedBoardPack={setLinkedBoardPack} agendaItems={agendaItems} activeAgendaId={activeAgendaId} onClearLink={handleClearLink} showToast={showToast} />}
          {step === 5 && <StepInvite meetingData={meetingData} participants={participants} boardPack={boardPack} channels={channels} setChannels={setChannels} meetingLink={meetingLink} setMeetingLink={setMeetingLink} />}
        </div>

        <div className="cm-footer" style={{ padding:"8px 0 4px", flexShrink:0 }}>
          {step > 0 ? <button className="cm-btn-back" onClick={() => setStep((s) => s - 1)}><FaArrowLeft /> Back</button> : <span />}
          {step < steps.length - 1
            ? <button className="cm-btn-next" onClick={() => setStep((s) => s + 1)}>Continue <FaArrowRight /></button>
            : isEditMode
              ? <button className="cm-btn-next" onClick={() => setDone(true)}>Save Changes <FaCheck /></button>
              : <button className="cm-btn-next" onClick={() => setDone(true)}><MdEmail /> Send Invitations</button>}
        </div>
      </div>
    </div>
  );
}
