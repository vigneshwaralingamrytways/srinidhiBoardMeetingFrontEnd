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