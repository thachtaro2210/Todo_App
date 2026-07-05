# Todo_App — Backend Skill (Node.js + Express)

---

## 1. Cấu Trúc Thư Mục Backend

```
server/
├── src/
│   ├── app.js                      # Express app setup (middleware, routes)
│   ├── server.js                   # Entry: connect DB + listen port
│   │
│   ├── config/
│   │   ├── db.js                   # Mongoose connection
│   │   └── env.js                  # Process.env validation + defaults
│   │
│   ├── models/                     # Mongoose schemas
│   │   └── Todo.js
│   │
│   ├── controllers/                # Nhận req → gọi service → trả res
│   │   └── todoController.js
│   │
│   ├── services/                   # Business logic thuần
│   │   └── todoService.js
│   │
│   ├── routes/                     # Route declarations
│   │   ├── index.js                # Mount tất cả routes
│   │   └── todoRoutes.js
│   │
│   ├── middlewares/
│   │   ├── validateMiddleware.js   # Request body validation
│   │   └── errorMiddleware.js      # Global error handler
│   │
│   └── utils/
│       ├── AppError.js             # Custom error class
│       ├── asyncHandler.js         # Wrap async controller
│       ├── sendResponse.js         # Unified response format
│       └── queryBuilder.js         # Filter/sort/paginate helper
│
├── .env                            # PORT, MONGO_URI
├── .env.example
└── package.json
```

---

## 2. Patterns Bắt Buộc

### 2.1. Entry Point

```js
// src/server.js — Khởi động server, KHÔNG chứa logic
import { connectDB } from './config/db.js';
import app from './app.js';
import { env } from './config/env.js';

const start = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

start();
```

```js
// src/app.js — Setup middleware + mount routes
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import routes from './routes/index.js';

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api', routes);

// Error handling — LUÔN đặt cuối cùng
app.use(notFound);
app.use(errorHandler);

export default app;
```

### 2.2. AppError + asyncHandler (Chống try-catch lặp)

```js
// utils/AppError.js
export default class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
```

```js
// utils/asyncHandler.js — Wrapper duy nhất, dùng cho MỌI controller
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
```

```js
// utils/sendResponse.js — Format response thống nhất
const sendResponse = (res, statusCode, data, message = 'Success') => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export default sendResponse;
```

### 2.3. Controller Pattern

```js
// controllers/todoController.js
import asyncHandler from '../utils/asyncHandler.js';
import sendResponse from '../utils/sendResponse.js';
import * as todoService from '../services/todoService.js';

// GET /api/todos
export const getTodos = asyncHandler(async (req, res) => {
  const result = await todoService.getTodos(req.query);
  sendResponse(res, 200, result);
});

// GET /api/todos/:id
export const getTodo = asyncHandler(async (req, res) => {
  const todo = await todoService.getTodoById(req.params.id);
  sendResponse(res, 200, todo);
});

// POST /api/todos
export const createTodo = asyncHandler(async (req, res) => {
  const todo = await todoService.createTodo(req.body);
  sendResponse(res, 201, todo, 'Tạo công việc thành công');
});

// PUT /api/todos/:id
export const updateTodo = asyncHandler(async (req, res) => {
  const todo = await todoService.updateTodo(req.params.id, req.body);
  sendResponse(res, 200, todo, 'Cập nhật thành công');
});

// PATCH /api/todos/:id/toggle
export const toggleTodo = asyncHandler(async (req, res) => {
  const todo = await todoService.toggleTodo(req.params.id);
  sendResponse(res, 200, todo, 'Cập nhật trạng thái thành công');
});

// DELETE /api/todos/:id
export const deleteTodo = asyncHandler(async (req, res) => {
  await todoService.deleteTodo(req.params.id);
  sendResponse(res, 200, null, 'Xóa thành công');
});
```

### 2.4. Service Pattern

```js
// services/todoService.js
import Todo from '../models/Todo.js';
import AppError from '../utils/AppError.js';
import { buildQuery } from '../utils/queryBuilder.js';

export const getTodos = async (queryParams) => {
  const { filter, sort, skip, limit } = buildQuery(queryParams);

  const [todos, total] = await Promise.all([
    Todo.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Todo.countDocuments(filter),
  ]);

  return {
    todos,
    pagination: {
      total,
      page: Math.floor(skip / limit) + 1,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getTodoById = async (id) => {
  const todo = await Todo.findById(id).lean();
  if (!todo) throw new AppError('Không tìm thấy công việc', 404);
  return todo;
};

export const createTodo = async (data) => {
  return Todo.create(data);
};

export const updateTodo = async (id, data) => {
  const todo = await Todo.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!todo) throw new AppError('Không tìm thấy công việc', 404);
  return todo;
};

export const toggleTodo = async (id) => {
  const todo = await Todo.findById(id);
  if (!todo) throw new AppError('Không tìm thấy công việc', 404);
  todo.completed = !todo.completed;
  await todo.save();
  return todo;
};

export const deleteTodo = async (id) => {
  const todo = await Todo.findByIdAndDelete(id);
  if (!todo) throw new AppError('Không tìm thấy công việc', 404);
};
```

### 2.5. Query Builder (Filter + Sort + Paginate)

```js
// utils/queryBuilder.js — Xử lý query params cho MỌI list API
export const buildQuery = (params) => {
  const {
    page = 1,
    limit = 10,
    sort: sortParam = '-createdAt',
    search,
    completed,
    priority,
    ...rest
  } = params;

  const filter = {};

  // Text search
  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  // Status filter
  if (completed !== undefined && completed !== 'all') {
    filter.completed = completed === 'true';
  }

  // Priority filter
  if (priority) {
    filter.priority = priority;
  }

  // Sort: "-createdAt" → { createdAt: -1 }, "title" → { title: 1 }
  const sort = {};
  const sortFields = sortParam.split(',');
  sortFields.forEach((field) => {
    if (field.startsWith('-')) {
      sort[field.slice(1)] = -1;
    } else {
      sort[field] = 1;
    }
  });

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));

  return {
    filter,
    sort,
    skip: (pageNum - 1) * limitNum,
    limit: limitNum,
  };
};
```

### 2.6. Route Pattern

```js
// routes/todoRoutes.js — Chỉ khai báo, KHÔNG có logic
import { Router } from 'express';
import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
} from '../controllers/todoController.js';

const router = Router();

router.route('/')
  .get(getTodos)
  .post(createTodo);

router.route('/:id')
  .get(getTodo)
  .put(updateTodo)
  .delete(deleteTodo);

router.patch('/:id/toggle', toggleTodo);

export default router;
```

```js
// routes/index.js — Mount tất cả
import { Router } from 'express';
import todoRoutes from './todoRoutes.js';

const router = Router();

router.use('/todos', todoRoutes);

export default router;
```

### 2.7. Error Middleware (Global)

```js
// middlewares/errorMiddleware.js
export const notFound = (req, res, next) => {
  const error = new Error(`Không tìm thấy: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Lỗi máy chủ';

  // Log chi tiết cho dev
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

## 3. Quy Tắc API Design

### 3.1. RESTful Endpoints

| Method | Path                    | Mô tả                       |
| :----- | :---------------------- | :--------------------------- |
| GET    | /api/todos              | List + filter + search + page |
| GET    | /api/todos/:id          | Chi tiết công việc            |
| POST   | /api/todos              | Tạo công việc mới             |
| PUT    | /api/todos/:id          | Cập nhật công việc            |
| PATCH  | /api/todos/:id/toggle   | Toggle hoàn thành             |
| DELETE | /api/todos/:id          | Xóa công việc                 |

### 3.2. Response Format Chuẩn

```json
// Thành công
{
  "success": true,
  "message": "Success",
  "data": { ... }
}

// Lỗi
{
  "success": false,
  "message": "Không tìm thấy công việc"
}

// List có pagination
{
  "success": true,
  "message": "Success",
  "data": {
    "todos": [...],
    "pagination": {
      "total": 25,
      "page": 1,
      "pages": 3
    }
  }
}
```

---

## 4. Anti-Patterns (TUYỆT ĐỐI TRÁNH)

| ❌ Sai                                     | ✅ Đúng                                    |
| :----------------------------------------- | :----------------------------------------- |
| try-catch trong mỗi controller             | `asyncHandler` wrapper                     |
| Logic trong route file                     | Logic trong service, route chỉ khai báo    |
| `res.json()` format khác nhau mỗi nơi     | `sendResponse` helper                      |
| `Todo.find({})` trả tất cả                 | `Todo.find({}).lean()` + pagination         |
| Hardcode port/URI trong code               | `process.env` + config/env.js              |
| Validate bằng if/else dài dòng            | Middleware `validateMiddleware` + schema    |
| `console.log(error)` rồi nuốt lỗi        | `throw new AppError(msg, code)` → propagate|
| Mount route trực tiếp trong app.js         | Tách `routes/index.js` mount tập trung     |
