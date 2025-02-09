import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import {
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { gradients } from '../theme/theme';

// Common expense categories
const EXPENSE_CATEGORIES = {
  Housing: ['Rent', 'Mortgage', 'Utilities', 'Maintenance'],
  Transportation: ['Car Payment', 'Gas', 'Public Transit', 'Maintenance'],
  Food: ['Groceries', 'Dining Out', 'Takeout'],
  Entertainment: ['Movies', 'Games', 'Hobbies', 'Subscriptions'],
  Healthcare: ['Insurance', 'Medications', 'Doctor Visits'],
  Savings: ['Emergency Fund', 'Retirement', 'Investments'],
  Debt: ['Credit Cards', 'Student Loans', 'Personal Loans'],
  Shopping: ['Clothing', 'Electronics', 'Home Goods'],
};

interface Transaction {
  id: string;
  amount: number;
  category: string;
  subcategory: string;
  date: string;
  type: 'income' | 'expense';
}

const Dashboard = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [editingIncome, setEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState(monthlyIncome.toString());
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [addingTransaction, setAddingTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    amount: 0,
    category: '',
    subcategory: '',
    type: 'expense',
  });

  const totalSpent = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalSavings = monthlyIncome - totalSpent;
  const spentPercentage = (totalSpent / monthlyIncome) * 100;
  const savingsPercentage = (totalSavings / monthlyIncome) * 100;

  const handleIncomeSubmit = () => {
    setMonthlyIncome(Number(tempIncome));
    setEditingIncome(false);
  };

  const handleAddTransaction = () => {
    if (newTransaction.amount && newTransaction.category && newTransaction.subcategory) {
      setTransactions([
        ...transactions,
        {
          id: Date.now().toString(),
          amount: Number(newTransaction.amount),
          category: newTransaction.category,
          subcategory: newTransaction.subcategory,
          date: new Date().toISOString(),
          type: newTransaction.type || 'expense',
        },
      ]);
      setAddingTransaction(false);
      setNewTransaction({ amount: 0, category: '', subcategory: '', type: 'expense' });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Welcome back!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your financial overview
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Monthly Income Card */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              backgroundImage: gradients.primary,
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Monthly Income</Typography>
              <IconButton size="small" onClick={() => setEditingIncome(true)} sx={{ color: 'white' }}>
                <EditIcon />
              </IconButton>
            </Box>
            {editingIncome ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  value={tempIncome}
                  onChange={(e) => setTempIncome(e.target.value)}
                  type="number"
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.1)', input: { color: 'white' } }}
                />
                <Button onClick={handleIncomeSubmit} variant="contained" sx={{ bgcolor: 'white', color: 'primary.main' }}>
                  Save
                </Button>
              </Box>
            ) : (
              <Typography variant="h4">${monthlyIncome.toLocaleString()}</Typography>
            )}
          </Paper>
        </Grid>

        {/* Spent Card */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              backgroundImage: gradients.error,
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingDown sx={{ mr: 1 }} />
              <Typography variant="h6">Spent</Typography>
            </Box>
            <Typography variant="h4">${totalSpent.toLocaleString()}</Typography>
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={spentPercentage}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'white',
                  },
                }}
              />
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {spentPercentage.toFixed(1)}% of income
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Savings Card */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              backgroundImage: gradients.success,
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp sx={{ mr: 1 }} />
              <Typography variant="h6">Savings</Typography>
            </Box>
            <Typography variant="h4">${totalSavings.toLocaleString()}</Typography>
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={savingsPercentage}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'white',
                  },
                }}
              />
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {savingsPercentage.toFixed(1)}% of income
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Recent Transactions</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddingTransaction(true)}
              >
                Add Transaction
              </Button>
            </Box>
            
            {transactions.length > 0 ? (
              <Grid container spacing={2}>
                {transactions.map((transaction) => (
                  <Grid item xs={12} key={transaction.id}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1">{transaction.subcategory}</Typography>
                        <Chip
                          label={transaction.category}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        color={transaction.type === 'expense' ? 'error.main' : 'success.main'}
                      >
                        {transaction.type === 'expense' ? '-' : '+'}${transaction.amount}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="text.secondary" align="center">
                No transactions yet
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Add Transaction Dialog */}
      <Dialog open={addingTransaction} onClose={() => setAddingTransaction(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newTransaction.type}
                  label="Type"
                  onChange={(e: SelectChangeEvent) => 
                    setNewTransaction({ ...newTransaction, type: e.target.value as 'income' | 'expense' })
                  }
                >
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newTransaction.category}
                  label="Category"
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                >
                  {Object.keys(EXPENSE_CATEGORIES).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {newTransaction.category && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Subcategory</InputLabel>
                  <Select
                    value={newTransaction.subcategory}
                    label="Subcategory"
                    onChange={(e) => setNewTransaction({ ...newTransaction, subcategory: e.target.value })}
                  >
                    {EXPENSE_CATEGORIES[newTransaction.category as keyof typeof EXPENSE_CATEGORIES].map((sub) => (
                      <MenuItem key={sub} value={sub}>
                        {sub}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddingTransaction(false)}>Cancel</Button>
          <Button onClick={handleAddTransaction} variant="contained">
            Add Transaction
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 