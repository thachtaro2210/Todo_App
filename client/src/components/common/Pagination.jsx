import styles from './Pagination.module.css';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const nums = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(pages, page + 2);

    for (let i = start; i <= end; i++) {
      nums.push(i);
    }
    return nums;
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Trang trước"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      {getPageNumbers().map((num) => (
        <button
          key={num}
          className={`${styles.pageBtn} ${num === page ? styles.activePage : ''}`}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}

      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        aria-label="Trang sau"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <span className={styles.pageInfo}>
        {page}/{pages}
      </span>
    </div>
  );
}
