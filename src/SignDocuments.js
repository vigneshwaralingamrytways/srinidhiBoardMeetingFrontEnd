import { useRef, useState } from "react";
import { DATA } from "./MeetingData";
import "./SignDocuments.css";

export default function SignDocuments() {
  const [selected, setSelected] = useState(null);
  const [signed, setSigned] = useState({});
  const [drawing, setDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);
  const canvasRef = useRef(null);
  const selectedDoc = DATA.documents.find((doc) => doc.id === selected);

  const getPos = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src = event.touches ? event.touches[0] : event;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const startDraw = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDrawing(true);
    setHasSig(true);
    const ctx = canvas.getContext("2d");
    const pos = getPos(event, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    event.preventDefault();
  };

  const draw = (event) => {
    const canvas = canvasRef.current;
    if (!drawing || !canvas) return;
    const ctx = canvas.getContext("2d");
    const pos = getPos(event, canvas);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#D4A853";
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    event.preventDefault();
  };

  const clearSig = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
  };

  const sign = () => {
    setSigned((prev) => ({ ...prev, [selected]: true }));
    clearSig();
    setSelected(null);
  };

  return (
    <div className="sd-wrap">
      <div className="sd-inner">
        <div className="sd-title">Sign Documents</div>
        <div className="sd-sub">Review and electronically sign meeting documents with a legally-binding signature</div>
        <div className="sd-grid">
          {DATA.documents.map((doc) => {
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
                <span className={`sd-badge sb-${status}`}>{status === "signed" ? "? Signed" : status === "reviewing" ? "Reviewing" : "Pending"}</span>
                <div className="sd-signers">
                  {DATA.participants.slice(0, 3).map((person) => <div key={person.id} className="sd-signer-av" style={{ background: person.color }}>{person.initials}</div>)}
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
              This document pertains to <strong style={{ color: "#C8CAD8" }}>{selectedDoc.title}</strong>. Signing confirms review, approval, and electronic authorization for this board meeting workflow.
              <br /><br />
              <strong style={{ color: "#C8CAD8" }}>Meeting:</strong> Q4 Board Review · Nov 15, 2024<br />
              <strong style={{ color: "#C8CAD8" }}>Requested by:</strong> James Whitfield · Board Chair
            </div>
            <div style={{ fontSize: 11, color: "#4A5178", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10, fontWeight: 500 }}>Draw your signature</div>
            <div className="sd-sig-area" onMouseDown={startDraw} onMouseMove={draw} onMouseUp={() => setDrawing(false)} onMouseLeave={() => setDrawing(false)} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={() => setDrawing(false)}>
              <canvas ref={canvasRef} className="sd-sig-canvas" width={800} height={160} />
              {!hasSig && <><div className="sd-sig-icon">?</div><div className="sd-sig-placeholder">Draw your signature here</div></>}
            </div>
            <div className="sd-sig-actions">
              <button className="sd-btn" onClick={clearSig}>Clear</button>
              <button className="sd-btn" onClick={() => setSelected(null)}>Cancel</button>
              <button className="sd-btn sd-btn-primary" disabled={!hasSig} onClick={sign}>Sign Document</button>
            </div>
          </div>
        )}

        {selectedDoc && (signed[selected] || selectedDoc.status === "signed") && (
          <div className="sd-panel">
            <div className="sd-cert">
              <div className="sd-cert-ic">?</div>
              <div className="sd-cert-title">Document Signed</div>
              <div className="sd-cert-sub"><strong style={{ color: "#C8CAD8" }}>{selectedDoc.title}</strong> has been signed.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
