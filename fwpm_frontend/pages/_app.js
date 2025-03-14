import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Roboto } from 'next/font/google';
import { AuthProvider } from '../contexts/AuthContext';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '../styles/globals.css';
import '../styles/animations.css';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';

// Configure the default font
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

// Only import progress bar if we're on the client-side
if (typeof window !== 'undefined') {
  const NProgress = require('nprogress');
  require('nprogress/nprogress.css');
  
  // Customize NProgress
  NProgress.configure({ 
    showSpinner: false,
    easing: 'ease',
    speed: 500,
    minimum: 0.1,
    trickleSpeed: 200
  });
  
  const Router = require('next/router').default;
  Router.events.on('routeChangeStart', () => NProgress.start());
  Router.events.on('routeChangeComplete', () => NProgress.done());
  Router.events.on('routeChangeError', () => NProgress.done());
}

// Create light theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // Modern blue
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c3aed', // Purple
      light: '#a78bfa',
      dark: '#5b21b6',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

// Create dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa', // Lighter blue for dark mode
      light: '#93c5fd',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#a78bfa', // Lighter purple for dark mode
      light: '#c4b5fd',
      dark: '#7c3aed',
      contrastText: '#ffffff',
    },
    background: {
      default: '#111827',
      paper: '#1f2937',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -8,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

function MyApp({ Component, pageProps }) {
  // Determine if this is a page that should have the layout
  const getLayout = Component.getLayout || ((page) => page);
  
  // State to track client-side rendering
  const [mounted, setMounted] = useState(false);
  const [activeTheme, setActiveTheme] = useState(lightTheme);
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
    
    // Initialize theme from localStorage on client side
    if (typeof window !== 'undefined') {
      // Check if there's a theme preference in localStorage
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Use saved theme or fall back to system preference
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      
      // Apply the theme
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(initialTheme);
      
      // Set active MUI theme
      setActiveTheme(initialTheme === 'dark' ? darkTheme : lightTheme);
      
      // Set up theme change observer
      const observer = new MutationObserver(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setActiveTheme(isDark ? darkTheme : lightTheme);
      });
      
      observer.observe(document.documentElement, { 
        attributes: true, 
        attributeFilter: ['class'] 
      });
      
      return () => observer.disconnect();
    }
  }, []);
  
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>FWPM</title>
      </Head>
      <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily};
        }
      `}</style>
      <AuthProvider>
        <MUIThemeProvider theme={activeTheme}>
          <CssBaseline />
          {mounted ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={router.route}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                style={{ width: '100%' }}
              >
                {getLayout(<Component {...pageProps} />)}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div style={{ visibility: 'hidden' }}>
              {getLayout(<Component {...pageProps} />)}
            </div>
          )}
        </MUIThemeProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp; 