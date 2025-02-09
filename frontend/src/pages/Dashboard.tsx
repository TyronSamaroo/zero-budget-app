import React from 'react';
import { Container, Grid, Paper, Typography, Box, LinearProgress } from '@mui/material';
import { PieChart, AccountBalance, TrendingUp } from '@mui/icons-material';

const Dashboard = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccountBalance color="primary" sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6" color="primary">
                Monthly Budget
              </Typography>
            </Box>
            <Typography component="p" variant="h4">
              $5,000
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              Total Income
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PieChart color="error" sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6" color="error">
                Spent
              </Typography>
            </Box>
            <Typography component="p" variant="h4">
              $3,200
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={64} 
                sx={{ flex: 1, mr: 1 }} 
                color="error"
              />
              <Typography variant="body2" color="text.secondary">
                64%
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp color="success" sx={{ mr: 1 }} />
              <Typography component="h2" variant="h6" color="success">
                Savings
              </Typography>
            </Box>
            <Typography component="p" variant="h4">
              $1,800
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={36} 
                sx={{ flex: 1, mr: 1 }} 
                color="success"
              />
              <Typography variant="body2" color="text.secondary">
                36%
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Mini Reports */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography component="h2" variant="h6" gutterBottom>
              Quick Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your financial health is looking good! You're on track with your savings goals.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 