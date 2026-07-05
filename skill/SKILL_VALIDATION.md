# Todo_App — Validation & Error Handling Skill

Tài liệu quy định chi tiết cách xử lý dữ liệu không hợp lệ ở cả Frontend và Backend.

---

## 1. Nguyên Tắc Chung

```
Validate 2 lớp:
├── Lớp 1 (Frontend): Validate ngay khi user nhập → UX tốt, phản hồi nhanh
├── Lớp 2 (Backend): Validate lại tại server → Bảo mật, đảm bảo dữ liệu đúng
└── Không bao giờ tin dữ liệu từ client — luôn validate lại ở server
```

---

## 2. Validation Rules Cho Todo

### 2.1. Bảng Quy Tắc

| Field         | Bắt buộc | Kiểu     | Min  | Max       | Mặc định   | Ghi chú                          |
| :------------ | :------- | :------- | :--- | :-------- | :--------- | :------------------------------- |
| `title`       | ✅ Có    | String   | 1    | 200 ký tự | —          | Trim khoảng trắng đầu/cuối      |
| `description` | ❌ Không | String   | —    | 1000 ký tự| `''`       | Trim khoảng trắng                |
| `completed`   | ❌ Không | Boolean  | —    | —         | `false`    | Chỉ nhận true/false              |
| `priority`    | ❌ Không | Enum     | —    | —         | `'medium'` | Chỉ nhận: low, medium, high     |
| `dueDate`     | ❌ Không | Date     | —    | —         | `null`     | Phải >= ngày hiện tại khi tạo mới |

### 2.2. Các Trường Hợp Không Hợp Lệ Cần Xử Lý

| # | Trường hợp                              | Xử lý                                   |
| - | :-------------------------------------- | :--------------------------------------- |
| 1 | Title để trống hoặc chỉ có khoảng trắng | Hiển thị lỗi "Tiêu đề không được để trống" |
| 2 | Title vượt quá 200 ký tự               | Hiển thị lỗi "Tiêu đề tối đa 200 ký tự" |
| 3 | Description vượt quá 1000 ký tự        | Hiển thị lỗi "Mô tả tối đa 1000 ký tự"  |
| 4 | Priority không thuộc enum              | Backend trả 400, FE không cho chọn ngoài enum |
| 5 | DueDate là ngày trong quá khứ (khi tạo) | Hiển thị lỗi "Ngày hạn phải từ hôm nay trở đi" |
| 6 | ID không tồn tại (GET/PUT/DELETE)      | Backend trả 404 "Không tìm thấy công việc" |
| 7 | ID sai format (không phải ObjectId)    | Backend trả 400 "ID không hợp lệ"       |
| 8 | Request body rỗng khi POST             | Backend trả 400 "Thiếu dữ liệu"         |
| 9 | Field lạ không thuộc schema            | Backend bỏ qua (Mongoose chỉ lấy field trong schema) |

---

## 3. Frontend Validation

### 3.1. Validators Utility

```js
// utils/validators.js — Các hàm validate thuần, không phụ thuộc UI

export const validateTodo = (values) => {
  const errors = {};

  // Title — bắt buộc
  if (!values.title || !values.title.trim()) {
    errors.title = 'Tiêu đề không được để trống';
  } else if (values.title.trim().length > 200) {
    errors.title = 'Tiêu đề tối đa 200 ký tự';
  }

  // Description — tùy chọn nhưng giới hạn
  if (values.description && values.description.length > 1000) {
    errors.description = 'Mô tả tối đa 1000 ký tự';
  }

  // Priority — phải thuộc enum
  const validPriorities = ['low', 'medium', 'high'];
  if (values.priority && !validPriorities.includes(values.priority)) {
    errors.priority = 'Mức ưu tiên không hợp lệ';
  }

  // DueDate — nếu có, phải >= hôm nay (chỉ khi tạo mới)
  if (values.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(values.dueDate);
    if (due < today && !values._id) {
      errors.dueDate = 'Ngày hạn phải từ hôm nay trở đi';
    }
  }

  return errors;
};

export const hasErrors = (errors) => Object.keys(errors).length > 0;
```

### 3.2. useForm Hook (Tích hợp Validation)

```js
// hooks/useForm.js
import { useState, useCallback } from 'react';

export default function useForm(initialValues, validateFn) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Xóa lỗi khi user bắt đầu sửa
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    // Validate field khi blur
    if (validateFn) {
      const allErrors = validateFn(values);
      setErrors(prev => ({ ...prev, [field]: allErrors[field] }));
    }
  }, [values, validateFn]);

  const validate = useCallback(() => {
    if (!validateFn) return true;
    const newErrors = validateFn(values);
    setErrors(newErrors);
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(values).forEach(key => { allTouched[key] = true; });
    setTouched(allTouched);
    return Object.keys(newErrors).length === 0;
  }, [values, validateFn]);

  const reset = useCallback((newValues) => {
    setValues(newValues || initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setValues,
  };
}
```

### 3.3. Hiển Thị Lỗi Trong Component

```jsx
// Cách dùng trong TodoForm.jsx
<div className={styles.field}>
  <label htmlFor="todo-title" className={styles.label}>
    Tiêu đề <span className={styles.required}>*</span>
  </label>
  <input
    id="todo-title"
    type="text"
    value={values.title}
    onChange={(e) => handleChange('title', e.target.value)}
    onBlur={() => handleBlur('title')}
    className={`${styles.input} ${touched.title && errors.title ? styles.inputError : ''}`}
    placeholder="Nhập tiêu đề công việc..."
    maxLength={200}
  />
  {touched.title && errors.title && (
    <span className={styles.errorText}>{errors.title}</span>
  )}
</div>
```

### 3.4. CSS Cho Trạng Thái Lỗi

```css
/* Quy tắc CSS cho validation states */

/* Input bình thường */
.input {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);
  transition: border-color 180ms ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-soft);
}

/* Input lỗi */
.inputError {
  border-color: var(--danger);
}

.inputError:focus {
  box-shadow: 0 0 0 3px var(--danger-soft);
}

/* Text lỗi */
.errorText {
  color: var(--danger);
  font-size: 0.8rem;
  margin-top: var(--space-1);
  display: block;
}

/* Dấu * bắt buộc */
.required {
  color: var(--danger);
}
```

---

## 4. Backend Validation

### 4.1. Validate Middleware

```js
// middlewares/validateMiddleware.js
import AppError from '../utils/AppError.js';

/**
 * Middleware validate request body theo schema đơn giản
 * @param {Object} schema - { fieldName: { required, type, min, max, enum, ... } }
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

    // Nếu không có value và không required → bỏ qua
    if (value === undefined || value === null) continue;

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
  }

  if (errors.length > 0) {
    throw new AppError(errors.join('. '), 400);
  }

  next();
};

// Schema cho Todo
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
};
```

### 4.2. Sử Dụng Trong Route

```js
// routes/todoRoutes.js
import { validate, todoSchema } from '../middlewares/validateMiddleware.js';

router.route('/')
  .get(getTodos)
  .post(validate(todoSchema), createTodo);   // ← validate trước controller

router.route('/:id')
  .get(getTodo)
  .put(validate(todoSchema), updateTodo)     // ← validate trước controller
  .delete(deleteTodo);
```

### 4.3. Xử Lý ObjectId Không Hợp Lệ

```js
// middlewares/errorMiddleware.js — Bổ sung xử lý Mongoose errors
export const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.isOperational ? err.message : 'Lỗi máy chủ';

  // Mongoose CastError — ID không hợp lệ
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'ID không hợp lệ';
  }

  // Mongoose ValidationError — Schema validation fail
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join('. ');
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error('ERROR:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
```

---

## 5. Error Response Format

### 5.1. Các HTTP Status Code Sử Dụng

| Code | Ý nghĩa              | Khi nào dùng                         |
| :--- | :-------------------- | :----------------------------------- |
| 200  | OK                    | GET, PUT, PATCH, DELETE thành công   |
| 201  | Created               | POST tạo mới thành công             |
| 400  | Bad Request           | Validation fail, dữ liệu không hợp lệ |
| 404  | Not Found             | ID không tồn tại, route không tồn tại |
| 500  | Internal Server Error | Lỗi server không lường trước        |

### 5.2. Format Response Lỗi

```json
// Validation error
{
  "success": false,
  "message": "Tiêu đề không được để trống"
}

// Not found
{
  "success": false,
  "message": "Không tìm thấy công việc"
}

// Invalid ID
{
  "success": false,
  "message": "ID không hợp lệ"
}

// Multiple validation errors
{
  "success": false,
  "message": "Tiêu đề không được để trống. Mức ưu tiên phải là một trong: low, medium, high"
}
```

---

## 6. Checklist Validation (Tham Chiếu Nhanh)

### Frontend
- [ ] Validate title không trống trước khi submit
- [ ] Hiển thị character count cho title (x/200)
- [ ] Hiển thị lỗi dưới input khi blur hoặc submit
- [ ] Disable nút submit khi đang loading
- [ ] Hiển thị toast khi thao tác thành công / thất bại
- [ ] Xử lý lỗi API (network error, server error)

### Backend
- [ ] Validate request body qua middleware trước controller
- [ ] Mongoose schema validation (required, enum, max, min)
- [ ] Xử lý CastError cho ObjectId không hợp lệ
- [ ] Xử lý ValidationError từ Mongoose
- [ ] Global error handler bắt mọi lỗi không lường trước
- [ ] Không leak stack trace ở production
