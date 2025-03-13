import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../lib/api';

// Material UI components
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme,
  alpha
} from '@mui/material';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import EngineeringIcon from '@mui/icons-material/Engineering';

// Styled components
import { styled } from '@mui/material/styles';

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
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: theme.transitions.create(['box-shadow']),
  overflow: 'hidden',
  height: '100%',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
}));

const ProfilePage = () => {
  const { user, loading: authLoading, passwordChangeRequired, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    department: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { passwordChange } = router.query;

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        department: user.profile?.department || '',
      });
    }
    
    // Check if password change is required from URL param or context
    if (passwordChange === 'required' || passwordChangeRequired) {
      setActiveTab('security');
    }
  }, [user, passwordChange, passwordChangeRequired]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await authAPI.updateProfile({
        username: profileData.username,
        email: profileData.email,
        first_name: profileData.first_name,
        last_name: profileData.last_name
      });
      
      await refreshProfile();
      
      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
      
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update profile. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setSuccess('');
    
    // Validate passwords
    if (!passwordData.current_password) {
      setError('Current password is required');
      return;
    }
    
    if (!passwordData.new_password) {
      setError('New password is required');
      return;
    }
    
    if (passwordData.new_password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await changePassword(
        passwordData.current_password,
        passwordData.new_password
      );
      
      if (result.success) {
        setSuccess('Password changed successfully');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
        
        // If this was a required password change, redirect to dashboard
        if (passwordChangeRequired) {
          setTimeout(() => {
            router.push('/');
          }, 2000);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to change password');
      console.error('Error changing password:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || ''
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Security tab
  const renderSecurityTab = () => {
    return (
      <Box sx={{ py: 2 }}>
        <Typography variant="h6" gutterBottom>
          Password Settings
        </Typography>
        
        {passwordChangeRequired && (
          <Alert 
            severity="info" 
            sx={{ mb: 3 }}
          >
            You need to change your password before continuing to use the platform.
          </Alert>
        )}
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert 
            severity="success" 
            sx={{ mb: 3 }}
            onClose={() => setSuccess('')}
          >
            {success}
          </Alert>
        )}
        
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Box component="form" noValidate onSubmit={handlePasswordSubmit}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Current Password"
                  name="current_password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  disabled={loading}
                  size={isMobile ? "small" : "medium"}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="New Password"
                  name="new_password"
                  type="password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  disabled={loading}
                  size={isMobile ? "small" : "medium"}
                  helperText="Password must be at least 8 characters long"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirm_password"
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  disabled={loading}
                  size={isMobile ? "small" : "medium"}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  mt: { xs: 1, sm: 2 }, 
                  gap: { xs: 1, sm: 2 },
                  flexDirection: isMobile ? 'column' : 'row'
                }}>
                  <StyledButton
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => setActiveTab('general')}
                    disabled={loading || passwordChangeRequired}
                    size={isMobile ? "small" : "medium"}
                    fullWidth={isMobile}
                    sx={{ 
                      borderWidth: 1.5,
                      order: isMobile ? 2 : 1
                    }}
                  >
                    Cancel
                  </StyledButton>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handlePasswordSubmit}
                    disabled={loading}
                    size={isMobile ? "small" : "medium"}
                    fullWidth={isMobile}
                    sx={{ 
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                      order: isMobile ? 1 : 2
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
                  </StyledButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    );
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, px: { xs: 1, sm: 2, md: 3 } }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          fontWeight: 600
        }}
      >
        User Profile
      </Typography>
      
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} md={4}>
          <ProfileCard>
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              p: { xs: 2, sm: 3 },
              height: '100%'
            }}>
              <Avatar 
                sx={{ 
                  width: { xs: 100, sm: 120 }, 
                  height: { xs: 100, sm: 120 }, 
                  mb: { xs: 1.5, sm: 2 },
                  bgcolor: user?.profile?.role === 'admin' ? 'primary.main' : 'secondary.main',
                  fontSize: { xs: '2.5rem', sm: '3rem' },
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              >
                {user.first_name ? user.first_name[0] : user.username[0]}
              </Avatar>
              
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  fontWeight: 600,
                  textAlign: 'center'
                }}
              >
                {`${user.first_name || ''} ${user.last_name || ''}`}
              </Typography>
              
              <Typography 
                variant="body1" 
                color="text.secondary" 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  mb: { xs: 1, sm: 1.5 }
                }}
              >
                @{user.username}
              </Typography>
              
              <Chip
                icon={
                  user?.profile?.role === 'super-admin' ? <AdminPanelSettingsIcon /> :
                  user?.profile?.role === 'admin' ? <AdminPanelSettingsIcon /> :
                  user?.profile?.role === 'manager' ? <SupervisorAccountIcon /> :
                  user?.profile?.role === 'engineer' ? <EngineeringIcon /> :
                  <PersonIcon />
                }
                label={
                  user?.profile?.role === 'super-admin' ? 'Super Administrator' :
                  user?.profile?.role === 'admin' ? 'Administrator' :
                  user?.profile?.role === 'manager' ? 'Manager' :
                  user?.profile?.role === 'engineer' ? 'Engineer' :
                  'Standard User'
                }
                color={
                  user?.profile?.role === 'super-admin' ? 'error' :
                  user?.profile?.role === 'admin' ? 'primary' :
                  user?.profile?.role === 'manager' ? 'warning' :
                  user?.profile?.role === 'engineer' ? 'info' :
                  'default'
                }
                sx={{ 
                  mt: { xs: 0.5, sm: 1 },
                  fontWeight: 500,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              />
              
              {user?.profile?.department && (
                <Chip
                  label={user.profile.department}
                  variant="outlined"
                  sx={{ 
                    mt: { xs: 1, sm: 1.5 },
                    fontWeight: 500,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                />
              )}
              
              <Box sx={{ mt: { xs: 2, sm: 3 }, width: '100%' }}>
                <StyledButton 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<LockIcon />}
                  onClick={() => setActiveTab('security')}
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    py: { xs: 1, sm: 1.2 },
                    borderWidth: 1.5
                  }}
                >
                  Change Password
                </StyledButton>
              </Box>
            </CardContent>
          </ProfileCard>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <ProfileCard>
            <CardHeader
              title={
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  {activeTab === 'security' ? 'Security Settings' : 'Profile Information'}
                </Typography>
              }
              action={
                !editMode && activeTab !== 'security' ? (
                  <StyledButton 
                    startIcon={<EditIcon />} 
                    onClick={() => setEditMode(true)}
                    size={isMobile ? "small" : "medium"}
                    variant="outlined"
                    sx={{ 
                      borderWidth: 1.5,
                      px: { xs: 1.5, sm: 2 }
                    }}
                  >
                    Edit Profile
                  </StyledButton>
                ) : null
              }
              sx={{ 
                px: { xs: 2, sm: 3 }, 
                py: { xs: 1.5, sm: 2 } 
              }}
            />
            <Divider />
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              {activeTab === 'security' ? renderSecurityTab() : (
                <Box component="form" noValidate>
                  <Grid container spacing={{ xs: 2, sm: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={profileData.username}
                        onChange={handleProfileChange}
                        disabled={!editMode || loading}
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        disabled={!editMode || loading}
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="First Name"
                        name="first_name"
                        value={profileData.first_name}
                        onChange={handleProfileChange}
                        disabled={!editMode || loading}
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Last Name"
                        name="last_name"
                        value={profileData.last_name}
                        onChange={handleProfileChange}
                        disabled={!editMode || loading}
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    
                    {editMode && (
                      <Grid item xs={12}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'flex-end', 
                          mt: { xs: 1, sm: 2 }, 
                          gap: { xs: 1, sm: 2 },
                          flexDirection: isMobile ? 'column' : 'row'
                        }}>
                          <StyledButton
                            variant="outlined"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={cancelEdit}
                            disabled={loading}
                            size={isMobile ? "small" : "medium"}
                            fullWidth={isMobile}
                            sx={{ 
                              borderWidth: 1.5,
                              order: isMobile ? 2 : 1
                            }}
                          >
                            Cancel
                          </StyledButton>
                          <StyledButton
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={handleUpdateProfile}
                            disabled={loading}
                            size={isMobile ? "small" : "medium"}
                            fullWidth={isMobile}
                            sx={{ 
                              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                              order: isMobile ? 1 : 2
                            }}
                          >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                          </StyledButton>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </ProfileCard>
          
          <ProfileCard sx={{ mt: { xs: 2, sm: 3 } }}>
            <CardHeader 
              title={
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  Account Information
                </Typography>
              }
              sx={{ 
                px: { xs: 2, sm: 3 }, 
                py: { xs: 1.5, sm: 2 } 
              }}
            />
            <Divider />
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      mb: 0.5
                    }}
                  >
                    Account Created
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      fontWeight: 500
                    }}
                  >
                    {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      mb: 0.5
                    }}
                  >
                    Account Status
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      fontWeight: 500
                    }}
                  >
                    Active
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      mb: 0.5
                    }}
                  >
                    Role
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      fontWeight: 500
                    }}
                  >
                    {user?.profile?.role === 'super-admin' ? 'Super Administrator' :
                     user?.profile?.role === 'admin' ? 'Administrator' :
                     user?.profile?.role === 'manager' ? 'Manager' :
                     user?.profile?.role === 'engineer' ? 'Engineer' :
                     'Standard User'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      mb: 0.5
                    }}
                  >
                    Department
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      fontWeight: 500
                    }}
                  >
                    {user?.profile?.department || 'Not assigned'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </ProfileCard>
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: 1
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

ProfilePage.getLayout = (page) => (
  <ProtectedRoute>
    <MainLayout>
      {page}
    </MainLayout>
  </ProtectedRoute>
);

export default ProfilePage; 