
export const AGENDA_ITEMS = [
  {
    id: 1,
    title: "Opening & Roll Call",
    description: "The meeting is formally called to order by the Chairperson, who welcomes all attending members and observers. The Company Secretary proceeds to conduct the roll call, recording each participant's name, designation, and mode of attendance  physical or electronic. Quorum is verified in accordance with the Articles of Association, confirming the minimum threshold of three voting members has been met. The Chairperson notes any apologies received prior to the meeting and acknowledges any changes to the expected attendance list. The circulated agenda is presented for formal adoption, and members are invited to raise any objections or propose amendments before approval. No material objections having been received, the agenda is moved for acceptance as the order of business for this session. Members are reminded of the confidentiality obligations applicable to all discussions and documents shared during the meeting. The Chairperson declares the meeting duly constituted and invites the Secretary to confirm that all statutory pre-meeting requirements have been satisfied.",
    duration: 5,
    type: "Administrative",
    presenter: "James Whitfield",
    documents: [
      { id: "d1", title: "Attendance Register Template", type: "PDF", size: "0.2 MB", url: "https://example.com/board-pack/attendance-register.pdf" },
    ],
  },
  {
    id: 2,
    title: "Q3 Financial Review",
    description: "The CFO presents the consolidated financial performance for the third quarter ended 30 September 2024, covering revenue, expenditure, margin, and cash flow across all business units. Total revenue for the quarter stood at ?42.3 Cr against a board-approved target of ?40 Cr, representing an outperformance of 5.75% driven primarily by enterprise account expansion. EBITDA margin was maintained at 18.4%, consistent with the prior quarter, despite elevated infrastructure and compliance costs that pushed operational expenditure beyond the approved envelope by ?3.2 Cr. The audit committee has reviewed the statutory audit observations and confirmed that remediation plans are in place for all three flagged items, with completion expected by 30 November 2024. Cash reserves stand at ?9.1 Cr, providing an estimated runway of approximately 4.2 months at the current burn rate. The CFO draws the board's attention to the budget extension request of ?3.2 Cr, which falls within the 8% variance threshold pre-approved by the board at the start of the fiscal year. Members are invited to examine the regional breakdown and product-line performance tables appended to the report before deliberating on the extension. The board is requested to formally approve the Q3 Financial Report and, separately, to pass a resolution authorising the budget extension for operational continuity.",
    duration: 20,
    type: "Report",
    presenter: "Sarah Chen",
    documents: [
      { id: "d2", title: "Q3 Financial Report 2024", type: "PDF", size: "2.4 MB", url: "https://example.com/board-pack/q3-financial-report-2024.pdf" },
    ],
  },
  {
    id: 3,
    title: "Product Roadmap 2025",
    description: "The Chief Product Officer presents the board-level view of the 2025 product strategy, encompassing four major release cycles spanning Q1 through Q4 across all active product verticals. The Q1 cycle is focused on platform stability, resolution of critical technical debt accumulated in FY24, and completion of the accessibility audit mandated by enterprise clients. Q2 will see the launch of the AI Analytics module, the company's first machine-learning-native feature set, which has undergone beta testing with three anchor clients since September. The mobile-first platform redesign is scheduled for a Q3 go-live, following user research conducted across six market segments that identified mobile engagement as the primary conversion lever. Q4 is reserved for the Client Portal v2 release, which consolidates client-facing reporting, document sharing, and e-signature workflows into a single unified experience. The total approved funding envelope stands at ?18.5 Cr, covering engineering headcount of ?11 Cr, infrastructure of ?4.5 Cr, and tooling and licensing costs of ?3 Cr. Delivery of the roadmap is contingent on onboarding 12 additional engineers and 3 product managers by the end of Q1, and the board is requested to ratify the associated hiring plan. Key dependencies and timeline risks have been surfaced in the appendix, and the CPO recommends the board formally adopt the roadmap to unblock downstream procurement and hiring approvals.",
    duration: 30,
    type: "Presentation",
    presenter: "Marcus Reid",
    documents: [
      { id: "d3", title: "Product Roadmap Appendix", type: "PDF", size: "1.8 MB", url: "https://example.com/board-pack/product-roadmap-appendix.pdf" },
    ],
  },
  {
    id: 4,
    title: "Vendor Contract Decision",
    description: "The procurement lead presents the outcome of the structured vendor evaluation exercise conducted over the preceding six weeks, during which three shortlisted vendors were assessed across fourteen criteria including pricing, SLA commitments, implementation timelines, support model, and DPDPA compliance readiness. The recommended vendor has demonstrated the strongest overall score, offering a contract value of ?4.8 Cr over 36 months with a 99.9% uptime SLA backed by financial penalty clauses for breach, and a committed implementation timeline of 90 days from contract execution. Legal counsel has completed an initial review of the contract and identified two clauses in the Data Processing Addendum requiring renegotiation before the board can authorise execution  specifically around sub-processor disclosure and cross-border data transfer restrictions. The commercial risk assessment concludes that the vendor is financially stable, holds relevant certifications, and has successfully delivered comparable implementations for two reference clients in the same sector. The Risk Committee has reviewed the vendor dependency risk and recommended a contractual exit clause with a 90-day notice period and data portability guarantee as a mitigating condition. Implementation readiness on the company's side has been confirmed by the CTO, subject to availability of two senior integration engineers who are currently allocated to the Q1 roadmap sprint. The board is requested to deliberate on the vendor selection, note the outstanding legal conditions, and pass a resolution authorising the contract execution subject to satisfactory completion of the DPA renegotiation. A target signing date of 29 November 2024 has been proposed to meet the Q1 implementation window.",
    duration: 15,
    type: "Vote",
    presenter: "Elena Vasquez",
    documents: [
      { id: "d4", title: "Vendor Comparison Matrix", type: "XLS", size: "0.9 MB", url: "https://example.com/board-pack/vendor-comparison-matrix.xls" },
    ],
  },
  {
    id: 5,
    title: "Risk Register Update",
    description: "The Risk Officer presents the updated risk register for Q4 2024, which currently contains 18 active risks across the categories of operational, financial, technology, regulatory, and strategic risk. Since the Q3 review, three risks have been upgraded to High severity: vendor single-source dependency, legacy API data breach exposure, and delayed DPDPA compliance certification, each of which has a dedicated mitigation plan and a named risk owner. Two risks have been formally closed following satisfactory completion of remediation actions  the payroll system migration risk and the office lease renewal uncertainty, both of which were first logged in Q2. One new risk has been added to the register: over-dependence on a single cloud infrastructure provider, which has been assessed as Medium severity with a likelihood score of 3 and an impact score of 4 on the standard 5-point matrix. The data breach exposure risk relating to legacy API endpoints has been escalated to the Risk Committee and a patching schedule has been approved, with full remediation expected by 15 December 2024. Ownership changes have been recorded for two risks where the accountable executive has changed following an internal restructure, and all affected risk owners have been notified and have confirmed acceptance. The board is requested to review the escalation items, note the ownership changes, accept the updated register as the authoritative Q4 risk position, and confirm whether any additional risks identified during this meeting should be logged before the register is circulated post-session.",
    duration: 20,
    type: "Discussion",
    presenter: "Thomas Park",
    documents: [
      { id: "d5", title: "Risk Register - Q4 2024", type: "XLS", size: "0.7 MB", url: "https://example.com/board-pack/risk-register-q4-2024.xls" },
    ],
  },
  {
    id: 6,
    title: "Closing Actions",
    description: "The Chairperson invites the Company Secretary to read back all action items recorded during the meeting, confirming the responsible owner, agreed completion date, and any dependencies or conditions associated with each action before the list is finalised. Members are reminded that a voting timeline has been proposed for any resolutions that require out-of-session confirmation, and the Secretary will circulate the e-signing links within 24 hours of the meeting via the approved digital signature platform. The document signing sequence has been agreed as follows: resolutions first, followed by the attendance register, and finally the draft minutes once reviewed and approved by the Chairperson. The minutes circulation plan provides for a draft to be shared with all members within three business days, with a five-business-day window for members to submit corrections or clarifications before the minutes are finalised. Any matters arising from today's session that were not resolved during the meeting will be captured as open agenda items and carried forward to the next scheduled board meeting. The date and format of the next board meeting is proposed for confirmation, and the Secretary is directed to issue formal notice in accordance with the notice period stipulated in the Articles. The Chairperson thanks all members and invitees for their participation and the quality of discussion, and formally declares the meeting closed. No further business having been raised, the session is concluded and the Secretary will issue a post-meeting summary to all attendees within one business day.",
    duration: 10,
    type: "Administrative",
    presenter: "James Whitfield",
    documents: [],
  },
];
/* -------------------------------------------------------------------
   RESOLUTIONS  agendaId: null means "common" / general resolution
------------------------------------------------------------------- */
export const RESOLUTIONS = [
  {
    id: 1,
    title: "Approve the Meeting Agenda",
    agendaId: 1,
    categoryType: "MCA",
    description:
      "<p>The board is requested to formally <strong>approve the circulated meeting agenda</strong> as the order of business for this session.</p><ul><li>Agenda was circulated 5 days prior to the meeting</li><li>No objections were received before the meeting</li><li>All supporting documents were shared in advance</li></ul>",
  },
  {
    id: 2,
    title: "Confirm Quorum and Attendance",
    agendaId: 1,
    categoryType: "MCA",
    description:
      "<p>Confirm that a <strong>valid quorum is present</strong> as required under the Articles of Association. The attendance register has been verified.</p><ul><li>Minimum quorum required: 3 members</li><li>Present: 5 members (4 voting, 1 observer)</li></ul>",
  },
  {
    id: 3,
    title: "Approve Q3 Financial Report 2024",
    agendaId: 2,
    categoryType: "MCA",
    description:
      "<p>The board resolves to <strong>formally approve the Q3 Financial Report 2024</strong> as presented by the CFO, subject to audit committee sign-off.</p><ul><li>Revenue: \u20b942.3 Cr vs target \u20b940 Cr</li><li>EBITDA margin: 18.4%</li><li>Cash position: \u20b99.1 Cr</li></ul><blockquote>Finance team has confirmed all figures are audited and reconciled as of 30 September 2024.</blockquote>",
  },
  {
    id: 4,
    title: "Approve Q3 Budget Extension",
    agendaId: 2,
    categoryType: "Not MCA",
    description:
      "<p>Approve an <strong>extension of \u20b93.2 Cr</strong> to the Q3 operational budget to cover unplanned infrastructure and compliance costs.</p><blockquote>Extension is within the 8% variance threshold approved at the start of the fiscal year.</blockquote><ul><li>Infrastructure: \u20b91.8 Cr</li><li>Compliance: \u20b91.4 Cr</li></ul>",
  },
  {
    id: 5,
    title: "Adopt 2025 Product Roadmap",
    agendaId: 3,
    categoryType: "MCA",
    description:
      "<p>The board resolves to <strong>formally adopt the 2025 Product Roadmap</strong> covering Q1\u2013Q4 delivery milestones across all product verticals.</p><ul><li>4 major platform releases planned</li><li>2 new modules: AI Analytics and Client Portal v2</li><li>Mobile-first redesign scheduled for Q3</li></ul>",
  },
  {
    id: 6,
    title: "Authorize Vendor Contract",
    agendaId: 4,
    categoryType: "MCA",
    description:
      "<p>The board resolves to <strong>authorize the execution of the vendor contract</strong> with the selected vendor, subject to satisfactory completion of legal review.</p><ul><li>Contract value: \u20b94.8 Cr over 3 years</li><li>SLA: 99.9% uptime with penalty clauses</li></ul>",
  },
  {
    id: 7,
    title: "Accept Updated Risk Register",
    agendaId: 5,
    categoryType: "Not MCA",
    description:
      "<p>The board resolves to <strong>accept the updated risk register for Q4 2024</strong>, acknowledging all changes to risk ratings, mitigation status, and ownership assignments.</p><ul><li>3 risks upgraded to High severity</li><li>2 risks formally closed</li><li>1 new risk added: Vendor dependency</li></ul>",
  },
  {
    id: 8,
    title: "Approve Meeting Agenda (General)",
    agendaId: null,
    categoryType: "MCA",
    description:
      "<p>General resolution to <strong>approve and adopt the full order of business</strong> circulated for this meeting as the formal agenda.</p>",
  },
  {
    id: 9,
    title: "Approve Previous Meeting Minutes",
    agendaId: null,
    categoryType: "MCA",
    description:
      "<p>General resolution to <strong>approve and adopt the minutes</strong> of the previous board meeting (Q3 Board Review, Oct 20 2024) as a true and accurate record.</p>",
  },
  {
    id: 10,
    title: "Authorize Digital Signing of Resolutions",
    agendaId: null,
    categoryType: "Not MCA",
    description:
      "<p>Authorize the use of the <strong>approved e-signing platform</strong> for digital signature of all board resolutions, confirming such signatures are legally valid and binding under applicable law.</p>",
  },
];

/* -------------------------------------------------------------------
   BOARD PACK  agendaId: null means "common" document, shared docs
   with multi-slide projector content for the zoom viewer.
------------------------------------------------------------------- */
export const BOARD_PACK = [
  {
    id: 1,
    title: "Q3 Financial Report 2024",
    type: "PDF",
    pages: 24,
    size: "2.4 MB",
    agendaId: 2,
    url: "https://example.com/board-pack/q3-financial-report-2024.pdf",
    slides: [
      { title: "Executive Summary", body: "<p>Q3 2024 closed with revenue of <strong>\u20b942.3 Cr</strong> against a target of \u20b940 Cr, marking a 5.75% outperformance. EBITDA margin held at 18.4%.</p><ul><li>Cash reserves: \u20b99.1 Cr</li><li>Operating costs within approved envelope</li><li>Three audit observations raised \u2014 responses in progress</li></ul>" },
      { title: "Revenue Performance", body: "<p>Product revenue grew <strong>12% YoY</strong> driven by expansion of enterprise accounts. Services revenue remained flat.</p><ul><li>Enterprise: \u20b928.4 Cr (+18% YoY)</li><li>SMB: \u20b99.3 Cr (+4% YoY)</li><li>Services: \u20b94.6 Cr (flat)</li></ul>" },
      { title: "Budget Variance Analysis", body: "<p>Operational expenditure exceeded budget by <strong>\u20b93.2 Cr</strong>, primarily due to unplanned infrastructure upgrades and compliance advisory costs.</p><blockquote>Extension request is within the 8% variance threshold pre-approved by the board.</blockquote>" },
      { title: "Audit Observations", body: "<p>The Q3 statutory audit raised <strong>three observations</strong>:</p><ul><li>Reconciliation gap in intercompany transfers \u2014 remediation in progress</li><li>Delayed filing of two vendor invoices \u2014 process fix applied</li><li>Depreciation schedule requires realignment \u2014 CFO action by Nov 30</li></ul>" },
    ],
  },
  {
    id: 2,
    title: "Product Roadmap Appendix",
    type: "PDF",
    pages: 18,
    size: "1.8 MB",
    agendaId: 3,
    url: "https://example.com/board-pack/product-roadmap-appendix.pdf",
    slides: [
      { title: "2025 Roadmap Overview", body: "<p>The 2025 product roadmap covers <strong>four major release cycles</strong> across Q1\u2013Q4, with two new modules and a mobile-first platform redesign.</p><ul><li>Q1: Platform stability and technical debt resolution</li><li>Q2: AI Analytics module launch</li><li>Q3: Mobile-first redesign go-live</li><li>Q4: Client Portal v2</li></ul>" },
      { title: "Funding Envelope", body: "<p>Total approved envelope: <strong>\u20b918.5 Cr</strong> covering engineering headcount (\u20b911 Cr), infrastructure (\u20b94.5 Cr), and tooling and licensing (\u20b93 Cr).</p>" },
      { title: "Hiring Plan", body: "<p>Roadmap delivery requires <strong>12 additional engineers</strong> and 3 product managers to be onboarded by end of Q1 2025.</p>" },
    ],
  },
  {
    id: 3,
    title: "Vendor Comparison Matrix",
    type: "XLS",
    pages: 8,
    size: "0.9 MB",
    agendaId: 4,
    url: "https://example.com/board-pack/vendor-comparison-matrix.xls",
    slides: [
      { title: "Shortlisted Vendors Overview", body: "<p>Three vendors were evaluated across <strong>14 criteria</strong> including pricing, SLA commitments, implementation timeline, and DPDPA compliance readiness.</p>" },
      { title: "Commercial Summary", body: "<p>Selected vendor offers the strongest commercial terms at <strong>\u20b94.8 Cr over 36 months</strong> with a 99.9% uptime SLA backed by a penalty clause structure.</p>" },
      { title: "Legal and Compliance Status", body: "<p>DPA review is <strong>in progress</strong>. Legal counsel has identified two clauses requiring renegotiation before the board can authorize execution.</p>" },
    ],
  },
  {
    id: 4,
    title: "Risk Register \u2013 Q4 2024",
    type: "XLS",
    pages: 6,
    size: "0.7 MB",
    agendaId: 5,
    url: "https://example.com/board-pack/risk-register-q4-2024.xls",
    slides: [
      { title: "Risk Summary", body: "<p>The Q4 2024 risk register contains <strong>18 active risks</strong>, of which 3 have been upgraded to High severity since the last review.</p>" },
      { title: "High-Severity Risks", body: "<ul><li><strong>Vendor dependency risk</strong> \u2014 single-source critical supplier, escalated to Risk Committee</li><li><strong>Data breach exposure</strong> \u2014 legacy API endpoints identified, patching in progress</li></ul>" },
    ],
  },
  {
    id: 5,
    title: "Board Meeting Agenda Pack",
    type: "PDF",
    pages: 10,
    size: "1.1 MB",
    agendaId: null,
    url: "https://example.com/board-pack/board-meeting-agenda-pack.pdf",
    slides: [
      { title: "Full Agenda", body: "<ol style='padding-left:18px;margin:0;line-height:1.9'><li>Opening and Roll Call \u2014 5 min</li><li>Q3 Financial Review \u2014 20 min</li><li>Product Roadmap 2025 \u2014 30 min</li><li>Vendor Contract Decision \u2014 15 min</li><li>Risk Register Update \u2014 20 min</li><li>Closing Actions \u2014 10 min</li></ol>" },
    ],
  },
  {
    id: 6,
    title: "Previous Meeting Minutes (Q3)",
    type: "PDF",
    pages: 6,
    size: "0.6 MB",
    agendaId: null,
    url: "https://example.com/board-pack/previous-meeting-minutes-q3.pdf",
    slides: [
      { title: "Q3 Board Review \u2013 Key Outcomes", body: "<p>Minutes from the <strong>Q3 Board Review held October 20, 2024</strong>.</p><ul><li>Q3 financial performance reviewed and approved</li><li>Budget extension for voting approved</li><li>Vendor shortlisting initiated</li></ul>" },
    ],
  },
  {
    id: 7,
    title: "Compliance Calendar \u2013 Q4 2024 & H1 2025",
    type: "PDF",
    pages: 5,
    size: "0.5 MB",
    agendaId: null,
    url: "https://example.com/board-pack/compliance-calendar.pdf",
    slides: [
      { title: "Key Deadlines", body: "<ul><li><strong>Dec 31</strong> \u2014 DPDPA compliance report due</li><li><strong>Dec 31</strong> \u2014 annual return filing</li><li><strong>Mar 31</strong> \u2014 FY end compliance review</li></ul>" },
    ],
  },
];

/* -------------------------------------------------------------------
   TASKS  agendaId: null means "common" / general task not tied to
   one specific agenda item.
------------------------------------------------------------------- */
export const TASKS = [
  {
    id: "t1",
    title: "Circulate signed attendance register",
    agendaId: 1,
    description: "<p>Prepare and circulate the signed <strong>attendance register</strong> to all participants and the company secretary within 24 hours of the meeting.</p>",
    assigneeId: 1,
    dueDate: "2024-11-16",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "t2",
    title: "Prepare monthly variance report template",
    agendaId: 2,
    description: "<p>Design and deliver a <strong>standardized monthly expense variance report template</strong> for CFO sign-off. Include actuals vs budget, YTD delta, and commentary fields.</p>",
    assigneeId: 2,
    dueDate: "2024-11-20",
    status: "Pending",
    priority: "High",
  },
  {
    id: "t3",
    title: "Schedule December budget checkpoint",
    agendaId: 2,
    description: "<p>Coordinate with the board secretary to <strong>block a 2-hour slot in December</strong> for the budget review checkpoint. Share agenda template in advance.</p>",
    assigneeId: 2,
    dueDate: "2024-11-18",
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: "t4",
    title: "Publish 2025 roadmap to engineering teams",
    agendaId: 3,
    description: "<p>Share the <strong>board-approved 2025 product roadmap</strong> with all engineering leads and product managers. Include approved funding envelope and headcount plan.</p>",
    assigneeId: 3,
    dueDate: "2024-11-22",
    status: "Pending",
    priority: "High",
  },
  {
    id: "t5",
    title: "Complete legal review of vendor DPA",
    agendaId: 4,
    description: "<p>Engage legal counsel to <strong>review and approve the Data Processing Addendum</strong> for DPDPA compliance. Flag any terms requiring renegotiation before board sign-off.</p>",
    assigneeId: 4,
    dueDate: "2024-11-22",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "t6",
    title: "Escalate vendor risk to Risk Committee",
    agendaId: 5,
    description: "<p>Prepare a <strong>formal risk escalation memo</strong> for the Risk Committee covering the vendor dependency risk, including likelihood score, potential impact, and proposed mitigations.</p>",
    assigneeId: 5,
    dueDate: "2024-11-28",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "t7",
    title: "Draft and circulate meeting minutes",
    agendaId: 6,
    description: "<p>Prepare the <strong>draft minutes of the board meeting</strong> covering all agenda items, resolutions passed, decisions recorded, and action items. Circulate within 3 business days.</p>",
    assigneeId: 1,
    dueDate: "2024-11-18",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "t8",
    title: "Archive signed resolutions in board repository",
    agendaId: null,
    description: "<p>Once fully signed, all resolutions shall be <strong>archived in the board document repository</strong> with version control and access restricted to authorized members.</p>",
    assigneeId: 1,
    dueDate: "2024-11-25",
    status: "Pending",
    priority: "Low",
  },
  {
    id: "t9",
    title: "Update compliance calendar for H1 2025",
    agendaId: null,
    description: "<p>Review and update the <strong>compliance calendar</strong> with all statutory filing deadlines, license renewals, and policy review windows for H1 2025.</p>",
    assigneeId: 2,
    dueDate: "2024-12-05",
    status: "Pending",
    priority: "Low",
  },
];

export const PARTICIPANTS = [
  { id: 1, name: "James Whitfield", email: "j.whitfield@corp.com", role: "host", initials: "JW", color: "#D4A853", image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 2, name: "Sarah Chen", email: "s.chen@corp.com", role: "member", initials: "SC", color: "#4A9ED4", image: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 3, name: "Marcus Reid", email: "m.reid@corp.com", role: "member", initials: "MR", color: "#7A6FDA", image: "https://randomuser.me/api/portraits/men/68.jpg" },
  { id: 4, name: "Elena Vasquez", email: "e.vasquez@corp.com", role: "member", initials: "EV", color: "#4DB896", image: "https://randomuser.me/api/portraits/women/65.jpg" },
  { id: 5, name: "Thomas Park", email: "t.park@corp.com", role: "observer", initials: "TP", color: "#D4744A", image: "https://randomuser.me/api/portraits/men/75.jpg" },
];

export const getAgendaTitleById = (id) => AGENDA_ITEMS.find((a) => a.id === id)?.title || null;
export const getParticipantById = (id) => PARTICIPANTS.find((p) => p.id === id) || null;
