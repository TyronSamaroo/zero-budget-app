import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Budget from './pages/Budget';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ErrorPage from './components/ErrorPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />
      <Route
        path="/budget"
        element={
          <MainLayout>
            <Budget />
          </MainLayout>
        }
      />
      <Route
        path="/reports"
        element={
          <MainLayout>
            <Reports />
          </MainLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <MainLayout>
            <Settings />
          </MainLayout>
        }
      />
      <Route
        path="/error"
        element={
          <ErrorPage
            title="Oops! Something went wrong"
            message="We're working on fixing this issue. Please try again later!"
          />
        }
      />
      <Route
        path="*"
        element={
          <ErrorPage
            title="404 - Page Not Found"
            message="The page you're looking for doesn't exist or has been moved."
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes; 