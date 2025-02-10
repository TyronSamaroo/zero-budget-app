import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { eachMonthOfInterval, subMonths, addMonths, format, parseISO } from 'date-fns';

export type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'ytd';

export interface Settings {
  monthlyIncome: number;
  currency: string;
  theme: 'light' | 'dark';
}

export interface BudgetCategory {
  id: string;
  name: string;
  type: 'Fixed' | 'Flexible' | 'Non-Monthly';
  budgeted: number;
  spent: number;
  rollover: boolean;
  emoji?: string;
  color: string;
}

export interface BudgetData {
  categories: BudgetCategory[];
}

interface BudgetStore {
  budgetData: Record<string, BudgetData>;
  settings: Settings;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  updateMonthlyIncome: (income: number) => void;
  updateBudget: (monthKey: string, categories: BudgetCategory[]) => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

const getDefaultBudgetData = (): BudgetData => ({
  categories: [],
});

const getInitialState = () => {
  const initialMonth = format(new Date(), 'yyyy-MM');
  
  return {
    budgetData: { [initialMonth]: getDefaultBudgetData() },
    settings: {
      monthlyIncome: 0,
      currency: 'USD',
      theme: 'light' as const,
    },
    selectedMonth: initialMonth,
  };
};

const useBudgetStore = create<BudgetStore>()(
  persist(
    (set) => ({
      ...getInitialState(),
      setSelectedMonth: (month) => set({ selectedMonth: month }),
      updateMonthlyIncome: (income) => {
        set((state) => ({
          settings: { ...state.settings, monthlyIncome: income },
        }));
      },
      updateBudget: (monthKey, categories) => {
        set((state) => ({
          budgetData: {
            ...state.budgetData,
            [monthKey]: {
              categories,
            },
          },
        }));
      },
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
    }),
    {
      name: 'budget-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useBudgetStore; 