import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // After loading, check if user is authenticated and has admin role
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        const isAdminUser = user?.profile?.role === 'admin' || user?.profile?.role === 'super-admin' || user?.username === 'timpheb';
        if (!isAdminUser) {
          setError("Access denied: Admin privileges required");
          // Don't redirect immediately, show an error message
        }
      }
    }
  }, [loading, isAuthenticated, user, router]);

  // Prevent hydration errors by not rendering until mounted
  if (!mounted) {
    return null;
  }

  // If still loading, show loading spinner
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, the useEffect will redirect to login
  if (!isAuthenticated) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If authenticated but not admin, show access denied
  const isAdminUser = user?.profile?.role === 'admin' || user?.profile?.role === 'super-admin' || user?.username === 'timpheb';
  if (!isAdminUser) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          p: 3
        }}
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
          <Typography variant="h5" component="h1" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" paragraph>
            You don't have permission to access this page. 
            Admin privileges are required.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => router.push('/')}
            sx={{ mt: 2 }}
          >
            Go to Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  // If authenticated and admin, render the protected content
  return children;
};

export default AdminRoute; 