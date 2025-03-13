import React, { useState, useEffect } from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { wntdAPI } from '../../lib/api';
import {
  Box, Grid, Paper, Typography, CircularProgress, Alert,
  Card, CardContent, Divider, Button, IconButton, Tooltip,
  Stack, TextField, Dialog, DialogActions, DialogContent,
  DialogTitle, Chip, Tabs, Tab, FormControl, InputLabel, Select, MenuItem,
  Badge, Skeleton, Menu, InputAdornment, LinearProgress
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

// Icons
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  ViewColumn as ViewColumnIcon,
  LocationOn as LocationIcon,
  Speed as SpeedIcon,
  FlashOn as FlashOnIcon,
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FileDownload as FileDownloadIcon,
  UploadFile as UploadFileIcon,
  Devices as DevicesIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: alpha(theme.palette.background.default, 0.7),
  minHeight: '100vh',
  overflowX: 'hidden',
  width: '100%',
}));

const StatsCard = styled(Paper)(({ theme, color }) => ({
  height: '100%',
  padding: theme.spacing(2.5),
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: color ? alpha(color, 0.06) : theme.palette.background.paper,
  border: `1px solid ${color ? alpha(color, 0.12) : alpha(theme.palette.divider, 0.2)}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: `0 8px 20px ${alpha(theme.palette.divider, 0.18)}`,
  }
}));

const TableBox = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  marginTop: theme.spacing(3),
  position: 'relative',
  width: '100%',
  height: 'calc(100vh - 370px)',
  minHeight: 400,
  display: 'flex',
  flexDirection: 'column',
}));

const SearchBar = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
}));

const FilterBar = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: alpha(theme.palette.background.default, 0.6),
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wntd-tabpanel-${index}`}
      aria-labelledby={`wntd-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
};

const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: 600,
  textTransform: 'none',
  minWidth: 'auto',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  }
}));

const WNTDTracker = () => {
  const theme = useTheme();
  const fileInputRef = React.useRef(null);
  const [wntdData, setWNTDData] = useState([
    {
      id: 1,
      owner: "Ben",
      loc_id: "LOC000011104523",
      wntd_id: "NTD000045499944",
      imsi: "505262600000402",
      wntd_version: "V3",
      bw_profile: "FW Home Fast X",
      rsp: "Waterford Park X",
      site_name: "S1-04-WATE",
      utran_cell_id: "S1-04-WATE",
      hst_start: "08-Aug-24",
      hst_days: "217",
      issue: "No Issue",
      status: "Pass",
      action_owner: "FWP",
      remarks: "Bad RSRP(-97) and SINR Mod 3 scan shows no good cell. As per FS artifacts WNTD antenna is obstructed with high vegetation."
    },
    {
      id: 2,
      owner: "Alban",
      loc_id: "LOC000015409944",
      wntd_id: "NTD000025498879",
      imsi: "505262600024138",
      wntd_version: "V3",
      bw_profile: "FW Home Fast Professional",
      rsp: "Gumly Gumly",
      site_name: "S1-06-GUML",
      utran_cell_id: "S1-06-GUML",
      hst_start: "03-Jul-24",
      hst_days: "253",
      issue: "Low test samples",
      status: "Under Testing",
      action_owner: "FWP",
      remarks: "WNTD is 5.1km away from site and no good server is available.Need to move user to PCI 277. 1211- No better coverage available"
    },
    {
      id: 3,
      owner: "Saad",
      loc_id: "LOC000004400087",
      wntd_id: "NTD000047502445",
      imsi: "505262600700516",
      wntd_version: "V3",
      bw_profile: "FW Superfast - Professional",
      rsp: "Malua Bay",
      site_name: "2-MR-51-05-M",
      utran_cell_id: "2-MR-51-05-M",
      hst_start: "06-Aug-24",
      hst_days: "219",
      issue: "Network",
      status: "Under Opti",
      action_owner: "FWP",
      remarks: "Already in best serving cell RSRP-90 and less loaded cell. No further optimization scope visible"
    },
    {
      id: 4,
      owner: "Alex",
      loc_id: "LOC000150163051",
      wntd_id: "NTD000045183310",
      imsi: "505262600457894",
      wntd_version: "V3",
      bw_profile: "FW Home Fast M2",
      rsp: "Stanthorpe",
      site_name: "51-08-STAT-0",
      utran_cell_id: "51-08-STAT-0",
      hst_start: "23-Aug-24",
      hst_days: "202",
      issue: "Cable Issue | Offpan",
      status: "Under Assurance",
      action_owner: "Assurance",
      remarks: "13-Nov- User is on best beam as per Mod scan with RSRP= -100,WNTD to site Distance is 4.9Km,E tilt change required from 4 to 2\nAugust 20, 2024 11:50:49\nSaad Hassan changed value of remarks to\nUser moved from 11-06 to 10-11. Best cell RSRP = -100"
    },
    {
      id: 5,
      owner: "Sirsha",
      loc_id: "LOC000186707089",
      wntd_id: "NTD000045402346",
      imsi: "505262604633501",
      wntd_version: "V3",
      bw_profile: "FW Home Fast M2",
      rsp: "Busselton Wes",
      site_name: "51-03-BSWS-1",
      utran_cell_id: "51-03-BSWS-1",
      hst_start: "29-Aug-24",
      hst_days: "196",
      issue: "Poor RF | Capacity",
      status: "Products",
      remarks: "13-Nov- Move the user to cell 4BWE S1-07-MERI-10-05(PCI-204)\nAugust 20, 2024 13:13:27\nSaad Hassan changed value of remarks to\nUser moved from 11-06 to 10-11. Best cell RSRP = -100"
    },
    {
      id: 6,
      owner: "Adolfo",
      loc_id: "LOC000015797917",
      wntd_id: "NTD000046511728",
      imsi: "505262604898657",
      wntd_version: "V3",
      bw_profile: "FW Home Fast Wireline",
      rsp: "Merinda",
      site_name: "E-51-07-MERI-1",
      utran_cell_id: "E-51-07-MERI-1",
      hst_start: "12-Sep-24",
      hst_days: "182",
      issue: "Poor RF | No Cell",
      status: "Under Research",
      action_owner: "Research",
      remarks: "Bad RSRP(-107) with sector loaded. Under research if 4th carrier can help"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [selectedWNTD, setSelectedWNTD] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    underTesting: 0,
    completed: 0
  });
  
  // Add new state for new WNTD dialog
  const [newWNTDDialogOpen, setNewWNTDDialogOpen] = useState(false);
  const [newWNTDData, setNewWNTDData] = useState({
    owner: '',
    loc_id: '',
    wntd_id: '',
    imsi: '',
    wntd_version: '',
    bw_profile: '',
    rsp: '',
    site_name: '',
    utran_cell_id: '',
    hst_start: '',
    hst_days: '',
    issue: '',
    status: '',
    action_owner: '',
    remarks: ''
  });
  
  // Define columns for the DataGrid
  const columns = [
    { field: 'wntd_id', headerName: 'WNTD ID', flex: 1, minWidth: 150 },
    { field: 'owner', headerName: 'Owner', flex: 0.8, minWidth: 100 },
    { field: 'loc_id', headerName: 'Location ID', flex: 1, minWidth: 150 },
    { field: 'imsi', headerName: 'IMSI', flex: 1, minWidth: 150 },
    { field: 'wntd_version', headerName: 'Version', flex: 0.6, minWidth: 100 },
    { field: 'bw_profile', headerName: 'BW Profile', flex: 1, minWidth: 180 },
    { field: 'rsp', headerName: 'RSP', flex: 0.8, minWidth: 120 },
    { field: 'site_name', headerName: 'Site Name', flex: 0.8, minWidth: 120 },
    { field: 'utran_cell_id', headerName: 'UTRAN Cell ID', flex: 1, minWidth: 150 },
    { field: 'hst_start', headerName: 'HST Start', flex: 0.8, minWidth: 110 },
    { field: 'hst_days', headerName: 'HST Days', type: 'number', flex: 0.6, minWidth: 100 },
    { 
      field: 'issue', 
      headerName: 'Issue', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color={params.value === 'No Issue' ? 'success' : (params.value.includes('Poor RF') ? 'error' : 'warning')}
          variant="outlined"
        />
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 0.8, 
      minWidth: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color={
            params.value === 'Pass' ? 'success' : 
            params.value.includes('Under') ? 'warning' : 'primary'
          }
        />
      )
    },
    { field: 'action_owner', headerName: 'Action Owner', flex: 0.8, minWidth: 120 },
    { 
      field: 'remarks', 
      headerName: 'Remarks', 
      flex: 2, 
      minWidth: 300,
      cellClassName: 'remarks-cell',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ whiteSpace: 'normal', lineHeight: 1.4 }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="info" onClick={() => handleViewHistory(params.row)}>
            <HistoryIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(params.row)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  // Calculate stats from wntdData
  useEffect(() => {
    const total = wntdData.length;
    const active = wntdData.filter(item => item.status === 'Pass').length;
    const underTesting = wntdData.filter(item => item.status === 'Under Testing').length;
    const completed = wntdData.filter(item => item.status === 'Completed').length;

    setStats({
      total,
      active,
      underTesting,
      completed
    });
  }, [wntdData]);

  // Handler functions
  const handleEdit = (row) => {
    setEditData(row);
    setEditDialogOpen(true);
  };

  const handleDelete = (row) => {
    setDeleteData(row);
    setDeleteDialogOpen(true);
  };

  const handleViewHistory = (row) => {
    setHistoryData(row.history || []);
    setHistoryDialogOpen(true);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await wntdAPI.getAll();
      // setWNTDData(response.data);
    } catch (err) {
      setError('Failed to refresh data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Implement export functionality
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(wntdData[0]).join(",") + "\n" +
      wntdData.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "wntd_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Implement file upload logic
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setWNTDData(data);
        } catch (err) {
          setError('Invalid file format. Please upload a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleNewWNTD = () => {
    setNewWNTDDialogOpen(true);
  };

  const handleSaveNewWNTD = () => {
    const newWNTD = {
      id: wntdData.length + 1,
      ...newWNTDData,
      history: [{
        timestamp: new Date().toISOString(),
        description: 'WNTD created'
      }]
    };
    setWNTDData([...wntdData, newWNTD]);
    setNewWNTDDialogOpen(false);
    setNewWNTDData({
      owner: '',
      loc_id: '',
      wntd_id: '',
      imsi: '',
      wntd_version: '',
      bw_profile: '',
      rsp: '',
      site_name: '',
      utran_cell_id: '',
      hst_start: '',
      hst_days: '',
      issue: '',
      status: '',
      action_owner: '',
      remarks: ''
    });
  };

  const handleSaveEdit = () => {
    const updatedData = wntdData.map(item => {
      if (item.id === editData.id) {
        return {
          ...item,
          ...editData,
          history: [
            ...(item.history || []),
            {
              timestamp: new Date().toISOString(),
              description: 'WNTD updated'
            }
          ]
        };
      }
      return item;
    });
    setWNTDData(updatedData);
    setEditDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    const updatedData = wntdData.filter(item => item.id !== deleteData.id);
    setWNTDData(updatedData);
    setDeleteDialogOpen(false);
  };

  // Render the DataGrid implementation
  return (
    <PageContainer>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
        <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
          WNTD Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage What Not To Deploy (WNTD) data for network optimization
        </Typography>
      </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <AnimatedButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleNewWNTD}
            >
              New WNTD
            </AnimatedButton>
            <AnimatedButton
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Refresh
            </AnimatedButton>
            <AnimatedButton
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExport}
            >
              Export
            </AnimatedButton>
            <AnimatedButton
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={handleImport}
            >
              Import
            </AnimatedButton>
          </Stack>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard color={theme.palette.primary.main}>
            <Box display="flex" alignItems="center" sx={{ mb: 1.5 }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  color: theme.palette.primary.main,
                  mr: 1.5,
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <DevicesIcon />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Total WNTDs
              </Typography>
            </Box>
            <Typography variant="h4" className="stats-value" sx={{ mb: 0.5 }}>
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Total WNTD devices in system
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={100} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 4
                },
                mt: 'auto'
              }} 
            />
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard color={theme.palette.success.main}>
            <Box display="flex" alignItems="center" sx={{ mb: 1.5 }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.success.main, 0.15),
                  color: theme.palette.success.main,
                  mr: 1.5,
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <CheckCircleIcon />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Active
              </Typography>
            </Box>
            <Typography variant="h4" className="stats-value" sx={{ mb: 0.5 }}>
              {stats.active}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Currently active WNTDs
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(stats.active / stats.total) * 100} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.success.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.success.main,
                  borderRadius: 4
                },
                mt: 'auto'
              }} 
            />
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard color={theme.palette.warning.main}>
            <Box display="flex" alignItems="center" sx={{ mb: 1.5 }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.warning.main, 0.15),
                  color: theme.palette.warning.main,
                  mr: 1.5,
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <WarningIcon />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Under Testing
              </Typography>
            </Box>
            <Typography variant="h4" className="stats-value" sx={{ mb: 0.5 }}>
              {stats.underTesting}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              WNTDs being tested
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(stats.underTesting / stats.total) * 100} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.warning.main,
                  borderRadius: 4
                },
                mt: 'auto'
              }} 
            />
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard color={theme.palette.info.main}>
            <Box display="flex" alignItems="center" sx={{ mb: 1.5 }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.info.main, 0.15),
                  color: theme.palette.info.main,
                  mr: 1.5,
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <CheckCircleIcon />
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Completed
              </Typography>
            </Box>
            <Typography variant="h4" className="stats-value" sx={{ mb: 0.5 }}>
              {stats.completed}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Successfully completed WNTDs
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(stats.completed / stats.total) * 100} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.info.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.info.main,
                  borderRadius: 4
                },
                mt: 'auto'
              }} 
            />
          </StatsCard>
        </Grid>
      </Grid>

      {/* Search and Filter Bar */}
      <SearchBar elevation={0}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search WNTDs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={tabValue}
            onChange={(e) => setTabValue(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value={0}>All</MenuItem>
            <MenuItem value={1}>Active</MenuItem>
            <MenuItem value={2}>Under Testing</MenuItem>
            <MenuItem value={3}>Completed</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={() => {/* Filter handler */}}
        >
          Filters
        </Button>
      </SearchBar>

      {/* DataGrid */}
      <TableBox>
        <DataGrid
          rows={wntdData}
          columns={columns}
          loading={loading}
          autoHeight={false}
          density="standard"
          disableColumnMenu={false}
          disableRowSelectionOnClick
          getRowHeight={() => 'auto'}
          getEstimatedRowHeight={() => 100}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
          }}
          pagination
          paginationMode="client"
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 300 },
            },
          }}
          sx={{
            '& .MuiDataGrid-main': {
              overflow: 'auto',
            },
            '& .MuiDataGrid-virtualScroller': {
              overflow: 'auto',
            },
            '& .MuiDataGrid-row': {
              minHeight: '60px !important',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              whiteSpace: 'normal',
              overflow: 'visible',
              lineHeight: 'normal',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: alpha(theme.palette.background.default, 0.8),
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            },
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: '8px',
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: alpha(theme.palette.divider, 0.1),
              borderRadius: '4px',
            },
          }}
        />
      </TableBox>

      {/* New WNTD Dialog */}
      <Dialog 
        open={newWNTDDialogOpen} 
        onClose={() => setNewWNTDDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">New WNTD</Typography>
            <IconButton onClick={() => setNewWNTDDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {Object.entries(newWNTDData).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  fullWidth
                  label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  value={value}
                  onChange={(e) => setNewWNTDData({ ...newWNTDData, [key]: e.target.value })}
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            startIcon={<CancelIcon />} 
            onClick={() => setNewWNTDDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            startIcon={<SaveIcon />}
            onClick={handleSaveNewWNTD}
          >
            Create WNTD
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Edit WNTD</Typography>
            <IconButton onClick={() => setEditDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {editData && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {Object.entries(editData).map(([key, value]) => (
                key !== 'id' && (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField
                      fullWidth
                      label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      value={value}
                      onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                      variant="outlined"
                    />
                  </Grid>
                )
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            startIcon={<CancelIcon />} 
            onClick={() => setEditDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            startIcon={<SaveIcon />}
            onClick={handleSaveEdit}
          >
            Save Changes
          </Button>
        </DialogActions>
        </Dialog>

      {/* Delete Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this WNTD? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            color="error" 
            variant="contained"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
        </Dialog>

      {/* History Dialog */}
      <Dialog 
        open={historyDialogOpen} 
        onClose={() => setHistoryDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">WNTD History</Typography>
            <IconButton onClick={() => setHistoryDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {historyData.map((entry, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {entry.timestamp}
                </Typography>
                <Typography variant="body2">
                  {entry.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleFileUpload}
      />
    </PageContainer>
  );
};

export default WNTDTracker; 