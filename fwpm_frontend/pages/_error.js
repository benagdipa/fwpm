import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

function Error({ statusCode, message }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 2,
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          maxWidth: 600, 
          width: '100%',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {statusCode 
            ? `Error ${statusCode} occurred` 
            : 'An error occurred on client'
          }
        </Typography>
        
        {message && (
          <Typography variant="body1" color="text.secondary" paragraph>
            {message}
          </Typography>
        )}
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Please check the console for more information.
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => window.location.href = '/'}
          >
            Go to Home Page
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const message = err ? err.message : '';
  console.error('Error details:', { statusCode, message, err });
  return { statusCode, message };
};

export default Error; 