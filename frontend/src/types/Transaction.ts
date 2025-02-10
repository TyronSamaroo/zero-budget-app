export interface Transaction {
  id: string;
  amount: number;
  category: string;
  subcategory: string;
  date: string;
  type: 'income' | 'expense';
  description?: string;
}

export interface BudgetData {
  transactions: Transaction[];
  monthlyIncome: Record<string, number>; // Key is YYYY-MM format
  budgets: Record<string, number>; // Category to budget amount mapping
}

export interface TimeRange {
  start: Date;
  end: Date;
} 