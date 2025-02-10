import React from 'react';
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
  TextField,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  addWeeks,
  addMonths,
  addQuarters,
  addYears,
  subWeeks,
  subMonths,
  subQuarters,
  subYears,
} from 'date-fns';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date | null) => void;
  timeRange?: 'week' | 'month' | 'quarter' | 'year' | 'ytd';
  onTimeRangeChange?: (range: 'week' | 'month' | 'quarter' | 'year' | 'ytd') => void;
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
    _: React.MouseEvent<HTMLElement>,
    newRange: 'week' | 'month' | 'quarter' | 'year' | 'ytd' | null,
  ) => {
    if (newRange && onTimeRangeChange) {
      onTimeRangeChange(newRange);
      
      // Adjust the selected date to the start of the selected period
      let newDate = selectedDate;
      switch (newRange) {
        case 'week':
          newDate = startOfWeek(selectedDate);
          break;
        case 'month':
          newDate = startOfMonth(selectedDate);
          break;
        case 'quarter':
          newDate = startOfQuarter(selectedDate);
          break;
        case 'year':
          newDate = startOfYear(selectedDate);
          break;
        case 'ytd':
          newDate = startOfYear(new Date());
          break;
      }
      onDateChange(newDate);
    }
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    let newDate = selectedDate;
    
    switch (timeRange) {
      case 'week':
        newDate = direction === 'prev' ? subWeeks(selectedDate, 1) : addWeeks(selectedDate, 1);
        break;
      case 'month':
        newDate = direction === 'prev' ? subMonths(selectedDate, 1) : addMonths(selectedDate, 1);
        break;
      case 'quarter':
        newDate = direction === 'prev' ? subQuarters(selectedDate, 1) : addQuarters(selectedDate, 1);
        break;
      case 'year':
        newDate = direction === 'prev' ? subYears(selectedDate, 1) : addYears(selectedDate, 1);
        break;
      case 'ytd':
        // For YTD, we don't allow navigation
        return;
    }
    
    onDateChange(newDate);
  };

  const getDateRangeLabel = () => {
    switch (timeRange) {
      case 'week':
        return `${startOfWeek(selectedDate).toLocaleDateString()} - ${endOfWeek(selectedDate).toLocaleDateString()}`;
      case 'month':
        return selectedDate.toLocaleDateString('default', { month: 'long', year: 'numeric' });
      case 'quarter':
        return `Q${Math.floor(selectedDate.getMonth() / 3) + 1} ${selectedDate.getFullYear()}`;
      case 'year':
        return selectedDate.getFullYear().toString();
      case 'ytd':
        return `YTD ${selectedDate.getFullYear()}`;
      default:
        return selectedDate.toLocaleDateString();
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {showTimeRangeSelector && (
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          size="small"
        >
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
          <ToggleButton value="quarter">Quarter</ToggleButton>
          <ToggleButton value="year">Year</ToggleButton>
          <ToggleButton value="ytd">YTD</ToggleButton>
        </ToggleButtonGroup>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Previous">
          <IconButton onClick={() => handleNavigate('prev')} disabled={timeRange === 'ytd'}>
            <ChevronLeftIcon />
          </IconButton>
        </Tooltip>
        
        <DatePicker<Date>
          value={selectedDate}
          onChange={(newValue: Date | null) => onDateChange(newValue)}
          slotProps={{
            textField: {
              size: "small",
              sx: { width: 200 },
              inputProps: {
                readOnly: true
              }
            }
          }}
          views={timeRange === 'month' ? ['month', 'year'] : ['day', 'month', 'year']}
          format={timeRange === 'month' ? 'MMMM yyyy' : 'MMM d, yyyy'}
          defaultValue={selectedDate}
        />
        
        <Tooltip title="Next">
          <IconButton onClick={() => handleNavigate('next')} disabled={timeRange === 'ytd'}>
            <ChevronRightIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default DateSelector; 