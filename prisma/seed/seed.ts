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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {});
