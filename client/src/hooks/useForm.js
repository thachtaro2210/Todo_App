import { useState, useCallback } from 'react';

export default function useForm(initialValues, validateFn) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleBlur = useCallback(
    (field) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      if (validateFn) {
        const allErrors = validateFn(values);
        setErrors((prev) => ({ ...prev, [field]: allErrors[field] }));
      }
    },
    [values, validateFn]
  );

  const validate = useCallback(() => {
    if (!validateFn) return true;
    const newErrors = validateFn(values);
    setErrors(newErrors);
    const allTouched = {};
    Object.keys(values).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    return Object.keys(newErrors).length === 0;
  }, [values, validateFn]);

  const reset = useCallback(
    (newValues) => {
      setValues(newValues || initialValues);
      setErrors({});
      setTouched({});
    },
    [initialValues]
  );

  return { values, errors, touched, handleChange, handleBlur, validate, reset, setValues };
}
