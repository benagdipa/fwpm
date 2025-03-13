// Health check API to diagnose connectivity issues
import axios from 'axios';

export default async function handler(req, res) {
  const results = {
    frontend: {
      status: 'ok',
      timestamp: new Date().toISOString()
    },
    backend: {
      attempted: false,
      reachable: false,
      status: null,
      error: null,
      api_url: null,
      endpoints_tested: []
    },
    environment: {
      api_url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
      node_env: process.env.NODE_ENV
    }
  };
  
  // Get the backend API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  results.backend.api_url = API_URL;
  console.log('Health-check API: Testing backend at:', API_URL);
  
  // Test endpoints in order of preference
  const endpointsToTest = [
    '/auth/login/',  // Most reliable endpoint that should always exist
    '/',             // API root
    '/auth/me/'      // User profile endpoint (requires auth, will fail but should be reachable)
  ];
  
  // Try each endpoint until one works
  for (const endpoint of endpointsToTest) {
    results.backend.attempted = true;
    results.backend.endpoints_tested.push(endpoint);
    
    try {
      console.log(`Health-check API: Testing endpoint ${endpoint}`);
      const response = await axios.get(`${API_URL}${endpoint}`, { 
        timeout: 5000, // 5 second timeout
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        validateStatus: false // Don't throw for any status code
      });
      
      console.log(`Health-check API: Response from ${endpoint}:`, response.status);
      
      // If we get any response, the backend is reachable
      results.backend.reachable = true;
      results.backend.status = response.status;
      
      // We got a response, no need to try other endpoints
      break;
    } catch (error) {
      console.error(`Health-check API: Error connecting to ${endpoint}:`, error.message);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        results.backend.reachable = true;
        results.backend.status = error.response.status;
        // We got a response, no need to try other endpoints
        break;
      } else if (error.request) {
        // The request was made but no response was received
        results.backend.error = 'No response received';
        // Continue to the next endpoint
      } else {
        // Something happened in setting up the request
        results.backend.error = error.message;
        // Continue to the next endpoint
      }
    }
  }
  
  // Network diagnostics
  if (!results.backend.reachable) {
    results.network_diagnostics = {
      message: "Backend server is not reachable. This could be due to:",
      possible_causes: [
        "Backend server is not running",
        "Backend server is running on a different port or URL",
        "Network connectivity issues between frontend and backend",
        "Firewall or CORS issues blocking the connection"
      ],
      suggested_actions: [
        `Check that the Django server is running at ${API_URL}`,
        "Make sure the NEXT_PUBLIC_API_URL environment variable is correctly set",
        "Verify there are no network connectivity issues (VPN, firewall, etc.)"
      ]
    };
  }
  
  return res.status(200).json(results);
} 