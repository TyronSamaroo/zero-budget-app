import { useState, useCallback, ChangeEvent } from 'react';

interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (value: any) => boolean;
  message: string;
}

interface ValidationRules {
  [key: string]: ValidationRule[];
}

interface Errors {
  [key: string]: string[];
}

interface UseFormReturn<T> {
  values: T;
  errors: Errors;
  touched: { [key: string]: boolean };
  isValid: boolean;
  isDirty: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFieldValue: (name: string, value: any) => void;
  setFieldTouched: (name: string, isTouched?: boolean) => void;
  resetForm: () => void;
  validateForm: () => boolean;
}

export function useForm<T extends { [key: string]: any }>(
  initialValues: T,
  validationRules?: ValidationRules
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isDirty, setIsDirty] = useState(false);

  // Validate a single field
  const validateField = useCallback(
    (name: string, value: any): string[] => {
      if (!validationRules || !validationRules[name]) {
        return [];
      }

      return validationRules[name].reduce((fieldErrors: string[], rule: ValidationRule) => {
        if (rule.required && !value) {
          fieldErrors.push(rule.message);
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          fieldErrors.push(rule.message);
        }
        if (rule.minLength && value.length < rule.minLength) {
          fieldErrors.push(rule.message);
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          fieldErrors.push(rule.message);
        }
        if (rule.min && Number(value) < rule.min) {
          fieldErrors.push(rule.message);
        }
        if (rule.max && Number(value) > rule.max) {
          fieldErrors.push(rule.message);
        }
        if (rule.custom && !rule.custom(value)) {
          fieldErrors.push(rule.message);
        }
        return fieldErrors;
      }, []);
    },
    [validationRules]
  );

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    if (!validationRules) {
      return true;
    }

    const newErrors: Errors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((fieldName) => {
      const fieldErrors = validateField(fieldName, values[fieldName]);
      if (fieldErrors.length > 0) {
        newErrors[fieldName] = fieldErrors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validateField, values, validationRules]);

  // Handle input change
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const newValue = type === 'number' ? Number(value) : value;

      setValues((prev) => ({ ...prev, [name]: newValue }));
      setIsDirty(true);

      if (validationRules && validationRules[name]) {
        const fieldErrors = validateField(name, newValue);
        setErrors((prev) => ({ ...prev, [name]: fieldErrors }));
      }
    },
    [validateField, validationRules]
  );

  // Handle input blur
  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (validationRules && validationRules[name]) {
        const fieldErrors = validateField(name, values[name]);
        setErrors((prev) => ({ ...prev, [name]: fieldErrors }));
      }
    },
    [validateField, validationRules, values]
  );

  // Set field value programmatically
  const setFieldValue = useCallback((name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);

    if (validationRules && validationRules[name]) {
      const fieldErrors = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldErrors }));
    }
  }, [validateField, validationRules]);

  // Set field touched programmatically
  const setFieldTouched = useCallback((name: string, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [name]: isTouched }));
  }, []);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, [initialValues]);

  // Calculate if form is valid
  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    resetForm,
    validateForm,
  };
} 