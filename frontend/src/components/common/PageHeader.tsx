import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Stack,
  styled,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { BaseProps } from '../../types';

const HeaderWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiBreadcrumbs-root': {
    marginBottom: theme.spacing(1),
  },
}));

const TitleWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export interface PageHeaderProps extends BaseProps {
  title: string;
  breadcrumbs?: Array<{
    label: string;
    path?: string;
  }>;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs,
  action,
  className,
  style,
}) => {
  return (
    <HeaderWrapper className={className} style={style}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            if (isLast || !crumb.path) {
              return (
                <Typography
                  key={crumb.label}
                  color={isLast ? 'text.primary' : 'text.secondary'}
                >
                  {crumb.label}
                </Typography>
              );
            }

            return (
              <Link
                key={crumb.label}
                component={RouterLink}
                to={crumb.path}
                color="inherit"
                underline="hover"
              >
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}

      <TitleWrapper>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {title}
        </Typography>

        {action && (
          <Button
            variant="contained"
            onClick={action.onClick}
            startIcon={action.icon}
          >
            {action.label}
          </Button>
        )}
      </TitleWrapper>
    </HeaderWrapper>
  );
}; 