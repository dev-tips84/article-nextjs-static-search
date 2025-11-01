import React from "react";
import styles from "./page.module.css";
import fs from "fs";
import path from "path";

interface Article {
  title: string;
  article: string;
  category: string;
  date: string;
  views: number;
  tags: string[];
}

export default function SearchResultsPage() {
  const filePath = path.join(process.cwd(), "app/search/articles.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const newsArticles: Article[] = JSON.parse(fileContents);

  return (
    <div className={styles.container}>
      <h1>検索結果</h1>
      {newsArticles.map((article, index) => (
        <div key={index} className={styles.articleCard}>
          <h2>{article.title}</h2>
          <p>
            <strong>カテゴリ:</strong> {article.category}
          </p>
          <p>
            <strong>日付:</strong> {article.date}
          </p>
          <p>{article.article.substring(0, 150)}...</p>{" "}
          {/* Displaying a snippet */}
          <p>
            <strong>タグ:</strong> {article.tags.join(", ")}
          </p>
          <p>
            <strong>閲覧数:</strong> {article.views}
          </p>
        </div>
      ))}
    </div>
  );
}
