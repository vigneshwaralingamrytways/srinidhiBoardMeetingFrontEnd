import { useState, useMemo } from "react";
import {
  FaEdit, FaTrash, FaEye, FaCheck,
  FaChevronRight, FaSitemap, FaGlobe, FaPlus,
} from "react-icons/fa";
import { RESOLUTIONS as SEED_RESOLUTIONS, getAgendaTitleById } from "./ConductMeetingData";
import DocZoomViewer from "./DoczoomViewer";


export default function ResolutionPanel({ agendaId, agendaName, onAddTask }) {
  const [items, setItems] = useState(SEED_RESOLUTIONS);
  const [scope, setScope] = useState(agendaId ? "agenda" : "all"); // agenda | common | all
  const [activeId, setActiveId] = useState(null);
  const [mode, setMode] = useState("view"); // view | edit
  const [projectorOpen, setProjectorOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", description: "" });
  const [showAdd, setShowAdd] = useState(false);

  const scopedItems = useMemo(() => {
    if (scope === "agenda") return items.filter((it) => it.agendaId === agendaId);
    if (scope === "common") return items.filter((it) => !it.agendaId);
    return items;
  }, [items, scope, agendaId]);

  const activeItem = items.find((it) => it.id === activeId) || null;

  const selectItem = (item) => {
    setActiveId(item.id);
    setMode("view");
  };

  const startEdit = () => setMode("edit");
  const cancelEdit = () => setMode("view");

  const saveEdit = (updated) => {
    setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
    setMode("view");
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const addResolution = () => {
    if (!draft.title.trim()) return;
    const newItem = {
      id: Date.now(),
      title: draft.title.trim(),
      description: draft.description?.trim() ? `<p>${draft.description.trim()}</p>` : "<p>No description provided.</p>",
      agendaId: scope === "common" ? null : agendaId,
      categoryType: "MCA",
    };
    setItems((prev) => [...prev, newItem]);
    setDraft({ title: "", description: "" });
    setShowAdd(false);
    setActiveId(newItem.id);
  };

  return (
    <div style={S.wrap}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={S.eyebrow}>RESOLUTIONS</div>
          <div style={S.headTitle}>
            {scope === "agenda" && agendaName ? `Linked to "${agendaName}"` : scope === "common" ? "Common Resolutions" : "All Resolutions"}
          </div>
        </div>
        {/* <button style={S.addBtn} onClick={() => { setShowAdd((v) => !v); setActiveId(null); }}>
          <FaPlus style={{ fontSize: 10, marginRight: 6 }} /> Add Resolution
        </button> */}
      </div>

      {/* Scope toggle */}
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
            <div style={S.addBox}>
              <div style={S.addBoxLabel}>
                New resolution {scope === "common" ? "(common)" : agendaName ? `(linked to "${agendaName}")` : ""}
              </div>
              <input
                style={S.input}
                placeholder="Resolution title"
                value={draft.title}
                onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
              />
              <textarea
                style={S.textarea}
                rows={3}
                placeholder="Short description"
                value={draft.description}
                onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
              />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button style={S.ghostBtn} onClick={() => setShowAdd(false)}>Cancel</button>
                <button style={S.goldBtn} onClick={addResolution}>Add</button>
              </div>
            </div>
          )}

          {scopedItems.length === 0 ? (
            <div style={S.emptySm}>No resolutions in this view yet.</div>
          ) : (
            scopedItems.map((item) => {
              const linkedTitle = item.agendaId ? getAgendaTitleById(item.agendaId) : null;
              const isActive = activeId === item.id;
              return (
                <div key={item.id} style={S.row(isActive)} onClick={() => selectItem(item)}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={S.rowTitle}>{item.title}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center" }}>
                      {linkedTitle ? (
                        <span style={S.badge("agenda")}>{linkedTitle}</span>
                      ) : (
                        <span style={S.badge("common")}>Common</span>
                      )}
                      {item.categoryType && <span style={S.catBadge(item.categoryType)}>{item.categoryType}</span>}
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
          {!activeItem ? (
            <div style={S.emptyBig}>
              Select a resolution to view its details
            </div>
          ) : mode === "edit" ? (
            <EditForm
              item={activeItem}
              onSave={saveEdit}
              onCancel={cancelEdit}
            />
          ) : (
            <DetailView
              item={activeItem}
              agendaTitle={
                activeItem.agendaId
                  ? getAgendaTitleById(activeItem.agendaId)
                  : null
              }
              onEdit={startEdit}
              onDelete={() => deleteItem(activeItem.id)}
              onProject={() => setProjectorOpen(true)}
              onAddTask={onAddTask ? () => onAddTask(activeItem) : null}
            />
          )}
        </div>
      </div>

      {projectorOpen && activeItem && (
        <DocZoomViewer
          title={activeItem.title}
          meta={activeItem.agendaId ? getAgendaTitleById(activeItem.agendaId) : "Common resolution"}
          slides={[{ title: activeItem.title, body: activeItem.description }]}
          onClose={() => setProjectorOpen(false)}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------
   Detail (view) panel
------------------------------------------------------------------- */
function DetailView({ item, agendaTitle, onEdit, onDelete, onProject, onAddTask }) {
  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        {agendaTitle ? (
          <span style={S.badgeLg("agenda")}><FaSitemap size={9} style={{ marginRight: 5 }} />{agendaTitle}</span>
        ) : (
          <span style={S.badgeLg("common")}><FaGlobe size={9} style={{ marginRight: 5 }} />Common resolution</span>
        )}
      </div>
      <div style={S.detailTitle}>{item.title}</div>
      <div style={S.detailBody} dangerouslySetInnerHTML={{ __html: item.description }} />
      <div style={S.actionRow}>
        <button style={S.goldBtn} onClick={onProject}><FaEye style={{ marginRight: 6 }} /> View in Projector</button>
        <button style={S.ghostBtn} onClick={onEdit}><FaEdit style={{ marginRight: 6 }} /> Edit</button>
        {onAddTask && (
          <button style={S.ghostBtn} onClick={onAddTask}>+ Linked Task</button>
        )}
        <button style={S.dangerBtn} onClick={onDelete}><FaTrash size={11} /></button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
   Edit panel
------------------------------------------------------------------- */
function EditForm({ item, onSave, onCancel }) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [categoryType, setCategoryType] = useState(item.categoryType || "MCA");

  return (
    <div>
      <div style={S.fieldLabel}>Resolution Title</div>
      <input style={{ ...S.input, marginBottom: 12 }} value={title} onChange={(e) => setTitle(e.target.value)} />

      <div style={S.fieldLabel}>Description (HTML supported)</div>
      <textarea
        style={{ ...S.textarea, minHeight: 140, marginBottom: 12 }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div style={S.fieldLabel}>Category Type</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["MCA", "Not MCA"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryType(cat)}
            style={S.catToggle(categoryType === cat, cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={S.actionRow}>
        <button style={S.goldBtn} onClick={() => onSave({ ...item, title, description, categoryType })}>
          <FaCheck style={{ marginRight: 6 }} /> Save Changes
        </button>
        <button style={S.ghostBtn} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
   Styles
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
  right: { flex: "1 1 340px", minWidth: 0, background: "#080b1d", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 18, minHeight: 220, marginTop: -12 },
  row: (active) => ({
    display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
    border: `1px solid ${active ? "rgba(212,168,83,0.35)" : "rgba(255,255,255,0.05)"}`,
    background: active ? "rgba(212,168,83,0.08)" : "#080b1d", transition: "all 0.15s",
  }),
  rowTitle: { fontSize: 12.5, fontWeight: 600, color: "#e8e6f8", lineHeight: 1.35 },
  badge: (kind) => ({
    fontSize: 9.5, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
    background: kind === "agenda" ? "rgba(212,168,83,0.12)" : "rgba(106,170,238,0.12)",
    color: kind === "agenda" ? "#D4A853" : "#6aaaee",
  }),
  badgeLg: (kind) => ({
    display: "inline-flex", alignItems: "center", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
    background: kind === "agenda" ? "rgba(212,168,83,0.12)" : "rgba(106,170,238,0.12)",
    color: kind === "agenda" ? "#D4A853" : "#6aaaee",
    border: `1px solid ${kind === "agenda" ? "rgba(212,168,83,0.3)" : "rgba(106,170,238,0.3)"}`,
  }),
  catBadge: (cat) => ({
    fontSize: 9, fontWeight: 800, padding: "1px 7px", borderRadius: 999,
    background: cat === "MCA" ? "rgba(80,140,220,0.15)" : "rgba(180,100,220,0.13)",
    color: cat === "MCA" ? "#6aaaee" : "#c47ae8",
  }),
  catToggle: (selected, cat) => ({
    flex: 1, padding: "9px 14px", borderRadius: 10, cursor: "pointer", fontWeight: 800, fontSize: 12,
    border: selected ? `1px solid ${cat === "MCA" ? "rgba(80,140,220,0.55)" : "rgba(180,100,220,0.5)"}` : "1px solid rgba(255,255,255,0.08)",
    background: selected ? (cat === "MCA" ? "rgba(80,140,220,0.15)" : "rgba(180,100,220,0.12)") : "#090c20",
    color: selected ? (cat === "MCA" ? "#6aaaee" : "#c47ae8") : "#596197",
  }),
  emptySm: { fontSize: 11.5, color: "#3d4570", fontStyle: "italic", padding: "16px 6px", textAlign: "center" },
  emptyBig: { fontSize: 13, color: "#3d4570", textAlign: "center", padding: "60px 10px" },
  detailTitle: { fontSize: 17, fontWeight: 800, color: "#f4f0ff", marginBottom: 12, lineHeight: 1.35 },
  detailBody: { fontSize: 13, lineHeight: 1.8, color: "#8b93c8" },
  actionRow: { display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" },
  goldBtn: { display: "inline-flex", alignItems: "center", padding: "9px 16px", borderRadius: 10, border: "none", background: "#D4A853", color: "#1a1300", fontWeight: 800, fontSize: 12, cursor: "pointer" },
  ghostBtn: { display: "inline-flex", alignItems: "center", padding: "9px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "#8b93c8", fontWeight: 700, fontSize: 12, cursor: "pointer" },
  dangerBtn: { display: "inline-flex", alignItems: "center", padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(220,80,80,0.3)", background: "rgba(220,80,80,0.08)", color: "#e06060", fontWeight: 700, fontSize: 12, cursor: "pointer" },
  fieldLabel: { fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "#4f578f", marginBottom: 7, textTransform: "uppercase" },
  input: { width: "100%", padding: "10px 12px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.10)", background: "#090c20", color: "#f4f0ff", fontSize: 13, outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "10px 12px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.10)", background: "#090c20", color: "#f4f0ff", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 10 },
  addBox: { border: "1px solid rgba(212,168,83,0.2)", background: "rgba(212,168,83,0.04)", borderRadius: 12, padding: 12, marginBottom: 6 },
  addBoxLabel: { fontSize: 10.5, fontWeight: 700, color: "#D4A853", marginBottom: 8 },
};
