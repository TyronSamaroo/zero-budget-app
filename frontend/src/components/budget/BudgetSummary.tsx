import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  LinearProgress,
} from '@mui/material';
import { Transaction } from '../../types/Transaction';

interface BudgetSummaryProps {
  monthlyIncome: number;
  transactions: Transaction[];
  budgets: Record<string, number>;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  monthlyIncome,
  transactions,
  budgets,
}) => {
  // Calculate total budgeted and spent amounts
  const totalBudgeted = Object.values(budgets).reduce((sum, amount) => sum + amount, 0);
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const remaining = monthlyIncome - totalSpent;
  const progress = monthlyIncome > 0 ? (totalSpent / monthlyIncome) * 100 : 0;

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" color="text.secondary">
            Monthly Income
          </Typography>
          <Typography variant="h4" sx={{ mt: 1 }}>
            ${monthlyIncome.toLocaleString()}
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" color="text.secondary">
            Total Spent
          </Typography>
          <Typography variant="h4" sx={{ mt: 1 }}>
            ${totalSpent.toLocaleString()}
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" color="text.secondary">
            Remaining
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ mt: 1, color: remaining < 0 ? 'error.main' : 'success.main' }}
          >
            ${remaining.toLocaleString()}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Budget Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {progress.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: progress > 100 ? 'error.main' : 'primary.main',
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BudgetSummary; 