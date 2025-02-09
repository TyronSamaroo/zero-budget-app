import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import SankeyDiagram from '../components/SankeyDiagram/SankeyDiagram';
import { SankeyData } from '../components/SankeyDiagram/SankeyDiagram';

const sampleData: SankeyData = {
  nodes: [
    { name: 'Monthly Income', category: 'income', value: 5000 },
    { name: 'Rent', category: 'expense', value: 2000 },
    { name: 'Groceries', category: 'expense', value: 800 },
    { name: 'Utilities', category: 'expense', value: 400 },
    { name: 'Savings', category: 'savings', value: 1800 },
  ],
  links: [
    { source: 0, target: 1, value: 2000 },
    { source: 0, target: 2, value: 800 },
    { source: 0, target: 3, value: 400 },
    { source: 0, target: 4, value: 1800 },
  ],
};

const Reports = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Financial Reports
      </Typography>
      <Paper elevation={2}>
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Cash Flow Visualization
          </Typography>
          <Box height="500px">
            <SankeyDiagram data={sampleData} height={500} />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Reports; 