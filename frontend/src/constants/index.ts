// API Constants
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Route Constants
export const ROUTES = {
  DASHBOARD: '/',
  BUDGET: '/budget',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;

// Common expense categories
export const EXPENSE_CATEGORIES = {
  Housing: ['Rent', 'Mortgage', 'Utilities', 'Maintenance'],
  Transportation: ['Car Payment', 'Gas', 'Public Transit', 'Maintenance'],
  Food: ['Groceries', 'Dining Out', 'Takeout'],
  Entertainment: ['Movies', 'Games', 'Hobbies', 'Subscriptions'],
  Healthcare: ['Insurance', 'Medications', 'Doctor Visits'],
  Savings: ['Emergency Fund', 'Retirement', 'Investments'],
  Debt: ['Credit Cards', 'Student Loans', 'Personal Loans'],
  Shopping: ['Clothing', 'Electronics', 'Home Goods'],
} as const;

// Chart Colors
export const CHART_COLORS = {
  primary: '#4318FF',
  secondary: '#FF5630',
  success: '#38CB89',
  warning: '#FFAB00',
  error: '#FF5630',
  info: '#3699FF',
} as const;

// Date Formats
export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  api: 'yyyy-MM-dd',
  month: 'MMMM yyyy',
} as const;

// Validation Constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 200,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME_MODE: 'theme_mode',
} as const; 