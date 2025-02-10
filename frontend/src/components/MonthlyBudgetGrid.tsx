import React, { useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  LinearProgress,
  Grid,
  Tooltip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { EXPENSE_CATEGORIES } from '../constants/categories';
import useBudgetStore from '../store/budgetStore';

interface MonthlyBudgetGridProps {
  onMonthClick: (date: Date) => void;
}

const MonthlyBudgetGrid: React.FC<MonthlyBudgetGridProps> = ({ onMonthClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const {
    visibleMonths,
    updateVisibleMonths,
    getBudgetForMonth,
    getTransactionsForPeriod,
    getIncomeForPeriod,
    updateMonthlyIncome,
    updateMonthlyBudget,
  } = useBudgetStore();

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const calculateProgress = (spent: number, budget: number) => {
    if (budget === 0) return 0;
    return Math.min((spent / budget) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'error';
    if (progress >= 80) return 'warning';
    return 'primary';
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', mt: 2 }}>
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
        }}
      >
        <IconButton onClick={() => handleScroll('left')}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1,
        }}
      >
        <IconButton onClick={() => handleScroll('right')}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
      <Box
        ref={scrollContainerRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 1,
          px: 6,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',
        }}
      >
        {visibleMonths.map((month) => {
          const monthlyBudget = getBudgetForMonth(month);
          const transactions = getTransactionsForPeriod(month, 'month');
          const income = getIncomeForPeriod(month, 'month');

          const spentByCategory = transactions.reduce((acc, transaction) => {
            if (transaction.type === 'expense') {
              acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
            }
            return acc;
          }, {} as Record<string, number>);

          return (
            <Paper
              key={month.toISOString()}
              sx={{
                minWidth: 250,
                maxWidth: 250,
                p: 1.5,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
              onClick={() => onMonthClick(month)}
            >
              <Typography variant="h6" gutterBottom>
                {format(month, 'MMM yyyy')}
              </Typography>
              
              {/* Editable Income */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  size="small"
                  label="Income"
                  type="number"
                  value={income}
                  onChange={(e) => updateMonthlyIncome(Number(e.target.value), month)}
                  onClick={(e) => e.stopPropagation()}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  fullWidth
                  sx={{ mb: 1 }}
                />
              </Box>

              {Object.keys(EXPENSE_CATEGORIES).map((category) => {
                const budget = monthlyBudget[category] || 0;
                const spent = spentByCategory[category] || 0;
                const progress = calculateProgress(spent, budget);

                return (
                  <Box key={category} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" noWrap sx={{ maxWidth: '100px' }}>
                        {category}
                      </Typography>
                      <TextField
                        size="small"
                        type="number"
                        value={budget}
                        onChange={(e) => updateMonthlyBudget(category, Number(e.target.value), month)}
                        onClick={(e) => e.stopPropagation()}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ width: '120px' }}
                      />
                    </Box>
                    <Tooltip
                      title={`Spent: $${spent.toLocaleString()} (${progress.toFixed(1)}%)`}
                      placement="top"
                    >
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        color={getProgressColor(progress)}
                        sx={{ height: 4, borderRadius: 1 }}
                      />
                    </Tooltip>
                  </Box>
                );
              })}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default MonthlyBudgetGrid; 