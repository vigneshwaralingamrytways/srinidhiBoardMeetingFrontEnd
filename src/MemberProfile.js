import React, { useState, useEffect, useRef } from 'react';
import './MemberProfile.css';
import { companyManagementApi } from './companyManagementApi';
import {
  FaUserEdit,
  FaFileSignature,
  FaUser,
  FaArrowLeft,
  FaArrowRight,
  FaCheck, FaTimes,
  FaMoon,
  FaSun,
  FaFile
} from 'react-icons/fa';
import { FaArrowRotateRight } from 'react-icons/fa6';

/* -- STATIC DATA ---------------------------------------------- */
const ROLES = [
  { id: "Executive DIrector", label: "Executive DIrector", color: "#C9A252", desc: "Full system access" },
  { id: "Director", label: "Director", color: "#378ADD", desc: "Manage users & settings" },
  { id: "Board Member", label: "Board Member", color: "#1D9E75", desc: "View & edit company data" },
];

const INDUSTRY_COLORS = {
  Finance: "#C9A252", Healthcare: "#1D9E75", Aerospace: "#378ADD",
  Technology: "#BA7517", "Supply Chain": "#D85A30", Media: "#D854A0",
  Energy: "#639922", Cybersecurity: "#9B59B6"
};

const buttonBase = { fontFamily: "var(--font-mono)", cursor: "pointer", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500 };
const inputStyle = { background: "var(--bg3)", border: "1px solid var(--border2)", color: "var(--text)", padding: "11px 12px", fontSize: 12, outline: "none", borderRadius: 0, width: "100%" };

const emptyProfile = {
  phone: "",
  education: "",
  experience: "",
  employeeId: "",
  joiningDate: "",
  emergencyContact: "",
  signature: "",
  dateOfBirth: "",
  gender: "",
  nationality: "",
  passportId: "",
  residentialAddress: "",
  mailingAddress: "",
  contactNo: "",
  professionalEntries: [],
  shareholdings: [],
  kycDocuments: [],
  din: "",
  panCard: "",
  directorshipsOther: "",
  declarationOfIndependence: "No",
  shareholdingDetails: "",
  relatedPartyDisclosures: "",
  bankAccountDetails: "",
  skills: [],
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

const emptyProfEntry = {
  companyName: "",
  designation: "",
  sharesHeld: "",
  sharePercentage: "",
};

const emptyShareholding = {
  companyName: "",
  sharesHeld: "",
  percentageHeld: "",
};

const emptyKycDoc = {
  id: "",
  name: "",
  type: "",
  idNumber: "",
  expiry: "",
  fileData: "",
  mimeType: "",
};

/* -- HELPERS -------------------------------------------------- */
const buildRoleAssignments = (users, companies, assignments = {}) => {
  const next = {};
  users.forEach(u => {
    next[u.id] = {};
    companies.forEach(c => { next[u.id][c.id] = assignments[u.id]?.[c.id] || null; });
  });
  return next;
};

const getProfile = u => ({
  ...emptyProfile,
  ...(u.profile || {}),
  phone: u.phone || u.profile?.phone || "",
  location: u.location || u.profile?.location || "",
  employeeId: u.employeeId || u.profile?.employeeId || "",
  joiningDate: u.joiningDate || u.profile?.joiningDate || "",
  emergencyContact: u.emergencyContact || u.profile?.emergencyContact || "",
  signature: u.signature || u.profile?.signature || ""
});

const getDisclosures = u => Array.isArray(u.disclosures) ? u.disclosures : (u.disclosure ? [u.disclosure] : []);

/* -- SHARED UI COMPONENTS ------------------------------------- */
const Toast = ({ message }) => message ? (
  <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 50, background: "var(--bg3)", border: "1px solid var(--gold)50", borderLeft: "3px solid var(--gold)", color: "var(--text)", padding: "14px 18px", boxShadow: "0 18px 50px #0008", animation: "cmFadeUp .25s ease both", maxWidth: 360 }}>
    <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 4 }}>Success</p>
    <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{message}</p>
  </div>
) : null;

const Modal = ({ title, subtitle, onClose, children, headerContent }) => (
  <div
    style={{ position: "fixed", inset: 0, zIndex: 40, background: "#05070bcc", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "cmFadeUp .18s ease both" }}
    onClick={onClose}
  >
    <div
      style={{ width: "min(680px,100%)", maxHeight: "86vh", overflow: "auto", background: "var(--bg2)", border: "1px solid var(--border2)", boxShadow: "0 24px 80px #000b", position: "relative" }}
      onClick={e => e.stopPropagation()}
    >
      <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, background: "var(--bg3)" }}>
        {headerContent || (
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 4 }}>{subtitle}</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400, color: "var(--text)" }}>{title}</h2>
          </div>
        )}
        <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", width: 32, height: 32, fontSize: 16, flexShrink: 0, ...buttonBase }}>x</button>
      </div>
      <div style={{ padding: 18 }}>{children}</div>
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <span style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase" }}>{label}</span>
    {children}
  </label>
);

const TopBar = ({ title, subtitle, action, theme, setTheme }) => (
  <div style={{ padding: "0 32px", height: 64, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "var(--bg2)" }}>
    <div>
      <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 2 }}>{subtitle}</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, color: "var(--text)" }}>{title}</h1>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {action}
      {setTheme && (
        <button
          onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
          style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text2)", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 15, fontFamily: "var(--font-mono)", transition: "all .2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text2)"; }}
        >
          {theme === "dark" ? <FaMoon /> : <FaSun />}
        </button>
      )}
      <div style={{ fontSize: 11, color: "var(--text3)", letterSpacing: "0.08em" }}>
        {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </div>
    </div>
  </div>
);

/* -- SIGNATURE PAD -------------------------------------------- */
const SignaturePad = ({ value, onChange }) => {
  const ref = useRef(null), drawing = useRef(false);
  const point = e => { const r = ref.current.getBoundingClientRect(), s = e.touches?.[0] || e; return { x: s.clientX - r.left, y: s.clientY - r.top }; };
  const start = e => { e.preventDefault(); const c = ref.current, ctx = c.getContext("2d"), p = point(e); drawing.current = true; ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const move = e => { if (!drawing.current) return; e.preventDefault(); const c = ref.current, ctx = c.getContext("2d"), p = point(e); ctx.lineTo(p.x, p.y); ctx.strokeStyle = "#C9A252"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.stroke(); onChange(c.toDataURL("image/png")); };
  const stop = () => { drawing.current = false; };
  const clear = () => { const c = ref.current; c.getContext("2d").clearRect(0, 0, c.width, c.height); onChange(""); };
  useEffect(() => { if (!value || !ref.current) return; const img = new Image(); img.onload = () => ref.current.getContext("2d").drawImage(img, 0, 0); img.src = value; }, [value]);
  return (
    <div>
      <canvas ref={ref} width={480} height={130} onMouseDown={start} onMouseMove={move} onMouseUp={stop} onMouseLeave={stop} onTouchStart={start} onTouchMove={move} onTouchEnd={stop}
        style={{ width: "100%", height: 130, background: "var(--bg3)", border: "1px solid var(--border2)", display: "block", touchAction: "none" }} />
      <button onClick={clear} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", padding: "7px 12px", fontSize: 10, marginTop: 8, ...buttonBase }}>Clear Signature</button>
    </div>
  );
};

/* -- MODALS --------------------------------------------------- */
const UserProfileModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({ name: user.name, email: user.email, department: user.department, avatar: user.avatar, ...getProfile(user) });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const save = () => onSave(user.id, {
    name: form.name, email: form.email, department: form.department, avatar: form.avatar,
    profile: { phone: form.phone, location: form.location, education: form.education, experience: form.experience, employeeId: form.employeeId, joiningDate: form.joiningDate, emergencyContact: form.emergencyContact, signature: form.signature }
  });
  return (
    <Modal title={user.name} subtitle="Add User Profile" onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
        <Field label="Full Name"><input value={form.name} onChange={e => set("name", e.target.value)} style={inputStyle} /></Field>
        <Field label="Avatar"><input value={form.avatar} onChange={e => set("avatar", e.target.value.toUpperCase().slice(0, 2))} style={inputStyle} /></Field>
        <Field label="Email"><input value={form.email} onChange={e => set("email", e.target.value)} style={inputStyle} /></Field>
        <Field label="Department"><input value={form.department} onChange={e => set("department", e.target.value)} style={inputStyle} /></Field>
        <Field label="Phone"><input value={form.phone} onChange={e => set("phone", e.target.value)} style={inputStyle} /></Field>
        <Field label="Education"><input value={form.education} onChange={e => set("education", e.target.value)} style={inputStyle} /></Field>
        <Field label="Experience"><input value={form.experience} onChange={e => set("experience", e.target.value)} style={inputStyle} /></Field>
        <Field label="Employee ID"><input value={form.employeeId} onChange={e => set("employeeId", e.target.value)} style={inputStyle} /></Field>
        <Field label="Joining Date"><input type="date" value={form.joiningDate} onChange={e => set("joiningDate", e.target.value)} style={inputStyle} /></Field>
        <Field label="Emergency Contact"><input value={form.emergencyContact} onChange={e => set("emergencyContact", e.target.value)} style={inputStyle} /></Field>
      </div>
      <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", margin: "24px 0 12px" }}>Signature</p>
      <SignaturePad value={form.signature} onChange={v => set("signature", v)} />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
        <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text2)", padding: "10px 14px", ...buttonBase }}>Cancel</button>
        <button onClick={save} style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "10px 18px", ...buttonBase }}>Save Profile</button>
      </div>
    </Modal>
  );
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
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 18 }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 12 }}>Company List ({list.length})</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 420, overflow: "auto" }}>
            {list.length === 0 && <p style={{ fontSize: 12, color: "var(--text3)", fontStyle: "italic" }}>No disclosure companies added.</p>}
            {list.map((d, i) => (
              <button key={i} onClick={() => { setForm(d); setEdit(i); }} style={{ textAlign: "left", background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text2)", padding: 12, ...buttonBase, textTransform: "none", letterSpacing: 0 }}>
                <p style={{ fontSize: 12, color: "var(--text)", marginBottom: 4 }}>{d.companyName}</p>
                <p style={{ fontSize: 10, color: "var(--text3)" }}>{d.formerRole || d.position} / {d.currentStatus}</p>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            <Field label="Company Name"><input disabled={readonly} value={form.companyName} onChange={e => set("companyName", e.target.value)} style={inputStyle} /></Field>
            <Field label="Position"><input disabled={readonly} value={form.position} onChange={e => set("position", e.target.value)} style={inputStyle} /></Field>
            <Field label="Former Role"><input disabled={readonly} value={form.formerRole} onChange={e => set("formerRole", e.target.value)} style={inputStyle} /></Field>
            <Field label="Current Role"><input disabled={readonly} value={form.currentRole} onChange={e => set("currentRole", e.target.value)} style={inputStyle} /></Field>
            <Field label="From Date"><input disabled={readonly} type="date" value={form.fromDate} onChange={e => set("fromDate", e.target.value)} style={inputStyle} /></Field>
            <Field label="To Date"><input disabled={readonly} type="date" value={form.toDate} onChange={e => set("toDate", e.target.value)} style={inputStyle} /></Field>
            <Field label="Current Status">
              <select disabled={readonly} value={form.currentStatus} onChange={e => set("currentStatus", e.target.value)} style={inputStyle}>
                <option>Former</option><option>Currently Working</option><option>Notice Period</option><option>Contract Ended</option>
              </select>
            </Field>
            <Field label="Can Contact">
              <select disabled={readonly} value={form.canContact} onChange={e => set("canContact", e.target.value)} style={inputStyle}>
                <option>Yes</option><option>No</option>
              </select>
            </Field>
            <Field label="Manager Name"><input disabled={readonly} value={form.managerName} onChange={e => set("managerName", e.target.value)} style={inputStyle} /></Field>
            <Field label="Manager Email"><input disabled={readonly} value={form.managerEmail} onChange={e => set("managerEmail", e.target.value)} style={inputStyle} /></Field>
          </div>
          <div style={{ marginTop: 16 }}><Field label="Reason For Leaving"><textarea disabled={readonly} value={form.reasonForLeaving} onChange={e => set("reasonForLeaving", e.target.value)} style={{ ...inputStyle, minHeight: 64, resize: "vertical" }} /></Field></div>
          <div style={{ marginTop: 16 }}><Field label="Notes"><textarea disabled={readonly} value={form.notes} onChange={e => set("notes", e.target.value)} style={{ ...inputStyle, minHeight: 64, resize: "vertical" }} /></Field></div>
          {!readonly && (
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 18 }}>
              <button onClick={reset} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text2)", padding: "10px 14px", ...buttonBase }}>New</button>
              <button onClick={add} style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "10px 18px", ...buttonBase }}>{edit !== null ? "Update Company" : "Add Company"}</button>
            </div>
          )}
        </div>
      </div>
      {!readonly && (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text2)", padding: "10px 14px", ...buttonBase }}>Cancel</button>
          <button onClick={save} style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "10px 18px", ...buttonBase }}>Save Disclosure</button>
        </div>
      )}
    </Modal>
  );
};

const UserDetailsModal = ({ user, onClose, roles, companies }) => {
  const profile = getProfile(user);
  const userRoles = Object.entries(roles[user.id] || {})
    .filter(([, v]) => v)
    .map(([cid, rid]) => ({ company: companies.find(c => String(c.id) === String(cid)), role: ROLES.find(r => r.id === rid) }))
    .filter(x => x.company && x.role);

  const item = (label, value) => (
    <div style={{ border: "1px solid var(--border)", background: "var(--bg3)", padding: "8px 10px", minHeight: 54 }}>
      <p style={{ fontSize: 8, letterSpacing: "0.16em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 11, color: value ? "var(--text2)" : "var(--text3)", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value || "Not provided"}</p>
    </div>
  );

  const signatureItem = (
    <div style={{ border: "1px solid var(--border)", background: "var(--bg3)", padding: "8px 10px", minHeight: 54 }}>
      <p style={{ fontSize: 8, letterSpacing: "0.16em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 4 }}>Signature</p>
      {profile.signature ? (
        <img src={profile.signature} alt="User signature" style={{ maxWidth: "100%", height: 28, objectFit: "contain", display: "block" }} />
      ) : (
        <p style={{ fontSize: 11, color: "var(--text3)", fontStyle: "italic" }}>No signature</p>
      )}
    </div>
  );

  return (
    <Modal
      title={user.name}
      subtitle="User Profile Details"
      onClose={onClose}
      headerContent={
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <img
            src={user.img || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name)}
            alt={user.name}
            style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--gold)", background: "var(--bg3)", flexShrink: 0 }}
            onError={e => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name); }}
          />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 3 }}>User Profile Details</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 400, color: "var(--text)", margin: 0 }}>{user.name}</h2>
              <span style={{ fontSize: 9, background: "var(--bg4)", color: "var(--text3)", padding: "2px 8px", borderRadius: 2, letterSpacing: "0.08em" }}>{user.department || "Not provided"}</span>
            </div>
            <p style={{ fontSize: 11, color: "var(--text2)", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 420 }}>{user.email || "No email provided"}</p>
          </div>
        </div>
      }
    >
      <p style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 9 }}>Profile Information</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 8, marginBottom: 14 }}>
        {item("Phone", profile.phone)}
        {item("Contact Number", profile.contactNo)}
        {item("Education", profile.education)}
        {item("Experience", profile.experience)}
        {item("Employee ID", profile.employeeId)}
        {item("Joining Date", profile.joiningDate)}
        {item("Emergency Contact", profile.emergencyContact)}
        {signatureItem}
      </div>

      <p style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 9 }}>KYC Documents</p>
      <div style={{ border: "1px solid var(--border)", background: "var(--bg3)", padding: 10, marginBottom: 12 }}>
        {(profile.kycDocuments || []).length === 0 ? (
          <p style={{ fontSize: 11, color: "var(--text3)", fontStyle: "italic" }}>No KYC documents uploaded</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {(profile.kycDocuments || []).map((doc, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderBottom: i < profile.kycDocuments.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div>
                  <p style={{ fontSize: 11, color: "var(--text)", fontWeight: 500 }}>{doc.name || ""}</p>
                  <p style={{ fontSize: 10, color: "var(--text3)" }}>{doc.type}{doc.idNumber ? ` · ${doc.idNumber}` : ""}{doc.expiry ? ` · Exp: ${doc.expiry}` : ""}</p>
                </div>
                <span style={{ fontSize: 9, color: doc.fileData ? "var(--gold)" : "var(--text3)", background: doc.fileData ? "var(--gold)12" : "transparent", border: `1px solid ${doc.fileData ? "var(--gold)30" : "var(--border)"}`, padding: "2px 8px", borderRadius: 2, letterSpacing: "0.08em" }}>
                  {doc.fileData ? "Uploaded" : "No File"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 9 }}>Company Role Access</p>
      <div style={{ border: "1px solid var(--border)", background: "var(--bg3)", padding: 10 }}>
        {userRoles.length === 0 ? (
          <p style={{ fontSize: 11, color: "var(--text3)", fontStyle: "italic" }}>No company access assigned.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {userRoles.slice(0, 2).map(({ company, role }) => (
              <div key={company.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <div style={{ width: 22, height: 22, background: `${INDUSTRY_COLORS[company.industry] || "#C9A252"}18`, border: `1px solid ${INDUSTRY_COLORS[company.industry] || "#C9A252"}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 600, color: INDUSTRY_COLORS[company.industry] || "#C9A252", flexShrink: 0 }}>{company.logo}</div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 11, color: "var(--text)", marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{company.name}</p>
                    <p style={{ fontSize: 9, color: "var(--text3)" }}>{company.industry}</p>
                  </div>
                </div>
                <span style={{ fontSize: 9, color: role.color, background: role.color + "15", border: "1px solid " + role.color + "30", padding: "2px 8px", borderRadius: 2, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{role.label}</span>
              </div>
            ))}
            {userRoles.length > 2 && <p style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.08em" }}>+ {userRoles.length - 2} more</p>}
          </div>
        )}
      </div>
    </Modal>
  );
};

/* -- KYC DOC VIEW MODAL --------------------------------------- */
const KycDocViewModal = ({ doc, onClose }) => {
  if (!doc) return null;
  const isImage = doc.mimeType && doc.mimeType.startsWith("image/");
  const isPdf = doc.mimeType === "application/pdf";
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 60, background: "#05070bdd", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "cmFadeUp .18s ease both" }}
      onClick={onClose}
    >
      <div
        style={{ width: "min(720px,100%)", maxHeight: "90vh", overflow: "auto", background: "var(--bg2)", border: "1px solid var(--border2)", boxShadow: "0 24px 80px #000c", position: "relative" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg3)" }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 4 }}>KYC Document Preview</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, color: "var(--text)" }}>{doc.name || "Document"}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", width: 32, height: 32, fontSize: 16, cursor: "pointer", ...buttonBase }}>x</button>
        </div>

        <div style={{ padding: 20 }}>
          {/* Meta grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 18 }}>
            {[
              { label: "ID Type", value: doc.type },
              { label: "ID Number", value: doc.idNumber },
              { label: "Expiry Date", value: doc.expiry },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: "var(--bg3)", border: "1px solid var(--border)", padding: "10px 12px" }}>
                <p style={{ fontSize: 9, letterSpacing: "0.16em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 5 }}>{label}</p>
                <p style={{ fontSize: 12, color: value ? "var(--text2)" : "var(--text3)", fontStyle: value ? "normal" : "italic" }}>{value || "Not provided"}</p>
              </div>
            ))}
          </div>

          {/* Preview area */}
          <div style={{ border: "1px solid var(--border)", background: "var(--bg3)", minHeight: 260, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {doc.fileData ? (
              isImage ? (
                <img src={doc.fileData} alt={doc.name} style={{ maxWidth: "100%", maxHeight: 420, objectFit: "contain", display: "block" }} />
              ) : isPdf ? (
                <iframe src={doc.fileData} title={doc.name} style={{ width: "100%", height: 420, border: "none", display: "block" }} />
              ) : (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <p style={{ fontSize: 13, color: "var(--text3)" }}>Preview not available for this file type</p>
                  <a href={doc.fileData} download={doc.name} style={{ display: "inline-block", marginTop: 12, color: "var(--gold)", fontSize: 12, textDecoration: "underline" }}>Download file</a>
                </div>
              )
            ) : (
              <div style={{ textAlign: "center", padding: 40 }}>
                <p style={{ fontSize: 13, color: "var(--text3)", fontStyle: "italic" }}>No file uploaded for this document</p>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
            <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text2)", padding: "10px 20px", ...buttonBase }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -- ADD MEMBER FULL PAGE (4-STEP) ---------------------------- */
const STEPS = [
  "Basic Info",
  "Identity Details",
  "Professional Info",
  "KYC Documents",
];

const ShareholdingModal = ({ open, onClose, form, setForm, onSave, editMode }) => {
  if (!open) return null;
  return (
    <Modal title={editMode ? "Edit Shareholding" : "Add Shareholding"} subtitle="Company Holdings" onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
        <Field label="Company Name">
          <input value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} style={inputStyle} />
        </Field>
        <Field label="No. of Shares">
          <input value={form.sharesHeld} onChange={e => setForm(p => ({ ...p, sharesHeld: e.target.value }))} style={inputStyle} />
        </Field>
        <Field label="% Holding">
          <input value={form.percentageHeld} onChange={e => setForm(p => ({ ...p, percentageHeld: e.target.value }))} style={inputStyle} />
        </Field>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
        <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text2)", padding: "10px 14px", ...buttonBase }}>Cancel</button>
        <button onClick={onSave} style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "10px 18px", ...buttonBase }}>Save</button>
      </div>
    </Modal>
  );
};

const ProfessionalInfoModal = ({ open, onClose, form, setForm, onSave, editMode }) => {
  if (!open) return null;
  return (
    <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", width: "100%" }}>
      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: ".2em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 4 }}>Professional Details</p>
          <h3 style={{ fontSize: 20, fontWeight: 500, color: "var(--text)" }}>{editMode ? "Edit Details" : "Add Details"}</h3>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 18 }}><FaTimes /></button>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
          <Field label="Company Name">
            <input value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} style={inputStyle} />
          </Field>
          <Field label="Designation">
            <input value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))} style={inputStyle} />
          </Field>
          <Field label="No Of Shares">
            <input value={form.sharesHeld} onChange={e => setForm(p => ({ ...p, sharesHeld: e.target.value }))} style={inputStyle} />
          </Field>
          <Field label="% Holding">
            <input value={form.sharePercentage} onChange={e => setForm(p => ({ ...p, sharePercentage: e.target.value }))} style={inputStyle} />
          </Field>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid var(--border2)", color: "var(--text2)", padding: "10px 14px", ...buttonBase }}>Cancel</button>
          <button onClick={onSave} style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "10px 16px", ...buttonBase }}>{editMode ? "Update" : "Add"}</button>
        </div>
      </div>
    </div>
  );
};

const AddMemberPage = ({ onBack, onCreate, onUpdate, user, theme, setTheme }) => {
  const isEdit = !!user;
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Professional state
  const [profForm, setProfForm] = useState({ ...emptyProfEntry });
  const [profEdit, setProfEdit] = useState(null);
  const [showProfessionalModal, setShowProfessionalModal] = useState(false);

  // Shareholding state
  const [shareholdingForm, setShareholdingForm] = useState({ ...emptyShareholding });
  const [showShareholdingModal, setShowShareholdingModal] = useState(false);
  const [shareholdingEdit, setShareholdingEdit] = useState(null);

  // KYC state
  const [kycForm, setKycForm] = useState({ ...emptyKycDoc });
  const [kycEdit, setKycEdit] = useState(null);
  const [viewKycDoc, setViewKycDoc] = useState(null);

  const [form, setForm] = useState(
    isEdit
      ? {
        name: user.name,
        email: user.email,
        username: user.username || "",
        password: user.password || "",
        department: user.department,
        avatar: user.avatar || "",
        img: user.img || "",
        profile: {
          ...emptyProfile,
          ...getProfile(user),
        },
      }
      : {
        name: "",
        email: "",
        username: "",
        password: "",
        department: "Operations",
        avatar: "",
        img: "",
        profile: {
          ...emptyProfile,
        },
      }
  );

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setProfile = (k, v) => setForm(p => ({ ...p, profile: { ...p.profile, [k]: v } }));

  // Professional helpers
  const resetProfForm = () => { setProfForm({ ...emptyProfEntry }); setProfEdit(null); };
  const addProfEntry = () => {
    if (!profForm.companyName || !profForm.designation) return;
    setForm(prev => {
      const entries = prev.profile.professionalEntries || [];
      const updated = profEdit !== null
        ? entries.map((item, idx) => idx === profEdit ? { ...profForm } : item)
        : [...entries, { ...profForm }];
      return { ...prev, profile: { ...prev.profile, professionalEntries: updated } };
    });
    resetProfForm();
    setShowProfessionalModal(false);
  };
  const removeProfEntry = idx => {
    setForm(p => ({ ...p, profile: { ...p.profile, professionalEntries: (p.profile.professionalEntries || []).filter((_, i) => i !== idx) } }));
    resetProfForm();
  };

  // Shareholding helpers
  const resetShareholdingForm = () => { setShareholdingForm({ ...emptyShareholding }); setShareholdingEdit(null); };
  const addShareholding = () => {
    if (!shareholdingForm.companyName) return;
    setForm(prev => {
      const holdings = prev.profile.shareholdings || [];
      const updated = shareholdingEdit !== null
        ? holdings.map((item, idx) => idx === shareholdingEdit ? shareholdingForm : item)
        : [{ ...shareholdingForm }, ...holdings];
      return { ...prev, profile: { ...prev.profile, shareholdings: updated } };
    });
    resetShareholdingForm();
  };
  const removeShareholding = idx => {
    setForm(prev => ({ ...prev, profile: { ...prev.profile, shareholdings: (prev.profile.shareholdings || []).filter((_, i) => i !== idx) } }));
    resetShareholdingForm();
  };

  // KYC helpers
  const resetKycForm = () => { setKycForm({ ...emptyKycDoc }); setKycEdit(null); };
  const addKycDoc = () => {
    if (!kycForm.name && !kycForm.type) return;
    setForm(prev => {
      const docs = prev.profile.kycDocuments || [];
      const entry = { ...kycForm, id: kycForm.id || String(Date.now()) };
      const updated = kycEdit !== null
        ? docs.map((d, i) => i === kycEdit ? entry : d)
        : [...docs, entry];
      return { ...prev, profile: { ...prev.profile, kycDocuments: updated } };
    });
    resetKycForm();
  };
  const removeKycDoc = idx => {
    setForm(prev => ({ ...prev, profile: { ...prev.profile, kycDocuments: (prev.profile.kycDocuments || []).filter((_, i) => i !== idx) } }));
    if (kycEdit === idx) resetKycForm();
  };

  const next = () => { setError(""); setStep(s => s + 1); };

  const submit = async () => {
    setSaving(true); setError("");
    if (isEdit) { await onUpdate(user.id, form); }
    else { await onCreate(form); }
    setSaving(false);
  };

  const stepContent = [

    /* -- Step 1  Basic Info -- */
    <div key="step1">
      <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 18, lineHeight: 1.6 }}>Core identity details of the board member.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18, marginBottom: 18 }}>
        <div>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", display: "block", marginBottom: 10 }}>Profile Photo</span>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              onClick={() => document.getElementById("memberImgInput").click()}
              style={{ position: "relative", width: 72, height: 72, borderRadius: "50%", border: "2px dashed var(--gold)", cursor: "pointer", overflow: "hidden", flexShrink: 0, background: "var(--bg3)" }}
              title="Click to upload photo"
            >
              {form.img ? (
                <img src={form.img} alt="member" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              ) : form.name ? (
                <img src={"https://ui-avatars.com/api/?name=" + encodeURIComponent(form.name) + "&size=80&background=C9A252&color=000"} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "var(--gold)" }}>+</div>
              )}
            </div>
            <input id="memberImgInput" type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
              const file = e.target.files[0]; if (!file) return;
              const reader = new FileReader(); reader.onload = ev => set("img", ev.target.result); reader.readAsDataURL(file); e.target.value = "";
            }} />
            <div>
              <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>Click the circle to upload a photo</p>
              <p style={{ fontSize: 11, color: "var(--text3)" }}>JPG, PNG or GIF · Max 2 MB</p>
              {form.img && <button onClick={() => set("img", "")} style={{ marginTop: 8, background: "none", border: "1px solid var(--border2)", color: "var(--text3)", padding: "5px 10px", fontSize: 10, cursor: "pointer", letterSpacing: "0.1em" }}>Remove Photo</button>}
            </div>
          </div>
        </div>
        <div>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", display: "block", marginBottom: 10 }}>Signature</span>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              onClick={() => document.getElementById("memberSignatureInput").click()}
              style={{ position: "relative", width: 72, height: 72, borderRadius: "50%", border: "2px dashed var(--gold)", cursor: "pointer", overflow: "hidden", flexShrink: 0, background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center" }}
              title="Click to upload signature"
            >
              {form.profile.signature ? (
                <img src={form.profile.signature} alt="signature" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%" }} />
              ) : (
                <div style={{ fontSize: 22, color: "var(--gold)" }}>+</div>
              )}
            </div>
            <input id="memberSignatureInput" type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
              const file = e.target.files[0]; if (!file) return;
              const reader = new FileReader(); reader.onload = ev => setProfile("signature", ev.target.result); reader.readAsDataURL(file); e.target.value = "";
            }} />
            <div>
              <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>Click the box to upload a signature</p>
              <p style={{ fontSize: 11, color: "var(--text3)" }}>JPG, PNG or GIF · Max 2 MB</p>
              {form.profile.signature && <button onClick={() => setProfile("signature", "")} style={{ marginTop: 8, background: "none", border: "1px solid var(--border2)", color: "var(--text3)", padding: "5px 10px", fontSize: 10, cursor: "pointer", letterSpacing: "0.1em" }}>Remove Signature</button>}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
        <Field label="Full Legal Name"><input value={form.name} onChange={e => set("name", e.target.value)} style={inputStyle} placeholder="e.g. Alex Carter" /></Field>
        <Field label="Avatar Initials"><input value={form.avatar} onChange={e => set("avatar", e.target.value.toUpperCase().slice(0, 2))} style={inputStyle} placeholder="AC" /></Field>
        <Field label="Email Address"><input value={form.email} onChange={e => set("email", e.target.value)} style={inputStyle} placeholder="alex@company.com" /></Field>
        <Field label="Contact Number"><input value={form.profile.contactNo} onChange={e => setProfile("contactNo", e.target.value)} style={inputStyle} placeholder="+91 9876543210" /></Field>
        <Field label="Designation"><input value={form.department} onChange={e => set("department", e.target.value)} style={inputStyle} placeholder="Operations" /></Field>
        <Field label="Education"><input value={form.profile.education} onChange={e => setProfile("education", e.target.value)} style={inputStyle} placeholder="e.g. MBA, Finance" /></Field>
        <Field label="Experience"><input value={form.profile.experience} onChange={e => setProfile("experience", e.target.value)} style={inputStyle} placeholder="e.g. 12 years" /></Field>
        <Field label="Username">
          <input
            value={form.username}
            onChange={(e) => set("username", e.target.value)}
            style={inputStyle}
            placeholder="e.g. adminTest"
          />
        </Field>

        <Field label="Password">
          <input
            type="password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            style={inputStyle}
            placeholder="Enter password"
          />
        </Field>
      </div>
    </div>,

    /* -- Step 2  Identity Details -- */
    <div key="step2">
      <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 28, lineHeight: 1.7 }}>Personal and identity information required for statutory verification.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
        <Field label="Date of Birth"><input type="date" value={form.profile.dateOfBirth} onChange={e => setProfile("dateOfBirth", e.target.value)} style={inputStyle} /></Field>
        <Field label="Gender">
          <select value={form.profile.gender} onChange={e => setProfile("gender", e.target.value)} style={inputStyle}>
            <option value="">Select</option>
            <option>Male</option><option>Female</option><option>Non-Binary</option><option>Prefer not to say</option>
          </select>
        </Field>
        <Field label="Nationality"><input value={form.profile.nationality} onChange={e => setProfile("nationality", e.target.value)} style={inputStyle} placeholder="e.g. Indian" /></Field>
        <Field label="DIN Number"><input value={form.profile.passportId} onChange={e => setProfile("passportId", e.target.value)} style={inputStyle} placeholder="e.g. A1234567" /></Field>
        <Field label="Phone"><input value={form.profile.phone} onChange={e => setProfile("phone", e.target.value)} style={inputStyle} placeholder="+91 95000 70051" /></Field>
        <Field label="Emergency Contact"><input value={form.profile.emergencyContact} onChange={e => setProfile("emergencyContact", e.target.value)} style={inputStyle} placeholder="Name / number" /></Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20, marginTop: 20 }}>
        <Field label="Residential Address (with proof note)">
          <textarea value={form.profile.residentialAddress} onChange={e => setProfile("residentialAddress", e.target.value)} style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} placeholder="Full address as on utility bill / bank statement" />
        </Field>
        <Field label="Preferred Mailing Address">
          <textarea value={form.profile.mailingAddress} onChange={e => setProfile("mailingAddress", e.target.value)} style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} placeholder="e.g. 12 Park Lane, Mumbai 400001" />
        </Field>
      </div>
    </div>,

    /* -- Step 3  Professional Info -- */
    <div key="step3">
      <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 24, lineHeight: 1.7 }}>Add professional details and shareholding information.</p>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", gap: 24, alignItems: "start" }}>

        {/* LEFT  Professional Details table */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 10, letterSpacing: ".2em", color: "var(--text3)", textTransform: "uppercase" }}>Professional Details</p>
            <button onClick={() => { resetProfForm(); setShowProfessionalModal(true); }} style={{ width: 34, height: 34, background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", fontSize: 20, cursor: "pointer" }}>+</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid var(--border)", background: "var(--bg3)", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "26%" }} /><col style={{ width: "22%" }} /><col style={{ width: "16%" }} /><col style={{ width: "16%" }} /><col style={{ width: "20%" }} />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Company Name", "Designation", "Shares", "% Holding", "Action"].map((h, i) => (
                    <th key={h} style={{ padding: 14, textAlign: i >= 2 ? "center" : "left", fontSize: 10, letterSpacing: "0.12em", color: "var(--text3)", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(form.profile.professionalEntries || []).length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", padding: 24, color: "var(--text3)", fontSize: 12 }}>No professional details added</td></tr>
                ) : (
                  (form.profile.professionalEntries || []).map((item, index) => (
                    <tr key={index} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "16px 14px", fontSize: 12 }}>{item.companyName}</td>
                      <td style={{ padding: "16px 14px", fontSize: 12 }}>{item.designation}</td>
                      <td style={{ textAlign: "center", padding: "16px 14px", fontSize: 12 }}>{item.sharesHeld}</td>
                      <td style={{ textAlign: "center", padding: "16px 14px", fontSize: 12 }}>{item.sharePercentage}%</td>
                      <td style={{ textAlign: "center", padding: "16px 14px" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                          <button onClick={() => { setProfForm(item); setProfEdit(index); setShowProfessionalModal(true); }} style={{ background: "transparent", border: "1px solid var(--gold)", color: "var(--gold)", padding: "6px 12px", cursor: "pointer", fontSize: 11, ...buttonBase }}>Edit</button>
                          <button onClick={() => removeProfEntry(index)} style={{ background: "transparent", border: "1px solid #d9534f", color: "#d9534f", padding: "6px 12px", cursor: "pointer", fontSize: 11, ...buttonBase }}>Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Shareholdings */}
          {/* <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <p style={{ fontSize: 10, letterSpacing: ".2em", color: "var(--text3)", textTransform: "uppercase" }}>Shareholdings</p>
              <button onClick={() => { resetShareholdingForm(); setShowShareholdingModal(true); }} style={{ width: 34, height: 34, background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", fontSize: 20, cursor: "pointer" }}>+</button>
            </div>
            <div style={{ border: "1px solid var(--border)", background: "var(--bg3)", padding: 10, maxHeight: 220, overflow: "auto" }}>
              {(form.profile.shareholdings || []).length === 0 ? (
                <p style={{ fontSize: 11, color: "var(--text3)", fontStyle: "italic" }}>No shareholdings added</p>
              ) : (
                (form.profile.shareholdings || []).map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 6px", borderBottom: i < form.profile.shareholdings.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--text)", fontWeight: 600 }}>{s.companyName}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>{s.sharesHeld || "-"} · {s.percentageHeld ? s.percentageHeld + "%" : "-"}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => { setShareholdingForm({ ...s }); setShareholdingEdit(i); setShowShareholdingModal(true); }} style={{ background: "transparent", border: "1px solid var(--gold)", color: "var(--gold)", padding: "6px 10px", cursor: "pointer", fontSize: 11, ...buttonBase }}>Edit</button>
                      <button onClick={() => removeShareholding(i)} style={{ background: "transparent", border: "1px solid #d9534f", color: "#d9534f", padding: "6px 10px", cursor: "pointer", fontSize: 11, ...buttonBase }}>Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div> */}
        </div>

        {/* RIGHT  inline prof form panel */}
        <div>
          <ProfessionalInfoModal
            open={showProfessionalModal}
            onClose={() => { setShowProfessionalModal(false); resetProfForm(); }}
            form={profForm}
            setForm={setProfForm}
            editMode={profEdit !== null}
            onSave={addProfEntry}
          />
          {!showProfessionalModal && (
            <div style={{ border: "1px dashed var(--border)", padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 120, background: "var(--bg3)" }}>
              <p style={{ fontSize: 11, color: "var(--text3)", textAlign: "center" }}>Click <strong style={{ color: "var(--gold)" }}>+</strong> in Professional Details to add a new entry</p>
            </div>
          )}
        </div>
      </div>

      <ShareholdingModal
        open={showShareholdingModal}
        onClose={() => { setShowShareholdingModal(false); resetShareholdingForm(); }}
        form={shareholdingForm}
        setForm={setShareholdingForm}
        onSave={() => { addShareholding(); setShowShareholdingModal(false); }}
        editMode={shareholdingEdit !== null}
      />
    </div>,

    /* -- Step 4  KYC Documents -- */
    <div key="step4">
      <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 24, lineHeight: 1.7 }}>
        Upload identity and compliance documents for KYC verification.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: 24, alignItems: "start" }}>

        {/* LEFT  Documents table */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <p style={{ fontSize: 10, letterSpacing: ".2em", color: "var(--text3)", textTransform: "uppercase" }}>
              Uploaded Documents ({(form.profile.kycDocuments || []).length})
            </p>
          </div>

          <div style={{ border: "1px solid var(--border)", background: "var(--bg3)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "32%" }} />
                <col style={{ width: "24%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "22%" }} />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg4,var(--bg))" }}>
                  {["Document Name", "ID / Type", "Expiry", "Actions"].map((h, i) => (
                    <th key={h} style={{ padding: "11px 13px", textAlign: i === 3 ? "center" : "left", fontSize: 9, letterSpacing: "0.14em", color: "var(--text3)", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(form.profile.kycDocuments || []).length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "32px 16px", color: "var(--text3)", fontSize: 12, fontStyle: "italic" }}>
                      No KYC documents added yet. Use the upload panel to add documents.
                    </td>
                  </tr>
                ) : (
                  (form.profile.kycDocuments || []).map((doc, i) => (
                    <tr
                      key={i}
                      style={{ borderTop: "1px solid var(--border)", background: kycEdit === i ? "var(--gold)08" : "transparent", transition: "background .15s" }}
                    >
                      <td style={{ padding: "12px 13px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {/* file type icon */}
                          <div style={{ width: 28, height: 28, background: doc.fileData ? "var(--gold)15" : "var(--bg4,var(--bg))", border: `1px solid ${doc.fileData ? "var(--gold)30" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: doc.fileData ? "var(--gold)" : "var(--text3)", flexShrink: 0, fontWeight: 700, letterSpacing: 0 }}>
                            {doc.mimeType === "application/pdf" ? "PDF" : doc.mimeType?.startsWith("image/") ? "IMG" : "DOC"}
                          </div>
                          <div style={{ overflow: "hidden" }}>
                            <p style={{ fontSize: 12, color: "var(--text)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>{doc.name || ""}</p>
                            <p style={{ fontSize: 10, color: "var(--text3)" }}>{doc.type || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 13px" }}>
                        <p style={{ fontSize: 11, color: "var(--text2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.idNumber || ""}</p>
                      </td>
                      <td style={{ padding: "12px 13px" }}>
                        {doc.expiry ? (
                          <span style={{ fontSize: 10, color: "var(--text2)" }}>{doc.expiry}</span>
                        ) : (
                          <span style={{ fontSize: 10, color: "var(--text3)", fontStyle: "italic" }}>No expiry</span>
                        )}
                      </td>
                      <td style={{ padding: "12px 13px" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: 5 }}>
                          <button
                            onClick={() => setViewKycDoc(doc)}
                            style={{ background: "transparent", border: "1px solid var(--border2)", color: "var(--text2)", padding: "5px 9px", fontSize: 10, cursor: "pointer", ...buttonBase }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => { setKycForm({ ...doc }); setKycEdit(i); }}
                            style={{ background: "transparent", border: "1px solid var(--gold)", color: "var(--gold)", padding: "5px 9px", fontSize: 10, cursor: "pointer", ...buttonBase }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => removeKycDoc(i)}
                            style={{ background: "transparent", border: "1px solid #d9534f", color: "#d9534f", padding: "5px 9px", fontSize: 10, cursor: "pointer", ...buttonBase }}
                          >
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT  Upload / Edit panel */}
        <div>
          <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", overflow: "hidden" }}>
            {/* Panel header */}
            <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg4,var(--bg))", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 3 }}>
                  {kycEdit !== null ? "Editing Document" : "Add New Document"}
                </p>
                <p style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
                  {kycEdit !== null ? (kycForm.name || "Document") : "Upload KYC Document"}
                </p>
              </div>
              {kycEdit !== null && (
                <button onClick={resetKycForm} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", padding: "5px 10px", fontSize: 10, cursor: "pointer", ...buttonBase }}>
                  New
                </button>
              )}
            </div>

            <div style={{ padding: 16 }}>
              {/* File drop zone */}
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 9, letterSpacing: "0.14em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 8 }}>Document File</p>
                {kycForm.fileData ? (
                  <div style={{ border: "1px solid var(--border)", background: "var(--bg4,var(--bg))", padding: 10 }}>
                    {/* Preview thumbnail */}
                    {kycForm.mimeType?.startsWith("image/") ? (
                      <img src={kycForm.fileData} alt="preview" style={{ width: "100%", maxHeight: 100, objectFit: "contain", display: "block", marginBottom: 8 }} />
                    ) : kycForm.mimeType === "application/pdf" ? (
                      <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg3)", marginBottom: 8, border: "1px solid var(--border)" }}>
                        <span style={{ fontSize: 11, color: "var(--text3)" }}>PDF · {kycForm.name}</span>
                      </div>
                    ) : null}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <p style={{ fontSize: 11, color: "var(--text2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{kycForm.name || "Uploaded file"}</p>
                      <button
                        onClick={() => setKycForm(p => ({ ...p, fileData: "", mimeType: "" }))}
                        style={{ background: "transparent", border: "1px solid var(--border2)", color: "var(--text3)", padding: "4px 9px", fontSize: 10, cursor: "pointer", flexShrink: 0, ...buttonBase }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{ border: "2px dashed var(--border2)", padding: "22px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, background: "var(--bg4,var(--bg))", cursor: "pointer" }}
                    onClick={() => document.getElementById("kycFileUploadStep4").click()}
                  >
                    <div style={{ width: 36, height: 36, border: "1px solid var(--border2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "var(--text3)" }}><FaFile /></div>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>Click to upload document</p>
                      <p style={{ fontSize: 10, color: "var(--text3)" }}>PNG, JPG or PDF · Max 5 MB</p>
                    </div>
                  </div>
                )}
                <input
                  id="kycFileUploadStep4"
                  type="file"
                  accept="image/*,application/pdf"
                  style={{ display: "none" }}
                  onChange={e => {
                    const file = e.target.files[0]; if (!file) return;
                    const reader = new FileReader();
                    reader.onload = ev => setKycForm(p => ({
                      ...p,
                      fileData: ev.target.result,
                      name: p.name || file.name,
                      mimeType: file.type,
                    }));
                    reader.readAsDataURL(file); e.target.value = "";
                  }}
                />
              </div>

              {/* Fields */}
              <div style={{ display: "grid", gap: 11 }}>
                <Field label="Document Label / Name">
                  <input
                    value={kycForm.name}
                    onChange={e => setKycForm(p => ({ ...p, name: e.target.value }))}
                    style={inputStyle}
                    placeholder="e.g. Passport Front, PAN Card"
                  />
                </Field>
                <Field label="ID Type">
                  <input
                    value={kycForm.type}
                    onChange={e => setKycForm(p => ({ ...p, type: e.target.value }))}
                    style={inputStyle}
                    placeholder="e.g. Passport, Aadhar, PAN"
                  />
                </Field>
                <Field label="ID Number">
                  <input
                    value={kycForm.idNumber}
                    onChange={e => setKycForm(p => ({ ...p, idNumber: e.target.value }))}
                    style={inputStyle}
                    placeholder="e.g. A1234567"
                  />
                </Field>
                <Field label="Expiry Date">
                  <input
                    type="date"
                    value={kycForm.expiry}
                    onChange={e => setKycForm(p => ({ ...p, expiry: e.target.value }))}
                    style={inputStyle}
                  />
                </Field>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                {kycEdit !== null && (
                  <button
                    onClick={resetKycForm}
                    style={{ flex: 1, background: "none", border: "1px solid var(--border2)", color: "var(--text2)", padding: "10px 12px", fontSize: 11, cursor: "pointer", ...buttonBase }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={addKycDoc}
                  style={{ flex: 2, background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "10px 14px", fontSize: 11, cursor: "pointer", ...buttonBase }}
                >
                  {kycEdit !== null ? "Update Document" : "Save Document"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KYC doc view modal */}
      {viewKycDoc && <KycDocViewModal doc={viewKycDoc} onClose={() => setViewKycDoc(null)} />}
    </div>,
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg)" }}>
      {/* Top bar */}
      <div style={{ padding: "0 32px", height: 64, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "var(--bg2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}>
            <FaArrowLeft />
          </button>
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 2 }}>Profile Management</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, color: "var(--text)" }}>
              {isEdit ? "Edit Board Member" : "Add New Board Member"}
            </h1>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "var(--text3)", letterSpacing: "0.08em" }}>
          {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ padding: "20px 32px 0", background: "var(--bg2)", borderBottom: "1px solid var(--border)", flexShrink: 0, overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 0, minWidth: 560 }}>
          {STEPS.map((label, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0, transition: "all .2s", background: i <= step ? "var(--gold)" : "var(--bg3)", border: i <= step ? "2px solid var(--gold)" : "2px solid var(--border2)", color: i <= step ? "var(--bg)" : "var(--text3)" }}>
                  {i < step ? <FaCheck size={11} /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: i < step ? "var(--gold)" : "var(--border2)", transition: "background .2s", margin: "0 4px" }} />
                )}
              </div>
              <p style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: i === step ? "var(--gold)" : i < step ? "var(--text2)" : "var(--text3)", paddingBottom: 10, whiteSpace: "nowrap" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "40px 32px" }}>
        <div style={{ width: "100%" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, color: "var(--text)", marginBottom: 8 }}>{STEPS[step]}</h2>
          <div style={{ width: 32, height: 2, background: "var(--gold)", marginBottom: 28 }} />
          {stepContent[step]}
          {error && <p style={{ fontSize: 12, color: "var(--red)", marginTop: 16 }}>{error}</p>}
        </div>
      </div>

      {/* Footer nav */}
      <div style={{ padding: "18px 32px", borderTop: "1px solid var(--border)", background: "var(--bg2)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <button
          onClick={step === 0 ? onBack : () => { setError(""); setStep(s => s - 1); }}
          style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text2)", padding: "10px 20px", ...buttonBase }}
        >
          {step === 0 ? "Cancel" : "Back"}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, color: "var(--text3)", letterSpacing: "0.1em" }}>Step {step + 1} of {STEPS.length}</span>
          {step < STEPS.length - 1 ? (
            <button onClick={next} style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "10px 24px", ...buttonBase }}>
              Next <FaArrowRight />
            </button>
          ) : (
            <button onClick={submit} disabled={saving} style={{ background: "var(--gold)", border: "1px solid var(--gold)", color: "var(--bg)", padding: "10px 24px", ...buttonBase }}>
              {saving ? (isEdit ? "Saving..." : "Adding...") : (isEdit ? "Save Changes" : "Add Member")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* -- USER PROFILES PAGE --------------------------------------- */
const UserProfilesPage = ({ users, roles, companies, onViewProfile, onEditMember, onEditDisclosure, onAddMember, theme, setTheme }) => (
  <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
    <TopBar
      title="Members Profiles"
      subtitle="Profile Management"
      theme={theme}
      setTheme={setTheme}
      action={
        <button onClick={onAddMember} title="Add Member" style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--gold)", background: "transparent", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, cursor: "pointer" }}>+</button>
      }
    />
    <div style={{ padding: "24px 32px", flex: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 18, padding: 24 }}>
        {users.map((u, i) => {
          const profile = getProfile(u);
          const userRoles = Object.entries(roles[u.id] || {})
            .filter(([, v]) => v)
            .map(([cid, rid]) => ({ company: companies.find(c => String(c.id) === String(cid)), role: ROLES.find(r => r.id === rid) }))
            .filter(x => x.company && x.role);

          return (
            <div key={u.id} onClick={() => onViewProfile(u)}
              style={{ background: "var(--bg3)", border: "1px solid var(--border)", padding: "20px", animation: "cmFadeUp .3s " + (i * 0.06) + "s ease both", cursor: "pointer", transition: "border-color .15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--gold)50"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <img
                  src={u.img || "https://ui-avatars.com/api/?name=" + encodeURIComponent(u.name)}
                  alt={u.name}
                  style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--gold)", background: "var(--bg3)", flexShrink: 0 }}
                  onError={e => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(u.name); }}
                />
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 3 }}>{u.name}</p>
                  <p style={{ fontSize: 11, color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</p>
                  <span style={{ fontSize: 10, background: "var(--bg4)", color: "var(--text3)", padding: "2px 8px", borderRadius: 2, letterSpacing: "0.08em", display: "inline-block", marginTop: 4 }}>{u.department}</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button title="Edit member" onClick={e => { e.stopPropagation(); onEditMember(u); }} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--gold)", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FaUserEdit />
                  </button>
                  <button title="Edit disclosure" onClick={e => { e.stopPropagation(); onEditDisclosure(u); }} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FaFileSignature />
                  </button>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 10 }}>
                  Experience ({(profile.professionalEntries || []).length})
                </p>
                {(profile.professionalEntries || []).length === 0 ? (
                  <p style={{ fontSize: 11, color: "var(--text3)", fontStyle: "italic" }}>No experience added</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {(profile.professionalEntries || []).slice(0, 1).map((entry, ei) => (
                      <div key={ei} style={{ background: "var(--bg4,var(--bg))", border: "1px solid var(--border)", padding: "9px 11px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                          <div style={{ overflow: "hidden" }}>
                            <p style={{ fontSize: 12, color: "var(--text)", fontWeight: 500, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.designation || ""}</p>
                            <p style={{ fontSize: 11, color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.companyName || "Not provided"}</p>
                          </div>
                          <div style={{ flexShrink: 0, textAlign: "right" }}>
                            <span style={{ fontSize: 9, letterSpacing: "0.08em", color: "var(--gold)", background: "var(--gold)12", border: "1px solid var(--gold)25", padding: "2px 7px", display: "inline-block", borderRadius: 2 }}>
                              {entry.sharePercentage ? `${entry.sharePercentage}%` : ""}
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: 10, color: "var(--text3)", marginTop: 5 }}>{entry.sharesHeld ? `${entry.sharesHeld} shares` : "Shares not provided"}</p>
                      </div>
                    ))}
                    {(profile.professionalEntries || []).length > 1 && (
                      <p style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.08em", marginTop: 2 }}>+ {(profile.professionalEntries || []).length - 1} more</p>
                    )}
                  </div>
                )}
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, marginTop: 14 }}>
                <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 10 }}>
                  Company Access ({userRoles.length})
                </p>
                {userRoles.length === 0 && <p style={{ fontSize: 11, color: "var(--text3)", fontStyle: "italic" }}>No company access assigned</p>}
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {userRoles.slice(0, 1).map(({ company, role }) => (
                    <div key={company.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                        <div style={{ width: 20, height: 20, background: `${INDUSTRY_COLORS[company.industry] || "#C9A252"}18`, border: `1px solid ${INDUSTRY_COLORS[company.industry] || "#C9A252"}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 600, color: INDUSTRY_COLORS[company.industry] || "#C9A252", flexShrink: 0 }}>{company.logo}</div>
                        <span style={{ fontSize: 11, color: "var(--text2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{company.name}</span>
                      </div>
                      <span style={{ fontSize: 10, color: role.color, background: role.color + "15", border: "1px solid " + role.color + "30", padding: "2px 8px", borderRadius: 2, letterSpacing: "0.06em", whiteSpace: "nowrap", flexShrink: 0 }}>{role.label}</span>
                    </div>
                  ))}
                  {userRoles.length > 1 && <p style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.08em", marginTop: 2 }}>+ {userRoles.length - 1} more</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

/* -- MEMBER PROFILE ROOT COMPONENT ---------------------------- */
const MemberProfile = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [toast, setToast] = useState("");
  const [viewUser, setViewUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [disclosureUser, setDisclosureUser] = useState(null);
  const [theme, setTheme] = useState("dark");

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

  const showToast = message => { setToast(message); window.setTimeout(() => setToast(""), 2600); };

  const handleUpdateUser = async (userId, payload) => {
    const avatar = payload.avatar || payload.name.split(" ").map(x => x[0]).join("").slice(0, 2).toUpperCase();
    const updated = await companyManagementApi.updateUser(userId, { ...payload, avatar });
    setUsers(prev => prev.map(u => u.id === userId ? {
      ...u,
      ...updated,
      name: payload.name,
      email: payload.email,
      username: payload.username,
      password: payload.password,
      department: payload.department,
      avatar,
      img: payload.img || "",
      profile: { ...emptyProfile, ...payload.profile },
      disclosures: u.disclosures || [],
    } : u));
    setViewUser(null); setEditingUser(null); setAddingUser(false);
    showToast(payload.name + " updated successfully.");
  };

  const handleSaveDisclosure = (userId, disclosures) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, disclosures } : u));
    setDisclosureUser(null);
    showToast("Disclosure details updated successfully.");
  };

  const handleAddUser = async payload => {
    const avatar = payload.avatar || payload.name.split(" ").map(x => x[0]).join("").slice(0, 2).toUpperCase();
    const created = await companyManagementApi.createUser({ name: payload.name, email: payload.email, department: payload.department, avatar });
    const enriched = {
      ...created,
      name: payload.name,
      email: payload.email,
      username: payload.username,
      password: payload.password,
      department: payload.department,
      avatar,
      img: payload.img || "",
      profile: payload.profile,
      disclosures: [],
    };
    setUsers(prev => [enriched, ...prev]);
    setRoles(prev => ({ ...prev, [enriched.id]: Object.fromEntries(companies.map(c => [c.id, null])) }));
    setAddingUser(false);
    showToast(enriched.name + " added successfully.");
  };

  if (loadingData) {
    return <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text3)", fontSize: 13 }}>Loading...</div>;
  }

  const showingForm = addingUser || !!editingUser;

  return (
    <div className={`member-profile-root${theme === "light" ? " mp-light" : ""}`} style={{ display: "flex", height: "100%", overflow: "hidden", position: "relative" }}>
      {showingForm ? (
        <AddMemberPage
          onBack={() => { setAddingUser(false); setEditingUser(null); }}
          onCreate={handleAddUser}
          onUpdate={handleUpdateUser}
          user={editingUser || null}
          theme={theme}
          setTheme={setTheme}
        />
      ) : (
        <UserProfilesPage
          users={users}
          roles={roles}
          companies={companies}
          onViewProfile={setViewUser}
          theme={theme}
          setTheme={setTheme}
          onEditMember={u => {
            setViewUser(null); setAddingUser(false);
            setEditingUser({ ...u, profile: { ...emptyProfile, ...getProfile(u) } });
          }}
          onEditDisclosure={setDisclosureUser}
          onAddMember={() => setAddingUser(true)}
        />
      )}

      {!showingForm && viewUser && (
        <UserDetailsModal user={viewUser} roles={roles} companies={companies} onClose={() => setViewUser(null)} />
      )}
      {!showingForm && disclosureUser && (
        <DisclosureModal user={disclosureUser} onClose={() => setDisclosureUser(null)} onSave={handleSaveDisclosure} />
      )}

      <Toast message={toast} />
    </div>
  );
};

export default MemberProfile;
