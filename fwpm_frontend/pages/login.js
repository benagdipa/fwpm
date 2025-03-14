import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import { styled, alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import EmailIcon from '@mui/icons-material/Email';

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['box-shadow', 'border-color']),
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused': {
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
    },
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.2),
  marginTop: theme.spacing(1),
  boxShadow: '0 8px 16px rgba(37, 99, 235, 0.1)',
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 20px rgba(37, 99, 235, 0.15)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

// Create common error messages with solutions
const ERROR_MESSAGES = {
  "no_email": {
    title: "Email Required",
    message: "Please enter your NBN email address to continue.",
    solution: "Enter your full email address (e.g., username@nbnco.com.au)."
  },
  "invalid_email": {
    title: "Invalid Email Format",
    message: "The email address you entered is not in a valid format.",
    solution: "Please check your email for typos and try again."
  },
  "not_nbn_email": {
    title: "Domain Not Authorized",
    message: "Only nbnco.com.au email domains are authorized to access this system.",
    solution: "Please use your NBN Co email address to log in."
  },
  "invalid_credentials": {
    title: "Login Failed",
    message: "We couldn't log you in with the information provided.",
    solution: "Please check your email and try again. If you're a new user, an account will be created automatically."
  },
  "server_error": {
    title: "Server Error",
    message: "We encountered an error while trying to log you in.",
    solution: "Please try again later or contact IT support if the issue persists."
  },
  "connection_error": {
    title: "Connection Error",
    message: "Unable to connect to the server at this time.",
    solution: "Please check your internet connection and try again. If the problem persists, the server may be temporarily down."
  },
  "profile_fetch_error": {
    title: "Authentication Issue",
    message: "Your login was successful, but we couldn't fetch your profile information.",
    solution: "This could be a temporary server issue. Please try again or contact support if the problem persists."
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ checked: false, reachable: false, message: '' });
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Test direct backend connectivity (hidden from users)
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        const response = await fetch('/api/health-check');
        const data = await response.json();
        
        if (data.backend && data.backend.reachable) {
          setBackendStatus({
            checked: true,
            reachable: true,
            message: 'Backend server is reachable',
            data: data
          });
        } else {
          setBackendStatus({
            checked: true,
            reachable: false,
            message: data.backend?.error || 'Cannot connect to backend server',
            data: data
          });
          // Log connection error for admin monitoring, but don't show to users
          console.error('Backend connection error:', data.backend?.error || 'Cannot connect to backend server');
        }
      } catch (error) {
        console.error('Backend connection test failed:', error);
        setBackendStatus({
          checked: true,
          reachable: false,
          message: 'Error testing backend connection',
          error: error.message
        });
      }
    };
    
    testBackendConnection();
  }, []);
  
  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!email) {
      setError(
        <Box>
          <Typography fontWeight="bold" mb={0.5}>{ERROR_MESSAGES.no_email.title}</Typography>
          <Typography variant="body2">{ERROR_MESSAGES.no_email.message}</Typography>
          <Typography variant="body2" fontStyle="italic" mt={1}>{ERROR_MESSAGES.no_email.solution}</Typography>
        </Box>
      );
      setLoading(false);
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(
        <Box>
          <Typography fontWeight="bold" mb={0.5}>{ERROR_MESSAGES.invalid_email.title}</Typography>
          <Typography variant="body2">{ERROR_MESSAGES.invalid_email.message}</Typography>
          <Typography variant="body2" fontStyle="italic" mt={1}>{ERROR_MESSAGES.invalid_email.solution}</Typography>
        </Box>
      );
      setLoading(false);
      return;
    }
    
    // Check if email has @nbnco.com.au domain
    const isNbnEmail = email.toLowerCase().endsWith('@nbnco.com.au');
    
    if (!isNbnEmail) {
      setError(
        <Box>
          <Typography fontWeight="bold" mb={0.5}>{ERROR_MESSAGES.not_nbn_email.title}</Typography>
          <Typography variant="body2">{ERROR_MESSAGES.not_nbn_email.message}</Typography>
          <Typography variant="body2" fontStyle="italic" mt={1}>{ERROR_MESSAGES.not_nbn_email.solution}</Typography>
        </Box>
      );
      setLoading(false);
      return;
    }
    
    try {
      // Call the login function from the auth context with email only
      const result = await login(email);
      
      if (result.success) {
        // Redirect to dashboard on successful login
        router.push('/');
      } else {
        // Handle login failure with friendly message
        if (result.errorType === 'profile_fetch_error') {
          console.error('Login failed due to profile fetch error - showing friendly message to user');
          setError(
            <Box>
              <Typography fontWeight="bold" mb={0.5}>{ERROR_MESSAGES.profile_fetch_error.title}</Typography>
              <Typography variant="body2">{result.message || ERROR_MESSAGES.profile_fetch_error.message}</Typography>
              <Typography variant="body2" fontStyle="italic" mt={1}>{ERROR_MESSAGES.profile_fetch_error.solution}</Typography>
            </Box>
          );
        } else if (result.message) {
          setError(
            <Box>
              <Typography fontWeight="bold" mb={0.5}>{ERROR_MESSAGES.invalid_credentials.title}</Typography>
              <Typography variant="body2">{result.message}</Typography>
              <Typography variant="body2" fontStyle="italic" mt={1}>{ERROR_MESSAGES.invalid_credentials.solution}</Typography>
            </Box>
          );
        } else {
          setError(
            <Box>
              <Typography fontWeight="bold" mb={0.5}>{ERROR_MESSAGES.invalid_credentials.title}</Typography>
              <Typography variant="body2">{ERROR_MESSAGES.invalid_credentials.message}</Typography>
              <Typography variant="body2" fontStyle="italic" mt={1}>{ERROR_MESSAGES.invalid_credentials.solution}</Typography>
            </Box>
          );
        }
      }
    } catch (error) {
      // Handle unexpected errors with friendly messages
      if (error.response) {
        // The request was made and the server responded with a status code outside the 2xx range
        let errorMessage = '';
        
        // Check for 401 Unauthorized during profile fetch (common authentication issue)
        if (error.response.status === 401 && error.stack && error.stack.includes('getProfile')) {
          setError(
            <Box>
              <Typography fontWeight="bold" mb={0.5}>{ERROR_MESSAGES.profile_fetch_error.title}</Typography>
              <Typography variant="body2">{ERROR_MESSAGES.profile_fetch_error.message}</Typography>
              <Typography variant="body2" fontStyle="italic" mt={1}>{ERROR_MESSAGES.profile_fetch_error.solution}</Typography>
            </Box>
          );
        } else if (error.response.data && error.response.data.detail) {
          errorMessage = error.response.data.detail;
          
          setError(
            <Box>
              <Typography fontWeight="bold" mb={0.5}>{ERROR_MESSAGES.server_error.title}</Typography>
              <Typography variant="body2">{errorMessage}</Typography>
              <Typography variant="body2" fontStyle="italic" mt={1}>{ERROR_MESSAGES.server_error.solution}</Typography>
            </Box>
          );
        } else if (error.response.data && typeof error.response.data === 'object') {
          // Extract error messages from response data
          const errorMessages = [];
          Object.keys(error.response.data).forEach(key => {
            const value = error.response.data[key];
            if (Array.isArray(value)) {
              errorMessages.push(`${key}: ${value.join(', ')}`);
            } else {
              errorMessages.push(`${key}: ${value}`);
            }
          });
          
          errorMessage = errorMessages.join('. ');
          
          setError(
            <Box>
              <Typography fontWeight="bold" mb={0.5}>{ERROR_MESSAGES.server_error.title}</Typography>
              <Typography variant="body2">{errorMessage}</Typography>
              <Typography variant="body2" fontStyle="italic" mt={1}>{ERROR_MESSAGES.server_error.solution}</Typography>
            </Box>
          );
        } else {
          errorMessage = ERROR_MESSAGES.server_error.message;
        }
        
        // Log the error for admins but don't show sensitive details to users
        console.error('Login error:', error);
      } else if (error.request) {
        // The request was made but no response was received
        setError(
          <Box>
            <Typography fontWeight="bold" mb={0.5}>{ERROR_MESSAGES.connection_error.title}</Typography>
            <Typography variant="body2">{ERROR_MESSAGES.connection_error.message}</Typography>
            <Typography variant="body2" fontStyle="italic" mt={1}>{ERROR_MESSAGES.connection_error.solution}</Typography>
          </Box>
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(
          <Box>
            <Typography fontWeight="bold" mb={0.5}>{ERROR_MESSAGES.server_error.title}</Typography>
            <Typography variant="body2">An unexpected error occurred: {error.message}</Typography>
            <Typography variant="body2" fontStyle="italic" mt={1}>{ERROR_MESSAGES.server_error.solution}</Typography>
          </Box>
        );
      }
      
      // Log the error for admins but don't show sensitive details to users
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthLayout 
      title="Log in to FWPM" 
      subtitle="Enter your NBN email to access the platform"
    >
      <Fade in={true} timeout={700}>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {error && (
            <Slide direction="down" in={!!error}>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: { xs: 2, sm: 3 }, 
                  borderRadius: 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  '& .MuiAlert-message': {
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }
                }}
              >
                {error}
              </Alert>
            </Slide>
          )}
          
          {/* Backend error alert with user-friendly message */}
          {backendStatus.checked && !backendStatus.reachable && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: { xs: 2, sm: 3 }, 
                borderRadius: 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <Typography variant="body2">
                We're currently experiencing technical difficulties.
              </Typography>
              <Typography variant="body2" mt={1}>
                Please try again later or contact support if the issue persists.
              </Typography>
            </Alert>
          )}
          
          <StyledTextField
            fullWidth
            id="email"
            name="email"
            label="NBN Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: { xs: 2, sm: 2.5 } }}
            placeholder="yourname@nbnco.com.au"
          />
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            alignItems: 'center',
            mb: { xs: 2, sm: 2.5 },
          }}>
            <Link href="/forgot-password" passHref>
              <Typography 
                component="span" 
                variant="body2" 
                color="primary"
                sx={{ 
                  fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  textDecoration: 'none', 
                  '&:hover': { textDecoration: 'underline' },
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Need help?
              </Typography>
            </Link>
          </Box>
          
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<LoginIcon />}
            disabled={loading}
            size={isMobile ? "medium" : "large"}
            sx={{ mt: { xs: 1, sm: 2 } }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Log In with NBN Email'
            )}
          </SubmitButton>
          
          <Typography 
            variant="body2" 
            color="text.secondary"
            align="center"
            sx={{ 
              mt: { xs: 2, sm: 3 },
              fontSize: { xs: '0.8125rem', sm: '0.875rem' }
            }}
          >
            First-time users will be prompted to set a password
          </Typography>
        </Box>
      </Fade>
    </AuthLayout>
  );
};

export default Login; 