import styles from './StatsBar.module.css';

export default function StatsBar({ total, completed, active }) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={styles.stats}>
      <div className={styles.stat}>
        <span className={styles.statLabel}>Tổng</span>
        <span className={styles.statValue}>{total}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.statLabel}>Hoàn thành</span>
        <span className={styles.statValue}>{completed}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.statLabel}>Đang làm</span>
        <span className={styles.statValue}>{active}</span>
      </div>
      <div className={styles.progressWrap}>
        <span className={styles.progressLabel}>Tiến độ</span>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${percent}%` }} />
        </div>
        <span className={styles.progressText}>{percent}%</span>
      </div>
    </div>
  );
}
