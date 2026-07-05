# Todo_App — Database Skill (MongoDB + Mongoose)

---

## 1. Schema Definitions

### 1.1. Todo

```js
// models/Todo.js
import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề không được để trống'],
      trim: true,
      maxlength: [200, 'Tiêu đề tối đa 200 ký tự'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Mô tả tối đa 1000 ký tự'],
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes cho query thường dùng
todoSchema.index({ completed: 1, createdAt: -1 });
todoSchema.index({ priority: 1 });
todoSchema.index({ title: 'text' });
todoSchema.index({ dueDate: 1 });

export default mongoose.model('Todo', todoSchema);
```

---

## 2. Database Connection

```js
// config/db.js
import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};
```

```js
// config/env.js — Validate env vars ngay khi khởi động
import dotenv from 'dotenv';
dotenv.config();

const required = ['MONGO_URI'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
```

---

## 3. Quy Tắc Query MongoDB

### 3.1. PHẢI làm

```
✅ .lean()         → cho read-only query (nhanh hơn 5-10x)
✅ .select()       → chỉ field cần thiết
✅ Pagination      → skip + limit, KHÔNG .find({}) toàn bộ
✅ Index           → cho mọi field trong filter/sort thường dùng
✅ Compound index  → { completed: 1, createdAt: -1 } cho filter kết hợp
✅ Text index      → { title: 'text' } cho search
```

### 3.2. KHÔNG được làm

```
❌ Todo.find({})             → thiếu limit, trả hết DB
❌ Todo.find().sort()        → sort field chưa có index
❌ N+1 query                 → loop forEach rồi await find bên trong
❌ Schema không validation   → luôn required + min + max + enum
```

### 3.3. Index Strategy

| Collection | Field(s)                          | Type     | Mục đích                      |
| :--------- | :-------------------------------- | :------- | :---------------------------- |
| todos      | `{ completed: 1, createdAt: -1 }` | Compound | Filter theo trạng thái + mới nhất |
| todos      | `{ priority: 1 }`                | Single   | Filter theo mức ưu tiên       |
| todos      | `{ title: 'text' }`              | Text     | Search tiêu đề công việc      |
| todos      | `{ dueDate: 1 }`                 | Single   | Lọc/sắp xếp theo ngày hạn    |

---

## 4. Seed Data Structure

```js
// Dữ liệu mẫu
const todos = [
  {
    title: 'Hoàn thành bài test intern',
    description: 'Xây dựng ứng dụng Todo List với đầy đủ CRUD',
    completed: false,
    priority: 'high',
    dueDate: new Date('2026-07-07'),
  },
  {
    title: 'Đọc tài liệu React Hooks',
    description: 'Tìm hiểu useReducer, useContext, useMemo',
    completed: true,
    priority: 'medium',
    dueDate: null,
  },
  {
    title: 'Setup MongoDB Atlas',
    description: 'Tạo cluster free tier trên MongoDB Atlas',
    completed: true,
    priority: 'high',
    dueDate: new Date('2026-07-05'),
  },
  {
    title: 'Viết README hướng dẫn',
    description: '',
    completed: false,
    priority: 'medium',
    dueDate: new Date('2026-07-07'),
  },
  {
    title: 'Review code lần cuối',
    description: 'Kiểm tra code quality, xóa console.log',
    completed: false,
    priority: 'low',
    dueDate: null,
  },
];

// Priority enum
const priorities = [
  'low',       // Thấp
  'medium',    // Trung bình
  'high',      // Cao
];
```
