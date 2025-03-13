import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, Card, CardContent, CardActionArea } from '@mui/material';
import { useRouter } from 'next/router';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SpeedIcon from '@mui/icons-material/Speed';
import BuildIcon from '@mui/icons-material/Build';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

// Dashboard stats card component
const StatsCard = ({ title, value, icon, color, onClick }) => (
  <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.03)' } }}>
    <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Box 
            sx={{ 
              bgcolor: `${color}.light`, 
              color: `${color}.main`,
              p: 1.5,
              borderRadius: 2,
              mr: 2
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h5" component="div" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </CardActionArea>
  </Card>
);

const AdminDashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    users: 0,
    activeUsers: 0,
    implementationItems: 0,
    performanceMetrics: 0,
    configTools: 0,
    wntdItems: 0
  });

  useEffect(() => {
    // In a real app, fetch these stats from the API
    // For now, we'll simulate with random numbers
    setStats({
      users: Math.floor(Math.random() * 50) + 10,
      activeUsers: Math.floor(Math.random() * 20) + 5,
      implementationItems: Math.floor(Math.random() * 100) + 50,
      performanceMetrics: Math.floor(Math.random() * 200) + 100,
      configTools: Math.floor(Math.random() * 30) + 10,
      wntdItems: Math.floor(Math.random() * 40) + 20
    });
  }, []);

  const dashboardItems = [
    { 
      title: 'Total Users', 
      value: stats.users, 
      icon: <PeopleIcon fontSize="large" />, 
      color: 'primary',
      onClick: () => router.push('/user-management')
    },
    { 
      title: 'Active Users', 
      value: stats.activeUsers, 
      icon: <PeopleIcon fontSize="large" />, 
      color: 'success',
      onClick: () => router.push('/user-management')
    },
    { 
      title: 'Implementation Items', 
      value: stats.implementationItems, 
      icon: <TrackChangesIcon fontSize="large" />, 
      color: 'secondary',
      onClick: () => router.push('/implementation-tracker')
    },
    { 
      title: 'Performance Metrics', 
      value: stats.performanceMetrics, 
      icon: <SpeedIcon fontSize="large" />, 
      color: 'info',
      onClick: () => router.push('/network-performance')
    },
    { 
      title: 'Config Tools', 
      value: stats.configTools, 
      icon: <BuildIcon fontSize="large" />, 
      color: 'warning',
      onClick: () => router.push('/config-tools')
    },
    { 
      title: 'WNTD Items', 
      value: stats.wntdItems, 
      icon: <AssessmentIcon fontSize="large" />, 
      color: 'error',
      onClick: () => router.push('/wntd-tracker')
    }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Overview
        </Typography>
        <Grid container spacing={3}>
          {dashboardItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <StatsCard 
                title={item.title} 
                value={item.value} 
                icon={item.icon} 
                color={item.color} 
                onClick={item.onClick}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No recent activities to display.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Box 
                sx={{ 
                  bgcolor: 'success.light', 
                  color: 'success.main',
                  p: 1,
                  borderRadius: 1,
                  mr: 2,
                  display: 'inline-flex'
                }}
              >
                <SettingsIcon />
              </Box>
              <Typography>
                All systems operational
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard; 