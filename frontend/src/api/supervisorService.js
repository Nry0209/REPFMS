import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
};

export const supervisorService = {
  // Get all supervisors (for admin)
  getAllSupervisors: async (status = '') => {
    const url = status 
      ? `${API_URL}/admin/supervisors?status=${status}`
      : `${API_URL}/admin/supervisors`;
      
    const response = await axios.get(url, getAuthHeader());
    return response.data;
  },

  // Approve a supervisor
  approveSupervisor: async (id) => {
    const response = await axios.patch(
      `${API_URL}/admin/supervisors/${id}/approve`,
      {},
      getAuthHeader()
    );
    return response.data;
  },

  // Reject a supervisor
  rejectSupervisor: async (id, reason) => {
    const response = await axios.patch(
      `${API_URL}/admin/supervisors/${id}/reject`,
      { reason },
      getAuthHeader()
    );
    return response.data;
  },

  // Delete a supervisor
  deleteSupervisor: async (id) => {
    const response = await axios.delete(
      `${API_URL}/admin/supervisors/${id}`,
      getAuthHeader()
    );
    return response.data;
  },

  // Update a supervisor
  updateSupervisor: async (id, data) => {
    const response = await axios.put(
      `${API_URL}/admin/supervisors/${id}`,
      data,
      getAuthHeader()
    );
    return response.data;
  }
};

export default supervisorService;
