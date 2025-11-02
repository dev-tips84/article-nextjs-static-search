import { readFileSync } from "fs";
import { join } from "path";
import { z } from "zod";

async function main() {
  console.log("Start seeding...");

  // 1. Load and validate categories.json
  const categoriesPath = join(__dirname, "categories.json");
  const categoriesData = JSON.parse(readFileSync(categoriesPath, "utf-8"));

  const CategorySchema = z.object({
    name: z.string(),
  });

  const validatedCategories = z.array(CategorySchema).parse(categoriesData);
  console.log("Validated Categories:", validatedCategories);

  // 2. Load and validate articles.json
  const articlesPath = join(__dirname, "articles.json");
  const articlesData = JSON.parse(readFileSync(articlesPath, "utf-8"));

  const ArticleSchema = z.object({
    title: z.string(),
    article: z.string(),
    category: z.string(),
    date: z.string(),
    views: z.number(),
    tags: z.array(z.string()),
  });

  const validatedArticles = z.array(ArticleSchema).parse(articlesData);
  console.log("Validated Articles:", validatedArticles);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {});
