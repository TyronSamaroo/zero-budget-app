import React from 'react';
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { routes } from './routes';
import { theme } from './theme/theme';

const globalStyles = {
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  html: {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    height: '100%',
    width: '100%',
  },
  body: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.background.default,
  },
  '#root': {
    height: '100%',
    width: '100%',
  },
  'input[type=number]': {
    MozAppearance: 'textfield',
    '&::-webkit-outer-spin-button': {
      margin: 0,
      WebkitAppearance: 'none',
    },
    '&::-webkit-inner-spin-button': {
      margin: 0,
      WebkitAppearance: 'none',
    },
  },
  img: {
    display: 'block',
    maxWidth: '100%',
  },
};

const router = createBrowserRouter(routes);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        <RouterProvider router={router} />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App; 