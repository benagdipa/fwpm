import React, { useState, useEffect } from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { networkAPI } from '../lib/api';
import useMediaQuery from '@mui/material/useMediaQuery';

// Material UI components
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ButtonGroup from '@mui/material/ButtonGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Snackbar from '@mui/material/Snackbar';
import TablePagination from '@mui/material/TablePagination';
import Backdrop from '@mui/material/Backdrop';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// DataGrid components
import { 
  DataGrid, 
  GridToolbar, 
  GridToolbarContainer, 
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter
} from '@mui/x-data-grid';

// Icons
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SpeedIcon from '@mui/icons-material/Speed';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import TuneIcon from '@mui/icons-material/Tune';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import RouterIcon from '@mui/icons-material/Router';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import InfoIcon from '@mui/icons-material/Info';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)',
  overflow: 'visible',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px 0 rgba(0,0,0,0.08)',
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1.5)
  }
}));

const KpiCard = styled(Paper)(({ theme, variant = 'default' }) => {
  let bgColor = alpha(theme.palette.primary.main, 0.04);
  let borderColor = alpha(theme.palette.primary.main, 0.1);
  let textColor = theme.palette.primary.main;
  
  switch (variant) {
    case 'success':
      bgColor = alpha(theme.palette.success.main, 0.04);
      borderColor = alpha(theme.palette.success.main, 0.1);
      textColor = theme.palette.success.main;
      break;
    case 'warning':
      bgColor = alpha(theme.palette.warning.main, 0.04);
      borderColor = alpha(theme.palette.warning.main, 0.1);
      textColor = theme.palette.warning.main;
      break;
    case 'error':
      bgColor = alpha(theme.palette.error.main, 0.04);
      borderColor = alpha(theme.palette.error.main, 0.1);
      textColor = theme.palette.error.main;
      break;
    case 'info':
      bgColor = alpha(theme.palette.info.main, 0.04);
      borderColor = alpha(theme.palette.info.main, 0.1);
      textColor = theme.palette.info.main;
      break;
  }
  
  return {
    padding: theme.spacing(2),
    height: '100%',
    borderRadius: theme.shape.borderRadius * 1.5,
    backgroundColor: bgColor,
    border: `1px solid ${borderColor}`,
    display: 'flex',
    flexDirection: 'column',
    '& .kpi-value': {
      color: textColor,
      fontWeight: 'bold',
    },
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 4px 12px 0 ${alpha(textColor, 0.12)}`,
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
    }
  };
});

const IconBox = styled(Box)(({ theme, color }) => ({
  borderRadius: '50%',
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: color ? alpha(color, 0.1) : alpha(theme.palette.primary.main, 0.1),
  color: color || theme.palette.primary.main,
  marginBottom: theme.spacing(1),
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButton-root': {
    borderRadius: theme.shape.borderRadius,
    fontWeight: 500,
    textTransform: 'none',
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.15),
      },
    },
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  '& .MuiTab-root': {
    minHeight: 52,
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
  },
}));

const FilterSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: alpha(theme.palette.background.default, 0.7),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(2),
  boxShadow: '0 1px 5px 0 rgba(0,0,0,0.05)',
}));

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`network-tabpanel-${index}`}
      aria-labelledby={`network-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Function to convert days to timeRange value
const daysToTimeRange = (days) => {
  if (days <= 1) return 'day';
  if (days <= 7) return 'week';
  if (days <= 30) return 'month';
  return 'quarter';
};

// Function to convert timeRange value to days
const timeRangeToDays = (timeRange) => {
  switch (timeRange) {
    case 'day': return 1;
    case 'week': return 7;
    case 'month': return 30;
    case 'quarter': return 90;
    default: return 7;
  }
};

// Helper function to format metric values
const formatMetricValue = (value, unit) => {
  // If value is null, undefined, or not a number, return 'N/A'
  if (value === undefined || value === null || isNaN(parseFloat(value))) {
    return 'N/A';
  }
  
  // Convert to number if it's a string representation of a number
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Round numbers to 2 decimal places
  if (typeof numValue === 'number') {
    const rounded = Math.round(numValue * 100) / 100;
    return `${rounded}${unit ? ` ${unit}` : ''}`;
  }
  
  // Fallback for any other case
  return `${value}${unit ? ` ${unit}` : ''}`;
};

// Helper function to determine KPI status based on thresholds
const getKpiStatus = (name, value) => {
  // Define thresholds for different metrics
  const thresholds = {
    'Cell Availability': { success: 99, warning: 95, error: 90 },
    'Abnormal Release': { success: 0.5, warning: 1, error: 2, inverse: true },
    'E-RAB Retainability': { success: 99, warning: 97, error: 95 },
    'Avg RRC Conn UE': { success: 40, warning: 60, error: 80, inverse: true },
    'DL Cell Throughput': { success: 50, warning: 30, error: 15 },
    'UL Cell Throughput': { success: 25, warning: 15, error: 8 },
    'DL Latency': { success: 25, warning: 40, error: 60, inverse: true },
    'DL PRB Usage': { success: 60, warning: 80, error: 90, inverse: true },
    'UL PRB Usage': { success: 50, warning: 70, error: 85, inverse: true },
    'DL Packet Loss': { success: 0.3, warning: 0.8, error: 1.5, inverse: true },
    'UL Packet Loss': { success: 0.3, warning: 0.8, error: 1.5, inverse: true },
    // Add more metrics and their thresholds as needed
  };
  
  // If no specific thresholds defined, use default
  const threshold = thresholds[name] || { success: 95, warning: 85, error: 75 };
  const isInverse = threshold.inverse || false;
  
  if (isInverse) {
    if (value <= threshold.success) return 'success';
    if (value <= threshold.warning) return 'warning';
    if (value <= threshold.error) return 'error';
    return 'error';
  } else {
    if (value >= threshold.success) return 'success';
    if (value >= threshold.warning) return 'warning';
    if (value >= threshold.error) return 'error';
    return 'error';
  }
};

// Helper function to determine trend based on current and previous value
const getTrend = (current, previous) => {
  if (!previous || current === previous) return 'stable';
  return current > previous ? 'up' : 'down';
};

// Helper function to determine cell class based on value thresholds
const getCellClassName = (params) => {
  if (!params || params.value === null || params.value === undefined) return '';
  
  const { field, value } = params;
  if (value === null || value === undefined || isNaN(parseFloat(value))) return '';
  
  // Cell Availability thresholds
  if (field === 'Cell Availability') {
    if (value < 95) return 'cell-warning';
    if (value < 90) return 'cell-critical';
    return 'cell-good';
  }
  
  // PRB Usage thresholds
  if (field === 'DL PRB Usage' || field === 'UL PRB Usage' || field === 'PRB_Util_DL' || field === 'PRB_Util_UL') {
    if (value > 85) return 'cell-warning';
    if (value > 95) return 'cell-critical';
    return '';
  }
  
  // Throughput thresholds
  if (field === 'DL Cell Throughput' || field === 'UL Cell Throughput' || field === 'MAC_DL_Thp_Max' || field === 'MAC_UL_Thp_Max') {
    if (value < 5) return 'cell-warning';
    if (value > 50) return 'cell-good';
    return '';
  }
  
  return '';
};

// Custom No Rows Overlay component
function CustomNoRowsOverlay() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        p: 2,
      }}
    >
      <SearchOffIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
      <Typography variant="h6" color="text.secondary">
        No data found
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Try adjusting your filters or time range
      </Typography>
    </Box>
  );
}

// Custom LTE DataGrid Toolbar
const LteDataGridCustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <Box sx={{ flexGrow: 1, display: 'flex', gap: 1, p: 1 }}>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport 
          csvOptions={{ fileName: `lte_performance_data_${new Date().toISOString().split('T')[0]}` }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <GridToolbarQuickFilter />
      </Box>
    </GridToolbarContainer>
  );
};

// Custom NR DataGrid Toolbar
const NrDataGridCustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <Box sx={{ flexGrow: 1, display: 'flex', gap: 1, p: 1 }}>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport 
          csvOptions={{ fileName: `nr_performance_data_${new Date().toISOString().split('T')[0]}` }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <GridToolbarQuickFilter />
      </Box>
    </GridToolbarContainer>
  );
};

const NetworkPerformancePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('week');
  const [days, setDays] = useState(timeRangeToDays('week'));
  const [siteFilter, setSiteFilter] = useState('');
  const [sites, setSites] = useState([]);
  const [lteData, setLteData] = useState([]);
  const [nrData, setNrData] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState({});
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [warning, setWarning] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [lteKpis, setLteKpis] = useState([]);
  const [nrKpis, setNrKpis] = useState([]);
  
  // New states for improved workflow
  const [isConnectedToStarburst, setIsConnectedToStarburst] = useState(false);
  const [isConnectingToStarburst, setIsConnectingToStarburst] = useState(false);
  const [starburstConnectionInfo, setStarburstConnectionInfo] = useState(null);
  const [isUsingMockData, setIsUsingMockData] = useState(true);
  
  // State for tracking operation status
  const [operationStatus, setOperationStatus] = useState('');
  const [showOperationStatus, setShowOperationStatus] = useState(false);
  
  // Initialize with mock data on component mount
  useEffect(() => {
    loadSites();
    loadMockData();
  }, []);
  
  // Load data when site or time range changes (only if connected to Starburst)
  useEffect(() => {
    if (siteFilter && isConnectedToStarburst) {
      loadData();
    }
  }, [siteFilter, days, isConnectedToStarburst]);
  
  // Mock data for initial display
  const loadMockData = () => {
    // Set mock site data
    if (sites.length === 0) {
      const mockSites = ['Site A', 'Site B', 'Site C', 'Site D', 'Site E'];
      setSites(mockSites);
      setSiteFilter('Site A'); // Default selection
    }
    
    // Set mock LTE KPIs
    const mockLteKpis = [
      { id: 1, name: 'Cell Availability', value: 98.5, unit: '%', status: 'good' },
      { id: 2, name: 'DL Throughput', value: 42.8, unit: 'Mbps', status: 'good' },
      { id: 3, name: 'UL Throughput', value: 12.3, unit: 'Mbps', status: 'good' },
      { id: 4, name: 'DL PRB Usage', value: 63.2, unit: '%', status: 'warning' },
      { id: 5, name: 'UL PRB Usage', value: 45.7, unit: '%', status: 'good' },
      { id: 6, name: 'Latency', value: 28.5, unit: 'ms', status: 'good' },
      { id: 7, name: 'DL Volume', value: '124.56', unit: 'GB' },
      { id: 8, name: 'UL Volume', value: '32.87', unit: 'GB' },
    ];
    setLteKpis(mockLteKpis);
    
    // Set mock NR KPIs
    const mockNrKpis = [
      { id: 1, name: 'DL Throughput', value: 325.6, unit: 'Mbps' },
      { id: 2, name: 'UL Throughput', value: 65.2, unit: 'Mbps' },
      { id: 3, name: 'DL PRB Usage', value: 45.3, unit: '%', status: 'good' },
      { id: 4, name: 'UL PRB Usage', value: 38.2, unit: '%', status: 'good' },
      { id: 5, name: 'Latency', value: 12.3, unit: 'ms' },
      { id: 6, name: 'DL Volume', value: '245.67', unit: 'GB' },
      { id: 7, name: 'UL Volume', value: '58.32', unit: 'GB' },
      { id: 8, name: 'Active Cells', value: 12 },
    ];
    setNrKpis(mockNrKpis);
    
    // Set mock data summary
    setDashboardSummary({
      lte: {
        avg_availability: 98.5,
        avg_dl_throughput: 42.8,
        avg_ul_throughput: 12.3,
        avg_prb_util_dl: 63.2,
        avg_prb_util_ul: 45.7,
        avg_latency: 28.5,
        total_dl_volume: 124.56 * 1024,
        total_ul_volume: 32.87 * 1024,
        cell_count: 8
      },
      nr: {
        avg_dl_throughput: 325.6,
        avg_ul_throughput: 65.2,
        avg_prb_util_dl: 45.3,
        avg_prb_util_ul: 38.2,
        avg_dl_latency: 12.3,
        total_dl_volume: 245.67 * 1024,
        total_ul_volume: 58.32 * 1024,
        cell_count: 12
      }
    });
    
    // Create mock metrics data for tables
    const mockLteData = Array.from({ length: 30 }, (_, index) => ({
      id: index,
      date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      cell_id: `LTE_${100 + index % 8}`,
      availability: 95 + Math.random() * 5,
      dl_throughput: 35 + Math.random() * 15,
      ul_throughput: 10 + Math.random() * 5,
      prb_util_dl: 55 + Math.random() * 25,
      prb_util_ul: 40 + Math.random() * 15,
      latency: 25 + Math.random() * 10,
      dl_volume: Math.round(100 + Math.random() * 50),
      ul_volume: Math.round(20 + Math.random() * 30)
    }));
    setLteData(mockLteData);
    
    const mockNrData = Array.from({ length: 30 }, (_, index) => ({
      id: index,
      date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      cell_id: `NR_${200 + index % 12}`,
      dl_throughput: 300 + Math.random() * 50,
      ul_throughput: 60 + Math.random() * 10,
      prb_util_dl: 40 + Math.random() * 15,
      prb_util_ul: 35 + Math.random() * 10,
      latency: 10 + Math.random() * 5,
      dl_volume: Math.round(200 + Math.random() * 100),
      ul_volume: Math.round(50 + Math.random() * 20)
    }));
    setNrData(mockNrData);
  };
  
  // Connect to Starburst for data access
  const connectToStarburst = async () => {
    try {
      // Update the UI to show connecting status
      setIsConnectingToStarburst(true);
      setOperationStatus('Connecting to Starburst Enterprise...');
      setShowOperationStatus(true);
      
      // Call the API to connect to Starburst
      const connectionResponse = await networkAPI.connectToStarburst();
      
      // Update state with connection info
      setStarburstConnectionInfo(connectionResponse.connection);
      setIsConnectedToStarburst(true);
      setIsUsingMockData(false);
      
      // Show success message
      setOperationStatus('Connected to Starburst Enterprise successfully. Loading real data...');
      setWarning(`Connected to Starburst Enterprise. Connection ID: ${connectionResponse.connection.id}`);
      setShowWarning(true);
      
      // Immediately load real data after successful connection
      await loadData();
      
      setOperationStatus('Successfully loaded real-time data from Starburst');
      setTimeout(() => {
        setShowOperationStatus(false);
      }, 3000);
      
      return true;
    } catch (error) {
      // Handle connection error
      setError('Failed to connect to Starburst Enterprise. Using mock data instead.');
      setShowError(true);
      setIsConnectedToStarburst(false);
      setIsUsingMockData(true);
      
      // Update status message
      setOperationStatus('Connection to Starburst failed. Using mock data.');
      setTimeout(() => {
        setShowOperationStatus(false);
      }, 5000);
      
      return false;
    } finally {
      setIsConnectingToStarburst(false);
    }
  };

  // Load sites data from API
  const loadSites = async () => {
    try {
      // Fetch sites from API
      const sitesData = await networkAPI.fetchSites();
      
      // Update state with sites data
      setSites(sitesData);
      
      // Set default site if none selected
      if (!siteFilter && sitesData.length > 0) {
        setSiteFilter(sitesData[0]);
      }
      
      return sitesData;
    } catch (error) {
      // Handle error
      setError('Failed to load sites data. Using mock data instead.');
      loadMockData();
      return [];
    }
  };

  // Load data based on selected filters
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!siteFilter) {
        // Skip data load if no site is selected
        setLoading(false);
        return;
      }
      
      // Prepare parameters for API calls
      const params = {
        site: siteFilter,
        days: days
      };
      
      // Use mock data if not connected to Starburst
      if (isUsingMockData) {
        setOperationStatus('Loading mock data...');
        setShowOperationStatus(true);
        
        // Set mock data
        setLteData(mockLteData);
        setNrData(mockNrData);
        setDashboardSummary(mockSummaryData);
        
        // Process LTE metrics for KPIs
        const newLteKpis = {};
        mockLteData.forEach((row) => {
          Object.keys(row).forEach(key => {
            if (key !== 'date' && key !== 'site') {
              if (!newLteKpis[key]) {
                newLteKpis[key] = {
                  current: parseFloat(row[key]),
                  previous: null,
                  trend: 0
                };
              }
            }
          });
        });
        setLteKpis(newLteKpis);
        
        // Process NR metrics for KPIs
        const newNrKpis = {};
        mockNrData.forEach((row) => {
          Object.keys(row).forEach(key => {
            if (key !== 'date' && key !== 'site') {
              if (!newNrKpis[key]) {
                newNrKpis[key] = {
                  current: parseFloat(row[key]),
                  previous: null,
                  trend: 0
                };
              }
            }
          });
        });
        setNrKpis(newNrKpis);
        
        setOperationStatus('Mock data loaded successfully');
        setTimeout(() => {
          setShowOperationStatus(false);
        }, 3000);
        
        // Complete loading
        setLoading(false);
        return;
      }
      
      // Clear any existing mock data when using real data
      if (isConnectedToStarburst) {
        setOperationStatus('Fetching real-time data from Starburst...');
        setShowOperationStatus(true);
      }
      
      let hasLteData = false;
      let hasNrData = false;
      let hasSummaryData = false;
      
      try {
        // Update status message
        setOperationStatus('Running LTE metrics query...');
        
        // Fetch LTE metrics
        const lteMetrics = await networkAPI.fetchLteMetrics(params);
        
        // Process LTE metrics
        setLteData(lteMetrics);
        const newLteKpis = {};
        lteMetrics.forEach((row) => {
          Object.keys(row).forEach(key => {
            if (key !== 'date' && key !== 'site') {
              if (!newLteKpis[key]) {
                newLteKpis[key] = {
                  current: parseFloat(row[key]),
                  previous: null,
                  trend: 0
                };
              }
            }
          });
        });
        setLteKpis(newLteKpis);
        hasLteData = true;
      } catch (lteError) {
        setError('Failed to load LTE metrics data. Please try again.');
        setShowError(true);
        console.error('LTE metrics error:', lteError);
      }
      
      try {
        // Update status message
        setOperationStatus('Running NR metrics query...');
        
        // Fetch NR metrics
        const nrMetrics = await networkAPI.fetchNrMetrics(params);
        
        // Process NR metrics
        setNrData(nrMetrics);
        const newNrKpis = {};
        nrMetrics.forEach((row) => {
          Object.keys(row).forEach(key => {
            if (key !== 'date' && key !== 'site') {
              if (!newNrKpis[key]) {
                newNrKpis[key] = {
                  current: parseFloat(row[key]),
                  previous: null,
                  trend: 0
                };
              }
            }
          });
        });
        setNrKpis(newNrKpis);
        hasNrData = true;
      } catch (nrError) {
        setError('Failed to load NR metrics data. Please try again.');
        setShowError(true);
        console.error('NR metrics error:', nrError);
      }
      
      try {
        // Update status message
        setOperationStatus('Running dashboard summary query...');
        
        // Fetch dashboard summary
        const summary = await networkAPI.fetchDashboardSummary(params);
        
        // Set summary data
        setDashboardSummary(summary);
        hasSummaryData = true;
      } catch (summaryError) {
        setError('Failed to load dashboard summary. Please try again.');
        setShowError(true);
        console.error('Dashboard summary error:', summaryError);
      }
      
      // Update data source state based on query results
      if (isConnectedToStarburst && (hasLteData || hasNrData || hasSummaryData)) {
        setIsUsingMockData(false);
      } else if (!hasLteData && !hasNrData && !hasSummaryData) {
        // If all queries failed, fall back to mock data
        setWarning('Failed to retrieve data from Starburst. Falling back to mock data.');
        setShowWarning(true);
        setIsUsingMockData(true);
        loadMockData();
      }
      
      // Update status message for completion
      setOperationStatus(isUsingMockData 
        ? 'Using mock data due to query failures' 
        : 'All queries completed successfully - viewing real-time data');
      setTimeout(() => {
        setShowOperationStatus(false);
      }, 3000);
      
    } catch (error) {
      setError('Failed to load network performance data');
      setShowError(true);
      setOperationStatus('Query failed. Please try again.');
      setTimeout(() => {
        setShowOperationStatus(false);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  // Handle site selection change
  const handleSiteFilterChange = (event) => {
    setSiteFilter(event.target.value);
    
    // Refresh data with mock data if using mock data
    if (isUsingMockData) {
      setLteData(mockLteData);
      setNrData(mockNrData);
      setDashboardSummary(mockSummaryData);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleTimeRangeChange = (event, newRange) => {
    if (newRange !== null) {
      setTimeRange(newRange);
      setDays(timeRangeToDays(newRange));
    }
  };
  
  const handleRefresh = () => {
    if (isConnectedToStarburst) {
      loadData();
    } else {
      // Refresh mock data
      loadMockData();
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };
  
  const getStatusIcon = (trend) => {
    if (trend === 'up') {
      return <span style={{ color: theme.palette.success.main }}>↑</span>;
    } else if (trend === 'down') {
      return <span style={{ color: theme.palette.error.main }}>↓</span>;
    } else {
      return <span style={{ color: theme.palette.text.secondary }}>→</span>;
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };
  
  const handleCloseWarning = () => {
    setShowWarning(false);
  };
  
  return (
    <ProtectedRoute>
      <MainLayout>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {/* Page title and actions */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            mb: 3,
            gap: 2
          }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Network Performance
            </Typography>
            
            <Stack direction="row" spacing={1}>
              {/* Starburst connection status */}
              {isUsingMockData ? (
                <Chip 
                  label="Using Mock Data" 
                  color="default" 
                  size="small" 
                  icon={<ErrorOutlineIcon fontSize="small" />} 
                  sx={{ mr: 1 }}
                />
              ) : (
                <Chip 
                  label={`Connected to Starburst`} 
                  color="success" 
                  size="small" 
                  icon={<FiberManualRecordIcon fontSize="small" />} 
                  sx={{ mr: 1 }}
                />
              )}
            
              {/* Connect to Starburst button */}
              {!isConnectedToStarburst && (
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={isConnectingToStarburst ? <CircularProgress size={16} color="inherit" /> : <RouterIcon />}
                  onClick={connectToStarburst}
                  disabled={isConnectingToStarburst}
                >
                  {isConnectingToStarburst ? 'Connecting...' : 'Connect to Starburst'}
                </Button>
              )}
              
              <Button 
                variant="outlined" 
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
                onClick={handleRefresh}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </Stack>
          </Box>
          
          {/* Connect to Starburst info card */}
          {!isConnectedToStarburst && !isConnectingToStarburst && isUsingMockData && (
            <Paper 
              sx={{ 
                p: 2, 
                mb: 3, 
                display: 'flex', 
                alignItems: 'center', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                gap: 2,
                border: '1px dashed',
                borderColor: 'divider',
                backgroundColor: alpha(theme.palette.info.main, 0.04)
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <RouterIcon color="info" fontSize="large" />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Currently viewing mock data
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Connect to Starburst Enterprise to view real-time network performance data
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', backgroundColor: alpha(theme.palette.info.main, 0.08), p: 1, borderRadius: 1 }}>
                Use the Connect to Starburst button above to view real-time network data
              </Typography>
            </Paper>
          )}
          
          {/* Real data indicator - only shown when connected to Starburst */}
          {isConnectedToStarburst && !isUsingMockData && (
            <Paper 
              sx={{ 
                p: 2, 
                mb: 3, 
                display: 'flex', 
                alignItems: 'center', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                gap: 2,
                border: '1px solid',
                borderColor: alpha(theme.palette.success.main, 0.3),
                backgroundColor: alpha(theme.palette.success.main, 0.05)
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FiberManualRecordIcon color="success" fontSize="large" />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Viewing real-time data from Starburst
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You are now connected to Starburst Enterprise and viewing real-time network performance data
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Chip 
                label="Connected" 
                color="success" 
                size="small" 
                icon={<NetworkCheckIcon fontSize="small" />}
              />
            </Paper>
          )}
          
          {/* Processing indicator when connecting to Starburst */}
          {isConnectingToStarburst && (
            <Paper 
              sx={{ 
                p: 2, 
                mb: 3,
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.2)
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={24} />
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Connecting to Starburst Enterprise...
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Establishing secure connection to data source
                  </Typography>
                  <LinearProgress sx={{ mt: 1.5, borderRadius: 1 }} />
                </Box>
              </Box>
            </Paper>
          )}
          
          {/* Filter controls */}
          <Box sx={{ 
            p: { xs: 1.5, sm: 2 },
            backgroundColor: 'background.paper',
            borderRadius: theme => theme.shape.borderRadius * 1.5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 1.5, md: 2 },
            alignItems: { xs: 'stretch', md: 'center' },
            mb: 3
          }}>
            <ToggleButtonGroup
              value={timeRange}
              exclusive
              onChange={handleTimeRangeChange}
              size="small"
              disabled={loading || isConnectingToStarburst}
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                width: { xs: '100%', md: 'auto' },
                position: 'relative'
              }}
            >
              <ToggleButton value="day">
                {loading ? <CircularProgress size={14} sx={{ mr: 1 }} /> : <CalendarViewDayIcon fontSize="small" sx={{ mr: 0.5 }} />}
                Day
              </ToggleButton>
              <ToggleButton value="week">
                {loading ? <CircularProgress size={14} sx={{ mr: 1 }} /> : <CalendarViewWeekIcon fontSize="small" sx={{ mr: 0.5 }} />}
                Week
              </ToggleButton>
              <ToggleButton value="month">
                {loading ? <CircularProgress size={14} sx={{ mr: 1 }} /> : <CalendarViewMonthIcon fontSize="small" sx={{ mr: 0.5 }} />}
                Month
              </ToggleButton>
              <ToggleButton value="quarter">
                {loading ? <CircularProgress size={14} sx={{ mr: 1 }} /> : <DateRangeIcon fontSize="small" sx={{ mr: 0.5 }} />}
                Quarter
              </ToggleButton>
            </ToggleButtonGroup>
            
            <Box sx={{ flexGrow: 1 }} />
            
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 180 }, position: 'relative' }}>
              <InputLabel id="site-filter-label">Filter by Site</InputLabel>
              <Select
                labelId="site-filter-label"
                value={siteFilter}
                label="Filter by Site"
                onChange={handleSiteFilterChange}
                fullWidth
                disabled={loading || isConnectingToStarburst}
                IconComponent={(props) => loading ? 
                  <CircularProgress size={20} sx={{ mr: 1 }} /> : 
                  <KeyboardArrowDownIcon {...props} />
                }
              >
                {sites.map((site) => {
                  // Support both object format from API and string format for mock data
                  const siteId = typeof site === 'object' ? site.id : site;
                  const siteName = typeof site === 'object' ? site.name : site;
                  
                  return (
                    <MenuItem key={siteId} value={siteId}>
                      {siteName}
                    </MenuItem>
                  );
                })}
              </Select>
              {loading && (
                <CircularProgress 
                  size={16} 
                  sx={{ 
                    position: 'absolute', 
                    right: 30, 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    zIndex: 1
                  }} 
                />
              )}
            </FormControl>
          </Box>
          
          {/* Show loading indicator when data is refreshing */}
          {loading && (
            <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />
          )}
          
          {/* Operation status notification */}
          <Snackbar 
            open={showOperationStatus} 
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              severity="info" 
              sx={{ 
                width: '100%', 
                alignItems: 'center',
                '& .MuiAlert-message': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }
              }}
              icon={(loading || isConnectingToStarburst) ? 
                <CircularProgress size={20} color="info" /> : 
                <InfoIcon />
              }
            >
              {operationStatus}
              {(loading || isConnectingToStarburst) && (
                <CircularProgress 
                  size={16} 
                  sx={{ ml: 1, color: theme.palette.info.main }} 
                />
              )}
            </Alert>
          </Snackbar>
          
          {/* Backdrop for heavy loading operations */}
          <Backdrop
            sx={{
              color: '#fff',
              zIndex: (theme) => theme.zIndex.drawer + 1,
              flexDirection: 'column',
              gap: 2
            }}
            open={isConnectingToStarburst || (loading && operationStatus.includes('query'))}
          >
            <CircularProgress color="inherit" size={60} />
            <Typography variant="h6">
              {isConnectingToStarburst 
                ? 'Connecting to Starburst Enterprise...' 
                : operationStatus || 'Loading data...'}
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ maxWidth: 400, textAlign: 'center' }}>
              {isConnectingToStarburst 
                ? 'This may take a few moments as we establish a secure connection'
                : 'Running complex queries to retrieve your data'}
            </Typography>
          </Backdrop>
          
          {/* Error message */}
          <Snackbar 
            open={showError} 
            autoHideDuration={6000} 
            onClose={handleCloseError}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert 
              onClose={handleCloseError} 
              severity="error" 
              sx={{ width: '100%' }}
            >
              {error}
            </Alert>
          </Snackbar>
          
          {/* Warning message */}
          <Snackbar 
            open={showWarning} 
            autoHideDuration={10000} 
            onClose={handleCloseWarning}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert 
              onClose={handleCloseWarning} 
              severity="warning" 
              sx={{ width: '100%' }}
            >
              {warning}
            </Alert>
          </Snackbar>
          
          {/* No data message */}
          {!loading && !error && siteFilter && !Object.keys(dashboardSummary).length && (
            <Alert severity="info" sx={{ mb: 3 }}>
              No data available for the selected site and time period. Try changing your filters.
            </Alert>
          )}
          
          {/* Tabs navigation */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderTopLeftRadius: 3,
                  borderTopRightRadius: 3
                }
              }}
            >
              <Tab label="LTE Performance" icon={<RouterIcon />} iconPosition="start" />
              <Tab label="NR Performance" icon={<SignalCellularAltIcon />} iconPosition="start" />
            </Tabs>
          </Box>
          
          {/* LTE Tab Panel */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              LTE Key Performance Indicators
            </Typography>
            
            {/* LTE Summary Cards */}
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <CircularProgress size={40} />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Loading LTE metrics data...
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} sx={{ mb: 3 }}>
                {lteKpis.map((kpi) => (
                  <Grid item xs={6} sm={6} md={3} key={kpi.id}>
                    <StyledCard>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            {kpi.name}
                          </Typography>
                          {kpi.status && (
                            <FiberManualRecordIcon 
                              fontSize="small" 
                              sx={{ color: getStatusColor(kpi.status) }} 
                            />
                          )}
                        </Box>
                        <Typography variant="h5" component="div" fontWeight="bold" sx={{ my: 1 }}>
                          {formatMetricValue(kpi.value, kpi.unit)}
                        </Typography>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            )}
            
            {/* LTE Data Table */}
            {!loading && lteData.length > 0 && (
              <Box sx={{ mt: 4, height: 500 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  LTE Cell Details
                </Typography>
                
                <DataGrid
                  getRowId={(row) => row.id}
                  rows={lteData}
                  columns={[
                    { 
                      field: 'metrics_date_local', 
                      headerName: 'Date/Time', 
                      width: 200, 
                      filterable: true, 
                      sortable: true,
                      valueGetter: (params) => params?.row?.metrics_date_local || 'N/A'
                    },
                    { 
                      field: 'eutran_cell_id', 
                      headerName: 'Cell ID', 
                      width: 150,
                      filterable: true, 
                      sortable: true,
                      valueGetter: (params) => params?.row?.eutran_cell_id || 'N/A'
                    },
                    { 
                      field: 'Cell Availability', 
                      headerName: 'Cell Availability (%)', 
                      width: 180, 
                      filterable: true, 
                      sortable: true,
                      valueGetter: (params) => params?.row ? params.row['Cell Availability'] : null,
                      renderCell: (params) => formatMetricValue(params.value, '%'),
                      cellClassName: (params) => {
                        if (!params.value || isNaN(parseFloat(params.value))) return '';
                        const value = parseFloat(params.value);
                        if (value < 90) return 'cell-critical';
                        if (value < 95) return 'cell-warning';
                        return 'cell-good';
                      }
                    },
                    { 
                      field: 'DL Cell Throughput', 
                      headerName: 'DL Throughput (Mbps)', 
                      width: 180, 
                      filterable: true, 
                      sortable: true,
                      valueGetter: (params) => params?.row ? params.row['DL Cell Throughput'] : null,
                      renderCell: (params) => formatMetricValue(params.value, 'Mbps'),
                      cellClassName: (params) => {
                        if (!params.value || isNaN(parseFloat(params.value))) return '';
                        const value = parseFloat(params.value);
                        if (value < 15) return 'cell-critical';
                        if (value < 30) return 'cell-warning';
                        if (value > 50) return 'cell-good';
                        return '';
                      }
                    },
                    { 
                      field: 'UL Cell Throughput', 
                      headerName: 'UL Throughput (Mbps)', 
                      width: 180, 
                      filterable: true, 
                      sortable: true,
                      valueGetter: (params) => params?.row ? params.row['UL Cell Throughput'] : null,
                      renderCell: (params) => formatMetricValue(params.value, 'Mbps'),
                      cellClassName: (params) => {
                        if (!params.value || isNaN(parseFloat(params.value))) return '';
                        const value = parseFloat(params.value);
                        if (value < 8) return 'cell-critical';
                        if (value < 15) return 'cell-warning';
                        if (value > 25) return 'cell-good';
                        return '';
                      }
                    },
                    { 
                      field: 'DL PRB Usage', 
                      headerName: 'DL PRB Usage (%)', 
                      width: 180, 
                      filterable: true, 
                      sortable: true,
                      valueGetter: (params) => params?.row ? params.row['DL PRB Usage'] : null,
                      renderCell: (params) => formatMetricValue(params.value, '%'),
                      cellClassName: (params) => {
                        if (!params.value || isNaN(parseFloat(params.value))) return '';
                        const value = parseFloat(params.value);
                        if (value > 90) return 'cell-critical';
                        if (value > 80) return 'cell-warning';
                        return '';
                      }
                    },
                    { 
                      field: 'UL PRB Usage', 
                      headerName: 'UL PRB Usage (%)', 
                      width: 180, 
                      filterable: true, 
                      sortable: true,
                      valueGetter: (params) => params?.row ? params.row['UL PRB Usage'] : null,
                      renderCell: (params) => formatMetricValue(params.value, '%'),
                      cellClassName: (params) => {
                        if (!params.value || isNaN(parseFloat(params.value))) return '';
                        const value = parseFloat(params.value);
                        if (value > 85) return 'cell-critical';
                        if (value > 70) return 'cell-warning';
                        return '';
                      }
                    },
                    { 
                      field: 'DL Latency', 
                      headerName: 'Latency (ms)', 
                      width: 150, 
                      filterable: true, 
                      sortable: true,
                      valueGetter: (params) => params?.row ? params.row['DL Latency'] : null,
                      renderCell: (params) => formatMetricValue(params.value, 'ms'),
                      cellClassName: (params) => {
                        if (!params.value || isNaN(parseFloat(params.value))) return '';
                        const value = parseFloat(params.value);
                        if (value > 60) return 'cell-critical';
                        if (value > 40) return 'cell-warning';
                        if (value < 25) return 'cell-good';
                        return '';
                      }
                    },
                  ]}
                  autoHeight
                  disableSelectionOnClick
                  pagination
                  pageSizeOptions={[10, 25, 50, 100]}
                  initialState={{
                    pagination: {
                      paginationModel: { 
                        pageSize: 10, 
                        page: 0 
                      },
                    },
                  }}
                  density="compact"
                  components={{
                    Toolbar: LteDataGridCustomToolbar,
                    NoRowsOverlay: CustomNoRowsOverlay
                  }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                    },
                  }}
                />
              </Box>
            )}
          </TabPanel>
          
          {/* NR Tab Panel */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              NR (5G) Key Performance Indicators
            </Typography>
            
            {/* NR Summary Cards */}
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <CircularProgress size={40} />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Loading NR (5G) metrics data...
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} sx={{ mb: 3 }}>
                {nrKpis.map((kpi) => (
                  <Grid item xs={6} sm={6} md={3} key={kpi.id}>
                    <StyledCard>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            {kpi.name}
                          </Typography>
                          {kpi.status && (
                            <FiberManualRecordIcon 
                              fontSize="small" 
                              sx={{ color: getStatusColor(kpi.status) }} 
                            />
                          )}
                        </Box>
                        <Typography variant="h5" component="div" fontWeight="bold" sx={{ my: 1 }}>
                          {formatMetricValue(kpi.value, kpi.unit)}
                        </Typography>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            )}
            
            {/* NR Data Table */}
            {!loading && nrData.length > 0 && (
              <Box sx={{ mt: 4, height: 500 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  NR Cell Details
                </Typography>
                
                <DataGrid
                  getRowId={(row) => row.id}
                  rows={nrData}
                  columns={[
                    { 
                      field: 'metrics_date_local', 
                      headerName: 'Date/Time', 
                      width: 200, 
                      filterable: true, 
                      sortable: true,
                      valueGetter: (params) => params?.row?.metrics_date_local || 'N/A'
                    },
                    { 
                      field: 'gutran_cell_id', 
                      headerName: 'Cell ID', 
                      width: 150, 
                      filterable: true, 
                      sortable: true,
                      valueGetter: (params) => params?.row?.gutran_cell_id || 'N/A'
                    },
                    { 
                      field: 'MAC_DL_Thp_Max', 
                      headerName: 'DL Throughput (Mbps)', 
                      width: 180, 
                      filterable: true, 
                      sortable: true,
                      valueGetter: (params) => params?.row?.MAC_DL_Thp_Max,
                      renderCell: (params) => formatMetricValue(params.value, 'Mbps'),
                      cellClassName: (params) => {
                        if (!params.value || isNaN(parseFloat(params.value))) return '';
                        const value = parseFloat(params.value);
                        if (value < 15) return 'cell-critical';
                        if (value < 30) return 'cell-warning';
                        if (value > 50) return 'cell-good';
                        return '';
                      }
                    },
                    { 
                      field: 'MAC_UL_Thp_Max', 
                      headerName: 'UL Throughput (Mbps)', 
                      width: 180, 
                      filterable: true, 
                      sortable: true,
                      valueGetter: (params) => params?.row?.MAC_UL_Thp_Max,
                      renderCell: (params) => formatMetricValue(params.value, 'Mbps'),
                      cellClassName: (params) => {
                        if (!params.value || isNaN(parseFloat(params.value))) return '';
                        const value = parseFloat(params.value);
                        if (value < 8) return 'cell-critical';
                        if (value < 15) return 'cell-warning';
                        if (value > 25) return 'cell-good';
                        return '';
                      }
                    },
                    { 
                      field: 'PRB_Util_DL', 
                      headerName: 'DL PRB Usage (%)', 
                      width: 180, 
                      filterable: true, 
                      sortable: true,
                      valueGetter: (params) => params?.row?.PRB_Util_DL,
                      renderCell: (params) => formatMetricValue(params.value, '%'),
                      cellClassName: (params) => {
                        if (!params.value || isNaN(parseFloat(params.value))) return '';
                        const value = parseFloat(params.value);
                        if (value > 90) return 'cell-critical';
                        if (value > 80) return 'cell-warning';
                        return '';
                      }
                    },
                    { 
                      field: 'PRB_Util_UL', 
                      headerName: 'UL PRB Usage (%)', 
                      width: 180, 
                      filterable: true, 
                      sortable: true,
                      valueGetter: (params) => params?.row?.PRB_Util_UL,
                      renderCell: (params) => formatMetricValue(params.value, '%'),
                      cellClassName: (params) => {
                        if (!params.value || isNaN(parseFloat(params.value))) return '';
                        const value = parseFloat(params.value);
                        if (value > 85) return 'cell-critical';
                        if (value > 70) return 'cell-warning';
                        return '';
                      }
                    },
                    { 
                      field: 'DL_Latency_Non_DRX_QoS_0', 
                      headerName: 'DL Latency (ms)', 
                      width: 180, 
                      filterable: true, 
                      sortable: true,
                      valueGetter: (params) => params?.row?.DL_Latency_Non_DRX_QoS_0,
                      renderCell: (params) => formatMetricValue(params.value, 'ms'),
                      cellClassName: (params) => {
                        if (!params.value || isNaN(parseFloat(params.value))) return '';
                        const value = parseFloat(params.value);
                        if (value > 60) return 'cell-critical';
                        if (value > 40) return 'cell-warning';
                        if (value < 25) return 'cell-good';
                        return '';
                      }
                    },
                    { 
                      field: 'SINR_PUSCH', 
                      headerName: 'SINR PUSCH', 
                      width: 150, 
                      filterable: true, 
                      sortable: true,
                      valueGetter: (params) => params?.row?.SINR_PUSCH,
                      renderCell: (params) => formatMetricValue(params.value)
                    },
                  ]}
                  autoHeight
                  disableSelectionOnClick
                  pagination
                  pageSizeOptions={[10, 25, 50, 100]}
                  initialState={{
                    pagination: {
                      paginationModel: { 
                        pageSize: 10, 
                        page: 0 
                      },
                    },
                  }}
                  density="compact"
                  components={{
                    Toolbar: NrDataGridCustomToolbar,
                    NoRowsOverlay: CustomNoRowsOverlay
                  }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                    },
                  }}
                />
              </Box>
            )}
          </TabPanel>
        </Box>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default NetworkPerformancePage; 