import axios from 'axios';
import getConfig from 'next/config';

// Get Next.js runtime configuration
const { publicRuntimeConfig } = getConfig() || { publicRuntimeConfig: {} };

// Create axios instance with base URL from environment variable
const API_URL = publicRuntimeConfig.apiUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const isProduction = (publicRuntimeConfig.nodeEnv || process.env.NODE_ENV) === 'production';

// Log the configured API URL for debugging
console.log(`API client configured with URL: ${API_URL}, Environment: ${isProduction ? 'Production' : 'Development'}`);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: isProduction ? 30000 : 10000, // Longer timeout in production for potentially slow connections
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle API errors
    if (error.response) {
      // Server responded with a status outside the 2xx range
      console.error('API Error Response:', error.response.status, error.response.data);
      
      // Handle 401 Unauthorized errors (token expired/invalid)
      if (error.response.status === 401 && typeof window !== 'undefined') {
        console.warn('Authentication error, clearing token.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?session=expired';
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Authentication API functions
const authAPI = {
  // Login user - use email-login endpoint since that's what's configured in the backend
  login: async (loginData) => {
    try {
      const response = await api.post('/auth/email-login/', loginData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Email-only login
  emailLogin: async (emailData) => {
    try {
      const response = await api.post('/auth/email-login/', emailData);
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

// Implementation tracker API functions
const implementationAPI = {
  // Get implementation tasks
  fetchTasks: async () => {
    try {
      const response = await api.get('/implementation-tracker/tasks/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get implementation details
  fetchImplementationDetails: async (id) => {
    try {
      const response = await api.get(`/implementation-tracker/details/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create implementation task
  createTask: async (taskData) => {
    try {
      const response = await api.post('/implementation-tracker/tasks/', taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update implementation task
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/implementation-tracker/tasks/${id}/`, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete implementation task
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/implementation-tracker/tasks/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// WNTD API functions
const wntdAPI = {
  // Get WNTD data
  fetchData: async () => {
    try {
      const response = await api.get('/wntd/data/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get WNTD details
  fetchDetails: async (id) => {
    try {
      const response = await api.get(`/wntd/details/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create WNTD entry
  createEntry: async (entryData) => {
    try {
      const response = await api.post('/wntd/entries/', entryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update WNTD entry
  updateEntry: async (id, entryData) => {
    try {
      const response = await api.put(`/wntd/entries/${id}/`, entryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete WNTD entry
  deleteEntry: async (id) => {
    try {
      const response = await api.delete(`/wntd/entries/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Export API functions
export { api, authAPI, networkAPI, implementationAPI, wntdAPI, API_URL };

// Add default export for backward compatibility
export default api; 