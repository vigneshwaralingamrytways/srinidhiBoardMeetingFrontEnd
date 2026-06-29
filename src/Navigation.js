import { FaBell, FaClipboardList, FaCog, FaFile, FaFileSignature, FaLaptop, FaPlug, FaPlus, FaSearch, FaTasks, FaUser, FaVideo, FaVoteYea } from "react-icons/fa";
import "./Navigation.css";
import { FaComputer, FaComputerMouse } from "react-icons/fa6";
import { MdRoom } from "react-icons/md";

export default function Navigation({ page, setPage }) {
  const links = [
   
    { id: "member", label: "Manage Board Members", icon: <FaUser/>, badge: null },
     { id: "companies", label: "Manage Company Profile", icon: <FaLaptop/>, badge: null },
    // {id: "bookMeetingRoom", label: "Meeting Room", icon: <MdRoom/>, badge:null},
    { id: "create", label: "Setup Board Meeting", icon: <FaPlus/>, badge: null },
    { id: "conduct", label: "Manage Board Meeting", icon: <FaVideo/>, badge: "Live" },
    // { id: "print", label: "Print Docs", icon: <FaFile/>, badge: null },
    { id: "notification", label: "Manage Notification", icon: <FaBell/>, badge: null },
    // { id: "circular", label: "Send Circular", icon: <FaFileSignature/>, badge: "3" },
    { id: "tasks", label: "Manage Actions", icon: <FaTasks/>, badge: null },
    { id: "resolutions", label: "Manage Resolutions", icon: <FaClipboardList/>, badge: null },
    { id: "meeting", label: "View Board Meeting", icon: <FaVideo/>, badge: null },
  ];

  return (
    <aside className="nav-sidebar">
      <div className="nav-brand">
        <div className="nav-brand-mark">
          <div className="nav-brand-gem" />
          <span className="nav-brand-name">Board Meeting</span>
        </div>
        {/* <div className="nav-brand-tagline">Meeting Intelligence</div> */}
      </div>

      <nav className="nav-menu">
        <div className="nav-section-label">Workspace</div>
        {links.map((link) => (
          <div
            key={link.id}
            className={`nav-link ${page === link.id ? "nl-active" : ""}`}
            onClick={() => setPage(link.id)}
          >
            <span className="nav-link-icon">{link.icon}</span>
            {link.label}
            {link.badge && <span className="nav-link-badge">{link.badge}</span>}
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
  );
}
