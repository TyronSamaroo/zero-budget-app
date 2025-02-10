import React from 'react';
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App; 