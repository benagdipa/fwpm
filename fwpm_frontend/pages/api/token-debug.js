// API endpoint to debug token storage and format
export default function handler(req, res) {
  const results = {
    timestamp: new Date().toISOString(),
    token_status: 'unknown',
    token_details: null,
    user_status: 'unknown',
    user_details: null
  };
  
  // Check if running on the server
  if (typeof window === 'undefined') {
    results.environment = 'server';
    results.token_status = 'unavailable';
    results.user_status = 'unavailable';
    results.note = 'Cannot access localStorage on server side';
  } else {
    // Client-side code
    results.environment = 'client';
    
    try {
      const token = localStorage.getItem('token');
      if (token) {
        results.token_status = 'present';
        results.token_details = {
          length: token.length,
          prefix: token.substring(0, 10) + '...',
          format: token.includes('.') ? 'Appears to be JWT' : 'Appears to be simple token'
        };
      } else {
        results.token_status = 'missing';
      }
    } catch (error) {
      results.token_status = 'error';
      results.token_error = error.message;
    }
    
    try {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        results.user_status = 'present';
        try {
          const user = JSON.parse(userJson);
          results.user_details = {
            has_id: !!user.id,
            has_username: !!user.username,
            has_email: !!user.email,
            first_login: user.first_login
          };
        } catch (parseError) {
          results.user_status = 'invalid_json';
          results.user_error = parseError.message;
        }
      } else {
        results.user_status = 'missing';
      }
    } catch (error) {
      results.user_status = 'error';
      results.user_error = error.message;
    }
  }
  
  res.status(200).json(results);
} 