import { test } from 'node:test';
import assert from 'node:assert';
import { formatDate, formatRelativeDate, isOverdue } from '../../../client/src/utils/formatDate.js';

test('formatDate - should return empty string when date is null or undefined', () => {
  assert.strictEqual(formatDate(null), '');
  assert.strictEqual(formatDate(undefined), '');
});

test('formatDate - should format date strings to Vietnamese locale standard', () => {
  const result = formatDate('2026-07-22');
  assert.strictEqual(result, '22/07/2026');
});

test('formatRelativeDate - should return correct relative time descriptions', () => {
  const now = new Date();
  
  // Today
  assert.strictEqual(formatRelativeDate(now.toISOString()), 'Hôm nay');

  // Tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  assert.strictEqual(formatRelativeDate(tomorrow.toISOString()), 'Ngày mai');

  // Future days
  const future = new Date();
  future.setDate(future.getDate() + 3);
  assert.strictEqual(formatRelativeDate(future.toISOString()), 'Còn 3 ngày');

  // Overdue
  const past = new Date();
  past.setDate(past.getDate() - 2);
  assert.strictEqual(formatRelativeDate(past.toISOString()), 'Quá hạn 2 ngày');
});

test('isOverdue - should detect if a date is older than today', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  assert.strictEqual(isOverdue(yesterday.toISOString()), true);
  assert.strictEqual(isOverdue(tomorrow.toISOString()), false);
  assert.strictEqual(isOverdue(null), false);
});
