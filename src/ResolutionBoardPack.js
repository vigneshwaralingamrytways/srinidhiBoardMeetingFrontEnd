import { useState, useMemo } from "react";
import { DATA } from "./MeetingData";
import BoardPack from "./BoardPack";
import {
  FaCheck,
  FaEdit,
  FaEye,
  FaTrash,
  FaTimes,
  FaTable,
  FaThLarge,
  FaChevronLeft,
  FaChevronRight,
  FaFile,
  FaSitemap,
  FaGlobe,
} from "react-icons/fa";


const RESOLUTION_PROJECTOR_CONTENT = {
  1: "<p>Approval requested for <strong>extending the Q3 operational budget</strong> by ?3.2 Cr to cover unplanned infrastructure and compliance costs.</p><ul><li>Infrastructure spend: ?1.8 Cr</li><li>Compliance advisory: ?1.4 Cr</li><li>Within the 8% variance threshold pre-approved for the fiscal year</li></ul><blockquote>Finance has confirmed all figures are reconciled as of 30 September 2024.</blockquote>",
  2: "<p>Board approval required to <strong>proceed with the vendor agreement</strong> for the selected vendor, subject to legal sign-off.</p><ul><li>Contract value: ?4.8 Cr over 3 years</li><li>SLA: 99.9% uptime with penalty clauses</li><li>DPA review pending final legal confirmation</li></ul>",
  3: "<p>Resolution to <strong>approve the proposed 2025 product roadmap</strong> covering Q1Q4 delivery milestones across all product verticals.</p><ul><li>4 major platform releases planned</li><li>2 new modules: AI Analytics and Client Portal v2</li><li>Mobile-first redesign scheduled for Q3</li></ul>",
  4: "<p>Resolution to <strong>accept the updated Q4 2024 risk register</strong> and associated mitigation plans.</p><ul><li>3 risks upgraded to High severity</li><li>2 risks formally closed</li><li>1 new risk added: vendor dependency</li></ul>",
  5: "<p>Resolution to <strong>approve the updated compliance calendar</strong> for Q4 2024 and H1 2025, including statutory filing deadlines and license renewal dates.</p>",
  6: "<p>General resolution to <strong>approve the order of business</strong> circulated for this meeting as the formal agenda.</p><ul><li>Agenda circulated 5 days prior to the meeting</li><li>No objections received before the meeting</li></ul>",
  7: "<p>General resolution to <strong>approve and adopt the minutes</strong> of the previous board meeting as a true and accurate record.</p>",
};

const BOARDPACK_PROJECTOR_SLIDES = {
  1: [
    { title: "Q3 financial report 2024", body: "<p>Q3 2024 closed with revenue of <strong>?42.3 Cr</strong> against a target of ?40 Cr.</p><ul><li>EBITDA margin: 18.4%</li><li>Cash position: ?9.1 Cr</li><li>3 audit observations raised, responses in progress</li></ul>" },
    { title: "Budget variance", body: "<p>Operational expenditure exceeded budget by <strong>?3.2 Cr</strong>, mainly due to infrastructure and compliance costs.</p><blockquote>Extension is within the 8% pre-approved variance threshold.</blockquote>" },
  ],
  2: [
    { title: "Product roadmap appendix", body: "<p>2025 roadmap covers <strong>4 major releases</strong> across Q1Q4.</p><ul><li>AI Analytics module</li><li>Client Portal v2</li><li>Mobile-first redesign in Q3</li></ul>" },
    { title: "Funding & hiring", body: "<p>Funding envelope: <strong>?18.5 Cr</strong>. Hiring plan adds 12 engineers and 3 product managers in Q1Q2.</p>" },
  ],
  3: [
    { title: "Vendor comparison matrix", body: "<p>Three vendors evaluated across <strong>14 criteria</strong> including pricing, SLA, and DPDPA readiness.</p>" },
    { title: "Commercial terms", body: "<p>Selected vendor: <strong>?4.8 Cr over 3 years</strong>, 99.9% uptime SLA with penalty clauses.</p>" },
  ],
  4: [
    { title: "Risk register ? Q4 2024", body: "<p><strong>18 active risks</strong> tracked. 3 upgraded to High severity this quarter.</p><ul><li>Vendor dependency risk ? escalated to Risk Committee</li><li>Data breach exposure ? patching in progress</li></ul>" },
  ],
  5: [
    { title: "Compliance calendar", body: "<ul><li><strong>Dec 31</strong>  DPDPA compliance report due</li><li><strong>Dec 31</strong>  annual return filing</li><li><strong>Mar 31</strong>  FY end compliance review</li></ul>" },
  ],
  6: [
    { title: "Full meeting agenda", body: "<ol style='padding-left:18px;margin:0'><li>Opening & Roll Call ? 5 min</li><li>Q3 Financial Review ? 20 min</li><li>Product Roadmap 2025 ? 30 min</li><li>Vendor Contract Decision ? 15 min</li><li>Board Resolution Drafting ? 15 min</li><li>Risk Register Update ? 20 min</li><li>Compliance Calendar ? 10 min</li><li>Closing Actions ? 10 min</li></ol>" },
  ],
  7: [
    { title: "Previous meeting minutes (Q3)", body: "<p>Q3 financial performance reviewed and approved. Budget extension tabled for voting. Vendor shortlisting initiated.</p>" },
  ],
};

const getAgendaTitleById = (agendaItems, id) => agendaItems.find((a) => a.id === id)?.title || null;

/* ================================================================== */
/* RESOLUTION DETAIL / EDIT PANEL (right side)                         */
/* ================================================================== */

function ResolutionDetailPanel({ resolution, agendaTitle, onEdit, onDelete, onProject }) {
  if (!resolution) {
    return <div className="rb-empty">Select a resolution to view its details</div>;
  }
  const longBody = RESOLUTION_PROJECTOR_CONTENT[resolution.id] || `<p>${resolution.description}</p>`;

  return (
    <div className="rb-detail">
      <div className="rb-detail-top">
        {agendaTitle ? (
          <span className="rb-badge rb-badge-agenda">
            <FaSitemap size={9} /> {agendaTitle}
          </span>
        ) : (
          <span className="rb-badge rb-badge-common">
            <FaGlobe size={9} /> General resolution
          </span>
        )}
      </div>
      <div className="rb-detail-title">{resolution.title}</div>
      <div className="rb-detail-body" dangerouslySetInnerHTML={{ __html: longBody }} />
      <div className="rb-action-row">
        <button type="button" className="cm-inline-add rb-btn-gold" onClick={() => onProject(resolution)}>
          <FaEye style={{ marginRight: 6 }} /> View in projector
        </button>
        <button type="button" className="cm-btn-back rb-btn-sm" onClick={() => onEdit(resolution)}>
          <FaEdit style={{ marginRight: 6 }} /> Edit
        </button>
        <button type="button" className="cm-agenda-rm rb-btn-danger" onClick={() => onDelete(resolution.id)}>
          <FaTrash size={11} />
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* RESOLUTION EDIT FORM (right side, replaces detail panel)            */
/* ================================================================== */

function ResolutionEditPanel({ resolution, onSave, onCancel }) {
  const [title, setTitle] = useState(resolution.title);
  const [description, setDescription] = useState(resolution.description);

  return (
    <div className="rb-edit">
      <div className="cm-field">
        <label className="cm-label">Resolution Title</label>
        <input className="cm-input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="cm-field">
        <label className="cm-label">Description</label>
        <textarea
          className="cm-input rb-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>
      <div className="rb-action-row">
        <button
          type="button"
          className="cm-inline-add rb-btn-gold"
          onClick={() => onSave({ ...resolution, title, description })}
        >
          <FaCheck style={{ marginRight: 6 }} /> Save changes
        </button>
        <button type="button" className="cm-btn-back rb-btn-sm" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* RESOLUTION LIST (left side) ? split into Agenda-linked / Common     */
/* ================================================================== */

function ResolutionList({ items, agendaItems, activeId, onSelect, viewMode }) {
  const agendaLinked = items.filter((it) => it.agendaId);
  const common = items.filter((it) => !it.agendaId);

  const renderRow = (item) => {
    const agendaTitle = getAgendaTitleById(agendaItems, item.agendaId);
    return (
      <div
        key={item.id}
        className={`rb-list-row ${activeId === item.id ? "rb-row-active" : ""}`}
        onClick={() => onSelect(item)}
      >
        <div className="rb-row-main">
          <div className="rb-row-title">{item.title}</div>
          {agendaTitle && <div className="rb-row-sub">{agendaTitle}</div>}
        </div>
        <FaChevronRight size={10} className="rb-row-chevron" />
      </div>
    );
  };

  if (viewMode === "agenda") {
    return (
      <div className="rb-list">
        {agendaLinked.length ? agendaLinked.map(renderRow) : (
          <div className="rb-empty-sm">No agenda-linked resolutions yet.</div>
        )}
      </div>
    );
  }
  if (viewMode === "common") {
    return (
      <div className="rb-list">
        {common.length ? common.map(renderRow) : (
          <div className="rb-empty-sm">No common resolutions yet.</div>
        )}
      </div>
    );
  }
  return (
    <div className="rb-list">
      <div className="rb-list-section-label">Agenda-linked ({agendaLinked.length})</div>
      {agendaLinked.length ? agendaLinked.map(renderRow) : (
        <div className="rb-empty-sm">No agenda-linked resolutions yet.</div>
      )}
      <div className="rb-list-section-label" style={{ marginTop: 10 }}>Common ({common.length})</div>
      {common.length ? common.map(renderRow) : (
        <div className="rb-empty-sm">No common resolutions yet.</div>
      )}
    </div>
  );
}

/* ================================================================== */
/* PROJECTOR MODAL (resolution, fullscreen meeting-room style)         */
/* ================================================================== */

function ResolutionProjectorModal({ items, startId, agendaItems, onClose }) {
  const [index, setIndex] = useState(() => Math.max(0, items.findIndex((it) => it.id === startId)));
  const item = items[index];
  if (!item) return null;
  const agendaTitle = getAgendaTitleById(agendaItems, item.agendaId);
  const longBody = RESOLUTION_PROJECTOR_CONTENT[item.id] || `<p>${item.description}</p>`;

  return (
    <div className="rb-modal-backdrop" onClick={onClose}>
      <div className="rb-projector" onClick={(e) => e.stopPropagation()}>
        <button className="rb-projector-close" onClick={onClose}><FaTimes /></button>
        <div className="rb-projector-eyebrow">{agendaTitle || "General resolution"}</div>
        <div className="rb-projector-title">{item.title}</div>
        <div className="rb-projector-body" dangerouslySetInnerHTML={{ __html: longBody }} />
        <div className="rb-projector-nav">
          <button
            type="button"
            className="cm-btn-back rb-btn-sm"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            <FaChevronLeft style={{ marginRight: 6 }} /> Previous
          </button>
          <span className="rb-projector-count">{index + 1} / {items.length}</span>
          <button
            type="button"
            className="cm-btn-next rb-btn-sm"
            disabled={index === items.length - 1}
            onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
          >
            Next <FaChevronRight style={{ marginLeft: 6 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* STEP RESOLUTIONS ? main export                                      */
/* `items` / `setItems` keep the same contract as the original         */
/* StepResolutions so CreateMeeting.js doesn't need other changes.     */
/* ================================================================== */

export function StepResolutionsEnhanced({ items, setItems, agendaItems, activeAgendaId, onClearLink }) {
  const linkedAgenda = agendaItems.find((a) => a.id === activeAgendaId) || null;

  // When deep-linked from an agenda item, default the toggle to "agenda"
  // and scope the list to that one agenda item only.
  const [viewMode, setViewMode] = useState(linkedAgenda ? "agenda" : "all");
  const [activeId, setActiveId] = useState(null);
  const [mode, setMode] = useState("view"); // view | edit
  const [projectorOpen, setProjectorOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", description: "" });

  const scopedItems = useMemo(() => {
    if (linkedAgenda) return items.filter((it) => it.agendaId === linkedAgenda.id);
    return items;
  }, [items, linkedAgenda]);

  const activeItem = items.find((it) => it.id === activeId) || null;

  const handleSelect = (item) => {
    setActiveId(item.id);
    setMode("view");
  };

  const handleEdit = (item) => setMode("edit");

  const handleSave = (updated) => {
    setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
    setMode("view");
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const addResolution = () => {
    if (!draft.title.trim()) return;
    const newItem = {
      id: Date.now(),
      title: draft.title,
      description: draft.description || "No description provided.",
      agendaId: linkedAgenda ? linkedAgenda.id : null,
    };
    setItems((prev) => [...prev, newItem]);
    setDraft({ title: "", description: "" });
  };

  return (
    <>
      <div className="cm-card-title" style={{ fontSize: 13, marginBottom: 2 }}>Resolutions</div>
      <div className="cm-card-desc" style={{ fontSize: 11, marginBottom: 10 }}>
        Add formal resolutions to be voted on or recorded during the meeting
      </div>

      {linkedAgenda && (
        <div className="rb-linked-banner">
          <span>Linked to agenda item: <strong>{linkedAgenda.title}</strong></span>
          <button type="button" className="cm-agenda-rm rb-btn-sm-x" onClick={onClearLink}>
            Clear link
          </button>
        </div>
      )}

      {!linkedAgenda && (
        <div className="rb-toggle-row">
          <button
            type="button"
            className={`rb-toggle-btn ${viewMode === "all" ? "rb-toggle-active" : ""}`}
            onClick={() => setViewMode("all")}
          >
            All
          </button>
          <button
            type="button"
            className={`rb-toggle-btn ${viewMode === "agenda" ? "rb-toggle-active" : ""}`}
            onClick={() => setViewMode("agenda")}
          >
            <FaSitemap size={10} style={{ marginRight: 5 }} /> Agenda-linked
          </button>
          <button
            type="button"
            className={`rb-toggle-btn ${viewMode === "common" ? "rb-toggle-active" : ""}`}
            onClick={() => setViewMode("common")}
          >
            <FaGlobe size={10} style={{ marginRight: 5 }} /> Common
          </button>
        </div>
      )}

      <div className="rb-split">
        <div className="rb-split-left">
          <ResolutionList
            items={scopedItems}
            agendaItems={agendaItems}
            activeId={activeId}
            onSelect={handleSelect}
            viewMode={linkedAgenda ? "agenda" : viewMode}
          />

          <div className="rb-add-box">
            <div className="cm-add-title" style={{ fontSize: 11, marginBottom: 6 }}>
              Add Resolution {linkedAgenda ? `(linked to "${linkedAgenda.title}")` : "(common)"}
            </div>
            <input
              className="cm-input"
              placeholder="Resolution title"
              value={draft.title}
              onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
              style={{ marginBottom: 6 }}
            />
            <textarea
              className="cm-input rb-textarea"
              placeholder="Short description"
              rows={2}
              value={draft.description}
              onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
              style={{ marginBottom: 6 }}
            />
            <button className="cm-inline-add" onClick={addResolution} style={{ width: "100%" }}>
              + Add
            </button>
          </div>
        </div>

        <div className="rb-split-right">
          {mode === "edit" && activeItem ? (
            <ResolutionEditPanel
              resolution={activeItem}
              onSave={handleSave}
              onCancel={() => setMode("view")}
            />
          ) : (
            <ResolutionDetailPanel
              resolution={activeItem}
              agendaTitle={activeItem ? getAgendaTitleById(agendaItems, activeItem.agendaId) : null}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onProject={() => setProjectorOpen(true)}
            />
          )}
        </div>
      </div>

      {projectorOpen && activeItem && (
        <ResolutionProjectorModal
          items={scopedItems}
          startId={activeItem.id}
          agendaItems={agendaItems}
          onClose={() => setProjectorOpen(false)}
        />
      )}
    </>
  );
}

/* ================================================================== */
/* BOARD PACK ? document slider (fullscreen "projector" view)          */
/* ================================================================== */

function BoardPackSliderModal({ docs, startId, agendaItems, onClose }) {
  const [docIndex, setDocIndex] = useState(() => Math.max(0, docs.findIndex((d) => d.id === startId)));
  const [slideIndex, setSlideIndex] = useState(0);
  const doc = docs[docIndex];
  if (!doc) return null;

  const slides = BOARDPACK_PROJECTOR_SLIDES[doc.id] || [
    { title: doc.title, body: `<p>${doc.title}  ${doc.type}, ${doc.pages} pages, ${doc.size}.</p>` },
  ];
  const slide = slides[slideIndex];
  const agendaTitle = getAgendaTitleById(agendaItems, doc.agendaId);

  const goNextDoc = () => {
    if (docIndex < docs.length - 1) {
      setDocIndex((i) => i + 1);
      setSlideIndex(0);
    }
  };
  const goPrevDoc = () => {
    if (docIndex > 0) {
      setDocIndex((i) => i - 1);
      setSlideIndex(0);
    }
  };

  return (
    <div className="rb-modal-backdrop" onClick={onClose}>
      <div className="rb-projector" onClick={(e) => e.stopPropagation()}>
        <button className="rb-projector-close" onClick={onClose}><FaTimes /></button>
        <div className="rb-projector-eyebrow">
          {doc.title} {agendaTitle ? ` ${agendaTitle}` : " common document"}
        </div>
        <div className="rb-projector-title">{slide.title}</div>
        <div className="rb-projector-body" dangerouslySetInnerHTML={{ __html: slide.body }} />

        <div className="rb-projector-subnav">
          <button
            type="button"
            className="rb-toggle-btn"
            disabled={slideIndex === 0}
            onClick={() => setSlideIndex((i) => Math.max(0, i - 1))}
          >
            <FaChevronLeft size={10} />
          </button>
          <span className="rb-projector-count" style={{ fontSize: 11 }}>
            Slide {slideIndex + 1} / {slides.length}
          </span>
          <button
            type="button"
            className="rb-toggle-btn"
            disabled={slideIndex === slides.length - 1}
            onClick={() => setSlideIndex((i) => Math.min(slides.length - 1, i + 1))}
          >
            <FaChevronRight size={10} />
          </button>
        </div>

        <div className="rb-projector-nav">
          <button type="button" className="cm-btn-back rb-btn-sm" disabled={docIndex === 0} onClick={goPrevDoc}>
            <FaChevronLeft style={{ marginRight: 6 }} /> Previous doc
          </button>
          <span className="rb-projector-count">Document {docIndex + 1} / {docs.length}</span>
          <button type="button" className="cm-btn-next rb-btn-sm" disabled={docIndex === docs.length - 1} onClick={goNextDoc}>
            Next doc <FaChevronRight style={{ marginLeft: 6 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* BOARD PACK ? table view of all files                                */
/* ================================================================== */

function BoardPackTable({ docs, agendaItems, selectedIds, onToggle, onView }) {
  return (
    <table className="rb-table">
      <thead>
        <tr>
          <th></th>
          <th>Title</th>
          <th>Type</th>
          <th>Pages</th>
          <th>Size</th>
          <th>Linked agenda</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {docs.map((doc) => {
          const agendaTitle = getAgendaTitleById(agendaItems, doc.agendaId);
          const isSelected = selectedIds.includes(doc.id);
          return (
            <tr key={doc.id} className={isSelected ? "rb-table-row-selected" : ""}>
              <td>
                <div
                  className={`rb-checkbox ${isSelected ? "rb-checkbox-on" : ""}`}
                  onClick={() => onToggle(doc)}
                >
                  {isSelected && <FaCheck size={9} />}
                </div>
              </td>
              <td className="rb-table-title">{doc.title}</td>
              <td><span className="rb-filetype">{doc.type}</span></td>
              <td>{doc.pages}</td>
              <td>{doc.size}</td>
              <td>{agendaTitle ? <span className="rb-badge rb-badge-agenda">{agendaTitle}</span> : <span className="rb-badge rb-badge-common">Common</span>}</td>
              <td>
                <button type="button" className="cm-inline-add rb-btn-sm-x" onClick={() => onView(doc)}>
                  <FaEye size={10} />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ================================================================== */
/* BOARD PACK ? list/card view (mirrors original look, kept as option) */
/* ================================================================== */

function BoardPackCardList({ docs, agendaItems, selectedIds, onToggle, onView }) {
  return (
    <div className="cm-agenda-list" style={{ maxHeight: 280, overflowY: "auto" }}>
      {docs.length ? docs.map((doc) => {
        const agendaTitle = getAgendaTitleById(agendaItems, doc.agendaId);
        const isSelected = selectedIds.includes(doc.id);
        return (
          <div key={doc.id} className="cm-agenda-row">
            <div className="cm-agenda-num"><FaFile /></div>
            <div className="cm-agenda-body">
              <div className="cm-agenda-title">{doc.title}</div>
              <div className="cm-agenda-meta">
                {doc.type} · {doc.pages} pages · {doc.size}
                {agendaTitle && <span className="rb-badge rb-badge-agenda" style={{ marginLeft: 8 }}>{agendaTitle}</span>}
              </div>
            </div>
            <button
              type="button"
              className={`cm-inline-add rb-btn-sm-x ${isSelected ? "rb-btn-selected" : ""}`}
              onClick={() => onToggle(doc)}
              style={{ marginRight: 6 }}
            >
              {isSelected ? <FaCheck size={10} /> : "+"}
            </button>
            <button
              type="button"
              className="cm-inline-add rb-btn-sm-x"
              onClick={() => onView(doc)}
            >
              <FaEye size={10} />
            </button>
          </div>
        );
      }) : (
        <div className="rb-empty-sm">No documents in this view.</div>
      )}
    </div>
  );
}

/* ================================================================== */
/* STEP BOARD PACK ? main export                                       */
/* Same prop contract as the original StepBoardPack, plus it embeds    */
/* the existing <BoardPack /> component (untouched) for upload/select. */
/* ================================================================== */

export function StepBoardPackEnhanced({
  selected,
  setSelected,
  linkedBoardPack,
  setLinkedBoardPack,
  agendaItems,
  activeAgendaId,
  onClearLink,
  onView,
}) {
  const linkedAgenda = agendaItems.find((a) => a.id === activeAgendaId) || null;

  const [docFilter, setDocFilter] = useState(linkedAgenda ? "agenda" : "all");
  const [layout, setLayout] = useState("table"); // table | list
  const [sliderDoc, setSliderDoc] = useState(null);

  const allDocs = DATA.boardPack;
  const agendaDocs = allDocs.filter((d) => d.agendaId);
  const commonDocs = allDocs.filter((d) => !d.agendaId);

  // When deep-linked from an agenda item, only its own docs are shown
  // and selection writes into the per-agenda linkedBoardPack map.
  const scopedDocs = linkedAgenda
    ? allDocs.filter((d) => d.agendaId === linkedAgenda.id)
    : docFilter === "agenda" ? agendaDocs
    : docFilter === "common" ? commonDocs
    : allDocs;

  const currentSelected = linkedAgenda ? (linkedBoardPack[linkedAgenda.id] || []) : selected;
  const selectedIds = currentSelected.map((f) => f.id);

  const toggleDoc = (doc) => {
    const updater = (prev = []) => {
      const exists = prev.some((x) => x.id === doc.id);
      if (exists) return prev.filter((x) => x.id !== doc.id);
      return [...prev, doc];
    };
    if (linkedAgenda) {
      setLinkedBoardPack((prev) => {
        const prevList = prev[linkedAgenda.id] || [];
        return { ...prev, [linkedAgenda.id]: updater(prevList) };
      });
    } else {
      setSelected(updater);
    }
  };

  const handleView = (doc) => {
    setSliderDoc(doc);
  };

  return (
    <>
      <div className="cm-card-title" style={{ fontSize: 13, marginBottom: 2 }}>Board Pack</div>
      <div className="cm-card-desc" style={{ fontSize: 11, marginBottom: 10 }}>
        {linkedAgenda
          ? `Showing documents linked to "${linkedAgenda.title}"`
          : "Select documents to share with participants"}
      </div>

      {linkedAgenda && (
        <div className="rb-linked-banner">
          <span>Linked to agenda item: <strong>{linkedAgenda.title}</strong></span>
          <button type="button" className="cm-agenda-rm rb-btn-sm-x" onClick={onClearLink}>
            Clear link
          </button>
        </div>
      )}

      <div className="rb-toolbar-row">
        {!linkedAgenda && (
          <div className="rb-toggle-row" style={{ marginBottom: 0 }}>
            <button
              type="button"
              className={`rb-toggle-btn ${docFilter === "all" ? "rb-toggle-active" : ""}`}
              onClick={() => setDocFilter("all")}
            >
              All
            </button>
            <button
              type="button"
              className={`rb-toggle-btn ${docFilter === "agenda" ? "rb-toggle-active" : ""}`}
              onClick={() => setDocFilter("agenda")}
            >
              <FaSitemap size={10} style={{ marginRight: 5 }} /> Agenda-linked
            </button>
            <button
              type="button"
              className={`rb-toggle-btn ${docFilter === "common" ? "rb-toggle-active" : ""}`}
              onClick={() => setDocFilter("common")}
            >
              <FaGlobe size={10} style={{ marginRight: 5 }} /> Common
            </button>
          </div>
        )}

        <div className="rb-layout-toggle">
          <button
            type="button"
            className={`rb-icon-toggle-btn ${layout === "table" ? "rb-icon-toggle-active" : ""}`}
            onClick={() => setLayout("table")}
            title="Table view"
          >
            <FaTable size={12} />
          </button>
          <button
            type="button"
            className={`rb-icon-toggle-btn ${layout === "list" ? "rb-icon-toggle-active" : ""}`}
            onClick={() => setLayout("list")}
            title="List / card view"
          >
            <FaThLarge size={12} />
          </button>
        </div>
      </div>

      <div className="rb-doc-area">
        {layout === "table" ? (
          <BoardPackTable
            docs={scopedDocs}
            agendaItems={agendaItems}
            selectedIds={selectedIds}
            onToggle={toggleDoc}
            onView={handleView}
          />
        ) : (
          <BoardPackCardList
            docs={scopedDocs}
            agendaItems={agendaItems}
            selectedIds={selectedIds}
            onToggle={toggleDoc}
            onView={handleView}
          />
        )}
      </div>

      <div className="rb-divider" />

      {/* Existing upload/select grid component ? left completely as-is */}
      <BoardPack
        selected={currentSelected}
        setSelected={(updater) => {
          if (linkedAgenda) {
            setLinkedBoardPack((prev) => {
              const prevList = prev[linkedAgenda.id] || [];
              const nextList = typeof updater === "function" ? updater(prevList) : updater;
              return { ...prev, [linkedAgenda.id]: nextList };
            });
          } else {
            setSelected(updater);
          }
        }}
        onDocClick={handleView}
      />

      {sliderDoc && (
        <BoardPackSliderModal
          docs={scopedDocs.length ? scopedDocs : allDocs}
          startId={sliderDoc.id}
          agendaItems={agendaItems}
          onClose={() => setSliderDoc(null)}
        />
      )}
    </>
  );
}
