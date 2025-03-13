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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [apiStatus, setApiStatus] = useState('unknown');
  const [backendStatus, setBackendStatus] = useState({ checked: false, reachable: false, message: '' });
  const [directLoginResult, setDirectLoginResult] = useState(null);
  const [showTestingTools, setShowTestingTools] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Test direct backend connectivity
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
        }
      } catch (error) {
        console.error('>>> Backend connection test failed:', error);
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
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Check if email has @nbnco.com.au domain
    const isNbnEmail = email.toLowerCase().endsWith('@nbnco.com.au');
    
    if (!isNbnEmail) {
      setError('Only nbnco.com.au email domains are authorized to access this system');
      return;
    }
    
    // Set a default password for NBN users during auto-registration
    // This will be prompted to change on first login
    const defaultPassword = 'nbnDefaultPass2024!';
    
    try {
      // Call the login function from the auth context
      const result = await login(email, defaultPassword);
      
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
        setError('No response from server. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  
  // Test direct login to backend API
  const handleDirectLoginTest = async () => {
    setDirectTestLoading(true);
    setDirectTestResult(null);
    
    if (!email) {
      setError('Email is required for test');
      return;
    }
    
    try {
      const response = await fetch('/api/test-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const result = await response.json();
      
      setDirectTestResult({
        success: response.ok,
        status: response.status,
        data: result
      });
    } catch (error) {
      console.error('>>> Direct login test error:', error);
      setDirectTestResult({
        success: false,
        error: error.message
      });
    } finally {
      setDirectTestLoading(false);
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
                <strong>Backend server connection error:</strong> {backendStatus.message}
              </Typography>
              <Typography variant="body2" mt={1}>
                Please make sure the backend server is running at the configured URL.
              </Typography>
            </Alert>
          )}
          
          {apiStatus === 'disconnected' && (
            <Alert 
              severity="warning" 
              sx={{ 
                mb: { xs: 2, sm: 3 }, 
                borderRadius: 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              Cannot connect to the API server. Please check your network connection.
            </Alert>
          )}
          
          {apiStatus === 'error' && (
            <Alert 
              severity="warning" 
              sx={{ 
                mb: { xs: 2, sm: 3 }, 
                borderRadius: 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              The API server is experiencing issues. Please try again later.
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
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: { xs: 2, sm: 2.5 },
          }}>
            <Button 
              variant="text" 
              size="small" 
              onClick={() => setShowTestingTools(!showTestingTools)}
            >
              {showTestingTools ? 'Hide Testing Tools' : 'Show Testing Tools'}
            </Button>
            
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
          
          {showTestingTools && (
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              border: '1px dashed', 
              borderColor: 'divider',
              borderRadius: 1,
              backgroundColor: 'background.paper' 
            }}>
              <Typography variant="subtitle2" gutterBottom>
                Testing & Diagnostics
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom fontWeight="medium">
                  Backend Status: {backendStatus.checked ? 
                    (backendStatus.reachable ? 
                      '✅ Reachable' : 
                      '❌ Not Reachable - ' + backendStatus.message
                    ) : 
                    '⏳ Checking...'
                  }
                </Typography>
                <Typography variant="body2" gutterBottom fontWeight="medium">
                  API Status: {apiStatus === 'connected' ? 
                    '✅ Connected' : 
                    (apiStatus === 'disconnected' ? 
                      '❌ Disconnected' : 
                      (apiStatus === 'error' ? 
                        '⚠️ Error' : 
                        '⏳ Unknown'
                      )
                    )
                  }
                </Typography>
                
                {backendStatus.checked && !backendStatus.reachable && backendStatus.data?.network_diagnostics && (
                  <Box sx={{ mt: 1, mb: 1, p: 1, backgroundColor: 'error.light', borderRadius: 1, opacity: 0.8 }}>
                    <Typography variant="body2" sx={{ color: 'error.contrastText' }}>
                      {backendStatus.data.network_diagnostics.message}
                    </Typography>
                    <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                      {backendStatus.data.network_diagnostics.suggested_actions.map((action, i) => (
                        <li key={i}>
                          <Typography variant="caption" sx={{ color: 'error.contrastText' }}>
                            {action}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
              </Box>
              
              <Button 
                variant="outlined" 
                size="small" 
                onClick={handleDirectLoginTest}
                disabled={loading || !email}
                sx={{ mr: 1 }}
              >
                Test Direct Login
              </Button>
              
              <Button 
                variant="outlined" 
                size="small" 
                onClick={async () => {
                  try {
                    const response = await fetch('/api/token-debug');
                    const data = await response.json();
                    console.log('Token debug data:', data);
                    setDirectLoginResult({
                      type: 'token_debug',
                      ...data
                    });
                  } catch (err) {
                    console.error('Token debug error:', err);
                    setDirectLoginResult({
                      type: 'token_debug_error',
                      error: err.message
                    });
                  }
                }}
                sx={{ mr: 1 }}
              >
                Debug Token
              </Button>
              
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
              
              {directLoginResult && (
                <Box sx={{ mt: 2, p: 1, bgcolor: 'background.default', borderRadius: 1, maxHeight: 150, overflow: 'auto' }}>
                  <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.7rem' }}>
                    {JSON.stringify(directLoginResult, null, 2)}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          
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