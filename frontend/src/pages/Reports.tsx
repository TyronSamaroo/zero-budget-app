import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Tab,
  Tabs,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  TrendingUp,
  TrendingDown,
  CalendarToday,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { format, subMonths, subDays } from 'date-fns';
import SankeyDiagram from '../components/SankeyDiagram/SankeyDiagram';
import { SankeyData } from '../components/SankeyDiagram/SankeyDiagram';
import { gradients } from '../theme/theme';
import { EXPENSE_CATEGORIES } from '../constants/categories';
import DateSelector from '../components/shared/DateSelector';
import useBudgetStore from '../store/budgetStore';

type TimeRangeType = 'week' | 'month' | 'quarter' | 'year' | 'ytd';

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

// Sample data for charts
const generateMonthlyData = () => {
  return Array.from({ length: 6 }, (_, i) => ({
    month: format(subMonths(new Date(), i), 'MMM yyyy'),
    income: 4000 + Math.random() * 2000,
    expenses: 2500 + Math.random() * 1500,
    savings: 1000 + Math.random() * 1000,
  })).reverse();
};

// Sample data for daily spending
const generateDailyData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    date: format(subDays(new Date(), i), 'MMM dd'),
    amount: Math.floor(Math.random() * 200) + 50,
  })).reverse();
};

const monthlyData = generateMonthlyData();
const dailySpending = generateDailyData();

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Reports = () => {
  const {
    selectedDate,
    timeRange,
    setSelectedDate,
    setTimeRange: setStoreTimeRange,
  } = useBudgetStore();
  
  const [reportType, setReportType] = useState('cashflow');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleReportTypeChange = (event: React.SyntheticEvent, newValue: string) => {
    setReportType(newValue);
  };

  const handleTimeRangeChange = (range: TimeRangeType) => {
    setStoreTimeRange(range);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            Reports & Insights
          </Typography>
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={(date) => date && setSelectedDate(date)}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />
        </Box>

        <Tabs
          value={reportType}
          onChange={handleReportTypeChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab value="cashflow" label="Cash Flow" />
          <Tab value="spending" label="Spending" />
          <Tab value="trends" label="Trends" />
          <Tab value="networth" label="Net Worth" />
        </Tabs>
      </Box>

      {reportType === 'cashflow' && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Cash Flow Visualization
              </Typography>
              <Box height="500px">
                <SankeyDiagram data={sampleData} height={500} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Income vs. Expenses Trend</Typography>
              <Box height={400}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4318FF" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4318FF" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF5630" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FF5630" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38CB89" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#38CB89" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#4318FF"
                      fillOpacity={1}
                      fill="url(#colorIncome)"
                      name="Income"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#FF5630"
                      fillOpacity={1}
                      fill="url(#colorExpenses)"
                      name="Expenses"
                    />
                    <Area
                      type="monotone"
                      dataKey="savings"
                      stroke="#38CB89"
                      fillOpacity={1}
                      fill="url(#colorSavings)"
                      name="Savings"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                backgroundImage: gradients.primary,
                color: 'white',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ mr: 1 }} />
                <Typography variant="h6">Monthly Income</Typography>
              </Box>
              <Typography variant="h3" gutterBottom>
                $5,000
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp />
                <Typography variant="body2">+8% from last month</Typography>
              </Box>
            </Paper>
          </Grid>

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
                <Typography variant="h6">Monthly Expenses</Typography>
              </Box>
              <Typography variant="h3" gutterBottom>
                $3,200
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingDown />
                <Typography variant="body2">-5% from last month</Typography>
              </Box>
            </Paper>
          </Grid>

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
                <Typography variant="h6">Net Savings</Typography>
              </Box>
              <Typography variant="h3" gutterBottom>
                $1,800
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp />
                <Typography variant="body2">+15% from last month</Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Top Spending Categories</Typography>
                <IconButton
                  size="small"
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                {Object.entries(EXPENSE_CATEGORIES).slice(0, 4).map(([category]) => (
                  <Grid item xs={12} sm={6} md={3} key={category}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {category}
                        </Typography>
                        <Typography variant="h4" gutterBottom>
                          $800
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TrendingUp color="success" />
                          <Typography variant="body2" color="success.main">
                            +12%
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Daily Spending Trend</Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailySpending}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="amount"
                      fill="url(#colorSpending)"
                      radius={[4, 4, 0, 0]}
                    >
                      <defs>
                        <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4318FF" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4318FF" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Category Distribution</Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(EXPENSE_CATEGORIES).slice(0, 6).map(([category], index) => ({
                        name: category,
                        value: Math.random() * 1000,
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {Object.entries(EXPENSE_CATEGORIES).slice(0, 6).map((_, index) => (
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

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Savings Growth</Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorSavingsGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38CB89" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#38CB89" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="savings"
                      stroke="#38CB89"
                      fillOpacity={1}
                      fill="url(#colorSavingsGrowth)"
                      name="Savings"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>Export Report</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Print Report</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Share Report</MenuItem>
      </Menu>
    </Container>
  );
};

export default Reports; 