import React, { useState, useEffect } from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { implementationAPI } from '../lib/api';
import useMediaQuery from '@mui/material/useMediaQuery';

// MUI X Data Grid
import { DataGrid, GridToolbar, GridActionsCellItem } from '@mui/x-data-grid';

// Material UI components
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SettingsIcon from '@mui/icons-material/Settings';
import TuneIcon from '@mui/icons-material/Tune';
import PersonIcon from '@mui/icons-material/Person';
import EngineeringIcon from '@mui/icons-material/Engineering';
import FolderIcon from '@mui/icons-material/Folder';
import CommentIcon from '@mui/icons-material/Comment';
import NetworkCellIcon from '@mui/icons-material/NetworkCell';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AlertTitle from '@mui/material/AlertTitle';

// Mock data for implementation tasks
const mockImplementationTasks = [
  {
    id: 1,
    category: 'Retunes',
    siteName: 'Alpha Site',
    nodeId: 'eNB-12345',
    implementor: 'John Doe',
    status: 'Done',
    comments: 'Successfully completed',
    enmScriptsPath: '/scripts/retunes/alpha_site_202304.enm',
    dateCreated: '2023-04-10',
    lastUpdated: '2023-04-15'
  },
  {
    id: 2,
    category: 'Parameters',
    siteName: 'Beta Site',
    nodeId: 'gNB-67890',
    implementor: 'Jane Smith',
    status: 'Done_With_Errors',
    comments: 'Completed with minor parameter issues',
    enmScriptsPath: '/scripts/parameters/beta_site_202304.enm',
    dateCreated: '2023-04-12',
    lastUpdated: '2023-04-18'
  },
  {
    id: 3,
    category: 'ENDC_associations',
    siteName: 'Gamma Site',
    nodeId: 'eNB-54321',
    implementor: 'Robert Johnson',
    status: 'Planned',
    comments: 'Scheduled for next maintenance window',
    enmScriptsPath: '/scripts/endc/gamma_site_202304.enm',
    dateCreated: '2023-04-14',
    lastUpdated: '2023-04-14'
  },
  {
    id: 4,
    category: 'nr-nr_associations',
    siteName: 'Delta Site',
    nodeId: 'gNB-09876',
    implementor: 'Emily Chen',
    status: 'Oustanding',
    comments: 'Delayed due to hardware issues',
    enmScriptsPath: '/scripts/nr-nr/delta_site_202304.enm',
    dateCreated: '2023-04-08',
    lastUpdated: '2023-04-20'
  },
  {
    id: 5,
    category: 'Retunes',
    siteName: 'Epsilon Site',
    nodeId: 'eNB-13579',
    implementor: 'Michael Brown',
    status: 'Done',
    comments: 'Completed ahead of schedule',
    enmScriptsPath: '/scripts/retunes/epsilon_site_202304.enm',
    dateCreated: '2023-04-05',
    lastUpdated: '2023-04-07'
  },
  {
    id: 6,
    category: 'Parameters',
    siteName: 'Zeta Site',
    nodeId: 'gNB-24680',
    implementor: 'Sarah Williams',
    status: 'Planned',
    comments: 'Waiting for approval',
    enmScriptsPath: '/scripts/parameters/zeta_site_202304.enm',
    dateCreated: '2023-04-18',
    lastUpdated: '2023-04-18'
  },
  {
    id: 7,
    category: 'ENDC_associations',
    siteName: 'Eta Site',
    nodeId: 'eNB-97531',
    implementor: 'David Lee',
    status: 'Done_With_Errors',
    comments: 'Issues with X2 interface',
    enmScriptsPath: '/scripts/endc/eta_site_202304.enm',
    dateCreated: '2023-04-03',
    lastUpdated: '2023-04-12'
  },
  {
    id: 8,
    category: 'nr-nr_associations',
    siteName: 'Theta Site',
    nodeId: 'gNB-86420',
    implementor: 'Jennifer Martinez',
    status: 'Done',
    comments: 'Successfully implemented',
    enmScriptsPath: '/scripts/nr-nr/theta_site_202304.enm',
    dateCreated: '2023-04-07',
    lastUpdated: '2023-04-10'
  },
  {
    id: 9,
    category: 'Retunes',
    siteName: 'Iota Site',
    nodeId: 'eNB-11111',
    implementor: 'Daniel Wilson',
    status: 'Oustanding',
    comments: 'Awaiting equipment delivery',
    enmScriptsPath: '/scripts/retunes/iota_site_202304.enm',
    dateCreated: '2023-04-01',
    lastUpdated: '2023-04-22'
  },
  {
    id: 10,
    category: 'Parameters',
    siteName: 'Kappa Site',
    nodeId: 'gNB-22222',
    implementor: 'Michelle Taylor',
    status: 'Done',
    comments: 'Parameter updates complete',
    enmScriptsPath: '/scripts/parameters/kappa_site_202304.enm',
    dateCreated: '2023-04-15',
    lastUpdated: '2023-04-17'
  }
];

// Engineers list
const engineers = [
  'John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Chen', 'Michael Brown',
  'Sarah Williams', 'David Lee', 'Jennifer Martinez', 'Daniel Wilson', 'Michelle Taylor'
];

// Categories
const categories = ['Retunes', 'Parameters', 'ENDC_associations', 'nr-nr_associations'];

// Statuses
const statuses = ['Planned', 'Done', 'Done_With_Errors', 'Oustanding'];

// Table columns definition
const columns = [
  { id: 'category', label: 'Category', sortable: true },
  { id: 'siteName', label: 'Site Name', sortable: true },
  { id: 'nodeId', label: 'eNB/gNB', sortable: true },
  { id: 'implementor', label: 'Implementor', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'comments', label: 'Comments', sortable: true },
  { id: 'enmScriptsPath', label: 'ENM Scripts Path', sortable: true },
  { id: 'actions', label: 'Actions', sortable: false }
];

// Add new styled components and enhance existing ones
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
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
  },
  '&:active': {
    transform: 'translateY(-1px)',
    boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  marginTop: theme.spacing(3),
  overflow: 'hidden',
  '& .MuiTableCell-head': {
    backgroundColor: alpha(theme.palette.background.default, 0.8),
    fontWeight: 600,
    padding: theme.spacing(1.5, 2),
  },
  '& .MuiTableRow-root': {
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  },
  '& .MuiTableCell-root': {
    padding: theme.spacing(1.5, 2),
    fontSize: '0.875rem',
    transition: 'background-color 0.2s ease',
  },
  '& .MuiTablePagination-root': {
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiTableCell-root': {
      padding: theme.spacing(1, 1.5),
    }
  }
}));

const TabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 0),
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

const StatsCard = styled(Paper)(({ theme, color }) => ({
  height: '100%',
  padding: theme.spacing(2.5),
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: color ? alpha(color, 0.06) : alpha(theme.palette.background.default, 0.6),
  border: `1px solid ${color ? alpha(color, 0.12) : alpha(theme.palette.divider, 0.2)}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: `0 8px 20px ${alpha(theme.palette.divider, 0.18)}`,
  },
  '& .stats-value': {
    color: color || theme.palette.text.primary,
    fontWeight: 700,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}));

// Implementation Tracker Page
const ImplementationTrackerPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [errorTasks, setErrorTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('category');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importStage, setImportStage] = useState('upload'); // 'upload', 'mapping', 'validation', 'results'
  const [columnMappings, setColumnMappings] = useState({});
  const [previewData, setPreviewData] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
  const [importSuccess, setImportSuccess] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table', 'card', 'kanban'
  
  // Fetch tasks from API on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to fetch tasks from the API
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await implementationAPI.getTasks();
      setTasks(response.data || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Failed to load tasks. Please try again later.');
      // Fall back to mock data in case of API failure
      setTasks(mockImplementationTasks);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Calculate stats
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'Done').length;
    const errors = tasks.filter(task => task.status === 'Done_With_Errors').length;
    const pending = tasks.filter(task => ['Planned', 'Oustanding'].includes(task.status)).length;
    
    setTotalTasks(total);
    setCompletedTasks(completed);
    setErrorTasks(errors);
    setPendingTasks(pending);
    
    // Apply filters
    let result = [...tasks];
    
    if (searchQuery) {
      result = result.filter(task => 
        task.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.nodeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.implementor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      result = result.filter(task => task.category === categoryFilter);
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(task => task.status === statusFilter);
    }
    
    // Apply sorting
    result = result.sort((a, b) => {
      if (order === 'asc') {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return a[orderBy] > b[orderBy] ? -1 : 1;
      }
    });
    
    setFilteredTasks(result);
  }, [tasks, searchQuery, categoryFilter, statusFilter, order, orderBy]);
  
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };
  
  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
    setPage(0);
  };
  
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };
  
  const handleRefresh = () => {
    fetchTasks();
  };
  
  const handleEditTask = (task) => {
    setCurrentTask({...task});
    setEditDialogOpen(true);
  };
  
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentTask(null);
  };
  
  const handleSaveTask = async () => {
    if (!currentTask) return;
    
    setLoading(true);
    try {
      let response;
      // If task has an ID, it's an update. Otherwise, it's a new task.
      if (currentTask.id && currentTask.id !== tasks.length + 1) {
        response = await implementationAPI.updateTask(currentTask.id, currentTask);
        // Update local state
        setTasks(tasks.map(task => 
          task.id === currentTask.id ? response.data : task
        ));
      } else {
        // Remove the temporary ID if it was a new task
        const { id, ...taskWithoutId } = currentTask;
        response = await implementationAPI.createTask(taskWithoutId);
        // Add to local state
        setTasks([...tasks, response.data]);
      }
      handleCloseEditDialog();
    } catch (err) {
      console.error('Failed to save task:', err);
      // Fallback for demo: update local state anyway
      if (currentTask.id && currentTask.id !== tasks.length + 1) {
        setTasks(tasks.map(task => 
          task.id === currentTask.id ? currentTask : task
        ));
      } else {
        setTasks([...tasks, { ...currentTask, id: Date.now() }]);
      }
      handleCloseEditDialog();
    } finally {
      setLoading(false);
    }
  };
  
  const handleTaskChange = (field, value) => {
    if (currentTask) {
      setCurrentTask({
        ...currentTask,
        [field]: value
      });
    }
  };
  
  const handleAddNewTask = () => {
    const newTask = {
      id: tasks.length + 1,
      category: 'Retunes',
      siteName: '',
      nodeId: '',
      implementor: engineers[0],
      status: 'Planned',
      comments: '',
      enmScriptsPath: '',
      dateCreated: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setCurrentTask(newTask);
    setEditDialogOpen(true);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Done':
        return theme.palette.success.main;
      case 'Done_With_Errors':
        return theme.palette.warning.main;
      case 'Failed':
        return theme.palette.error.main;
      case 'Planned':
        return theme.palette.info.main;
      case 'Outstanding':
        return theme.palette.primary.main;
      default:
        return theme.palette.text.secondary;
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'Done':
        return 'Completed';
      case 'Done_With_Errors':
        return 'Completed with Issues';
      case 'Failed':
        return 'Failed';
      case 'Planned':
        return 'Planned';
      case 'Outstanding':
        return 'In Progress';
      default:
        return status;
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done':
        return <CheckCircleIcon fontSize="small" />;
      case 'Done_With_Errors':
        return <WarningAmberIcon fontSize="small" />;
      case 'Failed':
        return <ErrorOutlineIcon fontSize="small" />;
      case 'Planned':
        return <CalendarTodayIcon fontSize="small" />;
      case 'Outstanding':
        return <InfoIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };
  
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Retunes':
        return <TuneIcon />;
      case 'Parameters':
        return <SettingsIcon />;
      case 'ENDC_associations':
        return <NetworkCellIcon />;
      case 'nr-nr_associations':
        return <NetworkCellIcon />;
      default:
        return <AssignmentIcon />;
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    setLoading(true);
    try {
      await implementationAPI.deleteTask(taskId);
      // Remove from local state
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
      // Fallback for demo: remove from local state anyway
      setTasks(tasks.filter(task => task.id !== taskId));
    } finally {
      setLoading(false);
    }
  };
  
  const handleExportTasks = async (format = 'csv') => {
    setLoading(true);
    try {
      console.log(`Exporting tasks in ${format} format...`);
      const response = await implementationAPI.exportTasks(format);
      
      // Create a blob from the response
      // Note: The response is already a blob due to responseType: 'blob' in the API call
      const blob = new Blob([response], { 
        type: format === 'csv' ? 'text/csv' : 'application/octet-stream' 
      });
      
      // Create a link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `implementation-tasks.${format}`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export tasks:', err);
      setError('Failed to export tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownloadTemplate = async () => {
    setLoading(true);
    try {
      console.log('Downloading CSV template...');
      const response = await implementationAPI.downloadTemplate();
      
      // Create a blob URL for the downloaded file
      const blob = new Blob([response], { type: 'text/csv' });
      
      // Create a link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'implementation-tasks-template.csv');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download template:', err);
      setError('Failed to download template. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setImportFile(event.target.files[0]);
      // Reset other import-related states when a new file is selected
      setImportStage('upload');
      setPreviewData([]);
      setColumnMappings({});
      setImportErrors([]);
      setImportSuccess(false);
    }
  };
  
  const handleFileUpload = async () => {
    if (!importFile) return;
    
    setLoading(true);
    setImportErrors([]);
    
    try {
      // Read the CSV file to get a preview of the data
      const reader = new FileReader();
      reader.readAsText(importFile);
      reader.onload = async (e) => {
        const csvText = e.target.result;
        const lines = csvText.split('\n');
        
        if (lines.length < 2) {
          setImportErrors(['The CSV file is empty or invalid.']);
          setLoading(false);
          return;
        }
        
        // Parse headers
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Parse a few rows for preview
        const previewRows = [];
        for (let i = 1; i < Math.min(6, lines.length); i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });
            previewRows.push(row);
          }
        }
        
        setPreviewData({
          headers,
          rows: previewRows
        });
        
        // Initialize column mappings with suggested mappings
        const suggestedMappings = {};
        const requiredFields = ['category', 'siteName', 'nodeId', 'implementor', 'status'];
        const optionalFields = ['comments', 'enmScriptsPath', 'dateCreated', 'lastUpdated'];
        
        headers.forEach(header => {
          // Try to find a match in our required and optional fields
          const lowerHeader = header.toLowerCase();
          
          const requiredMatch = requiredFields.find(field => 
            lowerHeader.includes(field.toLowerCase()) || 
            field.toLowerCase().includes(lowerHeader)
          );
          
          const optionalMatch = optionalFields.find(field => 
            lowerHeader.includes(field.toLowerCase()) || 
            field.toLowerCase().includes(lowerHeader)
          );
          
          if (requiredMatch) {
            suggestedMappings[header] = requiredMatch;
          } else if (optionalMatch) {
            suggestedMappings[header] = optionalMatch;
          } else {
            suggestedMappings[header] = ''; // No mapping
          }
        });
        
        setColumnMappings(suggestedMappings);
        setImportStage('mapping');
        setLoading(false);
      };
      
      reader.onerror = () => {
        setImportErrors(['Failed to read the CSV file.']);
        setLoading(false);
      };
    } catch (err) {
      console.error('Error handling file upload:', err);
      setImportErrors(['An error occurred while processing the file.']);
      setLoading(false);
    }
  };
  
  const handleMappingChange = (csvHeader, fieldName) => {
    setColumnMappings({
      ...columnMappings,
      [csvHeader]: fieldName
    });
  };
  
  const handleValidateImport = async () => {
    if (!importFile) return;
    
    setLoading(true);
    setImportErrors([]);
    
    try {
      const formData = new FormData();
      formData.append('file', importFile);
      formData.append('mappings', JSON.stringify(columnMappings));
      
      const response = await implementationAPI.validateImport(formData);
      
      if (response.data.errors && response.data.errors.length > 0) {
        setImportErrors(response.data.errors);
        setImportStage('validation');
      } else {
        setImportStage('results');
        setPreviewData(response.data.preview || []);
      }
    } catch (err) {
      console.error('Failed to validate import:', err);
      setImportErrors(['Failed to validate the import data. Please check your file and mappings.']);
    } finally {
      setLoading(false);
    }
  };
  
  const handleConfirmImport = async () => {
    if (!importFile) return;
    
    setLoading(true);
    setImportErrors([]);
    
    try {
      const formData = new FormData();
      formData.append('file', importFile);
      formData.append('mappings', JSON.stringify(columnMappings));
      
      const response = await implementationAPI.importTasks(formData);
      
      if (response.data.success) {
        setImportSuccess(true);
        setImportStage('results');
        // Refresh tasks list
        fetchTasks();
      } else {
        setImportErrors(response.data.errors || ['Import failed for unknown reasons.']);
      }
    } catch (err) {
      console.error('Failed to import tasks:', err);
      setImportErrors(['Failed to import the tasks. Please try again later.']);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseImportDialog = () => {
    setImportDialogOpen(false);
    setImportFile(null);
    setImportStage('upload');
    setPreviewData([]);
    setColumnMappings({});
    setImportErrors([]);
    setImportSuccess(false);
  };
  
  // Toggle filter visibility
  const toggleFilters = () => {
    setFiltersExpanded(!filtersExpanded);
  };

  // Toggle between view modes
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Render a task card for the card view mode
  const renderTaskCard = (task) => {
    const statusColor = getStatusColor(task.status);
    const statusLabel = getStatusLabel(task.status);
    
    return (
      <Grid item xs={12} sm={6} md={4} key={task.id}>
        <Card 
          elevation={2} 
          className="implementation-stats-card"
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            borderLeft: `4px solid ${getStatusColor(task.status)}`
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Chip 
                label={task.category} 
                size="small" 
                icon={getCategoryIcon(task.category)} 
                className="implementation-category-tag"
                sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
              />
              <Typography variant="caption" color="text.secondary">
                {new Date(task.lastUpdated).toLocaleDateString()}
              </Typography>
            </Box>
            
            <Typography variant="h6" gutterBottom component="div" noWrap>
              {task.siteName}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              ID: {task.nodeId}
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">{task.implementor}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">{new Date(task.dateCreated).toLocaleDateString()}</Typography>
              </Box>
            </Box>
          </CardContent>
          
          <Divider />
          
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={statusLabel}
              size="small"
              icon={getStatusIcon(task.status)}
              className="implementation-status-pill"
              sx={{ 
                bgcolor: alpha(statusColor, 0.1), 
                color: statusColor,
                borderColor: statusColor 
              }}
              variant="outlined"
            />
            
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="View Details">
                <IconButton 
                  size="small" 
                  onClick={() => handleEditTask(task)}
                  className="action-button"
                  sx={{ 
                    color: theme.palette.info.main,
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    '&:hover': { 
                      bgcolor: alpha(theme.palette.info.main, 0.2),
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Edit Task">
                <IconButton 
                  size="small" 
                  onClick={() => handleEditTask(task)}
                  className="action-button"
                  sx={{ 
                    color: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': { 
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Card>
      </Grid>
    );
  };

  // Render table for the table view mode
  const renderTable = () => {
    return (
      <TableContainer component={Paper} className="implementation-table-container">
        {loading && (
          <LinearProgress sx={{ height: 3 }} />
        )}
        <Table sx={{ minWidth: 650 }} aria-label="implementation tasks table">
          <TableHead>
            <TableRow sx={{ bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.05) }}>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'category'}
                  direction={orderBy === 'category' ? order : 'asc'}
                  onClick={() => handleRequestSort('category')}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'siteName'}
                  direction={orderBy === 'siteName' ? order : 'asc'}
                  onClick={() => handleRequestSort('siteName')}
                >
                  Site Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Node ID</TableCell>
              <TableCell>Implementor</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'lastUpdated'}
                  direction={orderBy === 'lastUpdated' ? order : 'asc'}
                  onClick={() => handleRequestSort('lastUpdated')}
                >
                  Last Updated
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && filteredTasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">No tasks found</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Try adjusting your filters or create new tasks
                    </Typography>
                    <AnimatedButton 
                      variant="outlined" 
                      startIcon={<AddCircleOutlineIcon />} 
                      sx={{ mt: 2 }}
                      onClick={handleAddNewTask}
                    >
                      Add New Task
                    </AnimatedButton>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {filteredTasks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((task) => (
                <TableRow 
                  key={task.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  className="implementation-task-row"
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getCategoryIcon(task.category)}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {task.category}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{task.siteName}</TableCell>
                  <TableCell>{task.nodeId}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          fontSize: '0.75rem', 
                          mr: 1,
                          bgcolor: theme.palette.primary.main
                        }}
                      >
                        {task.implementor.charAt(0)}
                      </Avatar>
                      {task.implementor}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(task.status)}
                      size="small"
                      icon={getStatusIcon(task.status)}
                      className="implementation-status-pill"
                      sx={{ 
                        bgcolor: alpha(getStatusColor(task.status), 0.1), 
                        color: getStatusColor(task.status),
                        borderColor: getStatusColor(task.status)
                      }}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(task.lastUpdated).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(task.lastUpdated).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditTask(task)}
                          className="action-button"
                          sx={{ 
                            color: theme.palette.info.main,
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            '&:hover': { 
                              bgcolor: alpha(theme.palette.info.main, 0.2),
                              transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Task">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditTask(task)}
                          className="action-button"
                          sx={{ 
                            color: theme.palette.primary.main,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': { 
                              bgcolor: alpha(theme.palette.primary.main, 0.2),
                              transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Task">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteTask(task.id)}
                          className="action-button"
                          sx={{ 
                            color: theme.palette.error.main,
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            '&:hover': { 
                              bgcolor: alpha(theme.palette.error.main, 0.2),
                              transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {loading && Array.from(new Array(rowsPerPage)).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                {Array.from(new Array(7)).map((_, cellIndex) => (
                  <TableCell key={`skeleton-cell-${cellIndex}`}>
                    <Box sx={{ height: 24, width: '100%', borderRadius: 1 }} className="shimmer-effect" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredTasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    );
  };

  // Render the Kanban board view
  const renderKanban = () => {
    const statusColumns = ['Planned', 'Outstanding', 'Done_With_Errors', 'Failed', 'Done'];
    
    return (
      <Box sx={{ overflowX: 'auto', pb: 2 }}>
        <Grid container spacing={2} sx={{ minWidth: isMobile ? '100%' : 900 }}>
          {statusColumns.map((status) => {
            const columnTasks = filteredTasks.filter(task => task.status === status);
            return (
              <Grid item xs={isMobile ? 12 : true} key={status} sx={{ minWidth: 280 }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    borderTop: `3px solid ${getStatusColor(status)}`,
                  }}
                  className="implementation-stats-card"
                >
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getStatusIcon(status)}
                      <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>
                        {getStatusLabel(status)}
                      </Typography>
                    </Box>
                    <Chip 
                      label={columnTasks.length} 
                      size="small" 
                      sx={{ 
                        bgcolor: alpha(getStatusColor(status), 0.1), 
                        color: getStatusColor(status) 
                      }}
                    />
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
                    <Stack spacing={1.5}>
                      {columnTasks.length === 0 && (
                        <Box 
                          sx={{ 
                            p: 2, 
                            textAlign: 'center', 
                            border: '1px dashed', 
                            borderColor: 'divider',
                            borderRadius: 1
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            No tasks
                          </Typography>
                        </Box>
                      )}
                      {columnTasks.map(task => (
                        <Paper 
                          key={task.id} 
                          elevation={0}
                          sx={{ 
                            p: 1.5, 
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                              boxShadow: theme.shadows[2],
                              cursor: 'pointer'
                            }
                          }}
                          onClick={() => handleEditTask(task)}
                        >
                          <Box sx={{ mb: 1 }}>
                            <Chip 
                              label={task.category} 
                              size="small" 
                              icon={getCategoryIcon(task.category)} 
                              className="implementation-category-tag"
                              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                            />
                          </Box>
                          
                          <Typography variant="subtitle2" gutterBottom noWrap>
                            {task.siteName}
                          </Typography>
                          
                          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            {task.nodeId}
                          </Typography>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 1
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                sx={{ 
                                  width: 20, 
                                  height: 20, 
                                  fontSize: '0.6rem',
                                  bgcolor: theme.palette.primary.main
                                }}
                              >
                                {task.implementor.charAt(0)}
                              </Avatar>
                              <Typography variant="caption" sx={{ ml: 0.5 }}>
                                {task.implementor}
                              </Typography>
                            </Box>
                            
                            <Typography variant="caption" color="text.secondary">
                              {new Date(task.lastUpdated).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Grid item>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Implementation Tracker
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track and manage network implementation tasks
              </Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={1}>
                <AnimatedButton
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={() => handleExportTasks('csv')}
                >
                  Export
                </AnimatedButton>
                <AnimatedButton
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleAddNewTask}
                  color="primary"
                >
                  Add Task
                </AnimatedButton>
              </Stack>
            </Grid>
          </Grid>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
              action={
                <AnimatedButton color="inherit" size="small" onClick={fetchTasks}>
                  Retry
                </AnimatedButton>
              }
            >
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="implementation-stats-card">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography color="text.secondary" variant="subtitle2">
                      Total Tasks
                    </Typography>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                      <AssignmentIcon color="primary" />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" component="div" sx={{ mt: 2, fontWeight: 'bold' }}>
                    {totalTasks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Implementation tasks in system
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="implementation-stats-card">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography color="text.secondary" variant="subtitle2">
                      Completed
                    </Typography>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                      <CheckCircleIcon color="success" />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" component="div" sx={{ mt: 2, fontWeight: 'bold', color: theme.palette.success.main }}>
                    {completedTasks}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={totalTasks ? (completedTasks / totalTasks) * 100 : 0} 
                      sx={{ 
                        flexGrow: 1, 
                        mr: 1, 
                        height: 6, 
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: theme.palette.success.main
                        }
                      }} 
                    />
                    <Typography variant="body2" color="text.secondary">
                      {totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="implementation-stats-card">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography color="text.secondary" variant="subtitle2">
                      With Issues
                    </Typography>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
                      <WarningAmberIcon color="warning" />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" component="div" sx={{ mt: 2, fontWeight: 'bold', color: theme.palette.warning.main }}>
                    {errorTasks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Tasks completed with errors
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card className="implementation-stats-card">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography color="text.secondary" variant="subtitle2">
                      Pending
                    </Typography>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}>
                      <InfoIcon color="info" />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" component="div" sx={{ mt: 2, fontWeight: 'bold', color: theme.palette.info.main }}>
                    {pendingTasks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Planned or outstanding tasks
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: filtersExpanded ? 2 : 0 }}>
              <TextField
                placeholder="Search by site name, node ID, or implementor..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                className="implementation-search-field"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Box sx={{ flexGrow: 1 }} />
              
              <Tabs
                value={viewMode}
                onChange={handleViewModeChange}
                aria-label="view mode"
                sx={{ 
                  minHeight: 40,
                  '& .MuiTabs-indicator': {
                    height: 3
                  }
                }}
              >
                <Tab 
                  icon={<TuneIcon fontSize="small" />} 
                  label={isMobile ? "" : "Table"} 
                  value="table" 
                  sx={{ minHeight: 40 }}
                />
                <Tab 
                  icon={<DescriptionIcon fontSize="small" />} 
                  label={isMobile ? "" : "Cards"} 
                  value="card"
                  sx={{ minHeight: 40 }}
                />
                <Tab 
                  icon={<FolderIcon fontSize="small" />} 
                  label={isMobile ? "" : "Kanban"} 
                  value="kanban"
                  sx={{ minHeight: 40 }}
                />
              </Tabs>
              
              <Tooltip title="Toggle Filters">
                <IconButton onClick={toggleFilters} color={filtersExpanded ? "primary" : "default"}>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Refresh Data">
                <IconButton onClick={handleRefresh}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Box 
              className={`implementation-filter-container ${filtersExpanded ? '' : 'collapsed'}`}
              sx={{ overflow: 'hidden' }}
            >
              {filtersExpanded && (
                <Box sx={{ pt: 2 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="category-filter-label">Category</InputLabel>
                        <Select
                          labelId="category-filter-label"
                          value={categoryFilter}
                          onChange={handleCategoryFilterChange}
                          label="Category"
                        >
                          <MenuItem value="all">All Categories</MenuItem>
                          <MenuItem value="Retunes">Retunes</MenuItem>
                          <MenuItem value="New Sites">New Sites</MenuItem>
                          <MenuItem value="Parameter Changes">Parameter Changes</MenuItem>
                          <MenuItem value="Software Upgrades">Software Upgrades</MenuItem>
                          <MenuItem value="Hardware Upgrades">Hardware Upgrades</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="status-filter-label">Status</InputLabel>
                        <Select
                          labelId="status-filter-label"
                          value={statusFilter}
                          onChange={handleStatusFilterChange}
                          label="Status"
                        >
                          <MenuItem value="all">All Statuses</MenuItem>
                          <MenuItem value="Planned">Planned</MenuItem>
                          <MenuItem value="Outstanding">Outstanding</MenuItem>
                          <MenuItem value="Done">Done</MenuItem>
                          <MenuItem value="Done_With_Errors">Done With Errors</MenuItem>
                          <MenuItem value="Failed">Failed</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <AnimatedButton 
                          variant="outlined" 
                          fullWidth 
                          startIcon={<FileDownloadIcon />}
                          onClick={() => handleExportTasks('csv')}
                        >
                          Export CSV
                        </AnimatedButton>
                        <AnimatedButton 
                          variant="outlined" 
                          fullWidth 
                          startIcon={<UploadFileIcon />}
                          onClick={() => setImportDialogOpen(true)}
                        >
                          Import
                        </AnimatedButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Paper>

          <Box sx={{ mb: 4 }}>
            {viewMode === 'table' && renderTable()}
            
            {viewMode === 'card' && (
              <Grid container spacing={2}>
                {filteredTasks
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(task => renderTaskCard(task))
                }
                {filteredTasks.length === 0 && !loading && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body1" color="text.secondary">No tasks found</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Try adjusting your filters or create new tasks
                      </Typography>
                      <AnimatedButton 
                        variant="outlined" 
                        startIcon={<AddCircleOutlineIcon />} 
                        sx={{ mt: 2 }}
                        onClick={handleAddNewTask}
                      >
                        Add New Task
                      </AnimatedButton>
                    </Paper>
                  </Grid>
                )}
                {loading && Array.from(new Array(6)).map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
                    <Paper sx={{ p: 2, height: 200 }} className="shimmer-effect" />
                  </Grid>
                ))}
              </Grid>
            )}

            {viewMode === 'kanban' && renderKanban()}
            
            {viewMode !== 'table' && filteredTasks.length > rowsPerPage && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <TablePagination
                  rowsPerPageOptions={[6, 12, 24, 36]}
                  component="div"
                  count={filteredTasks.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Box>
            )}
          </Box>
        </Box>
        
        {/* Update edit dialog buttons */}
        <Dialog 
          open={editDialogOpen} 
          onClose={handleCloseEditDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }
          }}
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>
              {currentTask?.id ? 'Edit Implementation Task' : 'Add New Implementation Task'}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="siteName"
                  label="Site Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={currentTask?.siteName || ''}
                  onChange={(e) => handleTaskChange('siteName', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  id="nodeId"
                  label="Node ID"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={currentTask?.nodeId || ''}
                  onChange={(e) => handleTaskChange('nodeId', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    value={currentTask?.category || ''}
                    label="Category"
                    onChange={(e) => handleTaskChange('category', e.target.value)}
                  >
                    <MenuItem value="Retunes">Retunes</MenuItem>
                    <MenuItem value="New Sites">New Sites</MenuItem>
                    <MenuItem value="Parameter Changes">Parameter Changes</MenuItem>
                    <MenuItem value="Software Upgrades">Software Upgrades</MenuItem>
                    <MenuItem value="Hardware Upgrades">Hardware Upgrades</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    value={currentTask?.status || ''}
                    label="Status"
                    onChange={(e) => handleTaskChange('status', e.target.value)}
                  >
                    <MenuItem value="Planned">Planned</MenuItem>
                    <MenuItem value="Outstanding">Outstanding</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                    <MenuItem value="Done_With_Errors">Done With Errors</MenuItem>
                    <MenuItem value="Failed">Failed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  id="implementor"
                  label="Implementor"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={currentTask?.implementor || ''}
                  onChange={(e) => handleTaskChange('implementor', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  id="enmScriptsPath"
                  label="ENM Scripts Path"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={currentTask?.enmScriptsPath || ''}
                  onChange={(e) => handleTaskChange('enmScriptsPath', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  id="comments"
                  label="Comments"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  value={currentTask?.comments || ''}
                  onChange={(e) => handleTaskChange('comments', e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <AnimatedButton onClick={handleCloseEditDialog} variant="outlined">
              Cancel
            </AnimatedButton>
            <AnimatedButton 
              onClick={handleSaveTask} 
              variant="contained" 
              color="primary"
              startIcon={<SaveIcon />}
            >
              Save Changes
            </AnimatedButton>
          </DialogActions>
        </Dialog>
        
        {/* Import Dialog with fixed buttons */}
        <Dialog
          open={importDialogOpen}
          onClose={handleCloseImportDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }
          }}
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h6" fontWeight={600}>
                {importStage === 'upload' && 'Import Tasks from CSV'}
                {importStage === 'mapping' && 'Map CSV Columns to Task Fields'}
                {importStage === 'validation' && 'Validation Issues'}
                {importStage === 'results' && (importSuccess ? 'Import Successful' : 'Import Preview')}
              </Typography>
              <IconButton onClick={handleCloseImportDialog} size="small" edge="end">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          
          <DialogContent>
            {/* Import dialog content stages */}
            {/* Upload Stage */}
            {importStage === 'upload' && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Box 
                  sx={{ 
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 4,
                    mb: 3,
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      opacity: 0,
                      cursor: 'pointer',
                      zIndex: 1
                    }}
                  />
                  <UploadFileIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Drag & Drop your CSV file here
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    or click to browse files
                  </Typography>
                  {importFile && (
                    <Box 
                      sx={{ 
                        mt: 2, 
                        p: 1, 
                        borderRadius: 1, 
                        bgcolor: 'background.default',
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}
                    >
                      <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">{importFile.name}</Typography>
                    </Box>
                  )}
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Please ensure your CSV file includes columns for the required fields: 
                  Category, Site Name, Node ID, Implementor, and Status.
                </Typography>
                
                <AnimatedButton 
                  variant="outlined" 
                  startIcon={<FileDownloadIcon />}
                  onClick={handleDownloadTemplate}
                  sx={{ mr: 2 }}
                >
                  Download Template
                </AnimatedButton>
              </Box>
            )}
            
            {/* Other import stages content - mapping, validation, results */}
            {/* ... existing code ... */}
          </DialogContent>
          
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            {importStage === 'upload' && (
              <>
                <AnimatedButton onClick={handleCloseImportDialog} variant="outlined">Cancel</AnimatedButton>
                <AnimatedButton 
                  onClick={handleFileUpload} 
                  variant="contained" 
                  disabled={!importFile}
                  startIcon={<NavigateNextIcon />}
                  color="primary"
                >
                  Next
                </AnimatedButton>
              </>
            )}
            
            {importStage === 'mapping' && (
              <>
                <AnimatedButton 
                  onClick={() => setImportStage('upload')} 
                  variant="outlined"
                  startIcon={<NavigateBeforeIcon />}
                >
                  Back
                </AnimatedButton>
                <AnimatedButton 
                  onClick={handleValidateImport} 
                  variant="contained"
                  startIcon={<CheckCircleOutlineIcon />}
                  color="primary"
                >
                  Validate
                </AnimatedButton>
              </>
            )}
            
            {importStage === 'validation' && (
              <>
                <AnimatedButton 
                  onClick={() => setImportStage('mapping')} 
                  variant="outlined"
                  startIcon={<NavigateBeforeIcon />}
                >
                  Back to Mapping
                </AnimatedButton>
                <AnimatedButton 
                  onClick={handleConfirmImport} 
                  variant="contained"
                  color="warning"
                  startIcon={<WarningAmberIcon />}
                >
                  Import Anyway
                </AnimatedButton>
              </>
            )}
            
            {importStage === 'results' && !importSuccess && (
              <>
                <AnimatedButton 
                  onClick={() => setImportStage('mapping')} 
                  variant="outlined"
                  startIcon={<NavigateBeforeIcon />}
                >
                  Back
                </AnimatedButton>
                <AnimatedButton 
                  onClick={handleConfirmImport} 
                  variant="contained"
                  color="success"
                  startIcon={<SaveIcon />}
                >
                  Confirm Import
                </AnimatedButton>
              </>
            )}
            
            {importStage === 'results' && importSuccess && (
              <AnimatedButton 
                onClick={handleCloseImportDialog} 
                variant="contained"
                color="primary"
              >
                Close
              </AnimatedButton>
            )}
          </DialogActions>
        </Dialog>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ImplementationTrackerPage; 