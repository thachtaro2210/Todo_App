import { SORT_OPTIONS } from '../../utils/constants';
import styles from './FilterBar.module.css';

const FILTER_TABS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'active', label: 'Đang làm' },
  { value: 'completed', label: 'Hoàn thành' },
];

export default function FilterBar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  onAddClick,
}) {
  return (
    <div className={styles.bar}>
      <div className={styles.row}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Tìm kiếm công việc..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button className={styles.addBtn} onClick={onAddClick}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span style={{ verticalAlign: 'middle' }}>Thêm</span>
        </button>
      </div>

      <div className={styles.row}>
        <div className={styles.tabs}>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              className={`${styles.tab} ${filter === tab.value ? styles.tabActive : ''}`}
              onClick={() => onFilterChange(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          className={styles.sortSelect}
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
