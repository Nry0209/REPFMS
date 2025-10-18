// src/api/researcher.js
// Mocked API/stub layer for researcher dashboard flows until backend endpoints are ready.

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// Simple in-memory store (persists during session) + localStorage for counts/status
const store = {
  comments: {}, // { [researchId]: [ { id, supervisorName, comment, date } ] }
  assignedPapers: {}, // { [researchId]: [ { id, title, url } ] }
  uploads: {}, // { [researchId]: [ { id, title, url, details, uploadedAt } ] }
  fundingStatus: {}, // { [researchId]: { status: 'pending'|'approved'|'rejected', fileName } }
  supervisionRequests: {}, // { [researchId]: Set(supervisorId) }
};

export async function getComments(researchId) {
  await delay();
  if (!store.comments[researchId]) {
    store.comments[researchId] = [
      { id: 'c1', supervisorName: 'Dr. Smith', comment: 'Good progress. Add baseline comparison.', date: new Date().toISOString() },
      { id: 'c2', supervisorName: 'Dr. Jane', comment: 'Please refine the evaluation metrics.', date: new Date().toISOString() },
    ];
  }
  return store.comments[researchId];
}

export async function getAssignedPapers(researchId) {
  await delay();
  if (!store.assignedPapers[researchId]) {
    store.assignedPapers[researchId] = [
      { id: 'p1', title: 'System Assigned: Foundations of XYZ', url: '#' },
      { id: 'p2', title: 'System Assigned: Advanced Methods in XYZ', url: '#' },
    ];
  }
  return store.assignedPapers[researchId];
}

export async function uploadResearcherPaper(researchId, file, details) {
  await delay();
  const id = `u_${Date.now()}`;
  if (!store.uploads[researchId]) store.uploads[researchId] = [];
  store.uploads[researchId].push({ id, title: file?.name || 'uploaded.pdf', url: '#', details, uploadedAt: new Date().toISOString() });
  return { success: true, id };
}

export async function getResearcherUploads(researchId) {
  await delay();
  return store.uploads[researchId] || [];
}

export async function getSupervisorsByDomain(domains = []) {
  const token = localStorage.getItem('researcherToken');
  const query = domains.length ? `?domains=${encodeURIComponent(domains.join(','))}` : '';
  const res = await fetch(`http://localhost:5000/api/researchers/supervisors/by-domains${query}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success) return [];
  return data.data;
}

export async function requestSupervision(researchId, supervisor) {
  const token = localStorage.getItem('researcherToken');
  const res = await fetch(`http://localhost:5000/api/researchers/research/${researchId}/request-supervision`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ supervisorId: supervisor._id }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    return { success: false, message: data.message || 'Unable to send request' };
  }
  return { success: true, data: data.data };
}

export async function getFundingStatus(researchId) {
  await delay();
  return store.fundingStatus[researchId] || { status: 'none', fileName: null };
}

export async function submitFundingRequest(researchId, file) {
  await delay();
  store.fundingStatus[researchId] = { status: 'pending', fileName: file?.name || 'request.pdf' };
  return { success: true };
}

// Helper to get a fake research by id (title + domains)
export async function getResearchById(id) {
  const token = localStorage.getItem('researcherToken');
  const res = await fetch(`http://localhost:5000/api/researchers/research/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch research');
  return data.data;
}

// Allow only one assigned researcher to comment per research (mocked via localStorage key)
export async function addResearcherComment(researchId, text) {
  await delay();
  const ownerKey = `rc_owner_${researchId}`;
  const isOwner = localStorage.getItem(ownerKey);
  if (!isOwner) {
    // First commenter on this browser becomes the owner
    localStorage.setItem(ownerKey, '1');
  } else if (isOwner !== '1') {
    return { success: false, message: 'Only the assigned researcher can comment.' };
  }
  if (!store.comments[researchId]) store.comments[researchId] = [];
  store.comments[researchId].push({ id: `rc_${Date.now()}`, supervisorName: 'Researcher', comment: text, date: new Date().toISOString() });
  return { success: true };
}

export async function getLocalPendingRequests() {
  await delay(50);
  try {
    return JSON.parse(localStorage.getItem('mock_pending_requests') || '[]');
  } catch (_) {
    return [];
  }
}
