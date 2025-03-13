import { useState, useEffect } from 'react';
import api from '../../lib/api';

// Material UI imports
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SecurityIcon from '@mui/icons-material/Security';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const RoleManager = () => {
  // In a real application, you would fetch these from your API
  // For now, we'll use hardcoded roles
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'admin',
      display_name: 'Administrator',
      description: 'Full access to all system features',
      permissions: [
        'user_management_access',
        'user_management_create',
        'user_management_edit',
        'user_management_delete',
        'implementation_tracker_access',
        'implementation_tracker_create',
        'implementation_tracker_edit',
        'implementation_tracker_delete',
        'config_tools_access',
        'config_tools_create',
        'config_tools_edit',
        'config_tools_delete',
        'network_performance_access',
        'network_performance_create',
        'network_performance_edit',
        'network_performance_delete',
        'wntd_tracker_access',
        'wntd_tracker_create',
        'wntd_tracker_edit',
        'wntd_tracker_delete',
      ],
      user_count: 1
    },
    {
      id: 2,
      name: 'user',
      display_name: 'Standard User',
      description: 'Basic access to view data and make minor changes',
      permissions: [
        'implementation_tracker_access',
        'implementation_tracker_create',
        'implementation_tracker_edit',
        'config_tools_access',
        'config_tools_create',
        'network_performance_access',
        'network_performance_create',
        'wntd_tracker_access',
        'wntd_tracker_create',
      ],
      user_count: 5
    }
  ]);

  // All available permissions in the system
  const availablePermissions = [
    { id: 'user_management_access', name: 'Access User Management', category: 'User Management' },
    { id: 'user_management_create', name: 'Create Users', category: 'User Management' },
    { id: 'user_management_edit', name: 'Edit Users', category: 'User Management' },
    { id: 'user_management_delete', name: 'Delete Users', category: 'User Management' },
    
    { id: 'implementation_tracker_access', name: 'Access Implementation Tracker', category: 'Implementation Tracker' },
    { id: 'implementation_tracker_create', name: 'Create Implementation Items', category: 'Implementation Tracker' },
    { id: 'implementation_tracker_edit', name: 'Edit Implementation Items', category: 'Implementation Tracker' },
    { id: 'implementation_tracker_delete', name: 'Delete Implementation Items', category: 'Implementation Tracker' },
    
    { id: 'config_tools_access', name: 'Access Config Tools', category: 'Config Tools' },
    { id: 'config_tools_create', name: 'Create Config Tools', category: 'Config Tools' },
    { id: 'config_tools_edit', name: 'Edit Config Tools', category: 'Config Tools' },
    { id: 'config_tools_delete', name: 'Delete Config Tools', category: 'Config Tools' },
    
    { id: 'network_performance_access', name: 'Access Network Performance', category: 'Network Performance' },
    { id: 'network_performance_create', name: 'Create Performance Metrics', category: 'Network Performance' },
    { id: 'network_performance_edit', name: 'Edit Performance Metrics', category: 'Network Performance' },
    { id: 'network_performance_delete', name: 'Delete Performance Metrics', category: 'Network Performance' },
    
    { id: 'wntd_tracker_access', name: 'Access WNTD Tracker', category: 'WNTD Tracker' },
    { id: 'wntd_tracker_create', name: 'Create WNTD Items', category: 'WNTD Tracker' },
    { id: 'wntd_tracker_edit', name: 'Edit WNTD Items', category: 'WNTD Tracker' },
    { id: 'wntd_tracker_delete', name: 'Delete WNTD Items', category: 'WNTD Tracker' },
  ];

  // Group permissions by category for easier management
  const permissionCategories = {};
  availablePermissions.forEach(permission => {
    if (!permissionCategories[permission.category]) {
      permissionCategories[permission.category] = [];
    }
    permissionCategories[permission.category].push(permission);
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // New role form state
  const [newRole, setNewRole] = useState({
    name: '',
    display_name: '',
    description: '',
    permissions: []
  });
  
  // In a real app, you would fetch roles from the API
  useEffect(() => {
    // Simulating API call
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleEditDialogOpen = (role) => {
    setSelectedRole(role);
    setNewRole({
      name: role.name,
      display_name: role.display_name,
      description: role.description,
      permissions: [...role.permissions]
    });
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedRole(null);
  };

  const handleCreateDialogOpen = () => {
    setNewRole({
      name: '',
      display_name: '',
      description: '',
      permissions: []
    });
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  const handleDeleteDialogOpen = (role) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedRole(null);
  };

  const handleCreateRole = () => {
    // Validation
    if (!newRole.name || !newRole.display_name) {
      setSnackbar({
        open: true,
        message: 'Role name and display name are required',
        severity: 'error'
      });
      return;
    }

    // In a real app, you would make an API call here
    const newRoleObj = {
      id: roles.length + 1,
      name: newRole.name,
      display_name: newRole.display_name,
      description: newRole.description,
      permissions: newRole.permissions,
      user_count: 0
    };

    setRoles([...roles, newRoleObj]);
    setSnackbar({
      open: true,
      message: `Role "${newRole.display_name}" created successfully`,
      severity: 'success'
    });
    handleCreateDialogClose();
  };

  const handleUpdateRole = () => {
    // Validation
    if (!newRole.name || !newRole.display_name) {
      setSnackbar({
        open: true,
        message: 'Role name and display name are required',
        severity: 'error'
      });
      return;
    }

    // In a real app, you would make an API call here
    const updatedRoles = roles.map(role => {
      if (role.id === selectedRole.id) {
        return {
          ...role,
          name: newRole.name,
          display_name: newRole.display_name,
          description: newRole.description,
          permissions: newRole.permissions
        };
      }
      return role;
    });

    setRoles(updatedRoles);
    setSnackbar({
      open: true,
      message: `Role "${newRole.display_name}" updated successfully`,
      severity: 'success'
    });
    handleEditDialogClose();
  };

  const handleDeleteRole = () => {
    // Check if this is a system role that shouldn't be deleted
    if (selectedRole.name === 'admin' || selectedRole.name === 'user') {
      setSnackbar({
        open: true,
        message: `Cannot delete system role "${selectedRole.display_name}"`,
        severity: 'error'
      });
      handleDeleteDialogClose();
      return;
    }

    // In a real app, you would make an API call here
    const updatedRoles = roles.filter(role => role.id !== selectedRole.id);
    setRoles(updatedRoles);
    setSnackbar({
      open: true,
      message: `Role "${selectedRole.display_name}" deleted successfully`,
      severity: 'success'
    });
    handleDeleteDialogClose();
  };

  const handlePermissionChange = (permissionId) => {
    if (newRole.permissions.includes(permissionId)) {
      setNewRole({
        ...newRole,
        permissions: newRole.permissions.filter(id => id !== permissionId)
      });
    } else {
      setNewRole({
        ...newRole,
        permissions: [...newRole.permissions, permissionId]
      });
    }
  };

  const handleSelectAllInCategory = (category, select) => {
    const categoryPermissionIds = permissionCategories[category].map(p => p.id);
    
    if (select) {
      // Add all permissions from this category that aren't already in the list
      const newPermissions = [...new Set([
        ...newRole.permissions,
        ...categoryPermissionIds
      ])];
      setNewRole({
        ...newRole,
        permissions: newPermissions
      });
    } else {
      // Remove all permissions from this category
      setNewRole({
        ...newRole,
        permissions: newRole.permissions.filter(id => !categoryPermissionIds.includes(id))
      });
    }
  };

  // Check if all permissions in a category are selected
  const isCategoryFullySelected = (category) => {
    const categoryPermissionIds = permissionCategories[category].map(p => p.id);
    return categoryPermissionIds.every(id => newRole.permissions.includes(id));
  };

  // Check if any permissions in a category are selected
  const isCategoryPartiallySelected = (category) => {
    const categoryPermissionIds = permissionCategories[category].map(p => p.id);
    return categoryPermissionIds.some(id => newRole.permissions.includes(id)) && 
           !categoryPermissionIds.every(id => newRole.permissions.includes(id));
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRole({
      ...newRole,
      [name]: value
    });
  };

  // Get permissions for a role
  const getPermissionCountsByCategory = (rolePermissions) => {
    const result = {};
    
    Object.keys(permissionCategories).forEach(category => {
      const totalInCategory = permissionCategories[category].length;
      const selectedInCategory = permissionCategories[category].filter(
        permission => rolePermissions.includes(permission.id)
      ).length;
      
      result[category] = {
        selected: selectedInCategory,
        total: totalInCategory
      };
    });
    
    return result;
  };

  // Render role cards
  const renderRoleCards = () => {
    return roles.map(role => {
      const permissionCounts = getPermissionCountsByCategory(role.permissions);
      
      return (
        <Grid item xs={12} md={6} key={role.id}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    bgcolor: role.name === 'admin' ? 'primary.light' : 'secondary.light', 
                    color: role.name === 'admin' ? 'primary.main' : 'secondary.main',
                    p: 1,
                    borderRadius: 1,
                    mr: 2,
                    display: 'inline-flex'
                  }}
                >
                  {role.name === 'admin' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                </Box>
                <Box>
                  <Typography variant="h6" component="div">
                    {role.display_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {role.name}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {role.description}
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                Permissions
              </Typography>
              
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {Object.keys(permissionCounts).map(category => (
                  <Grid item key={category}>
                    <Tooltip title={`${permissionCounts[category].selected} of ${permissionCounts[category].total} in ${category}`}>
                      <Chip 
                        label={`${category}: ${permissionCounts[category].selected}/${permissionCounts[category].total}`}
                        color={permissionCounts[category].selected === permissionCounts[category].total ? 'success' : 'default'}
                        variant={permissionCounts[category].selected > 0 ? 'filled' : 'outlined'}
                        size="small"
                      />
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <GroupIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {role.user_count} {role.user_count === 1 ? 'user' : 'users'} assigned
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                startIcon={<EditIcon />} 
                onClick={() => handleEditDialogOpen(role)}
              >
                Edit
              </Button>
              <Button 
                size="small" 
                startIcon={<DeleteIcon />} 
                color="error"
                onClick={() => handleDeleteDialogOpen(role)}
                disabled={role.name === 'admin' || role.name === 'user'} // Prevent deleting system roles
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        </Grid>
      );
    });
  };

  // Render permission selection dialog content
  const renderPermissionSelectionForm = () => {
    return (
      <Box sx={{ mt: 2 }}>
        {Object.keys(permissionCategories).map(category => {
          const isAllSelected = isCategoryFullySelected(category);
          const isPartiallySelected = isCategoryPartiallySelected(category);
          
          return (
            <Box key={category} sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={isAllSelected}
                    indeterminate={isPartiallySelected}
                    onChange={() => handleSelectAllInCategory(category, !isAllSelected)}
                  />
                }
                label={<Typography variant="subtitle1">{category}</Typography>}
              />
              
              <Box sx={{ ml: 3 }}>
                <FormGroup>
                  {permissionCategories[category].map(permission => (
                    <FormControlLabel
                      key={permission.id}
                      control={
                        <Checkbox 
                          size="small"
                          checked={newRole.permissions.includes(permission.id)}
                          onChange={() => handlePermissionChange(permission.id)}
                        />
                      }
                      label={permission.name}
                    />
                  ))}
                </FormGroup>
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Role Management
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />} 
            onClick={handleCreateDialogOpen}
          >
            Add Role
          </Button>
        </Box>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {renderRoleCards()}
        </Grid>
      )}
      
      {/* Create Role Dialog */}
      <Dialog open={createDialogOpen} onClose={handleCreateDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Define a new role with specific permissions
          </DialogContentText>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Role Name"
                name="name"
                value={newRole.name}
                onChange={handleInputChange}
                helperText="System name, lowercase with no spaces (e.g. 'manager')"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Display Name"
                name="display_name"
                value={newRole.display_name}
                onChange={handleInputChange}
                helperText="Human-readable name (e.g. 'Site Manager')"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={newRole.description}
                onChange={handleInputChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
          
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            Permissions
          </Typography>
          
          {renderPermissionSelectionForm()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Cancel</Button>
          <Button onClick={handleCreateRole} variant="contained" color="primary">
            Create Role
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit Role Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update role and manage permissions
          </DialogContentText>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Role Name"
                name="name"
                value={newRole.name}
                onChange={handleInputChange}
                helperText="System name, lowercase with no spaces"
                disabled={selectedRole?.name === 'admin' || selectedRole?.name === 'user'} // Can't change system role names
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Display Name"
                name="display_name"
                value={newRole.display_name}
                onChange={handleInputChange}
                helperText="Human-readable name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={newRole.description}
                onChange={handleInputChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
          
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            Permissions
          </Typography>
          
          {renderPermissionSelectionForm()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleUpdateRole} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Role Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the role "{selectedRole?.display_name}"?
            {selectedRole?.user_count > 0 && (
              <strong> This role is currently assigned to {selectedRole.user_count} users.</strong>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteRole} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RoleManager; 