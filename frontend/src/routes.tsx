import React from 'react';
import { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Budget from './pages/Budget';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ErrorPage from './components/ErrorPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout><Outlet /></MainLayout>,
    errorElement: (
      <ErrorPage
        title="Oops! Something went wrong"
        message="We're working on fixing this issue. Please try again later!"
      />
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'budget',
        element: <Budget />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <ErrorPage
        title="404 - Page Not Found"
        message="The page you're looking for doesn't exist or has been moved."
      />
    ),
  },
]; 