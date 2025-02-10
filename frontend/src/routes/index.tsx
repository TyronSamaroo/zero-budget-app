import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';

// Lazy load pages
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Budget = React.lazy(() => import('../pages/Budget'));
const Reports = React.lazy(() => import('../pages/Reports'));
const Settings = React.lazy(() => import('../pages/Settings'));
const ErrorPage = React.lazy(() => import('../components/ErrorPage'));

// Loading fallback
const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
    <CircularProgress />
  </Box>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout>
        <Suspense fallback={<LoadingFallback />}>
          <Dashboard />
        </Suspense>
      </MainLayout>} />
      
      <Route path="/budget" element={<MainLayout>
        <Suspense fallback={<LoadingFallback />}>
          <Budget />
        </Suspense>
      </MainLayout>} />
      
      <Route path="/reports" element={<MainLayout>
        <Suspense fallback={<LoadingFallback />}>
          <Reports />
        </Suspense>
      </MainLayout>} />
      
      <Route path="/settings" element={<MainLayout>
        <Suspense fallback={<LoadingFallback />}>
          <Settings />
        </Suspense>
      </MainLayout>} />
      
      <Route path="/404" element={<MainLayout>
        <Suspense fallback={<LoadingFallback />}>
          <ErrorPage 
            title="404 - Page Not Found"
            message="The page you're looking for doesn't exist."
          />
        </Suspense>
      </MainLayout>} />
      
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes; 