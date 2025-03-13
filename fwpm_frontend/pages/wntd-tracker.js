import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import WNTDTracker from '../components/admin/WNTDTracker';
import { Box } from '@mui/material';

const WNTDTrackerPage = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Box sx={{ p: 3 }}>
          <WNTDTracker />
        </Box>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default WNTDTrackerPage; 