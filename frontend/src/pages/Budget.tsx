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

interface BudgetCategory {
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
  // Load initial data from localStorage or use defaults
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const saved = localStorage.getItem('selectedDate');
    return saved ? new Date(saved) : new Date();
  });

  const [periodType, setPeriodType] = useState<'week' | 'month' | 'quarter' | 'year'>(() => {
    return localStorage.getItem('periodType') as any || 'month';
  });

  const [budgetType, setBudgetType] = useState<'flex' | 'category'>(() => {
    return localStorage.getItem('budgetType') as any || 'flex';
  });

  const [categories, setCategories] = useState<BudgetCategory[]>(() => {
    const saved = localStorage.getItem('budgetCategories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('selectedDate', selectedDate.toISOString());
    localStorage.setItem('periodType', periodType);
    localStorage.setItem('budgetType', budgetType);
    localStorage.setItem('budgetCategories', JSON.stringify(categories));
  }, [selectedDate, periodType, budgetType, categories]);

  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<BudgetCategory>>({
    type: 'Flexible',
    rollover: false,
  });
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const [editableField, setEditableField] = useState<{
    categoryId: string;
    field: 'name' | 'emoji' | 'type' | 'budgeted' | null;
  }>({ categoryId: '', field: null });

  // Add state for emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('Money');

  // Update availableCategories to be mutable
  const [availableCategories, setAvailableCategories] = useState<string[]>(
    [...Object.keys(EXPENSE_CATEGORIES)]
  );

  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);

  const flexibleSpent = categories
    .filter(cat => cat.type === 'Flexible')
    .reduce((sum, cat) => sum + cat.spent, 0);
  
  const flexibleBudget = categories
    .filter(cat => cat.type === 'Flexible')
    .reduce((sum, cat) => sum + cat.budgeted, 0);

  const categoryData = categories.map((cat) => ({
    name: cat.name,
    budgeted: cat.budgeted,
    spent: cat.spent,
    remaining: cat.budgeted - cat.spent,
  }));

  const handleEditCategory = (category: BudgetCategory) => {
    setEditingCategory(category.id);
  };

  const handleSaveCategory = (id: string, updates: Partial<BudgetCategory>) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    ));
    setEditingCategory(null);
  };

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.budgeted !== undefined) {
      const category: BudgetCategory = {
        id: Date.now().toString(),
        name: newCategory.name,
        type: newCategory.type || 'Flexible',
        budgeted: newCategory.budgeted,
        spent: 0,
        rollover: newCategory.rollover || false,
        emoji: newCategory.emoji,
      };
      const updatedCategories = [...categories, category];
      setCategories(updatedCategories);
      setNewCategory({ type: 'Flexible', rollover: false });
      setIsAddingCategory(false);
      // Save to localStorage
      localStorage.setItem('budgetCategories', JSON.stringify(updatedCategories));
    }
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const handleDateChange = (value: unknown) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const handleFieldClick = (categoryId: string, field: 'name' | 'emoji' | 'type' | 'budgeted') => {
    setEditableField({ categoryId, field });
  };

  const handleFieldBlur = () => {
    setEditableField({ categoryId: '', field: null });
  };

  const handleFieldKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFieldBlur();
    }
  };

  const handleCategoryChange = (categoryId: string, updates: Partial<BudgetCategory>) => {
    if (updates.name === '__new__') {
      const newCategoryName = prompt('Enter new category name:');
      if (newCategoryName) {
        setAvailableCategories(prev => [...prev, newCategoryName]);
        setCategories(categories.map(cat => 
          cat.id === categoryId ? { ...cat, name: newCategoryName } : cat
        ));
      }
    } else {
      setCategories(categories.map(cat => 
        cat.id === categoryId ? { ...cat, ...updates } : cat
      ));
    }
  };

  const getPeriodRange = () => {
    switch (periodType) {
      case 'week':
        return {
          start: startOfWeek(selectedDate),
          end: endOfWeek(selectedDate),
          format: "'Week of' MMM d, yyyy",
        };
      case 'month':
        return {
          start: startOfMonth(selectedDate),
          end: endOfMonth(selectedDate),
          format: 'MMMM yyyy',
        };
      case 'quarter':
        return {
          start: startOfQuarter(selectedDate),
          end: endOfQuarter(selectedDate),
          format: "'Q'Q yyyy",
        };
      case 'year':
        return {
          start: startOfYear(selectedDate),
          end: endOfYear(selectedDate),
          format: 'yyyy',
        };
    }
  };

  const handlePeriodChange = (event: React.MouseEvent<HTMLElement>, newPeriod: 'week' | 'month' | 'quarter' | 'year') => {
    if (newPeriod !== null) {
      setPeriodType(newPeriod);
    }
  };

  const handleNavigatePeriod = (direction: 'prev' | 'next') => {
    const navigate = {
      week: direction === 'next' ? addWeeks : subWeeks,
      month: direction === 'next' ? addMonths : subMonths,
      quarter: direction === 'next' ? addQuarters : subQuarters,
      year: direction === 'next' ? addYears : subYears,
    };

    setSelectedDate(navigate[periodType](selectedDate, 1));
  };

  const periodRange = getPeriodRange();
  const periodLabel = formatDate(selectedDate, periodRange.format);

  // Modify the table cell for category name
  const renderCategoryCell = (category: BudgetCategory) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box 
        onClick={() => setShowEmojiPicker(true)}
        sx={{ 
          cursor: 'pointer',
          '&:hover': { opacity: 0.8 }
        }}
      >
        {category.emoji || '📊'}
      </Box>
      <TextField
        select
        size="small"
        value={category.name}
        onChange={(e) => handleCategoryChange(category.id, { name: e.target.value })}
        sx={{ minWidth: 200 }}
      >
        {Object.entries(EXPENSE_CATEGORIES).map(([mainCategory, subCategories]) => [
          <ListSubheader key={mainCategory}>{mainCategory}</ListSubheader>,
          ...subCategories.map(subCategory => (
            <MenuItem key={`${mainCategory}-${subCategory}`} value={subCategory}>
              {subCategory}
            </MenuItem>
          ))
        ]).flat()}
        <MenuItem value="__new__">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon fontSize="small" />
            Add New Category
          </Box>
        </MenuItem>
      </TextField>
    </Box>
  );

  // Modify the table cell for type
  const renderTypeCell = (category: BudgetCategory) => (
    <TextField
      select
      size="small"
      value={category.type}
      onChange={(e) => handleCategoryChange(category.id, { type: e.target.value as BudgetCategory['type'] })}
      sx={{ minWidth: 150 }}
    >
      <MenuItem value="Fixed">Fixed</MenuItem>
      <MenuItem value="Flexible">Flexible</MenuItem>
      <MenuItem value="Non-Monthly">Non-Monthly</MenuItem>
    </TextField>
  );

  // Modify the table cell for budgeted amount
  const renderBudgetedCell = (category: BudgetCategory) => (
    <TextField
      size="small"
      type="number"
      value={category.budgeted}
      onChange={(e) => handleCategoryChange(category.id, { budgeted: Number(e.target.value) })}
      sx={{ width: 120 }}
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>
      }}
    />
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Budget
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ToggleButtonGroup
              value={periodType}
              exclusive
              onChange={handlePeriodChange}
              size="small"
            >
              <ToggleButton value="week">Week</ToggleButton>
              <ToggleButton value="month">Month</ToggleButton>
              <ToggleButton value="quarter">Quarter</ToggleButton>
              <ToggleButton value="year">Year</ToggleButton>
            </ToggleButtonGroup>
            <ButtonGroup variant="outlined" size="small">
              <IconButton onClick={() => handleNavigatePeriod('prev')}>
                <ChevronLeftIcon />
              </IconButton>
              <Button
                sx={{ 
                  minWidth: 150,
                  fontWeight: 600,
                  '&:hover': { backgroundColor: 'transparent' }
                }}
              >
                {periodLabel}
              </Button>
              <IconButton onClick={() => handleNavigatePeriod('next')}>
                <ChevronRightIcon />
              </IconButton>
            </ButtonGroup>
          </Box>
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
          {/* Detailed Budget Table */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Detailed Budget</Typography>
                <Button 
                  startIcon={<AddIcon />} 
                  variant="contained"
                  onClick={() => setIsAddingCategory(true)}
                >
                  Add Category
                </Button>
              </Box>
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
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow 
                        key={category.id}
                        sx={{ 
                          '& td': { 
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)'
                            }
                          }
                        }}
                      >
                        <TableCell>{renderCategoryCell(category)}</TableCell>
                        <TableCell>{renderTypeCell(category)}</TableCell>
                        <TableCell align="right">{renderBudgetedCell(category)}</TableCell>
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
                        <TableCell align="right">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
                .filter(cat => cat.type === 'Non-Monthly')
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
                <Button 
                  startIcon={<AddIcon />} 
                  variant="contained"
                  onClick={() => setIsAddingCategory(true)}
                >
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

      {/* Add Category Dialog - Make sure it's outside both views so it works for both modes */}
      <Dialog 
        open={isAddingCategory} 
        onClose={() => setIsAddingCategory(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Add New Budget Category</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Emoji"
                value={newCategory.emoji || ''}
                onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
                placeholder="��"
              />
            </Grid>
            <Grid item xs={12} sm={10}>
              <TextField
                select
                fullWidth
                label="Category"
                value={newCategory.name || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '__new__') {
                    const newCategoryName = prompt('Enter new category name:');
                    if (newCategoryName) {
                      setAvailableCategories(prev => [...prev, newCategoryName]);
                      setNewCategory({ ...newCategory, name: newCategoryName });
                    }
                  } else {
                    setNewCategory({ ...newCategory, name: value });
                  }
                }}
              >
                {availableCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
                <MenuItem value="__new__">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AddIcon fontSize="small" />
                    Add New Category
                  </Box>
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Type"
                value={newCategory.type}
                onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value as BudgetCategory['type'] })}
              >
                <MenuItem value="Fixed">Fixed</MenuItem>
                <MenuItem value="Flexible">Flexible</MenuItem>
                <MenuItem value="Non-Monthly">Non-Monthly</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Budgeted Amount"
                value={newCategory.budgeted || ''}
                onChange={(e) => setNewCategory({ ...newCategory, budgeted: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newCategory.rollover || false}
                    onChange={(e) => setNewCategory({ ...newCategory, rollover: e.target.checked })}
                  />
                }
                label="Rollover Unspent Amount"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddingCategory(false)}>Cancel</Button>
          <Button 
            onClick={handleAddCategory} 
            variant="contained"
            disabled={!newCategory.name || newCategory.budgeted === undefined}
          >
            Add Category
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Emoji Picker Dialog */}
      <Dialog 
        open={showEmojiPicker} 
        onClose={() => setShowEmojiPicker(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Choose Emoji</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <ToggleButtonGroup
              value={selectedEmojiCategory}
              exclusive
              onChange={(_, value) => value && setSelectedEmojiCategory(value)}
              size="small"
              sx={{ 
                flexWrap: 'wrap',
                '& .MuiToggleButton-root': { px: 1, py: 0.5 }
              }}
            >
              {Object.keys(EMOJI_CATEGORIES).map((category) => (
                <ToggleButton key={category} value={category}>
                  {category}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          <Grid container spacing={1}>
            {EMOJI_CATEGORIES[selectedEmojiCategory as keyof typeof EMOJI_CATEGORIES].map((emoji) => (
              <Grid item key={emoji}>
                <Button
                  onClick={() => {
                    handleCategoryChange(editingCategory!, { emoji });
                    setShowEmojiPicker(false);
                  }}
                  sx={{ 
                    minWidth: 'auto',
                    p: 1,
                    fontSize: '1.5rem',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  {emoji}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Budget; 