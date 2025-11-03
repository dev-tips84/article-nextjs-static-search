import styles from "./page.module.css";
import { prisma } from "../../prisma/lib";

async function getAllCategories() {
  const allCategories = await prisma.category.findMany();
  return allCategories.map((x) => x.name);
}

async function getSearchResult(query: string, selectedCategories: string[]) {
  const allArticles = await prisma.article.findMany({
    include: {
      category: true,
      tags: true,
    },
  });

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
      selectedCategories.includes(article.category.name)
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
                <span className={styles.categoryPill}>
                  {article.category.name}
                </span>
              </p>
              <p>
                <strong>日付:</strong> {article.date.toDateString()}
              </p>
              <p>{article.article.substring(0, 150)}...</p>{" "}
              {/* Displaying a snippet */}
              <p>
                <strong>タグ:</strong>{" "}
                {article.tags.map((t) => (
                  <span key={t.name} className={styles.tagPill}>
                    {t.name}
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
