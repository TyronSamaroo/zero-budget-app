import axios from 'axios';
import { format } from 'date-fns';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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