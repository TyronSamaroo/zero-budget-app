import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
}

interface BudgetManagerProps {
  monthlyIncome: number;
  onUpdateBudget: (categories: BudgetCategory[]) => void;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({
  monthlyIncome,
  onUpdateBudget,
}) => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const remainingToAllocate = monthlyIncome - totalAllocated;

  const handleAddCategory = () => {
    if (!newCategory || !newAmount) return;

    const newCat: BudgetCategory = {
      id: Date.now().toString(),
      name: newCategory,
      allocated: parseFloat(newAmount),
      spent: 0,
    };

    const updatedCategories = [...categories, newCat];
    setCategories(updatedCategories);
    onUpdateBudget(updatedCategories);
    setNewCategory('');
    setNewAmount('');
  };

  const handleDeleteCategory = (id: string) => {
    const updatedCategories = categories.filter((cat) => cat.id !== id);
    setCategories(updatedCategories);
    onUpdateBudget(updatedCategories);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Monthly Budget Overview
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography>Total Income: ${monthlyIncome}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              Remaining to Allocate: ${remainingToAllocate.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <LinearProgress
              variant="determinate"
              value={(totalAllocated / monthlyIncome) * 100}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCategory}
            disabled={!newCategory || !newAmount || remainingToAllocate <= 0}
          >
            Add Category
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography variant="h6">{category.name}</Typography>
                  <Box>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  Allocated: ${category.allocated}
                </Typography>
                <Typography color="textSecondary">
                  Spent: ${category.spent}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(category.spent / category.allocated) * 100}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BudgetManager; 