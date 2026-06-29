export const DATA = {
  meetingTypes: ["Board Meeting", "Strategy Session", "Review Meeting", "Town Hall", "Committee Meeting"],
  agendaTypes: ["Presentation", "Discussion", "Report", "Vote", "Administrative"],
  meetings: [
    {
      id: 1,
      title: "Q4 Board Review",
      type: "Board Meeting",
      company: "Srinidhi Groups",
      date: "Nov 15, 2024",
      time: "09:00 AM",
      location: "Conference Room A + Online",
      status: "active",
      description:
        "Quarterly board review scheduled at 09:00 AM covering financial performance, operating updates, resolutions, and approval decisions.",
    },
    {
      id: 2,
      title: "Risk Committee Update",
      type: "Committee Meeting",
      company: "VAF Systems Pvt Ltd",
      date: "Nov 18, 2024",
      time: "11:30 AM",
      location: "Online",
      status: "scheduled",
      description:
        "Risk committee update scheduled at 11:30 AM for risk register, compliance exposure, and mitigation plans.",
    },
    {
      id: 3,
      title: "Annual Planning Session",
      type: "Strategy Session",
      company: "Sripathi Paper & Boards",
      date: "Dec 03, 2024",
      time: "02:00 PM",
      location: "Board Room",
      status: "scheduled",
      description:
        "Annual planning session scheduled at 02:00 PM for budgets, goals, and governance priorities.",
    },
    {
      id: 4,
      title: "Financial Audit Review",
      type: "Audit Meeting",
      company: "IAC Groups",
      date: "Dec 05, 2024",
      time: "10:00 AM",
      location: "Meeting Hall 2",
      status: "active",
      description:
        "Audit review meeting scheduled to discuss annual compliance reports and financial audit observations.",
    },
    {
      id: 5,
      title: "Investor Relations Meeting",
      type: "Investor Meeting",
      company: "N-Dairy Farm Pvt Ltd",
      date: "Dec 08, 2024",
      time: "04:00 PM",
      location: "Online",
      status: "scheduled",
      description:
        "Investor relations meeting scheduled for performance discussions, funding updates, and shareholder communication.",
    },
    {
      id: 6,
      title: "Operations Review",
      type: "Operations Meeting",
      company: "Srestha Solutions Pvt Ltd",
      date: "Dec 10, 2024",
      time: "01:30 PM",
      location: "Conference Room B",
      status: "completed",
      description:
        "Operations review covering workflow improvements, production metrics, and operational challenges.",
    },
    {
      id: 7,
      title: "Cybersecurity Assessment",
      type: "Security Meeting",
      company: "Srinidhi Groups",
      date: "Dec 12, 2024",
      time: "03:00 PM",
      location: "Security Lab",
      status: "active",
      description:
        "Cybersecurity assessment meeting focused on infrastructure security, data protection, and risk mitigation.",
    },
    {
      id: 8,
      title: "HR Policy Discussion",
      type: "HR Meeting",
      company: "Srestha Solutions Pvt Ltd",
      date: "Dec 15, 2024",
      time: "12:00 PM",
      location: "HR Conference Room",
      status: "scheduled",
      description:
        "HR policy discussion regarding employee benefits, workplace policies, and hiring plans.",
    },
    {
      id: 9,
      title: "Marketing Strategy Review",
      type: "Marketing Meeting",
      company: "IAC Groups",
      date: "Dec 18, 2024",
      time: "05:00 PM",
      location: "Online",
      status: "scheduled",
      description:
        "Marketing strategy review for campaign planning, brand positioning, and customer engagement metrics.",
    },
    {
      id: 10,
      title: "Product Launch Planning",
      type: "Product Meeting",
      company: "N-Dairy Farm Pvt Ltd",
      date: "Dec 20, 2024",
      time: "09:30 AM",
      location: "Innovation Center",
      status: "active",
      description:
        "Product launch planning session discussing launch roadmap, market strategy, and release timelines.",
    },
  ],
  participants: [
    {
      id: 1,
      name: "James Whitfield",
      email: "j.whitfield@corp.com",
      role: "host",
      initials: "JW",
      color: "#D4A853",
      attendance: "offline",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Sarah Chen",
      email: "s.chen@corp.com",
      role: "member",
      initials: "SC",
      color: "#4A9ED4",
      attendance: "online",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Marcus Reid",
      email: "m.reid@corp.com",
      role: "member",
      initials: "MR",
      color: "#7A6FDA",
      attendance: "online",
      image: "https://randomuser.me/api/portraits/men/68.jpg",
    },
    {
      id: 4,
      name: "Elena Vasquez",
      email: "e.vasquez@corp.com",
      role: "member",
      initials: "EV",
      color: "#4DB896",
      attendance: "offline",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: 5,
      name: "Thomas Park",
      email: "t.park@corp.com",
      role: "observer",
      initials: "TP",
      color: "#D4744A",
      attendance: "online",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
    },
  ],
  chairpersonElection: {
    electedPersonId: 2,
    electedAt: "Nov 15, 2024 09:12 AM",
    votes: {
      1: 2,
      2: 1,
      3: 2,
      4: 2,
      5: 3,
    },
  },
  agendaItems: [
    {
      id: 1,
      title: "Opening & Roll Call",
     description: "The meeting is formally called to order by the Chairperson, who welcomes all attending members and observers. The Company Secretary proceeds to conduct the roll call, recording each participant's name, designation, and mode of attendance  physical or electronic. Quorum is verified in accordance with the Articles of Association, confirming the minimum threshold of three voting members has been met. The Chairperson notes any apologies received prior to the meeting and acknowledges any changes to the expected attendance list. The circulated agenda is presented for formal adoption, and members are invited to raise any objections or propose amendments before approval. No material objections having been received, the agenda is moved for acceptance as the order of business for this session. Members are reminded of the confidentiality obligations applicable to all discussions and documents shared during the meeting. The Chairperson declares the meeting duly constituted and invites the Secretary to confirm that all statutory pre-meeting requirements have been satisfied.",
      duration: 5,
      type: "Administrative",
      presenter: "James Whitfield",
      resolutions: [
        { title: "Approve the meeting agenda", description: "<p>The board is requested to formally <strong>approve the circulated meeting agenda</strong> as the order of business for this session.</p><ul><li>Agenda was circulated 5 days prior</li><li>No objections received before the meeting</li></ul>" },
        { title: "Confirm quorum and attendance register", description: "<p>Confirm that a <strong>valid quorum</strong> is present as required under the Articles of Association. The attendance register has been verified.</p><ul><li>Minimum quorum: 3 members</li><li>Present: 5 members (4 voting)</li></ul>" },
        { title: "Approve appointment of meeting chair", description: "<p>Formally resolve to <strong>appoint the elected chairperson</strong> to chair this meeting session as per the outcome of the chairperson election conducted earlier.</p>" },
        { title: "Approve recording of attendance mode", description: "<p>Approve that both <strong>physical and electronic attendance</strong> modes are validly recorded in the minutes as per the applicable governance framework.</p>" },
      ],
      decisions: [
        { title: "Proceed with the circulated order of business", description: "<p>The board <strong>decides to proceed</strong> with all agenda items as circulated without deferral or substitution.</p>" },
        { title: "Record late attendees in the minutes", description: "<p>Any members arriving after the opening roll call shall be <strong>noted as late arrivals</strong> in the official minutes with their joining time.</p>" },
        { title: "Move all unresolved items to closing actions", description: "<p>Items not fully resolved during the session shall be <strong>formally moved to closing actions</strong> with assigned owners and follow-up timelines.</p>" },
      ],
      tasks: [
        { id: "t-1-1", title: "Circulate signed attendance register", description: "<p>Prepare and circulate the signed <strong>attendance register</strong> to all participants and the company secretary within 24 hours of the meeting.</p>", assigneeId: 1, dueDate: "2024-11-16", status: "Pending", linkedType: "agenda", linkedIndex: 0 },
      ],
    },
    {
      id: 2,
      title: "Q3 Financial Review",
      description: "Review revenue, expense variance, cash position, audit observations, and Q4 budget implications.",
      duration: 20,
      type: "Report",
      presenter: "Sarah Chen",
      resolutions: [
        { title: "Approve Q3 Financial Report 2024", description: "<p>The board resolves to <strong>formally approve the Q3 Financial Report 2024</strong> as presented by the CFO, subject to audit committee sign-off.</p><ul><li>Revenue: ?42.3 Cr (target ?40 Cr)</li><li>EBITDA margin: 18.4%</li><li>Cash position: ?9.1 Cr</li></ul>" },
        { title: "Approve Q3 Budget Extension", description: "<p>Approve an <strong>extension of ?3.2 Cr</strong> to the Q3 operational budget to cover unplanned infrastructure and compliance costs.</p><blockquote>Extension is within the 8% variance threshold approved at the start of the fiscal year.</blockquote>" },
        { title: "Authorize finance team to finalize audit responses", description: "<p>The finance team is <strong>authorized to prepare and submit</strong> formal responses to all observations raised in the Q3 audit report without further board approval for individual line items.</p>" },
        { title: "Approve revised cash-flow monitoring cadence", description: "<p>Approve shifting cash-flow reporting from <strong>quarterly to monthly</strong> to enable more proactive treasury management for the remainder of the fiscal year.</p>" },
      ],
      decisions: [
        { title: "Request monthly expense variance report", description: "<p>The CFO will produce a <strong>monthly expense variance report</strong> beginning November 2024, shared with board members by the 5th of each month.</p>" },
        { title: "Circulate audit observations to members", description: "<p>All audit observations and management responses shall be <strong>circulated to all board members</strong> within 7 business days of sign-off.</p>" },
        { title: "Schedule budget review checkpoint in December", description: "<p>A <strong>budget review checkpoint meeting</strong> is to be scheduled for mid-December to assess Q4 spending trajectory against the approved envelope.</p>" },
        { title: "Track high-value vendor payments separately", description: "<p>Vendor payments exceeding <strong>?50 lakhs per transaction</strong> shall be tracked in a separate register and flagged in the monthly finance report.</p>" },
      ],
      tasks: [
        { id: "t-2-1", title: "Prepare monthly variance report template", description: "<p>Design and deliver a <strong>standardized monthly expense variance report template</strong> for CFO sign-off. Include actuals vs budget, YTD delta, and commentary fields.</p>", assigneeId: 2, dueDate: "2024-11-20", status: "Pending", linkedType: "resolution", linkedIndex: 1 },
        { id: "t-2-2", title: "Schedule December budget checkpoint", description: "<p>Coordinate with the board secretary to <strong>block a 2-hour slot in December</strong> for the budget review checkpoint. Share agenda template in advance.</p>", assigneeId: 2, dueDate: "2024-11-18", status: "In Progress", linkedType: "decision", linkedIndex: 2 },
      ],
    },
    {
      id: 3,
      title: "Product Roadmap 2025",
      description: "Discuss platform priorities, launch dependencies, delivery timeline risks, and resource allocation.",
      duration: 30,
      type: "Presentation",
      presenter: "Marcus Reid",
      resolutions: [
        { title: "Adopt 2025 Product Roadmap", description: "<p>The board resolves to <strong>formally adopt the 2025 Product Roadmap</strong> as presented, covering Q1Q4 delivery milestones across all product verticals.</p><ul><li>4 major platform releases planned</li><li>2 new modules: AI Analytics and Client Portal v2</li><li>Mobile-first redesign in Q3</li></ul>" },
        { title: "Approve roadmap funding envelope", description: "<p>Approve a total <strong>funding envelope of ?18.5 Cr</strong> for product development in FY2025, inclusive of engineering headcount, infrastructure, and tooling.</p>" },
        { title: "Authorize hiring plan for roadmap delivery", description: "<p>Authorize the recruitment of <strong>12 additional engineers and 3 product managers</strong> as outlined in the roadmap staffing plan, subject to HR confirmation of role grades.</p>" },
      ],
      decisions: [
        { title: "Prioritize platform stability before expansion", description: "<p><strong>Platform stability and technical debt reduction</strong> must be completed in Q1 before any new module development commences in Q2.</p>" },
        { title: "Review roadmap delivery risk every month", description: "<p>A <strong>monthly roadmap risk review</strong> will be conducted by the CTO and shared with the board as a standing agenda item from January 2025.</p>" },
        { title: "Prepare dependency report for next board meeting", description: "<p>The product team shall produce a <strong>full dependency map</strong> identifying cross-team and vendor dependencies impacting the Q1Q2 delivery plan.</p>" },
      ],
      tasks: [
        { id: "t-3-1", title: "Publish 2025 roadmap to engineering teams", description: "<p>Share the <strong>board-approved 2025 product roadmap</strong> with all engineering leads and product managers. Include approved funding envelope and headcount plan.</p>", assigneeId: 3, dueDate: "2024-11-22", status: "Pending", linkedType: "resolution", linkedIndex: 0 },
      ],
    },
    {
      id: 4,
      title: "Vendor Contract Decision",
      description: "Evaluate shortlisted vendor terms, commercial risk, legal review status, and implementation readiness.",
      duration: 15,
      type: "Vote",
      presenter: "Elena Vasquez",
      resolutions: [
        { title: "Authorize Vendor Contract", description: "<p>The board resolves to <strong>authorize the execution of the vendor contract</strong> with the selected vendor, subject to satisfactory completion of legal review and data processing agreement sign-off.</p><ul><li>Contract value: ?4.8 Cr over 3 years</li><li>SLA: 99.9% uptime with penalty clauses</li></ul>" },
        { title: "Approve vendor onboarding budget", description: "<p>Approve a <strong>one-time onboarding and integration budget of ?35 lakhs</strong> to cover data migration, API integration, and staff training by the implementation team.</p>" },
        { title: "Approve data processing addendum", description: "<p>Approve the <strong>Data Processing Addendum (DPA)</strong> subject to final review by the legal team to ensure DPDPA 2023 compliance before contract execution.</p>" },
      ],
      decisions: [
        { title: "Proceed subject to final legal review", description: "<p>Contract execution shall <strong>proceed only after legal counsel confirms</strong> all contractual terms are compliant and acceptable. Legal sign-off deadline: 5 business days.</p>" },
        { title: "Request implementation timeline from vendor", description: "<p>The vendor is required to submit a <strong>detailed implementation plan within 10 days</strong> of contract signature, including milestones, resources, and escalation contacts.</p>" },
        { title: "Nominate Elena Vasquez as vendor transition owner", description: "<p><strong>Elena Vasquez is nominated</strong> as the internal transition owner responsible for overseeing vendor onboarding, SLA compliance, and escalation management.</p>" },
      ],
      tasks: [
        { id: "t-4-1", title: "Complete legal review of vendor DPA", description: "<p>Engage legal counsel to <strong>review and approve the Data Processing Addendum</strong> for DPDPA compliance. Flag any terms requiring renegotiation before board sign-off.</p>", assigneeId: 4, dueDate: "2024-11-22", status: "In Progress", linkedType: "resolution", linkedIndex: 2 },
        { id: "t-4-2", title: "Request vendor implementation plan", description: "<p>Send formal request to the vendor for a <strong>comprehensive implementation timeline</strong>, including onboarding phases, milestones, training schedule, and key contacts.</p>", assigneeId: 4, dueDate: "2024-11-25", status: "Pending", linkedType: "decision", linkedIndex: 1 },
      ],
    },
    {
      id: 5,
      title: "Board Resolution Drafting",
      description: "Convert approved agenda decisions into formal board resolutions for voting and signature.",
      duration: 15,
      type: "Administrative",
      presenter: "James Whitfield",
      resolutions: [
        { title: "Approve final board resolution pack", description: "<p>Approve the <strong>complete board resolution pack</strong> consolidating all resolutions passed during this meeting for filing, signing, and archival.</p>" },
        { title: "Approve resolution numbering sequence", description: "<p>Adopt the <strong>resolution numbering format BR-2024-XX</strong> for all resolutions passed at this meeting, aligned with the annual board resolution register.</p>" },
        { title: "Approve chairperson certification language", description: "<p>Approve the <strong>standard certification language</strong> to be signed by the chairperson on all resolutions confirming they were validly passed at a duly convened meeting.</p>" },
      ],
      decisions: [
        { title: "Generate resolution PDFs for signature", description: "<p>The company secretary shall <strong>generate individual resolution PDFs</strong> with member signature blocks within 2 business days of the meeting.</p>" },
        { title: "Send approved resolutions for digital signing", description: "<p>All approved resolutions shall be <strong>circulated via the approved e-signing platform</strong> for digital signature by all eligible board members within 5 business days.</p>" },
        { title: "Archive signed resolutions in board repository", description: "<p>Once fully signed, all resolutions shall be <strong>archived in the board document repository</strong> with version control and access restricted to authorized members.</p>" },
      ],
      tasks: [
        { id: "t-5-1", title: "Draft and circulate resolution PDFs", description: "<p>Prepare individual <strong>resolution PDF documents</strong> for all passed resolutions using the approved template. Include resolution number, date, certification language, and signature blocks.</p>", assigneeId: 1, dueDate: "2024-11-17", status: "Pending", linkedType: "decision", linkedIndex: 0 },
      ],
    },
    {
      id: 6,
      title: "Risk Register Update",
      description: "Review top open risks, new mitigations, ownership changes, and escalation items.",
      duration: 20,
      type: "Discussion",
      presenter: "Thomas Park",
      resolutions: [
        { title: "Accept updated risk register", description: "<p>The board resolves to <strong>accept the updated risk register</strong> for Q4 2024, acknowledging all changes to risk ratings, mitigation status, and ownership assignments.</p><ul><li>3 risks upgraded to High</li><li>2 risks closed</li><li>1 new risk added: Vendor dependency</li></ul>" },
      ],
      decisions: [
        { title: "Escalate high-priority vendor risk to committee", description: "<p>The newly identified <strong>vendor dependency risk</strong> shall be formally escalated to the Risk Committee for detailed assessment and mitigation planning by end of November.</p>" },
      ],
      tasks: [
        { id: "t-6-1", title: "Escalate vendor risk to Risk Committee", description: "<p>Prepare a <strong>formal risk escalation memo</strong> for the Risk Committee covering the vendor dependency risk, including likelihood score, potential impact, and proposed mitigations.</p>", assigneeId: 5, dueDate: "2024-11-28", status: "Pending", linkedType: "decision", linkedIndex: 0 },
      ],
    },
    {
      id: 7,
      title: "Compliance Calendar",
      description: "Validate upcoming statutory filings, license renewals, policy review dates, and accountable owners.",
      duration: 10,
      type: "Report",
      presenter: "Sarah Chen",
      resolutions: [
        { title: "Approve compliance calendar updates", description: "<p>Formally approve the <strong>updated compliance calendar for Q4 2024 and H1 2025</strong>, including all statutory filing deadlines, license renewal dates, and policy review windows.</p>" },
      ],
      decisions: [
        { title: "Assign owners for upcoming statutory filings", description: "<p>Named owners must be assigned for each <strong>statutory filing due within the next 90 days</strong>, with accountability tracked in the compliance calendar and reported monthly.</p>" },
      ],
      tasks: [
        { id: "t-7-1", title: "Assign owners to Q4 compliance deadlines", description: "<p>Update the compliance calendar to assign a <strong>named owner and backup</strong> for every statutory filing or renewal due between December 2024 and March 2025.</p>", assigneeId: 2, dueDate: "2024-11-22", status: "Pending", linkedType: "decision", linkedIndex: 0 },
      ],
    },
    {
      id: 8,
      title: "Closing Actions",
      description: "Confirm action owners, voting timeline, document signing sequence, and minutes circulation plan.",
      duration: 10,
      type: "Administrative",
      presenter: "James Whitfield",
      resolutions: [
        { title: "Approve final action register", description: "<p>The board resolves to <strong>approve the consolidated action register</strong> for this meeting, listing all decisions, owners, due dates, and follow-up items arising from today's session.</p>" },
      ],
      decisions: [
        { title: "Circulate minutes within three business days", description: "<p>The company secretary shall <strong>circulate draft minutes</strong> to all board members within <strong>3 business days</strong> of the meeting for review and confirmation before final sign-off.</p>" },
      ],
      tasks: [
        { id: "t-8-1", title: "Draft and circulate meeting minutes", description: "<p>Prepare the <strong>draft minutes of the Q4 Board Review meeting</strong> covering all agenda items, resolutions passed, decisions recorded, and action items. Circulate within 3 business days.</p>", assigneeId: 1, dueDate: "2024-11-18", status: "Pending", linkedType: "decision", linkedIndex: 0 },
      ],
    },
  ],
  agendaAcknowledgements: {
    1: { 1: true, 2: true, 3: true, 4: true, 5: true },
    2: { 1: true, 2: true, 3: true, 4: false, 5: true },
    3: { 1: true, 2: true, 3: false, 4: true, 5: true },
    4: { 1: true, 2: false, 3: true, 4: true, 5: false },
    5: { 1: true, 2: true, 3: true, 4: true, 5: true },
    6: { 1: true, 2: true, 3: true, 4: false, 5: true },
    7: { 1: true, 2: true, 3: false, 4: true, 5: true },
    8: { 1: true, 2: true, 3: true, 4: true, 5: false },
  },
  previousMoms: [
    {
      id: 101,
      title: "Q3 Board Review MOM",
      description:
        "<p>Members reviewed Q3 financial performance, approved the budget extension for voting, and asked the finance team to circulate monthly expense variance reports.</p>",
      createdAt: "Oct 20, 2024 06:15 PM",
      acknowledgements: { 1: true, 2: true, 3: true, 4: true, 5: false },
    },
    {
      id: 102,
      title: "Vendor Contract Review MOM",
      description:
        "<p>The board discussed shortlisted vendor terms and requested final legal review before the contract is circulated for signature.</p>",
      createdAt: "Oct 28, 2024 04:40 PM",
      acknowledgements: { 1: true, 2: false, 3: true, 4: true, 5: true },
    },
  ],

  // ----------------------------------------------------------------
  // Board Pack files.
  // `agendaId` links a file to a specific agenda item (matches
  // agendaItems[].id). Files without `agendaId` are treated as
  // "common" board pack files shared across the whole meeting.
  // `url` is used by the Board Pack "View" action.
  // ----------------------------------------------------------------
  boardPack: [
    {
      id: 1,
      title: "Q3 Financial Report 2024",
      type: "PDF",
      pages: 24,
      size: "2.4 MB",
      agendaId: 2,
      url: "https://example.com/board-pack/q3-financial-report-2024.pdf",
    },
    {
      id: 2,
      title: "Product Roadmap Appendix",
      type: "PDF",
      pages: 18,
      size: "1.8 MB",
      agendaId: 3,
      url: "https://example.com/board-pack/product-roadmap-appendix.pdf",
    },
    {
      id: 3,
      title: "Vendor Comparison Matrix",
      type: "XLS",
      pages: 8,
      size: "0.9 MB",
      agendaId: 4,
      url: "https://example.com/board-pack/vendor-comparison-matrix.xls",
    },
    {
      id: 4,
      title: "Risk Register - Q4 2024",
      type: "XLS",
      pages: 6,
      size: "0.7 MB",
      agendaId: 6,
      url: "https://example.com/board-pack/risk-register-q4-2024.xls",
    },
    // {
    //   id: 5,
    //   title: "Compliance Calendar - Q4 2024 & H1 2025",
    //   type: "PDF",
    //   pages: 5,
    //   size: "0.5 MB",
    //   agendaId: 7,
    //   url: "https://example.com/board-pack/compliance-calendar.pdf",
    // },
    // {
    //   id: 6,
    //   title: "Board Meeting Agenda Pack",
    //   type: "PDF",
    //   pages: 10,
    //   size: "1.1 MB",
    //   agendaId: null,
    //   url: "https://example.com/board-pack/board-meeting-agenda-pack.pdf",
    // },
    // {
    //   id: 7,
    //   title: "Previous Meeting Minutes (Q3)",
    //   type: "PDF",
    //   pages: 6,
    //   size: "0.6 MB",
    //   agendaId: null,
    //   url: "https://example.com/board-pack/previous-meeting-minutes-q3.pdf",
    // },
  ],

  // ----------------------------------------------------------------
  // Resolutions.
  // `agendaId` links a resolution to a specific agenda item (matches
  // agendaItems[].id). Resolutions without `agendaId` are "common"
  // resolutions not tied to a particular agenda item.
  // ----------------------------------------------------------------
  resolutions: [
    {
      id: 1,
      title: "Approve Q3 Budget Extension",
      description:
        "Approval requested for extending the Q3 operational budget.",
      agendaId: 2,
    },
    {
      id: 2,
      title: "Authorize Vendor Contract",
      description:
        "Board approval required to proceed with vendor agreement.",
      agendaId: 4,
    },
    {
      id: 3,
      title: "Adopt 2025 Product Roadmap",
      description:
        "Resolution to approve the proposed 2025 product roadmap.",
      agendaId: 3,
    },
    {
      id: 4,
      title: "Accept Updated Risk Register",
      description:
        "Resolution to accept the updated Q4 2024 risk register and mitigation plans.",
      agendaId: 6,
    },
    {
      id: 5,
      title: "Approve Compliance Calendar Updates",
      description:
        "Resolution to approve the updated compliance calendar for Q4 2024 and H1 2025.",
      agendaId: 7,
    },
    {
      id: 6,
      title: "Approve Meeting Agenda",
      description:
        "General resolution to approve the order of business circulated for this meeting.",
      agendaId: null,
    },
    {
      id: 7,
      title: "Approve Previous Meeting Minutes",
      description:
        "General resolution to approve and adopt the minutes of the previous board meeting.",
      agendaId: null,
    },
  ],

  documents: [
    { id: 1, title: "Q3 Financial Report 2024", pages: 24, status: "pending", size: "2.4 MB", type: "PDF" },
    { id: 2, title: "Strategic Partnership Agreement", pages: 12, status: "signed", size: "1.1 MB", type: "DOC" },
    { id: 3, title: "Board Resolution #2024-08", pages: 4, status: "pending", size: "0.3 MB", type: "PDF" },
    { id: 4, title: "Annual Budget Approval", pages: 8, status: "reviewing", size: "0.9 MB", type: "XLS" },
  ],
  votes: [
    { id: 1, title: "Approve Q3 Budget Extension", status: "active", options: ["Approve", "Reject", "Abstain"], results: { Approve: 8, Reject: 2, Abstain: 1 }, deadline: "2 min", userVoted: false, userChoice: null },
    { id: 2, title: "Authorize New Vendor Contract", status: "closed", options: ["Yes", "No", "Need More Info"], results: { Yes: 10, No: 1, "Need More Info": 0 }, deadline: "Closed", userVoted: true, userChoice: "Yes" },
    { id: 3, title: "Office Expansion Initiative", status: "pending", options: ["Proceed", "Defer", "Reject"], results: { Proceed: 0, Defer: 0, Reject: 0 }, deadline: "Starts after Item 4", userVoted: false, userChoice: null },
  ],
  minutes: [
    { id: 1, title: "Attendance confirmed", detail: "Quorum was established with online and offline attendees recorded." },
    { id: 2, title: "Financial review completed", detail: "Q3 performance and budget extension were tabled for resolution voting." },
    { id: 3, title: "Vendor contract discussed", detail: "Members requested final legal review before circulation." },
  ],
};

// -------------------------------------------------------------
// meetingRoom.js    All static/seed data for the app
// -------------------------------------------------------------

export const ROOMS = [
  {
    id: "r1",
    name: "Conference Room A",
    capacity: 12,
    floor: "3rd Floor",
    amenities: ["Projector", "Whiteboard", "Video Call"],
    color: "#C9A84C",
  },
  {
    id: "r2",
    name: "Board Suite",
    capacity: 20,
    floor: "5th Floor",
    amenities: ["4K Screen", "Recording", "Catering"],
    color: "#7C6FC7",
  },
  {
    id: "r3",
    name: "Executive Lounge",
    capacity: 8,
    floor: "6th Floor",
    amenities: ["Smart TV", "Whiteboard", "Private"],
    color: "#4CA8C9",
  },
  {
    id: "r4",
    name: "Innovation Lab",
    capacity: 6,
    floor: "2nd Floor",
    amenities: ["Screens", "Standing Desks", "Brainstorm"],
    color: "#C94C6A",
  },
];

export const MEETING_TYPES = [
  "Board Meeting",
  "Strategy Review",
  "Q-Review",
  "General Meeting",
  "Workshop",
  "Training",
];

export const TIME_SLOTS = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
];

export const DURATIONS = [
  "30 min", "1 hour", "1.5 hours", "2 hours",
  "3 hours", "Half day", "Full day",
];

export const INITIAL_BOOKINGS = [
  {
    id: "b1", title: "Q4 Board Review", room: "r1",
    date: "2026-06-10", time: "09:00 AM", duration: "2 hours",
    type: "Board Meeting", organizer: "James Whitfield",
    attendees: 8, color: "#C9A84C",
  },
  {
    id: "b2", title: "Strategy Planning", room: "r2",
    date: "2026-06-10", time: "02:00 PM", duration: "3 hours",
    type: "Strategy Review", organizer: "Sarah Chen",
    attendees: 15, color: "#7C6FC7",
  },
  {
    id: "b3", title: "Q2 Executive Review", room: "r3",
    date: "2026-06-12", time: "10:00 AM", duration: "1.5 hours",
    type: "Q-Review", organizer: "Marcus Webb",
    attendees: 6, color: "#4CA8C9",
  },
  {
    id: "b4", title: "Product Workshop", room: "r4",
    date: "2026-06-15", time: "09:30 AM", duration: "Half day",
    type: "Workshop", organizer: "Priya Nair",
    attendees: 5, color: "#C94C6A",
  },
  {
    id: "b5", title: "Leadership Sync", room: "r1",
    date: "2026-06-18", time: "11:00 AM", duration: "1 hour",
    type: "General Meeting", organizer: "James Whitfield",
    attendees: 4, color: "#C9A84C",
  },
  {
    id: "b6", title: "Board Annual Review", room: "r2",
    date: "2026-06-20", time: "09:00 AM", duration: "Full day",
    type: "Board Meeting", organizer: "Sarah Chen",
    attendees: 18, color: "#7C6FC7",
  },
];

// export const NAV_ITEMS = [
//   { icon: "??", label: "Manage Companies" },
//   { icon: "??", label: "Manage Board Members" },
//   { icon: "+",  label: "Setup Board Meeting", active: true },
//   { icon: "??", label: "Manage Board Meeting", badge: "Live" },
//   { icon: "??", label: "Manage Notification" },
//   { icon: "?", label: "Manage Actions" },
//   { icon: "??", label: "Manage Resolutions" },
//   { icon: "??", label: "View Board Meeting" },
// ];

export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export const CURRENT_USER = {
  initials: "JW",
  name: "James Whitfield",
  role: "Meeting Chair",
};
