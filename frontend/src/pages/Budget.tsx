import React, { useState, useEffect } from 'react';
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton,
  ButtonGroup,
  ListSubheader,
  InputAdornment,
  Grid as MuiGrid,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
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
import {
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfQuarter, 
  endOfQuarter, 
  startOfYear, 
  endOfYear,
  addMonths,
  addWeeks,
  addQuarters,
  addYears,
  subMonths,
  subWeeks,
  subQuarters,
  subYears,
  format as formatDate,
} from 'date-fns';
import { EXPENSE_CATEGORIES } from '../constants/categories';
import useBudgetStore from '../store/budgetStore';
import BudgetCategories from '../components/budget/BudgetCategories';
import BudgetSummary from '../components/budget/BudgetSummary';
import DateSelector from '../components/shared/DateSelector';

export interface BudgetCategory {
  id: string;
  name: string;
  type: 'Fixed' | 'Flexible' | 'Non-Monthly';
  budgeted: number;
  spent: number;
  rollover: boolean;
  emoji?: string;
}

const initialCategories: BudgetCategory[] = [
  {
    id: '1',
    name: 'Rent',
    type: 'Fixed',
    budgeted: 2000,
    spent: 2000,
    rollover: false,
    emoji: '🏠',
  },
  {
    id: '2',
    name: 'Groceries',
    type: 'Flexible',
    budgeted: 600,
    spent: 450,
    rollover: false,
    emoji: '🛒',
  },
  {
    id: '3',
    name: 'Car Insurance',
    type: 'Non-Monthly',
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

// Add emoji categories
const EMOJI_CATEGORIES = {
  Money: ['💰', '💵', '💸', '🏦', '💳', '💴', '💶', '💷'],
  Home: ['🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏨', '🏪', '🏫'],
  Transport: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '✈️', '🚂'],
  Food: ['🍽️', '🛒', '🍳', '🥘', '🍕', '🍔', '🥪', '🥗'],
  Health: ['🏥', '💊', '🏃', '🧘', '🚴', '⚕️', '🩺'],
  Entertainment: ['🎮', '🎬', '🎭', '🎨', '🎪', '🎟️', '🎫'],
  Education: ['📚', '🎓', '✏️', '📝', '💻', '🔬', '📱'],
  Other: ['📦', '🎁', '🛍️', '👕', '📱', '💻', '🖥️', '⌚️', '📸']
};

const Budget = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories);

  const {
    budgetData,
    selectedDate,
    timeRange,
    setSelectedDate,
    setTimeRange,
    getBudgetForMonth,
    getTransactionsForPeriod,
    getIncomeForPeriod,
    updateMonthlyBudget,
    updateMonthlyIncome,
  } = useBudgetStore();

  useEffect(() => {
    const initializeBudget = async () => {
      try {
        setIsLoading(true);
        
        // Load categories from localStorage or use initial categories
        const savedCategories = localStorage.getItem('budgetCategories');
        if (savedCategories) {
          setCategories(JSON.parse(savedCategories));
        }

        // Initialize monthly income if not set
        const currentMonthIncome = getIncomeForPeriod(selectedDate, 'month');
        if (!currentMonthIncome) {
          updateMonthlyIncome(5000, selectedDate); // Default monthly income
        }

        // Initialize budget categories if not set
        const currentBudget = getBudgetForMonth(selectedDate);
        if (Object.keys(currentBudget).length === 0) {
          categories.forEach(category => {
            updateMonthlyBudget(category.name, category.budgeted, selectedDate);
          });
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize budget');
        console.error('Budget initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeBudget();
  }, [selectedDate, updateMonthlyIncome, updateMonthlyBudget, categories, getBudgetForMonth, getIncomeForPeriod]);

  useEffect(() => {
    localStorage.setItem('budgetCategories', JSON.stringify(categories));
  }, [categories]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const monthlyBudget = getBudgetForMonth(selectedDate) || {};
  const transactions = getTransactionsForPeriod(selectedDate, 'month') || [];
  const monthlyIncome = getIncomeForPeriod(selectedDate, 'month') || 0;

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Budget Overview
          </Typography>
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={(date) => date && setSelectedDate(date)}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </Box>
        
        <Paper sx={{ mb: 3 }}>
          <BudgetSummary 
            monthlyIncome={monthlyIncome}
            transactions={transactions}
            budgets={monthlyBudget}
          />
        </Paper>
        
        <Paper>
          <BudgetCategories
            categories={categories}
            budgets={monthlyBudget}
            onUpdateBudget={(category, amount) => 
              updateMonthlyBudget(category, amount, selectedDate)
            }
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default Budget; 