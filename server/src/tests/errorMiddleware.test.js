process.env.NODE_ENV = 'test';
import { test } from 'node:test';
import assert from 'node:assert';
import { notFound, errorHandler } from '../middlewares/errorMiddleware.js';
import AppError from '../utils/AppError.js';

test('notFound - should call next with 404 error containing originalUrl', () => {
  const req = { originalUrl: '/non-existent-route' };
  let errorPassed = null;
  const next = (err) => { errorPassed = err; };

  notFound(req, {}, next);

  assert.ok(errorPassed instanceof Error);
  assert.strictEqual(errorPassed.statusCode, 404);
  assert.ok(errorPassed.message.includes('/non-existent-route'));
});

test('errorHandler - should send operational error status and message', () => {
  const err = new AppError('Không tìm thấy tài nguyên', 404);
  const req = {};
  
  let sentStatus = null;
  let sentJson = null;
  const res = {
    status(code) {
      sentStatus = code;
      return this;
    },
    json(data) {
      sentJson = data;
      return this;
    }
  };

  errorHandler(err, req, res, () => {});

  assert.strictEqual(sentStatus, 404);
  assert.strictEqual(sentJson.success, false);
  assert.strictEqual(sentJson.message, 'Không tìm thấy tài nguyên');
});

test('errorHandler - should default non-operational error to status 500 and general message', () => {
  const err = new Error('Database connection failed'); // not operational
  const req = {};
  
  let sentStatus = null;
  let sentJson = null;
  const res = {
    status(code) {
      sentStatus = code;
      return this;
    },
    json(data) {
      sentJson = data;
      return this;
    }
  };

  errorHandler(err, req, res, () => {});

  assert.strictEqual(sentStatus, 500);
  assert.strictEqual(sentJson.success, false);
  assert.strictEqual(sentJson.message, 'Lỗi máy chủ');
});

test('errorHandler - should handle Mongoose CastError by converting status to 400', () => {
  const err = new Error('Cast to ObjectId failed');
  err.name = 'CastError';
  const req = {};
  
  let sentStatus = null;
  let sentJson = null;
  const res = {
    status(code) {
      sentStatus = code;
      return this;
    },
    json(data) {
      sentJson = data;
      return this;
    }
  };

  errorHandler(err, req, res, () => {});

  assert.strictEqual(sentStatus, 400);
  assert.strictEqual(sentJson.message, 'ID không hợp lệ');
});

test('errorHandler - should handle Mongoose ValidationError by extracting messages', () => {
  const err = new Error('Validation failed');
  err.name = 'ValidationError';
  err.errors = {
    title: { message: 'Tiêu đề không được trống' },
    priority: { message: 'Độ ưu tiên không đúng' }
  };
  const req = {};
  
  let sentStatus = null;
  let sentJson = null;
  const res = {
    status(code) {
      sentStatus = code;
      return this;
    },
    json(data) {
      sentJson = data;
      return this;
    }
  };

  errorHandler(err, req, res, () => {});

  assert.strictEqual(sentStatus, 400);
  assert.ok(sentJson.message.includes('Tiêu đề không được trống'));
  assert.ok(sentJson.message.includes('Độ ưu tiên không đúng'));
});
