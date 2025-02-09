import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Container, Box, createTheme } from '@mui/material';
import SankeyDiagram from './components/SankeyDiagram/SankeyDiagram';
import BudgetManager from './components/BudgetManager/BudgetManager';
import { SankeyData } from './components/SankeyDiagram/SankeyDiagram';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

// Sample data for demonstration
const initialData: SankeyData = {
  nodes: [
    { name: 'Monthly Income', category: 'income', value: 5000 },
    { name: 'Rent', category: 'expense', value: 2000 },
    { name: 'Groceries', category: 'expense', value: 800 },
    { name: 'Utilities', category: 'expense', value: 400 },
    { name: 'Savings', category: 'savings', value: 1800 },
  ],
  links: [
    { source: 0, target: 1, value: 2000 }, // Income to Rent
    { source: 0, target: 2, value: 800 },  // Income to Groceries
    { source: 0, target: 3, value: 400 },  // Income to Utilities
    { source: 0, target: 4, value: 1800 }, // Income to Savings
  ],
};

function App() {
  const [monthlyIncome] = useState(5000);
  const [sankeyData, setSankeyData] = useState<SankeyData>(initialData);

  const handleBudgetUpdate = (categories: any[]) => {
    // Transform budget categories to Sankey data
    const nodes = [
      { name: 'Monthly Income', category: 'income', value: monthlyIncome },
      ...categories.map(cat => ({
        name: cat.name,
        category: cat.spent > 0 ? 'expense' as const : 'savings' as const,
        value: cat.allocated,
      })),
    ];

    const links = categories.map((cat, index) => ({
      source: 0,
      target: index + 1,
      value: cat.allocated,
    }));

    setSankeyData({ nodes, links });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Box sx={{ mb: 4, height: '400px' }}>
            <SankeyDiagram data={sankeyData} height={400} />
          </Box>
          <BudgetManager
            monthlyIncome={monthlyIncome}
            onUpdateBudget={handleBudgetUpdate}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 