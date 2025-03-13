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
        // Try to login with proper parameter format (username and password)
        console.log('=== AuthContext: attempting login API call');
        const data = await authAPI.login({ username, password });
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
          const profileData = await authAPI.getProfile();
          console.log('=== AuthContext: profile data received:', profileData);
          
          const userData = { ...data.user, ...profileData };
          console.log('=== AuthContext: combined user data:', userData);
          
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
          return true;
        } catch (profileError) {
          console.error('=== AuthContext: Error fetching profile after login:', profileError);
          
          // Even if profile fetch fails, we can still log the user in with basic data
          console.log('=== AuthContext: Using basic user data from login response');
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);
          
          console.log('=== AuthContext: login partially successful (no profile data)');
          return true;
        }
      } catch (loginError) {
        console.error('=== AuthContext: login attempt failed:', loginError);
        
        if (loginError.response) {
          console.error('=== AuthContext: login error response status:', loginError.response.status);
          console.error('=== AuthContext: login error response data:', loginError.response.data);
        }
        
        // If login fails with 401 or 400, try auto-registration for NBN emails
        if (loginError.response && (loginError.response.status === 401 || loginError.response.status === 400)) {
          console.log('=== AuthContext: attempting auto-registration for NBN email');
          
          // Extract names from email
          let firstName = '';
          let lastName = '';
          
          // Parse name from the combined format email (e.g., johnsmith@nbnco.com.au)
          // Since there's no delimiter, we'll need to use a different approach
          
          // Common last name prefixes to help with splitting
          const commonLastNamePrefixes = [
            'smith', 'jones', 'williams', 'brown', 'wilson', 'taylor', 'johnson', 
            'white', 'martin', 'anderson', 'thompson', 'nguyen', 'thomas', 'walker', 
            'harris', 'lee', 'ryan', 'robinson', 'kelly', 'king', 'davis', 'wright', 
            'green', 'evans', 'wood', 'clarke', 'roberts', 'hall', 'jackson', 'allen',
            'scott', 'hill', 'young', 'morris', 'cook', 'bell', 'cooper', 'morgan',
            'parker'
          ];
          
          // Try to find a known last name in the username
          let splitIndex = -1;
          for (const prefix of commonLastNamePrefixes) {
            const index = username.toLowerCase().indexOf(prefix);
            if (index > 0) {
              splitIndex = index;
              break;
            }
          }
          
          if (splitIndex > 0) {
            // If we found a likely last name
            firstName = username.substring(0, splitIndex);
            lastName = username.substring(splitIndex);
          } else {
            // If we couldn't identify a clear split, use a simple approach:
            // If username is longer than 5 characters, take first half as first name and second half as last name
            // Otherwise, use the whole string as first name
            if (username.length > 5) {
              const middle = Math.floor(username.length / 2);
              firstName = username.substring(0, middle);
              lastName = username.substring(middle);
            } else {
              firstName = username;
              lastName = ""; // Empty last name if we can't determine it
            }
          }
          
          // Capitalize first letter of names
          firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
          if (lastName) {
            lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
          }
          
          // Register the new user
          const userData = {
            username,
            email,
            password: password, // Use the provided default password initially
            first_name: firstName,
            last_name: lastName,
            is_active: true
          };
          
          console.log('=== AuthContext: registering new user with data:', { ...userData, password: '[REDACTED]' });
          
          try {
            console.log('=== AuthContext: calling register API');
            const registerData = await authAPI.register(userData);
            console.log('=== AuthContext: register API call successful, response:', registerData);
            
            // Store token immediately after registration
            console.log('=== AuthContext: storing token in localStorage');
            localStorage.setItem('token', registerData.token);
            
            try {
              // Get the full profile after registration
              console.log('=== AuthContext: fetching user profile after registration');
              const profileData = await authAPI.getProfile();
              console.log('=== AuthContext: profile data received after registration:', profileData);
              
              const newUserData = { ...registerData.user, ...profileData, first_login: true };
              console.log('=== AuthContext: combined new user data:', newUserData);
              
              console.log('=== AuthContext: storing user data in localStorage');
              localStorage.setItem('user', JSON.stringify(newUserData));
              
              console.log('=== AuthContext: updating user state');
              setUser(newUserData);
              setPasswordChangeRequired(true);
              
              console.log('=== AuthContext: auto-registration successful');
              return true;
            } catch (profileError) {
              console.error('=== AuthContext: Error fetching profile after registration:', profileError);
              
              // Even if profile fetch fails, we can still log the user in with basic data
              console.log('=== AuthContext: Using basic user data from registration response');
              const basicUserData = { ...registerData.user, first_login: true };
              localStorage.setItem('user', JSON.stringify(basicUserData));
              setUser(basicUserData);
              setPasswordChangeRequired(true);
              
              console.log('=== AuthContext: auto-registration partially successful (no profile data)');
              return true;
            }
          } catch (registerError) {
            console.error('=== AuthContext: auto-registration failed:', registerError);
            
            if (registerError.response) {
              console.error('=== AuthContext: registration error response status:', registerError.response.status);
              const responseData = registerError.response.data;
              console.error('=== AuthContext: registration error response data:', responseData);
              
              if (responseData) {
                if (responseData.email && responseData.email.includes('already exists')) {
                  return { success: false, message: 'This email is already registered. Please use the password reset option if you forgot your password.' };
                }
                
                if (responseData.username && responseData.username.includes('already exists')) {
                  return { success: false, message: 'This username is already taken. Please contact support for assistance.' };
                }
                
                if (responseData.password) {
                  return { success: false, message: `Password error: ${responseData.password}` };
                }
                
                // Extract any error message available
                for (const key in responseData) {
                  if (Array.isArray(responseData[key])) {
                    return { success: false, message: responseData[key].join('. ') };
                  } else if (typeof responseData[key] === 'string') {
                    return { success: false, message: responseData[key] };
                  }
                }
              }
            }
            
            return { success: false, message: 'Registration failed. Please contact support.' };
          }
        }
        
        // Check for specific error messages in the login error
        if (loginError.response && loginError.response.data) {
          const data = loginError.response.data;
          
          if (data.non_field_errors) {
            return { success: false, message: data.non_field_errors.join('. ') };
          }
          
          if (data.detail) {
            return { success: false, message: data.detail };
          }
          
          // Try to extract any error message
          const errorMessages = [];
          for (const key in data) {
            if (Array.isArray(data[key])) {
              errorMessages.push(...data[key]);
            } else if (typeof data[key] === 'string') {
              errorMessages.push(data[key]);
            }
          }
          
          if (errorMessages.length > 0) {
            return { success: false, message: errorMessages.join('. ') };
          }
        }
        
        throw loginError;
      }
    } catch (error) {
      console.error('=== AuthContext: login/registration unhandled error:', error);
      return { success: false, message: 'An unexpected error occurred. Please try again later.' };
    } finally {
      console.log('=== AuthContext: login process complete, setting loading to false');
      setLoading(false);
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setPasswordChangeRequired(false);
      setLoading(false);
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