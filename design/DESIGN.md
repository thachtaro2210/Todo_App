# Todo_App Design System Spec

Tài liệu này định nghĩa hệ thống design tokens, nguyên tắc giao diện và các component chuẩn cho ứng dụng Quản lý công việc (Todo App). Mục tiêu chính của hệ thống là hỗ trợ người dùng quản lý, theo dõi và hoàn thành công việc một cách trực quan và hiệu quả.

---

## 1. Product Direction

Todo_App theo đuổi định hướng **Gentle Sage — Soft Productivity**: sáng, nhẹ nhàng, tối giản nhưng đủ tinh tế để tạo cảm giác tập trung và thư thái khi làm việc.

Hệ thống hỗ trợ cả hai chế độ giao diện:
- **Light Mode (Mặc định)**: Sử dụng nền trắng ngà xanh nhạt, các khối nội dung (surface) màu trắng sạch và sắc xanh lá xô thơm (sage green) làm điểm nhấn hành động — mang lại cảm giác tự nhiên, thư giãn như buổi sáng trong vườn.
- **Dark Mode (Chế độ tối)**: Sử dụng phong cách **Forest Dark** lấy cảm hứng từ rừng xanh ban đêm, mang tông nền xanh đen trầm mát, kết hợp cùng các chi tiết sage green sáng hơn và accent amber ấm. Điều này giúp giảm mỏi mắt khi làm việc khuya.

Các từ khóa thiết kế:

- **Sự tập trung**: Bố cục sạch sẽ, không rối mắt — giúp người dùng tập trung vào danh sách công việc.
- **Nhẹ nhàng tự nhiên**: Bảng màu lấy cảm hứng thiên nhiên, nhẹ nhàng cho mắt suốt cả ngày.
- **Độ phản hồi cao**: Các hiệu ứng hover mượt mà, trạng thái cập nhật tức thì khi toggle hoàn thành/chưa hoàn thành.
- **Đơn giản nhưng tinh tế**: Mỗi chi tiết đều có chủ đích, không thừa không thiếu.

---

## 2. Core Design Tokens

Sử dụng CSS custom properties làm nguồn token chính. Hệ thống tự động chuyển đổi giữa hai chế độ dựa trên lớp `.dark-mode` được gắn vào thẻ `<body>`.

```css
/* ==========================================================================
   Light Mode (Mặc định)
   ========================================================================== */
:root {
  --bg: #f5f6f3;
  --surface: #fbfcfa;
  --surface-muted: #eceee9;
  --surface-raised: #fbfcfa;

  --fg: #1e2420;
  --muted: #6b7269;
  --subtle: #97a09a;
  --border: #d8dcd5;
  --border-strong: #bec4b8;

  --primary: #5b8a72;
  --primary-hover: #487461;
  --primary-soft: #def0e6;
  --control: #5b8a72;
  --on-control: #fbfcfa;

  --accent: #d4915e;
  --accent-soft: #f9eadb;

  --success: #5b8a72;
  --success-soft: #def0e6;
  --warning: #d4a03b;
  --warning-soft: #fbf0d1;
  --danger: #c45d5d;
  --danger-soft: #f8e0e0;
  --info: #6b7269;
  --info-soft: #eceee9;

  --font-display: 'Plus Jakarta Sans', 'Inter', 'Segoe UI', sans-serif;
  --font-body: 'Inter', 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', Consolas, monospace;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;

  --shadow-sm: 0 1px 2px rgba(30, 36, 32, 0.05);
  --shadow-md: 0 12px 32px rgba(30, 36, 32, 0.07);
  --shadow-lg: 0 20px 48px rgba(30, 36, 32, 0.10);

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
}

/* ==========================================================================
   Dark Mode (Khi class .dark-mode được kích hoạt)
   ========================================================================== */
.dark-mode {
  --bg: #141916;
  --surface: #1c211e;
  --surface-muted: #252b27;
  --surface-raised: #1c211e;

  --fg: #e8ebe6;
  --muted: #97a09a;
  --subtle: #6b7269;
  --border: #2f352f;
  --border-strong: #3f4640;

  --primary: #6b9f84;
  --primary-hover: #8dbba2;
  --primary-soft: #1d2b23;
  --control: #6b9f84;
  --on-control: #e8ebe6;

  --accent: #d4915e;
  --accent-soft: #2b2218;

  --success: #6b9f84;
  --success-soft: #1d2b23;
  --warning: #d4a03b;
  --warning-soft: #2b2518;
  --danger: #c45d5d;
  --danger-soft: #2b1818;
  --info: #97a09a;
  --info-soft: #1f2420;
}
```

### Color Roles

- `--bg`: Nền chính của toàn bộ ứng dụng Todo.
- `--surface`: Nền của các thẻ công việc (todo card), biểu mẫu thêm/sửa hoặc modal.
- `--surface-muted`: Vùng phụ, thanh lọc trạng thái hoặc sidebar bộ lọc.
- `--fg`: Chữ chính, tiêu đề công việc, heading các mục lớn.
- `--muted`: Chữ mô tả công việc, thông tin phụ, ghi chú.
- `--primary`: Sắc xanh sage cho các nút hành động chính như "Thêm công việc", "Lưu", "Hoàn thành".
- `--control`: Nền nút nhấn chính; chữ trên nút luôn dùng màu `--on-control`.
- `--accent`: Sắc amber ấm tạo điểm nhấn cho badge ưu tiên, deadline sắp tới hoặc tag quan trọng.
- `--success`: Trạng thái công việc hoàn thành.
- `--warning`: Công việc sắp hết hạn, cần chú ý.
- `--danger`: Công việc quá hạn, xóa, validation lỗi.
- `--info`: Chú thích bổ sung, tooltip hướng dẫn.

---

## 3. Typography

Cấu trúc font chữ ưu tiên sự sạch sẽ, dễ đọc — phù hợp với ứng dụng productivity:

- **Tiêu đề lớn / Heading chính**: `Plus Jakarta Sans`, mang cảm giác hiện đại và thân thiện.
- **Nội dung / Mô tả công việc**: `Inter` hoặc `Be Vietnam Pro` — tối ưu cho việc đọc dài trên mọi thiết bị.
- **Số liệu / Ngày tháng / Counter**: `JetBrains Mono` hoặc `SF Mono` hiển thị ngày hạn, số công việc.
- Sử dụng `font-variant-numeric: tabular-nums` cho counter và ngày tháng.

Kích thước chữ đề xuất:
- Heading trang: `28px` đến `36px`, đậm nét.
- Heading section: `22px` đến `28px`.
- Tiêu đề công việc: `16px` đến `18px`.
- Mô tả công việc / Body text: `14px` đến `15px`.

---

## 4. Layout Principles

### Single Page App Layout
- **Header**: Cố định trên cùng với tên ứng dụng, thanh tìm kiếm công việc, counter số task và nút bật/tắt dark mode.
- **Filter Bar**: Thanh lọc trạng thái (Tất cả / Đang làm / Hoàn thành), search và sort.
- **Main Content Area**: Danh sách công việc dạng card list, form thêm/sửa công việc.
- **Footer**: Thống kê nhanh (tổng / hoàn thành / đang làm).

### Responsive Breakpoints
- Điện thoại di động (Compact & Standard): `360px` đến `430px`. Danh sách 1 cột, filter thu gọn.
- Máy tính bảng (Tablet): `768px` đến `1024px`. Layout rộng hơn, filter bar inline.
- Máy tính để bàn (Desktop): `1280px` trở lên. Layout max-width, hiển thị đầy đủ thông tin.

---

## 5. Component Standards

### TodoInput (Ô nhập công việc mới)
- Input field lớn, placeholder rõ ràng "Thêm công việc mới...".
- Nút submit màu `--control` ở bên phải.
- Hỗ trợ nhấn Enter để thêm nhanh.
- Validation hiển thị lỗi khi để trống.

### TodoCard (Thẻ công việc)
- Hiển thị checkbox trạng thái, tiêu đề, mô tả (nếu có), ngày tạo.
- Khi hoàn thành: tiêu đề có gạch ngang, opacity giảm nhẹ, badge `--success`.
- Nút sửa (icon edit) và xóa (icon trash) hiện khi hover.
- Toàn bộ card có hiệu ứng hover nâng nhẹ.

### FilterBar (Thanh lọc)
- Các nút lọc: Tất cả / Đang làm / Hoàn thành (dạng tab/pill).
- Tab đang chọn có background `--primary-soft`, text `--primary`.
- Thanh tìm kiếm với debounce 300ms.
- Dropdown sắp xếp (Mới nhất / Cũ nhất / Ưu tiên).

### TodoForm (Form thêm/sửa chi tiết)
- Trường nhập: Tiêu đề (bắt buộc), Mô tả (tùy chọn).
- Chọn mức ưu tiên: Thấp / Trung bình / Cao (dạng pill).
- Chọn ngày hạn (date picker).
- Nút Lưu + Hủy.

### EmptyState (Trạng thái trống)
- Hiển thị khi không có công việc nào.
- Icon minh họa + thông điệp động viên ("Chưa có công việc nào. Bắt đầu thêm ngay!").
- Nút CTA "Thêm công việc".

### StatsBar (Thanh thống kê)
- Hiển thị: Tổng công việc / Hoàn thành / Đang làm.
- Progress bar tỷ lệ hoàn thành, màu `--success`.
- Counter dùng font mono.

---

## 6. Forms & Validation

### Todo Form (Biểu mẫu công việc)
- Tiêu đề: bắt buộc, tối thiểu 1 ký tự, tối đa 200 ký tự.
- Mô tả: tùy chọn, tối đa 1000 ký tự.
- Ưu tiên: Low / Medium / High (mặc định Medium).
- Ngày hạn: tùy chọn, phải >= ngày hiện tại khi tạo mới.
- Label rõ ràng cho từng ô nhập liệu.
- Trạng thái phản hồi cụ thể khi thành công (success) hoặc thất bại (danger).

---

## 7. Motion & Interaction

- **Scroll reveal**: Các thẻ công việc trượt nhẹ khi người dùng cuộn tới (sử dụng hiệu ứng Fade) để tạo trải nghiệm duyệt tự nhiên.
- **Hover effects**: Tất cả các thẻ công việc (card) nâng nhẹ `translateY(-2px)` kết hợp đổ bóng nhẹ để tạo chiều sâu giao diện.
- **Button transitions**: Các nút thay đổi độ đậm nhạt của màu nền khi hover, thời gian chuyển đổi khoảng `160ms` đến `220ms`.
- **Checkbox toggle**: Hiệu ứng scale nhẹ + checkmark animation khi đánh dấu hoàn thành.
- **Delete animation**: Hiệu ứng slide-out khi xóa công việc.
- **Add animation**: Hiệu ứng slide-in khi thêm công việc mới.

---

## 8. Do's and Don't's

### Nên
- Giữ các mã màu nhất quán ở mọi section tương ứng với từng theme để giữ được tinh thần Gentle Sage tự nhiên.
- Trạng thái công việc phải trực quan: checkbox rõ ràng, gạch ngang khi hoàn thành.
- Counter dùng font mono để canh đều.
- Responsive tốt — người dùng có thể quản lý công việc trên điện thoại.
- Loading state rõ ràng (skeleton hoặc spinner) khi fetch dữ liệu.

### Không nên
- Không hardcode các màu sắc ngoài bảng màu được định nghĩa trong token.
- Không sử dụng màu nền tối lạnh (xanh dương đậm/xám lạnh) cho Dark Mode; luôn bám sát tông **Forest Dark** xanh sage trầm mát.
- Không lạm dụng quá nhiều hiệu ứng chuyển động cùng lúc gây rối mắt.
- Không bỏ qua loading state khi fetch dữ liệu (luôn hiện skeleton hoặc spinner).
- Không để form submit khi dữ liệu không hợp lệ — luôn validate trước.

---

## 9. Agent Prompt Guide

Khi yêu cầu AI hỗ trợ chỉnh sửa giao diện cho Todo_App, sử dụng chỉ dẫn sau:

> Hãy chỉnh sửa giao diện Todo App theo design system Todo_App hướng Gentle Sage — Soft Productivity hỗ trợ cả Light Mode và Dark Mode.
> - **Light Mode**: Nền trắng sage nhẹ `#F5F6F3`, surface trắng sạch `#FBFCFA`, chữ xanh đen `#1E2420`, text phụ `#6B7269`, primary sage green `#5B8A72`.
> - **Dark Mode**: Nền xanh đen trầm `#141916`, surface xanh forest `#1C211E`, chữ sage trắng `#E8EBE6`, text phụ `#97A09A`, primary sage sáng `#6B9F84`, accent amber `#D4915E`.
> Typography sử dụng `Plus Jakarta Sans` cho tiêu đề và `Inter` cho nội dung văn bản. Tập trung thiết kế thẻ công việc, form thêm/sửa, thanh lọc trạng thái và thanh thống kê. Đảm bảo responsive tốt trên mobile, các hiệu ứng hover mượt mà và trải nghiệm quản lý công việc mạch lạc.
