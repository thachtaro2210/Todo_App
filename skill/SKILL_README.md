# Todo_App — README Template Skill

Tài liệu hướng dẫn nội dung và cấu trúc file README.md cho dự án.

---

## 1. Template README.md

Khi tạo file `README.md` ở thư mục gốc dự án, sử dụng template sau:

````markdown
# ✅ Todo App — Quản lý công việc

Ứng dụng quản lý công việc (Todo List) được xây dựng với React.js + Node.js + MongoDB.

## 📋 Tính năng

- ✅ Hiển thị danh sách công việc
- ✅ Thêm công việc mới
- ✅ Chỉnh sửa công việc
- ✅ Xóa công việc
- ✅ Đánh dấu hoàn thành / chưa hoàn thành
- ✅ Tìm kiếm theo tiêu đề
- ✅ Lọc theo trạng thái (Tất cả / Đang làm / Hoàn thành)
- ✅ Phân trang
- ✅ Sắp xếp (Mới nhất / Cũ nhất)
- ✅ Responsive trên mọi thiết bị
- ✅ Dark mode / Light mode
- ✅ Xử lý validation dữ liệu

## 🛠 Công nghệ sử dụng

| Layer      | Công nghệ              |
| :--------- | :---------------------- |
| Frontend   | React 18 + Vite         |
| Backend    | Node.js + Express 4     |
| Database   | MongoDB + Mongoose 8    |
| Styling    | CSS Modules + CSS Variables |

## 📁 Cấu trúc dự án

```
Todo_App/
├── client/              # React Frontend
│   ├── src/
│   │   ├── api/         # API layer (axios)
│   │   ├── components/  # UI components
│   │   ├── contexts/    # State management
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Route pages
│   │   └── utils/       # Utilities
│   └── ...
├── server/              # Node.js Backend
│   ├── src/
│   │   ├── config/      # DB & env config
│   │   ├── controllers/ # Request handlers
│   │   ├── middlewares/  # Validation, error handling
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── utils/       # Helpers
│   └── ...
└── README.md
```

## 🚀 Hướng dẫn cài đặt và chạy

### Yêu cầu hệ thống

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MongoDB** (local hoặc [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone dự án

```bash
git clone https://github.com/<your-username>/todo-app.git
cd todo-app
```

### 2. Cài đặt Backend

```bash
cd server
npm install
```

Tạo file `.env` trong thư mục `server/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/todo_app
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> 💡 Nếu dùng MongoDB Atlas, thay `MONGO_URI` bằng connection string từ Atlas.

### 3. Cài đặt Frontend

```bash
cd ../client
npm install
```

Tạo file `.env` trong thư mục `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Chạy dự án

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Truy cập ứng dụng tại: **http://localhost:5173**

## 📡 API Endpoints

| Method   | Endpoint               | Mô tả                        |
| :------- | :--------------------- | :---------------------------- |
| `GET`    | `/api/todos`           | Lấy danh sách (filter, search, paginate) |
| `GET`    | `/api/todos/:id`       | Lấy chi tiết 1 công việc     |
| `POST`   | `/api/todos`           | Tạo công việc mới             |
| `PUT`    | `/api/todos/:id`       | Cập nhật công việc            |
| `PATCH`  | `/api/todos/:id/toggle`| Toggle trạng thái hoàn thành  |
| `DELETE` | `/api/todos/:id`       | Xóa công việc                 |

### Query Parameters (GET /api/todos)

| Param       | Mô tả                              | Ví dụ               |
| :---------- | :---------------------------------- | :------------------- |
| `search`    | Tìm theo tiêu đề                   | `?search=react`      |
| `completed` | Lọc theo trạng thái                 | `?completed=true`    |
| `priority`  | Lọc theo mức ưu tiên               | `?priority=high`     |
| `sort`      | Sắp xếp                            | `?sort=-createdAt`   |
| `page`      | Trang hiện tại                      | `?page=2`            |
| `limit`     | Số item mỗi trang (mặc định: 10)   | `?limit=20`          |

## 🧪 Chạy Test (nếu có)

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 🐳 Docker (nếu có)

```bash
docker-compose up --build
```

## 📝 Ghi chú

- Ứng dụng sử dụng **CSS Variables** cho design tokens, hỗ trợ chuyển đổi Light/Dark mode.
- Validation được thực hiện ở cả 2 lớp: Frontend (trước khi gửi) và Backend (middleware + Mongoose schema).
- Code được tổ chức theo pattern **Controller → Service → Model** ở Backend và **Component → Context → API** ở Frontend.
````

---

## 2. Quy Tắc Khi Viết README

### PHẢI có
- [ ] Mô tả ngắn gọn dự án là gì
- [ ] Liệt kê tính năng chính
- [ ] Hướng dẫn cài đặt từng bước (copy-paste được)
- [ ] Yêu cầu hệ thống (Node version, MongoDB)
- [ ] Cách tạo file `.env` với các biến cần thiết
- [ ] Cách chạy cả Frontend + Backend
- [ ] Bảng API endpoints

### NÊN có
- [ ] Ảnh screenshot / GIF demo
- [ ] Cấu trúc thư mục
- [ ] Ghi chú kiến trúc / design decisions
- [ ] Hướng dẫn chạy test
- [ ] Docker setup (nếu có)

### KHÔNG nên
- [ ] Viết quá dài dòng — README nên đọc xong trong 2-3 phút
- [ ] Copy-paste docs framework (Vite, Express) — chỉ viết cái liên quan
- [ ] Để link/badge không hoạt động
