# Tổng Quan Bảng Màu (Color Palette Specification) - Todo_App

Tài liệu này tổng hợp toàn bộ bảng màu sắc (cả Light Mode và Dark Mode), ý nghĩa sử dụng và cách ánh xạ từ mã màu CSS Custom Properties sang các biến CSS trong dự án Todo App.

---

## 1. Bảng Màu Hệ Thống (System Themes)

Dưới đây là chi tiết mã màu HEX cho cả hai chế độ giao diện được khai báo trong `src/index.css`.

### 1.1. Bảng so sánh Light Mode và Dark Mode

| CSS Variable | Ý nghĩa / Vai trò | Light Mode (Sáng) | Dark Mode (Tối) |
| :--- | :--- | :--- | :--- |
| **`--bg`** | Nền chính toàn ứng dụng | `#f5f6f3` (Trắng sage nhẹ) | `#141916` (Xanh đen forest) |
| **`--header-bg`** | Nền của thanh header | `rgba(245, 246, 243, 0.80)` | `rgba(20, 25, 22, 0.80)` |
| **`--surface`** | Nền thẻ công việc, modal, form | `#fbfcfa` (Trắng sạch ấm) | `#1c211e` (Xanh forest trầm) |
| **`--surface-muted`** | Nền filter bar / vùng phụ | `#eceee9` (Sage nhạt) | `#252b27` (Forest tối) |
| **`--surface-raised`** | Nền modal, dropdown | `#fbfcfa` | `#1c211e` |
| **`--fg`** | Màu chữ chính (Tiêu đề, tên task) | `#1e2420` (Xanh đen mềm) | `#e8ebe6` (Sage trắng nhẹ) |
| **`--muted`** | Màu chữ phụ, mô tả task | `#6b7269` (Sage gray) | `#97a09a` (Sage sáng) |
| **`--subtle`** | Màu chữ rất nhạt, placeholder | `#97a09a` | `#6b7269` |
| **`--border`** | Đường viền mảnh, chia ngăn | `#d8dcd5` | `#2f352f` |
| **`--border-strong`** | Đường viền phân cấp đậm hơn | `#bec4b8` | `#3f4640` |
| **`--primary`** | Màu nhấn chính (Sage green) | `#5b8a72` | `#6b9f84` |
| **`--primary-hover`** | Hover nút "Thêm" / "Lưu" | `#487461` | `#8dbba2` |
| **`--primary-soft`** | Nền tab đang chọn / badge active | `#def0e6` | `#1d2b23` |
| **`--control`** | Màu nền nút điều khiển chính | `#5b8a72` | `#6b9f84` |
| **`--on-control`** | Chữ trên nền nút điều khiển | `#fbfcfa` | `#e8ebe6` |
| **`--accent`** | Điểm nhấn đặc biệt (Amber ấm) | `#d4915e` | `#d4915e` |
| **`--accent-soft`** | Nền badge ưu tiên / deadline | `#f9eadb` | `#2b2218` |

---

## 2. Màu Phản Hồi Trạng Thái (Status Colors)

Sử dụng cho trạng thái công việc, thông báo và validation form:

| Trạng thái | CSS Variable | Light Mode | Dark Mode | Ý nghĩa sử dụng |
| :--- | :--- | :--- | :--- | :--- |
| **Success** | `--success`<br>`--success-soft` | `#5b8a72`<br>`#def0e6` | `#6b9f84`<br>`#1d2b23` | Công việc hoàn thành / Thao tác thành công |
| **Warning** | `--warning`<br>`--warning-soft` | `#d4a03b`<br>`#fbf0d1` | `#d4a03b`<br>`#2b2518` | Sắp hết hạn / Cần chú ý |
| **Danger** | `--danger`<br>`--danger-soft` | `#c45d5d`<br>`#f8e0e0` | `#c45d5d`<br>`#2b1818` | Quá hạn / Xóa / Validation lỗi |
| **Info** | `--info`<br>`--info-soft` | `#6b7269`<br>`#eceee9` | `#97a09a`<br>`#1f2420` | Tooltip hướng dẫn / Ghi chú bổ sung |

---

## 3. Ánh Xạ Biến CSS Toàn Cục

Dưới đây là cách ánh xạ các CSS Custom Properties cho các component chính trong Todo App:

```css
/* Nút bấm */
/* Nút "Thêm công việc", "Lưu" → var(--primary) */
/* Hover nút → var(--primary-hover) */

/* Chữ */
/* Tiêu đề công việc → var(--fg) */
/* Mô tả công việc → var(--muted) */
/* Ngày tháng / Counter → var(--subtle), font-family: var(--font-mono) */

/* Thẻ công việc */
/* Nền card → var(--surface) */
/* Viền card → var(--border) */
/* Badge ưu tiên cao → background: var(--danger-soft), color: var(--danger) */
/* Badge hoàn thành → background: var(--success-soft), color: var(--success) */

/* Trạng thái công việc */
/* Active → var(--primary) */
/* Completed → var(--success) */
/* Overdue → var(--danger) */
/* Due soon → var(--warning) */

/* Filter tabs */
/* Tab active → background: var(--primary-soft), color: var(--primary) */
/* Tab inactive → color: var(--muted) */
```

---

## 4. Màu Sắc Hình Nền & Đường Nét Vẽ Nền (Background & Pattern Colors)

Các chi tiết hình học và đốm sáng ở hình nền được phối màu hài hòa để tạo chiều sâu giao diện:

### 4.1. Chế độ Sáng (Light Mode Background)
* **Lưới trang trí**: Sử dụng màu `#1e2420` (trùng với `--fg`) vẽ nét lưới mảnh `0.5px` với độ mờ `opacity: 0.025` để tạo texture nhẹ nhàng.
* **Đốm sáng lan tỏa (Accents Glow)**:
  - Phía dưới phải: Màu sage green `#5b8a72` (trùng `--primary`) ở độ mờ 8%.
  - Phía trên trái: Màu amber `#d4915e` (trùng `--accent`) ở độ mờ 6%.

### 4.2. Chế độ Tối (Dark Mode Background)
* **Dải màu nền (Gradient Base)**: Phối hợp 4 tông sắc forest chuyển dần từ `#141916` → `#1c211e` → `#252b27` → `#2f352f`.
* **Đốm sáng lan tỏa (Accents Glow)**:
  - Phía trên phải: Màu sage green `#6b9f84` ở độ mờ 12%.
  - Phía dưới trái: Màu amber `#d4915e` ở độ mờ 8%.
  - Phía trên giữa: Màu sage nhạt `#97a09a` ở độ mờ 5%.

---

## 5. Mẹo Khi Làm Việc Với Màu Sắc Trong Dự Án
1. **Thay đổi theme**: Chỉ cần tinh chỉnh mã màu trong file `src/index.css`. Mọi component khác sẽ tự động thay đổi theo nhờ sử dụng biến CSS.
2. **Khi viết CSS mới**: Không dùng màu cố định (VD: `color: #1e2420;`). Thay vào đó hãy dùng `color: var(--fg);`.
3. **Counter / Ngày tháng**: Luôn dùng `font-family: var(--font-mono)` và `color: var(--subtle)` cho số liệu.
4. **Badge/Tag**: Dùng cặp `--*` và `--*-soft` (VD: `background: var(--success-soft); color: var(--success)`) để tạo nhãn dịu mắt.
