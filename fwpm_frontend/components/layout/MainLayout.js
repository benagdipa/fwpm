import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
// Import but don't use the hook directly in this server component
import { styled, alpha } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ListSubheader from '@mui/material/ListSubheader';
import Collapse from '@mui/material/Collapse';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import NetworkCellIcon from '@mui/icons-material/NetworkCell';
import DevicesIcon from '@mui/icons-material/Devices';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const drawerWidth = 240;

// Simple drawer component
const MainDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: 200
    }
  },
}));

// Simple app bar component
const MainAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: 'box-shadow 0.3s ease, background-color 0.3s ease',
  backdropFilter: 'blur(10px)',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(31, 41, 55, 0.8)' 
    : 'rgba(255, 255, 255, 0.8)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 20px rgba(0, 0, 0, 0.3)'
    : '0 4px 20px rgba(0, 0, 0, 0.05)',
  [theme.breakpoints.up('md')]: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  [theme.breakpoints.between('sm', 'md')]: {
    width: `calc(100% - 200px)`,
    marginLeft: 200,
  }
}));

// Simple main content area
const MainContent = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create(['margin', 'background-color'], {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  [theme.breakpoints.up('md')]: {
    marginLeft: 'auto',
  },
  [theme.breakpoints.between('sm', 'md')]: {
    marginLeft: 200,
    padding: theme.spacing(2),
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    padding: theme.spacing(2, 1),
  },
  '& > *': {
    animation: 'zoomIn 0.5s ease-out forwards',
  }
}));

// Add a container component for page content
const PageContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1600px',
  margin: '0 auto',
  width: '100%',
  position: 'relative',
  minHeight: 'calc(100vh - 64px)',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: theme.palette.mode === 'dark' 
      ? 'radial-gradient(circle at top right, rgba(124, 58, 237, 0.06), transparent 50%)' 
      : 'radial-gradient(circle at top right, rgba(37, 99, 235, 0.06), transparent 50%)',
    pointerEvents: 'none',
    zIndex: -1,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 0.5),
  }
}));

// Client-side component for theme toggling
const ThemeToggle = () => {
  // Only import and use the hook on the client side
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const muiTheme = useMuiTheme();
  
  useEffect(() => {
    // Check for dark mode on mount
    setMounted(true);
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    
    // Set up an observer to watch for theme changes
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);
  
  // Don't render anything until mounted on client
  if (!mounted) return null;
  
  const toggleTheme = () => {
    setIsAnimating(true);
    
    // Slight delay to allow animation to complete
    setTimeout(() => {
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Updated theme in localStorage and HTML class
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.remove(currentTheme);
      document.documentElement.classList.add(newTheme);
      
      // Update state
      setIsDarkMode(newTheme === 'dark');
      
      // After animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 150);
  };
  
  return (
    <Tooltip title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
      <Box 
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 1,
        }}
      >
        <Box 
          sx={{
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            borderRadius: '40px',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            width: '48px',
            justifyContent: isDarkMode ? 'flex-end' : 'flex-start',
            position: 'relative',
            cursor: 'pointer',
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
            boxShadow: isDarkMode ? '0 0 10px rgba(255,255,255,0.2)' : 'inset 0 0 5px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: isDarkMode ? '0 0 15px rgba(255,255,255,0.3)' : 'inset 0 0 8px rgba(0,0,0,0.2)',
            }
          }}
          onClick={toggleTheme}
        >
          <Box
            sx={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: isDarkMode ? '#E1E1FF' : '#FDB813',
              boxShadow: isDarkMode 
                ? '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.4)' 
                : '0 0 10px rgba(253, 184, 19, 0.8), 0 0 20px rgba(253, 184, 19, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: isAnimating ? 'scale(0.8) rotate(180deg)' : 'scale(1) rotate(0deg)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': isDarkMode ? {
                content: '""',
                position: 'absolute',
                top: '2px',
                left: '3px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#111827',
                transform: 'translateX(-30%)',
              } : {},
            }}
          />
          {!isDarkMode && (
            <Box
              sx={{
                position: 'absolute',
                width: '40px',
                height: '40px',
                opacity: 0.2,
                backgroundImage: 'radial-gradient(circle, #FDB813 10%, transparent 70%)',
                animation: isAnimating ? 'none' : 'pulse 2s infinite',
                left: 0,
                top: '-8px',
                pointerEvents: 'none',
              }}
            />
          )}
          {isDarkMode && (
            <>
              <Box
                sx={{
                  position: 'absolute',
                  width: '2px',
                  height: '2px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  top: '6px',
                  right: '10px',
                  boxShadow: '0 0 3px white',
                  animation: 'twinkle 1.5s infinite',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: '1px',
                  height: '1px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  top: '15px',
                  right: '15px',
                  boxShadow: '0 0 2px white',
                  animation: 'twinkle 2s infinite 0.5s',
                }}
              />
            </>
          )}
        </Box>
      </Box>
    </Tooltip>
  );
};

// For navigation items, let's create a custom component with animations
const NavItem = ({ icon, text, href, isActive, expandIcon, onClick, badge, indentLevel = 0 }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    } else if (href) {
      router.push(href);
    }
  };
  
  return (
    <ListItem 
      disablePadding 
      sx={{ 
        pl: indentLevel * 2,
        position: 'relative', 
        overflow: 'hidden',
      }}
    >
      <ListItemButton
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        selected={isActive}
        className="nav-link"
        sx={{
          transition: 'all 0.2s ease',
          pl: indentLevel > 0 ? 4 : 2,
          position: 'relative',
          borderRadius: '8px',
          mx: 1,
          width: 'calc(100% - 16px)',
          '&::before': isActive ? {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            height: '60%',
            width: '4px',
            backgroundColor: 'primary.main',
            borderRadius: '0 4px 4px 0',
            transform: 'translateY(-50%)',
            transition: 'all 0.3s ease',
          } : {},
          '&.Mui-selected': {
            backgroundColor: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.08)' 
              : 'rgba(0, 0, 0, 0.04)',
          },
          '&:hover': {
            backgroundColor: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.12)' 
              : 'rgba(0, 0, 0, 0.06)',
            transform: 'translateX(4px)',
          },
        }}
      >
        <ListItemIcon 
          sx={{ 
            minWidth: 40,
            color: isActive ? 'primary.main' : 'inherit',
            transition: 'color 0.2s ease, transform 0.2s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText 
          primary={text} 
          sx={{ 
            '& .MuiTypography-root': {
              fontSize: '0.95rem',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'primary.main' : 'inherit',
              transition: 'color 0.2s ease, font-weight 0.2s ease',
            }
          }}
        />
        {badge && (
          <Chip 
            size="small" 
            label={badge} 
            color="primary" 
            sx={{ 
              ml: 1,
              transition: 'transform 0.2s ease, opacity 0.2s ease',
              animation: 'fadeIn 0.3s ease',
            }} 
          />
        )}
        {expandIcon && (
          <Box 
            component="span" 
            sx={{ 
              transition: 'transform 0.3s ease',
              transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            {expandIcon}
          </Box>
        )}
      </ListItemButton>
    </ListItem>
  );
};

const MainLayout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const muiTheme = useMuiTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    admin: true,
    tools: false
  });
  const router = useRouter();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Check if the current user is timpheb and treat as super-admin
  const userRole = user?.username === "timpheb" 
    ? "super-admin" 
    : user?.profile?.role;
    
  const isAdmin = userRole === 'admin' || userRole === 'super-admin';
  const isSuperAdmin = userRole === 'super-admin';
  const isManager = userRole === 'manager';
  const isEngineer = userRole === 'engineer';
  
  // Determine if user has access to admin section
  const hasAdminAccess = isAdmin || isSuperAdmin || isManager;
  
  // Check user roles
  useEffect(() => {
    // Role validation happens silently
  }, [user, userRole, isAdmin, isSuperAdmin, isManager, isEngineer]);

  // Function to get page title based on current route
  const getPageTitle = () => {
    const path = router.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/network-performance') return 'Network';
    if (path === '/wntd-tracker') return 'Devices';
    if (path === '/implementation-tracker') return 'Projects';
    if (path === '/config-tools') return 'Config';
    if (path === '/profile') return 'Profile';
    if (path === '/admin-dashboard') return 'Admin';
    if (path === '/user-management') return 'Users';
    
    // Default: convert path to title case
    return path.split('/').pop().split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || 'Dashboard';
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await logout();
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Render the navigation menu items
  const renderNavItems = () => (
    <List sx={{ py: 1 }}>
      {/* Dashboard */}
      <NavItem
        icon={<DashboardIcon />}
        text="Dashboard"
        href="/"
        isActive={router.pathname === '/'}
      />
      
      {/* Implementation Tracker */}
      <NavItem
        icon={<AssignmentIcon />}
        text="Implementation Tracker"
        href="/implementation-tracker"
        isActive={router.pathname === '/implementation-tracker'}
      />
      
      {/* Network Performance */}
      <NavItem
        icon={<NetworkCellIcon />}
        text="Network Performance"
        href="/network-performance"
        isActive={router.pathname === '/network-performance'}
      />
      
      {/* Configuration Tools */}
      <NavItem
        icon={<SettingsIcon />}
        text="Configuration Tools"
        href="/config-tools"
        isActive={router.pathname === '/config-tools'}
      />
      
      {/* WNTD Tracker */}
      <NavItem
        icon={<DevicesIcon />}
        text="WNTD Tracker"
        href="/wntd-tracker"
        isActive={router.pathname === '/wntd-tracker'}
      />
      
      {/* Admin Section */}
      {hasAdminAccess && (
        <>
          <Divider sx={{ my: 2 }} />
          <ListSubheader
            sx={{
              lineHeight: '30px',
              bgcolor: 'transparent',
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.7rem',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              transition: 'opacity 0.2s ease',
              '&:hover': {
                opacity: 0.8,
              }
            }}
          >
            Administration
          </ListSubheader>
          
          {/* Admin Dashboard */}
          <NavItem
            icon={<AdminPanelSettingsIcon />}
            text="Admin Dashboard"
            href="/admin-dashboard"
            isActive={router.pathname === '/admin-dashboard'}
          />
          
          {/* User Management */}
          <NavItem
            icon={<PeopleIcon />}
            text="User Management"
            href="/user-management"
            isActive={router.pathname === '/user-management'}
          />
        </>
      )}
    </List>
  );
  
  // Replace the old drawer content with our new navigation
  const drawer = (
    <>
      <Toolbar 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: 'border-color 0.3s ease',
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 1,
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          <img 
            src="/favicon.svg" 
            alt="FWPM Logo" 
            style={{ 
              width: 30, 
              height: 30,
              animation: 'pulse 3s infinite'
            }} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(to right, #2563eb, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              transition: 'all 0.3s ease',
            }}
          >
            FWPM
          </Typography>
        </Box>
      </Toolbar>
      {renderNavItems()}
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <MainAppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              display: { md: 'none' },
              transition: 'transform 0.2s ease',
              '&:active': {
                transform: 'scale(0.95)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              ml: { xs: 0, md: 2 },
              fontSize: { xs: '1rem', sm: '1.2rem' },
            }}
          >
            {getPageTitle()}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Theme toggler */}
            <ThemeToggle />
            
            {/* Notification icon */}
            <Tooltip title="Notifications">
              <IconButton
                size="large"
                aria-label="show new notifications"
                color="inherit"
                onClick={handleNotificationMenuOpen}
                className="notification-bell"
                sx={{
                  transition: 'transform 0.2s ease',
                  '&:active': {
                    transform: 'scale(0.95)',
                  }
                }}
              >
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {/* Profile icon */}
            <Tooltip title="Account settings">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{
                  ml: 1,
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  }
                }}
              >
                <Avatar 
                  alt={user?.username || 'User'} 
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 0 0 2px var(--primary)',
                    }
                  }}
                >
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </MainAppBar>
      
      {/* The drawer component */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobile drawer */}
        <MainDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              boxShadow: 'none',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawer}
        </MainDrawer>
        
        {/* Desktop drawer */}
        <MainDrawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              boxShadow: 'none',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </MainDrawer>
      </Box>
      
      {/* Main content */}
      <MainContent>
        <Toolbar />
        <PageContainer>
          <div className="content-zoom-in">
            {children}
          </div>
        </PageContainer>
      </MainContent>
      
      {/* Profile menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? '0 8px 24px rgba(0, 0, 0, 0.5)'
              : '0 8px 24px rgba(0, 0, 0, 0.1)',
          },
          '& .MuiMenuItem-root': {
            transition: 'background-color 0.2s ease, color 0.2s ease, transform 0.2s ease',
            borderRadius: 1,
            mx: 0.5,
            my: 0.3,
            '&:hover': {
              transform: 'translateX(4px)',
            }
          }
        }}
      >
        <div className="staggered-list">
          <MenuItem onClick={() => {router.push('/profile'); handleProfileMenuClose();}}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          
          <MenuItem onClick={handleLogout} className="ripple-effect">
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            <Typography color="error">Logout</Typography>
          </MenuItem>
        </div>
      </Menu>
      
      {/* Notification menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        sx={{
          '& .MuiPaper-root': {
            width: '320px',
            maxWidth: '100%',
            borderRadius: 2,
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? '0 8px 24px rgba(0, 0, 0, 0.5)'
              : '0 8px 24px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>Notifications</Typography>
        </Box>
        <div className="staggered-list">
          {[1, 2, 3, 4].map((item) => (
            <MenuItem 
              key={item} 
              onClick={handleNotificationMenuClose}
              sx={{ 
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': {
                  borderBottom: 'none',
                },
                '&:hover': {
                  bgcolor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  Notification {item}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
                  This is a sample notification message. Click to view details.
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.75rem', mt: 0.5 }}>
                  {item} hour{item !== 1 ? 's' : ''} ago
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </div>
        <Box sx={{ p: 1.5, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            color="primary" 
            size="small"
            className="float-on-hover"
          >
            View All Notifications
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default MainLayout; 