import Todo from '../models/Todo.js';
import AppError from '../utils/AppError.js';
import { buildQuery } from '../utils/queryBuilder.js';

export const getTodos = async (queryParams) => {
  const { filter, sort, skip, limit } = buildQuery(queryParams);

  const [todos, total] = await Promise.all([
    Todo.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Todo.countDocuments(filter),
  ]);

  return {
    todos,
    pagination: {
      total,
      page: Math.floor(skip / limit) + 1,
      pages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getTodoById = async (id) => {
  const todo = await Todo.findById(id).lean();
  if (!todo) throw new AppError('Không tìm thấy công việc', 404);
  return todo;
};

export const createTodo = async (data) => {
  return Todo.create(data);
};

export const updateTodo = async (id, data) => {
  const todo = await Todo.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!todo) throw new AppError('Không tìm thấy công việc', 404);
  return todo;
};

export const toggleTodo = async (id) => {
  const todo = await Todo.findById(id);
  if (!todo) throw new AppError('Không tìm thấy công việc', 404);
  todo.completed = !todo.completed;
  await todo.save();
  return todo;
};

export const deleteTodo = async (id) => {
  const todo = await Todo.findByIdAndDelete(id);
  if (!todo) throw new AppError('Không tìm thấy công việc', 404);
};
