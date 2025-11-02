import styles from "./page.module.css";
import path from "path";
import { promises as fsPromises } from "fs";
import { z } from "zod";

interface Article {
  title: string;
  article: string;
  category: string;
  date: string;
  views: number;
  tags: string[];
}

const ArticleSchema = z.object({
  title: z.string(),
  article: z.string(),
  category: z.string(),
  date: z.string(),
  views: z.number(),
  tags: z.array(z.string()),
}) satisfies z.ZodType<Article>;

async function getAllCategories(): Promise<string[]> {
  const filePath = path.join(process.cwd(), "app/search/articles.json");
  const fileContents = await fsPromises.readFile(filePath, "utf8");
  const allArticles: Article[] = JSON.parse(fileContents);
  const categories = new Set<string>();
  allArticles.forEach((article) => categories.add(article.category));
  return Array.from(categories).sort();
}

async function getSearchResult(
  query: string,
  selectedCategories: string[]
): Promise<Article[]> {
  const filePath = path.join(process.cwd(), "app/search/articles.json");
  const fileContents = await fsPromises.readFile(filePath, "utf8");
  const parsedArticles = JSON.parse(fileContents);
  const allArticles = ArticleSchema.array().parse(parsedArticles);

  let filteredArticles = allArticles;

  if (query) {
    const lowerCaseQuery = query.toLowerCase();
    filteredArticles = filteredArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerCaseQuery) ||
        article.article.toLowerCase().includes(lowerCaseQuery)
    );
  }

  if (selectedCategories.length > 0) {
    filteredArticles = filteredArticles.filter((article) =>
      selectedCategories.includes(article.category)
    );
  }

  return filteredArticles;
}

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queryParam = (await searchParams).query;
  const query = typeof queryParam === "string" ? queryParam : "";

  const categoryParam = (await searchParams).category;
  const selectedCategories = Array.isArray(categoryParam)
    ? categoryParam
    : typeof categoryParam === "string" && categoryParam !== ""
    ? [categoryParam]
    : [];

  const allCategories = await getAllCategories();

  const newsArticles = await getSearchResult(query, selectedCategories);

  return (
    <div className={styles.container}>
      <form action="/search" method="GET" className={styles.searchForm}>
        <div className={styles.searchInputContainer}>
          <input
            type="text"
            name="query"
            defaultValue={query}
            placeholder="キーワードを入力"
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </div>

        <details
          open={selectedCategories.length > 0}
          className={styles.detailsContainer}
        >
          <summary className={styles.detailsSummary}>詳細検索</summary>
          <div className={styles.categoryGrid}>
            {allCategories.map((category) => (
              <label key={category} className={styles.categoryLabel}>
                <input
                  type="checkbox"
                  name="category"
                  value={category}
                  defaultChecked={selectedCategories.includes(category)}
                  className={styles.categoryCheckbox}
                />
                {category}
              </label>
            ))}
          </div>
        </details>
      </form>

      <h1>検索結果</h1>
      {newsArticles.length === 0 ? (
        <p>検索結果なし</p>
      ) : (
        <div className={styles.gridContainer}>
          {newsArticles.map((article, index) => (
            <div key={index} className={styles.articleCard}>
              <h2>{article.title}</h2>
              <p>
                <strong>カテゴリ:</strong>{" "}
                <span className={styles.categoryPill}>{article.category}</span>
              </p>
              <p>
                <strong>日付:</strong> {article.date}
              </p>
              <p>{article.article.substring(0, 150)}...</p>{" "}
              {/* Displaying a snippet */}
              <p>
                <strong>タグ:</strong>{" "}
                {article.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className={styles.tagPill}>
                    {tag}
                  </span>
                ))}
              </p>
              <p>
                <strong>閲覧数:</strong> {article.views.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
