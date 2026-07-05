# Hướng dẫn triển khai ứng dụng lên môi trường Online

Tài liệu này hướng dẫn chi tiết cách deploy toàn bộ ứng dụng (Client và Server) lên internet miễn phí.

---

## 1. Chuẩn bị trước khi triển khai
- Đảm bảo mã nguồn đã được tải lên kho lưu trữ **GitHub**.
- Chuẩn bị cơ sở dữ liệu **MongoDB Atlas** (Đã tạo tài khoản, cấu hình IP Access List là `0.0.0.0/0` để cho phép các dịch vụ Cloud kết nối).

---

## 2. Triển khai cả Client & Serverless Backend lên Vercel (Khuyên dùng - Nhanh nhất)

Đây là phương thức tối ưu nhất giúp bạn deploy toàn bộ ứng dụng (cả Giao diện React và API Server) lên cùng một tên miền duy nhất trên **Vercel** hoàn toàn miễn phí, không cần thuê server riêng.

1. Đăng ký/Đăng nhập tài khoản tại [Vercel](https://vercel.com/).
2. Chọn **Add New** -> **Project**.
3. Chọn kho lưu trữ GitHub chứa dự án `Todo_App`.
4. Cấu hình thông tin dự án:
   - **Root Directory:** Giữ nguyên mặc định là `.` (thư mục gốc chứa file `vercel.json`).
   - **Framework Preset:** Chọn `Other` hoặc để Vercel tự nhận diện.
5. Thêm biến môi trường (Environment Variables) trong mục **Environment Variables**:
   - Tên biến: `MONGO_URI`
   - Giá trị: Chuỗi kết nối MongoDB Atlas của bạn (Ví dụ: `mongodb+srv://admin:<password>@cluster0.fh2rx8k.mongodb.net/todo_app?retryWrites=true&w=majority`).
6. Nhấn **Deploy** và chờ quá trình build hoàn tất. Vercel sẽ cấp một tên miền miễn phí dạng `https://<ten-du-an>.vercel.app`.

---

## 3. Cách thay thế: Triển khai riêng biệt (Server trên Render, Client trên Vercel)

Nếu bạn muốn deploy theo mô hình truyền thống (chạy một server Express Node.js riêng biệt):

### Bước 3.1: Triển khai Backend (Node.js API) lên Render
1. Truy cập [Render](https://render.com/) và tạo một **Web Service** mới.
2. Liên kết với kho lưu trữ GitHub `Todo_App`.
3. Cấu hình dịch vụ:
   - **Name:** `todo-app-backend`
   - **Root Directory:** `server` (Để Render nhận diện thư mục server).
   - **Runtime:** `Node`.
   - **Build Command:** `npm install`.
   - **Start Command:** `npm start`.
4. Cấu hình biến môi trường trong phần **Advanced**:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Điền chuỗi kết nối MongoDB Atlas của bạn.
   - `CLIENT_URL`: Điền URL của Frontend sau khi deploy thành công (ở bước sau).
5. Nhấn **Deploy Web Service** và copy URL API (ví dụ: `https://todo-app-backend.onrender.com`).

### Bước 3.2: Triển khai Frontend (React Vite) lên Vercel
1. Đăng nhập [Vercel](https://vercel.com/) -> **Add New** -> **Project**.
2. Chọn repo `Todo_App` và thiết lập:
   - **Root Directory:** `client` (Rất quan trọng).
   - **Framework Preset:** `Vite`.
3. Thêm biến môi trường:
   - Tên biến: `VITE_API_URL`
   - Giá trị: URL của Backend Render đã copy + `/api` (ví dụ: `https://todo-app-backend.onrender.com/api`).
4. Nhấn **Deploy**.
5. *Quay lại Render Backend cập nhật biến `CLIENT_URL` thành tên miền Vercel để cho phép CORS hoạt động.*

---

## 4. Triển khai bằng Docker (Nếu tự host trên VPS)

Dự án đã có cấu hình sẵn `Dockerfile` và `docker-compose.yml` ở thư mục gốc.

Để chạy toàn bộ ứng dụng trên VPS có cài Docker:
```bash
# Clone source code về VPS
git clone <github-url>
cd todo-app

# Chạy Docker Compose
docker-compose up -d --build
```
Ứng dụng sẽ tự động khởi chạy:
- Frontend: Cổng `8080` (sử dụng Nginx tối ưu hóa SEO và bảo mật).
- Backend API: Cổng `5000`.
