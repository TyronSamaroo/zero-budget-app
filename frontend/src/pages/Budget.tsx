import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import BudgetManager from '../components/BudgetManager/BudgetManager';

const Budget = () => {
  const monthlyIncome = 5000; // This would come from user settings/state management in a real app

  const handleBudgetUpdate = (categories: any[]) => {
    // This would update the global state/backend in a real app
    console.log('Budget categories updated:', categories);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Zero-Based Budget
      </Typography>
      <Paper elevation={2}>
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Give Every Dollar a Job
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Assign your income to specific categories until you reach zero. This helps ensure every dollar has a purpose.
          </Typography>
          <BudgetManager
            monthlyIncome={monthlyIncome}
            onUpdateBudget={handleBudgetUpdate}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default Budget; 