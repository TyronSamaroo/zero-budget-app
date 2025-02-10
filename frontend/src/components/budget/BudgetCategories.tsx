import React, { useState } from 'react';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ListSubheader,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  EmojiEmotions as EmojiIcon,
} from '@mui/icons-material';
import { BudgetCategory } from '../../pages/Budget';
import { EXPENSE_CATEGORIES } from '../../constants/categories';
import { EMOJI_CATEGORIES } from '../../constants/emojis';

interface BudgetCategoriesProps {
  categories: BudgetCategory[];
  budgets: Record<string, number>;
  onUpdateBudget: (category: string, amount: number) => void;
  onUpdateCategory?: (category: BudgetCategory) => void;
  onAddCategory?: (category: BudgetCategory) => void;
}

const BudgetCategories: React.FC<BudgetCategoriesProps> = ({
  categories,
  budgets,
  onUpdateBudget,
  onUpdateCategory,
  onAddCategory,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState<Partial<BudgetCategory>>({
    type: 'Flexible',
    emoji: '💰',
    rollover: false,
  });

  const handleEmojiSelect = (emoji: string) => {
    if (selectedCategory && onUpdateCategory) {
      onUpdateCategory({ ...selectedCategory, emoji });
    } else if (newCategory) {
      setNewCategory({ ...newCategory, emoji });
    }
    setShowEmojiPicker(false);
  };

  const handleAddCategory = () => {
    if (onAddCategory && newCategory.name && newCategory.type) {
      onAddCategory({
        id: Date.now().toString(),
        name: newCategory.name,
        type: newCategory.type as 'Fixed' | 'Flexible' | 'Non-Monthly',
        budgeted: newCategory.budgeted || 0,
        spent: 0,
        rollover: newCategory.rollover || false,
        emoji: newCategory.emoji || '💰',
      });
      setShowAddCategory(false);
      setNewCategory({
        type: 'Flexible',
        emoji: '💰',
        rollover: false,
      });
    }
  };

  const renderCategoryGroups = () => {
    const groupedCategories = categories.reduce((acc, category) => {
      const mainCategory = Object.entries(EXPENSE_CATEGORIES).find(([_, subcategories]) =>
        subcategories.includes(category.name)
      )?.[0] || 'Other';
      
      if (!acc[mainCategory]) {
        acc[mainCategory] = [];
      }
      acc[mainCategory].push(category);
      return acc;
    }, {} as Record<string, BudgetCategory[]>);

    return Object.entries(groupedCategories).map(([mainCategory, cats]) => (
      <React.Fragment key={mainCategory}>
        <TableRow>
          <TableCell colSpan={6} sx={{ bgcolor: 'background.default' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {mainCategory}
            </Typography>
          </TableCell>
        </TableRow>
        {cats.map((category) => renderCategoryRow(category))}
      </React.Fragment>
    ));
  };

  const renderCategoryRow = (category: BudgetCategory) => {
    const budgeted = budgets[category.name] || category.budgeted;
    const spent = category.spent || 0;
    const remaining = budgeted - spent;
    const progress = budgeted > 0 ? (spent / budgeted) * 100 : 0;

    return (
      <TableRow key={category.id}>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              size="small" 
              onClick={() => {
                setSelectedCategory(category);
                setShowEmojiPicker(true);
              }}
            >
              {category.emoji}
            </IconButton>
            <FormControl fullWidth variant="outlined" size="small">
              <Select
                value={category.name}
                onChange={(e) => onUpdateCategory?.({
                  ...category,
                  name: e.target.value,
                })}
                sx={{ minWidth: 200 }}
              >
                {Object.entries(EXPENSE_CATEGORIES).map(([mainCat, subCats]) => [
                  <ListSubheader key={mainCat}>{mainCat}</ListSubheader>,
                  ...subCats.map((subCat) => (
                    <MenuItem key={subCat} value={subCat}>
                      {subCat}
                    </MenuItem>
                  )),
                ])}
              </Select>
            </FormControl>
          </Box>
        </TableCell>
        <TableCell>
          <FormControl size="small" fullWidth>
            <Select
              value={category.type}
              onChange={(e) => onUpdateCategory?.({
                ...category,
                type: e.target.value as 'Fixed' | 'Flexible' | 'Non-Monthly',
              })}
            >
              <MenuItem value="Fixed">Fixed</MenuItem>
              <MenuItem value="Flexible">Flexible</MenuItem>
              <MenuItem value="Non-Monthly">Non-Monthly</MenuItem>
            </Select>
          </FormControl>
        </TableCell>
        <TableCell align="right">
          <TextField
            type="number"
            size="small"
            value={budgeted}
            onChange={(e) => onUpdateBudget(category.name, Number(e.target.value))}
            sx={{ width: 150 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </TableCell>
        <TableCell align="right">
          <Typography>${spent.toLocaleString()}</Typography>
        </TableCell>
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
          <Tooltip title={`${progress.toFixed(1)}% of budget used`}>
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
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Budget Categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddCategory(true)}
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
            </TableRow>
          </TableHead>
          <TableBody>
            {renderCategoryGroups()}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Emoji Picker Dialog */}
      <Dialog 
        open={showEmojiPicker} 
        onClose={() => setShowEmojiPicker(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select Emoji</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
              <Grid item xs={12} key={category}>
                <Typography variant="subtitle2" gutterBottom>{category}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {emojis.map((emoji) => (
                    <IconButton
                      key={emoji}
                      onClick={() => handleEmojiSelect(emoji)}
                      sx={{
                        fontSize: '1.5rem',
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: 'white',
                        },
                      }}
                    >
                      {emoji}
                    </IconButton>
                  ))}
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog 
        open={showAddCategory} 
        onClose={() => setShowAddCategory(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={() => setShowEmojiPicker(true)}
                sx={{ width: 40, height: 40 }}
              >
                {newCategory.emoji}
              </IconButton>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newCategory.name || ''}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  label="Category"
                >
                  {Object.entries(EXPENSE_CATEGORIES).map(([mainCat, subCats]) => [
                    <ListSubheader key={mainCat}>{mainCat}</ListSubheader>,
                    ...subCats.map((subCat) => (
                      <MenuItem key={subCat} value={subCat}>
                        {subCat}
                      </MenuItem>
                    )),
                  ])}
                </Select>
              </FormControl>
            </Box>
            
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={newCategory.type}
                onChange={(e) => setNewCategory({ 
                  ...newCategory, 
                  type: e.target.value as 'Fixed' | 'Flexible' | 'Non-Monthly'
                })}
                label="Type"
              >
                <MenuItem value="Fixed">Fixed</MenuItem>
                <MenuItem value="Flexible">Flexible</MenuItem>
                <MenuItem value="Non-Monthly">Non-Monthly</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Initial Budget"
              type="number"
              value={newCategory.budgeted || ''}
              onChange={(e) => setNewCategory({ 
                ...newCategory, 
                budgeted: Number(e.target.value)
              })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddCategory(false)}>Cancel</Button>
          <Button 
            onClick={handleAddCategory}
            variant="contained"
            disabled={!newCategory.name}
          >
            Add Category
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetCategories; 