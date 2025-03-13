import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Grid,
  InputAdornment,
  Avatar,
  Tabs,
  Tab,
  Divider
} from '@mui/material';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyIcon from '@mui/icons-material/Key';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import EngineeringIcon from '@mui/icons-material/Engineering';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
      style={{ padding: '20px 0' }}
    >
      {value === index && (
        <Box>{children}</Box>
      )}
    </div>
  );
}

const UserManager = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createUserDialog, setCreateUserDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [resetPasswordDialog, setResetPasswordDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);

  // New user form state
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
    role: 'user',
    department: ''
  });

  // Reset password form state
  const [resetPassword, setResetPassword] = useState({
    password: '',
    confirm_password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleDialogOpen = (user) => {
    setSelectedUser(user);
    setNewRole(user.profile.role);
    setRoleDialogOpen(true);
  };

  const handleRoleDialogClose = () => {
    setRoleDialogOpen(false);
    setSelectedUser(null);
  };

  const handleStatusDialogOpen = (user) => {
    setSelectedUser(user);
    setStatusDialogOpen(true);
  };

  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteDialogOpen = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleCreateUserDialogOpen = () => {
    setCreateUserDialog(true);
  };

  const handleCreateUserDialogClose = () => {
    setCreateUserDialog(false);
    setNewUser({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      confirm_password: '',
      role: 'user',
      department: ''
    });
  };

  const handleEditUserDialogOpen = (user) => {
    setSelectedUser(user);
    setEditUserDialog(true);
  };

  const handleEditUserDialogClose = () => {
    setEditUserDialog(false);
    setSelectedUser(null);
  };

  const handleResetPasswordDialogOpen = (user) => {
    setSelectedUser(user);
    setResetPasswordDialog(true);
    setResetPassword({
      password: '',
      confirm_password: ''
    });
  };

  const handleResetPasswordDialogClose = () => {
    setResetPasswordDialog(false);
    setSelectedUser(null);
  };

  const handleChangeRole = async () => {
    try {
      await api.post(`/users/${selectedUser.id}/set_role/`, { 
        role: newRole,
        department: selectedUser.profile.department 
      });
      
      // Update the local state
      setUsers(users.map(user => {
        if (user.id === selectedUser.id) {
          return { 
            ...user, 
            profile: { 
              ...user.profile, 
              role: newRole,
              department: selectedUser.profile.department 
            } 
          };
        }
        return user;
      }));
      
      setSnackbar({
        open: true,
        message: `Role and department updated successfully for ${selectedUser.username}`,
        severity: 'success'
      });
      
      handleRoleDialogClose();
    } catch (err) {
      console.error('Error changing role:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update role and department. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleToggleStatus = async () => {
    try {
      const endpoint = selectedUser.is_active ? 'deactivate' : 'activate';
      await api.post(`/users/${selectedUser.id}/${endpoint}/`);
      
      // Update the local state
      setUsers(users.map(user => {
        if (user.id === selectedUser.id) {
          return { ...user, is_active: !user.is_active };
        }
        return user;
      }));
      
      setSnackbar({
        open: true,
        message: `User ${selectedUser.is_active ? 'deactivated' : 'activated'} successfully`,
        severity: 'success'
      });
      
      handleStatusDialogClose();
    } catch (err) {
      console.error('Error toggling user status:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update user status. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await api.delete(`/users/${selectedUser.id}/`);
      
      // Update the local state
      setUsers(users.filter(user => user.id !== selectedUser.id));
      
      setSnackbar({
        open: true,
        message: `User ${selectedUser.username} deleted successfully`,
        severity: 'success'
      });
      
      handleDeleteDialogClose();
    } catch (err) {
      console.error('Error deleting user:', err);
      setSnackbar({
        open: true,
        message: 'Failed to delete user. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCreateUser = async () => {
    // Validate form
    if (newUser.password !== newUser.confirm_password) {
      setSnackbar({
        open: true,
        message: 'Passwords do not match',
        severity: 'error'
      });
      return;
    }

    try {
      const userData = {
        username: newUser.username,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        password: newUser.password
      };

      const response = await api.post('/users/', userData);
      
      // Set role and department
      await api.post(`/users/${response.data.id}/set_role/`, { 
        role: newUser.role,
        department: newUser.department 
      });
      
      response.data.profile = { 
        role: newUser.role,
        department: newUser.department 
      };
      
      // Update the local state
      setUsers([...users, response.data]);
      
      setSnackbar({
        open: true,
        message: `User ${response.data.username} created successfully`,
        severity: 'success'
      });
      
      handleCreateUserDialogClose();
    } catch (err) {
      console.error('Error creating user:', err);
      setSnackbar({
        open: true,
        message: 'Failed to create user. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleEditUser = async () => {
    try {
      const userData = {
        username: selectedUser.username,
        email: selectedUser.email,
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name
      };

      const response = await api.put(`/users/${selectedUser.id}/`, userData);
      
      // Update the local state
      setUsers(users.map(user => {
        if (user.id === selectedUser.id) {
          return { ...user, ...response.data };
        }
        return user;
      }));
      
      setSnackbar({
        open: true,
        message: `User ${response.data.username} updated successfully`,
        severity: 'success'
      });
      
      handleEditUserDialogClose();
    } catch (err) {
      console.error('Error updating user:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update user. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleResetPassword = async () => {
    // Validate form
    if (resetPassword.password !== resetPassword.confirm_password) {
      setSnackbar({
        open: true,
        message: 'Passwords do not match',
        severity: 'error'
      });
      return;
    }

    try {
      await api.post(`/users/${selectedUser.id}/reset_password/`, { password: resetPassword.password });
      
      setSnackbar({
        open: true,
        message: `Password reset successfully for ${selectedUser.username}`,
        severity: 'success'
      });
      
      handleResetPasswordDialogClose();
    } catch (err) {
      console.error('Error resetting password:', err);
      setSnackbar({
        open: true,
        message: 'Failed to reset password. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    
    if (formType === 'newUser') {
      setNewUser({
        ...newUser,
        [name]: value
      });
    } else if (formType === 'editUser') {
      setSelectedUser({
        ...selectedUser,
        [name]: value
      });
    } else if (formType === 'resetPassword') {
      setResetPassword({
        ...resetPassword,
        [name]: value
      });
    }
  };
  
  // Filter users based on search query
  const filteredUsers = searchQuery 
    ? users.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;
  
  // Split users by role for tabs
  const superAdminUsers = filteredUsers.filter(user => user.profile.role === 'super-admin');
  const adminUsers = filteredUsers.filter(user => user.profile.role === 'admin');
  const managerUsers = filteredUsers.filter(user => user.profile.role === 'manager');
  const engineerUsers = filteredUsers.filter(user => user.profile.role === 'engineer');
  const regularUsers = filteredUsers.filter(user => user.profile.role === 'user');
  const activeUsers = filteredUsers.filter(user => user.is_active);
  const inactiveUsers = filteredUsers.filter(user => !user.is_active);

  // User table component to avoid duplication
  const UserTable = ({ userList }) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">No users found</TableCell>
            </TableRow>
          ) : (
            userList.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 
                          user.profile.role === 'super-admin' ? 'error.main' :
                          user.profile.role === 'admin' ? 'primary.main' :
                          user.profile.role === 'manager' ? 'warning.main' :
                          user.profile.role === 'engineer' ? 'info.main' :
                          'secondary.main',
                        width: 32,
                        height: 32,
                        mr: 1
                      }}
                    >
                      {user.first_name ? user.first_name[0] : user.username[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body1">
                        {user.first_name} {user.last_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.username}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    icon={
                      user.profile.role === 'super-admin' ? <AdminPanelSettingsIcon /> :
                      user.profile.role === 'admin' ? <AdminPanelSettingsIcon /> :
                      user.profile.role === 'manager' ? <SupervisorAccountIcon /> :
                      user.profile.role === 'engineer' ? <EngineeringIcon /> :
                      <PersonIcon />
                    }
                    label={
                      user.profile.role === 'super-admin' ? 'Super Admin' :
                      user.profile.role === 'admin' ? 'Admin' :
                      user.profile.role === 'manager' ? 'Manager' :
                      user.profile.role === 'engineer' ? 'Engineer' :
                      'User'
                    }
                    color={
                      user.profile.role === 'super-admin' ? 'error' :
                      user.profile.role === 'admin' ? 'primary' :
                      user.profile.role === 'manager' ? 'warning' :
                      user.profile.role === 'engineer' ? 'info' :
                      'default'
                    }
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {user.profile.department ? (
                    <Chip
                      label={user.profile.department}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Not assigned
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    icon={user.is_active ? <CheckCircleIcon /> : <BlockIcon />}
                    label={user.is_active ? 'Active' : 'Inactive'}
                    color={user.is_active ? 'success' : 'error'}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit User">
                    <IconButton 
                      size="small"
                      color="primary" 
                      onClick={() => handleEditUserDialogOpen(user)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Change Role">
                    <IconButton 
                      size="small"
                      color="secondary" 
                      onClick={() => handleRoleDialogOpen(user)}
                    >
                      <AdminPanelSettingsIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reset Password">
                    <IconButton 
                      size="small"
                      color="warning" 
                      onClick={() => handleResetPasswordDialogOpen(user)}
                    >
                      <KeyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={user.is_active ? "Deactivate User" : "Activate User"}>
                    <IconButton
                      size="small"
                      color={user.is_active ? 'error' : 'success'}
                      onClick={() => handleStatusDialogOpen(user)}
                    >
                      {user.is_active ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User">
                    <IconButton 
                      size="small"
                      color="error" 
                      onClick={() => handleDeleteDialogOpen(user)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />} 
            onClick={fetchUsers}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />} 
            onClick={handleCreateUserDialogOpen}
          >
            Add User
          </Button>
        </Box>
      </Box>
      
      {/* Search & Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search users by name, username or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`Total: ${users.length}`} 
                variant="outlined" 
                color="default" 
              />
              <Chip 
                icon={<AdminPanelSettingsIcon />} 
                label={`Super Admins: ${superAdminUsers.length}`} 
                variant="outlined" 
                color="error" 
              />
              <Chip 
                icon={<AdminPanelSettingsIcon />} 
                label={`Admins: ${adminUsers.length}`} 
                variant="outlined" 
                color="primary" 
              />
              <Chip 
                icon={<SupervisorAccountIcon />} 
                label={`Managers: ${managerUsers.length}`} 
                variant="outlined" 
                color="warning" 
              />
              <Chip 
                icon={<EngineeringIcon />} 
                label={`Engineers: ${engineerUsers.length}`} 
                variant="outlined" 
                color="info" 
              />
              <Chip 
                icon={<PersonIcon />} 
                label={`Regular: ${regularUsers.length}`} 
                variant="outlined" 
                color="secondary" 
              />
              <Chip 
                icon={<CheckCircleIcon />} 
                label={`Active: ${activeUsers.length}`} 
                variant="outlined" 
                color="success" 
              />
              <Chip 
                icon={<BlockIcon />} 
                label={`Inactive: ${inactiveUsers.length}`} 
                variant="outlined" 
                color="error" 
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      ) : (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All Users" id="user-tab-0" />
              <Tab label="Super Admins" id="user-tab-1" />
              <Tab label="Administrators" id="user-tab-2" />
              <Tab label="Managers" id="user-tab-3" />
              <Tab label="Engineers" id="user-tab-4" />
              <Tab label="Regular Users" id="user-tab-5" />
              <Tab label="Active Users" id="user-tab-6" />
              <Tab label="Inactive Users" id="user-tab-7" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <UserTable userList={filteredUsers} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <UserTable userList={superAdminUsers} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <UserTable userList={adminUsers} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={3}>
            <UserTable userList={managerUsers} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={4}>
            <UserTable userList={engineerUsers} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={5}>
            <UserTable userList={regularUsers} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={6}>
            <UserTable userList={activeUsers} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={7}>
            <UserTable userList={inactiveUsers} />
          </TabPanel>
        </>
      )}

      {/* Role Change Dialog */}
      <Dialog open={roleDialogOpen} onClose={handleRoleDialogClose}>
        <DialogTitle>Change User Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Change the role for user: <strong>{selectedUser?.username}</strong>
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={newRole}
              label="Role"
              onChange={(e) => setNewRole(e.target.value)}
            >
              <MenuItem value="super-admin">Super Admin</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="engineer">Engineer</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
          
          {selectedUser && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="department-select-label">Department</InputLabel>
              <Select
                labelId="department-select-label"
                value={selectedUser.profile.department || ''}
                label="Department"
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  profile: {
                    ...selectedUser.profile,
                    department: e.target.value
                  }
                })}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Operations">Operations</MenuItem>
                <MenuItem value="Planning">Planning</MenuItem>
                <MenuItem value="Optimization">Optimization</MenuItem>
                <MenuItem value="Implementation">Implementation</MenuItem>
                <MenuItem value="Management">Management</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRoleDialogClose}>Cancel</Button>
          <Button onClick={handleChangeRole} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      
      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onClose={handleStatusDialogClose}>
        <DialogTitle>
          {selectedUser?.is_active ? 'Deactivate User' : 'Activate User'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {selectedUser?.is_active ? 'deactivate' : 'activate'} user <strong>{selectedUser?.username}</strong>?
            {selectedUser?.is_active ? 
              ' This will prevent the user from logging in.' : 
              ' This will allow the user to log in again.'
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusDialogClose}>Cancel</Button>
          <Button 
            onClick={handleToggleStatus} 
            variant="contained" 
            color={selectedUser?.is_active ? 'error' : 'success'}
          >
            {selectedUser?.is_active ? 'Deactivate' : 'Activate'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete user <strong>{selectedUser?.username}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Create User Dialog */}
      <Dialog open={createUserDialog} onClose={handleCreateUserDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill in the details to create a new user account.
          </DialogContentText>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Username"
                name="username"
                value={newUser.username}
                onChange={(e) => handleInputChange(e, 'newUser')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newUser.email}
                onChange={(e) => handleInputChange(e, 'newUser')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={newUser.first_name}
                onChange={(e) => handleInputChange(e, 'newUser')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={newUser.last_name}
                onChange={(e) => handleInputChange(e, 'newUser')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={newUser.password}
                onChange={(e) => handleInputChange(e, 'newUser')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Confirm Password"
                name="confirm_password"
                type="password"
                value={newUser.confirm_password}
                onChange={(e) => handleInputChange(e, 'newUser')}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="new-role-select-label">Role</InputLabel>
                <Select
                  labelId="new-role-select-label"
                  value={newUser.role}
                  label="Role"
                  name="role"
                  onChange={(e) => handleInputChange(e, 'newUser')}
                >
                  <MenuItem value="super-admin">Super Admin</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="engineer">Engineer</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="new-department-select-label">Department</InputLabel>
                <Select
                  labelId="new-department-select-label"
                  value={newUser.department || ''}
                  label="Department"
                  name="department"
                  onChange={(e) => handleInputChange(e, 'newUser')}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                  <MenuItem value="Planning">Planning</MenuItem>
                  <MenuItem value="Optimization">Optimization</MenuItem>
                  <MenuItem value="Implementation">Implementation</MenuItem>
                  <MenuItem value="Management">Management</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateUserDialogClose}>Cancel</Button>
          <Button onClick={handleCreateUser} variant="contained" color="primary">
            Create User
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={editUserDialog} onClose={handleEditUserDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update user information for <strong>{selectedUser?.username}</strong>
          </DialogContentText>
          {selectedUser && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={selectedUser.username}
                  onChange={(e) => handleInputChange(e, 'editUser')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => handleInputChange(e, 'editUser')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={selectedUser.first_name}
                  onChange={(e) => handleInputChange(e, 'editUser')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={selectedUser.last_name}
                  onChange={(e) => handleInputChange(e, 'editUser')}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditUserDialogClose}>Cancel</Button>
          <Button onClick={handleEditUser} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialog} onClose={handleResetPasswordDialogClose}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Set a new password for user <strong>{selectedUser?.username}</strong>
          </DialogContentText>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="New Password"
                name="password"
                type="password"
                value={resetPassword.password}
                onChange={(e) => handleInputChange(e, 'resetPassword')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Confirm New Password"
                name="confirm_password"
                type="password"
                value={resetPassword.confirm_password}
                onChange={(e) => handleInputChange(e, 'resetPassword')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetPasswordDialogClose}>Cancel</Button>
          <Button onClick={handleResetPassword} variant="contained" color="primary">
            Reset Password
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

export default UserManager; 