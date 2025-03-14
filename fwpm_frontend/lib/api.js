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
        // Log detailed information about the request and token
        console.log(`API Request Details:
          - URL: ${config.url}
          - Method: ${config.method}
          - Token present: ${!!token}
          - Token first 10 chars: ${token.substring(0, 10)}...`);
        
        // Use 'Token' prefix instead of 'Bearer' for Django REST Framework's TokenAuthentication
        config.headers.Authorization = `Token ${token}`;
        
        // Log what we're sending
        console.log(`Authorization header set to: Token ${token.substring(0, 10)}...`);
      } else {
        // If we should have a token but don't, log it
        console.log(`API Request to ${config.url} with NO auth token!`);
      }
    }
    return config;
  },
  (error) => {
    console.error('API request interceptor error:', error);
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
      console.error('API Error Response:', error.response.status, error.response.data, 'URL:', error.config.url);
      
      // Handle authentication errors (401, 403)
      if (error.response.status === 401 || error.response.status === 403) {
        console.error('Authentication error detected for request:', error.config.url);
        
        // Check if this is a profile fetch after login
        const isProfileFetchAfterLogin = error.config.url === '/auth/me/' && 
                                         error.config.method === 'get';
        
        // Check if it's a login-related request 
        const isLoginRequest = error.config.url.includes('/auth/login') || 
                              error.config.url.includes('/auth/email-login');
        
        if (isProfileFetchAfterLogin) {
          console.error('Profile fetch failed with auth error - token might be invalid');
          // For profile fetch, we'll throw a specialized error for proper handling in AuthContext
        } else if (!isLoginRequest) {
          // For non-login requests with auth errors, clear token and redirect
          if (typeof window !== 'undefined') {
            console.log('Clearing invalid authorization token');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Only redirect if we're not already on the login page
            if (!window.location.pathname.includes('/login')) {
              console.log('Redirecting to login due to auth error');
              window.location.href = '/login';
            }
          }
        }
      }
    } else if (error.request) {
      // The request was made but no response received
      console.error('API No Response:', error.request);
    } else {
      // Something happened in setup
      console.error('API Error Setup:', error.message);
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
      // First try with the standard format
      try {
        console.log('Attempting profile fetch with standard token format (Bearer token)');
        const response = await api.get('/auth/me/');
        return response.data;
      } catch (error) {
        // If we get a 401, try with different token formats as fallback
        if (error.response && error.response.status === 401) {
          const token = localStorage.getItem('token');
          if (!token) throw error; // If no token, just throw the original error
          
          // Log the token for debugging
          console.log('Token for debugging:', {
            raw: token,
            length: token.length,
            firstChars: token.substring(0, 10)
          });
          
          console.log('First attempt failed with 401, trying alternative token format #1 (token without Bearer)');
          try {
            // Try a direct request with token without 'Bearer' prefix
            const alternateResponse1 = await axios({
              method: 'get',
              url: `${API_URL}/auth/me/`,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              }
            });
            
            console.log('Alternative token format #1 succeeded!');
            return alternateResponse1.data;
          } catch (alt1Error) {
            console.log('Alternative format #1 failed:', alt1Error.response?.status);
            
            // Try format #2 - Token in a different header
            console.log('Trying alternative token format #2 (Token header)');
            try {
              const alternateResponse2 = await axios({
                method: 'get',
                url: `${API_URL}/auth/me/`,
                headers: {
                  'Content-Type': 'application/json',
                  'Token': token
                }
              });
              
              console.log('Alternative token format #2 succeeded!');
              return alternateResponse2.data;
            } catch (alt2Error) {
              console.log('Alternative format #2 failed:', alt2Error.response?.status);
              
              // Try format #3 - Token as URL parameter
              console.log('Trying alternative token format #3 (URL parameter)');
              try {
                const alternateResponse3 = await axios({
                  method: 'get',
                  url: `${API_URL}/auth/me/?token=${token}`,
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
                
                console.log('Alternative token format #3 succeeded!');
                return alternateResponse3.data;
              } catch (alt3Error) {
                console.log('Alternative format #3 failed:', alt3Error.response?.status);
                
                // Try format #4 - Using "Token" prefix instead of "Bearer"
                console.log('Trying alternative token format #4 (Token prefix)');
                try {
                  const alternateResponse4 = await axios({
                    method: 'get',
                    url: `${API_URL}/auth/me/`,
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Token ${token}`
                    }
                  });
                  
                  console.log('Alternative token format #4 succeeded!');
                  return alternateResponse4.data;
                } catch (alt4Error) {
                  console.log('Alternative format #4 failed:', alt4Error.response?.status);
                  throw error; // Throw original error if all alternatives fail
                }
              }
            }
          }
        }
        
        // If the error is not a 401 or our fallback failed, throw the original error
        throw error;
      }
    } catch (error) {
      console.error('All profile fetch attempts failed:', error);
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
  },

  // Get LTE metrics for dashboard
  getLTEMetrics: async (site, days) => {
    try {
      const response = await api.get('/network-performance/lte-metrics/', {
        params: { site, days }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get alerts
  getAlerts: async () => {
    try {
      const response = await api.get('/network-performance/alerts/');
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
      const response = await api.get('/implementation-tasks/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Alias for fetchTasks for backward compatibility
  getTasks: async () => {
    try {
      const response = await api.get('/implementation-tasks/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get implementation details
  fetchImplementationDetails: async (id) => {
    try {
      const response = await api.get(`/implementations/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create implementation task
  createTask: async (taskData) => {
    try {
      const response = await api.post('/implementation-tasks/', taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update implementation task
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/implementation-tasks/${id}/`, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete implementation task
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/implementation-tasks/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get implementation stats
  getStats: async () => {
    try {
      const response = await api.get('/implementations/stats/');
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

  // Get WNTD stats
  getStats: async () => {
    try {
      const response = await api.get('/wntd/stats/');
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