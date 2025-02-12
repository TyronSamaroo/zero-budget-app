import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { useBudgetStore } from '../../store/budgetStore';

interface BudgetFormProps {
  open: boolean;
  onClose: () => void;
  editId?: number;
}

interface FormData {
  name: string;
  budgeted: number | '';
  isFixed: boolean;
  isFlexible: boolean;
  minAmount: number | '';
  maxAmount: number | '';
}

const commonCategories = [
  'Housing',
  'Transportation',
  'Food & Dining',
  'Utilities',
  'Healthcare',
  'Insurance',
  'Entertainment',
  'Shopping',
  'Personal Care',
  'Education',
  'Savings',
  'Debt Payments',
  'Gifts & Donations',
  'Travel',
  'Other',
];

const BudgetForm: React.FC<BudgetFormProps> = ({ open, onClose, editId }) => {
  const { categories, createBudget, updateBudgetCategory, error } = useBudgetStore();
  const editingCategory = editId ? categories.find(c => c.id === editId) : null;
  const [formError, setFormError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    budgeted: '',
    isFixed: false,
    isFlexible: false,
    minAmount: '',
    maxAmount: '',
  });

  React.useEffect(() => {
    // Reset form error when dialog opens/closes
    setFormError(null);
  }, [open]);

  React.useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        budgeted: editingCategory.budgeted,
        isFixed: editingCategory.isFixed,
        isFlexible: editingCategory.isFlexible,
        minAmount: editingCategory.minAmount || '',
        maxAmount: editingCategory.maxAmount || '',
      });
    } else {
      setFormData({
        name: '',
        budgeted: '',
        isFixed: false,
        isFlexible: false,
        minAmount: '',
        maxAmount: '',
      });
    }
  }, [editingCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      // Validate the required fields
      if (!formData.name) {
        setFormError('Please select a category');
        return;
      }
      if (formData.budgeted === '' || isNaN(Number(formData.budgeted))) {
        setFormError('Please enter a valid budget amount');
        return;
      }

      const submissionData = {
        name: formData.name,  // Make sure name is included
        budgeted: Number(formData.budgeted),
        isFixed: formData.isFixed,
        isFlexible: formData.isFlexible,
        minAmount: formData.minAmount === '' ? 0 : Number(formData.minAmount),
        maxAmount: formData.maxAmount === '' ? 0 : Number(formData.maxAmount)
      };

      console.log('Submitting budget data:', submissionData);

      if (editId) {
        console.log('Updating existing budget:', editId);
        await updateBudgetCategory(editId, submissionData);
      } else {
        console.log('Creating new budget');
        await createBudget(submissionData);
      }

      // Force refresh the budget data
      await Promise.all([
        useBudgetStore.getState().fetchBudgetSummary(),
        useBudgetStore.getState().fetchCategories()
      ]);

      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      setFormError(error instanceof Error ? error.message : 'Failed to save budget');
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow empty string or valid number
    const newValue = value === '' ? '' : parseFloat(value);
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleCategorySelect = (e: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      name: e.target.value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{editId ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {(formError || error) && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError || error}
              </Alert>
            )}

            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={formData.name}
                label="Category"
                onChange={handleCategorySelect}
                required
              >
                {commonCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Budgeted Amount"
              name="budgeted"
              type="number"
              value={formData.budgeted}
              onChange={handleNumberChange}
              required
              fullWidth
              InputProps={{
                inputProps: { min: 0, step: 0.01 },
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isFixed}
                  onChange={handleSwitchChange}
                  name="isFixed"
                />
              }
              label="Fixed Expense"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isFlexible}
                  onChange={handleSwitchChange}
                  name="isFlexible"
                />
              }
              label="Flexible Budget"
            />

            {formData.isFlexible && (
              <>
                <TextField
                  label="Minimum Amount"
                  name="minAmount"
                  type="number"
                  value={formData.minAmount}
                  onChange={handleNumberChange}
                  fullWidth
                  InputProps={{
                    inputProps: { min: 0, step: 0.01 },
                  }}
                />

                <TextField
                  label="Maximum Amount"
                  name="maxAmount"
                  type="number"
                  value={formData.maxAmount}
                  onChange={handleNumberChange}
                  fullWidth
                  InputProps={{
                    inputProps: { min: 0, step: 0.01 },
                  }}
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {editId ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BudgetForm; 