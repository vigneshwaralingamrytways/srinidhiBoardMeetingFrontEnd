import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import PageWrapper from "../components/layout/PageWrapper";

import MeetingDetails from "../components/meeting/MeetingDetails";
import AgendaSection from "../components/meeting/AgendaSection";
import ParticipantsSection from "../components/meeting/ParticipantsSection";
import BoardPackSection from "../components/meeting/BoardPackSection";
import InviteSection from "../components/meeting/InviteSection";

export default function CreateMeetingPage() {
  const [step, setStep] = useState(1);

  return (
    <>
      <Sidebar />

      <PageWrapper>
        <div className="meeting-header">
          <h1>Create Meeting</h1>
          <p>
            Set up structured board meetings with agenda, board pack,
            participants, voting and MOM.
          </p>
        </div>

        <div className="stepper">
          {["Details", "Agenda", "Participants", "Board Pack", "Invite"].map(
            (label, index) => (
              <div
                key={label}
                className={`step-item ${step === index + 1 ? "active" : ""}`}
              >
                <span>{index + 1}</span>
                <p>{label}</p>
              </div>
            )
          )}
        </div>

        {step === 1 && <MeetingDetails onNext={() => setStep(2)} />}
        {step === 2 && <AgendaSection onNext={() => setStep(3)} />}
        {step === 3 && <ParticipantsSection onNext={() => setStep(4)} />}
        {step === 4 && <BoardPackSection onNext={() => setStep(5)} />}
        {step === 5 && <InviteSection />}
      </PageWrapper>
    </>
  );
}