import React from 'react';
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  ButtonGroup,
  IconButton,
  Button,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import {
  format,
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
} from 'date-fns';

interface DateRangeSelectorProps {
  selectedDate: Date;
  timeRange: 'week' | 'month' | 'quarter' | 'year';
  onDateChange: (date: Date) => void;
  onTimeRangeChange: (range: 'week' | 'month' | 'quarter' | 'year') => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  selectedDate,
  timeRange,
  onDateChange,
  onTimeRangeChange,
}) => {
  const getPeriodRange = () => {
    switch (timeRange) {
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

  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeRange: 'week' | 'month' | 'quarter' | 'year' | null,
  ) => {
    if (newTimeRange !== null) {
      onTimeRangeChange(newTimeRange);
    }
  };

  const handleNavigatePeriod = (direction: 'prev' | 'next') => {
    const navigate = {
      week: direction === 'next' ? addWeeks : subWeeks,
      month: direction === 'next' ? addMonths : subMonths,
      quarter: direction === 'next' ? addQuarters : subQuarters,
      year: direction === 'next' ? addYears : subYears,
    };

    onDateChange(navigate[timeRange](selectedDate, 1));
  };

  const periodRange = getPeriodRange();
  const periodLabel = format(selectedDate, periodRange.format);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <ToggleButtonGroup
        value={timeRange}
        exclusive
        onChange={handleTimeRangeChange}
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.secondary',
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
      <ButtonGroup variant="outlined" size="small">
        <IconButton onClick={() => handleNavigatePeriod('prev')}>
          <ChevronLeftIcon />
        </IconButton>
        <Button
          sx={{
            minWidth: 150,
            fontWeight: 600,
            '&:hover': { backgroundColor: 'transparent' },
          }}
        >
          {periodLabel}
        </Button>
        <IconButton onClick={() => handleNavigatePeriod('next')}>
          <ChevronRightIcon />
        </IconButton>
      </ButtonGroup>
    </Box>
  );
};

export default DateRangeSelector; 