import { useRef } from "react";
import { DATA } from "./MeetingData";
import "./BoardPack.css";
import { FaCheck } from "react-icons/fa";

export default function BoardPack({
  selected = [],
  setSelected = () => {},
  onDocClick = () => {},
}) {
  const fileInputRef = useRef(null);
  const safeSelected = Array.isArray(selected) ? selected : [];

  const toggle = (e, doc) => {
    e.stopPropagation(); // prevent card click from firing
    setSelected((prev = []) => {
      const exists = prev.some((x) => x.id === doc.id);
      if (exists) return prev.filter((x) => x.id !== doc.id);
      return [...prev, doc];
    });
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const uploadedDocs = files.map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      type: file.name.split(".").pop()?.toUpperCase() || "FILE",
      title: file.name,
      pages: "-",
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploaded: true,
      file,
      // create a blob URL so the popup can preview the file
      url: URL.createObjectURL(file),
    }));
    setSelected((prev = []) => [...prev, ...uploadedDocs]);
    e.target.value = "";
  };

  const allDocs = [
    ...(Array.isArray(DATA.boardPack) ? DATA.boardPack : []),
    ...safeSelected.filter((x) => x?.uploaded),
  ];

  return (
    <>
      <div className="cm-card-title">Board Pack</div>
      <div className="cm-card-desc">
        Attach meeting documents after participants are selected
      </div>

      <div className="bp-list">
        {allDocs.map((doc) => {
          const isSelected = safeSelected.some((x) => x.id === doc.id);
          return (
            <div
              key={doc.id}
              className={`bp-card ${isSelected ? "bp-selected" : ""}`}
              onClick={() => onDocClick(doc)}   // ? opens popup
              style={{ cursor: "pointer", position: "relative" }}
            >
              {/* Selection checkbox  top-right corner */}
              <div
                onClick={(e) => toggle(e, doc)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  border: isSelected
                    ? "2px solid #D4A853"
                    : "2px solid rgba(255,255,255,0.18)",
                  background: isSelected
                    ? "#D4A853"
                    : "rgba(255,255,255,0.04)",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "all 0.15s",
                  zIndex: 2,
                }}
                title={isSelected ? "Deselect" : "Select"}
              >
                {isSelected && (
                  <span style={{ color: "#06081a", fontSize: 10, fontWeight: 900, lineHeight: 1 }}>
                    <FaCheck/>
                  </span>
                )}
              </div>

              <div className="bp-type">{doc.type}</div>
              <div className="bp-title">{doc.title}</div>
              <div className="bp-meta">
                {doc.pages} pages · {doc.size}
              </div>

              {/* View label hint */}
              <div style={{
                marginTop: 8,
                fontSize: 10,
                color: "#596197",
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}>
                Click to view
              </div>
            </div>
          );
        })}
      </div>

      <div className="bp-upload">
        <div className="bp-upload-text">
          {safeSelected.length} board pack document
          {safeSelected.length !== 1 ? "s" : ""} attached
        </div>
        <button
          className="cm-btn-ghost"
          type="button"
          style={{ width: "auto", padding: "10px 18px" }}
          onClick={() => fileInputRef.current?.click()}
        >
          + Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={handleUpload}
        />
      </div>
    </>
  );
}