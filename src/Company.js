import React, { useState, useEffect, useRef, useCallback } from 'react';
import './CompanyManagement.css';
import { companyManagementApi } from './companyManagementApi';
import {
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
  FaUserEdit,
  FaFileSignature,
  FaIdCard,
  FaFileAlt,
  FaPen,
  FaCheck,
  FaBuilding,
  FaEye,
  FaFile, FaPlus,
  FaEdit,
} from 'react-icons/fa';
import useFetch from 'use-http';



/* -- STATIC DATA ---------------------------------------------- */
const ROLES = [
  { id: "super_admin", label: "Super Admin", color: "#C9A252", desc: "Full system access" },
  { id: "admin", label: "Admin", color: "#378ADD", desc: "Manage users & settings" },
  { id: "manager", label: "Manager", color: "#1D9E75", desc: "View & edit company data" },
  { id: "analyst", label: "Analyst", color: "#BA7517", desc: "Read-only with reports" },
  { id: "viewer", label: "Viewer", color: "#9B9590", desc: "Read-only access" },
];

const DIRECTOR_POSITIONS = [
  "Managing Director",
  "Whole Time Director",
  "Independent Director",
  "Non-Executive Director",
  "Nominee Director",
  "Executive Director",
  "Additional Director",
  "Chairman",
];

const DIRECTOR_LEAVING_REASONS = [
  "Resignation",
  "Retirement",
  "Term Completed",
  "Removal By Board",
  "Health Reasons",
  "Personal Reasons",
  "Career Change",
  "Others",
];

const SHAREHOLDER_ACQUISITION_TYPES = [
  "Initial Subscriber",
  "Promoter Allocation",
  "Private Placement",
  "Rights Issue",
  "Bonus Issue",
  "Share Transfer",
  "ESOP",
  "Gift Transfer",
  "Inheritance",
  "Others"
];

const INDUSTRY_COLORS = {
  Finance: "#C9A252", Healthcare: "#1D9E75", Aerospace: "#378ADD",
  Technology: "#BA7517", "Supply Chain": "#D85A30", Media: "#D854A0",
  Energy: "#639922", Cybersecurity: "#9B59B6"
};


const buildRoleAssignments = (users, companies, assignments = {}) => {
  const next = {};
  users.forEach(u => {
    next[u.id] = {};
    companies.forEach(c => { next[u.id][c.id] = assignments[u.id]?.[c.id] || null; });
  });
  return next;
};

const buttonBase = { fontFamily: "var(--font-mono)", cursor: "pointer", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500 };


/* -- HELPERS -------------------------------------------------- */
// const statusBadge = (s) => {
//   const map = { active: { c: "#1D9E75", bg: "#1D9E7520" }, trial: { c: "#BA7517", bg: "#BA751720" }, inActive: { c: "#5C5A56", bg: "#5C5A5620" } };
//   const { c, bg } = map[s] || map.inActive;
//   return <span style={{ background: bg, color: c, border: `1px solid ${c}30`, padding: "1px 8px", borderRadius: 2, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>{s}</span>;
// };
export const statusBadge = (isActive) => {
  const color = isActive ? "#1D9E75" : "#5C5A56";
  const bg = isActive ? "#1D9E7520" : "#5C5A5620";
  const text = isActive ? "ACTIVE" : "INACTIVE";

  return (
    <span
      style={{
        background: bg,
        color,
        border: `1px solid ${color}30`,
        padding: "2px 10px",
        borderRadius: 2,
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontWeight: 500
      }}
    >
      {text}
    </span>
  );
};
const tierBadge = (t) => {
  const map = { enterprise: { c: "#C9A252", bg: "#C9A25215" }, pro: { c: "#378ADD", bg: "#378ADD15" }, starter: { c: "#9B9590", bg: "#9B959015" } };
  const { c, bg } = map[t] || map.starter;
  return <span style={{ background: bg, color: c, border: `1px solid ${c}30`, padding: "1px 8px", borderRadius: 2, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>{t}</span>;
};

const Avatar = ({ initials, color = "#C9A252", size = 36 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: `${color}18`, border: `1px solid ${color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3, fontWeight: 500, color, letterSpacing: "0.05em", flexShrink: 0 }}>{initials}</div>
);

const GeoPattern = ({ style }) => (
  <svg style={style} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs><pattern id="gp" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 40L40 0M-10 10L10 -10M30 50L50 30" stroke="#C9A252" strokeWidth="0.4" opacity="0.3" /><rect x="0" y="0" width="40" height="40" fill="none" stroke="#C9A252" strokeWidth="0.2" opacity="0.15" /></pattern></defs>
    <rect width="400" height="400" fill="url(#gp)" />
    <circle cx="200" cy="200" r="180" stroke="#C9A252" strokeWidth="0.5" opacity="0.1" />
    <circle cx="200" cy="200" r="130" stroke="#C9A252" strokeWidth="0.5" opacity="0.08" />
    <circle cx="200" cy="200" r="80" stroke="#C9A252" strokeWidth="0.5" opacity="0.06" />
    <line x1="0" y1="200" x2="400" y2="200" stroke="#C9A252" strokeWidth="0.4" opacity="0.12" />
    <line x1="200" y1="0" x2="200" y2="400" stroke="#C9A252" strokeWidth="0.4" opacity="0.12" />
    <line x1="0" y1="0" x2="400" y2="400" stroke="#C9A252" strokeWidth="0.3" opacity="0.08" />
    <line x1="400" y1="0" x2="0" y2="400" stroke="#C9A252" strokeWidth="0.3" opacity="0.08" />
  </svg>
);


const Toast = ({ message }) => message ? (
  <div style={{ position: "absolute", right: 16, bottom: 16, zIndex: 50, background: "var(--bg3)", border: "1px solid var(--gold)50", borderLeft: "3px solid var(--gold)", color: "var(--text)", padding: "10px 14px", boxShadow: "0 18px 50px #0008", animation: "cmFadeUp .25s ease both", maxWidth: 320 }}>
    <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 2 }}>Success</p>
    <p style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.5 }}>{message}</p>
  </div>
) : null;

const Modal = ({ title, subtitle, onClose, children }) => (
  <div style={{ position: "absolute", inset: 0, zIndex: 40, background: "#05070bcc", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, animation: "cmFadeUp .18s ease both" }} onClick={onClose}>
    <div style={{ width: "min(560px,100%)", maxHeight: "90vh", overflow: "auto", background: "var(--bg2)", border: "1px solid var(--border2)", boxShadow: "0 24px 80px #000b", position: "relative" }} onClick={e => e.stopPropagation()}>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg3)" }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 2 }}>{subtitle}</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 400, color: "var(--text)" }}>{title}</h2>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", width: 28, height: 28, fontSize: 13, ...buttonBase }}>x</button>
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  </div>
);


const Field = ({ label, children }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <span style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase" }}>{label}</span>
    {children}
  </label>
);

const inputStyle = {
  background: "var(--bg3)",
  border: "1px solid var(--border2)",
  color: "var(--text)",
  padding: "11px 12px",
  minHeight: 44,
  fontSize: 12,
  outline: "none",
  borderRadius: 0,
  width: "100%",
};

const tableHead = {
  padding: "13px 14px",
  textAlign: "left",
  borderBottom: "1px solid var(--border)",
  fontSize: 11,
  fontWeight: 600,
  color: "var(--text)",
};

const tableCell = {
  padding: "13px 14px",
  borderBottom: "1px solid var(--border)",
  fontSize: 12,
  color: "var(--text)",
};
const emptyProfile = {
  phone: "",
  location: "",
  employeeId: "",
  joiningDate: "",
  emergencyContact: "",
  signature: ""
};

const emptyDisclosure = {
  companyName: "",
  fromDate: "",
  toDate: "",
  position: "",
  formerRole: "",
  currentRole: "",
  currentStatus: "Former",
  managerName: "",
  managerEmail: "",
  reasonForLeaving: "",
  canContact: "Yes",
  notes: ""
};

const actionBtn = {
  border: "1px solid var(--gold)",
  background: "var(--gold)",
  color: "#fff",
  padding: "4px 8px",
  cursor: "pointer",
  fontSize: 11
};

const tableHeader = {
  padding: "9px 12px",
  textAlign: "left",
  borderBottom: "1px solid var(--border)",
};



const getProfile = u => ({ ...emptyProfile, ...(u.profile || {}), phone: u.phone || u.profile?.phone || "", location: u.location || u.profile?.location || "", employeeId: u.employeeId || u.profile?.employeeId || "", joiningDate: u.joiningDate || u.profile?.joiningDate || "", emergencyContact: u.emergencyContact || u.profile?.emergencyContact || "", signature: u.signature || u.profile?.signature || "" });
const getDisclosures = u => Array.isArray(u.disclosures) ? u.disclosures : (u.disclosure ? [u.disclosure] : []);

const SignaturePad = ({ value, onChange }) => {
  const ref = useRef(null), drawing = useRef(false);
  const point = e => { const r = ref.current.getBoundingClientRect(), s = e.touches?.[0] || e; return { x: s.clientX - r.left, y: s.clientY - r.top }; };
  const start = e => { e.preventDefault(); const c = ref.current, ctx = c.getContext("2d"), p = point(e); drawing.current = true; ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const move = e => { if (!drawing.current) return; e.preventDefault(); const c = ref.current, ctx = c.getContext("2d"), p = point(e); ctx.lineTo(p.x, p.y); ctx.strokeStyle = "#C9A252"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.stroke(); onChange(c.toDataURL("image/png")); };
  const stop = () => { drawing.current = false; };
  const clear = () => { const c = ref.current; c.getContext("2d").clearRect(0, 0, c.width, c.height); onChange(""); };
  useEffect(() => { if (!value || !ref.current) return; const img = new Image(); img.onload = () => ref.current.getContext("2d").drawImage(img, 0, 0); img.src = value; }, [value]);
  return <div>
    <canvas ref={ref} width={480} height={100} onMouseDown={start} onMouseMove={move} onMouseUp={stop} onMouseLeave={stop} onTouchStart={start} onTouchMove={move} onTouchEnd={stop}
      style={{ width: "100%", height: 100, background: "var(--bg3)", border: "1px solid var(--border2)", display: "block", touchAction: "none" }} />
    <button onClick={clear} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", padding: "5px 10px", fontSize: 10, marginTop: 6, ...buttonBase }}>Clear Signature</button>
  </div>;
};


const UserProfileModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({ name: user.name, email: user.email, department: user.department, avatar: user.avatar, ...getProfile(user) });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const save = () => onSave(user.id, { name: form.name, email: form.email, department: form.department, avatar: form.avatar, profile: { phone: form.phone, location: form.location, employeeId: form.employeeId, joiningDate: form.joiningDate, emergencyContact: form.emergencyContact, signature: form.signature } });
  return <Modal title={user.name} subtitle="Add User Profile" onClose={onClose}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <Field label="Full Name"><input value={form.name} onChange={e => set("name", e.target.value)} style={inputStyle} /></Field>
      <Field label="Avatar"><input value={form.avatar} onChange={e => set("avatar", e.target.value.toUpperCase().slice(0, 2))} style={inputStyle} /></Field>
      <Field label="Email"><input value={form.email} onChange={e => set("email", e.target.value)} style={inputStyle} /></Field>
      <Field label="Department"><input value={form.department} onChange={e => set("department", e.target.value)} style={inputStyle} /></Field>
      <Field label="Phone"><input value={form.phone} onChange={e => set("phone", e.target.value)} style={inputStyle} /></Field>
      <Field label="Location"><input value={form.location} onChange={e => set("location", e.target.value)} style={inputStyle} /></Field>
      <Field label="Employee ID"><input value={form.employeeId} onChange={e => set("employeeId", e.target.value)} style={inputStyle} /></Field>
      <Field label="Joining Date"><input type="date" value={form.joiningDate} onChange={e => set("joiningDate", e.target.value)} style={inputStyle} /></Field>
      <Field label="Emergency Contact"><input value={form.emergencyContact} onChange={e => set("emergencyContact", e.target.value)} style={inputStyle} /></Field>
    </div>
    <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", margin: "16px 0 8px" }}>Signature</p>
    <SignaturePad value={form.signature} onChange={v => set("signature", v)} />
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
      <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text2)", padding: "8px 12px", ...buttonBase }}>Cancel</button>
      <button onClick={save} style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "8px 16px", ...buttonBase }}>Save Profile</button>
    </div>
  </Modal>;
};

const DisclosureModal = ({ user, onClose, onSave, readonly = false }) => {
  const [list, setList] = useState(getDisclosures(user));
  const [form, setForm] = useState({ ...emptyDisclosure });
  const [edit, setEdit] = useState(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const reset = () => { setForm({ ...emptyDisclosure }); setEdit(null); };

  const add = () => {
    if (!form.companyName || !form.position) return;
    setList(p => edit !== null ? p.map((x, i) => i === edit ? form : x) : [{ ...form }, ...p]);
    reset();
  };

  const save = () => onSave(user.id, list);

  return (
    <Modal title={user.name} subtitle={readonly ? "Disclosure Companies" : "Edit Disclosure Companies"} onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 14 }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 8 }}>Company List ({list.length})</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 360, overflow: "auto" }}>
            {list.length === 0 && <p style={{ fontSize: 11, color: "var(--text3)", fontStyle: "italic" }}>No disclosure companies added.</p>}
            {list.map((d, i) => (
              <button key={i} onClick={() => { setForm(d); setEdit(i); }} style={{ textAlign: "left", background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text2)", padding: 8, ...buttonBase, textTransform: "none", letterSpacing: 0 }}>
                <p style={{ fontSize: 11, color: "var(--text)", marginBottom: 2 }}>{d.companyName}</p>
                <p style={{ fontSize: 10, color: "var(--text3)" }}>{d.formerRole || d.position} / {d.currentStatus}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Company Name"><input disabled={readonly} value={form.companyName} onChange={e => set("companyName", e.target.value)} style={inputStyle} /></Field>
            <Field label="Position"><input disabled={readonly} value={form.position} onChange={e => set("position", e.target.value)} style={inputStyle} /></Field>
            <Field label="Former Role"><input disabled={readonly} value={form.formerRole} onChange={e => set("formerRole", e.target.value)} style={inputStyle} /></Field>
            <Field label="Current Role"><input disabled={readonly} value={form.currentRole} onChange={e => set("currentRole", e.target.value)} style={inputStyle} /></Field>
            <Field label="From Date"><input disabled={readonly} type="date" value={form.fromDate} onChange={e => set("fromDate", e.target.value)} style={inputStyle} /></Field>
            <Field label="To Date"><input disabled={readonly} type="date" value={form.toDate} onChange={e => set("toDate", e.target.value)} style={inputStyle} /></Field>
            <Field label="Current Status"><select disabled={readonly} value={form.currentStatus} onChange={e => set("currentStatus", e.target.value)} style={inputStyle}><option>Former</option><option>Currently Working</option><option>Notice Period</option><option>Contract Ended</option></select></Field>
            <Field label="Can Contact"><select disabled={readonly} value={form.canContact} onChange={e => set("canContact", e.target.value)} style={inputStyle}><option>Yes</option><option>No</option></select></Field>
            <Field label="Manager Name"><input disabled={readonly} value={form.managerName} onChange={e => set("managerName", e.target.value)} style={inputStyle} /></Field>
            <Field label="Manager Email"><input disabled={readonly} value={form.managerEmail} onChange={e => set("managerEmail", e.target.value)} style={inputStyle} /></Field>
          </div>

          <div style={{ marginTop: 10 }}><Field label="Reason For Leaving"><textarea disabled={readonly} value={form.reasonForLeaving} onChange={e => set("reasonForLeaving", e.target.value)} style={{ ...inputStyle, minHeight: 52, resize: "vertical" }} /></Field></div>
          <div style={{ marginTop: 10 }}><Field label="Notes"><textarea disabled={readonly} value={form.notes} onChange={e => set("notes", e.target.value)} style={{ ...inputStyle, minHeight: 52, resize: "vertical" }} /></Field></div>

          {!readonly && (
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 12 }}>
              <button onClick={reset} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text2)", padding: "8px 12px", ...buttonBase }}>New</button>
              <button onClick={add} style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "8px 16px", ...buttonBase }}>{edit !== null ? "Update Company" : "Add Company"}</button>
            </div>
          )}
        </div>
      </div>

      {!readonly && (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
          <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text2)", padding: "8px 12px", ...buttonBase }}>Cancel</button>
          <button onClick={save} style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "8px 16px", ...buttonBase }}>Save Disclosure</button>
        </div>
      )}
    </Modal>
  );
};

const sampleDocuments = [
  {
    id: "sample-coi",
    type: "Certificate Of Incorporation",
    name: "Certificate_Of_Incorporation.pdf",
    size: 245760,
    mimeType: "application/pdf",
    url: "#",
    uploadedAt: "2026-01-12",
  },
  {
    id: "sample-moa",
    type: "MOA",
    name: "Memorandum_Of_Association.pdf",
    size: 188420,
    mimeType: "application/pdf",
    url: "#",
    uploadedAt: "2026-01-12",
  },
  {
    id: "sample-aoa",
    type: "AOA",
    name: "Articles_Of_Association.pdf",
    size: 204900,
    mimeType: "application/pdf",
    url: "#",
    uploadedAt: "2026-01-12",
  },
  {
    id: "sample-pan",
    type: "PAN",
    name: "Company_PAN.pdf",
    size: 98240,
    mimeType: "application/pdf",
    url: "#",
    uploadedAt: "2026-01-12",
  },
  {
    id: "sample-gst",
    type: "GST Certificate",
    name: "GST_Certificate.pdf",
    size: 126500,
    mimeType: "application/pdf",
    url: "#",
    uploadedAt: "2026-01-12",
  },
];


/* -- ADD COMPANY FULL PAGE (5-STEP) --------------------------- */
const COMPANY_STEPS = ["Identity", "Tax & Registration", "Documents", "Directors", "Shareholders"];

const AddCompanyPage = ({ onBack, onCreate, initial = null, users = [] }) => {
  console.log("initial", initial)
  const { get, response } = useFetch({ data: [] });
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingDirector, setEditingDirector] = useState(null);
  const [editingShareholder, setEditingShareholder] = useState(null);
  const [showDirectorModal, setShowDirectorModal] = useState(false);
  const [showShareholderModal, setShowShareholderModal] = useState(false);
  const initialCompanyFields = useRef(null);
  const initialDirectorsRef = useRef([]);
  const initialShareholdersRef = useRef([]);
  const [newShareholder, setNewShareholder] = useState({
    name: "",
    shares: "",
    percentage: "",

    acquisitionType: "",
    issueDate: "",

    kycDocName: "",
    kycDocUrl: ""
  });
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [newDocument, setNewDocument] = useState({ type: "", file: null });
  const [newDirector, setNewDirector] = useState({
    name: "",
    din: "",
    email: "",
    contact: "",
    position: "",
    joiningDate: "",
    leavingDate: "",
    leavingReason: "",
    otherLeavingReason: "",
  });
  const [initialCompany, setInitialCompany] = useState(null);
  const [initialDirectors, setInitialDirectors] = useState([]);
  const [initialShareholders, setInitialShareholders] = useState([]);
  const [initialDocuments, setInitialDocuments] = useState([]);
  // const [documents, setDocuments] = useState([]);
  // useEffect(() => {
  //   if (initial && initial.id) {
  //     const fetchDocuments = async () => {
  //       try {
  //         const docs = await companyManagementApi.getDocumentsByCompany(initial.id);
  //         setDocuments(docs);
  //       } catch (error) {
  //         console.error("Failed to load documents:", error);
  //       }
  //     };
  //     fetchDocuments();
  //   }
  // }, [initial]);
  const emptyCompanyForm = {
    name: "",
    logo: "",
    industry: "",
    country: "",
    employees: 0,
    status: "active",
    tier: "",
    founded: new Date().getFullYear(),
    revenue: "",
    address: "",
    contactNumber: "",
    companySecretaryName: "",
    companySecretaryEmail: "",
    companySecretaryContact: "",
    state: "",
    pincode: "",
    gstNumber: "",
    panNumber: "",
    cin: "",
    tan: "",
    registeredAddress: "",
    stateOfRegistration: "",
    entityType: "Private Limited",
    taxRegime: "Regular",
    coiDoc: null,
    updatedCoiDoc: null,
    moaDoc: null,
    aoaDoc: null,
    panDoc: null,
    gstDoc: null,
    isActive: "",
    directors: [],
    shareholders: [],
    attachedDocs: [],
  };

  const [form, setForm] = useState(() => ({
    ...emptyCompanyForm,
    ...(initial || {}),
    directors: [],
    shareholders: [],
    attachedDocs: [],
    toDeleteDirectors: [],
    toDeleteShareholders: [],
    toDeleteDocs: []
  }));
  const api = ""
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  useEffect(() => {
    if (initial && initial.id) {
      const fetchNestedData = async () => {
        try {
          const directorsRes = await get(api + "/companyDirectors/getAllDirectorsByCompanyActive/" + initial.id);
          console.log("==directorsRes", directorsRes)
          let mappedDirectors = [];

          if (response.ok) {
            mappedDirectors = directorsRes.map(d => ({
              id: d.companyDirectorsId,
              name: d.companyDirectorName || "",
              din: d.din || "",
              position: d.position || "",
              joiningDate: d.dateOfJoining || "",
              email: d.emailId || "",
              contact: d.contactNo || "",
              leavingDate: d.leavingDate || "",
              leavingReason: d.leavingReason || "",
              otherLeavingReason: "",

              isNew: false
            }));
          }
          setInitialDirectors(mappedDirectors);
          initialDirectorsRef.current = mappedDirectors;
          const shareholdersRes = await get(api + "/companyShareHolder/getAllShareHolderByCompanyActive/" + initial.id);
          let mappedShareholders = [];

          if (response.ok) {
            mappedShareholders = shareholdersRes.map(s => ({
              id: s.shareHolderId || s.id,
              name: s.shareHolderName || "",
              shares: s.noOfShares || "",
              percentage: s.noOfShares || "",
              acquisitionType: s.shareHolderType || "",
              issueDate: s.dateOfIssueShares || "",
              isNew: false
              // kycDocName: s.kycDocName || "",
              // kycDocUrl: s.kycDocUrl || ""
            }));
          }
          setInitialShareholders(mappedShareholders);
          initialShareholdersRef.current = mappedShareholders;
          const docs = await companyManagementApi.getDocumentsByCompany(initial.id);
          let mappedDocuments = [];
          if (response.ok) {
            mappedDocuments = docs.map(d => ({
              ...d,
              id: d.companyDocumentsId,
              type: d.documentType,
              name: d.fileName,
              url: d.filePath,
              file: null,
              isNew: false,
            }))
          }
          setInitialDocuments(mappedDocuments);

          setForm(prev => ({
            ...prev,
            status: initial.isActive ? "active" : "inActive",
            directors: mappedDirectors,
            shareholders: mappedShareholders,
            attachedDocs: mappedDocuments
          }));

          setInitialCompany(initial);
          initialCompanyFields.current = {
            name: initial.name,
            logo: initial.logo,
            contactNumber: initial.contactNumber,
            state: initial.state,
            pincode: initial.pincode,
            country: initial.country,
            companySecretaryName: initial.companySecretaryName,
            companySecretaryContact: initial.companySecretaryContact,
            companySecretaryEmail: initial.companySecretaryEmail,
            registeredAddress: initial.registeredAddress,
            cin: initial.cin,
            gstNumber: initial.gstNumber,
            panNumber: initial.panNumber,
            tan: initial.tan,
            stateOfRegistration: initial.stateOfRegistration,
            entityType: initial.entityType,
            taxRegime: initial.taxRegime,
            status: initial.isActive ? "active" : "inttactive",
            isActive: initial.isActive,
            tier: initial.tier
          };
          console.log("==initialCompanyFields", initialCompanyFields)
        } catch (error) {
          console.error("Error fetching nested company data:", error);
        }
      };

      fetchNestedData();
    }
  }, [initial, get, response]);
  const directorNameOptions = users.map((u) => ({
    id: u.id,
    name: u.name,
    din: u.profile?.employeeId || u.employeeId || "",
    email: u.email || "",
    contact: u.profile?.phone || u.phone || "",
  }));

  const applyDirectorDIN = (din) => {
    const selected = directorNameOptions.find(
      (u) => String(u.din).trim() === String(din).trim()
    );

    setNewDirector((p) => ({
      ...p,
      din,
      name: selected?.name || "",
      email: selected?.email || "",
      contact: selected?.contact || "",
    }));
  };

  const updateDirectorDIN = (index, din) => {
    const selected = directorNameOptions.find(
      (u) => String(u.din).trim() === String(din).trim()
    );

    setForm((p) => ({
      ...p,
      directors: p.directors.map((d, i) =>
        i === index
          ? {
            ...d,
            din,
            name: selected?.name || "",
            email: selected?.email || "",
            contact: selected?.contact || "",
          }
          : d
      ),
    }));
  };
  const handleDocUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        setForm(p => ({ ...p, attachedDocs: [...p.attachedDocs, { name: file.name, size: file.size, type: file.type, data: ev.target.result }] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeDoc = (idx) => setForm(p => ({ ...p, attachedDocs: p.attachedDocs.filter((_, i) => i !== idx) }));
  const formatBytes = (b) => b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB";

  const next = () => {
    setError("");
    setStep(s => s + 1);
  };


  // const submit = async () => {
  //   setSaving(true);
  //   setError("");
  //   await onCreate({ ...form, attachedDocs: documents });
  //   setSaving(false);
  //   onBack();
  // };
  const submit = async () => {
    setSaving(true);
    setError("");
    try {
      const companyPayload = {
        companyName: form.name,
        avatar: form.logo,
        contactNumber: form.contactNumber,
        state: form.state,
        pinCode: form.pincode,
        country: form.country,
        companySecretaryName: form.companySecretaryName,
        secretaryContactNo: form.companySecretaryContact,
        secretaryEmail: form.companySecretaryEmail,
        registeredAddress: form.registeredAddress,
        cinNo: form.cin,
        gstNo: form.gstNumber,
        panNo: form.panNumber,
        tanNo: form.tan,
        stateOfRegistration: form.stateOfRegistration,
        entityType: form.entityType,
        taxRegime: form.taxRegime,
        // isActive: form.status === "active",
        tier: form.tier
      };
      let savedCompany;
      if (initial) {

        const hasCompanyChanges = initialCompanyFields.current
          ? Object.keys(initialCompanyFields.current).some(
            key => form[key] !== initialCompanyFields.current[key]
          )
          : true;
        if (hasCompanyChanges) {
          savedCompany = await companyManagementApi.updateCompany(initial.id, companyPayload);
        } else {
          savedCompany = initialCompany;
        }
      } else {

        savedCompany = await companyManagementApi.createCompany(companyPayload);
      }
      const companyId = savedCompany.id || savedCompany.companyId;

      for (const id of form.toDeleteDirectors) {
        await companyManagementApi.deleteDirector(id);
      }
      for (const id of form.toDeleteShareholders) {
        await companyManagementApi.deleteShareholder(id);
      }
      for (const id of form.toDeleteDocs) {
        await companyManagementApi.deleteDocument(id);
      }
      for (const director of form.directors) {
        const payload = {
          companyId: companyId,
          companyDirectorName: director.name,
          din: director.din,
          position: director.position,
          dateOfJoining: director.joiningDate,
          emailId: director.email,
          contactNo: director.contact,
          leavingDate: director.leavingDate || null,
          leavingReason: director.leavingReason === "Others" ? director.otherLeavingReason : director.leavingReason,
          isActive: true,
        };

        if (director.id && !director.isNew) {
          const initial = initialDirectorsRef.current.find(d => d.id === director.id);
          if (initial) {

            const hasChanged = Object.keys(initial).some(key => director[key] !== initial[key]);
            if (hasChanged) {
              await companyManagementApi.updateDirector(director.id, payload);
            }
          } else {

            // await companyManagementApi.updateDirector(director.id, payload);
          }
        } else {
          await companyManagementApi.createDirector(payload);
        }
      }
      for (const shareholder of form.shareholders) {
        const payload = {
          companyId: companyId,
          shareHolderName: shareholder.name,
          noOfShares: shareholder.percentage,
          shareHolderType: shareholder.acquisitionType,
          dateOfIssueShares: shareholder.issueDate,

        };
        if (shareholder.id && !shareholder.isNew) {
          const initial = initialShareholdersRef.current.find(s => s.id === shareholder.id);
          if (initial) {

            const hasChanged = Object.keys(initial).some(key => shareholder[key] !== initial[key]);
            if (hasChanged) {
              await companyManagementApi.updateShareholder(shareholder.id, payload);
            }
          } else {
            // await companyManagementApi.updateShareholder(shareholder.id, payload);
          }
        } else {
          await companyManagementApi.createShareholder(payload);
        }
      }
      for (const doc of form.attachedDocs) {
        console.log("===file", doc)
        if (doc.isNew && doc.file) {
          await companyManagementApi.uploadDocument(companyId, doc.type, doc.file);
        }
      }

      const fullCompany = { ...savedCompany, attachedDocs: form.attachedDocs };
      setSaving(false);
      onBack();
      onCreate(fullCompany);
    } catch (err) {
      setError(err.message || "Failed to save company");
      setSaving(false);
    }
  };

  const saveDocument = () => {
    if (!newDocument.type || !newDocument.file) return;
    const newDoc = {
      id: Date.now(),
      type: newDocument.type,
      name: newDocument.file.name,
      size: newDocument.file.size,
      mimeType: newDocument.file.type,
      file: newDocument.file,
      uploadedAt: new Date().toISOString().slice(0, 10),
      isNew: true,
    };
    setForm(prev => ({
      ...prev,
      attachedDocs: [...prev.attachedDocs, newDoc]
    }));
    setNewDocument({ type: "", file: null });
    setShowDocumentModal(false);
  };

  // const removeDocument = (id) => {
  //   setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  // };
  const removeDocument = (id) => {
    const doc = form.attachedDocs.find(d => d.id === id);
    setForm(p => ({
      ...p,
      attachedDocs: p.attachedDocs.filter(d => d.id !== id),
      toDeleteDocs: doc && !doc.isNew ? [...p.toDeleteDocs, id] : p.toDeleteDocs
    }));
  };

  const viewDocument = (doc) => {
    if (doc.file) {
      const fileUrl = URL.createObjectURL(doc.file);
      window.open(fileUrl, "_blank");
      return;
    }
    if (doc.url) {
      window.open(doc.url, "_blank");
      return;
    }
    alert("No preview available for this document.");
  };


  const saveShareholder = () => {
    setForm(prev => ({
      ...prev,
      shareholders: [...prev.shareholders, { ...newShareholder, isNew: true }]
    }));

    setNewShareholder({
      name: "",
      shares: "",
      percentage: "",
      acquisitionType: "",
      issueDate: "",
      kycDocName: "",
      kycDocUrl: ""
    });

    setShowShareholderModal(false);
  };

  // const saveDirector = () => {
  //   setForm((p) => ({
  //     ...p,
  //     directors: [
  //       ...p.directors,
  //       {
  //         ...newDirector,
  //         // leavingDate: "",
  //         // leavingReason: "",
  //         // otherLeavingReason: "",
  //       },
  //     ],
  //   }));

  //   setNewDirector({
  //     name: "",
  //     din: "",
  //     email: "",
  //     contact: "",
  //     position: "",
  //     joiningDate: "",
  //     leavingDate: "",
  //     leavingReason: "",
  //     otherLeavingReason: "",
  //   });

  //   setShowDirectorModal(false);
  // };

  const updateDirectorFromModal = () => {
    if (editingDirector !== null) {
      setForm(p => ({
        ...p,
        directors: p.directors.map((d, i) => i === editingDirector ? { ...newDirector, isNew: false } : d)
      }));
      setNewDirector({
        name: "",
        din: "",
        email: "",
        contact: "",
        position: "",
        joiningDate: "",
        leavingDate: "",
        leavingReason: "",
        otherLeavingReason: "",
      });
      setShowDirectorModal(false);
      setEditingDirector(null);
    }
  };



  const updateShareholderFromModal = () => {
    if (editingShareholder !== null) {
      setForm(p => ({
        ...p,
        shareholders: p.shareholders.map((s, i) => i === editingShareholder ? { ...newShareholder, isNew: false } : s)
      }));
      setNewShareholder({
        name: "",
        shares: "",
        percentage: "",
        acquisitionType: "",
        issueDate: "",
        kycDocName: "",
        kycDocUrl: ""
      });
      setShowShareholderModal(false);
      setEditingShareholder(null);
    }
  };

  const reviewItem = (label, value) => (
    <div style={{ border: "1px solid var(--border)", background: "var(--bg3)", padding: "8px 12px" }}>
      <p style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 12, color: value ? "var(--text)" : "var(--text3)" }}>{value || "Not provided"}</p>
    </div>
  );

  // const removeDirector = (index) => setForm(p => ({ ...p, directors: p.directors.filter((_, i) => i !== index) }));
  const removeDirector = (index) => {
    const director = form.directors[index];
    setForm(p => ({
      ...p,
      directors: p.directors.filter((_, i) => i !== index),
      toDeleteDirectors: director.id && !director.isNew ? [...p.toDeleteDirectors, director.id] : p.toDeleteDirectors
    }));
  };
  const saveDirector = () => {
    setForm(p => ({
      ...p,
      directors: [...p.directors, { ...newDirector, isNew: true }]
    }));
    setShowDirectorModal(false);
  };
  const updateDirector = (index, field, value) => {
    setForm(p => ({ ...p, directors: p.directors.map((d, i) => i === index ? { ...d, [field]: value } : d) }));
  };

  // const removeShareholder = (index) => setForm(p => ({ ...p, shareholders: p.shareholders.filter((_, i) => i !== index) }));
  const removeShareholder = async (index) => {
    const shareholder = form.shareholders[index];
    // if (shareholder.id) {
    //   try {
    //     await companyManagementApi.deleteShareholder(shareholder.id);
    //     console.log("Shareholder deleted from db:", shareholder.id);
    //   } catch (err) {
    //     console.error("Failed to delete shareholder:", err);
    //     return;
    //   }
    // }
    // setForm(p => ({
    //   ...p,
    //   shareholders: p.shareholders.filter((_, i) => i !== index)
    // }));
    setForm(p => ({
      ...p,
      shareholders: p.shareholders.filter((_, i) => i !== index),
      toDeleteShareholders: shareholder.id && !shareholder.isNew ? [...p.toDeleteShareholders, shareholder.id] : p.toDeleteShareholders
    }));
  };
  const updateShareholder = (index, field, value) => {
    setForm(p => ({ ...p, shareholders: p.shareholders.map((s, i) => i === index ? { ...s, [field]: value } : s) }));
  };

  // Compact input style for inside table rows
  const compactInput = { ...inputStyle, padding: "8px 10px", minHeight: 36, fontSize: 11 };

  const stepContent = [
    /* Step 1  Identity */
    <div key="s1">
      <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16, lineHeight: 1.6 }}>Enter the company's core identity and location details.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        <Field label="Company Name">
          <input value={form.name} onChange={(e) => set("name", e.target.value)} style={inputStyle} placeholder="Enter Company Name" />
        </Field>
        <Field label="Logo Initials">
          <input value={form.logo} onChange={(e) => set("logo", e.target.value.toUpperCase().slice(0, 2))} style={inputStyle} placeholder="AC" />
        </Field>
        <Field label="Contact Number">
          <input value={form.contactNumber} onChange={(e) => set("contactNumber", e.target.value)} style={inputStyle} placeholder="9856742360" />
        </Field>
        <Field label="State">
          <input value={form.state} onChange={(e) => set("state", e.target.value)} style={inputStyle} placeholder="TamilNadu" />
        </Field>
        <Field label="Pincode">
          <input value={form.pincode} onChange={(e) => set("pincode", e.target.value)} style={inputStyle} placeholder="600100" />
        </Field>
        <Field label="Country">
          <input value={form.country} onChange={(e) => set("country", e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Company Secretary Name">
          <input value={form.companySecretaryName || ""} onChange={(e) => set("companySecretaryName", e.target.value)} style={inputStyle} placeholder="Enter Secretary Name" />
        </Field>
        <Field label="Secretary Contact No">
          <input value={form.companySecretaryContact || ""} onChange={(e) => set("companySecretaryContact", e.target.value)} style={inputStyle} placeholder="+91 9876543210" />
        </Field>
        <Field label="Secretary Email">
          <input type="email" value={form.companySecretaryEmail || ""} onChange={(e) => set("companySecretaryEmail", e.target.value)} style={inputStyle} placeholder="secretary@company.com" />
        </Field>
      </div>
      <div style={{ marginTop: 14 }}>
        <Field label="Registered Address">
          <textarea value={form.registeredAddress} onChange={(e) => set("registeredAddress", e.target.value)} style={{ ...inputStyle, minHeight: 78, resize: "vertical" }} />
        </Field>
      </div>
    </div>,

    /* Step 2  Tax & Registration */
    <div key="s2">
      <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16, lineHeight: 1.6 }}>Enter the company's tax identifiers, registration numbers, and compliance details.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        <Field label="CIN / Registration No.">
          <input value={form.cin} onChange={e => set("cin", e.target.value.toUpperCase())} style={inputStyle} placeholder="U12345MH2020PTC123456" />
        </Field>
        <Field label="GST Number">
          <input value={form.gstNumber} onChange={e => set("gstNumber", e.target.value.toUpperCase())} style={inputStyle} placeholder="22AAAAA0000A1Z5" />
        </Field>
        <Field label="PAN Number">
          <input value={form.panNumber} onChange={e => set("panNumber", e.target.value.toUpperCase())} style={inputStyle} placeholder="AAAAA0000A" />
        </Field>
        <Field label="TAN Number">
          <input value={form.tan} onChange={e => set("tan", e.target.value.toUpperCase())} style={inputStyle} placeholder="PDES03028F" />
        </Field>
        <Field label="State of Registration">
          <input value={form.stateOfRegistration} onChange={e => set("stateOfRegistration", e.target.value)} style={inputStyle} placeholder="Maharashtra" />
        </Field>
        <Field label="Entity Type">
          <select value={form.entityType} onChange={e => set("entityType", e.target.value)} style={inputStyle}>
            <option>Private Limited</option>
            <option>Public Limited</option>
            <option>LLP</option>
            <option>Sole Proprietorship</option>
            <option>Partnership</option>
            <option>One Person Company</option>
          </select>
        </Field>
        <Field label="Tax Regime">
          <select value={form.taxRegime} onChange={e => set("taxRegime", e.target.value)} style={inputStyle}>
            <option>Regular</option>
            <option>Composition</option>
            <option>SEZ</option>
            <option>Exempt</option>
          </select>
        </Field>
        <Field label="tier">
          <input value={form.tier} onChange={e => set("tier", e.target.value.toUpperCase())} style={inputStyle} placeholder="Tier" />
        </Field>
      </div>
    </div>,

    /* Step 3  Documents */
    <div key="s3">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <p style={{ fontSize: 12, color: "var(--text3)" }}>Upload statutory company documents.</p>
        <button type="button" onClick={() => setShowDocumentModal(true)}
          style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "#fff", padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 11, ...buttonBase }}>
          <FaPlus size={10} /> Add Document
        </button>
      </div>
      <div style={{ border: "1px solid var(--border)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg3)" }}>
              <th style={tableHeader}>Document Type</th>
              <th style={tableHeader}>File Name</th>
              <th style={tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {form.attachedDocs.map((doc) => (
              <tr key={doc.id}>
                <td style={tableCell}>{doc.type}</td>
                <td style={tableCell}>{doc.name}</td>
                <td style={tableCell}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => viewDocument(doc)}
                      style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "#fff", padding: "4px 8px", cursor: "pointer", fontSize: 11 }}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      style={{ background: "none", border: "1px solid var(--red)", color: "var(--red)", padding: "4px 8px", cursor: "pointer", fontSize: 11 }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {form.attachedDocs.length === 0 && (
              <tr>
                <td colSpan="3" style={{ padding: 16, textAlign: "center", color: "var(--text3)", fontSize: 12 }}>
                  No documents added.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>,

    /* Step 4  Directors */
    <div key="s4">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <p style={{ fontSize: 12, color: "var(--text3)" }}>Add company directors and board members.</p>
        <button type="button" onClick={() => setShowDirectorModal(true)}
          style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 11, ...buttonBase }}>
          <FaPlus size={10} /> Add Director
        </button>
      </div>
      <div style={{ border: "1px solid var(--border)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--bg3)" }}>
          <thead>
            <tr>
              <th style={tableHead}>Name</th>
              <th style={tableHead}>DIN</th>
              <th style={tableHead}>Position</th>
              <th style={tableHead}>Joining Date</th>
              <th style={tableHead}>Email</th>
              <th style={tableHead}>Contact</th>
              <th style={tableHead}>Leaving Date</th>
              <th style={tableHead}>Reason</th>
              <th style={tableHead}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {form.directors.map((director, index) => (
              <tr key={director.id || index}>
                <td style={tableCell}>{director.name}</td>
                <td style={tableCell}>{director.din}</td>
                <td style={tableCell}>{director.position}</td>
                <td style={tableCell}>{director.joiningDate || "-"}</td>
                <td style={tableCell}>{director.email}</td>
                <td style={tableCell}>{director.contact}</td>
                <td style={tableCell}>{director.leavingDate || "-"}</td>
                <td style={tableCell}>{director.leavingReason === "Others" ? director.otherLeavingReason : director.leavingReason || "-"}</td>
                <td style={tableCell}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button type="button" onClick={() => { setNewDirector(director); setEditingDirector(index); setShowDirectorModal(true); }}
                      style={{ border: "1px solid var(--gold)", background: "var(--gold)", color: "#fff", padding: "4px 8px", cursor: "pointer", fontSize: 11 }}><FaEdit /></button>
                    <button type="button" onClick={() => removeDirector(index)}
                      style={{ border: "1px solid var(--red)", color: "var(--red)", background: "none", padding: "4px 8px", cursor: "pointer", fontSize: 11 }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>,

    /* Step 5  Shareholders */
    <div key="s5">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <p style={{ fontSize: 12, color: "var(--text3)" }}>Add shareholder details and ownership percentages.</p>
        <button type="button" onClick={() => setShowShareholderModal(true)}
          style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 11, ...buttonBase }}>
          <FaPlus size={10} /> Add Shareholder
        </button>
      </div>
      <div style={{ border: "1px solid var(--border)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--bg3)" }}>
          <thead>
            <tr>
              <th style={tableHead}>Name</th>
              <th style={tableHead}>No of Shares</th>
              <th style={tableHead}>Acquisition Method</th>
              <th style={tableHead}>Issue Date</th>
              {/* <th style={tableHead}>KYC</th> */}
              <th style={tableHead}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {form.shareholders.map((holder, index) => (
              <tr key={holder.id || index}>
                <td style={tableCell}>{holder.name}</td>
                <td style={tableCell}>{`${holder.percentage}%`}</td>
                <td style={tableCell}>{holder.acquisitionType || "-"}</td>
                <td style={tableCell}>{holder.issueDate || "-"}</td>
                {/* <td style={tableCell}>
                  {holder.kycDocUrl ? (
                    <button type="button" onClick={() => window.open(holder.kycDocUrl, "_blank")} style={{ border: "1px solid var(--gold)", background: "var(--gold)", color: "#fff", padding: "4px 8px", cursor: "pointer", fontSize: 11 }}>View</button>
                  ) : "-"}
                </td> */}
                <td style={tableCell}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button type="button" onClick={() => { setNewShareholder(holder); setEditingShareholder(index); setShowShareholderModal(true); }}
                      style={{ border: "1px solid var(--gold)", background: "var(--gold)", color: "#fff", padding: "4px 8px", cursor: "pointer", fontSize: 11 }}><FaEdit /></button>
                    <button type="button" onClick={() => removeShareholder(index)}
                      style={{ border: "1px solid var(--red)", color: "var(--red)", background: "none", padding: "4px 8px", cursor: "pointer", fontSize: 11 }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>,
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg)" }}>
      {/* Top bar  compact */}
      <div style={{ padding: "0 24px", height: 52, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "var(--bg2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer" }}><FaArrowLeft /></button>
          <div>
            <p style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 1 }}>Corporate Management</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 400, color: "var(--text)" }}>{initial ? "Edit Company" : "Add New Company"}</h1>
          </div>
        </div>
        <div style={{ fontSize: 10, color: "var(--text3)", letterSpacing: "0.08em" }}>
          {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </div>
      </div>

      {/* Step indicator  compact */}
      <div style={{ padding: "10px 24px 0", background: "var(--bg2)", borderBottom: "1px solid var(--border)", flexShrink: 0, overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 0, minWidth: 400 }}>
          {COMPANY_STEPS.map((label, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, flexShrink: 0, transition: "all .2s", background: i <= step ? "var(--gold)" : "var(--bg3)", border: i <= step ? "2px solid var(--gold)" : "2px solid var(--border2)", color: i <= step ? "var(--bg)" : "var(--text3)" }}>
                  {i < step ? <FaCheck size={9} /> : i + 1}
                </div>
                {i < COMPANY_STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: i < step ? "var(--gold)" : "var(--border2)", transition: "background .2s", margin: "0 3px" }} />
                )}
              </div>
              <p style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: i === step ? "var(--gold)" : i < step ? "var(--text2)" : "var(--text3)", paddingBottom: 8, whiteSpace: "nowrap" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>
        <div style={{ width: "100%" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, color: "var(--text)", marginBottom: 6 }}>{COMPANY_STEPS[step]}</h2>
          <div style={{ width: 28, height: 2, background: "var(--gold)", marginBottom: 18 }} />
          {stepContent[step]}
          {error && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 12 }}>{error}</p>}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 24px", borderTop: "1px solid var(--border)", background: "var(--bg2)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <button onClick={step === 0 ? onBack : () => { setError(""); setStep(s => s - 1); }}
          style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text2)", padding: "8px 16px", ...buttonBase, fontSize: 11 }}>
          {step === 0 ? "Cancel" : "Back"}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10, color: "var(--text3)", letterSpacing: "0.1em" }}>Step {step + 1} of {COMPANY_STEPS.length}</span>
          {step < COMPANY_STEPS.length - 1
            ? <button onClick={next} style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "8px 20px", ...buttonBase, fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>Next <FaArrowRight /></button>
            : <button onClick={submit} disabled={saving} style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "8px 20px", ...buttonBase, fontSize: 11 }}>
              {saving ? "Saving..." : initial ? "Save Changes" : "Add Company"}
            </button>}
        </div>
      </div>

      {/* Director Modal */}
      {showDirectorModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ width: 600, background: "var(--bg2)", border: "1px solid var(--border)", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: "var(--text)" }}>{editingDirector !== null ? "Edit Director" : "Add Director"}</h3>
              <button type="button" onClick={() => { setShowDirectorModal(false); setEditingDirector(null); }} style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center" }}><FaTimes /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
              <Field label="DIN">
                <input
                  type="text"
                  value={newDirector.din}
                  onChange={(e) => applyDirectorDIN(e.target.value)}
                  placeholder="Enter DIN"
                  style={inputStyle}
                />
              </Field>

              <Field label="Name">
                <input
                  type="text"
                  value={newDirector.name}
                  onChange={(e) => setNewDirector(p => ({ ...p, name: e.target.value }))}
                  style={inputStyle} />
              </Field>
              <Field label="Position">
                <select value={newDirector.position} onChange={(e) => setNewDirector((p) => ({ ...p, position: e.target.value }))} style={inputStyle}>
                  <option value=""> Select Position </option>
                  {DIRECTOR_POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Date Of Joining">
                <input
                  type="date"
                  value={newDirector.joiningDate}
                  onChange={(e) =>
                    setNewDirector((p) => ({
                      ...p,
                      joiningDate: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>
              <Field label="Email">
                <input value={newDirector.email} onChange={(e) => setNewDirector((p) => ({ ...p, email: e.target.value }))} style={inputStyle} />
              </Field>
              <Field label="Contact">
                <input value={newDirector.contact} onChange={(e) => setNewDirector((p) => ({ ...p, contact: e.target.value }))} style={inputStyle} />
              </Field>
              <Field label="Leaving Date">
                <input
                  type="date"
                  value={newDirector.leavingDate}
                  onChange={(e) => setNewDirector((p) => ({ ...p, leavingDate: e.target.value }))}
                  style={inputStyle}
                />
              </Field>
              <Field label="Leaving Reason">
                <select value={newDirector.leavingReason} onChange={(e) => setNewDirector((p) => ({ ...p, leavingReason: e.target.value }))} style={inputStyle}>
                  <option value="">Select Reason</option>
                  {DIRECTOR_LEAVING_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              {newDirector.leavingReason === "Others" && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Other Reason">
                    <input value={newDirector.otherLeavingReason || ""} onChange={(e) => setNewDirector((p) => ({ ...p, otherLeavingReason: e.target.value }))} style={inputStyle} />
                  </Field>
                </div>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
              <button type="button" onClick={() => { setShowDirectorModal(false); setEditingDirector(null); }} style={{ background: "transparent", border: "1px solid var(--border2)", color: "var(--text2)", padding: "8px 14px", fontSize: 11, cursor: "pointer", ...buttonBase }}>Cancel</button>
              <button type="button" onClick={() => { editingDirector !== null ? updateDirectorFromModal() : saveDirector(); }} style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "#fff", padding: "8px 16px", fontSize: 11, cursor: "pointer", ...buttonBase }}>{editingDirector !== null ? "Update Director" : "Save Director"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Shareholder Modal */}
      {showShareholderModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ width: 480, background: "var(--bg2)", border: "1px solid var(--border)", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: "var(--text)" }}>{editingShareholder !== null ? "Edit Shareholder" : "Add Shareholder"}</h3>
              <button type="button" onClick={() => { setShowShareholderModal(false); setEditingShareholder(null); }} style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center" }}><FaTimes /></button>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              <Field label="Name"><input value={newShareholder.name} onChange={(e) => setNewShareholder((p) => ({ ...p, name: e.target.value }))} style={inputStyle} /></Field>
              <Field label="No of Shares"><input value={newShareholder.percentage} onChange={(e) => setNewShareholder((p) => ({ ...p, percentage: e.target.value }))} style={inputStyle} /></Field>
              <Field label="How Did They Become Shareholder">
                <select
                  value={newShareholder.acquisitionType}
                  onChange={(e) =>
                    setNewShareholder((p) => ({
                      ...p,
                      acquisitionType: e.target.value
                    }))
                  }
                  style={inputStyle}
                >
                  <option value="">Select</option>
                  {SHAREHOLDER_ACQUISITION_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Date Of Issue Shares">
                <input
                  type="date"
                  value={newShareholder.issueDate}
                  onChange={(e) =>
                    setNewShareholder((p) => ({
                      ...p,
                      issueDate: e.target.value
                    }))
                  }
                  style={inputStyle}
                />
              </Field>
              {/* <Field label="KYC Document">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setNewShareholder((p) => ({
                      ...p,
                      kycDocName: file.name,
                      kycDocUrl: URL.createObjectURL(file)
                    }));
                  }}
                  style={inputStyle}
                />
              </Field> */}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
              <button type="button" onClick={() => { setShowShareholderModal(false); setEditingShareholder(null); }} style={{ background: "transparent", border: "1px solid var(--border2)", color: "var(--text2)", padding: "8px 14px", fontSize: 11, cursor: "pointer", ...buttonBase }}>Cancel</button>
              <button type="button" onClick={() => { editingShareholder !== null ? updateShareholderFromModal() : saveShareholder(); }} style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "#fff", padding: "8px 16px", fontSize: 11, cursor: "pointer", ...buttonBase }}>{editingShareholder !== null ? "Update Shareholder" : "Save Shareholder"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Document Modal */}
      {showDocumentModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 99999, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: 480, background: "var(--bg2)", border: "1px solid var(--border)", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: "var(--text)" }}>Add Document</h3>
              <button type="button" onClick={() => setShowDocumentModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)", fontSize: 14 }}><FaTimes /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Document Type">
                <select value={newDocument.type} onChange={(e) => setNewDocument((p) => ({ ...p, type: e.target.value }))} style={inputStyle}>
                  <option value="">Select Document</option>
                  <option>Certificate Of Incorporation</option>
                  <option>Updated COI</option>
                  <option>MOA</option>
                  <option>AOA</option>
                  <option>PAN</option>
                  <option>GST Certificate</option>
                </select>
              </Field>
              <Field label="Upload File">
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setNewDocument((p) => ({ ...p, file: e.target.files[0] }))} style={inputStyle} />
              </Field>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <button type="button" onClick={() => setShowDocumentModal(false)} style={{ background: "transparent", border: "1px solid var(--border2)", color: "var(--text2)", padding: "8px 14px", cursor: "pointer", fontSize: 11, ...buttonBase }}>Cancel</button>
              <button type="button" onClick={saveDocument} style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "#fff", padding: "8px 16px", cursor: "pointer", fontSize: 11, ...buttonBase }}>Save Document</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const AddUserModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({ name: "", email: "", department: "Operations", avatar: "", profile: { ...emptyProfile } });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const setProfile = (key, value) => setForm(prev => ({ ...prev, profile: { ...prev.profile, [key]: value } }));

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim()) { setError("Name and email are required."); return; }
    setSaving(true); setError("");
    await onCreate(form);
    setSaving(false);
    onClose();
  };

  return (
    <Modal title="Add User Profile" subtitle="Profile Information" onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Full Name"><input value={form.name} onChange={e => set("name", e.target.value)} style={inputStyle} /></Field>
        <Field label="Avatar"><input value={form.avatar} onChange={e => set("avatar", e.target.value.toUpperCase().slice(0, 2))} placeholder="AC" style={inputStyle} /></Field>
        <Field label="Email"><input type="email" value={form.email} onChange={e => set("email", e.target.value)} style={inputStyle} /></Field>
        <Field label="Department"><input value={form.department} onChange={e => set("department", e.target.value)} style={inputStyle} /></Field>
        <Field label="Phone"><input value={form.profile.phone} onChange={e => setProfile("phone", e.target.value)} style={inputStyle} /></Field>
        <Field label="Location"><input value={form.profile.location} onChange={e => setProfile("location", e.target.value)} style={inputStyle} /></Field>
        <Field label="Employee ID"><input value={form.profile.employeeId} onChange={e => setProfile("employeeId", e.target.value)} style={inputStyle} /></Field>
        <Field label="Joining Date"><input type="date" value={form.profile.joiningDate} onChange={e => setProfile("joiningDate", e.target.value)} style={inputStyle} /></Field>
        <Field label="Emergency Contact"><input value={form.profile.emergencyContact} onChange={e => setProfile("emergencyContact", e.target.value)} style={inputStyle} /></Field>
      </div>
      <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", margin: "16px 0 8px" }}>Signature</p>
      <SignaturePad value={form.profile.signature} onChange={value => setProfile("signature", value)} />
      {error && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 12 }}>{error}</p>}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
        <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text2)", padding: "8px 12px", ...buttonBase }}>Cancel</button>
        <button onClick={submit} disabled={saving} style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "8px 16px", ...buttonBase }}>
          {saving ? "Adding..." : "Add Profile"}
        </button>
      </div>
    </Modal>
  );
};



/* -- COMPANY DETAILS PAGE ------------------------------------- */
const CompanyDetailsPage = ({ company, roles, users, onBack, onEdit }) => {
  const [docs, setDocs] = useState(company.attachedDocs || []);
  const [loading, setLoading] = useState(false);
  // company.status==="inacti"
  console.log("==CompanyDetailsPage", company)
  useEffect(() => {

    if (!company.attachedDocs || company.attachedDocs.length === 0) {
      setLoading(true);
      companyManagementApi.getDocumentsByCompany(company.id)
        .then(docs => {
          const mapped = docs.map(d => ({
            id: d.companyDocumentsId,
            type: d.documentType,
            name: d.fileName,
            url: d.filePath,
            size: parseInt(d.fileSize, 10) || 0,
            uploadedAt: d.uploadedDate,
            isNew: false,
          }));
          setDocs(mapped);
        })
        .catch(err => console.error("Failed to fetch documents:", err))
        .finally(() => setLoading(false));
    } else {
      setDocs(company.attachedDocs);
    }
  }, [company.id, company.attachedDocs]);

  const acColor = INDUSTRY_COLORS[company.industry] || "#C9A252";
  const assignedCount = users.filter(u => roles[u.id]?.[company.id]).length;

  const item = (label, value) => (
    <div style={{ border: "1px solid var(--border)", background: "var(--bg3)", padding: "10px 12px" }}>
      <p style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 12, color: value ? "var(--text2)" : "var(--text3)", lineHeight: 1.4 }}>{value || "Not provided"}</p>
    </div>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg)" }}>
      <div style={{ padding: "0 24px", height: 52, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "var(--bg2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "pointer" }}><FaArrowLeft /></button>
          <div>
            <p style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 1 }}>Corporate Management</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 400, color: "var(--text)" }}>{company.name}</h1>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* <button onClick={onEdit} style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "6px 14px", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-mono)", cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
            <FaPen /> Edit Company
          </button> */}
          <div style={{ fontSize: 10, color: "var(--text3)", letterSpacing: "0.08em" }}>
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>
        {/* Hero banner */}
        <div style={{ background: "var(--bg2)", border: `1px solid ${acColor}30`, padding: "16px 20px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${acColor},transparent)` }} />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 52, height: 52, background: `${acColor}18`, border: `1px solid ${acColor}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600, color: acColor, flexShrink: 0 }}>{company.logo}</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 400, color: "var(--text)", marginBottom: 8 }}>{company.name}</h2>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {statusBadge(company.status)}{tierBadge(company.tier)}
                <span style={{ fontSize: 10, color: acColor, background: acColor + "15", border: `1px solid ${acColor}30`, padding: "1px 8px", borderRadius: 2, letterSpacing: "0.08em" }}>{company.industry}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              {[{ l: "Members", v: assignedCount }, { l: "Employees", v: company.employees?.toLocaleString?.() || "" }, { l: "Revenue", v: company.revenue || "" }].map(({ l, v }) => (
                <div key={l} style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "var(--font-head)", fontSize: 22, color: acColor, letterSpacing: "0.05em" }}>{v}</p>
                  <p style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--text3)", textTransform: "uppercase", marginTop: 2 }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p style={{ fontSize: 9, letterSpacing: "0.22em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 10 }}>Identity</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
          {item("Country", company.country)}{item("Founded", String(company.founded || ""))}{item("Entity Type", company.entityType)}
          {item("Status", company.status)}{item("Tier", company.tier)}{item("State of Registration", company.stateOfRegistration)}
        </div>

        <p style={{ fontSize: 9, letterSpacing: "0.22em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 10 }}>Tax & Registration</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
          {item("CIN / Registration No.", company.cin)}{item("GST Number", company.gstNumber)}{item("PAN Number", company.panNumber)}
          {item("TAN Number", company.tan)}{item("Tax Regime", company.taxRegime)}{item("Tier", company.tier)}
        </div>

        {company.registeredAddress && (
          <>
            <p style={{ fontSize: 9, letterSpacing: "0.22em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 10 }}>Registered Address</p>
            <div style={{ border: "1px solid var(--border)", background: "var(--bg3)", padding: "12px 14px", marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{company.registeredAddress}</p>
            </div>
          </>
        )}

        <p style={{ fontSize: 9, letterSpacing: "0.22em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 10 }}>
          {/* Attached Documents ({(company.attachedDocs || []).length}) */}
          Attached Documents ({docs.length})
        </p>
        {/* {(!company.attachedDocs || company.attachedDocs.length === 0) ? ( */}
        {loading ? (
          <div style={{ border: "1px solid var(--border)", background: "var(--bg3)", padding: "16px", textAlign: "center" }}>
            <p style={{ fontSize: 11, color: "var(--text3)", fontStyle: "italic" }}>No documents attached.</p>
          </div>
        ) :
          // docs.length === 0 ? 
          (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {/* {company.attachedDocs.map((doc, idx) => { */}
              {docs.map((doc, idx) => {
                const ext = doc.name.split(".").pop().toUpperCase();
                const extColors = { PDF: "#D85A30", JPG: "#1D9E75", JPEG: "#1D9E75", PNG: "#378ADD", DOCX: "#C9A252", DOC: "#C9A252" };
                const extColor = extColors[ext] || "#9B9590";
                return (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg3)", border: "1px solid var(--border)", padding: "10px 12px" }}>
                    <div style={{ width: 32, height: 32, background: extColor + "18", border: `1px solid ${extColor}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: extColor, flexShrink: 0 }}>{ext}</div>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <p style={{ fontSize: 11, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>{doc.name}</p>
                      <p style={{ fontSize: 10, color: "var(--text3)" }}>{doc.size < 1048576 ? (doc.size / 1024).toFixed(1) + " KB" : (doc.size / 1048576).toFixed(1) + " MB"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
};

const UserDetailsModal = ({ user, onClose, roles, companies }) => {
  const profile = getProfile(user);
  const userRoles = Object.entries(roles[user.id] || {}).filter(([, v]) => v).map(([cid, rid]) => ({ company: companies.find(c => String(c.id) === String(cid)), role: ROLES.find(r => r.id === rid) })).filter(x => x.company && x.role);

  const item = (label, value) => (
    <div style={{ border: "1px solid var(--border)", background: "var(--bg3)", padding: "8px 10px" }}>
      <p style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 11, color: value ? "var(--text2)" : "var(--text3)", lineHeight: 1.4 }}>{value || "Not provided"}</p>
    </div>
  );

  return (
    <Modal title={user.name} subtitle="User Profile Details" onClose={onClose}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <img src={user.img || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name)} alt={user.name}
          style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--gold)", background: "var(--bg3)", flexShrink: 0 }}
          onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name); }} />
        <div>
          <p style={{ fontSize: 12, color: "var(--text)", marginBottom: 3 }}>{user.email}</p>
          <span style={{ fontSize: 10, background: "var(--bg4)", color: "var(--text3)", padding: "2px 8px", borderRadius: 2, letterSpacing: "0.08em" }}>{user.department}</span>
        </div>
      </div>
      <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 10 }}>Profile Information</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {item("Phone", profile.phone)}{item("Location", profile.location)}
        {item("Employee ID", profile.employeeId)}{item("Joining Date", profile.joiningDate)}
        {item("Emergency Contact", profile.emergencyContact)}
      </div>
      <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 8 }}>Signature</p>
      <div style={{ border: "1px solid var(--border)", background: "var(--bg3)", padding: 10, minHeight: 72 }}>
        {profile.signature ? <img src={profile.signature} alt="sig" style={{ maxWidth: "100%", height: 70, objectFit: "contain", display: "block" }} />
          : <p style={{ fontSize: 11, color: "var(--text3)", fontStyle: "italic" }}>No signature captured.</p>}
      </div>
      <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", marginTop: 16, marginBottom: 8 }}>Company Role Access</p>
      <div style={{ border: "1px solid var(--border)", background: "var(--bg3)", padding: 10 }}>
        {userRoles.length === 0
          ? <p style={{ fontSize: 11, color: "var(--text3)", fontStyle: "italic" }}>No company access assigned.</p>
          : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {userRoles.map(({ company, role }) => (
              <div key={company.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 22, height: 22, background: `${INDUSTRY_COLORS[company.industry] || "#C9A252"}18`, border: `1px solid ${INDUSTRY_COLORS[company.industry] || "#C9A252"}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 600, color: INDUSTRY_COLORS[company.industry] || "#C9A252", flexShrink: 0 }}>{company.logo}</div>
                  <div>
                    <p style={{ fontSize: 11, color: "var(--text)", marginBottom: 1 }}>{company.name}</p>
                    <p style={{ fontSize: 9, color: "var(--text3)" }}>{company.industry}</p>
                  </div>
                </div>
                <span style={{ fontSize: 10, color: role.color, background: role.color + "15", border: "1px solid " + role.color + "30", padding: "2px 8px", borderRadius: 2, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{role.label}</span>
              </div>
            ))}
          </div>}
      </div>
    </Modal>
  );
};

// UserProfilePage
const UserProfilesPage = ({ users, roles, companies, onViewProfile, onEditProfile, onEditDisclosure, setEditUser }) => (
  <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>

    <TopBar title="Members Profiles" subtitle="Profile Management"
      action={
        <button onClick={() => setEditUser({ isNew: true, id: null, name: "", email: "", department: "", avatar: "", profile: { employeeId: "", location: "", title: "", phone: "", bio: "" }, disclosures: [] })}
          title="Add Member" style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid var(--gold)", background: "transparent", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer" }}>+</button>
      }
    />

    <div style={{ padding: "16px 24px", flex: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
        {users.map((u, i) => {
          const profile = getProfile(u);
          const userRoles = Object.entries(roles[u.id] || {}).filter(([, v]) => v).map(([cid, rid]) => ({ company: companies.find(c => String(c.id) === String(cid)), role: ROLES.find(r => r.id === rid) })).filter(x => x.company && x.role);
          return (
            <div key={u.id} onClick={() => onViewProfile(u)}
              style={{ background: "var(--bg3)", border: "1px solid var(--border)", padding: "16px", animation: "cmFadeUp .3s " + (i * 0.06) + "s ease both", cursor: "pointer", transition: "border-color .15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold)50"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <img src={u.img || "https://ui-avatars.com/api/?name=" + encodeURIComponent(u.name)} alt={u.name}
                  style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--gold)", background: "var(--bg3)", flexShrink: 0 }}
                  onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(u.name); }} />
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>{u.name}</p>
                  <p style={{ fontSize: 10, color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</p>
                  <span style={{ fontSize: 9, background: "var(--bg4)", color: "var(--text3)", padding: "1px 6px", borderRadius: 2, letterSpacing: "0.08em", display: "inline-block", marginTop: 3 }}>{u.department}</span>
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  <button title="Edit profile" onClick={e => { e.stopPropagation(); onEditProfile(u); }} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--gold)", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}><FaUserEdit /></button>
                  <button title="Edit disclosure" onClick={e => { e.stopPropagation(); onEditDisclosure(u); }} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}><FaFileSignature /></button>
                </div>
              </div>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 7 }}>Profile Summary</p>
                <p style={{ fontSize: 11, color: "var(--text2)", marginBottom: 3 }}>Employee ID: {profile.employeeId || "Not provided"}</p>
                <p style={{ fontSize: 11, color: "var(--text2)" }}>Location: {profile.location || "Not provided"}</p>
              </div>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, marginTop: 10 }}>
                <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 7 }}>Company Access ({userRoles.length})</p>
                {userRoles.length === 0 && <p style={{ fontSize: 10, color: "var(--text3)", fontStyle: "italic" }}>No company access assigned</p>}
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {userRoles.slice(0, 1).map(({ company, role }) => (
                    <div key={company.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, overflow: "hidden" }}>
                        <div style={{ width: 18, height: 18, background: `${INDUSTRY_COLORS[company.industry] || "#C9A252"}18`, border: `1px solid ${INDUSTRY_COLORS[company.industry] || "#C9A252"}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 600, color: INDUSTRY_COLORS[company.industry] || "#C9A252", flexShrink: 0 }}>{company.logo}</div>
                        <span style={{ fontSize: 11, color: "var(--text2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{company.name}</span>
                      </div>
                      <span style={{ fontSize: 9, color: role.color, background: role.color + "15", border: "1px solid " + role.color + "30", padding: "1px 6px", borderRadius: 2, letterSpacing: "0.06em", whiteSpace: "nowrap", flexShrink: 0 }}>{role.label}</span>
                    </div>
                  ))}
                  {userRoles.length > 1 && <p style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.08em", marginTop: 1 }}>+ {userRoles.length - 1} more</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);


const UserAccessModal = ({ user, roles, companies, onClose }) => {
  const userRoles = Object.entries(roles[user.id] || {}).filter(([, v]) => v).map(([cid, rid]) => ({ company: companies.find(c => c.id == cid), role: ROLES.find(r => r.id === rid) })).filter(x => x.company && x.role);
  return (
    <Modal title={user.name} subtitle="Company & Role Access" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {userRoles.length === 0 && <p style={{ fontSize: 11, color: "var(--text3)", fontStyle: "italic" }}>No company access assigned.</p>}
        {userRoles.map(({ company, role }) => (
          <div key={company.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, border: "1px solid var(--border)", background: "var(--bg3)", padding: "10px 12px" }}>
            <div>
              <p style={{ fontSize: 12, color: "var(--text)", marginBottom: 2 }}>{company.name}</p>
              <p style={{ fontSize: 10, color: "var(--text3)", letterSpacing: "0.08em" }}>{company.industry} / {company.country}</p>
            </div>
            <span style={{ fontSize: 10, color: role.color, background: role.color + "15", border: "1px solid " + role.color + "30", padding: "2px 8px", borderRadius: 2, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{role.label}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
};


/* -- TOPBAR --------------------------------------------------- */
const TopBar = ({ title, subtitle, action }) => (
  <div style={{ padding: "0 24px", height: 52, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "var(--bg2)" }}>

    <div>
      <p style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 1 }}>{subtitle}</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 400, color: "var(--text)" }}>{title}</h1>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {action}
      <div style={{ width: 1, height: 24, background: "var(--border)" }} />
      <div style={{ fontSize: 10, color: "var(--text3)", letterSpacing: "0.08em" }}>
        {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </div>
    </div>
  </div>
);
const ThemeToggle = ({ theme, setTheme }) => (
  <button
    onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
    title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    style={{
      background: "none",
      border: "1px solid var(--border2)",
      color: "var(--text2)",
      width: 32,
      height: 32,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: 15,
      transition: "all .2s",
      borderRadius: 0,
      fontFamily: "var(--font-mono)",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text2)"; }}
  >
    {theme === "dark" ? "Dark" : "Light"}
  </button>
);
/* -- COMPANIES PAGE ------------------------------------------- */
const CompaniesPage = ({ companies, setCompanies, search, onSearch, onSelectCompany, onAddCompany, onViewCompany, onEditCompany }) => {
  // const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("active");
  const [filterTier, setFilterTier] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [view, setView] = useState("table");
  console.log("onViewCompany", onViewCompany)
  //   const handleSearch = async (val) => {
  //   setSearch(val);
  //   const results = await companyManagementApi.searchCompanies({ companyName: val });
  //   setCompanies(results);
  // };
  const [activeCache, setActiveCache] = useState([]);

  useEffect(() => {
    if (companies.length > 0 && activeCache.length === 0 && filterStatus === "active") {
      setActiveCache(companies);
    }
  }, [companies, activeCache, filterStatus]);
  const handleStatusChange = async (val) => {
    setFilterStatus(val);

    if (val === "active") {
      if (setCompanies && activeCache.length > 0) {
        setCompanies(activeCache);
      }
    } else if (val === "inActive") {
      const results = await companyManagementApi.searchCompanies({ isActive: false });
      if (setCompanies) setCompanies(results);
    } else if (val === "all") {
      const results = await companyManagementApi.searchCompanies({ isActive: null });
      if (setCompanies) setCompanies(results);
    }
  };
  const filtered = companies
    .filter(c => {
      const q = search.toLowerCase();
      const compName = c.name || "";
      const compCountry = c.country || "";

      const matchSearch =
        !q ||
        compName.toLowerCase().includes(q) ||
        compCountry.toLowerCase().includes(q);

      const matchTier =
        filterTier === "all" || c.tier === filterTier;

      return matchSearch && matchTier;
    })
    .sort((a, b) => {
      if (sortBy === "name") return String(a.name || "").localeCompare(String(b.name || ""));
      if (sortBy === "country") return String(a.country || "").localeCompare(String(b.country || ""));
      if (sortBy === "founded") return (Number(a.founded) || 0) - (Number(b.founded) || 0);
      if (sortBy === "tier") return String(a.tier || "").localeCompare(String(b.tier || ""));
      return 0;
    });

  return (
    <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
      <TopBar title="Company Registry" subtitle="Corporate Management" action={
        <button onClick={onAddCompany} style={{ background: "var(--gold)", border: "none", color: "var(--bg)", padding: "6px 14px", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-mono)", cursor: "pointer", fontWeight: 500 }}>+ Add Company</button>
      } />


      <div style={{ padding: "16px 24px", flex: 1 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap", animation: "cmFadeUp .4s .1s ease both" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <svg viewBox="0 0 16 16" fill="none" width="13" height="13" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }}>
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <input value={search} onChange={e => onSearch(e.target.value)} placeholder="Search companies..."
              style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)", padding: "8px 10px 8px 30px", fontSize: 11, outline: "none", borderRadius: 0 }} />
          </div>
          {[{ val: filterStatus, set: setFilterStatus, opts: ["all", "active", "inActive"], label: "Status" },
          // { val: filterTier, set: setFilterTier, opts: ["all", "enterprise", "pro", "starter"], label: "Tier" },
          { val: sortBy, set: setSortBy, opts: ["name", "country", "founded", "tier"], label: "Sort" }
          ].map(({ val, set, opts, label }) => (
            <select key={label} value={val} onChange={e => set(e.target.value)}
              style={{ background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text2)", padding: "8px 10px", fontSize: 11, outline: "none", cursor: "pointer", letterSpacing: "0.05em" }}>
              {/* {opts.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)} */}
              {opts.map(o => {
                const optLabel = o === "name" ? "Company Name" : o === "country" ? "Country Name" : o === "founded" ? "Founded Year" : o.charAt(0).toUpperCase() + o.slice(1);
                return <option key={o} value={o}>{optLabel}</option>;
              })}
            </select>
          ))}
          <div style={{ display: "flex", border: "1px solid var(--border)" }}>
            {[{ v: "table", icon: <svg viewBox="0 0 16 16" fill="none" width="13"><rect x="1" y="1" width="14" height="14" rx="0" stroke="currentColor" strokeWidth="1.2" /><line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.2" /><line x1="1" y1="11" x2="15" y2="11" stroke="currentColor" strokeWidth="1.2" /><line x1="6" y1="1" x2="6" y2="15" stroke="currentColor" strokeWidth="1.2" /></svg> },
            { v: "grid", icon: <svg viewBox="0 0 16 16" fill="none" width="13"><rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" /><rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" /><rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" /><rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" /></svg> }
            ].map(({ v, icon }) => (
              <button key={v} onClick={() => setView(v)} style={{ padding: "6px 10px", background: view === v ? "var(--gold)15" : undefined, border: "none", color: view === v ? "var(--gold)" : "var(--text3)", cursor: "pointer" }}>{icon}</button>
            ))}
          </div>
        </div>

        {/* TABLE VIEW */}
        {view === "table" && (
          <div style={{ border: "1px solid var(--border)", overflow: "hidden", animation: "cmFadeUp .4s .15s ease both" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border2)", background: "var(--bg3)" }}>
                  {["Company", "Country", "Revenue", "Tier", "Actions"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", fontSize: 9, letterSpacing: "0.22em", color: "var(--text3)", textTransform: "uppercase", textAlign: "left", fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {companies.map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid var(--border)", transition: "background .12s", animation: `cmFadeUp .3s ${i * 0.04}s ease both` }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg3)"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, background: `${INDUSTRY_COLORS[c.industry] || "#C9A252"}18`, border: `1px solid ${INDUSTRY_COLORS[c.industry] || "#C9A252"}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, color: INDUSTRY_COLORS[c.industry] || "#C9A252", letterSpacing: "0.05em", flexShrink: 0 }}>{c.logo}</div>
                        <div>
                          <p onClick={() => onViewCompany(c)} style={{ fontSize: 12, fontWeight: 500, color: "var(--text)", marginBottom: 1, cursor: "pointer", transition: "color .15s" }}
                            onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
                            onMouseLeave={e => e.currentTarget.style.color = "var(--text)"}>{c.name}</p>
                          <p style={{ fontSize: 9, color: "var(--text3)", letterSpacing: "0.05em" }}>Est. {c.founded}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "11px 14px", fontSize: 11, color: "var(--text2)" }}>{c.country}</td>
                    <td style={{ padding: "11px 14px", fontSize: 11, color: "var(--gold)", fontVariantNumeric: "tabular-nums" }}>{c.revenue}</td>
                    <td style={{ padding: "11px 14px" }}>{tierBadge(c.tier)}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => onViewCompany(c)} title="View details"
                          style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", padding: "4px 8px", fontSize: 10, cursor: "pointer", fontFamily: "var(--font-mono)", transition: "all .15s", display: "flex", alignItems: "center" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "var(--bg3)"; e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text3)"; }}><FaEye /></button>
                        {/* EDIT navigates to AddCompanyPage edit mode */}
                        <button onClick={() => onEditCompany(c)} title="Edit company"
                          style={{ background: "none", border: "1px solid var(--border2)", color: "var(--gold)", padding: "4px 8px", fontSize: 10, cursor: "pointer", fontFamily: "var(--font-mono)", transition: "all .15s", display: "flex", alignItems: "center" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "var(--gold)15"; e.currentTarget.style.borderColor = "var(--gold)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "var(--border2)"; }}><FaPen /></button>
                        <button onClick={() => onSelectCompany(c)}
                          style={{ background: "none", border: "1px solid var(--border2)", color: "var(--gold)", padding: "4px 10px", fontSize: 9, letterSpacing: "0.12em", cursor: "pointer", fontFamily: "var(--font-mono)", transition: "all .15s", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}
                          onMouseEnter={e => { e.currentTarget.style.background = "var(--gold)15"; e.currentTarget.style.borderColor = "var(--gold)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "var(--border2)"; }}>Members <FaArrowRight size={9} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div style={{ padding: "36px", textAlign: "center", color: "var(--text3)", fontSize: 12 }}>No companies match your search.</div>}
          </div>
        )}

        {/* GRID VIEW */}
        {view === "grid" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14, animation: "cmFadeUp .4s .15s ease both" }}>
            {filtered.map((c, i) => (
              <div key={c.id} style={{ background: "var(--bg3)", border: "1px solid var(--border)", padding: "16px", cursor: "pointer", position: "relative", overflow: "hidden", transition: "border-color .15s", animation: `cmFadeUp .3s ${i * 0.05}s ease both` }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold)50"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                onClick={() => onSelectCompany(c)}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${INDUSTRY_COLORS[c.industry] || "#C9A252"},transparent)` }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ width: 38, height: 38, background: `${INDUSTRY_COLORS[c.industry] || "#C9A252"}15`, border: `1px solid ${INDUSTRY_COLORS[c.industry] || "#C9A252"}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: INDUSTRY_COLORS[c.industry] || "#C9A252", letterSpacing: "0.05em" }}>{c.logo}</div>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button onClick={e => { e.stopPropagation(); onViewCompany(c); }} title="View details"
                      style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, cursor: "pointer", transition: "all .15s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text3)"; }}><FaEye /></button>
                    <button onClick={e => { e.stopPropagation(); onEditCompany(c); }} title="Edit company"
                      style={{ background: "none", border: "1px solid var(--border2)", color: "var(--gold)", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, cursor: "pointer", transition: "all .15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--gold)15"; e.currentTarget.style.borderColor = "var(--gold)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "var(--border2)"; }}><FaPen /></button>
                  </div>
                </div>
                <h3 style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 3, lineHeight: 1.3 }}>{c.name}</h3>
                <p style={{ fontSize: 10, color: "var(--text3)", letterSpacing: "0.05em", marginBottom: 12 }}>{c.industry} · {c.country}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                  <div><p style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 3 }}>Employees</p><p style={{ fontSize: 12, color: "var(--text)" }}>{c.employees.toLocaleString()}</p></div>
                  <div><p style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 3 }}>Revenue</p><p style={{ fontSize: 12, color: "var(--gold)" }}>{c.revenue}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{ fontSize: 10, color: "var(--text3)", marginTop: 12, letterSpacing: "0.05em" }}>{filtered.length} of {companies.length} companies</p>
      </div>
    </div>
  );
};


/* -- ASSIGN MEMBER POPUP ------------------------------------- */
const AssignMemberPopup = ({ company, users, unassigned, onClose, onAssign }) => {
  const [selUser, setSelUser] = useState("");
  const [selRole, setSelRole] = useState("");
  const [saving, setSaving] = useState(false);
  const [memberDIN, setMemberDIN] = useState("");
  const memberOptions = unassigned.map((u) => ({
    id: u.id,
    din: u.profile?.employeeId || u.employeeId || "",
    name: u.name,
  }));
  const handleMemberDIN = (din) => {
    setMemberDIN(din);

    const selected = memberOptions.find(
      (m) => String(m.din).trim() === String(din).trim()
    );

    setSelUser(selected?.id || "");
  };

  const selectedMember = memberOptions.find(
    (m) => String(m.id) === String(selUser)
  ) || {
    din: "",
    name: "",
  };
  const handleAssign = async () => {
    if (!selUser || !selRole) return;
    setSaving(true);
    await onAssign(selUser, selRole);
    setSaving(false);
  };

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 40, background: "#05070bcc", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, animation: "cmFadeUp .18s ease both" }} onClick={onClose}>
      <div style={{ width: "min(400px,100%)", background: "var(--bg2)", border: "1px solid var(--border2)", boxShadow: "0 24px 80px #000b" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", background: "var(--bg3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 9, letterSpacing: "0.25em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 2 }}>Assign Member</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 400, color: "var(--text)" }}>{company.name}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", width: 28, height: 28, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", justifyContent: "center" }}><FaTimes /></button>
        </div>
        <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          {unassigned.length === 0
            ? <p style={{ fontSize: 12, color: "var(--text3)", fontStyle: "italic", textAlign: "center", padding: "16px 0" }}>All members have been assigned to this company.</p>
            : <>
              <Field label="DIN">
                <input

                  value={memberDIN}
                  onChange={(e) => handleMemberDIN(e.target.value)}
                  placeholder="Enter DIN"
                  style={inputStyle}
                />
              </Field>

              <Field label="Name">
                <input

                  value={selectedMember?.name || ""}
                  readOnly
                  style={inputStyle}
                />
              </Field>
              <Field label="Assign Role">
                <select value={selRole} onChange={e => setSelRole(e.target.value)} style={inputStyle}>
                  <option value=""> Choose Role </option>
                  {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}  {r.desc}</option>)}
                </select>
              </Field>
              {selRole && (
                <div style={{ background: "var(--bg3)", border: `1px solid ${ROLES.find(r => r.id === selRole)?.color}30`, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: ROLES.find(r => r.id === selRole)?.color, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 10, color: ROLES.find(r => r.id === selRole)?.color, fontWeight: 500, marginBottom: 1 }}>{ROLES.find(r => r.id === selRole)?.label}</p>
                    <p style={{ fontSize: 9, color: "var(--text3)" }}>{ROLES.find(r => r.id === selRole)?.desc}</p>
                  </div>
                </div>
              )}
            </>}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text2)", padding: "8px 12px", ...buttonBase }}>Cancel</button>
            {unassigned.length > 0 && (
              <button onClick={handleAssign} disabled={saving || !selUser || !selRole}
                style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "8px 16px", ...buttonBase, opacity: (!selUser || !selRole || saving) ? 0.6 : 1, cursor: (!selUser || !selRole || saving) ? "not-allowed" : "pointer" }}>
                {saving ? "Assigning..." : "Assign Member"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CompanyRolesPage = ({ company, onBack, roles, setRoles, users, onRoleSaved, onViewDisclosure }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [editingRoleUserId, setEditingRoleUserId] = useState(null);
  const [editingRoleVal, setEditingRoleVal] = useState("");
  const [savingRoleUserId, setSavingRoleUserId] = useState(null);

  const assigned = users.filter(u => roles[u.id]?.[company.id]).map(u => ({ user: u, roleInfo: ROLES.find(r => r.id === roles[u.id][company.id]) }));
  const unassigned = users.filter(u => !roles[u.id]?.[company.id]);

  const handleAssign = async (userId, roleId) => {
    await companyManagementApi.Actions({ userId, companyId: company.id, roleId });
    setRoles(prev => ({ ...prev, [userId]: { ...prev[userId], [company.id]: roleId } }));
    const u = users.find(x => String(x.id) === String(userId));
    const r = ROLES.find(x => x.id === roleId);
    onRoleSaved?.(`${u?.name || "Member"} assigned as ${r?.label} for ${company.name}.`);
    setShowPopup(false);
  };

  const handleRemove = async (userId) => {
    await companyManagementApi.updateRole({ userId, companyId: company.id, roleId: "" });
    setRoles(prev => ({ ...prev, [userId]: { ...prev[userId], [company.id]: null } }));
    const u = users.find(x => String(x.id) === String(userId));
    onRoleSaved?.(`${u?.name || "Member"} removed from ${company.name}.`);
  };

  const handleEditRoleStart = (userId, currentRoleId) => { setEditingRoleUserId(userId); setEditingRoleVal(currentRoleId || ""); };
  const handleEditRoleSave = async (userId) => {
    if (!editingRoleVal || editingRoleVal === roles[userId]?.[company.id]) { setEditingRoleUserId(null); return; }
    setSavingRoleUserId(userId);
    await companyManagementApi.updateRole({ userId, companyId: company.id, roleId: editingRoleVal });
    setRoles(prev => ({ ...prev, [userId]: { ...prev[userId], [company.id]: editingRoleVal } }));
    const u = users.find(x => String(x.id) === String(userId));
    const r = ROLES.find(x => x.id === editingRoleVal);
    onRoleSaved?.(`${u?.name || "Member"} role updated to ${r?.label} for ${company.name}.`);
    setSavingRoleUserId(null); setEditingRoleUserId(null);
  };
  const handleEditRoleCancel = () => { setEditingRoleUserId(null); setEditingRoleVal(""); };

  return (
    <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", position: "relative" }}>
      <TopBar title={company.name} subtitle="Role Management"
        action={
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onBack}
              style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text2)", padding: "6px 12px", fontSize: 10, letterSpacing: "0.12em", cursor: "pointer", fontFamily: "var(--font-mono)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, transition: "all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text2)"; }}>
              <FaArrowLeft /> Back
            </button>
            <button onClick={() => setShowPopup(true)}
              style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "6px 14px", fontSize: 16, fontFamily: "var(--font-mono)", cursor: "pointer", fontWeight: 700, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
              title="Assign member">+</button>
          </div>
        } />

      <div style={{ padding: "16px 24px", flex: 1 }}>
        {/* Company Info */}
        <div style={{ marginBottom: 20, animation: "cmFadeUp .3s ease both" }}>
          <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 46, height: 46, background: `${INDUSTRY_COLORS[company.industry] || "#C9A252"}15`, border: `1px solid ${INDUSTRY_COLORS[company.industry] || "#C9A252"}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: INDUSTRY_COLORS[company.industry] || "#C9A252", letterSpacing: "0.05em", flexShrink: 0 }}>{company.logo}</div>
            <div>
              <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>{statusBadge(company.status)}{tierBadge(company.tier)}</div>
              <p style={{ fontSize: 11, color: "var(--text2)", letterSpacing: "0.05em" }}>{company.industry} · {company.country} · Est. {company.founded}</p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 24 }}>
              {[{ l: "Members Assigned", v: assigned.length }, { l: "Total Members", v: users.length }, { l: "Revenue", v: company.revenue }].map(({ l, v }) => (
                <div key={l} style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "var(--font-head)", fontSize: 22, color: "var(--gold)", letterSpacing: "0.05em" }}>{v}</p>
                  <p style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--text3)", textTransform: "uppercase" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ border: "1px solid var(--border)", overflow: "hidden", animation: "cmFadeUp .3s .1s ease both" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg3)", borderBottom: "1px solid var(--border2)" }}>
                {["Member", "Department", "Email", "Assigned Role", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", fontSize: 9, letterSpacing: "0.22em", color: "var(--text3)", textTransform: "uppercase", textAlign: "left", fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assigned.length === 0 && (
                <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "var(--text3)", fontSize: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, border: "1px solid var(--border2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "var(--gold)", cursor: "pointer" }} onClick={() => setShowPopup(true)}>+</div>
                    <p style={{ fontStyle: "italic" }}>No members assigned. Click <strong style={{ color: "var(--gold)" }}>+</strong> to add members.</p>
                  </div>
                </td></tr>
              )}
              {assigned.map(({ user: u, roleInfo }, i) => {
                const isEditing = editingRoleUserId === u.id;
                const isSaving = savingRoleUserId === u.id;
                const pendingRole = ROLES.find(r => r.id === editingRoleVal);
                const disclosureCount = getDisclosures(u).length;
                return (
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--border)", transition: "background .12s", animation: `cmFadeUp .3s ${i * 0.05}s ease both` }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg3)"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <img src={u.img || "https://ui-avatars.com/api/?name=" + encodeURIComponent(u.name)} alt={u.name}
                          style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: `1px solid ${roleInfo?.color || "var(--gold)"}`, background: "var(--bg3)", flexShrink: 0 }}
                          onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(u.name); }} />
                        <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{u.name}</p>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}><span style={{ fontSize: 10, color: "var(--text3)", letterSpacing: "0.05em", background: "var(--bg4)", padding: "2px 8px", borderRadius: 2 }}>{u.department}</span></td>
                    <td style={{ padding: "12px 16px", fontSize: 11, color: "var(--text2)", letterSpacing: "0.02em" }}>{u.email}</td>
                    <td style={{ padding: "12px 16px" }}>
                      {isEditing
                        ? <select value={editingRoleVal} onChange={e => setEditingRoleVal(e.target.value)} autoFocus
                          style={{ background: "var(--bg3)", border: `1px solid ${pendingRole ? pendingRole.color + "60" : "var(--border2)"}`, color: pendingRole ? pendingRole.color : "var(--text2)", padding: "5px 8px", fontSize: 10, outline: "none", cursor: "pointer", borderRadius: 2, width: "100%", letterSpacing: "0.04em" }}>
                          {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                        </select>
                        : <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: roleInfo?.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: roleInfo?.color, fontWeight: 500 }}>{roleInfo?.label}</span>
                        </div>}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {isEditing
                          ? <>
                            <button onClick={() => handleEditRoleSave(u.id)} disabled={isSaving} title="Save" style={{ background: "none", border: "1px solid var(--gold)50", color: "var(--gold)", padding: "5px 8px", fontSize: 10, cursor: isSaving ? "not-allowed" : "pointer", transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={e => e.currentTarget.style.background = "var(--gold)15"} onMouseLeave={e => e.currentTarget.style.background = "none"}>{isSaving ? "..." : <FaCheck />}</button>
                            <button onClick={handleEditRoleCancel} title="Cancel" style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", padding: "5px 8px", fontSize: 10, cursor: "pointer", transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center" }}><FaTimes /></button>
                          </>
                          : <>
                            <button onClick={() => handleEditRoleStart(u.id, roles[u.id]?.[company.id])} title="Edit role" style={{ background: "none", border: "1px solid var(--border2)", color: "var(--gold)", padding: "5px 8px", fontSize: 10, cursor: "pointer", transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={e => e.currentTarget.style.background = "var(--gold)15"} onMouseLeave={e => e.currentTarget.style.background = "none"}><FaPen /></button>
                            <button onClick={() => onViewDisclosure?.(u)} title="View Disclosure" style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", padding: "5px 8px", fontSize: 10, cursor: "pointer", transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }} onMouseEnter={e => { e.currentTarget.style.background = "var(--bg4)"; e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }} onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text3)"; }}>
                              <FaFileAlt />
                              {disclosureCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, width: 12, height: 12, borderRadius: "50%", background: "var(--gold)", color: "var(--bg)", fontSize: 7, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{disclosureCount}</span>}
                            </button>
                            <button onClick={() => handleRemove(u.id)} title="Remove member" style={{ background: "none", border: "1px solid var(--border2)", color: "var(--red)", padding: "5px 8px", fontSize: 10, cursor: "pointer", transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={e => { e.currentTarget.style.background = "#ff444420"; e.currentTarget.style.borderColor = "var(--red)"; }} onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "var(--border2)"; }}><FaTimes /></button>
                          </>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showPopup &&
        <AssignMemberPopup
          company={company}
          users={users}
          unassigned={unassigned}
          onClose={() => setShowPopup(false)}
          onAssign={handleAssign}
        />}
    </div>
  );
};


/* -- ROLE MATRIX PAGE ----------------------------------------- */
const RoleMatrixPage = ({ roles, setRoles, companies, users, onRoleSaved }) => {
  const [saving, setSaving] = useState(null);
  const handleChange = async (userId, companyId, role) => {
    const key = userId + "-" + companyId; setSaving(key);
    await companyManagementApi.updateRole({ userId, companyId, roleId: role });
    setRoles(p => ({ ...p, [userId]: { ...p[userId], [companyId]: role || null } }));
    setSaving(null);
    const changedUser = users.find(u => u.id === userId);
    const changedCompany = companies.find(c => c.id === companyId);
    const changedRole = ROLES.find(r => r.id === role);
    onRoleSaved?.((changedUser?.name || "User") + " " + (changedRole ? ("assigned as " + changedRole.label) : "role removed") + " for " + (changedCompany?.name || "company") + ".");
  };
  return (
    <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
      <TopBar title="Assign Roles For Board Members" subtitle="Access Control" />
      <div style={{ padding: "16px 24px", flex: 1 }}>
        <p style={{ fontSize: 11, color: "var(--text3)", marginBottom: 16, animation: "cmFadeUp .3s ease both" }}>Overview of all user-company role assignments across your organization.</p>
        <div style={{ overflowX: "auto", border: "1px solid var(--border)", animation: "cmFadeUp .3s .1s ease both" }}>
          <table style={{ borderCollapse: "collapse", minWidth: "100%" }}>
            <thead>
              <tr style={{ background: "var(--bg3)", borderBottom: "1px solid var(--border2)" }}>
                <th style={{ padding: "11px 16px", fontSize: 9, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", textAlign: "left", position: "sticky", left: 0, background: "var(--bg3)", minWidth: 180, borderRight: "1px solid var(--border)" }}>User</th>
                {companies.map(c => (
                  <th key={c.id} style={{ padding: "8px 10px", fontSize: 9, letterSpacing: "0.1em", color: "var(--text3)", textTransform: "uppercase", textAlign: "center", minWidth: 120 }}>
                    <div style={{ marginBottom: 3 }}><span style={{ color: INDUSTRY_COLORS[c.industry] || "var(--gold)", fontSize: 9 }}>{c.logo}</span></div>
                    <span style={{ fontSize: 8 }}>{c.name.split(" ").slice(0, 2).join(" ")}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--border)", animation: `cmFadeUp .3s ${i * 0.05}s ease both` }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg3)"}
                  onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <td style={{ padding: "10px 16px", position: "sticky", left: 0, background: "var(--bg2)", borderRight: "1px solid var(--border)", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Avatar initials={u.avatar} size={28} color="var(--gold)" />
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text)" }}>{u.name}</p>
                        <p style={{ fontSize: 9, color: "var(--text3)" }}>{u.department}</p>
                      </div>
                    </div>
                  </td>
                  {companies.map(c => {
                    const key = `${u.id}-${c.id}`;
                    const cur = roles[u.id] && roles[u.id][c.id];
                    const ri = ROLES.find(r => r.id === cur);
                    const isSaving = saving === key;
                    return (
                      <td key={c.id} style={{ padding: "8px 10px", textAlign: "center", borderLeft: "1px solid var(--border)" }}>
                        {isSaving
                          ? <div style={{ fontSize: 10, color: "var(--gold)", animation: "cmPulse 1s infinite", letterSpacing: "0.1em" }}>...</div>
                          : <select value={cur || ""} onChange={e => handleChange(u.id, c.id, e.target.value)}
                            style={{ background: "none", border: `1px solid ${ri ? ri.color + "40" : "var(--border2)"}`, color: ri ? ri.color : "var(--text3)", padding: "3px 6px", fontSize: 10, outline: "none", cursor: "pointer", borderRadius: 2, width: "100%", textAlign: "center" }}>
                            <option value=""></option>
                            {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                          </select>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


/* -- MEMBER DIRECTORY ------------------------------------------ */
const MemberDirectoryCompanyList = ({ companies, roles, users, onSelectCompany, onAddUser }) => (
  <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
    <TopBar title="Member Directory" subtitle="People & Access"
      action={<button onClick={onAddUser} style={{ background: "var(--gold)", border: "none", color: "var(--bg)", padding: "6px 14px", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-mono)", cursor: "pointer", fontWeight: 500 }}>+ Member Profile</button>} />
    <div style={{ padding: "16px 24px", flex: 1 }}>
      <p style={{ fontSize: 11, color: "var(--text3)", marginBottom: 16, letterSpacing: "0.05em", animation: "cmFadeUp .3s ease both" }}>Select a company to view its assigned members.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 14 }}>
        {companies.map((c, i) => {
          const memberCount = users.filter(u => roles[u.id]?.[c.id]).length;
          const acColor = INDUSTRY_COLORS[c.industry] || "#C9A252";
          return (
            <div key={c.id} onClick={() => onSelectCompany(c)}
              style={{ background: "var(--bg3)", border: "1px solid var(--border)", padding: "16px", cursor: "pointer", position: "relative", overflow: "hidden", transition: "border-color .15s", animation: `cmFadeUp .3s ${i * 0.05}s ease both` }}
              onMouseEnter={e => e.currentTarget.style.borderColor = acColor + "70"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${acColor},transparent)` }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ width: 38, height: 38, background: `${acColor}15`, border: `1px solid ${acColor}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: acColor, letterSpacing: "0.05em" }}>{c.logo}</div>
                {statusBadge(c.status)}
              </div>
              <h3 style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 3, lineHeight: 1.3 }}>{c.name}</h3>
              <p style={{ fontSize: 10, color: "var(--text3)", letterSpacing: "0.05em", marginBottom: 12 }}>{c.industry} · {c.country}</p>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 3 }}>Members Assigned</p>
                  <p style={{ fontFamily: "var(--font-head)", fontSize: 20, color: acColor }}>{memberCount}</p>
                </div>
                <div style={{ display: "flex" }}>
                  {users.filter(u => roles[u.id]?.[c.id]).slice(0, 4).map((u, idx) => (
                    <div key={u.id} style={{ width: 24, height: 24, borderRadius: "50%", background: `${acColor}20`, border: `2px solid var(--bg3)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: acColor, fontWeight: 600, marginLeft: idx > 0 ? -6 : 0 }}>{u.avatar}</div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 5, color: acColor }}>
                <span style={{ fontSize: 10, letterSpacing: "0.08em" }}>View Members</span>
                <FaArrowRight size={9} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const CompanyMembersPage = ({ company, roles, companies, users, onBack, onAddUser, onAccessUser, onViewDisclosure }) => {
  const acColor = INDUSTRY_COLORS[company.industry] || "#C9A252";
  const companyUsers = users.filter(u => roles[u.id]?.[company.id]);

  return (
    <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
      <TopBar title={company.name} subtitle="Member Directory"
        action={
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onBack}
              style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text2)", padding: "6px 12px", fontSize: 10, letterSpacing: "0.12em", cursor: "pointer", fontFamily: "var(--font-mono)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, transition: "all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text2)"; }}>
              <FaArrowLeft /> Companies
            </button>
            <button onClick={onAddUser} style={{ background: "var(--gold)", border: "none", color: "var(--bg)", padding: "6px 14px", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-mono)", cursor: "pointer", fontWeight: 500 }}>+ Member Profile</button>
          </div>
        } />
      <div style={{ padding: "16px 24px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, background: "var(--bg3)", border: "1px solid var(--border)", padding: "12px 16px", animation: "cmFadeUp .3s ease both" }}>
          <div style={{ width: 38, height: 38, background: `${acColor}15`, border: `1px solid ${acColor}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: acColor }}>{company.logo}</div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>{company.name}</p>
            <p style={{ fontSize: 10, color: "var(--text3)" }}>{company.industry} · {company.country}</p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>{statusBadge(company.status)}{tierBadge(company.tier)}</div>
          <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 16, marginLeft: 6 }}>
            <p style={{ fontFamily: "var(--font-head)", fontSize: 22, color: acColor }}>{companyUsers.length}</p>
            <p style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--text3)", textTransform: "uppercase" }}>Members</p>
          </div>
        </div>

        {companyUsers.length === 0 && <div style={{ textAlign: "center", padding: "36px", color: "var(--text3)", fontSize: 12, fontStyle: "italic" }}>No members assigned to this company yet.</div>}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
          {companyUsers.map((u, i) => {
            const userRoles = Object.entries(roles[u.id] || {}).filter(([, v]) => v).map(([cid, rid]) => ({ company: companies.find(c => c.id == cid), role: ROLES.find(r => r.id === rid) })).filter(x => x.company && x.role);
            const visibleRoles = userRoles.slice(0, 3);
            const disclosureCount = (u.disclosures || []).length;
            const thisRole = ROLES.find(r => r.id === roles[u.id]?.[company.id]);

            return (
              <div key={u.id} onClick={() => onAccessUser(u)}
                style={{ background: "var(--bg3)", border: "1px solid var(--border)", padding: "16px", animation: "cmFadeUp .3s " + (i * 0.06) + "s ease both", cursor: "pointer", transition: "border-color .15s", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold)50"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                {thisRole && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${thisRole.color},transparent)` }} />}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <Avatar initials={u.avatar} size={38} color={thisRole?.color || "var(--gold)"} />
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>{u.name}</p>
                    <p style={{ fontSize: 10, color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</p>
                    {thisRole && <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: thisRole.color }} /><span style={{ fontSize: 9, color: thisRole.color, letterSpacing: "0.06em" }}>{thisRole.label}</span></div>}
                  </div>
                  <button title="View Disclosure History" onClick={e => { e.stopPropagation(); onViewDisclosure(u); }}
                    style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", position: "relative", transition: "all .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text3)"; }}>
                    <FaFileAlt />
                    {disclosureCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, width: 13, height: 13, borderRadius: "50%", background: "var(--gold)", color: "var(--bg)", fontSize: 7, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{disclosureCount}</span>}
                  </button>
                </div>

                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                  <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 7 }}>All Company Access ({userRoles.length})</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {userRoles.length === 0 && <p style={{ fontSize: 10, color: "var(--text3)", fontStyle: "italic" }}>No company access assigned</p>}
                    {visibleRoles.map(({ company: rc, role }) => (
                      <div key={rc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 11, color: "var(--text2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{rc.name.split(" ").slice(0, 2).join(" ")}</span>
                        <span style={{ fontSize: 9, color: role.color, background: role.color + "15", border: "1px solid " + role.color + "30", padding: "1px 8px", borderRadius: 2, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{role.label}</span>
                      </div>
                    ))}
                    {userRoles.length > 3 && <p style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.08em", marginTop: 1 }}>+ {userRoles.length - 3} more companies</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const UsersPage = ({ roles, companies, users, onAddUser, onAccessUser, onViewDisclosure, directoryCompany, onSelectDirectoryCompany, onBackToDirectory }) => {
  if (!directoryCompany) {
    return <MemberDirectoryCompanyList companies={companies} roles={roles} users={users} onSelectCompany={onSelectDirectoryCompany} onAddUser={onAddUser} />;
  }
  return <CompanyMembersPage company={directoryCompany} roles={roles} companies={companies} users={users} onBack={onBackToDirectory} onAddUser={onAddUser} onAccessUser={onAccessUser} onViewDisclosure={onViewDisclosure} />;
};


const DisclosureViewModal = ({ user, onClose }) => {
  const list = getDisclosures(user);
  return (
    <Modal title={user.name} subtitle="Disclosure History" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {list.length === 0 && <p style={{ fontSize: 11, color: "var(--text3)", fontStyle: "italic" }}>No disclosure companies on record.</p>}
        {list.map((d, i) => (
          <div key={i} style={{ border: "1px solid var(--border)", background: "var(--bg3)", padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{d.companyName}</p>
              <span style={{ fontSize: 10, padding: "1px 8px", borderRadius: 2, letterSpacing: "0.08em", whiteSpace: "nowrap", color: d.currentStatus === "Currently Working" ? "#1D9E75" : d.currentStatus === "Notice Period" ? "#BA7517" : "#9B9590", background: d.currentStatus === "Currently Working" ? "#1D9E7520" : d.currentStatus === "Notice Period" ? "#BA751720" : "#9B959020", border: `1px solid ${d.currentStatus === "Currently Working" ? "#1D9E7530" : d.currentStatus === "Notice Period" ? "#BA751730" : "#9B959030"}` }}>{d.currentStatus}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[["Position", d.position], ["From", d.fromDate], ["To", d.toDate || "Present"]].map(([l, v]) => (
                <div key={l} style={{ border: "1px solid var(--border)", background: "var(--bg2)", padding: "6px 8px" }}>
                  <p style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 3 }}>{l}</p>
                  <p style={{ fontSize: 11, color: "var(--text2)" }}>{v || ""}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};


const AnalyticsPage = ({ roles, companies }) => {
  const byIndustry = {};
  companies.forEach(c => { byIndustry[c.industry] = (byIndustry[c.industry] || 0) + 1; });
  const totalRoles = Object.values(roles).reduce((acc, cr) => acc + Object.values(cr).filter(Boolean).length, 0);

  return (
    <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
      <TopBar title="Analytics Overview" subtitle="Insights & Metrics" />
      <div style={{ padding: "16px 24px", flex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 18 }}>
          {[{ l: "Total Role Assignments", v: totalRoles, c: "var(--gold)" }, { l: "Active Companies", v: companies.filter(c => c.status === "active").length, c: "var(--teal)" }, { l: "Enterprise Clients", v: companies.filter(c => c.tier === "enterprise").length, c: "var(--blue)" }, { l: "Total Headcount", v: companies.reduce((a, c) => a + c.employees, 0).toLocaleString(), c: "var(--amber)" }].map(({ l, v, c }) => (
            <div key={l} style={{ background: "var(--bg3)", border: "1px solid var(--border)", padding: "16px 20px", position: "relative", overflow: "hidden", animation: "cmFadeUp .4s ease both" }}>
              <div style={{ position: "absolute", right: 0, top: 0, width: 3, height: "100%", background: c, opacity: 0.7 }} />
              <p style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 8 }}>{l}</p>
              <p style={{ fontFamily: "var(--font-head)", fontSize: 36, color: c, letterSpacing: "0.05em" }}>{v}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", padding: "16px", animation: "cmFadeUp .4s .1s ease both" }}>
            <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 12 }}>Industry Breakdown</p>
            {Object.entries(byIndustry).sort((a, b) => b[1] - a[1]).map(([ind, count]) => {
              const pct = (count / companies.length) * 100;
              return (
                <div key={ind} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "var(--text2)" }}>{ind}</span>
                    <span style={{ fontSize: 11, color: INDUSTRY_COLORS[ind] || "var(--gold)" }}>{count}</span>
                  </div>
                  <div style={{ height: 3, background: "var(--bg4)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: INDUSTRY_COLORS[ind] || "var(--gold)", borderRadius: 2, transition: "width .5s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", padding: "16px", animation: "cmFadeUp .4s .15s ease both" }}>
            <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 12 }}>Role Distribution</p>
            {ROLES.map(r => {
              const realCount = Object.values(roles).flatMap(cr => Object.values(cr)).filter(v => v === r.id).length;
              return (
                <div key={r.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: r.color }} />
                      <span style={{ fontSize: 11, color: "var(--text2)" }}>{r.label}</span>
                    </div>
                    <span style={{ fontSize: 11, color: r.color }}>{realCount}</span>
                  </div>
                  <div style={{ height: 3, background: "var(--bg4)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(realCount / (totalRoles || 1)) * 100}%`, background: r.color, borderRadius: 2, transition: "width .5s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaceholderPage = ({ title }) => (
  <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
    <TopBar title={title} subtitle="System" />
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "var(--text3)" }}>
      <div style={{ width: 40, height: 40, border: "1px solid var(--border2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>?</div>
      <p style={{ fontSize: 12, letterSpacing: "0.1em" }}>{title}  Coming Soon</p>
    </div>
  </div>
);

/* -- APP SHELL ------------------------------------------------ */
const CompanyManagement = () => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("companies");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState({});
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [addingCompany, setAddingCompany] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [viewingCompany, setViewingCompany] = useState(null);

  const [directoryCompany, setDirectoryCompany] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [disclosureUser, setDisclosureUser] = useState(null);
  const [accessUser, setAccessUser] = useState(null);
  const [profileDetailsUser, setProfileDetailsUser] = useState(null);
  const [viewDisclosureUser, setViewDisclosureUser] = useState(null);
  // Add to top of CompanyManagement component:
  const [theme, setTheme] = useState("dark");

  // In your return, wrap the outermost div:
  <div className={`company-management ${theme === "light" ? "light-mode" : ""}`}></div>
  useEffect(() => {
    let active = true;
    companyManagementApi.getBootstrap().then(({ companies: apiCompanies, users: apiUsers, roleAssignments }) => {
      if (!active) return;
      setCompanies(apiCompanies);
      setUsers(apiUsers);
      setRoles(buildRoleAssignments(apiUsers, apiCompanies, roleAssignments));
      setLoadingData(false);
    });
    return () => { active = false; };
  }, []);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const handleSaveProfile = (userId, patch) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...patch } : u));
    setProfileUser(null);
    showToast("Member profile updated successfully.");
  };

  const handleSaveDisclosure = (userId, disclosures) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, disclosures } : u));
    setDisclosureUser(null);
    showToast("Disclosure details updated successfully.");
  };

  const handleAddCompany = async (payload) => {
    // const created = await companyManagementApi.createCompany(payload);
    // const fullCompany = { ...created, attachedDocs: payload.attachedDocs || [] };
    setCompanies(prev => [payload, ...prev]);
    setRoles(prev => {
      const next = { ...prev };
      users.forEach(u => {
        next[u.id] = {
          ...(next[u.id] || {}),
          [payload.id]: null
        };
      });
      return next;
    });
    const name = payload.name || payload.companyName;
    showToast(`${name} added successfully.`);
  };

  const handleAddUser = async (payload) => {
    const avatar = payload.avatar || payload.name.split(" ").map(x => x[0]).join("").slice(0, 2).toUpperCase();
    const created = await companyManagementApi.createUser({ name: payload.name, email: payload.email, department: payload.department, avatar });
    const enriched = { ...created, name: payload.name, email: payload.email, department: payload.department, avatar, profile: payload.profile, disclosures: [] };
    setUsers(prev => [enriched, ...prev]);
    setRoles(prev => ({ ...prev, [enriched.id]: Object.fromEntries(companies.map(c => [c.id, null])) }));
    showToast(enriched.name + " added successfully.");
  };

  const handleSearch = async (val) => {
    setSearch(val);
    if (!val.trim()) {
      const { companies: allCompanies } = await companyManagementApi.getBootstrap();
      setCompanies(allCompanies);
      return;
    }
    const results = await companyManagementApi.searchCompanies({ companyName: val });
    setCompanies(results);
  };
  // handleEditCompany: updates the companies array with the edited payload
  const handleEditCompany = async (payload) => {
    setCompanies(prev =>
      prev.map(c =>
        c.id === editingCompany.id
          ? {
            ...c,
            ...payload,
            id: editingCompany.id,
            logo: payload.logo || c.logo || payload.name.split(" ").map(x => x[0]).join("").slice(0, 2).toUpperCase(),
            attachedDocs: payload.attachedDocs || [],
          }
          : c
      )
    );

    setEditingCompany(null);
    showToast(payload.name + " updated successfully.");
  };

  const handleSelectCompany = (c) => { setSelectedCompany(c); setPage("company_roles"); };
  const handleBack = () => { setSelectedCompany(null); setPage("companies"); };
  const handleSetPage = (p) => { setPage(p); setSelectedCompany(null); };
  console.log("setViewingCompany", viewingCompany)
  const renderPage = () => {
    if (loadingData) return <PlaceholderPage title="Loading Data" />;

    // AddCompanyPage handles both adding and editing
    if (addingCompany || editingCompany)
      return (
        <AddCompanyPage
          onBack={() => { setAddingCompany(false); setEditingCompany(null); }}
          onCreate={editingCompany ? handleEditCompany : handleAddCompany}
          initial={editingCompany}
          users={users}
        />
      );

    if (page === "company_roles" && selectedCompany)
      return (
        <CompanyRolesPage
          company={selectedCompany}
          onBack={handleBack}
          roles={roles}
          setRoles={setRoles}
          users={users}
          onRoleSaved={showToast}
          onViewDisclosure={setViewDisclosureUser}
        />
      );

    if (viewingCompany)
      return (
        <CompanyDetailsPage
          company={viewingCompany}
          roles={roles}
          users={users}
          onBack={() => setViewingCompany(null)}
          // Edit from details page ? navigate to AddCompanyPage edit mode
          onEdit={() => { setEditingCompany(viewingCompany); setViewingCompany(null); }}
        />
      );

    if (page === "companies")
      return (
        <CompaniesPage
          companies={companies}
          setCompanies={setCompanies}
          search={search}
          onSearch={handleSearch}
          onSelectCompany={handleSelectCompany}
          onAddCompany={() => setAddingCompany(true)}
          onViewCompany={setViewingCompany}
          // Edit from company list ? navigate to AddCompanyPage edit mode
          onEditCompany={c => setEditingCompany(c)}
        />
      );

    if (page === "roles")
      return <RoleMatrixPage roles={roles} setRoles={setRoles} companies={companies} users={users} onRoleSaved={showToast} />;

    if (page === "users")
      return (
        <UsersPage
          roles={roles} companies={companies} users={users}
          onAddUser={() => setModal("user")}
          onAccessUser={setAccessUser}
          onViewDisclosure={setViewDisclosureUser}
          directoryCompany={directoryCompany}
          onSelectDirectoryCompany={setDirectoryCompany}
          onBackToDirectory={() => setDirectoryCompany(null)}
        />
      );

    if (page === "analytics")
      return <AnalyticsPage roles={roles} companies={companies} />;
  };

  const activePage = page === "company_roles" ? "companies" : page;

  return (
    <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", position: "relative" }}>
      {renderPage()}

      {modal === "user" && <AddUserModal onClose={() => setModal(null)} onCreate={handleAddUser} />}
      {accessUser && <UserAccessModal user={accessUser} roles={roles} companies={companies} onClose={() => setAccessUser(null)} />}
      {profileDetailsUser && <UserDetailsModal user={profileDetailsUser} roles={roles} companies={companies} onClose={() => setProfileDetailsUser(null)} />}
      {viewDisclosureUser && <DisclosureViewModal user={viewDisclosureUser} onClose={() => setViewDisclosureUser(null)} />}
      {profileUser && <UserProfileModal user={profileUser} onClose={() => setProfileUser(null)} onSave={handleSaveProfile} />}
      {disclosureUser && (
        <DisclosureModal user={disclosureUser} onClose={() => setDisclosureUser(null)}
          onSave={(id, disclosures) => {
            setUsers(prev => prev.map(u => u.id === id ? { ...u, disclosures } : u));
            setDisclosureUser(null);
            showToast("Disclosure updated successfully.");
          }} />
      )}
      <Toast message={toast} />
    </div>
  );
};

export default CompanyManagement;
