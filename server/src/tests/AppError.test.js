import { test } from 'node:test';
import assert from 'node:assert';
import AppError from '../utils/AppError.js';

test('AppError - should create an instance with correct message, statusCode, and isOperational property', () => {
  const error = new AppError('Lỗi dữ liệu', 400);

  assert.ok(error instanceof Error);
  assert.ok(error instanceof AppError);
  assert.strictEqual(error.message, 'Lỗi dữ liệu');
  assert.strictEqual(error.statusCode, 400);
  assert.strictEqual(error.isOperational, true);
});
