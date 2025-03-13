import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import Image from 'next/image';
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha } from '@mui/material/styles';

// Styled components
const AuthBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  height: '100%',
  width: '100%',
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 60%, ${theme.palette.primary.dark} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: -1,
}));

const AuthBackgroundPattern = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: 'url("/pattern.svg")',
  backgroundSize: 'cover',
  opacity: 0.1,
}));

const AuthCard = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
  overflow: 'hidden',
  transition: theme.transitions.create(['box-shadow']),
  width: '100%',
  maxHeight: '90vh',
  margin: theme.spacing(2),
  '&:hover': {
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.16)',
  },
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(1),
    maxWidth: 'calc(100% - 16px)',
    maxHeight: 'calc(100vh - 16px)',
  },
  [theme.breakpoints.down('md')]: {
    maxHeight: 'calc(100vh - 32px)',
    display: 'flex',
    flexDirection: 'column',
  },
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    flexDirection: 'row',
    maxWidth: 960,
    minHeight: 540,
    maxHeight: 'calc(100vh - 64px)',
  },
}));

const SidePanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 1.5),
    minHeight: '25vh', 
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3, 2),
    minHeight: '30vh', 
  },
  [theme.breakpoints.up('md')]: {
    width: '45%',
    padding: theme.spacing(4),
  },
  position: 'relative',
}));

const SidePanelBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: 'url("/network-bg.svg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  opacity: 0.2,
}));

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& img': {
    marginRight: theme.spacing(1),
  },
  [theme.breakpoints.up('md')]: {
    marginBottom: theme.spacing(3),
  }
}));

const ContentPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5, 2),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3, 2.5),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
    width: '55%',
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(5),
  },
  overflow: 'auto',
}));

const Footer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
  padding: theme.spacing(0.5),
  textAlign: 'center',
  color: alpha(theme.palette.common.white, 0.7),
  fontSize: '0.75rem',
  backdropFilter: 'blur(4px)',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(1),
    fontSize: '0.8rem',
  }
}));

const AuthLayout = ({ children, title, subtitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: { xs: 0.5, sm: 1, md: 2 }
      }}
    >
      <AuthBackground>
        <AuthBackgroundPattern />
      </AuthBackground>
      
      <AuthCard elevation={4}>
        {/* Side panel with decorative elements */}
        <SidePanel>
          <SidePanelBackground />
          
          <Logo>
            <Box sx={{ position: 'relative', width: 36, height: 36, mr: 1.5 }}>
              <Image
                src="/logo.svg"
                alt="FWPM Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </Box>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
              }}
            >
              FWPM
            </Typography>
          </Logo>
          
          {!isMobile && (
            <Box 
              sx={{ 
                mt: { sm: 2, md: 3 }, 
                width: '100%', 
                maxWidth: '280px', 
                height: '140px', 
                position: 'relative',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              <Image
                src="/wireless-tower.svg"
                alt="Fixed Wireless Network"
                fill
                style={{ objectFit: "contain" }}
              />
            </Box>
          )}
        </SidePanel>
        
        {/* Content panel with form */}
        <ContentPanel>
          <Box sx={{ 
            maxWidth: '420px', 
            mx: 'auto', 
            width: '100%',
            py: { xs: 1, sm: 1.5 }
          }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                mb: { xs: 0.5, sm: 1 },
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
              }}
            >
              FWPM
            </Typography>
            
            {subtitle && (
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {subtitle}
              </Typography>
            )}
            
            {children}
          </Box>
        </ContentPanel>
      </AuthCard>
      
      <Footer>
        <Typography variant="caption">
          &copy; {new Date().getFullYear()} Fixed Wireless Performance Manager. All rights reserved.
        </Typography>
      </Footer>
    </Box>
  );
};

export default AuthLayout; 