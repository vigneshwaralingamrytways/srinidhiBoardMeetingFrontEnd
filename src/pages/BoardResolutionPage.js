import "./ResolutionSection.css";

export default function ResolutionSection() {
  return (
    <div className="meeting-card">
      <div className="section-header">
        <h2>Board Resolution</h2>
        <p>Create board resolutions and send for approval.</p>
      </div>

      <div className="field">
        <label>Resolution Title</label>
        <input placeholder="Approve Vendor Partnership" />
      </div>

      <div className="field">
        <label>Resolution Description</label>
        <textarea rows="5" />
      </div>

      <div className="field">
        <label>Attach PDF</label>
        <input type="file" />
      </div>
    </div>
  );
}