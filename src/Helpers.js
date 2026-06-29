

export const TASK_STATUSES = ["Pending", "In Progress", "Done"];

/** Build a stable id for a resolution / decision vote item */
export const getVoteItemId = (type, agendaId, index) => `${type}-${agendaId}-${index}`;

/** Tally votes for a given vote item */
export const getVoteResult = (itemId, votes) => {
  const itemVotes = Object.values(votes[itemId] || {});
  const approve = itemVotes.filter((v) => v === "Approve").length;
  const reject = itemVotes.filter((v) => v === "Reject").length;
  const abstain = itemVotes.filter((v) => v === "Abstain").length;
  const status = approve > reject && approve > 0 ? "Approved" : itemVotes.length ? "Pending" : "Waiting";
  return { approve, reject, abstain, status };
};

/** Format a duration given in seconds as HH:MM:SS or MM:SS */
export const formatDuration = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

/** Normalize older "online"/"offline" attendance values to physical/electronic/absent */
export const normalizeAttendance = (mode) => {
  if (mode === "online") return "electronic";
  if (mode === "offline") return "physical";
  return mode || "absent";
};

/** Convert a plain string resolution/decision (legacy data) into an { title, description } object */
export const toObj = (r) => (typeof r === "string" ? { title: r, description: "" } : r);
