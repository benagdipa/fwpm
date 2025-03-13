import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Stack,
  Avatar,
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
// Import DataGrid and GridToolbar
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { format } from 'date-fns';

// Icons
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorIcon from '@mui/icons-material/Error';
import DownloadIcon from '@mui/icons-material/Download';
import DateRangeIcon from '@mui/icons-material/DateRange';

// Utility for handling status colors
const getStatusColor = (status) => {
  switch(status?.toLowerCase()) {
    case 'success': return 'success';
    case 'failed': return 'error';
    case 'pending': return 'warning';
    default: return 'info';
  }
};

// Utility for handling action colors
const getActionColor = (action) => {
  switch(action?.toLowerCase()) {
    case 'parameter updated': return '#2196f3'; // blue
    case 'parameter added': return '#4caf50'; // green
    case 'parameter deleted': return '#f44336'; // red
    case 'configuration exported': return '#9c27b0'; // purple
    case 'configuration imported': return '#ff9800'; // orange
    case 'user login': return '#607d8b'; // blue-gray
    default: return '#757575'; // gray
  }
};

// Details Dialog Component
const ChangeDetailsDialog = ({ open, handleClose, change }) => {
  const theme = useTheme();
  
  if (!change) return null;
  
  const isParameterChange = 
    change.action === 'Parameter Updated' || 
    change.action === 'Parameter Added' || 
    change.action === 'Parameter Deleted';
  
  // Format date time
  const formatDateTime = (dateTimeStr) => {
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleString();
    } catch (error) {
      return dateTimeStr || '';
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ 
        bgcolor: theme.palette.primary.main, 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <ReceiptIcon /> Change Details
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Action
              </Typography>
              <Chip 
                label={change.action} 
                size="small"
                sx={{ 
                  mt: 0.5,
                  bgcolor: `${getActionColor(change.action)}20`,
                  color: getActionColor(change.action),
                  fontWeight: 'medium'
                }}
                icon={
                  change.action === 'Parameter Updated' ? <EditIcon fontSize="small" /> :
                  change.action === 'Parameter Added' ? <AddIcon fontSize="small" /> :
                  change.action === 'Parameter Deleted' ? <DeleteIcon fontSize="small" /> :
                  <HistoryIcon fontSize="small" />
                }
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                User
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 'medium' }}>
                {change.user}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Date & Time
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {formatDateTime(change.timestamp)}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip 
                label={change.status} 
                size="small"
                color={getStatusColor(change.status)}
                sx={{ mt: 0.5 }}
                icon={change.status === 'success' ? <VerifiedIcon fontSize="small" /> : <ErrorIcon fontSize="small" />}
              />
              {change.errorMessage && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Error: {change.errorMessage}
                </Typography>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Change Details
            </Typography>
            
            {isParameterChange ? (
              <Box sx={{ mt: 1 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    MO Class Name
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    {change.details?.moClassName}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary">
                    Parameter Name
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    {change.details?.parameterName}
                  </Typography>
                  
                  {change.details?.device && (
                    <>
                      <Typography variant="subtitle2" color="text.secondary">
                        Device
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {change.details.device}
                      </Typography>
                    </>
                  )}
                  
                  {change.action === 'Parameter Updated' && (
                    <Box sx={{ 
                      display: 'flex', 
                      mt: 2,
                      p: 1,
                      bgcolor: theme.palette.background.default,
                      borderRadius: 1
                    }}>
                      <Box sx={{ flex: 1, px: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" align="center">
                          Old Value
                        </Typography>
                        <Typography 
                          variant="body2" 
                          align="center"
                          sx={{ 
                            p: 1, 
                            bgcolor: '#ffebee', 
                            color: '#d32f2f',
                            borderRadius: 1,
                            fontFamily: 'monospace'
                          }}
                        >
                          {change.details?.oldValue || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, px: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" align="center">
                          New Value
                        </Typography>
                        <Typography 
                          variant="body2" 
                          align="center"
                          sx={{ 
                            p: 1, 
                            bgcolor: '#e8f5e9', 
                            color: '#2e7d32',
                            borderRadius: 1,
                            fontFamily: 'monospace'
                          }}
                        >
                          {change.details?.newValue || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  {change.action === 'Parameter Added' && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Value
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          p: 1, 
                          bgcolor: '#e8f5e9', 
                          color: '#2e7d32',
                          borderRadius: 1,
                          fontFamily: 'monospace'
                        }}
                      >
                        {change.details?.newValue || 'N/A'}
                      </Typography>
                    </Box>
                  )}
                  
                  {change.action === 'Parameter Deleted' && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Deleted Value
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          p: 1, 
                          bgcolor: '#ffebee', 
                          color: '#d32f2f',
                          borderRadius: 1,
                          fontFamily: 'monospace'
                        }}
                      >
                        {change.details?.oldValue || 'N/A'}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Box>
            ) : (
              <Box sx={{ mt: 1 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                  {change.action === 'Configuration Exported' && (
                    <>
                      <Typography variant="subtitle2" color="text.secondary">
                        Format
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {change.details?.format}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary">
                        Configuration Count
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {change.details?.configCount} configurations
                      </Typography>
                      
                      {change.details?.filters && (
                        <>
                          <Typography variant="subtitle2" color="text.secondary">
                            Applied Filters
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                            {Object.entries(change.details.filters).map(([key, value]) => (
                              <Chip 
                                key={key}
                                size="small"
                                label={`${key}: ${value}`}
                                color="info"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        </>
                      )}
                    </>
                  )}
                  
                  {change.action === 'Configuration Imported' && (
                    <>
                      <Typography variant="subtitle2" color="text.secondary">
                        Format
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {change.details?.format}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary">
                        Import Summary
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Box sx={{ 
                          p: 1, 
                          bgcolor: '#e8f5e9', 
                          borderRadius: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}>
                          <Typography variant="caption" color="text.secondary">
                            New
                          </Typography>
                          <Typography variant="body1" color="#2e7d32" fontWeight="bold">
                            {change.details?.newConfigs || 0}
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          p: 1, 
                          bgcolor: '#e3f2fd', 
                          borderRadius: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}>
                          <Typography variant="caption" color="text.secondary">
                            Updated
                          </Typography>
                          <Typography variant="body1" color="#1976d2" fontWeight="bold">
                            {change.details?.updatedConfigs || 0}
                          </Typography>
                        </Box>
                        <Box sx={{ 
                          p: 1, 
                          bgcolor: '#ede7f6', 
                          borderRadius: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}>
                          <Typography variant="caption" color="text.secondary">
                            Total
                          </Typography>
                          <Typography variant="body1" color="#5e35b1" fontWeight="bold">
                            {change.details?.configCount || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </>
                  )}
                  
                  {change.action === 'User Login' && (
                    <>
                      <Typography variant="subtitle2" color="text.secondary">
                        IP Address
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {change.details?.ipAddress}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary">
                        Browser
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {change.details?.browser}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary">
                        Operating System
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {change.details?.os}
                      </Typography>
                    </>
                  )}
                </Paper>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button 
          variant="contained" 
          startIcon={<DownloadIcon />}
          onClick={() => {
            // Export functionality would be implemented here
          }}
        >
          Export Log
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Component
const ChangeHistoryView = ({ fetchData, data, loading, error }) => {
  const theme = useTheme();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedChange, setSelectedChange] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // Filter states with string dates instead of Date objects
  const [filters, setFilters] = useState({
    action: '',
    user: '',
    status: '',
    startDate: '',
    endDate: '',
    moClassName: '',
    parameterName: ''
  });
  
  // Get unique values for filter dropdowns
  const uniqueActions = [...new Set(data?.map(item => item.action) || [])];
  const uniqueUsers = [...new Set(data?.map(item => item.user) || [])];
  const uniqueStatuses = [...new Set(data?.map(item => item.status) || [])];
  const uniqueMoClassNames = [...new Set(
    data?.filter(item => item.details?.moClassName)
        .map(item => item.details.moClassName) || []
  )];
  const uniqueParameterNames = [...new Set(
    data?.filter(item => item.details?.parameterName)
        .map(item => item.details.parameterName) || []
  )];

  // Parse date string into Date object
  const parseDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Apply filters to data
  const filteredData = data?.filter(item => {
    // Filter by action
    if (filters.action && item.action !== filters.action) return false;
    
    // Filter by user
    if (filters.user && item.user !== filters.user) return false;
    
    // Filter by status
    if (filters.status && item.status !== filters.status) return false;
    
    // Filter by start date
    if (filters.startDate) {
      const startDate = parseDate(filters.startDate);
      if (startDate && new Date(item.timestamp) < startDate) return false;
    }
    
    // Filter by end date
    if (filters.endDate) {
      const endDate = parseDate(filters.endDate);
      if (endDate) {
        const endDateWithTime = new Date(endDate);
        endDateWithTime.setHours(23, 59, 59, 999);
        if (new Date(item.timestamp) > endDateWithTime) return false;
      }
    }
    
    // Filter by MO class name
    if (filters.moClassName && item.details?.moClassName !== filters.moClassName) return false;
    
    // Filter by parameter name
    if (filters.parameterName && item.details?.parameterName !== filters.parameterName) return false;
    
    return true;
  });
  
  // Prepare rows for DataGrid - ensure each row has a unique ID
  const rows = filteredData?.map((change, index) => {
    // Make sure we have a valid change object with a details property
    const safeChange = change || {};
    const safeDetails = safeChange.details || {};
    
    // Create a row with all required properties populated with defaults
    return {
      // Copy original properties first
      ...safeChange,
      // Ensure we have a unique ID
      id: safeChange.id || `change-${index}`,
      // Ensure core properties exist
      action: safeChange.action || '',
      user: safeChange.user || '',
      status: safeChange.status || '',
      timestamp: safeChange.timestamp || new Date().toISOString(),
      // Store details as a reference for components that need it
      details: safeDetails,
      // Flatten nested details with safe defaults
      moClassName: safeDetails.moClassName || '',
      parameterName: safeDetails.parameterName || '',
      device: safeDetails.device || '',
      oldValue: safeDetails.oldValue || '',
      newValue: safeDetails.newValue || '',
      configCount: safeDetails.configCount || 0,
      format: safeDetails.format || '',
      ipAddress: safeDetails.ipAddress || '',
      browser: safeDetails.browser || ''
    };
  }) || [];
  
  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      action: '',
      user: '',
      status: '',
      startDate: '',
      endDate: '',
      moClassName: '',
      parameterName: ''
    });
  };
  
  // View change details
  const handleViewDetails = (change) => {
    setSelectedChange(change);
    setDetailsOpen(true);
  };
  
  // Close details dialog
  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };
  
  // Check if any filters are applied
  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  
  // Format date for display
  const formatDate = (date) => {
    try {
      return format(new Date(date), 'PP');
    } catch (error) {
      return date;
    }
  };
  
  // Format time for display
  const formatTime = (date) => {
    try {
      return format(new Date(date), 'p');
    } catch (error) {
      return '';
    }
  };

  // Define columns for DataGrid
  const columns = [
    {
      field: 'action',
      headerName: 'Action',
      width: 180,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          size="small"
          sx={{ 
            bgcolor: `${getActionColor(params.value)}20`,
            color: getActionColor(params.value),
            fontWeight: 'medium'
          }}
          icon={
            params.value === 'Parameter Updated' ? <EditIcon fontSize="small" /> :
            params.value === 'Parameter Added' ? <AddIcon fontSize="small" /> :
            params.value === 'Parameter Deleted' ? <DeleteIcon fontSize="small" /> :
            <HistoryIcon fontSize="small" />
          }
        />
      )
    },
    {
      field: 'details',
      headerName: 'Details',
      width: 250,
      flex: 1,
      valueGetter: (params) => {
        // For display in filter/search
        const change = params.row;
        // Add null check to prevent accessing properties of undefined
        if (!change || change === undefined) return '';
        
        if (change.action === 'Parameter Updated' || 
            change.action === 'Parameter Added' || 
            change.action === 'Parameter Deleted') {
          return `${change.parameterName || ''} ${change.moClassName || ''} ${change.device || ''}`;
        } else if (change.action === 'Configuration Exported' || change.action === 'Configuration Imported') {
          return `${change.configCount || 0} configs (${change.format || ''})`;
        } else if (change.action === 'User Login') {
          return `Login from ${change.ipAddress || ''} (${change.browser || ''})`;
        }
        return '';
      },
      renderCell: (params) => {
        const change = params.row;
        // Add null check to prevent accessing properties of undefined
        if (!change || change === undefined) return null;
        
        const isParameterChange = 
          change.action === 'Parameter Updated' || 
          change.action === 'Parameter Added' || 
          change.action === 'Parameter Deleted';
        
        if (isParameterChange) {
          return (
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {change.parameterName || 'N/A'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {change.moClassName || 'N/A'}
                {change.device && ` • ${change.device}`}
              </Typography>
              
              {change.action === 'Parameter Updated' && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mt: 0.5,
                  gap: 1
                }}>
                  <Typography 
                    variant="caption"
                    sx={{ 
                      px: 0.5, 
                      bgcolor: '#ffebee', 
                      color: '#d32f2f',
                      borderRadius: 0.5
                    }}
                  >
                    {change.oldValue || 'N/A'}
                  </Typography>
                  <Typography variant="caption">→</Typography>
                  <Typography 
                    variant="caption"
                    sx={{ 
                      px: 0.5, 
                      bgcolor: '#e8f5e9', 
                      color: '#2e7d32',
                      borderRadius: 0.5
                    }}
                  >
                    {change.newValue || 'N/A'}
                  </Typography>
                </Box>
              )}
            </Box>
          );
        } else {
          return (
            <Box>
              {change.action === 'Configuration Exported' && (
                <Typography variant="body2">
                  Exported {change.configCount || 0} configs ({change.format})
                </Typography>
              )}
              
              {change.action === 'Configuration Imported' && (
                <Typography variant="body2">
                  Imported {change.configCount || 0} configs ({change.format})
                </Typography>
              )}
              
              {change.action === 'User Login' && (
                <Typography variant="body2">
                  Login from {change.ipAddress} ({change.browser})
                </Typography>
              )}
            </Box>
          );
        }
      }
    },
    {
      field: 'user',
      headerName: 'User',
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            sx={{ 
              width: 24, 
              height: 24, 
              bgcolor: theme => theme.palette.primary.light,
              fontSize: '0.875rem'
            }}
          >
            {params.value?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2">
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: 'timestamp',
      headerName: 'Date & Time',
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2">
            {formatDate(params.value)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatTime(params.value)}
          </Typography>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small"
          color={getStatusColor(params.value)}
          variant="outlined"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Tooltip title="View Details">
            <IconButton 
              size="small"
              onClick={() => handleViewDetails(params.row)}
              color="primary"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Header Section */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" component="h2" sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1
        }}>
          <HistoryIcon color="primary" /> 
          Change History
          <Chip 
            label={filteredData?.length || 0} 
            size="small" 
            color="primary" 
            sx={{ ml: 1 }}
          />
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={filterOpen ? "contained" : "outlined"}
            startIcon={<FilterListIcon />}
            onClick={() => setFilterOpen(!filterOpen)}
            size="small"
          >
            {filterOpen ? "Hide Filters" : "Show Filters"}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchData}
            size="small"
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>
      
      {/* Filter Section */}
      {filterOpen && (
        <Paper sx={{ p: 2, mb: 3, borderRadius: 1 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">Filters</Typography>
            <Button 
              size="small"
              onClick={handleResetFilters}
              disabled={!hasActiveFilters}
            >
              Reset All
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Action</InputLabel>
                <Select
                  value={filters.action}
                  label="Action"
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                >
                  <MenuItem value="">All Actions</MenuItem>
                  {uniqueActions.map(action => (
                    <MenuItem key={action} value={action}>
                      {action}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>User</InputLabel>
                <Select
                  value={filters.user}
                  label="User"
                  onChange={(e) => handleFilterChange('user', e.target.value)}
                >
                  <MenuItem value="">All Users</MenuItem>
                  {uniqueUsers.map(user => (
                    <MenuItem key={user} value={user}>
                      {user}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {uniqueStatuses.map(status => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>MO Class Name</InputLabel>
                <Select
                  value={filters.moClassName}
                  label="MO Class Name"
                  onChange={(e) => handleFilterChange('moClassName', e.target.value)}
                >
                  <MenuItem value="">All MO Classes</MenuItem>
                  {uniqueMoClassNames.map(className => (
                    <MenuItem key={className} value={className}>
                      {className}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Parameter Name</InputLabel>
                <Select
                  value={filters.parameterName}
                  label="Parameter Name"
                  onChange={(e) => handleFilterChange('parameterName', e.target.value)}
                >
                  <MenuItem value="">All Parameters</MenuItem>
                  {uniqueParameterNames.map(paramName => (
                    <MenuItem key={paramName} value={paramName}>
                      {paramName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Start Date"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="End Date"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  )
                }}
              />
            </Grid>
          </Grid>
          
          {hasActiveFilters && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {filters.action && (
                <Chip 
                  label={`Action: ${filters.action}`}
                  onDelete={() => handleFilterChange('action', '')}
                  size="small"
                />
              )}
              {filters.user && (
                <Chip 
                  label={`User: ${filters.user}`}
                  onDelete={() => handleFilterChange('user', '')}
                  size="small"
                />
              )}
              {filters.status && (
                <Chip 
                  label={`Status: ${filters.status}`}
                  onDelete={() => handleFilterChange('status', '')}
                  size="small"
                />
              )}
              {filters.moClassName && (
                <Chip 
                  label={`MO Class: ${filters.moClassName}`}
                  onDelete={() => handleFilterChange('moClassName', '')}
                  size="small"
                />
              )}
              {filters.parameterName && (
                <Chip 
                  label={`Parameter: ${filters.parameterName}`}
                  onDelete={() => handleFilterChange('parameterName', '')}
                  size="small"
                />
              )}
              {filters.startDate && (
                <Chip 
                  label={`From: ${filters.startDate}`}
                  onDelete={() => handleFilterChange('startDate', '')}
                  size="small"
                />
              )}
              {filters.endDate && (
                <Chip 
                  label={`To: ${filters.endDate}`}
                  onDelete={() => handleFilterChange('endDate', '')}
                  size="small"
                />
              )}
            </Box>
          )}
        </Paper>
      )}
      
      {/* Error Message */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={fetchData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      
      {/* DataGrid for Change History */}
      {!loading && !error ? (
        <Paper 
          elevation={1} 
          sx={{ 
            height: 'calc(100vh - 300px)', 
            minHeight: 500,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            mb: 2
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
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
                paginationModel: { pageSize: 10 },
              },
              sorting: {
                sortModel: [{ field: 'timestamp', sort: 'desc' }],
              },
            }}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            disableRowSelectionOnClick
            density="standard"
          />
        </Paper>
      ) : loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : null}
      
      {/* Empty State */}
      {!loading && !error && filteredData?.length === 0 && (
        <Card variant="outlined" sx={{ bgcolor: 'background.default', borderRadius: 1 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ mb: 2 }}>
              <HistoryIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3 }} />
            </Box>
            <Typography variant="h6" gutterBottom>No Change History Found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {hasActiveFilters ? 
                'No results match your current filter criteria. Try adjusting your filters.' :
                'There are no change history records available yet.'
              }
            </Typography>
            {hasActiveFilters && (
              <Button 
                variant="outlined" 
                onClick={handleResetFilters}
                startIcon={<FilterListIcon />}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Details Dialog */}
      <ChangeDetailsDialog 
        open={detailsOpen}
        handleClose={handleCloseDetails}
        change={selectedChange}
      />
    </Box>
  );
};

export default ChangeHistoryView; 