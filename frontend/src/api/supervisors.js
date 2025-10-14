// Mock API for supervisors
// Fetch supervision requests (mock)
export const getSupervisionRequests = async () => {
  return Promise.resolve([
    { id: 1, researcher: "Alice", title: "AI in Healthcare", status: "Pending" },
    { id: 2, researcher: "Bob", title: "Blockchain Security", status: "Approved" },
    { id: 3, researcher: "Charlie", title: "Green Energy Storage", status: "Rejected" }
  ]);
};

// Submit feedback for a research
export const giveFeedback = async (id, feedback) => {
  return Promise.resolve({ success: true, id, feedback });
};

// Fetch supervisor feedback (mock)
export const getSupervisorFeedback = async (supervisorId) => {
  return Promise.resolve([
    { id: 101, supervisorId, researcher: "Alice", feedback: "Great proposal, refine methodology." },
    { id: 102, supervisorId, researcher: "Bob", feedback: "Needs more data analysis." }
  ]);
};
