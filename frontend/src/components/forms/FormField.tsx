import React from 'react';
import {
  TextField,
  TextFieldProps,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { FormField as FormFieldType } from '../../types';

export interface FormFieldProps extends Omit<TextFieldProps, 'type'> {
  field: FormFieldType;
  value: any;
  error?: string[];
  touched?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
  ...props
}) => {
  const hasError = touched && error && error.length > 0;
  const helperText = hasError ? error[0] : props.helperText;

  switch (field.type) {
    case 'select':
      return (
        <FormControl
          fullWidth
          error={hasError}
          variant={props.variant as 'outlined' | 'filled' | 'standard'}
        >
          <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
          <Select
            labelId={`${field.name}-label`}
            id={field.name}
            name={field.name}
            value={value || ''}
            label={field.label}
            onChange={onChange}
            onBlur={onBlur}
          >
            {field.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      );

    case 'date':
      return (
        <DatePicker
          label={field.label}
          value={value}
          onChange={(newValue) => {
            const e = {
              target: {
                name: field.name,
                value: newValue,
              },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(e);
          }}
          slotProps={{
            textField: {
              ...props,
              error: hasError,
              helperText,
              onBlur,
              fullWidth: true,
            },
          }}
        />
      );

    default:
      return (
        <TextField
          {...props}
          name={field.name}
          label={field.label}
          type={field.type}
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={hasError}
          helperText={helperText}
          required={field.required}
          fullWidth
        />
      );
  }
}; 