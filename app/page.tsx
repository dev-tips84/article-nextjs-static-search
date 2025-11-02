import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <form action="/search">
        <input type="text" placeholder="Search..." className={styles.searchInput} name="query" />
        <button type="submit" className={styles.searchButton}>Search</button>
      </form>
    </div>
  );
}