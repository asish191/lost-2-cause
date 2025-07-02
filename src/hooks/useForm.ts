import { useState, useCallback } from 'react';

interface FormState<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
}

export function useForm<T extends Record<string, any>>(
  initialValues: T
): {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  handleChange: (name: keyof T, value: any) => void;
  handleBlur: (name: keyof T) => void;
  reset: () => void;
} {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({} as Record<keyof T, string>);
    setTouched({} as Record<keyof T, boolean>);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    reset,
  };
}
