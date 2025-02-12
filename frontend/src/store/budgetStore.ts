import { create } from 'zustand';
import axios, { AxiosError } from 'axios';

export interface Settings {
  monthlyIncome: number;
  currency: string;
  theme: 'light' | 'dark';
}

interface CategoryBudget {
  id: number;
  name: string;
  budgeted: number;
  spent: number;
  remaining: number;
  progress: number;
  isFixed: boolean;
  isFlexible: boolean;
  minAmount?: number;
  maxAmount?: number;
}

interface CategoryResponse {
  id: number;
  name: string;
  amount: number;
  spent: number;
  remaining: number;
  isFixed: boolean;
  isFlexible: boolean;
  minAmount: number;
  maxAmount: number;
  progress: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface BudgetSummary {
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
  fixedExpenses: number;
  flexibleExpenses: number;
}

interface BudgetStore {
  settings: Settings;
  budgetSummary: BudgetSummary;
  categories: CategoryBudget[];
  monthlyTrend: Array<{ month: string; amount: number }>;
  isLoading: boolean;
  error: string | null;
  updateSettings: (settings: Partial<Settings>) => void;
  fetchBudgetSummary: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  createBudget: (budget: Partial<CategoryBudget>) => Promise<void>;
  updateBudgetCategory: (id: number, budget: Partial<CategoryBudget>) => Promise<void>;
  deleteBudget: (id: number) => Promise<void>;
  resetStore: () => void;
}

const initialBudgetSummary: BudgetSummary = {
  totalBudgeted: 0,
  totalSpent: 0,
  totalRemaining: 0,
  fixedExpenses: 0,
  flexibleExpenses: 0,
};

const getInitialState = () => ({
  settings: {
    monthlyIncome: 0,
    currency: 'USD',
    theme: 'light' as const,
  },
  budgetSummary: initialBudgetSummary,
  categories: [],
  monthlyTrend: [],
  isLoading: false,
  error: null,
});

export const useBudgetStore = create<BudgetStore>()((set, get) => ({
  ...getInitialState(),
  resetStore: () => {
    set(getInitialState());
  },
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },
  fetchBudgetSummary: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get<BudgetSummary>('/api/budgets/summary');
      set({ budgetSummary: response.data });
    } catch (error) {
      console.error('Failed to fetch budget summary:', error);
      set({ error: 'Failed to fetch budget summary', budgetSummary: initialBudgetSummary });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log('Fetching categories');
      
      const response = await axios.get<CategoryBudget[]>('/api/budgets/categories');
      console.log('Categories fetched:', response.data);
      
      set({ categories: Array.isArray(response.data) ? response.data : [] });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      set({ 
        categories: [],
        error: error instanceof Error ? error.message : 'Failed to fetch categories'
      });
    } finally {
      set({ isLoading: false });
    }
  },
  createBudget: async (budget: Partial<CategoryBudget>) => {
    try {
      set({ isLoading: true, error: null });
      
      // First create the category
      if (!budget.name) {
        throw new Error('Category name is required');
      }

      // Create category first
      const categoryData = {
        name: budget.name,
        amount: Number(budget.budgeted || 0),
        isFixed: budget.isFixed || false,
        isFlexible: budget.isFlexible || false,
        minAmount: budget.minAmount || 0,
        maxAmount: budget.maxAmount || 0
      };

      console.log('Creating category with data:', categoryData);
      let categoryResponse;
      try {
        categoryResponse = await axios.post<CategoryResponse>('/api/categories', categoryData);
        console.log('Category creation response:', categoryResponse.data);
      } catch (error) {
        console.error('Category creation failed:', error);
        if (error instanceof AxiosError) {
          console.error('Category creation error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers
          });
        }
        throw error;
      }

      // Then create the budget using the new category ID
      const budgetData = {
        categoryId: categoryResponse.data.id,  // Use the ID from the created category
        amount: Number(budget.budgeted || 0),  // Use amount instead of budgeted
        isFixed: budget.isFixed || false,
        isFlexible: budget.isFlexible || false,
        minAmount: budget.minAmount || 0,
        maxAmount: budget.maxAmount || 0
      };

      console.log('Creating budget with data:', budgetData);
      let budgetResponse;
      try {
        budgetResponse = await axios.post('/api/budgets', budgetData);
        console.log('Budget creation response:', budgetResponse.data);
      } catch (error) {
        console.error('Budget creation failed:', error);
        if (error instanceof AxiosError) {
          console.error('Budget creation error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers
          });
        }
        throw error;
      }

      // Refresh data from server
      await Promise.all([
        get().fetchBudgetSummary(),
        get().fetchCategories()
      ]);
    } catch (error) {
      console.error('Failed to create budget:', error);
      if (error instanceof AxiosError) {
        console.error('Full error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          config: error.config
        });
      }
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create budget';
      set({ 
        error: errorMessage,
        categories: [],
        budgetSummary: initialBudgetSummary
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  updateBudgetCategory: async (id: number, budget: Partial<CategoryBudget>) => {
    try {
      set({ isLoading: true, error: null });

      // Ensure we have required fields
      if (!budget.budgeted || isNaN(Number(budget.budgeted))) {
        throw new Error('Budget amount is required and must be a number');
      }

      // Only include required fields by default
      const budgetData: any = {
        categoryId: id,  // Required
        amount: Number(budget.budgeted),  // Required
      };

      // Only add optional fields if they are explicitly set
      if (budget.isFixed !== undefined) {
        budgetData.isFixed = budget.isFixed;
      }
      if (budget.isFlexible !== undefined) {
        budgetData.isFlexible = budget.isFlexible;
      }
      if (budget.minAmount !== undefined) {
        budgetData.minAmount = Number(budget.minAmount);
      }
      if (budget.maxAmount !== undefined) {
        budgetData.maxAmount = Number(budget.maxAmount);
      }

      console.log('Updating budget with data:', budgetData);
      const response = await axios.put(`/api/budgets/${id}`, budgetData);
      console.log('Budget update response:', response.data);

      // Refresh data from server
      await Promise.all([
        get().fetchBudgetSummary(),
        get().fetchCategories()
      ]);
    } catch (error) {
      console.error('Failed to update budget:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update budget';
      set({ 
        error: errorMessage,
        categories: [],
        budgetSummary: initialBudgetSummary
      });
    } finally {
      set({ isLoading: false });
    }
  },
  deleteBudget: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await axios.delete(`/api/budgets/${id}`);
      await get().fetchBudgetSummary();
      await get().fetchCategories();
    } catch (error) {
      set({ error: 'Failed to delete budget' });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useBudgetStore; 