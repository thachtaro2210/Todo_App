import useForm from '../../hooks/useForm';
import { validateTodo } from '../../utils/validators';
import { PRIORITY, PRIORITY_LABELS } from '../../utils/constants';
import Spinner from '../common/Spinner';
import styles from './TodoForm.module.css';

const emptyTodo = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
};

export default function TodoForm({ initialData, onSubmit, onCancel, loading }) {
  const isEdit = !!initialData?._id;
  const init = initialData
    ? {
        ...initialData,
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split('T')[0]
          : '',
      }
    : emptyTodo;

  const { values, errors, touched, handleChange, handleBlur, validate, reset } =
    useForm(init, validateTodo);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority,
      dueDate: values.dueDate || null,
    };

    onSubmit(data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Title */}
      <div className={styles.field}>
        <label htmlFor="todo-title" className={styles.label}>
          Tiêu đề <span className={styles.required}>*</span>
        </label>
        <input
          id="todo-title"
          type="text"
          className={`${styles.input} ${touched.title && errors.title ? styles.inputError : ''}`}
          value={values.title}
          onChange={(e) => handleChange('title', e.target.value)}
          onBlur={() => handleBlur('title')}
          placeholder="Nhập tiêu đề công việc..."
          maxLength={200}
          autoFocus
        />
        <div className={styles.charCount}>{values.title.length}/200</div>
        {touched.title && errors.title && (
          <span className={styles.errorText}>{errors.title}</span>
        )}
      </div>

      {/* Description */}
      <div className={styles.field}>
        <label htmlFor="todo-desc" className={styles.label}>
          Mô tả
        </label>
        <textarea
          id="todo-desc"
          className={`${styles.textarea} ${touched.description && errors.description ? styles.inputError : ''}`}
          value={values.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="Mô tả chi tiết (tùy chọn)..."
          maxLength={1000}
          rows={3}
        />
        {touched.description && errors.description && (
          <span className={styles.errorText}>{errors.description}</span>
        )}
      </div>

      {/* Priority */}
      <div className={styles.field}>
        <label className={styles.label}>Mức ưu tiên</label>
        <div className={styles.priorityGroup}>
          {Object.values(PRIORITY).map((p) => (
            <button
              key={p}
              type="button"
              className={`${styles.priorityBtn} ${values.priority === p ? styles.priorityActive : ''}`}
              onClick={() => handleChange('priority', p)}
            >
              {PRIORITY_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Due date */}
      <div className={styles.field}>
        <label htmlFor="todo-due" className={styles.label}>
          Ngày hạn
        </label>
        <input
          id="todo-due"
          type="date"
          className={`${styles.input} ${touched.dueDate && errors.dueDate ? styles.inputError : ''}`}
          value={values.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          onBlur={() => handleBlur('dueDate')}
        />
        {touched.dueDate && errors.dueDate && (
          <span className={styles.errorText}>{errors.dueDate}</span>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {onCancel && (
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            Hủy
          </button>
        )}
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? (
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Spinner size={14} style={{ marginRight: '6px' }} />
              Đang lưu...
            </span>
          ) : isEdit ? (
            'Cập nhật'
          ) : (
            'Thêm'
          )}
        </button>
      </div>
    </form>
  );
}
