import { useTheme } from '../../contexts/ThemeContext';
import styles from './Header.module.css';

export default function Header() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>T</div>
          <h1 className={styles.title}>Todo App</h1>
        </div>
        <button
          className={styles.themeBtn}
          onClick={toggleTheme}
          aria-label="Chuyển đổi chế độ sáng/tối"
        >
          {darkMode ? 'Sáng' : 'Tối'}
        </button>
      </div>
    </header>
  );
}
