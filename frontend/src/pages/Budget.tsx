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
  Alert,
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
  ContentCopy as CopyIcon,
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
import MonthlyBudgetGrid from '../components/MonthlyBudgetGrid';

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
  const [copyFromMonth, setCopyFromMonth] = useState<Date | null>(null);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);

  const {
    budgetData,
    selectedDate,
    timeRange,
    visibleMonths,
    setSelectedDate,
    setTimeRange,
    getBudgetForMonth,
    getTransactionsForPeriod,
    getIncomeForPeriod,
    updateMonthlyBudget,
    updateMonthlyIncome,
    updateVisibleMonths,
  } = useBudgetStore();

  useEffect(() => {
    const initializeBudget = async () => {
      try {
        setIsLoading(true);
        
        // Load categories from localStorage or initialize with default categories
        const savedCategories = localStorage.getItem('budgetCategories');
        if (savedCategories) {
          setCategories(JSON.parse(savedCategories));
        } else {
          // Initialize with default categories from EXPENSE_CATEGORIES
          const defaultCategories = Object.entries(EXPENSE_CATEGORIES).map(([category], index) => ({
            id: index.toString(),
            name: category,
            type: 'Flexible' as const,
            budgeted: 0,
            spent: 0,
            rollover: false,
            emoji: '💰',
          }));
          setCategories(defaultCategories);
          localStorage.setItem('budgetCategories', JSON.stringify(defaultCategories));
        }

        // Initialize monthly income if not set
        const currentMonthIncome = getIncomeForPeriod(selectedDate, 'month');
        if (!currentMonthIncome) {
          updateMonthlyIncome(5000, selectedDate); // Default monthly income
        }

        // Update visible months range
        updateVisibleMonths(selectedDate, 12); // Show 12 months centered on selected date
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize budget');
        console.error('Budget initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeBudget();
  }, [selectedDate, updateMonthlyIncome, updateVisibleMonths]);

  const handleCopyBudget = () => {
    if (!copyFromMonth) return;
    
    const sourceBudget = getBudgetForMonth(copyFromMonth);
    Object.entries(sourceBudget).forEach(([category, amount]) => {
      updateMonthlyBudget(category, amount, selectedDate);
    });
    
    setShowCopyDialog(false);
    setCopyFromMonth(null);
  };

  const handleMonthClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleUpdateCategory = (updatedCategory: BudgetCategory) => {
    const newCategories = categories.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    );
    setCategories(newCategories);
    localStorage.setItem('budgetCategories', JSON.stringify(newCategories));
  };

  const handleAddCategory = (newCategory: BudgetCategory) => {
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem('budgetCategories', JSON.stringify(updatedCategories));
    updateMonthlyBudget(newCategory.name, newCategory.budgeted, selectedDate);
  };

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
        <Alert severity="error">{error}</Alert>
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
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Budget Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {format(selectedDate, 'MMMM yyyy')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CopyIcon />}
              onClick={() => setShowCopyDialog(true)}
            >
              Copy from Month
            </Button>
            <DateSelector
              selectedDate={selectedDate}
              onDateChange={(date) => date && setSelectedDate(date)}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
          </Box>
        </Box>

        {/* Monthly Budget Grid */}
        <Paper sx={{ mb: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Monthly Overview
          </Typography>
          <MonthlyBudgetGrid onMonthClick={handleMonthClick} />
        </Paper>
        
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
            onUpdateCategory={handleUpdateCategory}
            onAddCategory={handleAddCategory}
          />
        </Paper>
      </Box>

      {/* Copy Budget Dialog */}
      <Dialog open={showCopyDialog} onClose={() => setShowCopyDialog(false)}>
        <DialogTitle>Copy Budget from Another Month</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <DateSelector
              selectedDate={copyFromMonth || selectedDate}
              onDateChange={(date) => date && setCopyFromMonth(date)}
              showTimeRangeSelector={false}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCopyDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCopyBudget}
            variant="contained"
            disabled={!copyFromMonth}
          >
            Copy Budget
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Budget; 