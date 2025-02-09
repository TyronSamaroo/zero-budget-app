import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  LinearProgress,
  Tabs,
  Tab,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { gradients } from '../theme/theme';

interface BudgetCategory {
  id: string;
  name: string;
  type: 'fixed' | 'flexible' | 'non-monthly';
  budgeted: number;
  spent: number;
  rollover: boolean;
  emoji?: string;
}

const initialCategories: BudgetCategory[] = [
  {
    id: '1',
    name: 'Rent',
    type: 'fixed',
    budgeted: 2000,
    spent: 2000,
    rollover: false,
    emoji: '🏠',
  },
  {
    id: '2',
    name: 'Groceries',
    type: 'flexible',
    budgeted: 600,
    spent: 450,
    rollover: false,
    emoji: '🛒',
  },
  {
    id: '3',
    name: 'Car Insurance',
    type: 'non-monthly',
    budgeted: 1200,
    spent: 0,
    rollover: true,
    emoji: '🚗',
  },
];

const Budget = () => {
  const [budgetType, setBudgetType] = useState<'flex' | 'category'>('flex');
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);

  const flexibleSpent = categories
    .filter(cat => cat.type === 'flexible')
    .reduce((sum, cat) => sum + cat.spent, 0);
  
  const flexibleBudget = categories
    .filter(cat => cat.type === 'flexible')
    .reduce((sum, cat) => sum + cat.budgeted, 0);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Budget
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Choose how you prefer to budget with either flexible or category-based budgeting
        </Typography>
        <Tabs
          value={budgetType}
          onChange={(_, newValue) => setBudgetType(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab
            value="flex"
            label="Flex Budgeting"
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            value="category"
            label="Category Budgeting"
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
        </Tabs>
      </Box>

      {budgetType === 'flex' && (
        <Grid container spacing={3}>
          {/* Fixed Expenses */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Fixed Expenses</Typography>
                <Button startIcon={<AddIcon />} variant="contained">
                  Add Fixed Expense
                </Button>
              </Box>
              {categories
                .filter(cat => cat.type === 'fixed')
                .map(category => (
                  <Box
                    key={category.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                      p: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body1">{category.emoji} {category.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h6">${category.budgeted.toLocaleString()}</Typography>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
            </Paper>
          </Grid>

          {/* Flexible Spending */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                backgroundImage: gradients.secondary,
                color: 'white',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Flexible Spending
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h3" gutterBottom>
                  ${(flexibleBudget - flexibleSpent).toLocaleString()}
                </Typography>
                <Typography variant="body1">
                  remaining of ${flexibleBudget.toLocaleString()}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(flexibleSpent / flexibleBudget) * 100}
                  sx={{
                    mt: 2,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'white',
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Non-Monthly Expenses */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Non-Monthly Expenses</Typography>
                <Button startIcon={<AddIcon />} variant="contained">
                  Add Non-Monthly
                </Button>
              </Box>
              {categories
                .filter(cat => cat.type === 'non-monthly')
                .map(category => (
                  <Box
                    key={category.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                      p: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body1">{category.emoji} {category.name}</Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={category.rollover}
                            size="small"
                          />
                        }
                        label="Rollover"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6">${category.budgeted.toLocaleString()}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${category.spent.toLocaleString()} spent
                        </Typography>
                      </Box>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
            </Paper>
          </Grid>
        </Grid>
      )}

      {budgetType === 'category' && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">All Categories</Typography>
                <Button startIcon={<AddIcon />} variant="contained">
                  Add Category
                </Button>
              </Box>
              {categories.map(category => (
                <Box
                  key={category.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1">{category.emoji} {category.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h6">${category.spent.toLocaleString()}</Typography>
                      <Typography color="text.secondary">
                        of ${category.budgeted.toLocaleString()}
                      </Typography>
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(category.spent / category.budgeted) * 100}
                    sx={{
                      mt: 1,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: category.spent > category.budgeted ? 'error.main' : 'primary.main',
                      },
                    }}
                  />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Budget; 