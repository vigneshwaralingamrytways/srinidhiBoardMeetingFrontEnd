export const AGENDA = [
  {
    id: "a1",
    title: "Opening & Quorum",
    duration: 5,
    type: "Procedural",
    presenter: "Chairperson",
    description: "Call to order and confirmation of quorum.",
  },
  {
    id: "a2",
    title: "Financial Report Q2",
    duration: 20,
    type: "Presentation",
    presenter: "Rajesh Kumar",
    description: "Detailed financial performance review for Q2 2025.",
  },
  {
    id: "a3",
    title: "Strategic Initiatives",
    duration: 30,
    type: "Discussion",
    presenter: "Alexandra Chen",
    description: "Review of ongoing strategic initiatives and H2 roadmap.",
  },
  {
    id: "a4",
    title: "Any Other Business",
    duration: 10,
    type: "Open",
    presenter: "All",
    description: "Open floor for additional business items.",
  },
];

export const SAMPLE_AGENDA_WORK = {
  a1: {
    note: "<b>Meeting called to order</b> at 10:05 AM. Chairperson confirmed quorum with 5 members present (3 physical, 2 electronic). Apologies received from none.",
    resolutions: [
      {
        title: "Confirmation of Quorum",
        description:
          "Resolved that the meeting is duly constituted with a quorum of 5 board members present and proceedings may commence.",
      },
    ],
    decisions: [
      {
        title: "Adopt Previous Minutes",
        description:
          "The minutes of the previous meeting dated 15 March 2025 are adopted as a true and accurate record.",
      },
    ],
    tasks: [
      {
        id: "t-a1-1",
        title: "Circulate confirmed quorum report to all directors",
        assigneeId: "u5",
        dueDate: "2025-06-20",
        status: "Pending",
        linkedType: "agenda",
        linkedIndex: null,
      },
    ],
    resolutionInput: { title: "", description: "" },
    decisionInput:   { title: "", description: "" },
  },

  a2: {
    note: "<b>CFO Rajesh Kumar</b> presented the Q2 2025 financial results. Revenue grew 18% YoY to ?42.6 Cr. EBITDA margin improved to 22.4%. Board raised queries on receivables aging and marketing spend overrun. CFO confirmed receivables situation is under control with collections expected by end of June.",
    resolutions: [
      {
        title: "Approval of Q2 2025 Financial Statements",
        description:
          "Resolved that the unaudited financial statements for the quarter ended 30 June 2025, as presented by the CFO, are hereby approved and adopted.",
      },
      {
        title: "Approval of Interim Dividend",
        description:
          "Resolved to declare an interim dividend of ?2.00 per equity share for Q2 FY2025-26, subject to applicable taxes, payable on or before 30 July 2025.",
      },
    ],
    decisions: [
      {
        title: "Engage External Auditors for Mid-Year Review",
        description:
          "Decided to engage Grant Thornton LLP to conduct a mid-year financial review and report findings to the board by 31 August 2025.",
      },
      {
        title: "Cap Marketing Spend at Approved Budget",
        description:
          "CFO directed to enforce a hard cap on marketing expenditure at the originally approved FY26 budget figure, no further overruns permitted without board sign-off.",
      },
    ],
    tasks: [
      {
        id: "t-a2-1",
        title: "Prepare dividend payment file and notify registrar",
        assigneeId: "u2",
        dueDate: "2025-06-25",
        status: "In Progress",
        linkedType: "resolution",
        linkedIndex: 1,
      },
      {
        id: "t-a2-2",
        title: "Issue engagement letter to Grant Thornton LLP",
        assigneeId: "u2",
        dueDate: "2025-06-22",
        status: "Pending",
        linkedType: "decision",
        linkedIndex: 0,
      },
      {
        id: "t-a2-3",
        title: "Circulate revised marketing budget cap memo to all HODs",
        assigneeId: "u3",
        dueDate: "2025-06-18",
        status: "Done",
        linkedType: "decision",
        linkedIndex: 1,
      },
    ],
    resolutionInput: { title: "", description: "" },
    decisionInput:   { title: "", description: "" },
  },

  a3: {
    note: "<b>CEO Alexandra Chen</b> walked the board through the H2 2025 strategic roadmap. Key themes: market expansion into Tier-2 cities, two major product launches (Q3 & Q4), and a new strategic alliance with GlobalTech Pte Ltd. Board commended progress and requested a detailed go-to-market plan for the Tier-2 expansion.",
    resolutions: [
      {
        title: "Approval of H2 2025 Strategic Plan",
        description:
          "Resolved to formally approve the H2 2025 Strategic Plan as presented, including the market expansion roadmap, product launch schedule, and resource allocation framework.",
      },
      {
        title: "Authorisation of GlobalTech Partnership Agreement",
        description:
          "Resolved to authorise the CEO and CFO to execute the strategic partnership agreement with GlobalTech Pte Ltd on terms approved in principle by the board, subject to legal review.",
      },
    ],
    decisions: [
      {
        title: "Commission Tier-2 Go-to-Market Study",
        description:
          "Decided to commission an independent market study for the Tier-2 city expansion strategy, budget not to exceed ?15 lakhs, to be presented at the Q3 board meeting.",
      },
      {
        title: "Establish Product Launch Steering Committee",
        description:
          "A steering committee comprising the COO, CTO, and Head of Marketing to be constituted to oversee both H2 product launches, meeting fortnightly.",
      },
    ],
    tasks: [
      {
        id: "t-a3-1",
        title: "Finalise GlobalTech MOU and circulate for legal review",
        assigneeId: "u5",
        dueDate: "2025-06-30",
        status: "Pending",
        linkedType: "resolution",
        linkedIndex: 1,
      },
      {
        id: "t-a3-2",
        title: "Shortlist market research agencies for Tier-2 study",
        assigneeId: "u1",
        dueDate: "2025-06-28",
        status: "Pending",
        linkedType: "decision",
        linkedIndex: 0,
      },
      {
        id: "t-a3-3",
        title: "Constitute Product Launch Steering Committee and schedule kickoff",
        assigneeId: "u3",
        dueDate: "2025-06-20",
        status: "In Progress",
        linkedType: "decision",
        linkedIndex: 1,
      },
      {
        id: "t-a3-4",
        title: "Prepare H2 strategic plan board deck for distribution",
        assigneeId: "u1",
        dueDate: "2025-06-16",
        status: "Done",
        linkedType: "agenda",
        linkedIndex: null,
      },
    ],
    resolutionInput: { title: "", description: "" },
    decisionInput:   { title: "", description: "" },
  },

  a4: {
    note: "No additional business items were raised. Board acknowledged the upcoming ESG reporting deadline in August and directed the Legal Director to monitor compliance. Meeting adjourned at 12:45 PM.",
    resolutions: [],
    decisions: [
      {
        title: "Monitor ESG Reporting Compliance",
        description:
          "Legal Director to track the August 2025 ESG reporting deadline and provide a status update at the next board meeting.",
      },
    ],
    tasks: [
      {
        id: "t-a4-1",
        title: "Prepare ESG compliance status report for Q3 board pack",
        assigneeId: "u5",
        dueDate: "2025-07-31",
        status: "Pending",
        linkedType: "decision",
        linkedIndex: 0,
      },
    ],
    resolutionInput: { title: "", description: "" },
    decisionInput:   { title: "", description: "" },
  },
};