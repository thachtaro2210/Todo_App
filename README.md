# Todo App - Quản lý công việc

Ứng dụng quản lý công việc (Todo List) được xây dựng với React.js + Node.js + MongoDB.

**🔗 Demo Link (Live):** [https://todo-app-phi-rosy-97.vercel.app](https://todo-app-phi-rosy-97.vercel.app)

## Tính năng

- Hiển thị danh sách công việc
- Thêm công việc mới
- Chỉnh sửa công việc
- Xóa công việc
- Đánh dấu hoàn thành / chưa hoàn thành
- Tìm kiếm theo tiêu đề
- Lọc theo trạng thái (Tất cả / Đang làm / Hoàn thành)
- Phân trang dữ liệu
- Sắp xếp (Mới nhất / Cũ nhất / Ưu tiên)
- Responsive trên mọi thiết bị
- Chế độ sáng / tối (Dark mode / Light mode)
- Xử lý kiểm tra tính hợp lệ dữ liệu (Validation)

## Công nghệ sử dụng

| Tầng / Thành phần | Công nghệ sử dụng |
| :---------------- | :---------------- |
| Frontend          | React 18 + Vite   |
| Backend           | Node.js + Express 4 |
| Database          | MongoDB + Mongoose 8 |
| Styling           | CSS Modules + CSS Variables |

## Cấu trúc dự án

```
Todo_App/
├── client/              # React Frontend
│   ├── src/
│   │   ├── api/         # Tầng gọi API (axios)
│   │   ├── components/  # Các component giao diện
│   │   ├── contexts/    # Quản lý trạng thái (ThemeContext)
│   │   ├── hooks/       # Custom hooks (useForm, useDebounce)
│   │   ├── pages/       # Các trang (HomePage)
│   │   └── utils/       # Tiện ích chung
│   └── ...
├── server/              # Node.js Backend
│   ├── src/
│   │   ├── config/      # Cấu hình DB và biến môi trường
│   │   ├── controllers/ # Xử lý request từ client
│   │   ├── middlewares/ # Kiểm tra dữ liệu, xử lý lỗi chung
│   │   ├── models/      # Mongoose schemas (Todo)
│   │   ├── routes/      # Định tuyến API
│   │   ├── services/    # Logic nghiệp vụ (Business logic)
│   │   └── utils/       # Các helper phụ trợ
│   └── ...
└── README.md
```

## Hướng dẫn cài đặt và chạy ứng dụng

### Yêu cầu hệ thống

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MongoDB** (Bản cài đặt local hoặc sử dụng MongoDB Atlas trực tuyến)

### 1. Tải mã nguồn về máy

```bash
git clone https://github.com/<your-username>/todo-app.git
cd todo-app
```

### 2. Cài đặt và cấu hình Backend

```bash
cd server
npm install
```

Tạo tệp cấu hình `.env` trong thư mục `server/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/todo_app
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

*Lưu ý: Nếu sử dụng MongoDB Atlas, hãy thay đổi giá trị `MONGO_URI` bằng chuỗi kết nối nhận được từ Atlas.*

### 3. Cài đặt và cấu hình Frontend

```bash
cd ../client
npm install --legacy-peer-deps
```

Tạo tệp cấu hình `.env` trong thư mục `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Khởi chạy ứng dụng

**Terminal 1 - Chạy Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Chạy Frontend:**
```bash
cd client
npm run dev
```

Truy cập ứng dụng tại địa chỉ: **http://localhost:5173**

## Các API Endpoints chính

| Phương thức | Đường dẫn API | Mô tả |
| :---------- | :------------ | :---- |
| `GET`       | `/api/todos`  | Lấy danh sách công việc (hỗ trợ lọc, tìm kiếm, phân trang) |
| `GET`       | `/api/todos/:id` | Lấy chi tiết một công việc cụ thể |
| `POST`      | `/api/todos`  | Tạo mới một công việc |
| `PUT`       | `/api/todos/:id` | Cập nhật thông tin công việc |
| `PATCH`     | `/api/todos/:id/toggle` | Thay đổi trạng thái hoàn thành của công việc |
| `DELETE`    | `/api/todos/:id` | Xóa bỏ một công việc |

### Tham số truy vấn (Query Parameters) của API `GET /api/todos`

| Tham số | Ý nghĩa | Ví dụ |
| :------ | :------ | :---- |
| `search` | Tìm kiếm theo tiêu đề | `?search=react` |
| `completed` | Lọc theo trạng thái hoàn thành | `?completed=true` hoặc `?completed=false` |
| `priority` | Lọc theo mức độ ưu tiên | `?priority=high` (high / medium / low) |
| `sort` | Sắp xếp kết quả trả về | `?sort=-createdAt` (Mới nhất) hoặc `?sort=createdAt` (Cũ nhất) |
| `page` | Số trang muốn lấy | `?page=2` |
| `limit` | Số lượng công việc trên mỗi trang (Mặc định: 10) | `?limit=20` |

## Một số ghi chú thiết kế

- Sử dụng **CSS Variables** để quản lý màu sắc giao diện một cách tập trung, hỗ trợ chuyển đổi giao diện sáng/tối (Dark/Light mode).
- Việc kiểm tra dữ liệu đầu vào (Validation) được thực hiện ở cả 2 đầu: Frontend (kiểm tra trước khi gửi request để tăng UX) và Backend (sử dụng middleware kết hợp Mongoose Schema validation để tăng bảo mật).
- Tổ chức mã nguồn chuẩn hóa theo mô hình **Controller -> Service -> Model** ở phía Backend và cấu trúc **Component -> Context -> API** ở phía Frontend.

---

## 🚀 Khuyến khích & Tính năng mở rộng

### 1. Phân trang & Sắp xếp dữ liệu (Pagination & Sorting)
- **Frontend:** Đã xây dựng sẵn thanh chọn sắp xếp theo ngày tạo (Mới nhất / Cũ nhất) và bộ chọn phân trang trực quan dưới danh sách công việc.
- **Backend:** Xây dựng logic phân trang động với `skip`, `limit` và ánh xạ tham số sắp xếp thông qua bộ dựng truy vấn động `queryBuilder`.

### 2. Giao diện thích ứng (Responsive Layout)
- Giao diện được tối ưu hóa hiển thị chuẩn cho cả các thiết bị di động nhỏ nhất (Mobile), máy tính bảng (Tablet) cho đến màn hình lớn (Desktop). Các nút thao tác xóa/sửa được tùy biến thân thiện với cử chỉ chạm trên di động.

### 3. Hỗ trợ Docker & Docker Compose
- Hệ thống được cấu hình sẵn môi trường container hóa với:
  - [Dockerfile của Backend](file:///e:/Test/Todo_App/server/Dockerfile) (sử dụng Node.js lightweight Alpine).
  - [Dockerfile của Frontend](file:///e:/Test/Todo_App/client/Dockerfile) (sử dụng quy trình build 2 giai đoạn kết hợp Nginx để phục vụ file tĩnh và tối ưu hóa định tuyến Single-Page App).
  - [docker-compose.yml](file:///e:/Test/Todo_App/docker-compose.yml) ở thư mục gốc giúp cài đặt và khởi chạy toàn bộ hệ thống chỉ với một lệnh duy nhất:
    ```bash
    docker-compose up -d --build
    ```

### 4. Kiểm thử tự động (Unit Test)
- Sử dụng bộ kiểm thử gốc cực nhanh và ổn định của Node.js (`node:test` và `node:assert`).
- Để chạy các ca kiểm thử cho logic phân tích truy vấn API:
  ```bash
  cd server
  npm run test
  ```

### 5. Triển khai Online (Deployment)
- **Triển khai trọn gói lên Vercel:** Giao diện React (Vite) và API Server (Node.js Express) đã được cấu hình tối ưu chạy tích hợp trên cùng một tên miền duy nhất của Vercel (sử dụng Serverless Functions). 
- Xem chi tiết hướng dẫn cấu hình môi trường và triển khai từng bước tại: [DEPLOYMENT.md](file:///e:/Test/Todo_App/DEPLOYMENT.md).
