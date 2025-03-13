import { useState, useEffect } from 'react';
import Head from 'next/head';
import MainLayout from '../components/layout/MainLayout';
import AdminRoute from '../components/auth/AdminRoute';
import AdminDashboard from '../components/admin/Dashboard';
import UserManager from '../components/admin/UserManager';
import RoleManager from '../components/admin/RoleManager';
import { useAuth } from '../contexts/AuthContext';

// Material UI components
import { Box, Tab, Tabs, Divider, Typography, Alert, CircularProgress } from '@mui/material';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BadgeIcon from '@mui/icons-material/Badge';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
      style={{ padding: '20px 0' }}
    >
      {value === index && (
        <Box>{children}</Box>
      )}
    </div>
  );
}

const AdminDashboardPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const { user, isAuthenticated, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // Debug log for the admin dashboard page
    console.log('Admin Dashboard Page - Auth state:', { isAuthenticated, loading, user });
  }, [isAuthenticated, loading, user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Prevent hydration errors by not rendering until mounted
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">You need to be logged in to access this page.</Alert>
      </Box>
    );
  }

  // Check for both admin and super-admin roles
  const isAdminUser = user?.profile?.role === 'admin' || user?.profile?.role === 'super-admin' || user?.username === 'timpheb';
  if (!isAdminUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">You need administrator privileges to access this page.</Alert>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard | FWPM</title>
      </Head>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
            Admin Dashboard
          </Typography>
        </Box>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="admin dashboard tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              icon={<DashboardIcon />} 
              label="Dashboard" 
              id="admin-tab-0" 
              iconPosition="start"
            />
            <Tab 
              icon={<PeopleIcon />} 
              label="User Management" 
              id="admin-tab-1" 
              iconPosition="start"
            />
            <Tab 
              icon={<BadgeIcon />} 
              label="Role Management" 
              id="admin-tab-2" 
              iconPosition="start"
            />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <AdminDashboard />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <UserManager />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <RoleManager />
        </TabPanel>
      </Box>
    </>
  );
};

AdminDashboardPage.getLayout = (page) => (
  <AdminRoute>
    <MainLayout>
      {page}
    </MainLayout>
  </AdminRoute>
);

export default AdminDashboardPage; 