import { useState, useEffect, useRef } from "react";
import {
  FaPlusCircle,
  FaVideo,
  FaVoteYea,
  FaFileSignature,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaTimes,
  FaCalendar,
  FaSlack,
  FaFile,
} from "react-icons/fa";
import { MdMail } from "react-icons/md";

// -----------------------------------------------
//  STATIC DATA
// -----------------------------------------------
const DATA = {
  meetingTypes: ["Board Meeting", "Strategy Session", "Review Meeting", "Town Hall", "Committee Meeting"],
  agendaTypes: ["Presentation", "Discussion", "Report", "Vote", "Administrative"],
  participants: [
    { id: 1, name: "James Whitfield", email: "j.whitfield@corp.com", role: "host",     initials: "JW", color: "#D4A853" },
    { id: 2, name: "Sarah Chen",      email: "s.chen@corp.com",      role: "member",   initials: "SC", color: "#4A9ED4" },
    { id: 3, name: "Marcus Reid",     email: "m.reid@corp.com",      role: "member",   initials: "MR", color: "#7A6FDA" },
    { id: 4, name: "Elena Vasquez",   email: "e.vasquez@corp.com",   role: "member",   initials: "EV", color: "#4DB896" },
    { id: 5, name: "Thomas Park",     email: "t.park@corp.com",      role: "observer", initials: "TP", color: "#D4744A" },
  ],
  agendaItems: [
    { id: 1, title: "Opening & Roll Call",      duration: 5,  type: "Administrative", presenter: "James Whitfield" },
    { id: 2, title: "Q3 Financial Review",       duration: 20, type: "Report",         presenter: "Sarah Chen" },
    { id: 3, title: "Product Roadmap 2025",      duration: 30, type: "Presentation",   presenter: "Marcus Reid" },
    { id: 4, title: "Vendor Contract Decision",  duration: 15, type: "Vote",           presenter: "Elena Vasquez" },
  ],
  documents: [
    { id: 1, title: "Q3 Financial Report 2024",       pages: 24, status: "pending",   size: "2.4 MB", type: "PDF" },
    { id: 2, title: "Strategic Partnership Agreement", pages: 12, status: "signed",    size: "1.1 MB", type: "DOC" },
    { id: 3, title: "Board Resolution #2024-08",       pages: 4,  status: "pending",   size: "0.3 MB", type: "PDF" },
    { id: 4, title: "Annual Budget Approval",          pages: 8,  status: "reviewing", size: "0.9 MB", type: "XLS" },
  ],
  votes: [
    { id: 1, title: "Approve Q3 Budget Extension",   status: "active",  options: ["Approve","Reject","Abstain"],        results: { Approve:8, Reject:2, Abstain:1 }, deadline: "2 min", userVoted: false, userChoice: null },
    { id: 2, title: "Authorize New Vendor Contract",  status: "closed",  options: ["Yes","No","Need More Info"],          results: { Yes:10, No:1, "Need More Info":0 }, deadline: "Closed", userVoted: true, userChoice: "Yes" },
    { id: 3, title: "Office Expansion Initiative",    status: "pending", options: ["Proceed","Defer","Reject"],           results: { Proceed:0, Defer:0, Reject:0 }, deadline: "Starts after Item 4", userVoted: false, userChoice: null },
  ],
  conductAgenda: [
    { id: 1, title: "Opening & Roll Call",      duration: 5,  status: "done",    presenter: "James Whitfield" },
    { id: 2, title: "Q3 Financial Review",       duration: 20, status: "active",  presenter: "Sarah Chen" },
    { id: 3, title: "Product Roadmap 2025",      duration: 30, status: "pending", presenter: "Marcus Reid" },
    { id: 4, title: "Vendor Contract Decision",  duration: 15, status: "pending", presenter: "Elena Vasquez" },
  ],
};

// -----------------------------------------------
//  NAVIGATION
// -----------------------------------------------
const NAV_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; background: #07091A; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: rgba(212,168,83,0.25); border-radius: 99px; }

  .nav-shell { display: flex; min-height: 100vh; font-family: 'Outfit', sans-serif; background: #07091A; color: #E0E2EB; }

  .nav-sidebar {
    position: fixed; left: 0; top: 0; bottom: 0; width: 240px;
    background: #0B0D1E;
    border-right: 1px solid rgba(212,168,83,0.12);
    display: flex; flex-direction: column; z-index: 50;
  }

  .nav-brand {
    padding: 30px 24px 24px;
    border-bottom: 1px solid rgba(212,168,83,0.08);
  }

  .nav-brand-mark {
    display: flex; align-items: center; gap: 10px; margin-bottom: 4px;
  }

  .nav-brand-gem {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #D4A853, #8B6A2A);
    clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
    flex-shrink: 0;
  }

  .nav-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px; font-weight: 700; color: #D4A853; letter-spacing: 0.5px;
  }

  .nav-brand-tagline {
    font-size: 10px; color: #3D4165; text-transform: uppercase; letter-spacing: 2.5px;
    padding-left: 42px;
  }

  .nav-menu { padding: 20px 12px; flex: 1; }

  .nav-section-label {
    font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #2D3155;
    padding: 0 12px; margin-bottom: 8px; margin-top: 16px;
  }

  .nav-link {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 14px; border-radius: 10px; cursor: pointer;
    transition: all 0.2s; color: #4A5178; font-size: 13.5px; font-weight: 400;
    border: 1px solid transparent; margin-bottom: 2px; user-select: none;
  }

  .nav-link:hover { background: rgba(212,168,83,0.05); color: #A8936A; }

  .nav-link.nl-active {
    background: rgba(212,168,83,0.1);
    color: #D4A853; border-color: rgba(212,168,83,0.18); font-weight: 500;
  }

  .nav-link-icon { font-size: 15px; width: 18px; text-align: center; flex-shrink: 0; }

  .nav-link-badge {
    margin-left: auto; background: rgba(212,168,83,0.15); color: #D4A853;
    font-size: 10px; font-weight: 600; padding: 1px 7px; border-radius: 99px;
  }

  .nav-footer {
    padding: 16px 12px; border-top: 1px solid rgba(212,168,83,0.08);
  }

  .nav-user {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border-radius: 10px; background: rgba(255,255,255,0.02);
    border: 1px solid rgba(212,168,83,0.08);
  }

  .nav-user-av {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg, #D4A853, #8B6A2A);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #07091A; flex-shrink: 0;
  }

  .nav-user-name { font-size: 13px; font-weight: 500; color: #C8CAD8; }
  .nav-user-role { font-size: 10px; color: #3D4165; margin-top: 1px; text-transform: uppercase; letter-spacing: 0.5px; }

  .nav-main {
  margin-left: 240px;
  min-height: 100vh;
  flex: 1;
  width: calc(100% - 240px);
}
`;

function Navigation({ page, setPage }) {
  const links = [
    {
    id: "create",
    label: "Create Meeting",
    icon: <FaPlusCircle />,
    badge: null,
  },
  {
    id: "conduct",
    label: "Conduct Meeting",
    icon: <FaVideo />,
    badge: "Live",
  },
  {
    id: "voting",
    label: "Voting",
    icon: <FaVoteYea />,
    badge: "1",
  },
  {
    id: "sign",
    label: "Sign Documents",
    icon: <FaFileSignature />,
    badge: "2",
  },
  ];

  return (
    <div className="nav-shell">
      <style>{NAV_CSS}</style>
      <aside className="nav-sidebar">
        <div className="nav-brand">
          <div className="nav-brand-mark">
            <div className="nav-brand-gem" />
            <span className="nav-brand-name">Board Room</span>
          </div>
          <div className="nav-brand-tagline">Meeting Intelligence</div>
        </div>

        <nav className="nav-menu">
          <div className="nav-section-label">Workspace</div>
          {links.map(l => (
            <div
              key={l.id}
              className={`nav-link ${page === l.id ? "nl-active" : ""}`}
              onClick={() => setPage(l.id)}
            >
              <span className="nav-link-icon">{l.icon}</span>
              {l.label}
              {l.badge && <span className="nav-link-badge">{l.badge}</span>}
            </div>
          ))}
        </nav>

        <div className="nav-footer">
          <div className="nav-user">
            <div className="nav-user-av">JW</div>
            <div>
              <div className="nav-user-name">James Whitfield</div>
              <div className="nav-user-role">Meeting Chair</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="nav-main">{/* content rendered outside */}</main>
    </div>
  );
}

// -----------------------------------------------
//  CREATE MEETING  WIZARD
// -----------------------------------------------
const CM_CSS = `
  .cm-wrap { padding: 48px 52px; max-width: 1400px; width: 100%; font-family: 'Outfit', sans-serif; }

  .cm-page-title { font-family: 'Cormorant Garamond', serif; font-size: 40px; font-weight: 700; color: #E0E2EB; margin-bottom: 6px; }
  .cm-page-sub { font-size: 13px; color: #3D4165; margin-bottom: 44px; }

  /* Stepper */
  .cm-stepper { display: flex; align-items: flex-start; margin-bottom: 48px; position: relative; }
  .cm-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
  .cm-step-dot {
    width: 46px; height: 46px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 600; z-index: 2; position: relative;
    background: #0D1028; border: 2px solid #1C2045; color: #2D3363;
    transition: all 0.35s;
  }
  .cm-step.cs-done .cm-step-dot { background: rgba(212,168,83,0.12); border-color: rgba(212,168,83,0.5); color: #D4A853; }
  .cm-step.cs-active .cm-step-dot {
    background: linear-gradient(135deg, #D4A853, #B8892C);
    border-color: #D4A853; color: #07091A;
    box-shadow: 0 0 0 6px rgba(212,168,83,0.12), 0 4px 20px rgba(212,168,83,0.4);
  }
  .cm-step-name { font-size: 11px; color: #2D3363; margin-top: 8px; text-align: center; text-transform: uppercase; letter-spacing: 1px; }
  .cm-step.cs-active .cm-step-name, .cm-step.cs-done .cm-step-name { color: #D4A853; }
  .cm-step-bar {
    position: absolute; top: 23px; left: 50%; right: -50%;
    height: 1px; background: #1C2045; z-index: 1;
  }
  .cm-step-bar.sb-done { background: linear-gradient(90deg, #D4A853, rgba(212,168,83,0.2)); }
  .cm-step:last-child .cm-step-bar { display: none; }

  /* Card */
  .cm-card { background: #0B0D22; border: 1px solid rgba(212,168,83,0.1); border-radius: 20px; padding: 36px; margin-bottom: 24px; }
  .cm-card-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; color: #E0E2EB; margin-bottom: 4px; }
  .cm-card-desc { font-size: 12.5px; color: #3D4165; margin-bottom: 30px; }

  /* Fields */
  .cm-field { margin-bottom: 22px; }
  .cm-label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #4A5178; font-weight: 500; margin-bottom: 8px; }
  .cm-input, .cm-select, .cm-textarea {
    width: 100%; background: #07091A;
    border: 1px solid rgba(212,168,83,0.12); border-radius: 10px;
    padding: 13px 16px; color: #C8CAD8;
    font-family: 'Outfit', sans-serif; font-size: 14px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s; appearance: none;
  }
  .cm-input:focus, .cm-select:focus, .cm-textarea:focus {
    border-color: rgba(212,168,83,0.45);
    box-shadow: 0 0 0 3px rgba(212,168,83,0.06);
  }
  .cm-input::placeholder, .cm-textarea::placeholder { color: #252843; }
  .cm-textarea { resize: vertical; min-height: 96px; }
  .cm-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

  /* Agenda items */
  .cm-agenda-list { margin-bottom: 14px; }
  .cm-agenda-row {
    display: flex; align-items: center; gap: 14px;
    background: #07091A; border: 1px solid rgba(212,168,83,0.08);
    border-radius: 12px; padding: 16px 18px; margin-bottom: 10px;
    transition: border-color 0.2s;
  }
  .cm-agenda-row:hover { border-color: rgba(212,168,83,0.2); }
  .cm-agenda-num {
    width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
    background: rgba(212,168,83,0.1); color: #D4A853;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 600;
  }
  .cm-agenda-body { flex: 1; }
  .cm-agenda-title { font-size: 13.5px; color: #C8CAD8; font-weight: 500; margin-bottom: 3px; }
  .cm-agenda-meta { font-size: 11px; color: #3D4165; }
  .cm-agenda-dur {
    font-size: 11px; color: #6A7B3A; background: rgba(106,123,58,0.12);
    padding: 3px 10px; border-radius: 99px; white-space: nowrap; flex-shrink: 0;
  }
  .cm-agenda-rm { background: none; border: none; color: #2D3363; cursor: pointer; font-size: 18px; line-height: 1; transition: color 0.2s; padding: 2px 6px; border-radius: 6px; }
  .cm-agenda-rm:hover { color: #EF4444; background: rgba(239,68,68,0.08); }

  .cm-add-row {
    display: flex; gap: 10px; margin-bottom: 10px;
  }
  .cm-add-row .cm-input { flex: 1; }
  .cm-add-small { width: 100px; flex-shrink: 0; }

  .cm-btn-ghost {
    width: 100%; padding: 13px; border: 1px dashed rgba(212,168,83,0.18);
    border-radius: 12px; background: transparent; color: #7A6840;
    font-family: 'Outfit', sans-serif; font-size: 13px; cursor: pointer;
    transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .cm-btn-ghost:hover { background: rgba(212,168,83,0.04); border-style: solid; color: #D4A853; }

  /* Participants */
  .cm-participant {
    display: flex; align-items: center; gap: 14px;
    padding: 13px 16px; background: #07091A;
    border: 1px solid rgba(212,168,83,0.07); border-radius: 12px; margin-bottom: 8px;
    transition: border-color 0.2s;
  }
  .cm-participant:hover { border-color: rgba(212,168,83,0.18); }
  .cm-av {
    width: 38px; height: 38px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #07091A; flex-shrink: 0;
  }
  .cm-p-info { flex: 1; }
  .cm-p-name { font-size: 13.5px; color: #C8CAD8; font-weight: 500; }
  .cm-p-email { font-size: 11px; color: #3D4165; margin-top: 2px; }
  .cm-p-role {
    font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;
    padding: 4px 12px; border-radius: 99px; flex-shrink: 0;
  }
  .role-host { background: rgba(212,168,83,0.12); color: #D4A853; }
  .role-member { background: rgba(74,158,212,0.12); color: #4A9ED4; }
  .role-observer { background: rgba(74,81,120,0.3); color: #6A7198; }

  /* Invitation */
  .cm-invite-box {
    background: linear-gradient(135deg, rgba(212,168,83,0.05), rgba(212,168,83,0.02));
    border: 1px solid rgba(212,168,83,0.15); border-radius: 16px; padding: 28px; margin-bottom: 22px;
  }
  .cm-invite-top { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 20px; }
  .cm-invite-ic {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(212,168,83,0.15); border: 1px solid rgba(212,168,83,0.25);
    display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0;
  }
  .cm-invite-meeting { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: #E0E2EB; margin-bottom: 4px; }
  .cm-invite-when { font-size: 13px; color: #D4A853; }
  .cm-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .cm-chip {
    padding: 5px 13px; border-radius: 99px;
    background: rgba(212,168,83,0.07); border: 1px solid rgba(212,168,83,0.15);
    color: #A8936A; font-size: 11.5px;
  }

  .cm-channel-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 22px; }
  .cm-channel {
    padding: 18px 14px; border-radius: 14px; text-align: center;
    background: #07091A; border: 1px solid rgba(212,168,83,0.08);
    cursor: pointer; transition: all 0.2s;
  }
  .cm-channel:hover { border-color: rgba(212,168,83,0.3); background: rgba(212,168,83,0.04); }
  .cm-channel.ch-on { border-color: rgba(212,168,83,0.45); background: rgba(212,168,83,0.07); }
  .cm-channel-icon { font-size: 24px; margin-bottom: 8px; }
  .cm-channel-lbl { font-size: 11.5px; color: #4A5178; font-weight: 500; }
  .cm-channel.ch-on .cm-channel-lbl { color: #D4A853; }

  /* Actions */
  .cm-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 4px; }
  .cm-btn-back {
    padding: 12px 26px; border-radius: 10px;
    border: 1px solid rgba(212,168,83,0.18); background: transparent;
    color: #7A6840; font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
  }
  .cm-btn-back:hover { color: #D4A853; border-color: rgba(212,168,83,0.35); }
  .cm-btn-next {
    padding: 12px 32px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #D4A853 0%, #B8892C 100%);
    color: #07091A; font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 600;
    cursor: pointer; transition: all 0.25s; display: flex; align-items: center; gap: 8px;
  }
  .cm-btn-next:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(212,168,83,0.35); }
  .cm-step-counter { font-size: 12px; color: #3D4165; }

  .cm-success {
    text-align: center; padding: 60px 40px;
  }
  .cm-success-ring {
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(212,168,83,0.12); border: 2px solid #D4A853;
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; margin: 0 auto 24px;
    animation: pulse-ring 2s ease infinite;
  }
  @keyframes pulse-ring { 0%,100% { box-shadow: 0 0 0 0 rgba(212,168,83,0.3); } 50% { box-shadow: 0 0 0 12px rgba(212,168,83,0); } }
  .cm-success-title { font-family: 'Cormorant Garamond', serif; font-size: 30px; color: #E0E2EB; margin-bottom: 10px; }
  .cm-success-sub { font-size: 13px; color: #4A5178; }
`;

// Step 1  Meeting Details
function StepDetails({ data, onChange }) {
  return (
    <>
      <div className="cm-card-title">Meeting Details</div>
      <div className="cm-card-desc">Define the core information for your meeting</div>
      <div className="cm-field">
        <label className="cm-label">Meeting Title</label>
        <input className="cm-input" placeholder="e.g. Q4 Board Review" value={data.title} onChange={e => onChange("title", e.target.value)} />
      </div>
      <div className="cm-row-2">
        <div className="cm-field">
          <label className="cm-label">Meeting Type</label>
          <select className="cm-select" value={data.type} onChange={e => onChange("type", e.target.value)}>
            {DATA.meetingTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="cm-field">
          <label className="cm-label">Location / Platform</label>
          <input className="cm-input" placeholder="Conference Room A / Zoom" value={data.location} onChange={e => onChange("location", e.target.value)} />
        </div>
      </div>
      <div className="cm-row-2">
        <div className="cm-field">
          <label className="cm-label">Date</label>
          <input className="cm-input" type="date" value={data.date} onChange={e => onChange("date", e.target.value)} />
        </div>
        <div className="cm-field">
          <label className="cm-label">Time</label>
          <input className="cm-input" type="time" value={data.time} onChange={e => onChange("time", e.target.value)} />
        </div>
      </div>
      <div className="cm-field">
        <label className="cm-label">Description</label>
        <textarea className="cm-textarea" placeholder="Briefly describe the purpose and objectives of this meeting" value={data.description} onChange={e => onChange("description", e.target.value)} />
      </div>
    </>
  );
}

// Step 2  Agenda
function StepAgenda({ items, setItems }) {
  const [draft, setDraft] = useState({ title: "", duration: "15", type: "Discussion", presenter: "" });

  const add = () => {
    if (!draft.title.trim()) return;
    setItems(prev => [...prev, { id: Date.now(), ...draft }]);
    setDraft({ title: "", duration: "15", type: "Discussion", presenter: "" });
  };

  return (
    <>
      <div className="cm-card-title">Meeting Agenda</div>
      <div className="cm-card-desc">Structure your meeting with timed agenda items</div>
      <div className="cm-agenda-list">
        {items.map((item, i) => (
          <div key={item.id} className="cm-agenda-row">
            <div className="cm-agenda-num">{i + 1}</div>
            <div className="cm-agenda-body">
              <div className="cm-agenda-title">{item.title}</div>
              <div className="cm-agenda-meta">{item.type} · {item.presenter}</div>
            </div>
            <div className="cm-agenda-dur">{item.duration} min</div>
            <button className="cm-agenda-rm" onClick={() => setItems(prev => prev.filter(x => x.id !== item.id))}>×</button>
          </div>
        ))}
      </div>
      <div style={{ background: "#07091A", border: "1px dashed rgba(212,168,83,0.15)", borderRadius: 14, padding: 20, marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "#3D4165", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14, fontWeight: 500 }}>Add Agenda Item</div>
        <div className="cm-add-row">
          <input className="cm-input" placeholder="Agenda title" value={draft.title} onChange={e => setDraft(p => ({ ...p, title: e.target.value }))} />
          <input className="cm-input cm-add-small" type="number" placeholder="Min" value={draft.duration} onChange={e => setDraft(p => ({ ...p, duration: e.target.value }))} />
        </div>
        <div className="cm-add-row">
          <select className="cm-select" value={draft.type} onChange={e => setDraft(p => ({ ...p, type: e.target.value }))}>
            {DATA.agendaTypes.map(t => <option key={t}>{t}</option>)}
          </select>
          <input className="cm-input" placeholder="Presenter name" value={draft.presenter} onChange={e => setDraft(p => ({ ...p, presenter: e.target.value }))} />
          <button
            onClick={add}
            style={{ flexShrink: 0, padding: "0 22px", background: "rgba(212,168,83,0.12)", border: "1px solid rgba(212,168,83,0.3)", borderRadius: 10, color: "#D4A853", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
          >+ Add</button>
        </div>
      </div>
    </>
  );
}

// Step 3  Participants
function StepParticipants({ participants, setParticipants }) {
  const [search, setSearch] = useState("");

  const toggle = (p) => {
    setParticipants(prev =>
      prev.find(x => x.id === p.id) ? prev.filter(x => x.id !== p.id) : [...prev, p]
    );
  };

  return (
    <>
      <div className="cm-card-title">Participants</div>
      <div className="cm-card-desc">Add attendees and assign their roles</div>
      <div className="cm-field">
        <label className="cm-label">Search Contacts</label>
        <input className="cm-input" placeholder="Search by name or email" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={{ marginBottom: 16 }}>
        {DATA.participants
          .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()))
          .map(p => {
            const selected = participants.find(x => x.id === p.id);
            return (
              <div key={p.id} className="cm-participant" style={{ opacity: selected ? 1 : 0.55, cursor: "pointer" }} onClick={() => toggle(p)}>
                <div className="cm-av" style={{ background: p.color }}>{p.initials}</div>
                <div className="cm-p-info">
                  <div className="cm-p-name">{p.name}</div>
                  <div className="cm-p-email">{p.email}</div>
                </div>
                <span className={`cm-p-role role-${p.role}`}>{p.role}</span>
                <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${selected ? "#D4A853" : "rgba(212,168,83,0.15)"}`, background: selected ? "rgba(212,168,83,0.15)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#D4A853", flexShrink: 0, transition: "all 0.2s" }}>
                  {selected ? <FaCheck/> : <FaTimes/>}
                </div>
              </div>
            );
          })}
      </div>
      <div style={{ fontSize: 12, color: "#3D4165", textAlign: "center" }}>
        {participants.length} participant{participants.length !== 1 ? "s" : ""} selected
      </div>
    </>
  );
}

// Step 4  Send Invitations
function StepInvite({ meetingData, participants, channels, setChannels }) {
  const toggle = (c) => setChannels(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const allChannels = [
    { id: "email", label: "Email", icon: <MdMail/> },
    { id: "calendar", label: "Calendar", icon: <FaCalendar/> },
    { id: "slack", label: "Slack", icon: <FaSlack/> },
  ];

  return (
    <>
      <div className="cm-card-title">Send Invitations</div>
      <div className="cm-card-desc">Review and dispatch invitations to all participants</div>
      <div className="cm-invite-box">
        <div className="cm-invite-top">
          <div className="cm-invite-ic"><FaFile/></div>
          <div>
            <div className="cm-invite-meeting">{meetingData.title || "Untitled Meeting"}</div>
            <div className="cm-invite-when">{meetingData.date || "TBD"} · {meetingData.time || "TBD"} · {meetingData.location || "Location TBD"}</div>
          </div>
        </div>
        <div className="cm-chips">
          <span className="cm-chip">{meetingData.type}</span>
          <span className="cm-chip">{participants.length} Participants</span>
        </div>
      </div>
      <div style={{ fontSize: 11, color: "#4A5178", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 12, fontWeight: 500 }}>Send via</div>
      <div className="cm-channel-grid">
        {allChannels.map(c => (
          <div key={c.id} className={`cm-channel ${channels.includes(c.id) ? "ch-on" : ""}`} onClick={() => toggle(c.id)}>
            <div className="cm-channel-icon">{c.icon}</div>
            <div className="cm-channel-lbl">{c.label}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function CreateMeeting() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [meetingData, setMeetingData] = useState({ title: "Q4 Board Review", type: "Board Meeting", location: "Conference Room A", date: "2024-11-15", time: "09:00", description: "" });
  const [agendaItems, setAgendaItems] = useState([...DATA.agendaItems]);
  const [participants, setParticipants] = useState(DATA.participants.slice(0, 3));
  const [channels, setChannels] = useState(["email", "calendar"]);

  const steps = ["Details", "Agenda", "Participants", "Invite"];
  const updateMeeting = (k, v) => setMeetingData(p => ({ ...p, [k]: v }));

  if (done) return (
    <>
      <style>{CM_CSS}</style>
      <div className="cm-wrap">
        <div className="cm-card cm-success">
          <div className="cm-success-ring">?</div>
          <div className="cm-success-title">Meeting Created!</div>
          <div className="cm-success-sub">Invitations sent to {participants.length} participants via {channels.join(" & ")}.</div>
          <button className="cm-btn-next" style={{ margin: "28px auto 0", justifyContent: "center" }} onClick={() => { setStep(0); setDone(false); }}>Create Another</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{CM_CSS}</style>
      <div className="cm-wrap">
        <div className="cm-page-title">Create Meeting</div>
        <div className="cm-page-sub">Set up a structured meeting with agenda, participants, and automated invitations</div>

        <div className="cm-stepper">
          {steps.map((s, i) => (
            <div key={s} className={`cm-step ${i < step ? "cs-done" : i === step ? "cs-active" : ""}`}>
              <div className="cm-step-dot">{i < step ? "?" : i + 1}</div>
              <div className="cm-step-name">{s}</div>
              <div className={`cm-step-bar ${i < step ? "sb-done" : ""}`} />
            </div>
          ))}
        </div>

        <div className="cm-card">
          {step === 0 && <StepDetails data={meetingData} onChange={updateMeeting} />}
          {step === 1 && <StepAgenda items={agendaItems} setItems={setAgendaItems} />}
          {step === 2 && <StepParticipants participants={participants} setParticipants={setParticipants} />}
          {step === 3 && <StepInvite meetingData={meetingData} participants={participants} channels={channels} setChannels={setChannels} />}
        </div>

        <div className="cm-footer">
          {step > 0
            ? <button className="cm-btn-back" onClick={() => setStep(s => s - 1)}><FaArrowLeft/> Back</button>
            : <span />
          }
          <span className="cm-step-counter">Step {step + 1} of {steps.length}</span>
          {step < 3
            ? <button className="cm-btn-next" onClick={() => setStep(s => s + 1)}>Continue <FaArrowRight/> </button>
            : <button className="cm-btn-next" onClick={() => setDone(true)}><MdMail/> Send Invitations</button>
          }
        </div>
      </div>
    </>
  );
}

// -----------------------------------------------
//  CONDUCT MEETING
// -----------------------------------------------
const CONDUCT_CSS = `
  .co-wrap { padding: 40px 52px; font-family: 'Outfit', sans-serif; max-width: 1500px; width: 100%; }
  .co-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 36px; }
  .co-title { font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 700; color: #E0E2EB; margin-bottom: 4px; }
  .co-meta { font-size: 13px; color: #4A5178; }
  .co-live { display: flex; align-items: center; gap: 8px; padding: 8px 18px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); border-radius: 99px; }
  .co-live-dot { width: 8px; height: 8px; border-radius: 50%; background: #EF4444; animation: blink 1.2s ease infinite; }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
  .co-live-text { font-size: 12px; color: #EF4444; font-weight: 600; letter-spacing: 0.5px; }

  .co-grid { display: grid; grid-template-columns: 1fr 340px; gap: 22px; }

  .co-card { background: #0B0D22; border: 1px solid rgba(212,168,83,0.1); border-radius: 18px; padding: 28px; }
  .co-card-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #4A5178; font-weight: 500; margin-bottom: 18px; }

  /* Timer */
  .co-timer-block {
    display: flex; align-items: center; gap: 24px;
    padding: 24px; background: linear-gradient(135deg, rgba(212,168,83,0.08), rgba(212,168,83,0.03));
    border: 1px solid rgba(212,168,83,0.18); border-radius: 16px; margin-bottom: 20px;
  }
  .co-clock { font-family: 'Cormorant Garamond', serif; font-size: 52px; color: #D4A853; font-weight: 600; line-height: 1; letter-spacing: -2px; }
  .co-timer-info { flex: 1; }
  .co-current-item { font-size: 16px; color: #E0E2EB; font-weight: 500; margin-bottom: 4px; }
  .co-current-by { font-size: 12.5px; color: #4A5178; }
  .co-timer-controls { display: flex; gap: 8px; }
  .co-btn-ctrl {
    padding: 9px 18px; border-radius: 9px; border: 1px solid rgba(212,168,83,0.2);
    background: transparent; color: #D4A853; font-family: 'Outfit', sans-serif;
    font-size: 13px; cursor: pointer; transition: all 0.2s;
  }
  .co-btn-ctrl:hover { background: rgba(212,168,83,0.08); }
  .co-btn-ctrl.ctrl-primary { background: rgba(212,168,83,0.12); }

  /* Progress */
  .co-progress-wrap { margin-bottom: 20px; }
  .co-progress-bar { height: 4px; background: #0D1028; border-radius: 99px; overflow: hidden; margin-bottom: 6px; }
  .co-progress-fill { height: 100%; background: linear-gradient(90deg, #D4A853, #B8892C); border-radius: 99px; transition: width 0.5s; }
  .co-progress-text { font-size: 11px; color: #3D4165; }

  /* Agenda items */
  .co-agenda-item {
    display: flex; align-items: center; gap: 14px;
    padding: 13px 16px; border-radius: 12px; margin-bottom: 8px;
    border: 1px solid transparent; transition: all 0.2s;
  }
  .co-agenda-item.ai-done { opacity: 0.45; }
  .co-agenda-item.ai-active { background: rgba(212,168,83,0.07); border-color: rgba(212,168,83,0.2); }
  .co-agenda-item.ai-pending { background: rgba(255,255,255,0.02); }
  .co-ai-bullet { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .ai-done .co-ai-bullet { background: rgba(212,168,83,0.4); }
  .ai-active .co-ai-bullet { background: #D4A853; box-shadow: 0 0 8px rgba(212,168,83,0.6); }
  .ai-pending .co-ai-bullet { background: #1C2045; border: 1px solid #2D3363; }
  .co-ai-text { flex: 1; font-size: 13.5px; color: #C8CAD8; }
  .ai-done .co-ai-text { color: #3D4165; text-decoration: line-through; }
  .co-ai-dur { font-size: 11px; color: #3D4165; }

  /* Attendees */
  .co-attendee {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 10px; margin-bottom: 6px;
    background: rgba(255,255,255,0.02); border: 1px solid rgba(212,168,83,0.06);
  }
  .co-att-av { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #07091A; flex-shrink: 0; }
  .co-att-name { flex: 1; font-size: 13px; color: #A8AAB8; }
  .co-att-status { width: 7px; height: 7px; border-radius: 50%; background: #2ECC71; }

  /* Notes */
  .co-notes-area {
    width: 100%; background: #07091A; border: 1px solid rgba(212,168,83,0.1);
    border-radius: 12px; padding: 16px; color: #C8CAD8;
    font-family: 'Outfit', sans-serif; font-size: 13.5px; outline: none;
    resize: none; min-height: 120px; transition: border-color 0.2s;
    line-height: 1.6;
  }
  .co-notes-area:focus { border-color: rgba(212,168,83,0.3); }

  .co-action-row { display: flex; gap: 10px; margin-top: 14px; }
  .co-act-btn {
    flex: 1; padding: 11px; border-radius: 10px; border: 1px solid rgba(212,168,83,0.18);
    background: transparent; color: #7A6840; font-family: 'Outfit', sans-serif;
    font-size: 12.5px; cursor: pointer; transition: all 0.2s; font-weight: 500;
  }
  .co-act-btn:hover { color: #D4A853; border-color: rgba(212,168,83,0.35); background: rgba(212,168,83,0.04); }
  .co-act-btn.act-primary { background: linear-gradient(135deg, #D4A853, #B8892C); color: #07091A; border-color: transparent; font-weight: 600; }
  .co-act-btn.act-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(212,168,83,0.3); }
`;

function ConductMeeting() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [notes, setNotes] = useState("Opening remarks completed. Sarah Chen presenting Q3 numbers.\n\n Revenue up 12% YoY\n Expenses within budget\n");
  const agendaItems = DATA.conductAgenda;
  const activeIdx = agendaItems.findIndex(a => a.status === "active");
  const activeItem = agendaItems[activeIdx];
  const progress = Math.round(((activeIdx + 0.5) / agendaItems.length) * 100);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <>
      <style>{CONDUCT_CSS}</style>
      <div className="co-wrap">
        <div className="co-header">
          <div>
            <div className="co-title">Q4 Board Review</div>
            <div className="co-meta">Board Meeting · Nov 15, 2024 · Conference Room A</div>
          </div>
          <div className="co-live">
            <div className="co-live-dot" />
            <span className="co-live-text">IN SESSION</span>
          </div>
        </div>

        <div className="co-grid">
          <div>
            <div className="co-timer-block">
              <div className="co-clock">{fmt(seconds)}</div>
              <div className="co-timer-info">
                <div className="co-current-item">{activeItem?.title}</div>
                <div className="co-current-by">Presenter: {activeItem?.presenter}</div>
              </div>
              <div className="co-timer-controls">
                <button className="co-btn-ctrl" onClick={() => setRunning(r => !r)}>
                  {running ? "? Pause" : "? Resume"}
                </button>
                <button className="co-btn-ctrl ctrl-primary">Next Item </button>
              </div>
            </div>

            <div className="co-card" style={{ marginBottom: 20 }}>
              <div className="co-card-title">Session Progress</div>
              <div className="co-progress-wrap">
                <div className="co-progress-bar"><div className="co-progress-fill" style={{ width: `${progress}%` }} /></div>
                <div className="co-progress-text">Item {activeIdx + 1} of {agendaItems.length} · {progress}% complete</div>
              </div>
              {agendaItems.map(item => (
                <div key={item.id} className={`co-agenda-item ai-${item.status}`}>
                  <div className="co-ai-bullet" />
                  <div className="co-ai-text">{item.title}</div>
                  <div className="co-ai-dur">{item.duration} min</div>
                  {item.status === "active" && <span style={{ fontSize: 10, background: "rgba(212,168,83,0.15)", color: "#D4A853", padding: "2px 9px", borderRadius: 99, fontWeight: 600 }}>ACTIVE</span>}
                </div>
              ))}
            </div>

            <div className="co-card">
              <div className="co-card-title">Meeting Notes</div>
              <textarea className="co-notes-area" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Type meeting notes here" />
              <div className="co-action-row">
                <button className="co-act-btn">?? Attach File</button>
                <button className="co-act-btn">?? Start Vote</button>
                <button className="co-act-btn act-primary">? Save Notes</button>
              </div>
            </div>
          </div>

          <div>
            <div className="co-card" style={{ marginBottom: 20 }}>
              <div className="co-card-title">Attendees ({DATA.participants.length})</div>
              {DATA.participants.map(p => (
                <div key={p.id} className="co-attendee">
                  <div className="co-att-av" style={{ background: p.color }}>{p.initials}</div>
                  <div className="co-att-name">{p.name}</div>
                  <div className="co-att-status" />
                </div>
              ))}
            </div>

            <div className="co-card">
              <div className="co-card-title">Quick Actions</div>
              {[
                { label: "?? Share Screen", desc: "Present to all" },
                { label: "?? Open Voting", desc: "Start a poll" },
                { label: "? Sign Document", desc: "Request signatures" },
                { label: "? Extend Time", desc: "+5 minutes" },
              ].map(a => (
                <div key={a.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#07091A", borderRadius: 10, marginBottom: 8, border: "1px solid rgba(212,168,83,0.07)", cursor: "pointer" }}>
                  <span style={{ fontSize: 13, color: "#A8AAB8" }}>{a.label}</span>
                  <span style={{ fontSize: 11, color: "#3D4165" }}>{a.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// -----------------------------------------------
//  VOTING
// -----------------------------------------------
const VOTE_CSS = `
  .vt-wrap { padding: 48px 52px; font-family: 'Outfit', sans-serif; max-width: 1500px; width: 100%; }
  .vt-title { font-family: 'Cormorant Garamond', serif; font-size: 40px; font-weight: 700; color: #E0E2EB; margin-bottom: 6px; }
  .vt-sub { font-size: 13px; color: #3D4165; margin-bottom: 44px; }

  .vt-tabs { display: flex; gap: 4px; margin-bottom: 32px; background: #0B0D22; border-radius: 12px; padding: 5px; border: 1px solid rgba(212,168,83,0.08); width: fit-content; }
  .vt-tab { padding: 9px 24px; border-radius: 9px; font-size: 13px; color: #4A5178; cursor: pointer; transition: all 0.2s; font-weight: 500; }
  .vt-tab.vt-active { background: rgba(212,168,83,0.12); color: #D4A853; }

  .vt-card { background: #0B0D22; border: 1px solid rgba(212,168,83,0.1); border-radius: 18px; padding: 30px; margin-bottom: 20px; }

  .vt-vote-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 22px; }
  .vt-vote-title { font-size: 17px; color: #E0E2EB; font-weight: 500; margin-bottom: 6px; }
  .vt-vote-status {
    font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;
    padding: 5px 13px; border-radius: 99px; flex-shrink: 0;
  }
  .vs-active { background: rgba(46,204,113,0.12); color: #2ECC71; border: 1px solid rgba(46,204,113,0.25); }
  .vs-closed { background: rgba(74,81,120,0.3); color: #4A5178; border: 1px solid rgba(74,81,120,0.3); }
  .vs-pending { background: rgba(212,168,83,0.1); color: #D4A853; border: 1px solid rgba(212,168,83,0.2); }
  .vt-deadline { font-size: 12px; color: #4A5178; margin-top: 4px; }

  .vt-options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
  .vt-option {
    padding: 14px 18px; border-radius: 12px; border: 1px solid rgba(212,168,83,0.1);
    background: #07091A; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden;
  }
  .vt-option:hover { border-color: rgba(212,168,83,0.3); }
  .vt-option.vo-selected { border-color: #D4A853; background: rgba(212,168,83,0.07); }
  .vt-option.vo-voted { cursor: default; }

  .vt-opt-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .vt-opt-label { font-size: 14px; color: #C8CAD8; font-weight: 500; }
  .vt-opt-count { font-size: 13px; color: #D4A853; font-weight: 600; }
  .vt-opt-bar { height: 4px; background: #0D1028; border-radius: 99px; overflow: hidden; }
  .vt-opt-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #D4A853, #B8892C); transition: width 0.6s ease; }
  .vt-opt-pct { font-size: 10px; color: #3D4165; margin-top: 4px; text-align: right; }

  .vt-check { width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(212,168,83,0.25); display: inline-flex; align-items: center; justify-content: center; font-size: 10px; color: #D4A853; transition: all 0.2s; margin-right: 12px; flex-shrink: 0; }
  .vo-selected .vt-check { background: rgba(212,168,83,0.15); border-color: #D4A853; }

  .vt-btn {
    padding: 11px 28px; border-radius: 10px; font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.25s;
  }
  .vt-btn-cast { background: linear-gradient(135deg, #D4A853, #B8892C); border: none; color: #07091A; }
  .vt-btn-cast:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(212,168,83,0.35); }
  .vt-btn-cast:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

  .vt-total { font-size: 12px; color: #3D4165; margin-top: 14px; }
  .vt-your-vote { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #D4A853; margin-top: 10px; padding: 8px 14px; background: rgba(212,168,83,0.07); border-radius: 8px; }

  /* Create vote */
  .vt-create { display: flex; flex-direction: column; gap: 16px; }
  .vt-create-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #4A5178; font-weight: 500; margin-bottom: 6px; }
  .vt-create-input {
    width: 100%; background: #07091A; border: 1px solid rgba(212,168,83,0.12);
    border-radius: 10px; padding: 13px 16px; color: #C8CAD8;
    font-family: 'Outfit', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s;
  }
  .vt-create-input:focus { border-color: rgba(212,168,83,0.4); }
  .vt-create-input::placeholder { color: #252843; }
  .vt-option-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 6px; }
  .vt-opt-pill {
    padding: 6px 14px; background: rgba(212,168,83,0.08); border: 1px solid rgba(212,168,83,0.2);
    border-radius: 99px; color: #D4A853; font-size: 12.5px; display: flex; align-items: center; gap: 6px;
  }
  .vt-opt-pill button { background: none; border: none; color: #7A6840; cursor: pointer; font-size: 14px; padding: 0; line-height: 1; }
  .vt-opt-pill button:hover { color: #EF4444; }
`;

function VoteCard({ vote }) {
  const [choice, setChoice] = useState(vote.userChoice);
  const [cast, setCast] = useState(vote.userVoted);
  const total = Object.values(vote.results).reduce((a, b) => a + b, 0);
  const getTotal = () => cast ? total : total;

  return (
    <div className="vt-card">
      <div className="vt-vote-header">
        <div>
          <div className="vt-vote-title">{vote.title}</div>
          <div className="vt-deadline">? {vote.deadline}</div>
        </div>
        <span className={`vt-vote-status vs-${vote.status}`}>{vote.status.toUpperCase()}</span>
      </div>

      <div className="vt-options">
        {vote.options.map(opt => {
          const count = vote.results[opt] || 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const isSelected = choice === opt;
          return (
            <div
              key={opt}
              className={`vt-option ${isSelected ? "vo-selected" : ""} ${cast ? "vo-voted" : ""}`}
              onClick={() => { if (!cast && vote.status === "active") setChoice(opt); }}
            >
              <div className="vt-opt-top">
                <span style={{ display: "flex", alignItems: "center" }}>
                  <span className="vt-check">{isSelected ? "?" : ""}</span>
                  <span className="vt-opt-label">{opt}</span>
                </span>
                {(cast || vote.status === "closed") && <span className="vt-opt-count">{count} votes</span>}
              </div>
              {(cast || vote.status === "closed") && (
                <>
                  <div className="vt-opt-bar"><div className="vt-opt-fill" style={{ width: `${pct}%` }} /></div>
                  <div className="vt-opt-pct">{pct}%</div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {!cast && vote.status === "active" && (
        <button className="vt-btn vt-btn-cast" disabled={!choice} onClick={() => setCast(true)}>
          Cast Vote
        </button>
      )}

      {cast && <div className="vt-your-vote">? You voted: <strong>{choice}</strong></div>}
      <div className="vt-total">{total} total votes · {DATA.participants.length} participants</div>
    </div>
  );
}

function Voting() {
  const [tab, setTab] = useState("active");
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["Approve", "Reject"]);
  const [optInput, setOptInput] = useState("");

  const filtered = DATA.votes.filter(v => {
    if (tab === "active") return v.status === "active" || v.status === "pending";
    return v.status === "closed";
  });

  const addOption = () => {
    if (optInput.trim()) { setNewOptions(p => [...p, optInput.trim()]); setOptInput(""); }
  };

  return (
    <>
      <style>{VOTE_CSS}</style>
      <div className="vt-wrap">
        <div className="vt-title">Voting</div>
        <div className="vt-sub">Conduct transparent, real-time votes with instant results</div>

        <div className="vt-tabs">
          {[["active", "Active Votes"], ["closed", "Closed"], ["create", "Create Vote"]].map(([id, lbl]) => (
            <div key={id} className={`vt-tab ${tab === id ? "vt-active" : ""}`} onClick={() => setTab(id)}>{lbl}</div>
          ))}
        </div>

        {tab !== "create" && filtered.map(v => <VoteCard key={v.id} vote={v} />)}

        {tab === "create" && (
          <div className="vt-card">
            <div className="vt-vote-title" style={{ marginBottom: 24 }}>New Vote</div>
            <div className="vt-create">
              <div>
                <div className="vt-create-label">Question</div>
                <input className="vt-create-input" placeholder="What are you voting on?" value={newQuestion} onChange={e => setNewQuestion(e.target.value)} />
              </div>
              <div>
                <div className="vt-create-label">Options</div>
                <div className="vt-option-pills">
                  {newOptions.map((o, i) => (
                    <div key={i} className="vt-opt-pill">
                      {o}
                      <button onClick={() => setNewOptions(p => p.filter((_, j) => j !== i))}>×</button>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <input className="vt-create-input" placeholder="Add option" value={optInput} onChange={e => setOptInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addOption()} style={{ flex: 1 }} />
                  <button onClick={addOption} style={{ padding: "0 20px", background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.25)", borderRadius: 10, color: "#D4A853", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add</button>
                </div>
              </div>
              <button className="vt-btn vt-btn-cast" disabled={!newQuestion.trim() || newOptions.length < 2} style={{ alignSelf: "flex-start" }}>
                Launch Vote
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// -----------------------------------------------
//  SIGN DOCUMENTS
// -----------------------------------------------
const SIGN_CSS = `
  .sd-wrap { padding: 48px 52px; font-family: 'Outfit', sans-serif; max-width: 1500px; width: 100%; }
  .sd-title { font-family: 'Cormorant Garamond', serif; font-size: 40px; font-weight: 700; color: #E0E2EB; margin-bottom: 6px; }
  .sd-sub { font-size: 13px; color: #3D4165; margin-bottom: 44px; }

  .sd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }

  .sd-doc {
    background: #0B0D22; border: 1px solid rgba(212,168,83,0.1); border-radius: 16px;
    padding: 24px; cursor: pointer; transition: all 0.25s;
  }
  .sd-doc:hover { border-color: rgba(212,168,83,0.28); transform: translateY(-2px); }
  .sd-doc.sd-selected { border-color: rgba(212,168,83,0.5); background: rgba(212,168,83,0.04); }

  .sd-doc-top { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px; }
  .sd-doc-ic {
    width: 44px; height: 52px; border-radius: 8px; flex-shrink: 0;
    background: rgba(212,168,83,0.1); border: 1px solid rgba(212,168,83,0.2);
    display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #D4A853;
  }
  .sd-doc-title { font-size: 14px; color: #E0E2EB; font-weight: 500; margin-bottom: 5px; line-height: 1.4; }
  .sd-doc-meta { font-size: 11px; color: #3D4165; }

  .sd-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 12px; border-radius: 99px; font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .sb-pending { background: rgba(212,168,83,0.1); color: #D4A853; border: 1px solid rgba(212,168,83,0.2); }
  .sb-signed { background: rgba(46,204,113,0.1); color: #2ECC71; border: 1px solid rgba(46,204,113,0.2); }
  .sb-reviewing { background: rgba(74,158,212,0.1); color: #4A9ED4; border: 1px solid rgba(74,158,212,0.2); }

  .sd-signers { display: flex; align-items: center; gap: 6px; margin-top: 14px; }
  .sd-signer-av { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #07091A; border: 2px solid #0B0D22; margin-left: -6px; }
  .sd-signer-av:first-child { margin-left: 0; }
  .sd-signers-label { font-size: 11px; color: #3D4165; margin-left: 4px; }

  /* Signature panel */
  .sd-panel { background: #0B0D22; border: 1px solid rgba(212,168,83,0.1); border-radius: 18px; padding: 30px; margin-top: 24px; }
  .sd-panel-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; color: #E0E2EB; margin-bottom: 6px; }
  .sd-panel-sub { font-size: 12.5px; color: #3D4165; margin-bottom: 24px; }

  .sd-sig-area {
    width: 100%; height: 160px; background: #07091A;
    border: 2px dashed rgba(212,168,83,0.2); border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 8px; cursor: crosshair; position: relative; overflow: hidden;
    transition: border-color 0.2s;
  }
  .sd-sig-area:hover { border-color: rgba(212,168,83,0.4); }
  .sd-sig-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
  .sd-sig-placeholder { color: #2D3363; font-size: 13px; pointer-events: none; text-align: center; }
  .sd-sig-icon { font-size: 28px; pointer-events: none; }

  .sd-sig-actions { display: flex; gap: 10px; margin-top: 14px; }
  .sd-btn {
    padding: 11px 24px; border-radius: 10px; font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(212,168,83,0.2); color: #7A6840; background: transparent;
  }
  .sd-btn:hover { color: #D4A853; border-color: rgba(212,168,83,0.4); }
  .sd-btn-primary { background: linear-gradient(135deg, #D4A853, #B8892C); border-color: transparent; color: #07091A; font-weight: 600; }
  .sd-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(212,168,83,0.35); color: #07091A; }
  .sd-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

  .sd-doc-preview {
    background: #07091A; border: 1px solid rgba(212,168,83,0.1);
    border-radius: 12px; padding: 24px 28px; margin-bottom: 20px; font-size: 13px; color: #6A7198; line-height: 1.8;
  }
  .sd-doc-preview h3 { font-family: 'Cormorant Garamond', serif; font-size: 16px; color: #C8CAD8; margin-bottom: 10px; }

  .sd-cert { text-align: center; padding: 40px; }
  .sd-cert-ic { font-size: 40px; margin-bottom: 16px; }
  .sd-cert-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: #D4A853; margin-bottom: 8px; }
  .sd-cert-sub { font-size: 13px; color: #4A5178; }
`;

function SignDocuments() {
  const [selected, setSelected] = useState(null);
  const [signed, setSigned] = useState({});
  const [drawing, setDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);
  const canvasRef = useRef(null);
  const lastPos = useRef(null);

  const selectedDoc = DATA.documents.find(d => d.id === selected);

  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  };

  const startDraw = (e) => {
    const canvas = canvasRef.current; if (!canvas) return;
    setDrawing(true); setHasSig(true);
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
    lastPos.current = pos;
    e.preventDefault();
  };

  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.strokeStyle = "#D4A853";
    ctx.lineTo(pos.x, pos.y); ctx.stroke();
    lastPos.current = pos;
    e.preventDefault();
  };

  const stopDraw = () => setDrawing(false);

  const clearSig = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
  };

  const sign = () => {
    setSigned(p => ({ ...p, [selected]: true }));
    clearSig();
    setSelected(null);
  };

  return (
    <>
      <style>{SIGN_CSS}</style>
      <div className="sd-wrap">
        <div className="sd-title">Sign Documents</div>
        <div className="sd-sub">Review and electronically sign meeting documents with a legally-binding signature</div>

        <div className="sd-grid">
          {DATA.documents.map(doc => {
            const isSigned = signed[doc.id] || doc.status === "signed";
            const status = isSigned ? "signed" : doc.status;
            return (
              <div key={doc.id} className={`sd-doc ${selected === doc.id ? "sd-selected" : ""}`} onClick={() => setSelected(doc.id)}>
                <div className="sd-doc-top">
                  <div className="sd-doc-ic">{doc.type}</div>
                  <div>
                    <div className="sd-doc-title">{doc.title}</div>
                    <div className="sd-doc-meta">{doc.pages} pages · {doc.size}</div>
                  </div>
                </div>
                <span className={`sd-badge sb-${status}`}>
                  {status === "signed" ? "? Signed" : status === "reviewing" ? "?? Reviewing" : "? Pending"}
                </span>
                <div className="sd-signers">
                  {DATA.participants.slice(0, 3).map(p => (
                    <div key={p.id} className="sd-signer-av" style={{ background: p.color }}>{p.initials}</div>
                  ))}
                  <span className="sd-signers-label">+{DATA.participants.length - 3} more · {isSigned ? "All signed" : "Awaiting signatures"}</span>
                </div>
              </div>
            );
          })}
        </div>

        {selectedDoc && !signed[selected] && selectedDoc.status !== "signed" && (
          <div className="sd-panel">
            <div className="sd-panel-title">{selectedDoc.title}</div>
            <div className="sd-panel-sub">{selectedDoc.pages} pages · {selectedDoc.size} · Please review and sign below</div>

            <div className="sd-doc-preview">
              <h3>Document Summary</h3>
              This document pertains to <strong style={{ color: "#C8CAD8" }}>{selectedDoc.title}</strong>. By signing, you acknowledge that you have read and understood the contents, agree to all stated terms, and confirm this constitutes your authorized electronic signature for all purposes.
              <br /><br />
              <strong style={{ color: "#C8CAD8" }}>Meeting:</strong> Q4 Board Review · Nov 15, 2024<br />
              <strong style={{ color: "#C8CAD8" }}>Requested by:</strong> James Whitfield · Board Chair
            </div>

            <div style={{ fontSize: 11, color: "#4A5178", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10, fontWeight: 500 }}>Draw your signature</div>
            <div className="sd-sig-area" onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}>
              <canvas ref={canvasRef} className="sd-sig-canvas" width={800} height={160} />
              {!hasSig && (
                <>
                  <div className="sd-sig-icon">?</div>
                  <div className="sd-sig-placeholder">Draw your signature here</div>
                </>
              )}
            </div>

            <div className="sd-sig-actions">
              <button className="sd-btn" onClick={clearSig}>Clear</button>
              <button className="sd-btn" onClick={() => setSelected(null)}>Cancel</button>
              <button className="sd-btn sd-btn-primary" disabled={!hasSig} onClick={sign}>
                ? Sign Document
              </button>
            </div>
          </div>
        )}

        {selectedDoc && (signed[selected] || selectedDoc.status === "signed") && (
          <div className="sd-panel">
            <div className="sd-cert">
              <div className="sd-cert-ic">?</div>
              <div className="sd-cert-title">Document Signed</div>
              <div className="sd-cert-sub">
                <strong style={{ color: "#C8CAD8" }}>{selectedDoc.title}</strong> has been signed.<br />
                Signature recorded on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// -----------------------------------------------
//  APP ROOT
// -----------------------------------------------
const APP_CSS = `
  .app-root { display: flex; min-height: 100vh; background: #07091A; }
  .app-content { margin-left: 240px; flex: 1; min-height: 100vh; }
`;

export default function App() {
  const [page, setPage] = useState("create");

  const PAGES = {
    create:  <CreateMeeting />,
    conduct: <ConductMeeting />,
    voting:  <Voting />,
    sign:    <SignDocuments />,
  };

  return (
    <>
      <style>{APP_CSS}</style>
      <div className="app-root">
        <Navigation page={page} setPage={setPage} />
        <div className="app-content">
          {PAGES[page]}
        </div>
      </div>
    </>
  );
}
