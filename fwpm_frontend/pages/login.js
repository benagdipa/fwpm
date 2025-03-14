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
      setError('Email is required');
      setLoading(false);
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    // Check if email has @nbnco.com.au domain
    const isNbnEmail = email.toLowerCase().endsWith('@nbnco.com.au');
    
    if (!isNbnEmail) {
      setError('Only nbnco.com.au email domains are authorized to access this system');
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
        // Handle login failure
        if (result.message) {
          setError(result.message);
        } else {
          setError('Login failed. Please check your credentials and try again.');
        }
      }
    } catch (error) {
      // Handle unexpected errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data && error.response.data.detail) {
          setError(error.response.data.detail);
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
          
          setError(errorMessages.join('. '));
        } else {
          setError('Server error. Please try again later.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('Unable to connect to the server. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An error occurred. Please try again.');
      }
      
      // Log the error for admins but don't show to users
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