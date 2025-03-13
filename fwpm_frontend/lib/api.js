import axios from 'axios';

// Create axios instance with base URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Add authorization header if token exists
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear credentials and redirect to login page
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API functions
const authAPI = {
  // Login user
  login: async (loginData) => {
    try {
      const response = await api.post('/auth/login/', loginData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/me/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/me/', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Network performance API functions
const networkAPI = {
  // Get sites
  fetchSites: async () => {
    try {
      const response = await api.get('/network-performance/sites/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Connect to Starburst
  connectToStarburst: async () => {
    try {
      const response = await api.post('/network-performance/connect-starburst/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get LTE metrics
  fetchLteMetrics: async (params) => {
    try {
      const response = await api.get('/network-performance/lte-metrics/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get NR metrics
  fetchNrMetrics: async (params) => {
    try {
      const response = await api.get('/network-performance/nr-metrics/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get dashboard summary
  fetchDashboardSummary: async (params) => {
    try {
      const response = await api.get('/network-performance/dashboard-summary/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Export API functions
export { api, authAPI, networkAPI, API_URL }; 