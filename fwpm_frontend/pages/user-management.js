import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import AdminRoute from '../components/auth/AdminRoute';
import api from '../lib/api';

// Material UI components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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

  const handleChangeRole = async () => {
    try {
      await api.post(`/users/${selectedUser.id}/set_role/`, { role: newRole });
      
      // Update the local state
      setUsers(users.map(user => {
        if (user.id === selectedUser.id) {
          return { ...user, profile: { ...user.profile, role: newRole } };
        }
        return user;
      }));
      
      setSnackbar({
        open: true,
        message: `Role updated successfully for ${selectedUser.username}`,
        severity: 'success'
      });
      
      handleRoleDialogClose();
    } catch (err) {
      console.error('Error changing role:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update role. Please try again.',
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

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Management
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={user.profile.role === 'admin' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                      label={user.profile.role === 'admin' ? 'Admin' : 'User'}
                      color={user.profile.role === 'admin' ? 'primary' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={user.is_active ? <CheckCircleIcon /> : <BlockIcon />}
                      label={user.is_active ? 'Active' : 'Inactive'}
                      color={user.is_active ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleRoleDialogOpen(user)}
                      title="Change Role"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color={user.is_active ? 'error' : 'success'}
                      onClick={() => handleStatusDialogOpen(user)}
                      title={user.is_active ? 'Deactivate User' : 'Activate User'}
                    >
                      {user.is_active ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
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

UserManagement.getLayout = (page) => (
  <AdminRoute>
    <MainLayout>
      {page}
    </MainLayout>
  </AdminRoute>
);

export default UserManagement; 