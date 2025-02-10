import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { format, parse } from 'date-fns';
import useBudgetStore, { BudgetCategory } from '../store/budgetStore';
import BudgetCategories from '../components/budget/BudgetCategories';
import BudgetSummary from '../components/budget/BudgetSummary';

const Budget = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    budgetData,
    settings,
    selectedMonth,
    updateMonthlyIncome,
    updateBudget,
  } = useBudgetStore();

  useEffect(() => {
    const initializeBudget = async () => {
      try {
        setIsLoading(true);
        // Initialize with default monthly income if not set
        if (!settings.monthlyIncome) {
          updateMonthlyIncome(5000);
        }
        // Initialize empty budget data if not exists
        if (!budgetData[selectedMonth]) {
          updateBudget(selectedMonth, []);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize budget');
        console.error('Budget initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeBudget();
  }, [updateMonthlyIncome, updateBudget, selectedMonth, settings.monthlyIncome, budgetData]);

  const handleUpdateCategory = (updatedCategory: BudgetCategory) => {
    const currentCategories = budgetData[selectedMonth]?.categories || [];
    const updatedCategories = currentCategories.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    );
    updateBudget(selectedMonth, updatedCategories);
  };

  const handleAddCategory = (newCategory: BudgetCategory) => {
    const currentCategories = budgetData[selectedMonth]?.categories || [];
    const updatedCategories = [...currentCategories, newCategory];
    updateBudget(selectedMonth, updatedCategories);
  };

  const handleUpdateBudget = (category: string, amount: number) => {
    const currentCategories = budgetData[selectedMonth]?.categories || [];
    const updatedCategories = currentCategories.map(cat => 
      cat.name === category ? { ...cat, budgeted: amount } : cat
    );
    updateBudget(selectedMonth, updatedCategories);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const currentCategories = budgetData[selectedMonth]?.categories || [];
  const budgets = currentCategories.reduce((acc, cat) => {
    acc[cat.name] = cat.budgeted;
    return acc;
  }, {} as Record<string, number>);

  const displayDate = parse(selectedMonth, 'yyyy-MM', new Date());

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Budget Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {format(displayDate, 'MMMM yyyy')}
            </Typography>
          </Box>
        </Box>
        
        <Paper sx={{ mb: 3 }}>
          <BudgetSummary 
            monthlyIncome={settings.monthlyIncome}
            transactions={[]}
            budgets={budgets}
          />
        </Paper>
        
        <Paper>
          <BudgetCategories
            categories={currentCategories}
            budgets={budgets}
            onUpdateBudget={handleUpdateBudget}
            onUpdateCategory={handleUpdateCategory}
            onAddCategory={handleAddCategory}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default Budget; 