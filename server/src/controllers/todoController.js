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
