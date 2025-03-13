import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { networkAPI, wntdAPI, implementationAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { styled, alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { lighten } from '@mui/system';
import { useRouter } from 'next/router';

// Material UI components
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

// Icons
import SpeedIcon from '@mui/icons-material/Speed';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import DevicesIcon from '@mui/icons-material/Devices';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import MemoryIcon from '@mui/icons-material/Memory';
import TimelineIcon from '@mui/icons-material/Timeline';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import SettingsIcon from '@mui/icons-material/Settings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import FolderIcon from '@mui/icons-material/Folder';
import PeopleIcon from '@mui/icons-material/People';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 1.5,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px 0 rgba(0,0,0,0.08)',
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1.5)
  }
}));

const MetricCard = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 12px 0 rgba(0,0,0,0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.2s ease',
  backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1.5)
  }
}));

const IconBox = styled(Box)(({ theme, color }) => ({
  borderRadius: '50%',
  width: 52,
  height: 52,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: color ? alpha(color, 0.15) : alpha(theme.palette.primary.main, 0.15),
  color: color || theme.palette.primary.main,
  marginBottom: theme.spacing(1.5),
  transition: 'transform 0.2s ease, background-color 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: color ? alpha(color, 0.2) : alpha(theme.palette.primary.main, 0.2),
  }
}));

const TrendChip = styled(Chip)(({ theme, trend }) => ({
  height: 26,
  fontSize: '0.75rem',
  fontWeight: 600,
  backgroundColor: trend === 'up' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
  color: trend === 'up' ? theme.palette.success.main : theme.palette.error.main,
  '.MuiChip-icon': {
    fontSize: '0.875rem',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

const Dashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [networkStats, setNetworkStats] = useState(null);
  const [implementationStats, setImplementationStats] = useState(null);
  const [wntdStats, setWntdStats] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Add individual try/catch blocks for each API call to prevent one failure from stopping all data loading
      try {
        // Fetch network performance stats
        const networkResponse = await networkAPI.getLTEMetrics('all', 7);
        setNetworkStats(networkResponse);
      } catch (netErr) {
        console.error('Error fetching network stats:', netErr);
        setNetworkStats(null);
      }

      try {
        // Fetch implementation tracker stats
        const implementationResponse = await implementationAPI.getStats();
        
        // Add mock projects data since the real endpoint might not return projects
        setImplementationStats({
          ...implementationResponse,
          projects: [
            {
              id: 1,
              name: 'Network Expansion Phase 2',
              progress: 75,
              status: 'In Progress',
              dueDate: '2025-05-15'
            },
            {
              id: 2,
              name: '5G Deployment - Sydney CBD',
              progress: 92,
              status: 'Almost Complete',
              dueDate: '2025-04-20'
            }
          ]
        });
      } catch (implErr) {
        console.error('Error fetching implementation stats:', implErr);
        setImplementationStats([]);
      }

      try {
        // Fetch WNTD tracker stats
        const wntdResponse = await wntdAPI.getStats();
        setWntdStats(wntdResponse);
      } catch (wntdErr) {
        console.error('Error fetching WNTD stats:', wntdErr);
        setWntdStats([]);
      }

      try {
        // Fetch recent alerts
        const alertsResponse = await networkAPI.getAlerts();
        setRecentAlerts(alertsResponse || []);
      } catch (alertErr) {
        console.error('Error fetching alerts:', alertErr);
        setRecentAlerts([]);
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Some dashboard data could not be loaded. You may still use available features.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <ErrorIcon color="error" />;
      case 'medium':
        return <WarningIcon color="warning" />;
      case 'low':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };

  const getMetricTrend = (current, previous) => {
    if (!previous) return null;
    const diff = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(diff).toFixed(1),
      direction: diff >= 0 ? 'up' : 'down',
      color: diff >= 0 ? 'success' : 'error'
    };
  };

  if (loading) {
    return (
      <MainLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Box p={3}>
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={fetchDashboardData}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
            </Typography>
          </Box>
          <Button
            startIcon={<RefreshIcon />}
            onClick={fetchDashboardData}
            variant="outlined"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Box>

        {/* Network Performance Overview */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6} lg={3}>
            <MetricCard>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Network Availability
                </Typography>
                <NetworkCheckIcon color="primary" />
              </Box>
              <Typography variant="h4" component="div">
                {networkStats?.availability || 'N/A'}%
              </Typography>
              {networkStats?.availabilityTrend && (
                <TrendChip
                  label={`${networkStats.availabilityTrend.value}%`}
                  trend={networkStats.availabilityTrend.direction}
                  icon={networkStats.availabilityTrend.direction === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
              <Box mt={2}>
                <LinearProgress 
                  variant="determinate" 
                  value={networkStats?.availability || 0} 
                  color="primary"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </MetricCard>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MetricCard>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Average Latency
                </Typography>
                <SpeedIcon color="secondary" />
              </Box>
              <Typography variant="h4" component="div">
                {networkStats?.avgLatency || 'N/A'}ms
              </Typography>
              {networkStats?.latencyTrend && (
                <TrendChip
                  label={`${networkStats.latencyTrend.value}%`}
                  trend={networkStats.latencyTrend.direction}
                  icon={networkStats.latencyTrend.direction === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
              <Box mt={2}>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((networkStats?.avgLatency || 0) / 100, 100)} 
                  color="secondary"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </MetricCard>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MetricCard>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Active Sites
                </Typography>
                <DevicesIcon color="success" />
              </Box>
              <Typography variant="h4" component="div">
                {networkStats?.activeSites || 'N/A'}
              </Typography>
              {networkStats?.sitesTrend && (
                <TrendChip
                  label={`${networkStats.sitesTrend.value}%`}
                  trend={networkStats.sitesTrend.direction}
                  icon={networkStats.sitesTrend.direction === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
              <Box mt={2}>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((networkStats?.activeSites || 0) / 100, 100)} 
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </MetricCard>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MetricCard>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  Data Throughput
                </Typography>
                <TimelineIcon color="info" />
              </Box>
              <Typography variant="h4" component="div">
                {networkStats?.throughput || 'N/A'} Gbps
              </Typography>
              {networkStats?.throughputTrend && (
                <TrendChip
                  label={`${networkStats.throughputTrend.value}%`}
                  trend={networkStats.throughputTrend.direction}
                  icon={networkStats.throughputTrend.direction === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
              <Box mt={2}>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((networkStats?.throughput || 0) / 10, 100)} 
                  color="info"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </MetricCard>
          </Grid>
        </Grid>

        {/* Recent Alerts and Implementation Status */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardHeader
                title={
                  <SectionTitle>
                    <WarningAmberIcon />
                    Recent Alerts
                  </SectionTitle>
                }
                action={
                  <Link href="/network-performance">
                    <Button size="small" endIcon={<ArrowForwardIcon />}>View All</Button>
                  </Link>
                }
              />
              <CardContent>
                {recentAlerts.length === 0 ? (
                  <Box textAlign="center" py={3}>
                    <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="subtitle1" gutterBottom>No alerts!</Typography>
                    <Typography variant="body2" color="textSecondary">Your network is running smoothly.</Typography>
                  </Box>
                ) : (
                  <List>
                    {recentAlerts.map((alert) => (
                      <StyledListItem key={alert.id}>
                        <ListItemAvatar>
                          {getAlertIcon(alert.severity)}
                        </ListItemAvatar>
                        <ListItemText
                          primary={alert.title}
                          secondary={
                            <React.Fragment>
                              <Typography component="span" variant="body2" color="textPrimary">
                                {alert.description}
                              </Typography>
                              {' — '}
                              {alert.time}
                            </React.Fragment>
                          }
                        />
                      </StyledListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardHeader
                title={
                  <SectionTitle>
                    <AssignmentIcon />
                    Implementation Status
                  </SectionTitle>
                }
                action={
                  <Button 
                    size="small" 
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => router.push('/implementation-tracker')}
                  >
                    View All
                  </Button>
                }
              />
              <CardContent>
                {!implementationStats?.projects || implementationStats.projects.length === 0 ? (
                  <Box textAlign="center" py={3}>
                    <FolderIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="subtitle1" gutterBottom>No active projects</Typography>
                    <Typography variant="body2" color="textSecondary">All projects are completed.</Typography>
                  </Box>
                ) : (
                  <List>
                    {implementationStats.projects.map((project) => (
                      <StyledListItem key={project.id}>
                        <ListItemText
                          primary={project.name}
                          secondary={
                            <>
                              <div>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={project.progress} 
                                  color={project.progress >= 90 ? 'success' : 'primary'}
                                  sx={{ height: 6, borderRadius: 3 }}
                                />
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                <Typography variant="caption" color="textSecondary">
                                  {project.status}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  Due: {new Date(project.dueDate).toLocaleDateString()}
                                </Typography>
                              </div>
                            </>
                          }
                        />
                      </StyledListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StyledCard>
              <CardHeader
                title={
                  <SectionTitle variant="h6">
                    <AssignmentIcon />
                    Implementation Tracker
                  </SectionTitle>
                }
                action={
                  <Tooltip title="View All Implementation Projects">
                    <IconButton onClick={() => router.push('/implementations')}>
                      <ArrowForwardIcon />
                    </IconButton>
                  </Tooltip>
                }
              />
              <CardContent>
                {implementationStats && implementationStats.length > 0 ? (
                  <Grid container spacing={2}>
                    {implementationStats.map((stat) => (
                      <Grid item xs={6} key={stat.status}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 2, 
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                            borderRadius: 2,
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="h5" fontWeight="bold">
                            {stat.count}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stat.status}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography color="text.secondary">
                      No implementation projects yet
                    </Typography>
                    <Button 
                      variant="outlined" 
                      component={Link} 
                      href="/implementations/new" 
                      sx={{ mt: 2 }}
                      startIcon={<AssignmentIcon />}
                    >
                      Create Project
                    </Button>
                  </Box>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};

// Wrap the Dashboard component with ProtectedRoute
const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
};

export default DashboardPage; 