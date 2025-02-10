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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { format } from 'date-fns';
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

const COLORS = ['#4318FF', '#38CB89', '#FFAB00', '#FF5630', '#38B6FF', '#9151FF'];

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        sx={{
          p: 2,
          backgroundColor: 'rgba(22, 28, 36, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography variant="body2" color="text.secondary" mb={1}>
          {label}
        </Typography>
        {payload.map((entry: any, index: number) => (
          <Box key={index} sx={{ color: entry.color, mb: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {entry.name}: ${entry.value.toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Paper>
    );
  }
  return null;
};

const Budget = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
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

  const categoryData = categories.map((cat) => ({
    name: cat.name,
    budgeted: cat.budgeted,
    spent: cat.spent,
    remaining: cat.budgeted - cat.spent,
  }));

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Budget
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              label="Select Month"
              views={['year', 'month']}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: { bgcolor: 'background.paper' }
                }
              }}
            />
          </LocalizationProvider>
        </Box>
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

          {/* Budget Overview Chart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Budget Overview</Typography>
              <Box height={400}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <defs>
                      <linearGradient id="colorBudgeted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4318FF" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4318FF" stopOpacity={0.2}/>
                      </linearGradient>
                      <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF5630" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FF5630" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="budgeted" 
                      fill="url(#colorBudgeted)" 
                      name="Budgeted"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="spent" 
                      fill="url(#colorSpent)" 
                      name="Spent"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Budget Distribution */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Budget Distribution</Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories.map((cat) => ({
                        name: cat.name,
                        value: cat.budgeted,
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categories.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={<CustomTooltip />}
                      formatter={(value: any) => `$${value.toLocaleString()}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Monthly Spending Trend</Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={categories}>
                    <defs>
                      <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4318FF" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4318FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="spent"
                      stroke="#4318FF"
                      fillOpacity={1}
                      fill="url(#colorSpending)"
                      name="Spent"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Detailed Budget Table */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Detailed Budget</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Budgeted</TableCell>
                      <TableCell align="right">Spent</TableCell>
                      <TableCell align="right">Remaining</TableCell>
                      <TableCell align="right">Progress</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell component="th" scope="row">
                          {category.emoji} {category.name}
                        </TableCell>
                        <TableCell align="right">${category.budgeted.toLocaleString()}</TableCell>
                        <TableCell align="right">${category.spent.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          ${(category.budgeted - category.spent).toLocaleString()}
                        </TableCell>
                        <TableCell align="right" sx={{ width: '20%' }}>
                          <LinearProgress
                            variant="determinate"
                            value={(category.spent / category.budgeted) * 100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: 'rgba(255,255,255,0.1)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: category.spent > category.budgeted ? 'error.main' : 'primary.main',
                                backgroundImage: category.spent > category.budgeted ? gradients.error : gradients.primary,
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
                    height: 8,
                    borderRadius: 4,
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