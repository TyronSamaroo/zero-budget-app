// User Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

// Transaction Types
export interface Transaction {
  id: number;
  userId: number;
  categoryId: number;
  amount: number;
  date: string;
  description: string;
  type: 'income' | 'expense';
  payee: string;
  note?: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  userId: number;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

// Budget Types
export interface Budget {
  id: number;
  userId: number;
  categoryId: number;
  amount: number;
  month: string;
  spent: number;
  remaining: number;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Component Props Types
export interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface LoadingProps extends BaseProps {
  isLoading: boolean;
}

// Theme Types
export type ThemeMode = 'light' | 'dark';

// Chart Data Types
export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'date';
  required?: boolean;
  options?: { label: string; value: string | number }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
} 