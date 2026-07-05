import { useState, useEffect, useCallback } from 'react';
import todoApi from '../api/todoApi';
import useDebounce from '../hooks/useDebounce';
import FilterBar from '../components/todo/FilterBar';
import StatsBar from '../components/todo/StatsBar';
import TodoCard from '../components/todo/TodoCard';
import TodoForm from '../components/todo/TodoForm';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import Spinner from '../components/common/Spinner';
import styles from './HomePage.module.css';

export default function HomePage() {
  // Data state
  const [todos, setTodos] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  // UI state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deletingTodo, setDeletingTodo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Build completed param from filter
  const completedParam = filter === 'completed' ? 'true' : filter === 'active' ? 'false' : '';

  // Fetch todos
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 10, sort };
      if (debouncedSearch) params.search = debouncedSearch;
      if (completedParam) params.completed = completedParam;

      const res = await todoApi.getAll(params);
      setTodos(res.data.todos);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách');
    } finally {
      setLoading(false);
    }
  }, [page, sort, debouncedSearch, completedParam]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filter, sort]);

  // Handlers
  const handleCreate = async (data) => {
    setSubmitting(true);
    try {
      await todoApi.create(data);
      setShowAddModal(false);
      setToast({ message: 'Đã thêm công việc', type: 'success' });
      fetchTodos();
    } catch (err) {
      setToast({ message: err.message || 'Thêm thất bại', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    if (!editingTodo) return;
    setSubmitting(true);
    try {
      await todoApi.update(editingTodo._id, data);
      setEditingTodo(null);
      setToast({ message: 'Đã cập nhật', type: 'success' });
      fetchTodos();
    } catch (err) {
      setToast({ message: err.message || 'Cập nhật thất bại', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await todoApi.toggle(id);
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
      );
    } catch (err) {
      setToast({ message: err.message || 'Thao tác thất bại', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    setSubmitting(true);
    try {
      await todoApi.remove(id);
      setDeletingTodo(null);
      setToast({ message: 'Đã xóa', type: 'success' });
      fetchTodos();
    } catch (err) {
      setToast({ message: err.message || 'Xóa thất bại', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Stats
  const totalAll = pagination.total;
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Công việc của tôi</h2>
      <p className={styles.subtitle}>Quản lý và theo dõi công việc hằng ngày</p>

      <StatsBar total={totalAll} completed={completedCount} active={activeCount} />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        sort={sort}
        onSortChange={setSort}
        onAddClick={() => setShowAddModal(true)}
      />

      {/* Content */}
      {loading ? (
        <div className={styles.loader}>
          <Spinner size={32} color="var(--primary)" style={{ marginBottom: '12px' }} />
          <div>Đang tải danh sách...</div>
        </div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : todos.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--subtle)' }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="9"></line>
              <line x1="9" y1="13" x2="15" y2="13"></line>
              <line x1="9" y1="17" x2="13" y2="17"></line>
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>Không có công việc nào</h3>
          <p className={styles.emptyText}>
            {debouncedSearch || filter !== 'all'
              ? 'Không tìm thấy kết quả phù hợp'
              : 'Bắt đầu thêm công việc mới'}
          </p>
          {!debouncedSearch && filter === 'all' && (
            <button className={styles.emptyBtn} onClick={() => setShowAddModal(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span style={{ verticalAlign: 'middle' }}>Thêm công việc</span>
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {todos.map((todo) => (
              <TodoCard
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onEdit={setEditingTodo}
                onDelete={setDeletingTodo}
              />
            ))}
          </div>
          <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
        </>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="Thêm công việc" onClose={() => setShowAddModal(false)}>
          <TodoForm
            onSubmit={handleCreate}
            onCancel={() => setShowAddModal(false)}
            loading={submitting}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editingTodo && (
        <Modal title="Sửa công việc" onClose={() => setEditingTodo(null)}>
          <TodoForm
            initialData={editingTodo}
            onSubmit={handleUpdate}
            onCancel={() => setEditingTodo(null)}
            loading={submitting}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTodo && (
        <Modal title="Xác nhận xóa" onClose={() => setDeletingTodo(null)}>
          <div className={styles.confirmModal}>
            <p className={styles.confirmText}>
              Bạn có chắc chắn muốn xóa công việc <strong>"{deletingTodo.title}"</strong> không? Hành động này không thể hoàn tác.
            </p>
            <div className={styles.confirmActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeletingTodo(null)}
                disabled={submitting}
              >
                Hủy
              </button>
              <button
                className={styles.deleteConfirmBtn}
                onClick={() => handleDelete(deletingTodo._id)}
                disabled={submitting}
              >
                {submitting ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Spinner size={14} style={{ marginRight: '6px' }} stroke="#fff" />
                    Đang xóa...
                  </span>
                ) : (
                  'Xóa'
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
