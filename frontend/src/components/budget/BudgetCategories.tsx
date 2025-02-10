import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  LinearProgress,
} from '@mui/material';
import { BudgetCategory } from '../../pages/Budget';

interface BudgetCategoriesProps {
  categories: BudgetCategory[];
  budgets: Record<string, number>;
  onUpdateBudget: (category: string, amount: number) => void;
}

const BudgetCategories: React.FC<BudgetCategoriesProps> = ({
  categories,
  budgets,
  onUpdateBudget,
}) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Budget Categories
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Budgeted</TableCell>
              <TableCell align="right">Spent</TableCell>
              <TableCell align="right">Remaining</TableCell>
              <TableCell align="right">Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => {
              const budgeted = budgets[category.name] || category.budgeted;
              const spent = category.spent || 0;
              const remaining = budgeted - spent;
              const progress = budgeted > 0 ? (spent / budgeted) * 100 : 0;

              return (
                <TableRow key={category.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {category.emoji} {category.name}
                    </Box>
                  </TableCell>
                  <TableCell>{category.type}</TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      size="small"
                      value={budgeted}
                      onChange={(e) => onUpdateBudget(category.name, Number(e.target.value))}
                      sx={{ width: 100 }}
                      inputProps={{
                        min: 0,
                        step: 10,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">${spent.toLocaleString()}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: remaining < 0 ? 'error.main' : 'success.main',
                      fontWeight: 'bold',
                    }}
                  >
                    ${remaining.toLocaleString()}
                  </TableCell>
                  <TableCell align="right" sx={{ width: '20%' }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(progress, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: progress > 100 ? 'error.main' : 'primary.main',
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BudgetCategories; 