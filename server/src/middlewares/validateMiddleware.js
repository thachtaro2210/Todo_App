import AppError from '../utils/AppError.js';

/**
 * Validate request body against a simple schema.
 * @param {Object} schema - { fieldName: { required, type, min, max, enum, label } }
 */
export const validate = (schema) => (req, res, next) => {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = req.body[field];

    // Required check
    if (rules.required) {
      if (value === undefined || value === null || (typeof value === 'string' && !value.trim())) {
        errors.push(`${rules.label || field} không được để trống`);
        continue;
      }
    }

    // Skip if no value and not required
    if (value === undefined || value === null || value === '') continue;

    // Type check
    if (rules.type === 'string' && typeof value !== 'string') {
      errors.push(`${rules.label || field} phải là chuỗi`);
      continue;
    }

    // String length
    if (typeof value === 'string') {
      if (rules.min && value.trim().length < rules.min) {
        errors.push(`${rules.label || field} tối thiểu ${rules.min} ký tự`);
      }
      if (rules.max && value.trim().length > rules.max) {
        errors.push(`${rules.label || field} tối đa ${rules.max} ký tự`);
      }
    }

    // Enum check
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`${rules.label || field} phải là một trong: ${rules.enum.join(', ')}`);
    }

    // Date check
    if (rules.type === 'date') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        errors.push(`${rules.label || field} không phải là ngày hợp lệ`);
      } else if (req.method === 'POST') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) {
          errors.push(`${rules.label || field} phải từ ngày hôm nay trở đi`);
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new AppError(errors.join('. '), 400);
  }

  next();
};

// Schema for Todo validation
export const todoSchema = {
  title: {
    label: 'Tiêu đề',
    required: true,
    type: 'string',
    min: 1,
    max: 200,
  },
  description: {
    label: 'Mô tả',
    required: false,
    type: 'string',
    max: 1000,
  },
  priority: {
    label: 'Mức ưu tiên',
    required: false,
    enum: ['low', 'medium', 'high'],
  },
  dueDate: {
    label: 'Ngày hạn',
    required: false,
    type: 'date',
  },
};
