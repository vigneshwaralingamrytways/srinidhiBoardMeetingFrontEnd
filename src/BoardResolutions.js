import { useState, useRef, useEffect } from "react";
import { FaEye, FaFile } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaListUl,
  FaListOl,
} from "react-icons/fa";

/* --- Seed Data --------------------------------------------------- */
const SEED_RESOLUTIONS = [
  { id: 1, title: "Approve Q3 Budget Extension", description: "Approval requested for extending the Q3 operational budget." },
  { id: 2, title: "Authorize Vendor Contract", description: "Board approval required to proceed with vendor agreement." },
  { id: 3, title: "Adopt 2025 Product Roadmap", description: "Resolution to approve the proposed 2025 product roadmap." },
];

const INIT_DOCS = [
  { id: 1, name: "Resolution_Budget_Q3.pdf", size: "240 KB", uploadedAt: "2025-04-10", signed: false, attachments: [] },
  { id: 2, name: "Vendor_Contract_Draft.pdf", size: "1.1 MB", uploadedAt: "2025-04-15", signed: true, attachments: [{ id: 101, name: "Vendor_Annexure.pdf", size: "180 KB" }] },
];

const SEED_MEMBERS = [
  { id: 1, name: "James Whitfield", email: "james.whitfield@corp.com", role: "Meeting Chair", initials: "JW" },
  { id: 2, name: "Priya Sharma", email: "priya.sharma@corp.com", role: "Director", initials: "PS" },
  { id: 3, name: "Rohan Das", email: "rohan.das@corp.com", role: "Secretary", initials: "RD" },
  { id: 4, name: "Anita Menon", email: "anita.menon@corp.com", role: "Treasurer", initials: "AM" },
];

/* --- Color tokens ------------------------------------------------ */
const C = {
  bg: "#0b0f1a",
  sidebar: "#0d1120",
  card: "#111827",
  border: "#1c2840",
  gold: "#e8b84b",
  goldDim: "rgba(232,184,75,0.15)",
  text: "#e8eaf0",
  muted: "#5d6a88",
  dim: "#8a96b3",
  danger: "#e05252",
  success: "#3ecf8e",
  live: "#e05252",
};

/* --- Styles ------------------------------------------------------ */
const S = {
  root: { display: "flex", height: "100vh", background: C.bg, fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,serif", color: C.text, overflow: "hidden" },

  /* sidebar */
  sidebar: { width: 268, minWidth: 268, background: C.sidebar, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column" },
  sbLogo: { display: "flex", alignItems: "center", gap: 10, padding: "26px 22px 22px", borderBottom: `1px solid ${C.border}` },
  sbLogoTxt: { fontSize: 17, fontWeight: 700, color: C.gold },
  sbSection: { padding: "20px 22px 5px", fontSize: 10, letterSpacing: "2px", color: C.muted, fontWeight: 700, textTransform: "uppercase" },
  sbItem: (a) => ({
    display: "flex", alignItems: "center", gap: 12, padding: "11px 18px", margin: "2px 10px",
    borderRadius: 9, cursor: "pointer",
    background: a ? "rgba(232,184,75,0.08)" : "transparent",
    color: a ? C.gold : C.dim,
    fontWeight: a ? 700 : 400, fontSize: 14,
    borderLeft: a ? `3px solid ${C.gold}` : "3px solid transparent",
    transition: "all .15s",
  }),
  sbBadge: (type) => ({
    marginLeft: "auto", borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700,
    background: type === "live" ? C.live : C.gold,
    color: type === "live" ? "#fff" : "#0b0f1a",
  }),
  sbUser: { marginTop: "auto", padding: "18px 20px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 },
  sbAvatar: { width: 36, height: 36, borderRadius: "50%", background: C.gold, color: "#0b0f1a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 },
  sbName: { fontSize: 13, fontWeight: 700, color: C.text },
  sbRole: { fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.8px", marginTop: 1 },

  /* main */
  main: { flex: 1, overflowY: "auto", padding: "40px 48px" },
  pageTitle: { fontSize: 36, fontWeight: 700, color: C.text, marginBottom: 4, letterSpacing: "-0.4px" },
  pageSub: { fontSize: 14, color: C.muted, marginBottom: 30 },

  /* tabs */
  tabBar: { display: "flex", gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: 28 },
  tabBtn: (a) => ({
    padding: "10px 24px", border: "none", background: "transparent", cursor: "pointer",
    fontSize: 13, fontFamily: "inherit", fontWeight: a ? 700 : 500,
    color: a ? C.gold : C.muted,
    borderBottom: a ? `2px solid ${C.gold}` : "2px solid transparent",
    marginBottom: -1, transition: "all .15s",
  }),

  /* toolbar */
  toolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  toolSub: { fontSize: 13, color: C.muted },

  /* resolution card */
  card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "22px 24px", marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6 },
  cardDesc: { fontSize: 13, color: C.dim, lineHeight: 1.6, marginBottom: 16 },
  cardRow: { display: "flex", gap: 8 },

  /* doc row */
  docRow: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 },
  docName: { fontSize: 14, fontWeight: 600, color: C.text },
  docMeta: { fontSize: 12, color: C.muted, marginTop: 2 },
  docStatus: (s) => ({ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap", background: s ? "rgba(62,207,142,0.12)" : "rgba(232,184,75,0.12)", color: s ? C.success : C.gold }),

  /* member */
  memberGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  memberCard: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", display: "flex", gap: 14 },
  mAvatar: (bg) => ({ width: 44, height: 44, borderRadius: "50%", background: bg, color: "#0b0f1a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }),
  mName: { fontSize: 15, fontWeight: 700, color: C.text },
  mRole: { fontSize: 12, color: C.gold, marginTop: 2 },
  mEmail: { fontSize: 12, color: C.muted, marginTop: 3 },

  attRow: { display: "flex", alignItems: "center", gap: 8, background: "rgba(232,184,75,0.05)", border: `1px solid rgba(232,184,75,0.16)`, borderRadius: 6, padding: "7px 12px", marginTop: 7 },

  /* buttons */
  btnGold: { background: C.gold, color: "#0b0f1a", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  btnOutline: { background: "transparent", color: C.dim, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnSm: { background: "transparent", color: C.dim, border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnSmGold: { background: "transparent", color: C.gold, border: `1px solid rgba(232,184,75,0.35)`, borderRadius: 6, padding: "5px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  btnSmDanger: { background: "transparent", color: C.danger, border: `1px solid rgba(224,82,82,0.3)`, borderRadius: 6, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },

  /* modal */
  overlay: { position: "fixed", inset: 0, background: "rgba(5,8,18,0.82)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: (w) => ({ background: "#111827", border: `1px solid ${C.border}`, borderRadius: 16, padding: "28px 30px", width: "100%", maxWidth: w ? 560 : 480, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 28px 80px rgba(0,0,0,.65)" }),
  modalHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 },
  modalTitle: { fontSize: 17, fontWeight: 700, color: C.text },
  closeBtn: { background: "none", border: "none", fontSize: 22, color: C.muted, cursor: "pointer", lineHeight: 1 },
  modalFoot: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 },

  /* form */
  label: { display: "block", fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 6, marginTop: 16 },
  input: { width: "100%", padding: "10px 14px", background: "#0d1120", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", color: C.text, outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "10px 14px", background: "#0d1120", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit", color: C.text, outline: "none", boxSizing: "border-box", minHeight: 96, resize: "vertical" },
  uploadBox: { border: `2px dashed rgba(232,184,75,0.22)`, borderRadius: 8, padding: "22px", textAlign: "center", marginTop: 12, color: C.muted, cursor: "pointer" },
  checkRow: { display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13, color: C.dim, cursor: "pointer" },
  divider: { fontSize: 10, color: C.muted, letterSpacing: "1.8px", textTransform: "uppercase", fontWeight: 700, margin: "18px 0 10px", borderBottom: `1px solid ${C.border}`, paddingBottom: 6 },
  mailTo: { background: "rgba(232,184,75,0.07)", border: `1px solid rgba(232,184,75,0.18)`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.dim, marginBottom: 4 },

  /* toast */
  toast: { position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: C.gold, color: "#0b0f1a", padding: "11px 26px", borderRadius: 8, fontSize: 13, fontWeight: 700, zIndex: 9999, boxShadow: "0 6px 24px rgba(0,0,0,.4)", pointerEvents: "none" },
  empty: { textAlign: "center", color: C.muted, padding: "44px 0", fontSize: 14 },
};
const rich = {
  wrap: {
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    overflow: "hidden",
    background: "#0d1120",
    marginTop: 4,
  },

  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 12px",
    borderBottom: `1px solid ${C.border}`,
    background:
      "linear-gradient(180deg, rgba(17,24,39,1), rgba(13,17,32,1))",
    flexWrap: "wrap",
  },

  btn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    border: `1px solid rgba(232,184,75,0.12)`,
    background: "rgba(232,184,75,0.05)",
    color: C.gold,
    cursor: "pointer",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    width: 1,
    height: 22,
    background: "rgba(255,255,255,0.08)",
    margin: "0 4px",
  },
  editor: {
    minHeight: 140,
    padding: "14px 16px",
    fontSize: 14,
    lineHeight: 1.7,
    color: C.text,
    outline: "none",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    direction: "ltr",
    textAlign: "left",
    unicodeBidi: "plaintext",
    caretColor: C.gold,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    border: `1px solid rgba(232,184,75,0.16)`,
    background:
      "linear-gradient(180deg, rgba(232,184,75,0.10), rgba(232,184,75,0.04))",
    color: C.gold,
    cursor: "pointer",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all .18s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
  },
};

<style>
  {`
    [contenteditable][data-placeholder]:empty:before {
      content: attr(data-placeholder);
      color: #5d6a88;
      pointer-events: none;
      display: block;
    }

    [contenteditable] ul,
    [contenteditable] ol {
      padding-left: 22px;
    }
  `}
</style>
/* --- Helpers ------------------------------------------------------ */
function Toast({ msg }) {
  if (!msg) return null;
  return <div style={S.toast}>{msg}</div>;
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div style={S.overlay}>
      <div style={S.modal(wide)}>
        <div style={S.modalHead}>
          <span style={S.modalTitle}>{title}</span>
          <button style={S.closeBtn} onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Pentagon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26">
      <polygon points="13,2 24,9.5 20,22 6,22 2,9.5" fill="#e8b84b" />
    </svg>
  );
}

/* --- Tab 1: Resolutions ------------------------------------------ */
function ResolutionsTab({ toast }) {
  const [list, setList] = useState(SEED_RESOLUTIONS);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: "", description: "" });

  const open = (item = null) => {
    setEditId(item?.id || null);
    setForm(item ? { title: item.title, description: item.description } : { title: "", description: "" });
    setShow(true);
  };
  const close = () => { setShow(false); setEditId(null); setForm({ title: "", description: "" }); };

  const save = () => {
    if (!form.title.trim() || !form.description.trim()) return;
    if (editId) {
      setList(p => p.map(r => r.id === editId ? { ...r, ...form } : r));
      toast("Resolution updated");
    } else {
      setList(p => [...p, { id: Date.now(), ...form }]);
      toast("Resolution added");
    }
    close();
  };

  return (
    <div>
      <div style={S.toolbar}>
        <span style={S.toolSub}>Resolutions passed without a formal agenda</span>
        <button style={S.btnGold} onClick={() => open()}>+ New Resolution</button>
      </div>
      {list.length === 0 && <div style={S.empty}>No resolutions yet.</div>}
      {list.map(r => (
        <div key={r.id} style={S.card}>
          <div style={S.cardTitle}>{r.title}</div>
          <div style={S.cardDesc}>{r.description}</div>
          <div style={S.cardRow}>
            <button style={S.btnSm} onClick={() => open(r)}>Edit</button>
            <button style={S.btnSm} onClick={() => toast("Resolution sent")}>Send</button>
            <button style={S.btnSmDanger} onClick={() => { setList(p => p.filter(x => x.id !== r.id)); toast("Resolution removed"); }}>Remove</button>
          </div>
        </div>
      ))}
      {show && (
        <Modal title={editId ? "Edit Resolution" : "New Resolution"} onClose={close}>
          <label style={S.label}>Title</label>
          <input style={S.input} placeholder="Resolution title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <label style={S.label}>Description</label>
          <RichTextEditor
            value={form.description}
            onChange={(value) =>
              setForm((f) => ({
                ...f,
                description: value,
              }))
            }
            placeholder="Enter resolution description..."
          />
          <div style={S.modalFoot}>
            <button style={S.btnOutline} onClick={close}>Cancel</button>
            <button style={S.btnGold} onClick={save}>{editId ? "Update" : "Add"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* --- Tab 2: Sign Docs -------------------------------------------- */
function SignDocsTab({ toast, docs, setDocs }) {
  const [viewDoc, setViewDoc] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const fileInputs = useRef({});

  const toggleSign = (id) => {
    setDocs(p => p.map(d => d.id === id ? { ...d, signed: !d.signed } : d));
    setViewDoc(v => v && v.id === id ? { ...v, signed: !v.signed } : v);
    toast("Signature status updated");
  };

  const addAttachment = (docId, file) => {
    if (!file) return;
    setDocs(p => p.map(d => d.id === docId ? { ...d, attachments: [...d.attachments, { id: Date.now(), name: file.name, size: `${(file.size / 1024).toFixed(0)} KB` }] } : d));
    setViewDoc(v => {
      if (!v || v.id !== docId) return v;
      return { ...v, attachments: [...v.attachments, { id: Date.now(), name: file.name, size: `${(file.size / 1024).toFixed(0)} KB` }] };
    });
    toast("Attachment added");
  };

  const removeAttachment = (docId, attId) => {
    setDocs(p => p.map(d => d.id === docId ? { ...d, attachments: d.attachments.filter(a => a.id !== attId) } : d));
    setViewDoc(v => v && v.id === docId ? { ...v, attachments: v.attachments.filter(a => a.id !== attId) } : v);
    toast("Attachment removed");
  };

  const addDoc = () => {
    if (!newName.trim()) return;
    setDocs(p => [...p, { id: Date.now(), name: newName.trim(), size: "", uploadedAt: new Date().toISOString().slice(0, 10), signed: false, attachments: [] }]);
    toast("Document added");
    setNewName(""); setShowAdd(false);
  };

  const liveViewDoc = viewDoc ? docs.find(d => d.id === viewDoc.id) : null;

  return (
    <div>
      <div style={S.toolbar}>
        <span style={S.toolSub}>View, sign, and manage board documents & attachments</span>
        <button style={S.btnGold} onClick={() => setShowAdd(true)}>+ Add Document</button>
      </div>

      {docs.length === 0 && <div style={S.empty}>No documents uploaded yet.</div>}
      {docs.map(d => (
        <div key={d.id} style={S.docRow}>
          <span style={{ fontSize: 22 }}><FaFile /></span>
          <div style={{ flex: 1 }}>
            <div style={S.docName}>{d.name}</div>
            <div style={S.docMeta}>{d.size} · {d.uploadedAt} · {d.attachments.length} attachment{d.attachments.length !== 1 ? "s" : ""}</div>
          </div>
          <div style={S.docStatus(d.signed)}>{d.signed ? " Signed" : "Pending"}</div>
          <div style={S.cardRow}>
            <button style={S.btnSmGold} onClick={() => setViewDoc({ ...d })}> View</button>
            <button style={d.signed ? S.btnSmDanger : S.btnSm} onClick={() => toggleSign(d.id)}>{d.signed ? "Unsign" : " Sign"}</button>
          </div>
        </div>
      ))}

      {/* VIEW MODAL */}
      {liveViewDoc && (
        <Modal title={liveViewDoc.name} onClose={() => setViewDoc(null)} wide>
          <div style={{ background: "#0d1120", borderRadius: 10, padding: "28px", textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 50 }}>??</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 10 }}>{liveViewDoc.size} · Uploaded {liveViewDoc.uploadedAt}</div>
            <div style={{ marginTop: 10 }}>
              <span style={S.docStatus(liveViewDoc.signed)}>{liveViewDoc.signed ? " Signed" : "? Pending Signature"}</span>
            </div>
          </div>

          <div style={S.divider}>Attachments ({liveViewDoc.attachments.length})</div>
          {liveViewDoc.attachments.length === 0 && <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>No attachments yet.</div>}
          {liveViewDoc.attachments.map(a => (
            <div key={a.id} style={S.attRow}>
              <span style={{ fontSize: 16 }}>??</span>
              <span style={{ flex: 1, fontSize: 13, color: C.dim }}>{a.name}</span>
              <span style={{ fontSize: 12, color: C.muted }}>{a.size}</span>
              <button style={S.btnSmDanger} onClick={() => removeAttachment(liveViewDoc.id, a.id)}>Remove</button>
            </div>
          ))}

          <input
            type="file"
            ref={r => { if (r) fileInputs.current[liveViewDoc.id] = r; }}
            style={{ display: "none" }}
            onChange={e => { if (e.target.files[0]) addAttachment(liveViewDoc.id, e.target.files[0]); e.target.value = ""; }}
          />
          <button style={{ ...S.btnSmGold, marginTop: 10 }} onClick={() => fileInputs.current[liveViewDoc.id]?.click()}>
            Add Attachment
          </button>

          <div style={S.modalFoot}>
            <button style={S.btnOutline} onClick={() => setViewDoc(null)}>Close</button>
            <button style={liveViewDoc.signed ? S.btnSmDanger : S.btnGold} onClick={() => toggleSign(liveViewDoc.id)}>
              {liveViewDoc.signed ? " Remove Signature" : " Sign Document"}
            </button>
          </div>
        </Modal>
      )}

      {/* ADD DOC MODAL */}
      {showAdd && (
        <Modal title="Add New Document" onClose={() => setShowAdd(false)}>
          <label style={S.label}>Document Name</label>
          <input style={S.input} placeholder="e.g. Board_Resolution_2025.pdf" value={newName} onChange={e => setNewName(e.target.value)} />
          <div style={S.uploadBox}>
            <div style={{ fontSize: 28, marginBottom: 6 }}><FaFile /></div>
            <div style={{ fontSize: 13 }}>Drag & drop or click to upload (demo)</div>
          </div>
          <div style={S.modalFoot}>
            <button style={S.btnOutline} onClick={() => setShowAdd(false)}>Cancel</button>
            <button style={S.btnGold} onClick={addDoc}>Add Document</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* --- Tab 3: Members ---------------------------------------------- */
const AVATAR_COLORS = ["#e8b84b", "#3ecf8e", "#60a5fa", "#f472b6"];

function MembersTab({ toast, docs }) {
  const [mailTarget, setMailTarget] = useState(null); // { mode:"single"|"bulk", member? }
  const [selected, setSelected] = useState([]);
  const [mail, setMail] = useState({ subject: "", body: "" });
  const [attachedDocs, setAttachedDocs] = useState([]);

  const openSingle = (m) => { setMailTarget({ mode: "single", member: m }); setMail({ subject: "", body: "" }); setAttachedDocs([]); };
  const openBulk = () => { setMailTarget({ mode: "bulk" }); setSelected([]); setMail({ subject: "", body: "" }); setAttachedDocs([]); };
  const close = () => { setMailTarget(null); setSelected([]); };

  const toggleSel = id => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleDoc = id => setAttachedDocs(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const sendMail = () => {
    if (!mail.subject.trim() || !mail.body.trim()) return;
    const to = mailTarget.mode === "single" ? mailTarget.member.name
      : SEED_MEMBERS.filter(m => selected.includes(m.id)).map(m => m.name).join(", ");
    toast(`Mail sent to ${to}`);
    close();
  };

  const toLabel = mailTarget?.mode === "single" ? mailTarget.member.email
    : selected.length === 0 ? " select members above "
      : SEED_MEMBERS.filter(m => selected.includes(m.id)).map(m => m.email).join(", ");
  console.log("test")
  return (
    <div>
      <div style={S.toolbar}>
        <span style={S.toolSub}>Board members  send email communications with document attachments</span>
        <button style={S.btnGold} onClick={openBulk}><MdEmail /> Bulk Mail</button>
      </div>

      <div style={S.memberGrid}>
        {SEED_MEMBERS.map((m, i) => (
          <div key={m.id} style={S.memberCard}>
            <div style={S.mAvatar(AVATAR_COLORS[i % AVATAR_COLORS.length])}>{m.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={S.mName}>{m.name}</div>
              <div style={S.mRole}>{m.role}</div>
              <div style={S.mEmail}>{m.email}</div>
              <button style={{ ...S.btnSmGold, marginTop: 12 }} onClick={() => openSingle(m)}>Send Mail</button>
            </div>
          </div>
        ))}
      </div>

      {mailTarget && (
        <Modal title={mailTarget.mode === "single" ? `Mail to ${mailTarget.member.name}` : "Bulk Mail to Members"} onClose={close} wide>

          {/* Bulk recipient selector */}
          {mailTarget.mode === "bulk" && (
            <>
              <div style={S.divider}>Select Recipients</div>
              {SEED_MEMBERS.map(m => (
                <label key={m.id} style={S.checkRow}>
                  <input type="checkbox" checked={selected.includes(m.id)} onChange={() => toggleSel(m.id)} style={{ accentColor: C.gold }} />
                  <span>{m.name}</span>
                  <span style={{ color: C.muted, fontSize: 12 }}> {m.email}</span>
                </label>
              ))}
            </>
          )}

          {/* Mail form */}
          <div style={S.divider}>Compose Mail</div>
          <div style={S.mailTo}>To: <strong style={{ color: C.gold }}>{toLabel}</strong></div>
          <label style={S.label}>Subject</label>
          <input style={S.input} placeholder="Email subject" value={mail.subject} onChange={e => setMail(f => ({ ...f, subject: e.target.value }))} />
          <label style={S.label}>Message</label>
          <textarea style={S.textarea} placeholder="Write your message" value={mail.body} onChange={e => setMail(f => ({ ...f, body: e.target.value }))} />

          {/* Document attachment picker */}
          <div style={S.divider}>Attach Documents ({attachedDocs.length} selected)</div>
          {docs.length === 0 && <div style={{ fontSize: 13, color: C.muted }}>No documents available.</div>}
          {docs.map(d => (
            <label key={d.id} style={{ ...S.checkRow, alignItems: "center" }}>
              <input type="checkbox" checked={attachedDocs.includes(d.id)} onChange={() => toggleDoc(d.id)} style={{ accentColor: C.gold }} />
              <span style={{ fontSize: 16 }}><FaFile /></span>
              <span style={{ flex: 1 }}>{d.name}</span>
              <span style={{ fontSize: 11, color: C.muted, marginRight: 8 }}>{d.size}</span>
              {d.signed && <span style={{ fontSize: 11, color: C.success, fontWeight: 700 }}> Signed</span>}
              {d.attachments.length > 0 && <span style={{ fontSize: 11, color: C.gold }}> {d.attachments.length}</span>}
            </label>
          ))}
          {attachedDocs.length > 0 && (
            <div style={{ fontSize: 12, color: C.gold, marginTop: 8, fontWeight: 600 }}>
              {attachedDocs.length} document{attachedDocs.length !== 1 ? "s" : ""} will be attached
            </div>
          )}

          <div style={S.modalFoot}>
            <button style={S.btnOutline} onClick={close}>Cancel</button>
            <button
              style={{ ...S.btnGold, opacity: (mailTarget.mode === "bulk" && selected.length === 0) ? 0.5 : 1 }}
              onClick={sendMail}
              disabled={mailTarget.mode === "bulk" && selected.length === 0}
            >
              Send Mail
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* --- Root -------------------------------------------------------- */


function RichTextEditor({
  value,
  onChange,
  placeholder = "Type here...",
}) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (
      editorRef.current &&
      editorRef.current.innerHTML !== value
    ) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleCommand = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
  };

  const handleInput = () => {
    onChange(editorRef.current.innerHTML);
  };

  return (
    <div style={rich.wrap}>
      {/* Toolbar */}
      <div style={rich.toolbar}>
        <button
          type="button"
          style={rich.btn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleCommand("bold")}
        >
          <b>B</b>
        </button>

        <button
          type="button"
          style={rich.btn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleCommand("italic")}
        >
          <i>I</i>
        </button>

        <button
          type="button"
          style={rich.btn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleCommand("underline")}
        >
          <u>U</u>
        </button>

        <div style={rich.divider} />

        {/* Align Left */}
        <button
          type="button"
          style={rich.iconBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleCommand("justifyLeft")}
        >
          <FaAlignLeft />
        </button>

        {/* Align Center */}
        <button
          type="button"
          style={rich.iconBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleCommand("justifyCenter")}
        >
          <FaAlignCenter />
        </button>

        {/* Align Right */}
        <button
          type="button"
          style={rich.iconBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleCommand("justifyRight")}
        >
          <FaAlignRight />
        </button>

        <div style={rich.divider} />

        {/* Bullet List */}
        <button
          type="button"
          style={rich.iconBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleCommand("insertUnorderedList")}
        >
          <FaListUl />
        </button>

        {/* Number List */}
        <button
          type="button"
          style={rich.iconBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleCommand("insertOrderedList")}
        >
          <FaListOl />
        </button>

      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
        onInput={handleInput}
        spellCheck={false}
        style={rich.editor}
      />
    </div>
  );
}

const TABS = ["Resolutions", "Sign Docs", "Members"];

export default function BoardResolutions() {
  const [tab, setTab] = useState(0);
  const [toastMsg, setToastMsg] = useState("");
  const [docs, setDocs] = useState(INIT_DOCS);

  const toast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3000); };
  console.log("running")

  return (
    <div style={S.root}>

      {/* Main */}
      <div style={S.main}>
        <div style={S.pageTitle}>Board Resolutions</div>
        <div style={S.pageSub}>Create and manage board resolutions</div>

        <div style={S.tabBar}>
          {TABS.map((t, i) => (
            <button key={t} style={S.tabBtn(tab === i)} onClick={() => setTab(i)}>{t}</button>
          ))}
        </div>

        {tab === 0 && <ResolutionsTab toast={toast} />}
        {tab === 1 && <SignDocsTab toast={toast} docs={docs} setDocs={setDocs} />}
        {tab === 2 && <MembersTab toast={toast} docs={docs} />}
      </div>

      <Toast msg={toastMsg} />
    </div>
  );
}
