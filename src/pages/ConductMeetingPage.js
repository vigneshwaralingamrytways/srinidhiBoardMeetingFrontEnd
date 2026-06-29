import Sidebar from "../components/layout/Sidebar";
import PageWrapper from "../components/layout/PageWrapper";

import AttendanceSection from "../components/meeting/AttendanceSection";
import ResolutionSection from "../components/meeting/ResolutionSection";
import DecisionSection from "../components/meeting/DecisionSection";
import MOMSection from "../components/meeting/MOMSection";

export default function ConductMeetingPage() {
  return (
    <>
      <Sidebar />

      <PageWrapper>
        <AttendanceSection />

        <div style={{ height: 24 }} />

        <ResolutionSection />

        <div style={{ height: 24 }} />

        <DecisionSection />

        <div style={{ height: 24 }} />

        <MOMSection />
      </PageWrapper>
    </>
  );
}