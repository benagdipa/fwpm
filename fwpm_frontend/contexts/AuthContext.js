import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '../lib/api';

// Initialize with default values
const defaultContext = {
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  refreshProfile: async () => {},
  changePassword: async () => {},
  passwordChangeRequired: false
};

const AuthContext = createContext(defaultContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [passwordChangeRequired, setPasswordChangeRequired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Check if user is already logged in (token exists)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Auth context loaded user:', parsedUser);
        setUser(parsedUser);
        
        // Check if password change is required
        if (parsedUser.first_login) {
          setPasswordChangeRequired(true);
          // Only redirect if not already on the profile page
          if (router.pathname !== '/profile') {
            router.push('/profile?passwordChange=required');
          }
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      console.log('No user found in localStorage');
    }
    setLoading(false);
  }, [router]);

  // Prevent hydration errors by not rendering until mounted
  if (!mounted) {
    return null;
  }

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('=== AuthContext: login started for email:', email);
      
      // Extract username from email (part before @)
      const username = email.split('@')[0];
      console.log('=== AuthContext: extracted username:', username);
      
      // Verify this is an NBN email
      if (!email.toLowerCase().endsWith('@nbnco.com.au')) {
        console.log('=== AuthContext: not an NBN email');
        return { success: false, message: 'Only NBN email addresses are allowed' };
      }
      
      try {
        let data;
        
        // Check if we're doing email-only login or username+password login
        if (!password) {
          // Email-only login (new streamlined method)
          console.log('=== AuthContext: attempting email-only login API call');
          data = await authAPI.emailLogin({ email });
        } else {
          // Traditional username+password login (fallback for compatibility)
          console.log('=== AuthContext: attempting traditional login API call');
          data = await authAPI.login({ username, password });
        }
        
        console.log('=== AuthContext: login API call successful, response:', data);
        
        // Check if token is present in response
        if (!data.token) {
          console.error('=== AuthContext: No token in login response:', data);
          return { success: false, message: 'Login succeeded but no token was returned by the server' };
        }
        
        // First store the token immediately after login
        console.log('=== AuthContext: storing token in localStorage');
        localStorage.setItem('token', data.token);
        
        // Log token for debugging (first few chars only)
        console.log('=== AuthContext: token stored (first 10 chars):', data.token.substring(0, 10) + '...');
        
        try {
          // Get the full profile after login
          console.log('=== AuthContext: fetching user profile');
          try {
            // Log detailed token information before making the request
            console.log('=== AuthContext: About to make profile request with token:', {
              tokenExists: !!localStorage.getItem('token'),
              tokenFirstChars: localStorage.getItem('token') ? localStorage.getItem('token').substring(0, 10) + '...' : 'N/A'
            });
            
            const profileData = await authAPI.getProfile();
            console.log('=== AuthContext: profile data received:', profileData);
            
            // Extract role directly if it exists in the profile structure
            const extractedRole = profileData.role || 
                                 (profileData.profile && profileData.profile.role) || 
                                 null;
            
            // Create combined user data, ensuring role is accessible at root level too
            const userData = { 
              ...data.user, 
              ...profileData,
              // Ensure role is available at root level for easier access
              role: extractedRole || data.user.role || 
                   (data.user.profile && data.user.profile.role)
            };
            
            console.log('=== AuthContext: combined user data:', userData);
            console.log('=== AuthContext: extracted role:', userData.role);
            
            console.log('=== AuthContext: storing user data in localStorage');
            localStorage.setItem('user', JSON.stringify(userData));
            
            console.log('=== AuthContext: updating user state');
            setUser(userData);
            
            // Check if this is the first login (password change required)
            if (userData.first_login) {
              console.log('=== AuthContext: first login detected, setting passwordChangeRequired');
              setPasswordChangeRequired(true);
            }
            
            console.log('=== AuthContext: login successful');
            return { success: true };
          } catch (profileError) {
            console.error('=== AuthContext: Error fetching profile after login:', profileError);
            
            // Log the complete error object for better debugging
            console.error('=== AuthContext: Full profile error details:', {
              name: profileError.name,
              message: profileError.message,
              status: profileError.response?.status,
              statusText: profileError.response?.statusText,
              data: profileError.response?.data,
              headers: profileError.response?.headers,
              config: {
                url: profileError.config?.url,
                method: profileError.config?.method,
                headers: profileError.config?.headers
              }
            });
            
            // Check if this is a 401/403 error which indicates an authentication problem
            if (profileError.response && 
              (profileError.response.status === 401 || profileError.response.status === 403)) {
              console.error('=== AuthContext: Authentication error when fetching profile:', 
                            profileError.response.status, profileError.response.data);
              
              // Log token for debugging
              const currentToken = localStorage.getItem('token');
              console.error('=== AuthContext: Token used for profile fetch (first 10 chars):', 
                           currentToken ? currentToken.substring(0, 10) + '...' : 'NO TOKEN');
              
              // Log extra information to diagnose the issue
              console.error('=== AuthContext: TROUBLESHOOTING INFO:', {
                tokenLength: currentToken ? currentToken.length : 0,
                hasSpecialChars: currentToken ? /[^a-zA-Z0-9]/.test(currentToken) : false,
                startsWithBearer: currentToken ? currentToken.startsWith('Bearer ') : false
              });
              
              // Remove the token since it's likely invalid
              localStorage.removeItem('token');
              
              // Return a specific error about profile fetch failing
              return { 
                success: false, 
                message: 'Authentication failed while getting your profile. Please try logging in again.',
                errorType: 'profile_fetch_error' 
              };
            }
            
            // For other errors, we'll still try to log in with basic data
            console.log('=== AuthContext: Using basic user data from login response');
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            
            console.log('=== AuthContext: login partially successful (no profile data)');
            return { success: true };
          }
        } catch (loginError) {
          console.error('=== AuthContext: login attempt failed:', loginError);
          
          if (loginError.response) {
            console.error('=== AuthContext: login error response status:', loginError.response.status);
            console.error('=== AuthContext: login error response data:', loginError.response.data);
          }
          
          // Return detailed error information
          return { 
            success: false,
            message: loginError.response?.data?.error || 'Login failed. Please try again.',
            error: loginError
          };
        }
      } catch (error) {
        console.error('=== AuthContext: Unexpected error during login:', error);
        return { success: false, message: 'An unexpected error occurred', error };
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('=== AuthContext: Unexpected error during login:', error);
      return { success: false, message: 'An unexpected error occurred', error };
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const data = await authAPI.register(userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Clear any other related storage that might be causing persistence issues
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      // Reset state
      setUser(null);
      setPasswordChangeRequired(false);
      setLoading(false);
      
      // Log the logout
      console.log('User logged out, all auth data cleared');
      
      // Redirect to login page
      router.push('/login');
    }
  };

  const refreshProfile = async () => {
    try {
      const data = await authAPI.getProfile();
      const userData = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      console.log('Refreshed user profile:', userData);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      // If we get a 401 or 403, log the user out
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        await logout();
      }
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      await authAPI.changePassword(currentPassword, newPassword);
      
      // Update user data to indicate password has been changed
      if (user && user.first_login) {
        const updatedUser = { ...user, first_login: false };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setPasswordChangeRequired(false);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      let errorMessage = 'Failed to change password. Please try again.';
      
      if (error.response && error.response.data) {
        if (error.response.data.current_password) {
          errorMessage = 'Current password is incorrect';
        } else if (error.response.data.new_password) {
          errorMessage = error.response.data.new_password[0];
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
      }
      
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    refreshProfile,
    changePassword,
    passwordChangeRequired
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 