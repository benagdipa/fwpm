import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import Head from 'next/head';
import { 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  CardHeader,
  CardMedia,
  CardActions,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Button,
  Tabs,
  Tab,
  IconButton,
  Stack,
  Chip,
  LinearProgress,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Badge,
  useTheme,
  Tooltip,
  Menu,
  MenuItem,
  CircularProgress,
  AlertTitle,
  Breadcrumbs,
  Link
} from '@mui/material';
import { 
  DataGrid, 
  GridToolbar, 
  GridToolbarContainer, 
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter
} from '@mui/x-data-grid';
import SettingsIcon from '@mui/icons-material/Settings';
import BuildIcon from '@mui/icons-material/Build';
import HistoryIcon from '@mui/icons-material/History';
import LaunchIcon from '@mui/icons-material/Launch';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import CodeIcon from '@mui/icons-material/Code';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import SyncIcon from '@mui/icons-material/Sync';
import InfoIcon from '@mui/icons-material/Info';
import SpeedIcon from '@mui/icons-material/Speed';
import StorageIcon from '@mui/icons-material/Storage';
import RouterIcon from '@mui/icons-material/Router';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BadgeIcon from '@mui/icons-material/Badge';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloudIcon from '@mui/icons-material/Cloud';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import axios from 'axios';
import ChangeHistoryView from '../components/change-history/ChangeHistoryView';

// Mock configurations data
const mockConfigurations = [
  { 
    id: 'cfg-001', 
    name: 'Urban Area Configuration', 
    description: 'Optimized configuration for dense urban environments with high traffic',
    version: '3.2.1',
    lastUpdated: '2023-03-10',
    author: 'John Doe',
    applicableDevices: ['Nokia WNTD-X1', 'Ericsson W5000'],
    tags: ['Urban', 'High Capacity'],
    status: 'Published'
  },
  { 
    id: 'cfg-002', 
    name: 'Rural Configuration', 
    description: 'Extended coverage configuration for rural areas with lower population density',
    version: '2.1.0',
    lastUpdated: '2023-02-15',
    author: 'Emily Johnson',
    applicableDevices: ['Huawei WD200', 'ZTE ProbeUnit'],
    tags: ['Rural', 'Coverage'],
    status: 'Published'
  },
  { 
    id: 'cfg-003', 
    name: 'Industrial Zone Setup', 
    description: 'Robust configuration for industrial environments with interference mitigation',
    version: '1.5.4',
    lastUpdated: '2023-03-05',
    author: 'Michael Chen',
    applicableDevices: ['Nokia WNTD-X2', 'Ericsson W5000'],
    tags: ['Industrial', 'Interference'],
    status: 'Draft'
  },
  { 
    id: 'cfg-004', 
    name: 'Suburban Default', 
    description: 'Balanced configuration for suburban areas with moderate traffic',
    version: '2.0.1',
    lastUpdated: '2023-02-28',
    author: 'Sarah Williams',
    applicableDevices: ['All'],
    tags: ['Suburban', 'Default'],
    status: 'Published'
  },
  { 
    id: 'cfg-005', 
    name: 'Emergency Response', 
    description: 'Rapid deployment configuration for emergency and disaster response',
    version: '1.1.0',
    lastUpdated: '2023-03-08',
    author: 'David Miller',
    applicableDevices: ['Nokia WNTD-X1', 'Samsung NetTracker'],
    tags: ['Emergency', 'Portable'],
    status: 'Testing'
  },
];

// Mock data for Configuration DataGrid
const mockConfigurationDetails = [
  { 
    id: 'cfg-001-det-1',
    moClassName: 'RadioNetwork',
    parameterName: 'TransmitPower',
    thorView: 'Radio Parameters',
    thorName: 'TxPower',
    condition1: 'Urban Area',
    condition2: 'High Traffic',
    nbnCoValue: '43 dBm',
    comments: 'Optimized for dense urban environments'
  },
  { 
    id: 'cfg-001-det-2',
    moClassName: 'RadioNetwork',
    parameterName: 'AntennaGain',
    thorView: 'Radio Parameters',
    thorName: 'AntGain',
    condition1: 'Urban Area',
    condition2: 'High Traffic',
    nbnCoValue: '18 dBi',
    comments: 'High gain antenna configuration'
  },
  { 
    id: 'cfg-002-det-1',
    moClassName: 'RadioNetwork',
    parameterName: 'TransmitPower',
    thorView: 'Radio Parameters',
    thorName: 'TxPower',
    condition1: 'Rural Area',
    condition2: 'Low Traffic',
    nbnCoValue: '46 dBm',
    comments: 'Maximum power for extended coverage'
  },
  { 
    id: 'cfg-002-det-2',
    moClassName: 'Core',
    parameterName: 'ConnectionTimeout',
    thorView: 'Core Network',
    thorName: 'ConnTimeout',
    condition1: 'Rural Area',
    condition2: 'Low Traffic',
    nbnCoValue: '30s',
    comments: 'Extended timeout for rural areas'
  },
  { 
    id: 'cfg-003-det-1',
    moClassName: 'RadioNetwork',
    parameterName: 'InterferenceThreshold',
    thorView: 'Interference Management',
    thorName: 'IntfThresh',
    condition1: 'Industrial Zone',
    condition2: 'High Interference',
    nbnCoValue: '-95 dBm',
    comments: 'Improved interference rejection'
  },
  { 
    id: 'cfg-004-det-1',
    moClassName: 'Core',
    parameterName: 'MaxUsers',
    thorView: 'Core Network',
    thorName: 'MaxConn',
    condition1: 'Suburban',
    condition2: 'Medium Traffic',
    nbnCoValue: '500',
    comments: 'Balanced configuration'
  },
  { 
    id: 'cfg-005-det-1',
    moClassName: 'RadioNetwork',
    parameterName: 'CellReselection',
    thorView: 'Mobility',
    thorName: 'CellResel',
    condition1: 'Emergency',
    condition2: 'Portable Deployment',
    nbnCoValue: 'Fast',
    comments: 'Optimized for quick handovers'
  },
];

// Mock tools data
const mockTools = [
  { 
    id: 'tool-001', 
    name: 'Network Analyzer', 
    description: 'Advanced tool for analyzing network traffic patterns and identifying bottlenecks',
    category: 'Analysis',
    lastUsed: '2023-03-11',
    usageCount: 45,
    type: 'Web App',
    author: 'Network Tools Inc.',
    version: '4.2.1',
    icon: <AssessmentIcon />,
    color: '#2196f3'
  },
  { 
    id: 'tool-002', 
    name: 'Signal Mapper', 
    description: 'Creates detailed signal strength maps based on collected data points',
    category: 'Mapping',
    lastUsed: '2023-03-09',
    usageCount: 32,
    type: 'Desktop App',
    author: 'GeoSoft Solutions',
    version: '2.5.0',
    icon: <SignalCellularAltIcon />,
    color: '#ff9800'
  },
  { 
    id: 'tool-003', 
    name: 'Config Generator', 
    description: 'Automatically generates optimized configurations based on environmental inputs',
    category: 'Configuration',
    lastUsed: '2023-03-07',
    usageCount: 28,
    type: 'Web App',
    author: 'AutoConfig Systems',
    version: '3.0.2',
    icon: <SettingsIcon />,
    color: '#4caf50'
  },
  { 
    id: 'tool-004', 
    name: 'Performance Tester', 
    description: 'Executes automated tests to verify network performance against benchmarks',
    category: 'Testing',
    lastUsed: '2023-03-10',
    usageCount: 19,
    type: 'CLI Tool',
    author: 'QA Networks',
    version: '1.8.3',
    icon: <SpeedIcon />,
    color: '#f44336'
  },
  { 
    id: 'tool-005', 
    name: 'Deployment Assistant', 
    description: 'Step-by-step guide for deploying configurations to network devices',
    category: 'Deployment',
    lastUsed: '2023-03-01',
    usageCount: 15,
    type: 'Web App',
    author: 'DeployEase',
    version: '2.1.4',
    icon: <VpnKeyIcon />,
    color: '#9c27b0'
  },
  { 
    id: 'tool-006', 
    name: 'Database Explorer', 
    description: 'Browse and query network configuration database with advanced search capabilities',
    category: 'Database',
    lastUsed: '2023-02-20',
    usageCount: 22,
    type: 'Desktop App',
    author: 'DataViz Corp',
    version: '5.1.0',
    icon: <StorageIcon />,
    color: '#795548'
  },
];

// Mock usage logs
const mockUsageLogs = [
  { 
    id: 'log-001', 
    user: 'John Doe', 
    tool: 'Network Analyzer', 
    action: 'Analysis Run',
    timestamp: '2023-03-11 14:32:45',
    details: 'Complete analysis of Downtown Tower sector'
  },
  { 
    id: 'log-002', 
    user: 'Emily Johnson', 
    tool: 'Signal Mapper', 
    action: 'Map Generation',
    timestamp: '2023-03-09 10:15:22',
    details: 'Created signal map for North Region'
  },
  { 
    id: 'log-003', 
    user: 'Michael Chen', 
    tool: 'Config Generator', 
    action: 'Configuration Created',
    timestamp: '2023-03-07 16:42:11',
    details: 'Generated Industrial Zone configuration'
  },
  { 
    id: 'log-004', 
    user: 'Sarah Williams', 
    tool: 'Performance Tester', 
    action: 'Test Execution',
    timestamp: '2023-03-10 09:05:38',
    details: 'Ran benchmark tests on Suburban configuration'
  },
  { 
    id: 'log-005', 
    user: 'David Miller', 
    tool: 'Deployment Assistant', 
    action: 'Deployment',
    timestamp: '2023-03-01 11:30:17',
    details: 'Deployed configuration to Emergency Response units'
  },
  { 
    id: 'log-006', 
    user: 'Lisa Johnson', 
    tool: 'Network Analyzer', 
    action: 'Report Export',
    timestamp: '2023-03-11 15:22:33',
    details: 'Exported analysis report in PDF format'
  },
  { 
    id: 'log-007', 
    user: 'Ahmed Khan', 
    tool: 'Database Explorer', 
    action: 'Query Execution',
    timestamp: '2023-02-20 13:45:29',
    details: 'Retrieved historical configuration data for East zone'
  },
];

// Mock data for Parameters DataGrid
const mockParametersData = [
  { 
    id: 1,
    model: 'eNodeB',
    moClassName: 'RadioNetwork',
    parameterName: 'TransmitPower',
    seq: 1,
    parameterDescription: 'Maximum transmit power for radio interface',
    dataType: 'Integer',
    range: '20-46',
    default: '43',
    multiple: 'No',
    unit: 'dBm',
    resolution: '1',
    read: 'R/W',
    restrictions: 'None',
    managed: 'Yes',
    persistent: 'Yes',
    system: 'RAN',
    change: 'Auto',
    distribution: 'Global',
    dependencies: 'CellType',
    deployment: 'All',
    observations: '',
    precedence: 'Normal'
  },
  { 
    id: 2,
    model: 'eNodeB',
    moClassName: 'RadioNetwork',
    parameterName: 'AntennaGain',
    seq: 2,
    parameterDescription: 'Antenna gain for radio equipment',
    dataType: 'Integer',
    range: '0-30',
    default: '17',
    multiple: 'No',
    unit: 'dBi',
    resolution: '0.1',
    read: 'R/W',
    restrictions: 'None',
    managed: 'Yes',
    persistent: 'Yes',
    system: 'RAN',
    change: 'Manual',
    distribution: 'Site',
    dependencies: 'AntennaType',
    deployment: 'All',
    observations: '',
    precedence: 'Normal'
  },
  { 
    id: 3,
    model: 'MME',
    moClassName: 'Core',
    parameterName: 'ConnectionTimeout',
    seq: 3,
    parameterDescription: 'Timeout period for idle connections',
    dataType: 'Integer',
    range: '10-600',
    default: '30',
    multiple: 'No',
    unit: 'sec',
    resolution: '1',
    read: 'R/W',
    restrictions: 'None',
    managed: 'Yes',
    persistent: 'Yes',
    system: 'Core',
    change: 'Auto',
    distribution: 'Global',
    dependencies: 'NetworkType',
    deployment: 'All',
    observations: '',
    precedence: 'High'
  },
  { 
    id: 4,
    model: 'RNC',
    moClassName: 'Core',
    parameterName: 'MaxUsers',
    seq: 4,
    parameterDescription: 'Maximum number of concurrent users',
    dataType: 'Integer',
    range: '100-10000',
    default: '5000',
    multiple: 'No',
    unit: 'users',
    resolution: '100',
    read: 'R/W',
    restrictions: 'None',
    managed: 'Yes',
    persistent: 'Yes',
    system: 'Core',
    change: 'Manual',
    distribution: 'Site',
    dependencies: 'License',
    deployment: 'All',
    observations: '',
    precedence: 'Normal'
  },
  { 
    id: 5,
    model: 'eNodeB',
    moClassName: 'RadioNetwork',
    parameterName: 'InterferenceThreshold',
    seq: 5,
    parameterDescription: 'Threshold for interference detection',
    dataType: 'Integer',
    range: '-120-(-70)',
    default: '-95',
    multiple: 'No',
    unit: 'dBm',
    resolution: '1',
    read: 'R/W',
    restrictions: 'None',
    managed: 'Yes',
    persistent: 'Yes',
    system: 'RAN',
    change: 'Auto',
    distribution: 'Cell',
    dependencies: 'CellType',
    deployment: 'Urban',
    observations: '',
    precedence: 'Normal'
  },
  { 
    id: 6,
    model: 'gNodeB',
    moClassName: 'RadioNetwork',
    parameterName: 'BeamformingGain',
    seq: 6,
    parameterDescription: 'Additional gain from beamforming',
    dataType: 'Integer',
    range: '0-20',
    default: '10',
    multiple: 'No',
    unit: 'dB',
    resolution: '0.5',
    read: 'R/W',
    restrictions: 'None',
    managed: 'Yes',
    persistent: 'Yes',
    system: 'RAN',
    change: 'Auto',
    distribution: 'Cell',
    dependencies: 'AntennaType',
    deployment: '5G',
    observations: '',
    precedence: 'Normal'
  },
  { 
    id: 7,
    model: 'eNodeB',
    moClassName: 'RadioNetwork',
    parameterName: 'CellReselection',
    seq: 7,
    parameterDescription: 'Cell reselection parameters',
    dataType: 'Enum',
    range: 'Slow/Medium/Fast',
    default: 'Medium',
    multiple: 'No',
    unit: 'N/A',
    resolution: 'N/A',
    read: 'R/W',
    restrictions: 'None',
    managed: 'Yes',
    persistent: 'Yes',
    system: 'RAN',
    change: 'Manual',
    distribution: 'Global',
    dependencies: 'None',
    deployment: 'All',
    observations: '',
    precedence: 'Normal'
  },
];

// Add new styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2)
  }
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.75, 1.5),
    '& .MuiButton-startIcon': {
      marginRight: theme.spacing(0.5)
    }
  }
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 1.5,
    transition: 'all 0.2s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      }
    },
    '&.Mui-focused': {
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}`,
    }
  }
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  marginBottom: theme.spacing(3),
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    minHeight: '48px',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
    },
  },
  '& .MuiTabs-indicator': {
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const ConfigPanel = styled(Box)(({ theme }) => ({
  animation: 'fadeIn 0.5s ease-in-out',
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'translateY(10px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  }
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  fontWeight: 600,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
  }
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
  width: 42,
  height: 42,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: color ? alpha(color, 0.15) : alpha(theme.palette.primary.main, 0.15),
  color: color || theme.palette.primary.main,
  transition: 'transform 0.2s ease, background-color 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: color ? alpha(color, 0.2) : alpha(theme.palette.primary.main, 0.2),
  }
}));

// API base URL handling with better error checking and default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Utility function to get status color based on status value
const getStatusColor = (status, theme) => {
  // If theme is provided, return the theme color value
  if (theme) {
    switch(status) {
      case 'Published': return theme.palette.success.main;
      case 'Draft': return theme.palette.info.main;
      case 'Testing': return theme.palette.warning.main;
      case 'Analysis Run': return theme.palette.primary.main;
      case 'Map Generation': return theme.palette.secondary.main;
      case 'Configuration Created': return theme.palette.success.main;
      case 'Test Execution': return theme.palette.warning.main;
      case 'Deployment': return theme.palette.error.main;
      case 'Report Export': return theme.palette.info.main;
      case 'Query Execution': return theme.palette.secondary.main;
      default: return theme.palette.text.secondary;
    }
  }
  
  // For backwards compatibility, return strings when theme is not provided
  switch(status) {
    case 'Published': return 'success';
    case 'Draft': return 'info';
    case 'Testing': return 'warning';
    case 'Analysis Run': return 'primary';
    case 'Map Generation': return 'secondary';
    case 'Configuration Created': return 'success';
    case 'Test Execution': return 'warning';
    case 'Deployment': return 'error';
    case 'Report Export': return 'info';
    case 'Query Execution': return 'secondary';
    default: return 'text.secondary';
  }
};

const ConfigTools = () => {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [configurations, setConfigurations] = useState([]);
  const [configDetails, setConfigDetails] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [tools, setTools] = useState([]);
  const [usageLogs, setUsageLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [parametersLoading, setParametersLoading] = useState(true);
  const [nsdLoading, setNsdLoading] = useState(true);
  const [toolsLoading, setToolsLoading] = useState(true);
  const [usageLogsLoading, setUsageLogsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parametersError, setParametersError] = useState(null);
  const [nsdError, setNsdError] = useState(null);
  const [toolsError, setToolsError] = useState(null);
  const [usageLogsError, setUsageLogsError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [configViewMode, setConfigViewMode] = useState('grid'); // always use grid view
  const [toolsViewMode, setToolsViewMode] = useState('grid'); // 'grid' or 'list'
  const [toolCategoryFilter, setToolCategoryFilter] = useState('All');
  const [toolCategoryMenuAnchorEl, setToolCategoryMenuAnchorEl] = useState(null);
  const [showToolSpotlight, setShowToolSpotlight] = useState(true);
  const [dataFetched, setDataFetched] = useState({
    nsd: false,
    parameters: false,
    tools: false,
    usageLogs: false
  });
  const theme = useTheme();

  // Flag to disable API calls during development if needed
  // Set to true by default until backend API endpoints are ready
  const [useMockData, setUseMockData] = useState(true);

  // State for API data
  const [nsdData, setNSDData] = useState([]);
  const [nsdDetailsData, setNSDDetailsData] = useState([]);
  const [parametersData, setParametersData] = useState([]);
  const [toolsData, setToolsData] = useState([]);
  const [usageLogsData, setUsageLogsData] = useState([]);
  
  // Selected configuration for details view
  const [selectedConfigId, setSelectedConfigId] = useState(null);

  // Fetch NSD data from API
  const fetchNSDData = async () => {
    setNsdLoading(true);
    setNsdError(null);
    try {
      const response = await axios.get('/api/network-configurations/list');
      // Format the data to ensure it has proper id fields and standardize date formats
      const formattedData = response.data.map(item => ({
        ...item,
        // Ensure id is a string for consistency
        id: item.id.toString(),
        // Format the lastUpdated date if it's in ISO format
        lastUpdated: item.lastUpdated 
          ? (item.lastUpdated.includes('T') ? item.lastUpdated : new Date(item.lastUpdated).toISOString())
          : new Date().toISOString()
      }));
      setNSDData(formattedData);
      
      // Clear any selected config if we're refreshing the main list
      if (selectedConfigId && !formattedData.some(config => config.id.toString() === selectedConfigId.toString())) {
        setSelectedConfigId(null);
      }
    } catch (error) {
      console.error('Error fetching network configurations:', error);
      setNsdError('Failed to load configurations. Please try again later.');
      // Load mock data as fallback if API fails
      if (!useMockData) {
        setNSDData(mockConfigurations);
      }
    } finally {
      setNsdLoading(false);
    }
  };

  // Fetch NSD details data from API
  const fetchNSDDetailsData = async (configId) => {
    if (!configId) return;
    
    setNsdLoading(true);
    setNsdError(null);
    try {
      const response = await axios.get(`/api/network-configurations/details?configId=${configId}`);
      // Format the details data with proper id fields if needed
      const formattedDetails = response.data.map(item => ({
        ...item,
        id: item.id ? item.id.toString() : `detail-${Math.random().toString(36).substr(2, 9)}`
      }));
      setNSDDetailsData(formattedDetails);
    } catch (error) {
      console.error('Error fetching configuration details:', error);
      setNsdError('Failed to load configuration details. Please try again later.');
      // Load mock data as fallback if API fails
      if (!useMockData) {
        // Find the mock data for this configuration
        const mockDetails = mockConfigurationDetails.filter(
          detail => detail.configId.toString() === configId.toString()
        );
        setNSDDetailsData(mockDetails);
      }
    } finally {
      setNsdLoading(false);
    }
  };

  // Fetch parameters data from API
  const fetchParametersData = async () => {
    setParametersLoading(true);
    setParametersError(null);
    try {
      const response = await axios.get('/api/network-parameters/list');
      // Format boolean values as actual booleans if they're strings
      const formattedParameters = response.data.map(item => ({
        ...item,
        // Ensure id is a string
        id: item.id.toString(),
        // Convert boolean fields from strings if needed
        multiple: typeof item.multiple === 'string' 
          ? item.multiple.toLowerCase() === 'yes' || item.multiple.toLowerCase() === 'true'
          : Boolean(item.multiple),
        read: typeof item.read === 'string'
          ? item.read.toLowerCase().includes('r/w') || item.read.toLowerCase() === 'true'
          : Boolean(item.read),
        managed: typeof item.managed === 'string'
          ? item.managed.toLowerCase() === 'yes' || item.managed.toLowerCase() === 'true'
          : Boolean(item.managed),
        persistent: typeof item.persistent === 'string'
          ? item.persistent.toLowerCase() === 'yes' || item.persistent.toLowerCase() === 'true'
          : Boolean(item.persistent),
        system: typeof item.system === 'string'
          ? item.system.toLowerCase() === 'yes' || item.system.toLowerCase() === 'true'
          : Boolean(item.system)
      }));
      setParametersData(formattedParameters);
    } catch (error) {
      console.error('Error fetching parameters:', error);
      setParametersError('Failed to load parameters. Please try again later.');
      // Load mock data as fallback if API fails
      if (!useMockData) {
        // Create basic mock data if API fails
        const mockParams = [
          {
            id: 'mock-param-1',
            model: 'Generic',
            moClassName: 'System',
            parameterName: 'StatusCheck',
            parameterDescription: 'System recovered after API failure - using mock data',
            dataType: 'Boolean',
            default: 'true',
            multiple: false,
            read: true,
            managed: true
          }
        ];
        setParametersData(mockParams);
      }
    } finally {
      setParametersLoading(false);
    }
  };

  // Fetch tools data from API
  const fetchToolsData = async () => {
    setToolsLoading(true);
    setToolsError(null);
    try {
      const response = await axios.get('/api/network-tools/list');
      setToolsData(response.data);
    } catch (error) {
      console.error('Error fetching tools:', error);
      setToolsError('Failed to load tools. Please try again later.');
    } finally {
      setToolsLoading(false);
    }
  };

  // Fetch usage logs data from API
  const fetchUsageLogs = async () => {
    setUsageLogsLoading(true);
    setUsageLogsError(null);
    try {
      const response = await axios.get('/api/network-configurations/usage-logs');
      // Format the data to ensure it has proper id fields
      const formattedLogs = response.data.map(item => ({
        ...item,
        id: item.id.toString()
      }));
      setUsageLogsData(formattedLogs);
    } catch (error) {
      console.error('Error fetching usage logs:', error);
      setUsageLogsError('Failed to load change history. Please try again later.');
      // Load mock data as fallback if API fails
      if (!useMockData) {
        // Create some basic mock data if we don't have any
        const mockLogs = [
          {
            id: 'mock-log-1',
            timestamp: new Date().toISOString(),
            user: 'system',
            action: 'System Recovery',
            configId: '',
            configName: 'All Configurations',
            details: 'System recovered after API failure - using mock data'
          }
        ];
        setUsageLogsData(mockLogs);
      }
    } finally {
      setUsageLogsLoading(false);
    }
  };

  // Load data based on active tab
  useEffect(() => {
    // Only fetch data if user is authenticated
    // In a real app, you might want to check auth status here
    const isAuthenticated = true; // Mock auth check
    
    if (!isAuthenticated) return;
    
    if (tabValue === 0) { // NSD tab
      fetchNSDData();
      if (selectedConfigId) {
        fetchNSDDetailsData(selectedConfigId);
      }
    } else if (tabValue === 1) { // Parameters tab
      fetchParametersData();
    } else if (tabValue === 2) { // Change History tab
      fetchUsageLogs();
    }
    
    // Fetch tools data for tools tab if it exists
    // This would be used if you restore the Tools tab in future
    // if (tabValue === 3) {
    //   fetchToolsData();
    // }
  }, [tabValue, selectedConfigId]);

  // Handle configuration selection
  const handleConfigSelect = (configId) => {
    setSelectedConfigId(configId);
    fetchNSDDetailsData(configId);
    // Switch to the first tab to display configuration details
    setTabValue(0);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Load appropriate data for the selected tab
    if (newValue === 1 && !dataFetched.parameters) {
      fetchParametersData();
      setDataFetched(prev => ({ ...prev, parameters: true }));
    } else if (newValue === 2 && !dataFetched.usageLogs) {
      fetchUsageLogs();
      setDataFetched(prev => ({ ...prev, usageLogs: true }));
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleEdit = () => {
    console.log(`Edit item with ID: ${selectedId}`);
    handleMenuClose();
  };

  // Let's fix the edit handler when called directly
  const handleEditDirect = (id) => {
    console.log(`Edit item with ID: ${id}`);
    // Add future edit functionality here
  };

  const handleDelete = () => {
    console.log(`Delete item with ID: ${selectedId}`);
    handleMenuClose();
  };

  // Get the right data based on the view mode and search query
  const filteredConfigurations = searchQuery.length > 0
    ? configurations.filter(config => 
        config.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        config.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        config.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    : configurations;
  
  const filteredConfigurationDetails = searchQuery.length > 0
    ? configDetails.filter(config => 
        config.moClassName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        config.parameterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        config.thorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        config.thorView.toLowerCase().includes(searchQuery.toLowerCase()) ||
        config.condition1.toLowerCase().includes(searchQuery.toLowerCase()) ||
        config.condition2.toLowerCase().includes(searchQuery.toLowerCase()) ||
        config.nbnCoValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (config.comments && config.comments.toLowerCase().includes(searchQuery.toLowerCase())))
    : configDetails;

  // Get unique tool categories from actual tools data
  const toolCategories = ['All', ...Array.from(new Set(tools.map(tool => tool.category)))];

  // Filter tools based on search query and category filter
  const filteredTools = tools.filter((tool) => {
    const searchStr = searchQuery.toLowerCase();
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchStr) ||
      tool.description.toLowerCase().includes(searchStr) ||
      tool.category.toLowerCase().includes(searchStr);
    
    const matchesCategory = toolCategoryFilter === 'All' || tool.category === toolCategoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Filter usage logs based on search
  const filteredUsageLogs = usageLogsData.filter(log => {
    if (!searchQuery) return true;
    const searchStr = searchQuery.toLowerCase();
    return (
      log.user.toLowerCase().includes(searchStr) ||
      log.tool.toLowerCase().includes(searchStr) ||
      log.action.toLowerCase().includes(searchStr) ||
      (log.details && typeof log.details === 'string' && log.details.toLowerCase().includes(searchStr))
    );
  });

  // Filter parameters based on search query
  const filteredParameters = searchQuery.length > 0
    ? parameters.filter(param => 
        param.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        param.moClassName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        param.parameterName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        param.parameterDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        param.dependencies?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        param.deployment?.toLowerCase().includes(searchQuery.toLowerCase()))
    : parameters;

  // Find most used tools for spotlight section (top 3)
  const spotlightTools = [...tools].sort((a, b) => b.usageCount - a.usageCount).slice(0, 3);

  // Render tools spotlight section
  const renderToolsSpotlight = () => (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Frequently Used Tools
        </Typography>
        <Button 
          size="small" 
          onClick={() => setShowToolSpotlight(false)}
          startIcon={<CloseIcon />}
        >
          Hide
        </Button>
      </Box>
      {toolsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : toolsError ? (
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={fetchToolsData}>
              Retry
            </Button>
          }
        >
          {toolsError}
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {spotlightTools.map((tool) => (
            <Grid item xs={12} md={4} key={`spotlight-${tool.id}`}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  border: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: tool.color,
                    boxShadow: `0 0 0 1px ${tool.color}40`
                  },
                  height: '100%'
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: `${tool.color}15`, 
                    color: tool.color,
                    width: 48,
                    height: 48,
                    mr: 2
                  }}
                >
                  {tool.icon}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {tool.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {tool.category}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ 
                      borderColor: tool.color,
                      color: tool.color,
                      '&:hover': {
                        borderColor: tool.color,
                        bgcolor: `${tool.color}10`
                      }
                    }}
                    startIcon={<LaunchIcon fontSize="small" />}
                  >
                    Quick Launch
                  </Button>
                </Box>
                <Badge 
                  badgeContent={tool.usageCount} 
                  color="primary"
                  sx={{ ml: 1 }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  // Render configuration grid for NSD tab
  const renderConfigurationGrid = () => (
    <Paper 
      elevation={1} 
      sx={{ 
        height: { xs: 'calc(100vh - 500px)', sm: 'calc(100vh - 450px)', md: 'calc(100vh - 400px)' }, 
        minHeight: { xs: 300, sm: 350, md: 400 },
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: (theme) => `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
        mb: 3, // Add bottom margin for better spacing
      }}
    >
      {nsdLoading ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          p: 4
        }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Loading network configurations...
          </Typography>
        </Box>
      ) : nsdError ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          p: 4
        }}>
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {nsdError}
          </Alert>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={fetchNSDData}
          >
            Retry
          </Button>
        </Box>
      ) : (
        <DataGrid
          rows={selectedConfigId ? filteredConfigurationDetails : nsdData}
          columns={selectedConfigId ? [
            { 
              field: 'moClassName', 
              headerName: 'MO Class Name', 
              flex: 1, 
              minWidth: 150,
              headerClassName: 'grid-header'
            },
            { 
              field: 'parameterName', 
              headerName: 'Parameter Name', 
              flex: 1, 
              minWidth: 150,
              headerClassName: 'grid-header' 
            },
            { 
              field: 'thorView', 
              headerName: 'Thor View', 
              flex: 1, 
              minWidth: 150,
              headerClassName: 'grid-header' 
            },
            { 
              field: 'thorName', 
              headerName: 'Thor Name', 
              flex: 1, 
              minWidth: 150,
              headerClassName: 'grid-header' 
            },
            { 
              field: 'condition1', 
              headerName: 'Condition 1', 
              flex: 1, 
              minWidth: 150,
              headerClassName: 'grid-header' 
            },
            { 
              field: 'condition2', 
              headerName: 'Condition 2', 
              flex: 1, 
              minWidth: 150,
              headerClassName: 'grid-header' 
            },
            { 
              field: 'nbnCoValue', 
              headerName: 'NBN Co Value', 
              flex: 1, 
              minWidth: 150,
              headerClassName: 'grid-header' 
            },
            { 
              field: 'comments', 
              headerName: 'Comments', 
              flex: 1.5, 
              minWidth: 200,
              headerClassName: 'grid-header' 
            }
          ] : [
            { 
              field: 'name', 
              headerName: 'Configuration Name', 
              flex: 1.5, 
              minWidth: 200,
              headerClassName: 'grid-header',
              renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: theme => getStatusColor(params.row.status, theme), 
                      width: 32, 
                      height: 32,
                      mr: 1.5,
                      fontSize: '0.875rem'
                    }}
                  >
                    {params.row.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {params.row.name}
                  </Typography>
                </Box>
              )
            },
            { 
              field: 'description', 
              headerName: 'Description', 
              flex: 2, 
              minWidth: 250,
              headerClassName: 'grid-header' 
            },
            { 
              field: 'version', 
              headerName: 'Version', 
              width: 120,
              headerClassName: 'grid-header' 
            },
            { 
              field: 'lastUpdated', 
              headerName: 'Last Updated', 
              width: 180,
              headerClassName: 'grid-header',
              valueFormatter: (params) => {
                if (!params.value) return '';
                return new Date(params.value).toLocaleString();
              }
            },
            { 
              field: 'status', 
              headerName: 'Status', 
              width: 150,
              headerClassName: 'grid-header',
              renderCell: (params) => (
                <Chip 
                  label={params.value}
                  size="small"
                  sx={{ 
                    backgroundColor: alpha(getStatusColor(params.value, theme), 0.1),
                    color: getStatusColor(params.value, theme),
                    fontWeight: 600,
                    borderRadius: '4px'
                  }}
                />
              )
            },
            {
              field: 'actions',
              headerName: 'Actions',
              width: 120,
              headerClassName: 'grid-header',
              sortable: false,
              filterable: false,
              renderCell: (params) => (
                <Box>
                  <Tooltip title="View Details">
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row selection
                        handleConfigSelect(params.row.id);
                      }}
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1)
                        }
                      }}
                    >
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row selection
                        handleEditDirect(params.row.id);
                      }}
                      sx={{ 
                        color: 'secondary.main',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.secondary.main, 0.1)
                        }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )
            }
          ]}
          slots={{
            toolbar: CustomGridToolbar,
            noRowsOverlay: () => (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: 2 }}>
                <FolderOpenIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No configurations found
                </Typography>
                <Button variant="text" startIcon={<AddIcon />} sx={{ mt: 2 }}>
                  Create New Configuration
                </Button>
              </Box>
            ),
          }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 },
            },
            sorting: {
              sortModel: [{ field: 'lastUpdated', sort: 'desc' }],
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          onRowClick={selectedConfigId ? undefined : (params) => handleConfigSelect(params.row.id)}
          sx={{
            '& .MuiDataGrid-root': {
              border: 'none',
            },
            '& .grid-header': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              color: 'text.primary',
              fontWeight: 600,
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            },
            '& .MuiDataGrid-row.Mui-selected': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
              },
            },
          }}
        />
      )}
    </Paper>
  );

  // Custom Grid Toolbar component to replace the default one
  const CustomGridToolbar = () => {
    const theme = useTheme(); // Add theme here to ensure it's accessible
    
    return (
      <GridToolbarContainer sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, flexGrow: 1, flexWrap: 'wrap' }}>
            <GridToolbarQuickFilter 
              sx={{ 
                width: { xs: '100%', sm: 'auto' }, 
                minWidth: { sm: '250px' },
                '& .MuiInputBase-root': {
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.common.white, 0.9),
                }
              }}
            />
            <GridToolbarFilterButton sx={{ borderRadius: 2 }} />
            <GridToolbarColumnsButton sx={{ borderRadius: 2 }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap' }}>
            <GridToolbarExport sx={{ borderRadius: 2 }} />
            <GridToolbarDensitySelector sx={{ borderRadius: 2 }} />
          </Box>
        </Box>
      </GridToolbarContainer>
    );
  };

  if (authLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: '#f5f5f5' 
      }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Authentication in progress</Typography>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Please wait...
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <MainLayout title="Network Configuration" icon={<SettingsIcon />}>
      <Head>
        <title>Network Configuration</title>
      </Head>
      <Box sx={{ 
        pb: 5, 
        animation: 'fadeIn 0.5s ease-in-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      }}>
        {/* Page header with title and actions */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          flexWrap="wrap"
          sx={{ 
            mb: 3,
            p: { xs: 1.5, sm: 2 },
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(8px)',
            boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.05)}`,
          }}
        >
          <Box display="flex" alignItems="center" sx={{ mb: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}>
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main', 
                width: 36, 
                height: 36,
                mr: 1.5,
                display: { xs: 'flex', sm: 'flex' }
              }}
            >
              <SettingsIcon fontSize="small" />
            </Avatar>
            <div>
              <Typography variant="h5" component="h1" fontWeight={600} sx={{ 
                transition: 'color 0.2s ease',
                '&:hover': { color: 'primary.main' },
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}>
                Network Configuration
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {selectedConfigId ? 'Viewing configuration details' : 'Manage network configurations and parameters'}
              </Typography>
            </div>
          </Box>
          
          <Box display="flex" gap={1} sx={{ 
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'space-between', sm: 'flex-end' }
          }}>
            {selectedConfigId && (
              <AnimatedButton
                variant="outlined"
                startIcon={<KeyboardArrowDownIcon />}
                onClick={() => setSelectedConfigId(null)}
                sx={{ 
                  flex: { xs: '1 1 auto', sm: '0 0 auto' }
                }}
                size="small"
              >
                Back to List
              </AnimatedButton>
            )}
            <AnimatedButton
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ 
                flex: { xs: '1 1 auto', sm: '0 0 auto' },
                display: selectedConfigId ? 'none' : 'flex'
              }}
              size="small"
            >
              New Configuration
            </AnimatedButton>
            <AnimatedButton
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={selectedConfigId ? () => fetchNSDDetailsData(selectedConfigId) : fetchNSDData}
              sx={{ flex: { xs: '1 1 auto', sm: '0 0 auto' } }}
              size="small"
            >
              Refresh
            </AnimatedButton>
            <Tooltip title={useMockData ? "Switch to API data" : "Switch to mock data"}>
              <AnimatedButton
                variant="outlined"
                color={useMockData ? "secondary" : "primary"}
                startIcon={useMockData ? <StorageIcon /> : <CloudIcon />}
                onClick={() => setUseMockData(!useMockData)}
                sx={{ flex: { xs: '1 1 auto', sm: '0 0 auto' } }}
                size="small"
              >
                {useMockData ? "Mock Data" : "API Data"}
              </AnimatedButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Data Source Indicator */}
        {useMockData && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.05)}`,
            }}
            icon={<StorageIcon />}
          >
            <AlertTitle>Using Mock Data</AlertTitle>
            You are currently viewing mock data. API calls to the backend are disabled. 
            <Button 
              color="info" 
              size="small" 
              sx={{ mt: 1 }}
              onClick={() => setUseMockData(false)}
            >
              Switch to API data
            </Button>
          </Alert>
        )}
        
        {/* API Error Banner */}
        {!useMockData && (nsdError || parametersError || toolsError || usageLogsError) && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              boxShadow: `0 2px 10px ${alpha(theme.palette.common.black, 0.05)}`,
            }}
            icon={<InfoIcon />}
            action={
              <Button color="warning" size="small" onClick={() => setUseMockData(true)}>
                Switch to Mock Data
              </Button>
            }
          >
            <AlertTitle>API Connection Issues</AlertTitle>
            Some API endpoints are not available. The application is using mock data for these components. 
            Check the console for more details or click the "Switch to Mock Data" button.
          </Alert>
        )}

        {/* Show breadcrumb when viewing a specific configuration */}
        {selectedConfigId && (
          <Breadcrumbs sx={{ 
            mb: 2, 
            p: 1, 
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.5),
          }}>
            <Link
              component="button"
              variant="body2"
              color="inherit"
              onClick={() => setSelectedConfigId(null)}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              <SettingsIcon sx={{ mr: 0.5 }} fontSize="small" />
              Network Configurations
            </Link>
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
              {nsdData.find(config => config.id === selectedConfigId)?.name || 'Configuration Details'}
            </Typography>
          </Breadcrumbs>
        )}

        {/* Tabs Navigation */}
        <StyledTabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="configuration tabs"
          sx={{
            mb: 3,
            '& .MuiTabs-flexContainer': {
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          <StyledTab 
            label={<Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SettingsIcon sx={{ mr: { xs: 0.5, sm: 1 } }} />
              <span>Network Configurations</span>
            </Box>}
            sx={{ 
              fontWeight: 500,
              textTransform: 'none',
              minHeight: { xs: 40, sm: 48 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          />
          <StyledTab 
            label={<Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BuildIcon sx={{ mr: { xs: 0.5, sm: 1 } }} />
              <span>Parameters</span>
            </Box>}
            sx={{ 
              fontWeight: 500,
              textTransform: 'none',
              minHeight: { xs: 40, sm: 48 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          />
          <StyledTab 
            label={<Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HistoryIcon sx={{ mr: { xs: 0.5, sm: 1 } }} />
              <span>Change History</span>
            </Box>}
            sx={{ 
              fontWeight: 500,
              textTransform: 'none',
              minHeight: { xs: 40, sm: 48 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          />
        </StyledTabs>

        {/* Search and Filters */}
        <Paper 
          elevation={0} 
          sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: { xs: 1.5, sm: 2 },
            mb: 3,
            borderRadius: 3,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
            backdropFilter: 'blur(8px)',
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.common.black, 0.04)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: 'auto' }, mb: { xs: 2, sm: 0 } }}>
            <SearchTextField
              placeholder="Search configurations..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: { sm: 240, md: 300 } }}
            />
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton 
              size="small"
              sx={{
                borderRadius: 2,
                p: 1,
                backgroundColor: theme => alpha(theme.palette.primary.main, 0.05),
                color: 'primary.main',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <FilterListIcon />
            </IconButton>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<ViewModuleIcon />}
                sx={{ 
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Table
              </Button>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                color="primary"
              >
                <ViewModuleIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* Main Content Tabs */}
        {tabValue === 0 && (
          <ConfigPanel>
            {renderConfigurationGrid()}
          </ConfigPanel>
        )}
        
        {tabValue === 1 && (
          <ConfigPanel>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Network Parameters
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure network parameters and settings for all network elements. Use filters and sorting to find specific parameters.
              </Typography>
              
              {selectedConfigId && (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    boxShadow: (theme) => `0 2px 10px ${alpha(theme.palette.common.black, 0.05)}`,
                  }}
                >
                  <AlertTitle>Filtered Parameters</AlertTitle>
                  Showing parameters for configuration: {nsdData.find(config => config.id === selectedConfigId)?.name || 'Selected Configuration'}
                  <Button 
                    size="small" 
                    sx={{ mt: 1 }}
                    startIcon={<FilterListIcon />}
                    onClick={() => setSelectedConfigId(null)}
                  >
                    Clear Filter
                  </Button>
                </Alert>
              )}
              
              <Paper 
                elevation={1} 
                sx={{ 
                  height: 'calc(100vh - 300px)', 
                  minHeight: 500,
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: (theme) => `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
                }}
              >
                {parametersLoading ? (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                    p: 4
                  }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Loading parameters data...
                    </Typography>
                  </Box>
                ) : parametersError ? (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                    p: 4
                  }}>
                    <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                      {parametersError}
                    </Alert>
                    <Button 
                      variant="outlined" 
                      startIcon={<RefreshIcon />}
                      onClick={fetchParametersData}
                    >
                      Retry
                    </Button>
                  </Box>
                ) : (
                  <DataGrid
                    rows={parametersData}
                    columns={[
                      { 
                        field: 'model', 
                        headerName: 'Model', 
                        width: 120,
                        renderCell: (params) => (
                          <Chip 
                            label={params.value || 'Generic'}
                            size="small"
                            sx={{ 
                              fontSize: '0.75rem',
                              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                              color: 'primary.main'
                            }}
                          />
                        )
                      },
                      { field: 'moClassName', headerName: 'MO Class Name', width: 150 },
                      { field: 'parameterName', headerName: 'Parameter Name', width: 180 },
                      { field: 'seq', headerName: 'Seq', width: 80 },
                      { field: 'parameterDescription', headerName: 'Parameter Description', width: 250 },
                      { field: 'dataType', headerName: 'Data Type', width: 120 },
                      { field: 'range', headerName: 'Range', width: 120 },
                      { field: 'default', headerName: 'Default', width: 120 },
                      { 
                        field: 'multiple', 
                        headerName: 'Multiple', 
                        width: 100,
                        type: 'boolean',
                        renderCell: (params) => (
                          <Chip 
                            label={params.value ? 'Yes' : 'No'}
                            size="small"
                            sx={{ 
                              fontSize: '0.75rem',
                              backgroundColor: (theme) => alpha(
                                params.value ? theme.palette.success.main : theme.palette.grey[500],
                                0.1
                              ),
                              color: (theme) => params.value ? theme.palette.success.main : theme.palette.grey[700]
                            }}
                          />
                        )
                      },
                      { field: 'unit', headerName: 'Unit', width: 100 },
                      { field: 'resolution', headerName: 'Resolution', width: 120 },
                      { 
                        field: 'read', 
                        headerName: 'Read', 
                        width: 100, 
                        type: 'boolean',
                        renderCell: (params) => (
                          <Chip 
                            label={params.value ? 'Yes' : 'No'}
                            size="small"
                            sx={{ 
                              fontSize: '0.75rem',
                              backgroundColor: (theme) => alpha(
                                params.value ? theme.palette.success.main : theme.palette.grey[500],
                                0.1
                              ),
                              color: (theme) => params.value ? theme.palette.success.main : theme.palette.grey[700]
                            }}
                          />
                        )
                      },
                      { field: 'restrictions', headerName: 'Restrictions', width: 120 },
                      { 
                        field: 'managed', 
                        headerName: 'Managed', 
                        width: 100,
                        type: 'boolean',
                        renderCell: (params) => (
                          <Chip 
                            label={params.value ? 'Yes' : 'No'}
                            size="small"
                            sx={{ 
                              fontSize: '0.75rem',
                              backgroundColor: (theme) => alpha(
                                params.value ? theme.palette.success.main : theme.palette.grey[500],
                                0.1
                              ),
                              color: (theme) => params.value ? theme.palette.success.main : theme.palette.grey[700]
                            }}
                          />
                        )
                      },
                      { field: 'persistent', headerName: 'Persistent', width: 120, type: 'boolean' },
                      { field: 'system', headerName: 'System', width: 120, type: 'boolean' },
                      { field: 'change', headerName: 'Change', width: 120 },
                      { field: 'distribution', headerName: 'Distribution', width: 120 },
                      { field: 'dependencies', headerName: 'Dependencies', width: 150 },
                      { field: 'deployment', headerName: 'Deployment', width: 120 },
                      { field: 'observations', headerName: 'Observations', width: 150 },
                      { field: 'precedence', headerName: 'Precedence', width: 120 },
                    ]}
                    slots={{
                      toolbar: GridToolbar,
                    }}
                    slotProps={{
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 300 },
                      },
                    }}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 25 },
                      },
                      columns: {
                        // Only show commonly used columns by default
                        columnVisibilityModel: {
                          seq: false,
                          resolution: false,
                          restrictions: false,
                          persistent: false,
                          system: false,
                          change: false,
                          distribution: false,
                          dependencies: false,
                          deployment: false,
                          observations: false,
                          precedence: false,
                        },
                      },
                    }}
                    pageSizeOptions={[10, 25, 50, 100]}
                    density="compact"
                    onRowClick={selectedConfigId ? undefined : (params) => handleConfigSelect(params.row.id)}
                  />
                )}
              </Paper>
            </Box>
          </ConfigPanel>
        )}
        
        {tabValue === 2 && (
          <ConfigPanel>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Configuration Change History
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Track all changes made to network configurations over time. View details about who made changes, when they were made, and what was modified.
              </Typography>
              
              {selectedConfigId && (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    boxShadow: (theme) => `0 2px 10px ${alpha(theme.palette.common.black, 0.05)}`,
                  }}
                >
                  <AlertTitle>Filtered History</AlertTitle>
                  Showing history for configuration: {nsdData.find(config => config.id === selectedConfigId)?.name || 'Selected Configuration'}
                  <Button 
                    size="small" 
                    sx={{ mt: 1 }}
                    startIcon={<FilterListIcon />}
                    onClick={() => setSelectedConfigId(null)}
                  >
                    Clear Filter
                  </Button>
                </Alert>
              )}
              
              <Paper 
                elevation={1} 
                sx={{ 
                  height: 'calc(100vh - 300px)', 
                  minHeight: 500,
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: (theme) => `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
                }}
              >
                {usageLogsLoading ? (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                    p: 4
                  }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Loading change history...
                    </Typography>
                  </Box>
                ) : usageLogsError ? (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                    p: 4
                  }}>
                    <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                      {usageLogsError}
                    </Alert>
                    <Button 
                      variant="outlined" 
                      startIcon={<RefreshIcon />}
                      onClick={fetchUsageLogs}
                    >
                      Retry
                    </Button>
                  </Box>
                ) : (
                  <DataGrid
                    rows={usageLogsData.filter(log => 
                      !selectedConfigId || log.configId === selectedConfigId
                    )}
                    columns={[
                      { 
                        field: 'timestamp', 
                        headerName: 'Timestamp', 
                        width: 180,
                        valueFormatter: (params) => {
                          if (!params.value) return '';
                          return new Date(params.value).toLocaleString();
                        }
                      },
                      { 
                        field: 'user', 
                        headerName: 'User', 
                        width: 180,
                        renderCell: (params) => (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                width: 24, 
                                height: 24, 
                                mr: 1,
                                fontSize: '0.75rem',
                                bgcolor: (theme) => {
                                  const hash = params.value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                                  const colors = [
                                    theme.palette.primary.main,
                                    theme.palette.secondary.main,
                                    theme.palette.success.main,
                                    theme.palette.warning.main,
                                    theme.palette.info.main
                                  ];
                                  return colors[hash % colors.length];
                                }
                              }}
                            >
                              {params.value.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2">{params.value}</Typography>
                          </Box>
                        )
                      },
                      { 
                        field: 'action', 
                        headerName: 'Action', 
                        width: 150,
                        renderCell: (params) => (
                          <Chip 
                            label={params.value}
                            size="small"
                            sx={{ 
                              fontSize: '0.75rem',
                              backgroundColor: (theme) => {
                                if (params.value.includes('Create')) return alpha(theme.palette.success.main, 0.1);
                                if (params.value.includes('Update')) return alpha(theme.palette.info.main, 0.1);
                                if (params.value.includes('Delete')) return alpha(theme.palette.error.main, 0.1);
                                return alpha(theme.palette.grey[500], 0.1);
                              },
                              color: (theme) => {
                                if (params.value.includes('Create')) return theme.palette.success.main;
                                if (params.value.includes('Update')) return theme.palette.info.main;
                                if (params.value.includes('Delete')) return theme.palette.error.main;
                                return theme.palette.grey[700];
                              }
                            }}
                          />
                        )
                      },
                      { 
                        field: 'configName', 
                        headerName: 'Configuration', 
                        flex: 1,
                        minWidth: 180,
                        renderCell: (params) => (
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {params.value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {params.row.configId}
                            </Typography>
                          </Box>
                        )
                      },
                      { field: 'details', headerName: 'Details', flex: 2, minWidth: 250 },
                      {
                        field: 'actions',
                        headerName: 'Actions',
                        width: 120,
                        sortable: false,
                        filterable: false,
                        renderCell: (params) => (
                          <Box>
                            <Tooltip title="View Configuration">
                              <IconButton 
                                size="small" 
                                onClick={() => handleConfigSelect(params.row.configId)}
                                sx={{ 
                                  color: 'primary.main',
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                  }
                                }}
                              >
                                <InfoIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )
                      }
                    ]}
                    slots={{
                      toolbar: GridToolbar,
                    }}
                    slotProps={{
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 300 },
                      },
                    }}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 25 },
                      },
                      sorting: {
                        sortModel: [{ field: 'timestamp', sort: 'desc' }],
                      },
                    }}
                    pageSizeOptions={[10, 25, 50, 100]}
                    onRowClick={selectedConfigId ? undefined : (params) => handleConfigSelect(params.row.id)}
                  />
                )}
              </Paper>
            </Box>
          </ConfigPanel>
        )}
      </Box>
    </MainLayout>
  );
};

export default ConfigTools; 