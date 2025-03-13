import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { styled, useTheme, alpha } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Fade from '@mui/material/Fade';
import useMediaQuery from '@mui/material/useMediaQuery';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArticleIcon from '@mui/icons-material/Article';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const StyledTextField = styled(TextField)(({ theme }) => ({
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
  marginBottom: theme.spacing(2),
}));

const StepButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.2),
  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(37, 99, 235, 0.15)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const CustomStepper = styled(Stepper)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .MuiStepLabel-root': {
    padding: theme.spacing(0, 1),
  },
  '& .MuiStepConnector-line': {
    height: 3,
    borderTopWidth: 3,
  },
  '& .MuiStepLabel-label': {
    marginTop: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem',
    },
  },
  '& .MuiStepIcon-root': {
    fontSize: 28,
    [theme.breakpoints.down('sm')]: {
      fontSize: 24,
    },
  },
  '& .MuiStepIcon-text': {
    fill: theme.palette.common.white,
    fontWeight: 'bold',
  },
}));

const InfoBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.light, 0.08),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
}));

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const steps = [
    { label: 'Account Details', description: 'Create your login credentials' },
    { label: 'Personal Information', description: 'Tell us about yourself' },
    { label: 'Confirmation', description: 'Review and complete registration' },
  ];
  
  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNext = () => {
    if (activeStep === 0) {
      // Validate first step
      if (!formData.username || !formData.email || !formData.password) {
        setError('All fields are required');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
    } else if (activeStep === 1) {
      // Validate second step
      if (!formData.first_name || !formData.last_name) {
        setError('First name and last name are required');
        return;
      }
    } else if (activeStep === 2) {
      // Validate third step
      if (!termsAccepted) {
        setError('You must accept the terms and conditions');
        return;
      }
      handleSubmit();
      return;
    }
    
    setError('');
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  
  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData;
      const success = await register(userData);
      if (success) {
        router.push('/');
      } else {
        setError('Registration failed. Please try again with different credentials.');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Render form steps
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={true} timeout={500}>
            <Box>
              <StyledTextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" fontSize={isMobile ? "small" : "medium"} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <StyledTextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" fontSize={isMobile ? "small" : "medium"} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <StyledTextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" fontSize={isMobile ? "small" : "medium"} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePassword}
                        edge="end"
                        size={isMobile ? "small" : "medium"}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                helperText="Password must be at least 8 characters long"
              />
              
              <StyledTextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" fontSize={isMobile ? "small" : "medium"} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleToggleConfirmPassword}
                        edge="end"
                        size={isMobile ? "small" : "medium"}
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                helperText="Enter the same password again"
              />
            </Box>
          </Fade>
        );
      case 1:
        return (
          <Fade in={true} timeout={500}>
            <Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    required
                    id="first_name"
                    label="First Name"
                    name="first_name"
                    autoComplete="given-name"
                    value={formData.first_name}
                    onChange={handleChange}
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon color="action" fontSize={isMobile ? "small" : "medium"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    fullWidth
                    required
                    id="last_name"
                    label="Last Name"
                    name="last_name"
                    autoComplete="family-name"
                    value={formData.last_name}
                    onChange={handleChange}
                    size={isMobile ? "small" : "medium"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon color="action" fontSize={isMobile ? "small" : "medium"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );
      case 2:
        return (
          <Fade in={true} timeout={500}>
            <Box>
              <InfoBox elevation={0}>
                <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                  Account Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={5} sm={4}>
                    <Typography variant="body2" color="text.secondary">Username:</Typography>
                  </Grid>
                  <Grid item xs={7} sm={8}>
                    <Typography variant="body2" fontWeight="medium">{formData.username}</Typography>
                  </Grid>
                  <Grid item xs={5} sm={4}>
                    <Typography variant="body2" color="text.secondary">Email:</Typography>
                  </Grid>
                  <Grid item xs={7} sm={8}>
                    <Typography variant="body2" fontWeight="medium">{formData.email}</Typography>
                  </Grid>
                </Grid>

                <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                  Personal Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={5} sm={4}>
                    <Typography variant="body2" color="text.secondary">Name:</Typography>
                  </Grid>
                  <Grid item xs={7} sm={8}>
                    <Typography variant="body2" fontWeight="medium">
                      {formData.first_name} {formData.last_name}
                    </Typography>
                  </Grid>
                </Grid>
              </InfoBox>
              
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8125rem' : '0.875rem' }}>
                    I agree to the{' '}
                    <Link href="/terms" passHref>
                      <Typography
                        component="a"
                        variant="body2"
                        color="primary"
                        sx={{ 
                          fontWeight: 'medium', 
                          textDecoration: 'none',
                          fontSize: 'inherit',
                          '&:hover': { textDecoration: 'underline' } 
                        }}
                      >
                        Terms of Service
                      </Typography>
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" passHref>
                      <Typography
                        component="a"
                        variant="body2"
                        color="primary"
                        sx={{ 
                          fontWeight: 'medium', 
                          textDecoration: 'none',
                          fontSize: 'inherit',
                          '&:hover': { textDecoration: 'underline' } 
                        }}
                      >
                        Privacy Policy
                      </Typography>
                    </Link>
                  </Typography>
                }
              />
            </Box>
          </Fade>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <AuthLayout 
      title="Create your account" 
      subtitle="Register to start monitoring and managing your network performance"
    >
      <Fade in={error !== ''} timeout={300}>
        <Box sx={{ mb: error ? 3 : 0, height: error ? 'auto' : 0, overflow: 'hidden' }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: error ? 1 : 0,
                borderRadius: theme.shape.borderRadius,
                boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.15)}`,
                '& .MuiAlert-icon': {
                  color: theme.palette.error.main,
                }
              }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}
        </Box>
      </Fade>

      <Box sx={{ 
        maxWidth: { sm: '550px', xs: '100%' },
        mx: 'auto',
        mb: 3
      }}>
        <CustomStepper activeStep={activeStep} alternativeLabel={!isTablet}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="body2" fontWeight={activeStep === index ? 'bold' : 'regular'}>
                  {step.label}
                </Typography>
                {!isTablet && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {step.description}
                  </Typography>
                )}
              </StepLabel>
            </Step>
          ))}
        </CustomStepper>
      </Box>

      <Box sx={{ 
        maxWidth: { sm: '550px', xs: '100%' },
        mx: 'auto'
      }}>
        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            startIcon={<NavigateBeforeIcon />}
            size={isMobile ? "small" : "medium"}
            sx={{
              borderRadius: theme.shape.borderRadius,
              transition: 'all 0.2s',
              '&:hover:not(:disabled)': {
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                transform: 'translateX(-2px)',
              },
            }}
          >
            Back
          </Button>
          
          <StepButton
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={loading}
            size={isMobile ? "small" : "medium"}
            endIcon={activeStep === steps.length - 1 ? 
              <PersonAddAltIcon /> : 
              (loading ? null : <NavigateNextIcon />)}
          >
            {activeStep === steps.length - 1 ? 
              (loading ? <CircularProgress size={24} /> : 'Register') : 
              'Continue'}
          </StepButton>
        </Box>
      </Box>

      {activeStep === 0 && (
        <>
          <Divider sx={{ 
            my: { xs: 3, sm: 4 },
            width: '100%',
            maxWidth: { sm: '550px', xs: '100%' },
            mx: 'auto',
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
              OR
            </Typography>
          </Divider>
          
          <Fade in={true} timeout={700}>
            <Box sx={{ 
              textAlign: 'center',
              width: '100%',
              maxWidth: { sm: '550px', xs: '100%' },
              mx: 'auto',
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Already have an account?
              </Typography>
              
              <Button 
                component={Link} 
                href="/login" 
                variant="outlined" 
                size={isMobile ? "medium" : "large"} 
                fullWidth
                sx={{
                  borderRadius: theme.shape.borderRadius,
                  py: isMobile ? 0.8 : 1.2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    borderColor: theme.palette.primary.main,
                  }
                }}
              >
                Log In
              </Button>
            </Box>
          </Fade>
        </>
      )}
    </AuthLayout>
  );
};

export default Register; 