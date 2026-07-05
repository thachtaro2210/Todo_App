import { memo } from 'react';
import { formatDate, formatRelativeDate, isOverdue } from '../../utils/formatDate';
import { PRIORITY_LABELS } from '../../utils/constants';
import styles from './TodoCard.module.css';

const priorityClass = {
  low: styles.badgeLow,
  medium: styles.badgeMedium,
  high: styles.badgeHigh,
};

function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  const overdue = !todo.completed && isOverdue(todo.dueDate);

  return (
    <div className={`${styles.card} ${todo.completed ? styles.completed : ''}`}>
      <button
        className={styles.checkbox}
        onClick={() => onToggle(todo._id)}
        aria-label={`Đánh dấu ${todo.completed ? 'chưa hoàn thành' : 'hoàn thành'}`}
      >
        {todo.completed && (
          <span className={styles.checkIcon}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        )}
      </button>

      <div className={styles.content}>
        <h3 className={styles.title}>{todo.title}</h3>
        {todo.description && (
          <p className={styles.description}>{todo.description}</p>
        )}
        <div className={styles.meta}>
          <span className={`${styles.badge} ${priorityClass[todo.priority] || ''}`}>
            {PRIORITY_LABELS[todo.priority]}
          </span>
          {todo.dueDate && (
            <span className={`${styles.date} ${overdue ? styles.overdue : ''}`}>
              {overdue ? formatRelativeDate(todo.dueDate) : formatDate(todo.dueDate)}
            </span>
          )}
          <span className={styles.date}>{formatDate(todo.createdAt)}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.editBtn}
          onClick={() => onEdit(todo)}
          aria-label="Sửa công việc"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(todo)}
          aria-label="Xóa công việc"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default memo(TodoCard);
