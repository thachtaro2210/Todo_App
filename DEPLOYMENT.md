# Hướng dẫn triển khai ứng dụng lên môi trường Online

Tài liệu này hướng dẫn chi tiết cách deploy toàn bộ ứng dụng (Client và Server) lên internet miễn phí.

---

## 1. Chuẩn bị trước khi triển khai
- Đảm bảo mã nguồn đã được tải lên kho lưu trữ **GitHub**.
- Chuẩn bị cơ sở dữ liệu **MongoDB Atlas** (Đã tạo tài khoản, cấu hình IP Access List là `0.0.0.0/0` để cho phép các dịch vụ Cloud kết nối).

---

## 2. Triển khai Backend (Node.js API)

Bạn có thể dễ dàng triển khai Backend lên **Render** hoặc **Railway**. Dưới đây là hướng dẫn cho Render:

1. Đăng ký/Đăng nhập tài khoản tại [Render](https://render.com/).
2. Chọn **New** -> **Web Service**.
3. Kết nối với tài khoản GitHub của bạn và chọn kho lưu trữ chứa dự án `Todo_App`.
4. Cấu hình thông tin dịch vụ:
   - **Name:** `todo-app-backend` (hoặc tên tùy chọn).
   - **Region:** Chọn vùng gần nhất (ví dụ: `Singapore` để có tốc độ tốt nhất về Việt Nam).
   - **Branch:** `main` (hoặc nhánh bạn muốn deploy).
   - **Root Directory:** `server` (Rất quan trọng, để Render nhận diện thư mục backend).
   - **Runtime:** `Node`.
   - **Build Command:** `npm install`.
   - **Start Command:** `npm start`.
5. Cấu hình biến môi trường (Environment Variables) trong phần **Advanced**:
   - `PORT`: `5000` (hoặc Render sẽ tự động gán cổng).
   - `NODE_ENV`: `production`.
   - `MONGO_URI`: `mongodb+srv://admin:22102004@cluster0.fh2rx8k.mongodb.net/todo_app?retryWrites=true&w=majority` (Thay bằng database production của bạn).
   - `CLIENT_URL`: Điền URL của Frontend sau khi deploy thành công (ví dụ: `https://todo-app-frontend.vercel.app`).
6. Nhấn **Deploy Web Service** và chờ Render khởi chạy. Copy lại URL API do Render cung cấp (ví dụ: `https://todo-app-backend.onrender.com`).

---

## 3. Triển khai Frontend (React Vite)

Khuyến khích triển khai trên **Vercel** vì hỗ trợ Vite rất tốt và tốc độ tải trang cực nhanh.

1. Đăng ký/Đăng nhập tài khoản tại [Vercel](https://vercel.com/).
2. Chọn **Add New** -> **Project**.
3. Chọn kho lưu trữ GitHub chứa dự án `Todo_App`.
4. Cấu hình thông tin dự án:
   - **Framework Preset:** `Vite` (Vercel tự động nhận diện).
   - **Root Directory:** `client` (Rất quan trọng, để Vercel build đúng mã nguồn frontend).
   - **Build and Output Settings:** Giữ mặc định (`npm run build` và thư mục `dist`).
5. Thêm biến môi trường (Environment Variables):
   - Tên biến: `VITE_API_URL`.
   - Giá trị: URL của Backend Render đã copy ở bước trước + `/api` (ví dụ: `https://todo-app-backend.onrender.com/api`).
6. Nhấn **Deploy**.
7. Sau khi quá trình build hoàn tất, Vercel sẽ cung cấp cho bạn một tên miền miễn phí dạng `https://<ten-du-an>.vercel.app`.

*Lưu ý quay lại phần cấu hình Render Backend cập nhật giá trị `CLIENT_URL` thành tên miền Vercel này để cho phép CORS hoạt động bình thường.*

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
