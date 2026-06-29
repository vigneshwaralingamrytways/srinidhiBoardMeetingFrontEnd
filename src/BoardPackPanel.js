import { useState, useMemo } from "react";
import {
  FaEye, FaTable, FaThLarge,
  FaSitemap, FaGlobe, FaFile, FaFilePdf, FaFileImage, FaFileWord, FaFileExcel,
  FaChevronRight, FaDownload,
} from "react-icons/fa";
import { BOARD_PACK as SEED_BOARD_PACK, getAgendaTitleById } from "./ConductMeetingData";
import DocZoomViewer from "./DoczoomViewer";


function FileTypeBadge({ type }) {
  const map = {
    PDF: { color: "#e06060", bg: "rgba(220,80,80,0.12)", Icon: FaFilePdf },
    XLS: { color: "#4db896", bg: "rgba(77,184,150,0.12)", Icon: FaFileExcel },
    DOC: { color: "#6aaaee", bg: "rgba(106,170,238,0.12)", Icon: FaFileWord },
    IMG: { color: "#6aaaee", bg: "rgba(106,170,238,0.12)", Icon: FaFileImage },
  };
  const conf = map[type] || { color: "#7a83b8", bg: "rgba(122,131,184,0.12)", Icon: FaFile };
  const { Icon } = conf;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 9.5, fontWeight: 800, padding: "2px 8px", borderRadius: 6, background: conf.bg, color: conf.color }}>
      <Icon size={9} /> {type}
    </span>
  );
}

export default function BoardPackPanel({ agendaId, agendaName }) {
  const [docs] = useState(SEED_BOARD_PACK);
  const [scope, setScope] = useState(agendaId ? "agenda" : "all"); // agenda | common | all
  const [layout, setLayout] = useState("table"); // table | list
  const [activeId, setActiveId] = useState(null);
  const [viewerDoc, setViewerDoc] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const scopedDocs = useMemo(() => {
    if (scope === "agenda") return docs.filter((d) => d.agendaId === agendaId);
    if (scope === "common") return docs.filter((d) => !d.agendaId);
    return docs;
  }, [docs, scope, agendaId]);

  const activeDoc = docs.find((d) => d.id === activeId) || null;

  const toggleSelect = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div style={S.wrap}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={S.eyebrow}>BOARD PACK</div>
          <div style={S.headTitle}>
            {scope === "agenda" && agendaName ? `Linked to "${agendaName}"` : scope === "common" ? "Common Documents" : "All Board Pack Documents"}
          </div>
        </div>
        <div style={S.layoutToggle}>
          <button style={S.layoutBtn(layout === "table")} onClick={() => setLayout("table")} title="Table view">
            <FaTable size={12} />
          </button>
          <button style={S.layoutBtn(layout === "list")} onClick={() => setLayout("list")} title="List / card view">
            <FaThLarge size={12} />
          </button>
        </div>
      </div>

      {/* Scope toggle */}
      <div style={S.toggleRow}>
        {agendaId != null && (
          <button style={S.toggleBtn(scope === "agenda")} onClick={() => { setScope("agenda"); setActiveId(null); }}>
            <FaSitemap size={10} style={{ marginRight: 5 }} /> This Agenda
          </button>
        )}
        <button style={S.toggleBtn(scope === "common")} onClick={() => { setScope("common"); setActiveId(null); }}>
          <FaGlobe size={10} style={{ marginRight: 5 }} /> Common
        </button>
        <button style={S.toggleBtn(scope === "all")} onClick={() => { setScope("all"); setActiveId(null); }}>
          All
        </button>
        <span style={S.selectedCount}>{selectedIds.length} selected</span>
      </div>

      {layout === "table" ? (
        <TableLayout
          docs={scopedDocs}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onView={setViewerDoc}
          activeId={activeId}
          onRowClick={setActiveId}
        />
      ) : (
        <div style={S.splitRow}>
          <div style={S.left}>
            {scopedDocs.length === 0 ? (
              <div style={S.emptySm}>No documents in this view.</div>
            ) : (
              scopedDocs.map((doc) => {
                const linkedTitle = doc.agendaId ? getAgendaTitleById(doc.agendaId) : null;
                const isActive = activeId === doc.id;
                const isSelected = selectedIds.includes(doc.id);
                return (
                  <div key={doc.id} style={S.row(isActive)} onClick={() => setActiveId(doc.id)}>
                    <div
                      style={S.checkbox(isSelected)}
                      onClick={(e) => { e.stopPropagation(); toggleSelect(doc.id); }}
                    >
                      {isSelected && <span style={{ fontSize: 9, color: "#1a1300" }}>?</span>}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={S.rowTitle}>{doc.title}</div>
                      <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center", flexWrap: "wrap" }}>
                        <FileTypeBadge type={doc.type} />
                        <span style={S.metaTxt}>{doc.pages}pp · {doc.size}</span>
                        {linkedTitle ? <span style={S.badge("agenda")}>{linkedTitle}</span> : <span style={S.badge("common")}>Common</span>}
                      </div>
                    </div>
                    <FaChevronRight size={10} style={{ color: "#3d4570", flexShrink: 0 }} />
                  </div>
                );
              })
            )}
          </div>

          <div style={S.right}>
            {!activeDoc ? (
              <div style={S.emptyBig}>Select a document to view its details</div>
            ) : (
              <DocDetail
                doc={activeDoc}
                agendaTitle={activeDoc.agendaId ? getAgendaTitleById(activeDoc.agendaId) : null}
                onView={() => setViewerDoc(activeDoc)}
              />
            )}
          </div>
        </div>
      )}

      {viewerDoc && (
        <DocZoomViewer
          title={viewerDoc.title}
          meta={`${viewerDoc.type} · ${viewerDoc.pages} pages · ${viewerDoc.size}${viewerDoc.agendaId ? ` · ${getAgendaTitleById(viewerDoc.agendaId)}` : " · Common document"}`}
          slides={viewerDoc.slides}
          downloadUrl={viewerDoc.url}
          onClose={() => setViewerDoc(null)}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------
   Table layout
------------------------------------------------------------------- */
function TableLayout({ docs, selectedIds, onToggleSelect, onView, activeId, onRowClick }) {
  return (
    <div style={{ overflowX: "auto", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}></th>
            <th style={S.th}>Title</th>
            <th style={S.th}>Type</th>
            <th style={S.th}>Pages</th>
            <th style={S.th}>Size</th>
            <th style={S.th}>Linked agenda</th>
            <th style={S.th}></th>
          </tr>
        </thead>
        <tbody>
          {docs.length === 0 ? (
            <tr><td colSpan={7} style={{ ...S.td, textAlign: "center", color: "#3d4570", fontStyle: "italic" }}>No documents in this view.</td></tr>
          ) : (
            docs.map((doc) => {
              const linkedTitle = doc.agendaId ? getAgendaTitleById(doc.agendaId) : null;
              const isSelected = selectedIds.includes(doc.id);
              const isActive = activeId === doc.id;
              return (
                <tr key={doc.id} style={{ background: isActive ? "rgba(212,168,83,0.06)" : "transparent", cursor: "pointer" }} onClick={() => onRowClick(doc.id)}>
                  <td style={S.td}>
                    <div style={S.checkbox(isSelected)} onClick={(e) => { e.stopPropagation(); onToggleSelect(doc.id); }}>
                      {isSelected && <span style={{ fontSize: 9, color: "#1a1300" }}>?</span>}
                    </div>
                  </td>
                  <td style={{ ...S.td, fontWeight: 700, color: "#f4f0ff" }}>{doc.title}</td>
                  <td style={S.td}><FileTypeBadge type={doc.type} /></td>
                  <td style={S.td}>{doc.pages}</td>
                  <td style={S.td}>{doc.size}</td>
                  <td style={S.td}>
                    {linkedTitle ? <span style={S.badge("agenda")}>{linkedTitle}</span> : <span style={S.badge("common")}>Common</span>}
                  </td>
                  <td style={S.td}>
                    <button
                      style={S.viewBtn}
                      onClick={(e) => { e.stopPropagation(); onView(doc); }}
                    >
                      <FaEye size={10} style={{ marginRight: 5 }} /> View
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------
   Detail panel (card / list layout right side)
------------------------------------------------------------------- */
function DocDetail({ doc, agendaTitle, onView }) {
  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        {agendaTitle ? (
          <span style={S.badgeLg("agenda")}><FaSitemap size={9} style={{ marginRight: 5 }} />{agendaTitle}</span>
        ) : (
          <span style={S.badgeLg("common")}><FaGlobe size={9} style={{ marginRight: 5 }} />Common document</span>
        )}
      </div>
      <div style={S.detailTitle}>{doc.title}</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center" }}>
        <FileTypeBadge type={doc.type} />
        <span style={S.metaTxt}>{doc.pages} pages</span>
        <span style={S.metaTxt}>{doc.size}</span>
      </div>
      <div style={S.actionRow}>
        <button style={S.goldBtn} onClick={onView}><FaEye style={{ marginRight: 6 }} /> View Document</button>
        {doc.url && (
          <a href={doc.url} download={doc.title} style={{ ...S.ghostBtn, textDecoration: "none" }}>
            <FaDownload style={{ marginRight: 6 }} /> Download
          </a>
        )}
      </div>
      {doc.slides && (
        <div style={{ marginTop: 18 }}>
          <div style={S.fieldLabel}>Sections in this document</div>
          {doc.slides.map((s, i) => (
            <div key={i} style={S.sectionRow}>{i + 1}. {s.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------
   Styles (kept consistent with ResolutionPanel)
------------------------------------------------------------------- */
const S = {
  wrap: { display: "flex", flexDirection: "column", gap: 10 },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap" },
  eyebrow: { fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: "#4f578f", marginBottom: 4 },
  headTitle: { fontSize: 15, fontWeight: 700, color: "#f4f0ff" },
  layoutToggle: { display: "flex", gap: 4, background: "#080a1c", borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", padding: 3 },
  layoutBtn: (active) => ({
    width: 30, height: 28, display: "grid", placeItems: "center", borderRadius: 7, border: "none",
    background: active ? "#D4A853" : "transparent", color: active ? "#1a1300" : "#596197", cursor: "pointer",
  }),
  toggleRow: { display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" },
  toggleBtn: (active) => ({
    display: "inline-flex", alignItems: "center", padding: "6px 13px", borderRadius: 20,
    border: `1px solid ${active ? "rgba(212,168,83,0.45)" : "rgba(255,255,255,0.08)"}`,
    background: active ? "rgba(212,168,83,0.14)" : "transparent",
    color: active ? "#D4A853" : "#596197", fontSize: 11, fontWeight: 700, cursor: "pointer",
  }),
  selectedCount: { marginLeft: "auto", fontSize: 11, color: "#596197" },
  splitRow: { display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" },
  left: { flex: "1 1 280px", minWidth: 0, display: "flex", flexDirection: "column", gap: 6, maxHeight: 460, overflowY: "auto" },
  right: { flex: "1 1 340px", minWidth: 0, background: "#080b1d", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 18, minHeight: 220 },
  row: (active) => ({
    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
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
    background: kind === "agenda" ? "rgba(212,168,83,0.12)" : "rgba(106,170,238,0.12)",
    color: kind === "agenda" ? "#D4A853" : "#6aaaee",
    border: `1px solid ${kind === "agenda" ? "rgba(212,168,83,0.3)" : "rgba(106,170,238,0.3)"}`,
  }),
  checkbox: (selected) => ({
    width: 18, height: 18, borderRadius: 5, flexShrink: 0,
    border: `1.5px solid ${selected ? "#D4A853" : "rgba(255,255,255,0.18)"}`,
    background: selected ? "#D4A853" : "transparent",
    display: "grid", placeItems: "center", cursor: "pointer",
  }),
  emptySm: { fontSize: 11.5, color: "#3d4570", fontStyle: "italic", padding: "16px 6px", textAlign: "center" },
  emptyBig: { fontSize: 13, color: "#3d4570", textAlign: "center", padding: "60px 10px" },
  detailTitle: { fontSize: 17, fontWeight: 800, color: "#f4f0ff", marginBottom: 12, lineHeight: 1.35 },
  actionRow: { display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" },
  goldBtn: { display: "inline-flex", alignItems: "center", padding: "9px 16px", borderRadius: 10, border: "none", background: "#D4A853", color: "#1a1300", fontWeight: 800, fontSize: 12, cursor: "pointer" },
  ghostBtn: { display: "inline-flex", alignItems: "center", padding: "9px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "#8b93c8", fontWeight: 700, fontSize: 12, cursor: "pointer" },
  viewBtn: { display: "inline-flex", alignItems: "center", padding: "5px 12px", borderRadius: 8, border: "1px solid rgba(212,168,83,0.3)", background: "rgba(212,168,83,0.08)", color: "#D4A853", fontWeight: 700, fontSize: 11, cursor: "pointer" },
  fieldLabel: { fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "#4f578f", marginBottom: 7, textTransform: "uppercase" },
  sectionRow: { fontSize: 12, color: "#8b93c8", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 12.5 },
  th: { textAlign: "left", padding: "10px 12px", fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", color: "#4f578f", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#080a1c" },
  td: { padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#8b93c8", verticalAlign: "middle" },
};
