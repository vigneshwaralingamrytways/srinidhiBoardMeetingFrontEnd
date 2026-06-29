import { useState, useRef, useEffect } from "react";
import {
  FaTimes, FaTrash, FaTasks, FaUser,
  FaBold, FaItalic, FaUnderline,
  FaListUl, FaListOl, FaAlignLeft, FaAlignCenter, FaAlignRight,
} from "react-icons/fa";
import { getVoteItemId, getVoteResult } from "./Helpers";

/* -------------------------------------------------------------------
   RICH TEXT EDITOR (local copy so this file is self-contained)
------------------------------------------------------------------- */
export function RichTextEditor({ value, onChange, placeholder = "Type here...", minHeight = 140, readOnly = false }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleCommand = (command) => {
    editorRef.current?.focus();
    document.execCommand("styleWithCSS", false, true);
    document.execCommand(command, false, null);
    handleInput();
  };

  const handleInput = () => {
    if (!editorRef.current || !onChange) return;
    const html = editorRef.current.innerHTML;
    if (html === "<br>" || html === "<div><br></div>" || html === "&nbsp;") {
      onChange(""); return;
    }
    onChange(html);
  };

  const preventBlur = (e) => { e.preventDefault(); };

  return (
    <div className="co-rich-editor-wrap">
      {!readOnly && (
        <div className="co-rich-toolbar">
          <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("bold")}><FaBold /></button>
          <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("italic")}><FaItalic /></button>
          <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("underline")}><FaUnderline /></button>
          <div className="co-rich-divider" />
          <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("justifyLeft")}><FaAlignLeft /></button>
          <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("justifyCenter")}><FaAlignCenter /></button>
          <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("justifyRight")}><FaAlignRight /></button>
          <div className="co-rich-divider" />
          <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("insertUnorderedList")}><FaListUl /></button>
          <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("insertOrderedList")}><FaListOl /></button>
        </div>
      )}
      <div
        ref={editorRef}
        className="co-rich-editor"
        contentEditable={!readOnly}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={handleInput}
        spellCheck={false}
        dir="ltr"
        style={{ minHeight }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------
   OUTPUT STEP  shared Resolutions / Decisions panel
   Used by ResolutionStep.jsx and DecisionStep.jsx via the `type` prop
------------------------------------------------------------------- */
export default function OutputStep({
  type, agendaItems, agendaWork, activeAgendaId, setActiveAgendaId,
  participants, votes, recordVote, acceptAllMembers, openVotingModal,
  addOutput, updateOutput, removeOutput, updateInputField, showVoting,
  addTask, updateTask, removeTask, goToStep,
}) {
  const [editingCard, setEditingCard] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [addingFor, setAddingFor] = useState(null);
  const [votedMembersPopup, setVotedMembersPopup] = useState(false);

  const isResolution = type === "resolution";
  const itemKey = isResolution ? "resolutions" : "decisions";
  const inputKey = isResolution ? "resolutionInput" : "decisionInput";
  const label = isResolution ? "Resolution" : "Decision";
  const pluralLabel = isResolution ? "Resolutions" : "Decisions";

  const CATEGORY_TYPES = ["MCA", "Not MCA"];

  const allItems = agendaItems.flatMap((agenda) =>
    (agendaWork[agenda.id]?.[itemKey] || []).map((item, index) => ({
      item, index,
      agendaId: agenda.id,
      agendaTitle: agenda.title,
      agendaPresenter: agenda.presenter,
      agendaDuration: agenda.duration,
      voteId: showVoting ? getVoteItemId(type, agenda.id, index) : null,
    }))
  );

  const activeEntry = selectedItem
    ? allItems.find((e) => e.agendaId === selectedItem.agendaId && e.index === selectedItem.index)
    : allItems[0] || null;

  const activeWork = activeEntry ? agendaWork[activeEntry.agendaId] || {} : {};

  const addInputVal = addingFor
    ? agendaWork[addingFor]?.[inputKey] || { title: "", description: "", categoryType: "" }
    : { title: "", description: "", categoryType: "" };

  const grouped = agendaItems
    .map((agenda) => ({
      agenda,
      items: (agendaWork[agenda.id]?.[itemKey] || []).map((item, index) => ({ item, index, agendaId: agenda.id })),
    }))
    .filter((g) => g.items.length > 0 || true);

  const isSelected = (agendaId, index) =>
    activeEntry?.agendaId === agendaId && activeEntry?.index === index;

  const categoryBadgeStyle = (cat) => ({
    fontSize: 10, fontWeight: 800, letterSpacing: 1, padding: "3px 10px", borderRadius: 999,
    background: cat === "MCA" ? "rgba(80,140,220,0.15)" : "rgba(180,100,220,0.13)",
    color: cat === "MCA" ? "#6aaaee" : "#c47ae8",
    border: `1px solid ${cat === "MCA" ? "rgba(80,140,220,0.25)" : "rgba(180,100,220,0.22)"}`,
  });

  return (
    <section className="co-agenda-layout">
      {/* LEFT PANEL */}
      <div className="co-panel" style={{ display: "flex", flexDirection: "column", gap: 0, height: "fit-content", position: "sticky", top: 0 }}>
        <div className="co-panel-head">
          <div>
            <h2>{pluralLabel}</h2>
            <p>{allItems.length} total across all agenda items</p>
          </div>
        </div>

        <div style={{ padding: "0 0 12px 0", flexShrink: 0 }}>
          <button
            className={`co-agenda-quick-btn ${isResolution ? "co-agenda-quick-res" : "co-agenda-quick-dec"}`}
            style={{ width: "100%", justifyContent: "center", fontSize: 12 }}
            onClick={() => { setAddingFor(addingFor ? null : (activeEntry?.agendaId || agendaItems[0]?.id)); setSelectedItem(null); }}
          >
            <span className="co-quick-icon" style={{ fontSize: 14 }}>{isResolution ? "§" : ""}</span>
            <span> Add {label}</span>
          </button>
        </div>

        <div className="co-agenda-list" style={{ flex: 1, maxHeight: 480, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "thin", scrollbarColor: "rgba(212,168,83,0.2) transparent" }}>
          <div className="co-output-left-scroll" style={{ height: "100%", overflowY: "auto" }}>
            {grouped.map(({ agenda, items }) => (
              <div key={agenda.id}>
                <div style={{
                  padding: "8px 12px 6px", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#3d4570",
                  textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.04)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  position: "sticky", top: 0, background: "#0d1024", zIndex: 1,
                }}>
                  <span style={{ color: "#4f578f" }}>{agenda.title}</span>
                  <span style={{ background: "rgba(212,168,83,0.10)", color: "#D4A853", borderRadius: 20, padding: "1px 7px", fontSize: 9, fontWeight: 700 }}>
                    {items.length}
                  </span>
                </div>

                {items.length === 0 ? (
                  <div style={{ padding: "10px 14px", fontSize: 11, color: "#3d4570", fontStyle: "italic" }}>
                    No {pluralLabel.toLowerCase()} yet
                  </div>
                ) : (
                  items.map(({ item, index, agendaId }) => {
                    const voteId = showVoting ? getVoteItemId(type, agendaId, index) : null;
                    const result = showVoting ? getVoteResult(voteId, votes) : null;
                    const active = isSelected(agendaId, index);
                    return (
                      <div key={`${agendaId}-${index}`} style={{ display: "flex", alignItems: "center", position: "relative" }}>
                        <button
                          className={active ? "active" : ""}
                          onClick={() => { setSelectedItem({ agendaId, index }); setAddingFor(null); setEditingCard(false); }}
                          style={{ flex: 1, textAlign: "left", paddingRight: 32 }}
                        >
                          <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <span style={{ color: active ? "#f4f0ff" : "#8b93c8", fontWeight: 600, fontSize: 12, lineHeight: 1.4 }}>
                              &nbsp;{item.title || `${label} ${index + 1}`}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                              {isResolution && item.categoryType && (
                                <span style={{ fontSize: 9, fontWeight: 800, padding: "1px 7px", borderRadius: 999, background: item.categoryType === "MCA" ? "rgba(80,140,220,0.15)" : "rgba(180,100,220,0.12)", color: item.categoryType === "MCA" ? "#6aaaee" : "#c47ae8" }}>
                                  {item.categoryType}
                                </span>
                              )}
                              {showVoting && result && (
                                <span style={{
                                  fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20,
                                  background: result.status === "Approved" ? "rgba(74,222,128,0.12)" : result.status === "Pending" ? "rgba(212,168,83,0.12)" : "rgba(255,255,255,0.05)",
                                  color: result.status === "Approved" ? "#4ade80" : result.status === "Pending" ? "#D4A853" : "#4f578f",
                                }}>
                                  {result.status}
                                </span>
                              )}
                            </span>
                          </span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (active) { setSelectedItem(null); setEditingCard(false); }
                            removeOutput(agendaId, itemKey, index);
                          }}
                          style={{
                            position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                            background: "none", border: "none", cursor: "pointer",
                            color: "#3d4570", padding: "4px 6px", borderRadius: 6,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "color 0.15s",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "#e06060"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "#3d4570"}
                          title={`Delete ${label}`}
                        >
                          <FaTrash style={{ fontSize: 10 }} />
                        </button>
                      </div>
                    );
                  })
                )}

                <button
                  style={{ width: "100%", textAlign: "left", padding: "7px 14px", background: "transparent", border: "none", color: "#3d4570", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                  onClick={() => { setAddingFor(addingFor === agenda.id ? null : agenda.id); setSelectedItem(null); }}
                >
                  <span style={{ fontSize: 14, lineHeight: 1 }}>+</span>
                  <span>Add to {agenda.title}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="co-panel co-agenda-full co-output-rich-panel">

        {/* ADD FORM */}
        {addingFor && (() => {
          const ag = agendaItems.find((a) => a.id === addingFor);
          return (
            <>
              <div className="co-panel-head" style={{ marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "#4f578f", marginBottom: 6, textTransform: "uppercase" }}>
                    Adding {label} to
                  </div>
                  <h2>{ag?.title}</h2>
                </div>
                <div className="co-output-step-badge">
                  <span>{pluralLabel}</span>
                  <strong>{(agendaWork[addingFor]?.[itemKey] || []).length}</strong>
                </div>
              </div>

              <div className="co-output-add-area">
                <label className="co-label" style={{ marginBottom: 10 }}>ADD {label.toUpperCase()}</label>
                <div style={{ display: "grid", gap: 10 }}>
                  <input
                    className="co-input"
                    value={addInputVal.title}
                    onChange={(e) => updateInputField(addingFor, inputKey, "title", e.target.value)}
                    placeholder={`${label} title`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const newIndex = (agendaWork[addingFor]?.[itemKey] || []).length;
                        addOutput(addingFor, itemKey, inputKey);
                        setSelectedItem({ agendaId: addingFor, index: newIndex });
                        setAddingFor(null);
                      }
                    }}
                    autoFocus
                  />
                  <textarea
                    className="co-textarea"
                    style={{ minHeight: 80 }}
                    value={addInputVal.description}
                    onChange={(e) => updateInputField(addingFor, inputKey, "description", e.target.value)}
                    placeholder={`${label} description (optional)`}
                  />

                  {isResolution && (
                    <div>
                      <div style={{ color: "#4e568e", fontSize: 10, letterSpacing: "0.18em", fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>Category Type</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {CATEGORY_TYPES.map((cat) => {
                          const selected = addInputVal.categoryType === cat;
                          return (
                            <button
                              key={cat}
                              onClick={() => updateInputField(addingFor, inputKey, "categoryType", selected ? "" : cat)}
                              style={{
                                flex: 1, padding: "9px 14px", borderRadius: 10, cursor: "pointer",
                                fontWeight: 800, fontSize: 12, letterSpacing: 0.5,
                                border: selected ? `1px solid ${cat === "MCA" ? "rgba(80,140,220,0.55)" : "rgba(180,100,220,0.5)"}` : "1px solid rgba(255,255,255,0.08)",
                                background: selected ? (cat === "MCA" ? "rgba(80,140,220,0.15)" : "rgba(180,100,220,0.12)") : "#090c20",
                                color: selected ? (cat === "MCA" ? "#6aaaee" : "#c47ae8") : "#596197",
                                transition: "all 0.15s",
                              }}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <button className="co-ghost-btn" onClick={() => setAddingFor(null)}>Cancel</button>
                    <button
                      className="co-gold-btn"
                      onClick={() => {
                        const newIndex = (agendaWork[addingFor]?.[itemKey] || []).length;
                        addOutput(addingFor, itemKey, inputKey);
                        setSelectedItem({ agendaId: addingFor, index: newIndex });
                        setAddingFor(null);
                      }}
                    >
                      Add {label}
                    </button>
                  </div>
                </div>
              </div>
            </>
          );
        })()}

        {/* EMPTY STATE */}
        {!addingFor && allItems.length === 0 && (
          <div className="co-output-empty-state">
            <div className="co-output-empty-icon">{isResolution ? "" : ""}</div>
            <div className="co-output-empty-title">No {pluralLabel} Yet</div>
            <div className="co-output-empty-sub">Click "+ Add {label}" or use the quick-add links under each agenda group on the left.</div>
          </div>
        )}

        {/* DETAIL VIEW */}
        {!addingFor && activeEntry && (
          <>
            {/* Voted Members Popup */}
            {votedMembersPopup && showVoting && (() => {
              const result = getVoteResult(activeEntry.voteId, votes);
              const itemVotes = votes[activeEntry.voteId] || {};
              const votedMembers = participants.filter((p) => itemVotes[p.id]);
              return (
                <div
                  style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.65)" }}
                  onClick={() => setVotedMembersPopup(false)}
                >
                  <div
                    style={{ background: "#0d1024", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "24px 22px", minWidth: 320, maxWidth: 420, width: "90%" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div style={{ color: "#f4f0ff", fontWeight: 800, fontSize: 14 }}>Voted Members</div>
                      <button style={{ background: "none", border: "none", color: "#596197", cursor: "pointer", fontSize: 14, display: "grid", placeItems: "center" }} onClick={() => setVotedMembersPopup(false)}>
                        <FaTimes />
                      </button>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20, background: "rgba(74,222,128,0.10)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.18)" }}>
                        {result.approve} Approved
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20, background: "rgba(220,80,80,0.10)", color: "#e06060", border: "1px solid rgba(220,80,80,0.18)" }}>
                        {result.reject} Rejected
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20, background: "rgba(255,255,255,0.05)", color: "#596197", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {participants.length - votedMembers.length} Not voted
                      </span>
                    </div>
                    {votedMembers.length === 0 ? (
                      <div style={{ color: "#596197", fontSize: 12, textAlign: "center", padding: "24px 0" }}>No votes cast yet</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "rgba(212,168,83,0.2) transparent" }}>
                        {votedMembers.map((person) => {
                          const vote = itemVotes[person.id];
                          return (
                            <div key={person.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "#080b1d", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)" }}>
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: person.color, overflow: "hidden", flexShrink: 0 }}>
                                <img src={person.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=0D1117&color=fff`} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ color: "#f4f0ff", fontWeight: 600, fontSize: 12 }}>{person.name}</div>
                                <div style={{ color: "#596197", fontSize: 10 }}>{person.role}</div>
                              </div>
                              <span style={{
                                fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                                background: vote === "Approve" ? "rgba(74,222,128,0.12)" : "rgba(220,80,80,0.10)",
                                color: vote === "Approve" ? "#4ade80" : "#e06060",
                                border: `1px solid ${vote === "Approve" ? "rgba(74,222,128,0.2)" : "rgba(220,80,80,0.2)"}`,
                              }}>
                                {vote}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "10px 16px", background: "#080b1d", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, flexWrap: "wrap" }}>
              <span style={{ background: "rgba(212,168,83,0.10)", color: "#D4A853", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999, letterSpacing: "0.06em" }}>
                {activeEntry.agendaTitle}
              </span>
              {isResolution && (
                <>
                  <span style={{ color: "#3d4570", fontSize: 12 }}>/</span>
                  <span style={activeEntry.item.categoryType ? categoryBadgeStyle(activeEntry.item.categoryType) : { fontSize: 10, fontWeight: 800, letterSpacing: 1, padding: "3px 10px", borderRadius: 999, background: "rgba(255,255,255,0.05)", color: "#596197", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {activeEntry.item.categoryType || "MCA"}
                  </span>
                </>
              )}
              <span style={{ color: "#3d4570", fontSize: 12 }}>/</span>
              <span style={{ background: "rgba(255,255,255,0.04)", color: "#8b93c8", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
                {activeEntry.item.title || `${label} ${activeEntry.index + 1}`}
              </span>
              {showVoting && (() => {
                const result = getVoteResult(activeEntry.voteId, votes);
                return (
                  <>
                    <span style={{ color: "#3d4570", fontSize: 12 }}>/</span>
                    <span
                      onClick={() => setVotedMembersPopup(true)}
                      style={{
                        cursor: "pointer", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                        background: result.status === "Approved" ? "rgba(74,222,128,0.12)" : result.status === "Pending" ? "rgba(212,168,83,0.12)" : "rgba(255,255,255,0.05)",
                        color: result.status === "Approved" ? "#4ade80" : result.status === "Pending" ? "#D4A853" : "#4f578f",
                        border: `1px solid ${result.status === "Approved" ? "rgba(74,222,128,0.22)" : result.status === "Pending" ? "rgba(212,168,83,0.22)" : "rgba(255,255,255,0.08)"}`,
                        transition: "opacity 0.15s",
                      }}
                      title="Click to see voted members"
                    >
                      {result.status}
                    </span>
                  </>
                );
              })()}
            </div>

            {editingCard ? (
              <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
                <div>
                  <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 6, fontWeight: 700 }}>DESCRIPTION</div>
                  <RichTextEditor
                    value={activeEntry.item.description || ""}
                    placeholder={`Describe this ${label.toLowerCase()}`}
                    onChange={(html) => updateOutput(activeEntry.agendaId, itemKey, activeEntry.index, "description", html)}
                  />
                </div>
                {isResolution && (
                  <div>
                    <div style={{ color: "#4f578f", fontSize: 10, letterSpacing: "0.18em", marginBottom: 8, fontWeight: 700 }}>CATEGORY TYPE</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {CATEGORY_TYPES.map((cat) => {
                        const selected = activeEntry.item.categoryType === cat;
                        return (
                          <button key={cat} onClick={() => updateOutput(activeEntry.agendaId, itemKey, activeEntry.index, "categoryType", selected ? "" : cat)}
                            style={{ flex: 1, padding: "9px 14px", borderRadius: 10, cursor: "pointer", fontWeight: 800, fontSize: 12, letterSpacing: 0.5, border: selected ? `1px solid ${cat === "MCA" ? "rgba(80,140,220,0.55)" : "rgba(180,100,220,0.5)"}` : "1px solid rgba(255,255,255,0.08)", background: selected ? (cat === "MCA" ? "rgba(80,140,220,0.15)" : "rgba(180,100,220,0.12)") : "#090c20", color: selected ? (cat === "MCA" ? "#6aaaee" : "#c47ae8") : "#596197", transition: "all 0.15s" }}>
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button className="co-gold-btn" onClick={() => setEditingCard(false)}>Done</button>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: 20 }}>
                <div style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#080b1d", borderRadius: 14, padding: "14px 16px" }}>
                  <RichTextEditor
                    value={activeEntry.item.description || ""}
                    placeholder={`No description yet  click Edit to add one`}
                    readOnly
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                  <button className="co-ghost-btn" style={{ fontSize: 11, padding: "5px 14px" }} onClick={() => setEditingCard(true)}>Edit</button>
                </div>
              </div>
            )}

            {showVoting && (
              <div className="co-rich-actions">
                <button className="co-ghost-btn co-accept-all-btn" onClick={() => acceptAllMembers(activeEntry.voteId)}>
                  &nbsp;&nbsp;Acknowledge
                </button>
                <button className="co-gold-btn" onClick={() => openVotingModal({ id: activeEntry.voteId, type: label, agendaId: activeEntry.agendaId, agendaTitle: activeEntry.agendaTitle, title: activeEntry.item.title })}>
                  Open Voting
                </button>
              </div>
            )}

            <div style={{ marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
              {(() => {
                const linkedTasks = (activeWork.tasks || []).filter(
                  (t) => t.linkedType === type && t.linkedIndex === activeEntry.index
                );
                return (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {linkedTasks.length > 0 && (
                        <span style={{ background: "rgba(212,168,83,0.15)", color: "#D4A853", fontSize: 10, padding: "2px 7px", borderRadius: 20, fontWeight: 700 }}>
                          {linkedTasks.length}
                        </span>
                      )}
                    </div>
                    <button
                      className="co-ghost-btn"
                      style={{ fontSize: 11, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}
                      onClick={() => goToStep(7)}
                    >
                      <FaTasks style={{ fontSize: 10 }} />
                      Go to Tasks
                    </button>
                  </div>
                );
              })()}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
