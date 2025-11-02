import { readFileSync } from "fs";
import { join } from "path";
import { z } from "zod";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";

if (!process.env.PRISMA_CLIENT_DATABASE_URL) {
  throw new Error("missing PRISMA_CLIENT_DATABASE_URL in .env");
}

const adapter = new PrismaBetterSQLite3({
  url: process.env.PRISMA_CLIENT_DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function processCategories() {
  // 1. Load and validate categories.json
  const categoriesPath = join(__dirname, "categories.json");
  const categoriesData = JSON.parse(readFileSync(categoriesPath, "utf-8"));

  const CategorySchema = z.object({
    name: z.string(),
  });

  const validatedCategories = z.array(CategorySchema).parse(categoriesData);
  console.log("Validated Categories:", validatedCategories);

  // Upsert categories
  for (const category of validatedCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    });
  }

  console.log("Categories seeded.");
}

async function processArticles() {
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

async function main() {
  console.log("Start seeding...");
  console.log(
    "PRISMA_CLIENT_DATABASE_URL:",
    process.env.PRISMA_CLIENT_DATABASE_URL
  );
  await processCategories();
  await processArticles();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
