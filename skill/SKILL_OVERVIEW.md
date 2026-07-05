# Todo_App — Skill Overview

Tài liệu gốc định nghĩa kiến trúc, quy tắc code và chuẩn chất lượng cho toàn bộ dự án Todo App.

---

## 1. Tổng Quan Dự Án

**Todo_App** là ứng dụng quản lý công việc (Todo List) cho phép người dùng tạo, sửa, xóa, đánh dấu hoàn thành và tìm kiếm/lọc công việc.

### Tech Stack

| Layer      | Công nghệ                  | Ghi chú                          |
| :--------- | :-------------------------- | :------------------------------- |
| Frontend   | React 18 + Vite             | SPA, CSS Modules, React Router 6 |
| Backend    | Node.js + Express 4         | REST API, MVC pattern            |
| Database   | MongoDB + Mongoose 8        | Atlas hoặc local                 |
| State (FE) | React Context + useReducer  | Không Redux — giữ đơn giản       |

### Cấu Trúc Monorepo

```
Todo_App/
├── client/          # React Frontend (Vite)
├── server/          # Node.js Backend (Express)
├── shared/          # Constants, enums dùng chung
├── design/          # Tài liệu thiết kế
└── skill/           # Tài liệu skill (file này)
```

---

## 2. Nguyên Tắc Vàng (Golden Rules)

### 2.1. Giới Hạn Kích Thước File

| Loại file                | Tối đa  |
| :----------------------- | :------ |
| React Component (.jsx)   | 300 LOC |
| CSS Module (.module.css) | 200 LOC |
| API Route / Controller   | 250 LOC |
| Mongoose Model           | 150 LOC |
| Utility / Helper         | 200 LOC |
| **Mọi file**             | **≤ 500 LOC** |

> Nếu file > 300 LOC → tách component con hoặc custom hook.
> Nếu controller > 250 LOC → tách service layer.

### 2.2. Clean Code React.js

```
Ưu tiên: Functional Component + Hooks
├── Không dùng class component
├── Không dùng any — luôn đặt propTypes hoặc JSDoc
├── Không inline style — dùng CSS Modules
├── Không nested ternary — dùng early return hoặc biến phụ
├── Không copy-paste — extract thành component/hook/util
├── Mỗi component 1 trách nhiệm (SRP)
└── Tên file = PascalCase (component), camelCase (hook/util)
```

### 2.3. Clean Code Node.js

```
Pattern: Controller → Service → Model
├── Controller: nhận req/res, validate input, gọi service, trả response
├── Service: chứa business logic, gọi model, throw AppError
├── Model: schema Mongoose + static/instance methods
├── Không try-catch lặp — dùng asyncHandler wrapper
├── Không hardcode — dùng config/env
├── Không logic trong route file — chỉ khai báo path + middleware + controller
└── Tên file = camelCase (controller/service), PascalCase (Model)
```

### 2.4. Chống Lặp Code (DRY)

| Tình huống              | Giải pháp                           |
| :---------------------- | :---------------------------------- |
| Fetch API lặp           | `useApi` custom hook                |
| Form validation lặp     | `useForm` custom hook               |
| Error handling lặp (BE) | `asyncHandler` + global error middleware |
| Response format lặp     | `sendResponse` helper               |
| Toast/notification lặp  | `useToast` hook + ToastProvider     |

### 2.5. Tối Ưu Hiệu Suất (Anti-Lag)

**Frontend:**
- `React.lazy` + `Suspense` cho route-level code splitting
- `React.memo` chỉ khi component nhận props phức tạp và re-render nhiều
- `useMemo` / `useCallback` chỉ khi cần thiết — không spam
- Debounce search input (300ms)
- Không fetch trong loop — batch request
- Pagination cho danh sách dài

**Backend:**
- Index MongoDB cho các field query thường xuyên: `completed`, `priority`, `createdAt`
- `select()` chỉ field cần thiết — không `find({})` trả toàn bộ document
- Pagination bắt buộc cho list API (default: 10 items/page)
- `lean()` cho read-only query
- Gzip response bằng `compression` middleware

---

## 3. Quy Ước Đặt Tên

### Frontend

| Loại               | Pattern           | Ví dụ                      |
| :----------------- | :---------------- | :-------------------------- |
| Component          | PascalCase        | `TodoCard.jsx`              |
| CSS Module         | PascalCase.module | `TodoCard.module.css`       |
| Custom Hook        | camelCase (use*)  | `useTodos.js`               |
| Context            | PascalCase        | `TodoContext.jsx`           |
| Utility            | camelCase         | `formatDate.js`             |
| Constant           | UPPER_SNAKE_CASE  | `TODO_STATUS.js`            |
| Page (route-level) | PascalCase        | `HomePage.jsx`              |

### Backend

| Loại          | Pattern           | Ví dụ                        |
| :------------ | :---------------- | :--------------------------- |
| Model         | PascalCase        | `Todo.js`                    |
| Controller    | camelCase         | `todoController.js`          |
| Service       | camelCase         | `todoService.js`             |
| Route         | camelCase         | `todoRoutes.js`              |
| Middleware    | camelCase         | `validateMiddleware.js`      |
| Config        | camelCase         | `dbConfig.js`                |

---

## 4. Design System Áp Dụng

Dự án áp dụng design tokens từ `design/DESIGN.md` với phong cách Gentle Sage:

- **Bảng màu**: Hệ Gentle Sage (xanh sage, trắng ngà, forest dark)
- **Font**: Plus Jakarta Sans (heading) + Inter (body)
- **Spacing**: Dùng CSS custom properties `--space-*`
- **Border radius**: Dùng `--radius-*` tokens
- **Shadow**: Dùng `--shadow-*` tokens
- **Dark mode**: Class `.dark-mode` toggle trên `<body>`

---

## 5. Tham Chiếu Skill Files

| File                        | Nội dung                                      |
| :-------------------------- | :-------------------------------------------- |
| `SKILL_FRONTEND.md`         | Cấu trúc FE, component patterns, hooks, CSS   |
| `SKILL_BACKEND.md`          | Cấu trúc BE, API patterns, middleware, models  |
| `SKILL_DATABASE.md`         | MongoDB schemas, indexes, query patterns       |
| `SKILL_VALIDATION.md`       | Validation rules, error handling, xử lý dữ liệu không hợp lệ |
| `SKILL_README.md`           | Template README, hướng dẫn viết README chuẩn   |
| `SKILL_OVERVIEW.md`         | File này — tổng quan kiến trúc + golden rules  |
