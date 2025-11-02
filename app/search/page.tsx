import styles from "./page.module.css";
import path from "path";
import { promises as fsPromises } from "fs";

interface Article {
  title: string;
  article: string;
  category: string;
  date: string;
  views: number;
  tags: string[];
}

async function getSearchResult(query: string): Promise<Article[]> {
  const filePath = path.join(process.cwd(), "app/search/articles.json");
  const fileContents = await fsPromises.readFile(filePath, "utf8");
  const allArticles: Article[] = JSON.parse(fileContents);

  if (!query) {
    return allArticles;
  }

  const lowerCaseQuery = query.toLowerCase();

  return allArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerCaseQuery) ||
      article.article.toLowerCase().includes(lowerCaseQuery)
  );
}

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queryParam = (await searchParams).query;
  const query = typeof queryParam === "string" ? queryParam : "";

  const newsArticles = await getSearchResult(query);

  return (
    <div className={styles.container}>
      <h1>検索結果</h1>
      {newsArticles.length === 0 ? (
        <p>検索結果なし</p>
      ) : (
        <div className={styles.gridContainer}>
          {newsArticles.map((article, index) => (
            <div key={index} className={styles.articleCard}>
              <h2>{article.title}</h2>
              <p><strong>カテゴリ:</strong> <span className={styles.categoryPill}>{article.category}</span></p>
              <p><strong>日付:</strong> {article.date}</p>
              <p>{article.article.substring(0, 150)}...</p> {/* Displaying a snippet */}
              <p><strong>タグ:</strong> {article.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className={styles.tagPill}>{tag}</span>
              ))}</p>
              <p><strong>閲覧数:</strong> {article.views.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
