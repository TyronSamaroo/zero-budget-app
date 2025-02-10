import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  subMonths,
  addMonths,
  format,
} from 'date-fns';
import { Transaction, BudgetData, TimeRange } from '../types/Transaction';

interface Settings {
  notifications: boolean;
  darkMode: boolean;
  currency: string;
  backupEmail?: string;
}

interface BudgetStore {
  budgetData: Record<string, BudgetData>;
  selectedDate: Date;
  timeRange: 'week' | 'month' | 'quarter' | 'year';
  visibleMonths: Date[];
  settings: Settings;
  setSelectedDate: (date: Date) => void;
  setTimeRange: (range: 'week' | 'month' | 'quarter' | 'year') => void;
  addTransaction: (transaction: Transaction) => void;
  updateMonthlyIncome: (amount: number, date: Date) => void;
  updateMonthlyBudget: (category: string, amount: number, date: Date) => void;
  getTransactionsForPeriod: (date?: Date, range?: 'week' | 'month' | 'quarter' | 'year') => Transaction[];
  getIncomeForPeriod: (date?: Date, range?: 'week' | 'month' | 'quarter' | 'year') => number;
  getBudgetForMonth: (date: Date) => Record<string, number>;
  getDateRange: () => TimeRange;
  updateVisibleMonths: (startDate: Date, count: number) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  exportData: () => string;
  importData: (data: string) => void;
}

const getDateKey = (date: Date | string | null) => {
  try {
    const validDate = date instanceof Date ? date : new Date(date || new Date());
    if (isNaN(validDate.getTime())) {
      return format(new Date(), 'yyyy-MM');
    }
    return format(validDate, 'yyyy-MM');
  } catch (error) {
    console.error('Error formatting date:', error);
    return format(new Date(), 'yyyy-MM');
  }
};

const getDefaultBudgetData = (): BudgetData => ({
  transactions: [],
  monthlyIncome: {},
  budgets: {},
});

const getInitialState = () => {
  const initialDate = new Date();
  const initialDateKey = getDateKey(initialDate);
  return {
    budgetData: { [initialDateKey]: getDefaultBudgetData() },
    selectedDate: initialDate,
    timeRange: 'month' as const,
    visibleMonths: eachMonthOfInterval({
      start: subMonths(initialDate, 6),
      end: addMonths(initialDate, 6),
    }),
    settings: {
      notifications: true,
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      currency: 'USD',
    },
  };
};

const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      ...getInitialState(),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setTimeRange: (range) => set({ timeRange: range }),
      updateVisibleMonths: (startDate, count) => {
        const months = eachMonthOfInterval({
          start: subMonths(startDate, Math.floor(count / 2)),
          end: addMonths(startDate, Math.floor(count / 2)),
        });
        set({ visibleMonths: months });
      },
      getDateRange: () => {
        const { selectedDate, timeRange } = get();
        const date = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
        
        if (isNaN(date.getTime())) {
          const now = new Date();
          return {
            start: startOfMonth(now),
            end: endOfMonth(now)
          };
        }
        
        switch (timeRange) {
          case 'week':
            return {
              start: startOfWeek(date),
              end: endOfWeek(date),
            };
          case 'month':
            return {
              start: startOfMonth(date),
              end: endOfMonth(date),
            };
          case 'quarter':
            return {
              start: startOfQuarter(date),
              end: endOfQuarter(date),
            };
          case 'year':
            return {
              start: startOfYear(date),
              end: endOfYear(date),
            };
          default:
            return {
              start: startOfMonth(date),
              end: endOfMonth(date),
            };
        }
      },
      addTransaction: (transaction) => {
        const dateKey = getDateKey(new Date(transaction.date));
        set((state) => ({
          budgetData: {
            ...state.budgetData,
            [dateKey]: {
              ...state.budgetData[dateKey] || getDefaultBudgetData(),
              transactions: [...(state.budgetData[dateKey]?.transactions || []), transaction],
            },
          },
        }));
      },
      updateMonthlyIncome: (amount, date) => {
        try {
          const validDate = date instanceof Date ? date : new Date();
          if (isNaN(validDate.getTime())) {
            throw new Error('Invalid date');
          }
          const dateKey = getDateKey(validDate);
          set((state) => ({
            budgetData: {
              ...state.budgetData,
              [dateKey]: {
                ...state.budgetData[dateKey] || getDefaultBudgetData(),
                monthlyIncome: {
                  ...state.budgetData[dateKey]?.monthlyIncome,
                  [dateKey]: amount,
                },
              },
            },
          }));
        } catch (error) {
          console.error('Error updating monthly income:', error);
          // Use current date as fallback
          const currentDateKey = getDateKey(new Date());
          set((state) => ({
            budgetData: {
              ...state.budgetData,
              [currentDateKey]: {
                ...state.budgetData[currentDateKey] || getDefaultBudgetData(),
                monthlyIncome: {
                  ...state.budgetData[currentDateKey]?.monthlyIncome,
                  [currentDateKey]: amount,
                },
              },
            },
          }));
        }
      },
      updateMonthlyBudget: (category, amount, date) => {
        try {
          const validDate = date instanceof Date ? date : new Date();
          if (isNaN(validDate.getTime())) {
            throw new Error('Invalid date');
          }
          const dateKey = getDateKey(validDate);
          set((state) => ({
            budgetData: {
              ...state.budgetData,
              [dateKey]: {
                ...state.budgetData[dateKey] || getDefaultBudgetData(),
                budgets: {
                  ...state.budgetData[dateKey]?.budgets,
                  [category]: amount,
                },
              },
            },
          }));
        } catch (error) {
          console.error('Error updating monthly budget:', error);
          // Use current date as fallback
          const currentDateKey = getDateKey(new Date());
          set((state) => ({
            budgetData: {
              ...state.budgetData,
              [currentDateKey]: {
                ...state.budgetData[currentDateKey] || getDefaultBudgetData(),
                budgets: {
                  ...state.budgetData[currentDateKey]?.budgets,
                  [category]: amount,
                },
              },
            },
          }));
        }
      },
      getBudgetForMonth: (date) => {
        const dateKey = getDateKey(date);
        return get().budgetData[dateKey]?.budgets || {};
      },
      getTransactionsForPeriod: (date, range) => {
        const { selectedDate: defaultDate, timeRange: defaultRange, budgetData } = get();
        const effectiveDate = date instanceof Date ? date : defaultDate instanceof Date ? defaultDate : new Date();
        const effectiveRange = range || defaultRange;
        
        try {
          const { start, end } = get().getDateRange();
          if (!start || !end) return [];
          
          return Object.values(budgetData)
            .flatMap(data => data.transactions)
            .filter(transaction => {
              const transactionDate = new Date(transaction.date);
              return !isNaN(transactionDate.getTime()) && 
                     transactionDate >= start && 
                     transactionDate <= end;
            });
        } catch (error) {
          console.error('Error getting transactions:', error);
          return [];
        }
      },
      getIncomeForPeriod: (date, range) => {
        const { selectedDate: defaultDate, timeRange: defaultRange, budgetData } = get();
        const effectiveDate = date instanceof Date ? date : defaultDate instanceof Date ? defaultDate : new Date();
        
        try {
          const { start, end } = get().getDateRange();
          if (!start || !end) return 0;
          
          const months = eachMonthOfInterval({ start, end });
          return months.reduce((total, month) => {
            const key = getDateKey(month);
            const monthlyIncome = budgetData[key]?.monthlyIncome || {};
            const monthTotal = Object.values(monthlyIncome)
              .reduce((sum, income) => sum + (typeof income === 'number' ? income : 0), 0);
            return total + monthTotal;
          }, 0);
        } catch (error) {
          console.error('Error calculating income:', error);
          return 0;
        }
      },
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        }));
      },
      exportData: () => {
        const state = get();
        const exportData = {
          budgetData: state.budgetData,
          settings: state.settings,
        };
        return JSON.stringify(exportData, null, 2);
      },
      importData: (data) => {
        try {
          const parsedData = JSON.parse(data);
          if (!parsedData.budgetData || typeof parsedData.budgetData !== 'object') {
            throw new Error('Invalid data format');
          }

          set((state) => ({
            ...state,
            budgetData: parsedData.budgetData,
            settings: {
              ...state.settings,
              ...(parsedData.settings || {}),
            },
          }));
        } catch (error) {
          console.error('Error importing data:', error);
          throw new Error('Failed to import data');
        }
      },
    }),
    {
      name: 'budget-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        budgetData: state.budgetData,
        selectedDate: state.selectedDate instanceof Date ? state.selectedDate.toISOString() : new Date().toISOString(),
        timeRange: state.timeRange,
        visibleMonths: state.visibleMonths.map(date => date.toISOString()),
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
            // Convert ISO strings back to Date objects
            state.selectedDate = new Date(state.selectedDate);
            
            // Handle visibleMonths as unknown type first
            const storedMonths = state.visibleMonths as unknown;
            state.visibleMonths = Array.isArray(storedMonths) 
              ? (storedMonths as string[]).map(dateStr => new Date(dateStr))
              : [];
            
            // Validate and fix any invalid dates
            if (isNaN(state.selectedDate.getTime())) {
              state.selectedDate = new Date();
            }
            
            state.visibleMonths = state.visibleMonths.filter(date => !isNaN(date.getTime()));
            if (state.visibleMonths.length === 0) {
              const now = new Date();
              state.visibleMonths = eachMonthOfInterval({
                start: subMonths(now, 6),
                end: addMonths(now, 6)
              });
            }

            // Ensure settings has all required fields with stored values taking precedence
            state.settings = {
              ...getInitialState().settings,
              ...(state.settings || {}),
            };
          } catch (error) {
            console.error('Error rehydrating state:', error);
            const now = new Date();
            state.selectedDate = now;
            state.visibleMonths = eachMonthOfInterval({
              start: subMonths(now, 6),
              end: addMonths(now, 6)
            });
            state.settings = getInitialState().settings;
          }
        }
      }
    }
  )
);

export default useBudgetStore; 