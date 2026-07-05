# Todo_App — Frontend Skill (React.js + Vite)

---

## 1. Cấu Trúc Thư Mục Frontend

```
client/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx                    # Entry point
│   ├── App.jsx                     # Router setup + providers
│   ├── index.css                   # Global CSS + design tokens
│   │
│   ├── api/                        # API layer
│   │   ├── axiosClient.js          # Axios instance (baseURL, interceptors)
│   │   └── todoApi.js              # Todo CRUD endpoints
│   │
│   ├── contexts/                   # React Context (state management)
│   │   ├── TodoContext.jsx         # Todo list state + dispatch
│   │   └── ThemeContext.jsx        # Dark/light mode
│   │
│   ├── hooks/                      # Custom hooks
│   │   ├── useApi.js               # Generic fetch hook (loading, error, data)
│   │   ├── useForm.js              # Form state + validation
│   │   ├── useDebounce.js          # Debounce value
│   │   └── useToast.js             # Toast notification hook
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── common/                 # Shared across pages
│   │   │   ├── Button.jsx
│   │   │   ├── Button.module.css
│   │   │   ├── Input.jsx
│   │   │   ├── Input.module.css
│   │   │   ├── Modal.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── Toast.jsx
│   │   │
│   │   ├── layout/                 # Layout components
│   │   │   ├── Header.jsx
│   │   │   ├── Header.module.css
│   │   │   ├── Footer.jsx
│   │   │   ├── Footer.module.css
│   │   │   └── MainLayout.jsx      # Header + Outlet + Footer
│   │   │
│   │   └── todo/                   # Todo-specific
│   │       ├── TodoCard.jsx
│   │       ├── TodoCard.module.css
│   │       ├── TodoList.jsx
│   │       ├── TodoForm.jsx
│   │       ├── TodoForm.module.css
│   │       ├── FilterBar.jsx
│   │       ├── FilterBar.module.css
│   │       └── StatsBar.jsx
│   │
│   ├── pages/                      # Route-level pages
│   │   ├── HomePage.jsx
│   │   └── NotFoundPage.jsx
│   │
│   └── utils/                      # Pure utility functions
│       ├── formatDate.js           # ISO → "05/07/2026"
│       ├── validators.js           # Required, maxLength checks
│       └── constants.js            # TODO_STATUS, PRIORITY, API_URL
│
├── .env                            # VITE_API_URL=http://localhost:5000/api
├── vite.config.js
└── package.json
```

---

## 2. Patterns Bắt Buộc

### 2.1. Axios Client (Singleton)

```js
// api/axiosClient.js — DUY NHẤT 1 file, mọi API đều import từ đây
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor: unwrap data
axiosClient.interceptors.response.use(
  (res) => res.data, // Unwrap — component nhận data luôn
  (error) => {
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
```

### 2.2. API Module Pattern

```js
// api/todoApi.js — Todo resource, export functions
import axiosClient from './axiosClient';

const todoApi = {
  getAll: (params) => axiosClient.get('/todos', { params }),
  getById: (id) => axiosClient.get(`/todos/${id}`),
  create: (data) => axiosClient.post('/todos', data),
  update: (id, data) => axiosClient.put(`/todos/${id}`, data),
  toggle: (id) => axiosClient.patch(`/todos/${id}/toggle`),
  remove: (id) => axiosClient.delete(`/todos/${id}`),
};

export default todoApi;
```

### 2.3. Custom Hook — useApi

```js
// hooks/useApi.js — Hook duy nhất cho mọi API call
import { useState, useEffect, useCallback } from 'react';

export default function useApi(apiFn, immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  useEffect(() => {
    if (immediate) execute();
  }, [immediate, execute]);

  return { data, loading, error, execute };
}
```

### 2.4. Context Pattern (Todo)

```jsx
// contexts/TodoContext.jsx
import { createContext, useContext, useReducer } from 'react';

const TodoContext = createContext(null);

const initialState = { todos: [], filter: 'all', search: '' };

function todoReducer(state, action) {
  switch (action.type) {
    case 'SET_TODOS':
      return { ...state, todos: action.payload };
    case 'ADD_TODO':
      return { ...state, todos: [action.payload, ...state.todos] };
    case 'UPDATE_TODO': {
      const todos = state.todos.map(t =>
        t._id === action.payload._id ? action.payload : t
      );
      return { ...state, todos };
    }
    case 'DELETE_TODO': {
      const todos = state.todos.filter(t => t._id !== action.payload);
      return { ...state, todos };
    }
    case 'TOGGLE_TODO': {
      const todos = state.todos.map(t =>
        t._id === action.payload._id
          ? { ...t, completed: !t.completed }
          : t
      );
      return { ...state, todos };
    }
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    default:
      return state;
  }
}

export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  return (
    <TodoContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodos phải nằm trong TodoProvider');
  return ctx;
}
```

### 2.5. Component Pattern (TodoCard Example)

```jsx
// components/todo/TodoCard.jsx
import { memo } from 'react';
import { formatDate } from '../../utils/formatDate';
import styles from './TodoCard.module.css';

function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  return (
    <div className={`${styles.card} ${todo.completed ? styles.completed : ''}`}>
      <button
        className={styles.checkbox}
        onClick={() => onToggle(todo._id)}
        aria-label={`Đánh dấu ${todo.completed ? 'chưa hoàn thành' : 'hoàn thành'}`}
      >
        {todo.completed && <span className={styles.checkIcon}>✓</span>}
      </button>

      <div className={styles.content}>
        <h3 className={styles.title}>{todo.title}</h3>
        {todo.description && (
          <p className={styles.description}>{todo.description}</p>
        )}
        <span className={styles.date}>{formatDate(todo.createdAt)}</span>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.editBtn}
          onClick={() => onEdit(todo)}
          aria-label="Sửa công việc"
        >
          ✎
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(todo._id)}
          aria-label="Xóa công việc"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default memo(TodoCard);
```

### 2.6. CSS Module Pattern

```css
/* components/todo/TodoCard.module.css */
.card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.completed {
  opacity: 0.65;
}

.completed .title {
  text-decoration: line-through;
  color: var(--muted);
}

.checkbox {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border: 2px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 180ms ease;
  margin-top: 2px;
}

.checkbox:hover {
  border-color: var(--primary);
}

.completed .checkbox {
  background: var(--success);
  border-color: var(--success);
}

.checkIcon {
  color: var(--on-control);
  font-size: 0.75rem;
  font-weight: 700;
}

.content {
  flex: 1;
  min-width: 0;
}

.title {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  color: var(--fg);
  margin: 0 0 var(--space-1);
}

.description {
  font-size: 0.85rem;
  color: var(--muted);
  margin: 0 0 var(--space-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.date {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--subtle);
}

.actions {
  display: flex;
  gap: var(--space-1);
  opacity: 0;
  transition: opacity 180ms ease;
}

.card:hover .actions {
  opacity: 1;
}

.editBtn,
.deleteBtn {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  transition: background 180ms ease;
}

.editBtn {
  color: var(--muted);
}

.editBtn:hover {
  background: var(--surface-muted);
  color: var(--primary);
}

.deleteBtn {
  color: var(--muted);
}

.deleteBtn:hover {
  background: var(--danger-soft);
  color: var(--danger);
}
```

### 2.7. Page Pattern (Lazy Loading)

```jsx
// App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Loader from './components/common/Loader';
import { TodoProvider } from './contexts/TodoContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Lazy load pages — chỉ tải khi navigate tới
const HomePage = lazy(() => import('./pages/HomePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <TodoProvider>
          <Suspense fallback={<Loader fullScreen />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </TodoProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
```

---

## 3. Quy Tắc CSS

### 3.1. KHÔNG được làm

```
❌ inline style:      style={{ color: 'red' }}
❌ hardcode màu:      color: #5b8a72
❌ global class trùng: .card { }  (dùng CSS Modules tránh)
❌ !important
❌ Nesting quá 3 cấp
❌ px cho font-size (dùng rem)
```

### 3.2. PHẢI làm

```
✅ CSS Modules:       import styles from './X.module.css'
✅ Design tokens:     color: var(--primary)
✅ rem cho font-size:  font-size: 1rem
✅ Responsive:         @media (max-width: 768px) { }
✅ Transition:         transition: <property> 200ms ease
```

---

## 4. Anti-Patterns (TUYỆT ĐỐI TRÁNH)

| ❌ Sai                                     | ✅ Đúng                                          |
| :----------------------------------------- | :----------------------------------------------- |
| `useEffect` fetch mỗi component           | `useApi` hook tập trung                          |
| `useState` + `useState` + `useState`       | `useReducer` khi > 3 state liên quan             |
| Props drilling > 2 cấp                     | Context API                                      |
| `index.js` export tất cả                   | Import trực tiếp file component                  |
| Copy TodoCard → TodoCardSmall              | Thêm prop `variant="compact"` cho cùng component |
| `console.log` trong production             | Xóa trước commit hoặc dùng build strip           |
| Fetch trong `onClick` không có loading     | Set loading state + disable button               |
