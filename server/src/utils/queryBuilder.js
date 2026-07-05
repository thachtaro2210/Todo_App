export const buildQuery = (params) => {
  const {
    page = 1,
    limit = 10,
    sort: sortParam = '-createdAt',
    search,
    completed,
    priority,
  } = params;

  const filter = {};

  // Text search by title
  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  // Status filter
  if (completed !== undefined && completed !== '' && completed !== 'all') {
    filter.completed = completed === 'true';
  }

  // Priority filter
  if (priority && priority !== 'all') {
    filter.priority = priority;
  }

  // Sort: "-createdAt" -> { createdAt: -1 }
  const sort = {};
  const sortFields = sortParam.split(',');
  sortFields.forEach((field) => {
    if (field.startsWith('-')) {
      sort[field.slice(1)] = -1;
    } else {
      sort[field] = 1;
    }
  });

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));

  return {
    filter,
    sort,
    skip: (pageNum - 1) * limitNum,
    limit: limitNum,
  };
};
