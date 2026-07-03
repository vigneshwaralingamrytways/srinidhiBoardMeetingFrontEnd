import React, { useRef, useEffect } from 'react';

/* -- STATIC DATA ---------------------------------------------- */
export const ROLES = [
  { id: "super_admin", label: "Super Admin", color: "#C9A252", desc: "Full system access" },
  { id: "admin",       label: "Admin",       color: "#378ADD", desc: "Manage users & settings" },
  { id: "manager",     label: "Manager",     color: "#1D9E75", desc: "View & edit company data" },
  { id: "analyst",     label: "Analyst",     color: "#BA7517", desc: "Read-only with reports" },
  { id: "viewer",      label: "Viewer",      color: "#9B9590", desc: "Read-only access" },
];

export const INDUSTRY_COLORS = {
  Finance: "#C9A252", Healthcare: "#1D9E75", Aerospace: "#378ADD",
  Technology: "#BA7517", "Supply Chain": "#D85A30", Media: "#D854A0",
  Energy: "#639922", Cybersecurity: "#9B59B6"
};

export const buttonBase = {
  fontFamily: "var(--font-mono)", cursor: "pointer",
  letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500
};

export const inputStyle = {
  background: "var(--bg3)", border: "1px solid var(--border2)",
  color: "var(--text)", padding: "11px 12px", fontSize: 12,
  outline: "none", borderRadius: 0, width: "100%"
};

export const emptyProfile = {
  phone: "", location: "", employeeId: "",
  joiningDate: "", emergencyContact: "", signature: ""
};

export const emptyDisclosure = {
  companyName: "", fromDate: "", toDate: "", position: "",
  formerRole: "", currentRole: "", currentStatus: "Former",
  managerName: "", managerEmail: "", reasonForLeaving: "",
  canContact: "Yes", notes: ""
};

/* -- HELPERS -------------------------------------------------- */
export const buildRoleAssignments = (users, companies, assignments = {}) => {
  const next = {};
  users.forEach(u => {
    next[u.id] = {};
    companies.forEach(c => { next[u.id][c.id] = assignments[u.id]?.[c.id] || null; });
  });
  return next;
};

export const getProfile = u => ({
  ...emptyProfile, ...(u.profile || {}),
  phone:            u.phone            || u.profile?.phone            || "",
  location:         u.location         || u.profile?.location         || "",
  employeeId:       u.employeeId       || u.profile?.employeeId       || "",
  joiningDate:      u.joiningDate      || u.profile?.joiningDate      || "",
  emergencyContact: u.emergencyContact || u.profile?.emergencyContact || "",
  signature:        u.signature        || u.profile?.signature        || "",
});

export const getDisclosures = u =>
  Array.isArray(u.disclosures) ? u.disclosures : (u.disclosure ? [u.disclosure] : []);

/* -- SMALL REUSABLE COMPONENTS -------------------------------- */
export const statusBadge = (s) => {
  const map = {
    active:   { c: "#1D9E75", bg: "#1D9E7520" },
    trial:    { c: "#BA7517", bg: "#BA751720" },
    inas: { c: "#5C5A56", bg: "#5C5A5620" },
  };
  const { c, bg } = map[s] || map.inas;
  return (
    <span style={{ background: bg, color: c, border: `1px solid ${c}30`, padding: "2px 10px", borderRadius: 2, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>
      {s}
    </span>
  );
};

export const tierBadge = (t) => {
  const map = {
    enterprise: { c: "#C9A252", bg: "#C9A25215" },
    pro:        { c: "#378ADD", bg: "#378ADD15" },
    starter:    { c: "#9B9590", bg: "#9B959015" },
  };
  const { c, bg } = map[t] || map.starter;
  return (
    <span style={{ background: bg, color: c, border: `1px solid ${c}30`, padding: "2px 8px", borderRadius: 2, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>
      {t}
    </span>
  );
};

export const Avatar = ({ initials, color = "#C9A252", size = 36 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: `${color}18`, border: `1px solid ${color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.3, fontWeight: 500, color, letterSpacing: "0.05em", flexShrink: 0 }}>
    {initials}
  </div>
);

export const GeoPattern = ({ style }) => (
  <svg style={style} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="gp" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M0 40L40 0M-10 10L10 -10M30 50L50 30" stroke="#C9A252" strokeWidth="0.4" opacity="0.3" />
        <rect x="0" y="0" width="40" height="40" fill="none" stroke="#C9A252" strokeWidth="0.2" opacity="0.15" />
      </pattern>
    </defs>
    <rect width="400" height="400" fill="url(#gp)" />
    <circle cx="200" cy="200" r="180" stroke="#C9A252" strokeWidth="0.5" opacity="0.1" />
    <circle cx="200" cy="200" r="130" stroke="#C9A252" strokeWidth="0.5" opacity="0.08" />
    <circle cx="200" cy="200" r="80"  stroke="#C9A252" strokeWidth="0.5" opacity="0.06" />
    <line x1="0" y1="200" x2="400" y2="200" stroke="#C9A252" strokeWidth="0.4" opacity="0.12" />
    <line x1="200" y1="0" x2="200" y2="400" stroke="#C9A252" strokeWidth="0.4" opacity="0.12" />
    <line x1="0"   y1="0" x2="400" y2="400" stroke="#C9A252" strokeWidth="0.3" opacity="0.08" />
    <line x1="400" y1="0" x2="0"   y2="400" stroke="#C9A252" strokeWidth="0.3" opacity="0.08" />
  </svg>
);

export const Toast = ({ message }) => message ? (
  <div style={{ position: "absolute", right: 24, bottom: 24, zIndex: 50, background: "var(--bg3)", border: "1px solid var(--gold)50", borderLeft: "3px solid var(--gold)", color: "var(--text)", padding: "14px 18px", boxShadow: "0 18px 50px #0008", animation: "cmFadeUp .25s ease both", maxWidth: 360 }}>
    <p style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 4 }}>Success</p>
    <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>{message}</p>
  </div>
) : null;

export const Modal = ({ title, subtitle, onClose, children }) => (
  <div style={{ position: "absolute", inset: 0, zIndex: 40, background: "#05070bcc", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "cmFadeUp .18s ease both" }} onClick={onClose}>
    <div style={{ width: "min(560px,100%)", maxHeight: "88vh", overflow: "auto", background: "var(--bg2)", border: "1px solid var(--border2)", boxShadow: "0 24px 80px #000b", position: "relative" }} onClick={e => e.stopPropagation()}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg3)" }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 4 }}>{subtitle}</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400, color: "var(--text)" }}>{title}</h2>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", width: 32, height: 32, fontSize: 16, fontFamily: "var(--font-mono)", cursor: "pointer", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500 }}>x</button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

export const Field = ({ label, children }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <span style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--text3)", textTransform: "uppercase" }}>{label}</span>
    {children}
  </label>
);

export const TopBar = ({ title, subtitle, action }) => (
  <div style={{ padding: "0 32px", height: 64, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "var(--bg2)" }}>
    <div>
      <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--text3)", textTransform: "uppercase", marginBottom: 2 }}>{subtitle}</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, color: "var(--text)" }}>{title}</h1>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {action}
      <div style={{ width: 1, height: 28, background: "var(--border)" }} />
      <div style={{ fontSize: 11, color: "var(--text3)", letterSpacing: "0.08em" }}>
        {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </div>
    </div>
  </div>
);

export const SignaturePad = ({ value, onChange }) => {
  const ref = useRef(null), drawing = useRef(false);
  const point = e => { const r = ref.current.getBoundingClientRect(), s = e.touches?.[0] || e; return { x: s.clientX - r.left, y: s.clientY - r.top }; };
  const start = e => { e.preventDefault(); const c = ref.current, ctx = c.getContext("2d"), p = point(e); drawing.current = true; ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const move  = e => { if (!drawing.current) return; e.preventDefault(); const c = ref.current, ctx = c.getContext("2d"), p = point(e); ctx.lineTo(p.x, p.y); ctx.strokeStyle = "#C9A252"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.stroke(); onChange(c.toDataURL("image/png")); };
  const stop  = () => { drawing.current = false; };
  const clear = () => { const c = ref.current; c.getContext("2d").clearRect(0, 0, c.width, c.height); onChange(""); };
  useEffect(() => { if (!value || !ref.current) return; const img = new Image(); img.onload = () => ref.current.getContext("2d").drawImage(img, 0, 0); img.src = value; }, [value]);
  return (
    <div>
      <canvas ref={ref} width={480} height={130}
        onMouseDown={start} onMouseMove={move} onMouseUp={stop} onMouseLeave={stop}
        onTouchStart={start} onTouchMove={move} onTouchEnd={stop}
        style={{ width: "100%", height: 130, background: "var(--bg3)", border: "1px solid var(--border2)", display: "block", touchAction: "none" }}
      />
      <button onClick={clear} style={{ background: "none", border: "1px solid var(--border2)", color: "var(--text3)", padding: "7px 12px", fontSize: 10, marginTop: 8, fontFamily: "var(--font-mono)", cursor: "pointer", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500 }}>
        Clear Signature
      </button>
    </div>
  );
};
