import { EXPENSE_CATEGORIES } from '../constants/categories';

const topSpendingCategories = Object.keys(EXPENSE_CATEGORIES).map(category => ({
  category,
  amount: Math.random() * 1000, // This would be replaced with actual data
  percentage: Math.random() * 100 // This would be replaced with actual data
})).sort((a, b) => b.amount - a.amount).slice(0, 5); 