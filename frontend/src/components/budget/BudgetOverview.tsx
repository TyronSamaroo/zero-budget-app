import React from 'react';
import { Card, Grid, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useBudgetStore } from '../../store/budgetStore';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const BudgetOverview: React.FC = () => {
  const { budgetSummary, monthlyTrend } = useBudgetStore();

  const distributionData = [
    { name: 'Fixed Expenses', value: budgetSummary.fixedExpenses },
    { name: 'Flexible Expenses', value: budgetSummary.flexibleExpenses },
  ];

  const overviewData = [
    { name: 'Total', budgeted: budgetSummary.totalBudgeted, spent: budgetSummary.totalSpent, remaining: budgetSummary.totalRemaining },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>Budget Overview</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={overviewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budgeted" fill="#8884d8" name="Budgeted" />
              <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
              <Bar dataKey="remaining" fill="#ffc658" name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>Budget Distribution</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Monthly Spend Trend</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickFormatter={(value) => new Date(value).toLocaleDateString('default', { month: 'short' })} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Grid>
    </Grid>
  );
};

export default BudgetOverview; 