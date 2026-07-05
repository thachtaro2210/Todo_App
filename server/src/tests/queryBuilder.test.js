import { test } from 'node:test';
import assert from 'node:assert';
import { buildQuery } from '../utils/queryBuilder.js';

test('buildQuery - should return default pagination and sort when params are empty', () => {
  const result = buildQuery({});
  
  assert.deepStrictEqual(result.filter, {});
  assert.deepStrictEqual(result.sort, { createdAt: -1 });
  assert.strictEqual(result.skip, 0);
  assert.strictEqual(result.limit, 10);
});

test('buildQuery - should parse page and limit correctly', () => {
  const result = buildQuery({ page: '3', limit: '20' });
  
  assert.strictEqual(result.skip, 40);
  assert.strictEqual(result.limit, 20);
});

test('buildQuery - should limit maximum page size to 50 items', () => {
  const result = buildQuery({ limit: '100' });
  
  assert.strictEqual(result.limit, 50);
});

test('buildQuery - should apply search keyword filter as a case-insensitive regex', () => {
  const result = buildQuery({ search: 'clean code' });
  
  assert.deepStrictEqual(result.filter, {
    title: { $regex: 'clean code', $options: 'i' }
  });
});

test('buildQuery - should apply completed boolean filter correctly', () => {
  const resultTrue = buildQuery({ completed: 'true' });
  assert.strictEqual(resultTrue.filter.completed, true);

  const resultFalse = buildQuery({ completed: 'false' });
  assert.strictEqual(resultFalse.filter.completed, false);

  const resultAll = buildQuery({ completed: 'all' });
  assert.strictEqual(resultAll.filter.completed, undefined);
});

test('buildQuery - should apply priority filter correctly', () => {
  const resultHigh = buildQuery({ priority: 'high' });
  assert.strictEqual(resultHigh.filter.priority, 'high');

  const resultAll = buildQuery({ priority: 'all' });
  assert.strictEqual(resultAll.filter.priority, undefined);
});

test('buildQuery - should parse custom sort ascending and descending parameters', () => {
  const resultDesc = buildQuery({ sort: '-priority' });
  assert.deepStrictEqual(resultDesc.sort, { priority: -1 });

  const resultAsc = buildQuery({ sort: 'priority' });
  assert.deepStrictEqual(resultAsc.sort, { priority: 1 });
});
