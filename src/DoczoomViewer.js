import { useState, useRef, useCallback } from "react";
import {
  FaTimes, FaSearchPlus, FaSearchMinus, FaExpand,
  FaChevronLeft, FaChevronRight, FaDownload, FaFilePdf,
  FaFileImage, FaFileWord, FaFileExcel, FaFile,
} from "react-icons/fa";


const ZOOM_STEPS = [50, 67, 75, 90, 100, 110, 125, 150, 175, 200, 250, 300];
const DEFAULT_ZOOM_INDEX = ZOOM_STEPS.indexOf(100);

function FileTypeIcon({ name = "", size = 16 }) {
  const ext = (name.split(".").pop() || "").toLowerCase();
  if (ext === "pdf") return <FaFilePdf style={{ fontSize: size, color: "#e06060" }} />;
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return <FaFileImage style={{ fontSize: size, color: "#6aaaee" }} />;
  if (["doc", "docx"].includes(ext)) return <FaFileWord style={{ fontSize: size, color: "#6aaaee" }} />;
  if (["xls", "xlsx", "csv"].includes(ext)) return <FaFileExcel style={{ fontSize: size, color: "#4db896" }} />;
  return <FaFile style={{ fontSize: size, color: "#7a83b8" }} />;
}

export default function DocZoomViewer({
  title = "Document",
  meta = "",
  slides = null,
  url = null,
  downloadUrl = null,
  startIndex = 0,
  onClose,
}) {
  const hasSlides = Array.isArray(slides) && slides.length > 0;
  const [slideIndex, setSlideIndex] = useState(Math.min(startIndex, hasSlides ? slides.length - 1 : 0));
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX);
  const stageRef = useRef(null);

  const zoom = ZOOM_STEPS[zoomIndex];

  const zoomIn = useCallback(() => setZoomIndex((i) => Math.min(ZOOM_STEPS.length - 1, i + 1)), []);
  const zoomOut = useCallback(() => setZoomIndex((i) => Math.max(0, i - 1)), []);
  const zoomReset = useCallback(() => setZoomIndex(DEFAULT_ZOOM_INDEX), []);

  const handleWheel = (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

  const slide = hasSlides ? slides[slideIndex] : null;
  const ext = (title.split(".").pop() || "").toLowerCase();
  const isImage = ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext);
  const isPdf = ext === "pdf";

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 10050, background: "rgba(4,5,14,0.94)",
        display: "flex", flexDirection: "column",
      }}
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "#0a0d22", flexShrink: 0, flexWrap: "wrap", gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <FileTypeIcon name={title} size={18} />
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#f4f0ff", fontWeight: 800, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
            {meta && <div style={{ color: "#596197", fontSize: 10.5 }}>{meta}</div>}
          </div>
        </div>

        {/* Zoom controls  browser PDF style */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#080a1c", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", padding: 4 }}>
          <button
            onClick={zoomOut}
            disabled={zoomIndex === 0}
            title="Zoom out"
            style={zoomBtnStyle(zoomIndex === 0)}
          >
            <FaSearchMinus style={{ fontSize: 11 }} />
          </button>
          <button
            onClick={zoomReset}
            title="Reset to 100%"
            style={{
              minWidth: 56, textAlign: "center", padding: "6px 8px", background: "transparent",
              border: "none", color: "#D4A853", fontSize: 12, fontWeight: 800, cursor: "pointer",
              borderLeft: "1px solid rgba(255,255,255,0.06)", borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {zoom}%
          </button>
          <button
            onClick={zoomIn}
            disabled={zoomIndex === ZOOM_STEPS.length - 1}
            title="Zoom in"
            style={zoomBtnStyle(zoomIndex === ZOOM_STEPS.length - 1)}
          >
            <FaSearchPlus style={{ fontSize: 11 }} />
          </button>
          <button
            onClick={zoomReset}
            title="Fit to width (100%)"
            style={{ ...zoomBtnStyle(false), marginLeft: 2 }}
          >
            <FaExpand style={{ fontSize: 10 }} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={title}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9,
                border: "1px solid rgba(212,168,83,0.35)", color: "#D4A853", background: "rgba(212,168,83,0.08)",
                fontSize: 12, fontWeight: 700, textDecoration: "none",
              }}
            >
              <FaDownload style={{ fontSize: 11 }} /> Download
            </a>
          )}
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8, background: "transparent",
              border: "1px solid rgba(255,255,255,0.10)", color: "#596197", cursor: "pointer",
              display: "grid", placeItems: "center", fontSize: 14,
            }}
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        style={{ flex: 1, overflow: "auto", display: "flex", justifyContent: "center", padding: "32px 20px", background: "#05060f" }}
      >
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.12s ease",
            width: 720,
            flexShrink: 0,
          }}
        >
          {hasSlides ? (
            <div
              style={{
                background: "#0e1230", border: "1px solid rgba(212,168,83,0.25)", borderRadius: 14,
                padding: "40px 48px", minHeight: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", color: "#D4A853", textTransform: "uppercase", marginBottom: 14 }}>
                Section {slideIndex + 1} of {slides.length}
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 22, lineHeight: 1.3 }}>
                {slide.title}
              </div>
              <div
                style={{ fontSize: 15, lineHeight: 1.85, color: "rgba(255,255,255,0.78)" }}
                dangerouslySetInnerHTML={{ __html: slide.body }}
              />
            </div>
          ) : url && isPdf ? (
            <iframe src={url} title={title} style={{ width: "100%", height: 900, border: "none", background: "#fff", borderRadius: 8 }} />
          ) : url && isImage ? (
            <img src={url} alt={title} style={{ maxWidth: "100%", display: "block", borderRadius: 8 }} />
          ) : (
            <div
              style={{
                background: "#0e1230", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14,
                padding: 48, textAlign: "center", color: "#596197",
              }}
            >
              <FaFile style={{ fontSize: 40, marginBottom: 14, color: "#3d4570" }} />
              <div style={{ color: "#f4f0ff", fontWeight: 700, marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 13 }}>No inline preview available for this file type.</div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom slide nav (only when multi-slide content) */}
      {hasSlides && slides.length > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 18,
            padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", background: "#0a0d22", flexShrink: 0,
          }}
        >
          <button
            onClick={() => setSlideIndex((i) => Math.max(0, i - 1))}
            disabled={slideIndex === 0}
            style={navBtnStyle(slideIndex === 0)}
          >
            <FaChevronLeft style={{ marginRight: 6, fontSize: 11 }} /> Previous
          </button>
          <span style={{ fontSize: 11.5, color: "#596197", minWidth: 90, textAlign: "center" }}>
            {slideIndex + 1} / {slides.length}
          </span>
          <button
            onClick={() => setSlideIndex((i) => Math.min(slides.length - 1, i + 1))}
            disabled={slideIndex === slides.length - 1}
            style={navBtnStyle(slideIndex === slides.length - 1)}
          >
            Next <FaChevronRight style={{ marginLeft: 6, fontSize: 11 }} />
          </button>
        </div>
      )}
    </div>
  );
}

function zoomBtnStyle(disabled) {
  return {
    width: 28, height: 28, display: "grid", placeItems: "center", background: "transparent",
    border: "none", borderRadius: 6, color: disabled ? "#2c3050" : "#8b93c8",
    cursor: disabled ? "default" : "pointer",
  };
}

function navBtnStyle(disabled) {
  return {
    display: "inline-flex", alignItems: "center", padding: "7px 16px", borderRadius: 9,
    border: "1px solid rgba(255,255,255,0.10)", background: disabled ? "transparent" : "rgba(255,255,255,0.04)",
    color: disabled ? "#2c3050" : "#8b93c8", fontSize: 12, fontWeight: 700,
    cursor: disabled ? "default" : "pointer",
  };
}
