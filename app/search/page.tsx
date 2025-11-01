
import React from 'react';
import styles from './page.module.css';

const newsArticles = [
  {
    "title": "日本復活党、新たな農業政策を発表 - 食料自給率向上へ",
    "article": "日本復活党は本日、食料自給率の大幅な向上を目指す新たな農業政策を発表した。農水省と連携し、スマート農業技術の導入支援、若手農業従事者への補助金拡充、そして休耕地の有効活用を推進する。党首は「日本の食の安全保障を確立し、持続可能な農業を実現する」と述べた。",
    "category": "政治",
    "date": "2025-01-01",
    "views": 28000,
    "tags": ["日本復活党", "農水省"]
  },
  {
    "title": "AI技術が自動車産業を革新 - 新たな投資と雇用創出の期待",
    "article": "AI技術の急速な進化が、日本の自動車産業に大きな変革をもたらしている。大手自動車メーカーは、自動運転技術や生産ラインの最適化にAIを導入し、効率化とコスト削減を実現。これにより、新たな研究開発への投資が活発化し、AI関連分野での雇用創出も期待されている。政府は、AI技術開発への支援を強化し、国際競争力の維持を目指す方針だ。",
    "category": "経済",
    "date": "2025-01-01",
    "views": 18050,
    "tags": ["自動車", "貿易", "投資", "AI"]
  },
  {
    "title": "日米ASEAN首脳会談、地域安全保障と経済連携を強化",
    "article": "2025年1月1日、日米ASEAN首脳会談が開催され、インド太平洋地域の安全保障と経済連携の強化について議論された。米国は、地域における自由で開かれた秩序の維持を強調し、日本とASEAN諸国は、海洋安全保障協力の推進とサプライチェーンの強靭化で合意。共同声明では、地域課題への共同対処と多国間主義の重要性が再確認された。",
    "category": "外交",
    "date": "2025-01-01",
    "views": 4025,
    "tags": ["米国", "ASEAN"]
  }
];

export default function SearchResultsPage() {
  return (
    <div className={styles.container}>
      <h1>検索結果</h1>
      {newsArticles.map((article, index) => (
        <div key={index} className={styles.articleCard}>
          <h2>{article.title}</h2>
          <p><strong>カテゴリ:</strong> {article.category}</p>
          <p><strong>日付:</strong> {article.date}</p>
          <p>{article.article.substring(0, 150)}...</p> {/* Displaying a snippet */}
          <p><strong>タグ:</strong> {article.tags.join(', ')}</p>
          <p><strong>閲覧数:</strong> {article.views}</p>
        </div>
      ))}
    </div>
  );
}
