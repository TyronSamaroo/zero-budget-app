import React from 'react';
import {
  Button,
  ButtonProps,
  CircularProgress,
  styled,
} from '@mui/material';
import type { LoadingProps } from '../../types';

const StyledButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  '& .MuiCircularProgress-root': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export interface LoadingButtonProps extends ButtonProps, LoadingProps {
  loadingText?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  isLoading,
  loadingText,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <CircularProgress size={24} />}
      {isLoading && loadingText ? loadingText : children}
    </StyledButton>
  );
}; 