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

export type ExpenseCategory = keyof typeof EXPENSE_CATEGORIES;
export type SubCategory<T extends ExpenseCategory> = typeof EXPENSE_CATEGORIES[T][number]; 