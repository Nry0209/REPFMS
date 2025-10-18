import axios from 'axios';

// Create axios instance with base URL and timeout
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// Get all researches
export const getResearches = async () => {
  try {
    console.log('Fetching researches...');
    const response = await api.get('/researches');
    console.log('Researches data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getResearches:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || 'Failed to fetch researches');
  }
};

// Get research by ID
export const getResearchById = async (id) => {
  try {
    console.log(`Fetching research ${id}...`);
    const response = await api.get(`/researches/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getResearchById(${id}):`, {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || `Failed to fetch research ${id}`);
  }
};

// Get available supervisors
export const getAvailableSupervisors = async () => {
  try {
    console.log('Fetching available supervisors...');
    const response = await api.get('/researches/supervisors/available');
    return response.data;
  } catch (error) {
    console.error('Error in getAvailableSupervisors:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || 'Failed to fetch available supervisors');
  }
};

// Assign supervisor to research
export const assignSupervisor = async (researchId, supervisorId) => {
  try {
    console.log(`Assigning supervisor ${supervisorId} to research ${researchId}`);
    const response = await api.put(`/researches/${researchId}/supervisor`, { supervisorId });
    return response.data;
  } catch (error) {
    console.error('Error in assignSupervisor:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || 'Failed to assign supervisor');
  }
};

/**
 * Update supervisor status for a research
 * @param {string} researchId - ID of the research
 * @param {string} status - 'accepted' or 'rejected'
 * @returns {Promise<Object>} Updated research data
 */
export const updateSupervisorStatus = async (researchId, status) => {
  try {
    const response = await api.put(`/researches/${researchId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating supervisor status:', error);
    throw error;
  }
};

// Delete a research
// @param {string} researchId - ID of the research to delete
// @returns {Promise<Object>} Deletion result
export const deleteResearch = async (researchId) => {
  try {
    const response = await api.delete(`/researches/${researchId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting research:', error);
    throw error;
  }
};

/**
 * Generate a research report
 * @param {Object} filters - Filters for the report
 * @returns {Promise<Blob>} - Report file as Blob
 */
export const generateReport = async (filters = {}) => {
  try {
    const response = await api.get('/researches/report', {
      params: filters,
      responseType: 'blob', // Important for file download
    });
    return response.data;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};
