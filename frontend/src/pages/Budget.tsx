import React from 'react';
import { Container, Grid, Button, Box, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import BudgetOverview from '../components/budget/BudgetOverview';
import BudgetTable from '../components/budget/BudgetTable';
import BudgetForm from '../components/budget/BudgetForm';
import { useBudgetStore } from '../store/budgetStore';

const Budget: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | undefined>(undefined);
  const { fetchBudgetSummary, fetchCategories, resetStore } = useBudgetStore();

  // Reset and fetch data when component mounts
  React.useEffect(() => {
    const initializeData = async () => {
      console.log('Budget component mounted, resetting store and fetching fresh data');
      
      // Clear any browser storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Reset the store
      resetStore();
      
      try {
        console.log('Fetching fresh data from server...');
        await Promise.all([
          fetchBudgetSummary(),
          fetchCategories()
        ]);
        console.log('Fresh data fetched successfully');
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    initializeData();
  }, []);

  // Refresh data when form closes
  const handleCloseForm = async () => {
    console.log('Form closing, refreshing data...');
    setIsFormOpen(false);
    setEditingId(undefined);
    
    try {
      // Clear any browser storage again
      localStorage.clear();
      sessionStorage.clear();
      
      // Reset store and fetch fresh data
      resetStore();
      console.log('Fetching fresh data after form close...');
      await Promise.all([
        fetchBudgetSummary(),
        fetchCategories()
      ]);
      console.log('Fresh data fetched after form close');
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const handleAddClick = () => {
    setEditingId(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (id: number) => {
    setEditingId(id);
    setIsFormOpen(true);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <BudgetOverview />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Budget Categories</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddClick}
              >
                Add Category
              </Button>
            </Box>
            <BudgetTable onEdit={handleEditClick} />
          </Grid>
        </Grid>

        <BudgetForm
          open={isFormOpen}
          onClose={handleCloseForm}
          editId={editingId}
        />
      </Box>
    </Container>
  );
};

export default Budget; 