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
import SankeyDiagram from '../components/SankeyDiagram/SankeyDiagram';
import { SankeyData } from '../components/SankeyDiagram/SankeyDiagram';
import { gradients } from '../theme/theme';
import { EXPENSE_CATEGORIES } from '../constants/categories';

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

const Reports = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [reportType, setReportType] = useState('cashflow');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeRange: string,
  ) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  const handleReportTypeChange = (event: React.SyntheticEvent, newValue: string) => {
    setReportType(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            Reports & Insights
          </Typography>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            aria-label="time range"
          >
            <ToggleButton value="month" aria-label="month">
              Month
            </ToggleButton>
            <ToggleButton value="quarter" aria-label="quarter">
              Quarter
            </ToggleButton>
            <ToggleButton value="year" aria-label="year">
              Year
            </ToggleButton>
          </ToggleButtonGroup>
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