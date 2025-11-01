import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <input type="text" placeholder="Search..." className={styles.searchInput} />
      <button className={styles.searchButton}>Search</button>
    </div>
  );
}