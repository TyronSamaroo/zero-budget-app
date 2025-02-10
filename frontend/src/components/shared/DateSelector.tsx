import React from 'react';
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  IconButton,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date | null) => void;
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
  onTimeRangeChange?: (range: 'week' | 'month' | 'quarter' | 'year') => void;
  showTimeRangeSelector?: boolean;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
  timeRange = 'month',
  onTimeRangeChange,
  showTimeRangeSelector = true,
}) => {
  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeRange: 'week' | 'month' | 'quarter' | 'year' | null,
  ) => {
    if (newTimeRange !== null && onTimeRangeChange) {
      onTimeRangeChange(newTimeRange);
    }
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {showTimeRangeSelector && onTimeRangeChange && (
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            aria-label="time range"
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                },
              },
            }}
          >
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
            <ToggleButton value="quarter">Quarter</ToggleButton>
            <ToggleButton value="year">Year</ToggleButton>
          </ToggleButtonGroup>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handlePreviousMonth} size="small">
            <ChevronLeftIcon />
          </IconButton>
          
          <DatePicker
            value={selectedDate}
            onChange={onDateChange}
            label="Select Month"
            views={['year', 'month']}
            slotProps={{
              textField: {
                size: 'small',
                sx: { bgcolor: 'background.paper', minWidth: '150px' }
              }
            }}
          />

          <IconButton onClick={handleNextMonth} size="small">
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default DateSelector; 