export const TODO_STATUS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const PRIORITY_LABELS = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
};

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Mới nhất' },
  { value: 'createdAt', label: 'Cũ nhất' },
  { value: '-priority', label: 'Ưu tiên cao' },
  { value: 'priority', label: 'Ưu tiên thấp' },
];
