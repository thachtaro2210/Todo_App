import { test } from 'node:test';
import assert from 'node:assert';
import { validate, todoSchema } from '../middlewares/validateMiddleware.js';

test('validateMiddleware - should call next without error for valid input', () => {
  const req = {
    method: 'POST',
    body: {
      title: 'Học React',
      description: 'Học React và Vite',
      priority: 'high',
      dueDate: new Date().toISOString()
    }
  };
  let nextCalled = false;
  const next = () => { nextCalled = true; };

  validate(todoSchema)(req, {}, next);

  assert.strictEqual(nextCalled, true);
});

test('validateMiddleware - should throw error when required title is empty', () => {
  const req = {
    method: 'POST',
    body: {
      title: '   ',
    }
  };
  const next = () => {};

  assert.throws(() => {
    validate(todoSchema)(req, {}, next);
  }, (err) => {
    return err.statusCode === 400 && err.message.includes('Tiêu đề không được để trống');
  });
});

test('validateMiddleware - should throw error when priority is invalid', () => {
  const req = {
    method: 'POST',
    body: {
      title: 'Học React',
      priority: 'invalid-priority'
    }
  };
  const next = () => {};

  assert.throws(() => {
    validate(todoSchema)(req, {}, next);
  }, (err) => {
    return err.statusCode === 400 && err.message.includes('Mức ưu tiên phải là một trong');
  });
});

test('validateMiddleware - should throw error when dueDate is in the past for POST', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const req = {
    method: 'POST',
    body: {
      title: 'Học React',
      dueDate: yesterday.toISOString()
    }
  };
  const next = () => {};

  assert.throws(() => {
    validate(todoSchema)(req, {}, next);
  }, (err) => {
    return err.statusCode === 400 && err.message.includes('Ngày hạn phải từ ngày hôm nay trở đi');
  });
});

test('validateMiddleware - should permit past dueDate for PUT/updates', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const req = {
    method: 'PUT',
    body: {
      title: 'Học React',
      dueDate: yesterday.toISOString()
    }
  };
  let nextCalled = false;
  const next = () => { nextCalled = true; };

  validate(todoSchema)(req, {}, next);

  assert.strictEqual(nextCalled, true);
});
