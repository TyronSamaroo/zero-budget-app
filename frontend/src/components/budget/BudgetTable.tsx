import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useBudgetStore } from '../../store/budgetStore';

interface BudgetTableProps {
  onEdit: (id: number) => void;
}

const BudgetTable: React.FC<BudgetTableProps> = ({ onEdit }) => {
  const { categories = [], deleteBudget } = useBudgetStore();

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      await deleteBudget(id);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!Array.isArray(categories)) {
    console.error('Categories is not an array:', categories);
    return null;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell align="right">Budgeted</TableCell>
            <TableCell align="right">Spent</TableCell>
            <TableCell align="right">Remaining</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="body1" color="textSecondary">
                  No budget categories found. Add a category to get started.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell align="right">{formatCurrency(category.budgeted)}</TableCell>
                <TableCell align="right">{formatCurrency(category.spent)}</TableCell>
                <TableCell align="right">{formatCurrency(category.remaining)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={category.progress}
                        color={category.progress > 100 ? 'error' : 'primary'}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {category.progress.toFixed(1)}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {category.isFixed ? 'Fixed' : category.isFlexible ? 'Flexible' : 'Regular'}
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onEdit(category.id)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(category.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BudgetTable; 