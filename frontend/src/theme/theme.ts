import { createTheme, alpha } from '@mui/material/styles';

// Custom gradient backgrounds
const gradients = {
  primary: 'linear-gradient(135deg, #4318FF 0%, #9151FF 100%)',
  secondary: 'linear-gradient(135deg, #38B6FF 0%, #3366FF 100%)',
  success: 'linear-gradient(135deg, #38CB89 0%, #2ECC71 100%)',
  error: 'linear-gradient(135deg, #FF5630 0%, #FF2D55 100%)',
  dark: 'linear-gradient(135deg, #1A1B1F 0%, #2D2E32 100%)',
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4318FF',
      light: '#9151FF',
      dark: '#2B0FCC',
    },
    secondary: {
      main: '#38B6FF',
      light: '#5CC2FF',
      dark: '#2B8FCC',
    },
    error: {
      main: '#FF5630',
      light: '#FF8F73',
      dark: '#DE350B',
    },
    warning: {
      main: '#FFAB00',
      light: '#FFD666',
      dark: '#B77800',
    },
    info: {
      main: '#38B6FF',
      light: '#69C0FF',
      dark: '#096DD9',
    },
    success: {
      main: '#38CB89',
      light: '#79F2C0',
      dark: '#2ECC71',
    },
    grey: {
      50: '#F8FAFC',
      100: '#EEF2F6',
      200: '#E3E8EF',
      300: '#CDD5DF',
      400: '#9AA4B2',
      500: '#697586',
      600: '#4B5565',
      700: '#364152',
      800: '#202939',
      900: '#121926',
    },
    background: {
      default: '#0B0F19',
      paper: '#121926',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#9AA4B2',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          padding: '10px 20px',
          fontWeight: 600,
        },
        contained: {
          backgroundImage: gradients.primary,
          boxShadow: '0 4px 14px 0 rgba(67, 24, 255, 0.4)',
          '&:hover': {
            backgroundImage: gradients.primary,
            boxShadow: '0 6px 20px 0 rgba(67, 24, 255, 0.6)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#121926', 0.8),
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#121926',
          border: 'none',
          backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        bar: {
          borderRadius: 10,
        },
      },
    },
  },
});

export { gradients }; 