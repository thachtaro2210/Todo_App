import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Todo from './models/Todo.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:22102004@cluster0.fh2rx8k.mongodb.net/todo_app?retryWrites=true&w=majority';

const sampleTodos = [
  {
    title: 'Hoàn thành bài test Intern',
    description: 'Xây dựng ứng dụng Todo List với đầy đủ các tính năng CRUD, tìm kiếm, lọc, phân trang, và giao diện đẹp.',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days later
  },
  {
    title: 'Tìm hiểu sâu về React Hooks',
    description: 'Đọc tài liệu và làm ví dụ thực tế về các custom hooks, useMemo, useCallback, và useReducer.',
    completed: true,
    priority: 'medium',
    dueDate: null,
  },
  {
    title: 'Tối ưu hóa giao diện ứng dụng',
    description: 'Đảm bảo giao diện trực quan, hỗ trợ chế độ Dark Mode và Light Mode mượt mà.',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day later
  },
  {
    title: 'Viết tài liệu hướng dẫn chạy dự án',
    description: 'Hoàn thiện file README.md với đầy đủ hướng dẫn chạy, cấu hình môi trường và mô tả API endpoints.',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Kiểm tra lỗi và review mã nguồn',
    description: 'Review code, loại bỏ console.log, kiểm tra các trường hợp dữ liệu đầu vào không hợp lệ.',
    completed: false,
    priority: 'low',
    dueDate: null,
  },
];

const seedDB = async () => {
  try {
    console.log('Đang kết nối tới MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('Kết nối MongoDB thành công.');

    console.log('Đang xóa các công việc cũ...');
    await Todo.deleteMany({});
    console.log('Xóa dữ liệu cũ hoàn tất.');

    console.log('Đang thêm dữ liệu mẫu...');
    await Todo.insertMany(sampleTodos);
    console.log('Đã thêm 5 công việc mẫu thành công!');

    await mongoose.connection.close();
    console.log('Đã ngắt kết nối database. Hoàn tất seed data.');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi seed data:', error.message);
    process.exit(1);
  }
};

seedDB();
