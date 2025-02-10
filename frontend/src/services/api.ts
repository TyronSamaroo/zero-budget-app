import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { format } from 'date-fns';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';
import type { ApiResponse, User, Transaction, Budget, Category } from '../types';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response: AxiosResponse = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response: AxiosResponse = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response: AxiosResponse = await api.get('/auth/me');
    return response.data;
  },
};

// Transactions API
export const transactionsApi = {
  getAll: async (): Promise<ApiResponse<Transaction[]>> => {
    const response: AxiosResponse = await api.get('/transactions');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Transaction>> => {
    const response: AxiosResponse = await api.get(`/transactions/${id}`);
    return response.data;
  },

  create: async (transaction: Partial<Transaction>): Promise<ApiResponse<Transaction>> => {
    const response: AxiosResponse = await api.post('/transactions', transaction);
    return response.data;
  },

  update: async (id: number, transaction: Partial<Transaction>): Promise<ApiResponse<Transaction>> => {
    const response: AxiosResponse = await api.put(`/transactions/${id}`, transaction);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response: AxiosResponse = await api.delete(`/transactions/${id}`);
    return response.data;
  },
};

// Budget API
export const budgetApi = {
  getAll: async (): Promise<ApiResponse<Budget[]>> => {
    const response: AxiosResponse = await api.get('/budgets');
    return response.data;
  },

  getByMonth: async (month: string): Promise<ApiResponse<Budget[]>> => {
    const response: AxiosResponse = await api.get(`/budgets/month/${month}`);
    return response.data;
  },

  create: async (budget: Partial<Budget>): Promise<ApiResponse<Budget>> => {
    const response: AxiosResponse = await api.post('/budgets', budget);
    return response.data;
  },

  update: async (id: number, budget: Partial<Budget>): Promise<ApiResponse<Budget>> => {
    const response: AxiosResponse = await api.put(`/budgets/${id}`, budget);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response: AxiosResponse = await api.delete(`/budgets/${id}`);
    return response.data;
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    const response: AxiosResponse = await api.get('/categories');
    return response.data;
  },

  create: async (category: Partial<Category>): Promise<ApiResponse<Category>> => {
    const response: AxiosResponse = await api.post('/categories', category);
    return response.data;
  },

  update: async (id: number, category: Partial<Category>): Promise<ApiResponse<Category>> => {
    const response: AxiosResponse = await api.put(`/categories/${id}`, category);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response: AxiosResponse = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export interface Transaction {
  id: number;
  categoryId: number;
  amount: number;
  date: string;
  description: string;
  type: 'income' | 'expense';
  payee: string;
  note?: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
}

export interface Budget {
  id: number;
  categoryId: number;
  amount: number;
  month: string;
  spent: number;
  remaining: number;
}

export const fetchTransactions = async (start: Date, end: Date) => {
  const response = await api.get<Transaction[]>('/api/transactions', {
    params: {
      start_date: format(start, 'yyyy-MM-dd'),
      end_date: format(end, 'yyyy-MM-dd'),
    },
  });
  return response.data;
};

export const fetchCategories = async () => {
  const response = await api.get<Category[]>('/api/categories');
  return response.data;
};

export const fetchBudgets = async (start: Date, end: Date) => {
  const response = await api.get<Budget[]>('/api/budgets', {
    params: {
      start_date: format(start, 'yyyy-MM-dd'),
      end_date: format(end, 'yyyy-MM-dd'),
    },
  });
  return response.data;
};

export const createTransaction = async (transaction: Omit<Transaction, 'id'>) => {
  const response = await api.post<Transaction>('/api/transactions', transaction);
  return response.data;
};

export const updateTransaction = async (id: number, transaction: Partial<Transaction>) => {
  const response = await api.put<Transaction>(`/api/transactions/${id}`, transaction);
  return response.data;
};

export const deleteTransaction = async (id: number) => {
  await api.delete(`/api/transactions/${id}`);
};

export const createCategory = async (category: Omit<Category, 'id'>) => {
  const response = await api.post<Category>('/api/categories', category);
  return response.data;
};

export const updateCategory = async (id: number, category: Partial<Category>) => {
  const response = await api.put<Category>(`/api/categories/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id: number) => {
  await api.delete(`/api/categories/${id}`);
};

export const createBudget = async (budget: Omit<Budget, 'id'>) => {
  const response = await api.post<Budget>('/api/budgets', budget);
  return response.data;
};

export const updateBudget = async (id: number, budget: Partial<Budget>) => {
  const response = await api.put<Budget>(`/api/budgets/${id}`, budget);
  return response.data;
};

export const deleteBudget = async (id: number) => {
  await api.delete(`/api/budgets/${id}`);
}; 