import { useState } from "react";
import { DATA } from "./MeetingData";
import "./MinutesOfMeeting.css";

export default function MinutesOfMeeting() {
  const [draft, setDraft] = useState("Minutes of Meeting - Q4 Board Review\n\n1. Attendance and quorum were confirmed.\n2. Agenda items were reviewed as scheduled.\n3. Board resolutions will be circulated to members for voting.\n4. Final approved minutes will be shared as PDF.");

  return (
    <div className="mom-wrap">
      <div className="mom-inner">
        <div className="mom-title">Minutes of Meeting</div>
        <div className="mom-sub">Prepare MOM after the meeting using attendance, agenda notes, resolutions, and voting actions</div>
        <div className="mom-grid">
          <div className="mom-card">
            <div className="mom-card-title">Captured Summary</div>
            {DATA.minutes.map((item, index) => (
              <div key={item.id} className="mom-line">
                <div className="mom-num">{index + 1}</div>
                <div>
                  <div className="mom-line-title">{item.title}</div>
                  <div className="mom-line-detail">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mom-card">
            <div className="mom-card-title">MOM Status</div>
            <div className="mom-side-item">Attendance <span>Done</span></div>
            <div className="mom-side-item">Agenda Notes <span>Draft</span></div>
            <div className="mom-side-item">Resolutions <span>Linked</span></div>
            <div className="mom-side-item">PDF Export <span>Ready</span></div>
          </div>
        </div>

        <div className="mom-card" style={{ marginTop: 22 }}>
          <div className="mom-card-title">MOM Draft</div>
          <textarea className="mom-area" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <div className="mom-actions">
            <button className="mom-btn">Save Draft</button>
            <button className="mom-btn">Download PDF</button>
            <button className="mom-btn primary">Send To Members</button>
          </div>
        </div>
      </div>
    </div>
  );
}
