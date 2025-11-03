import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";

if (!process.env.PRISMA_CLIENT_DATABASE_URL) {
  throw new Error("missing PRISMA_CLIENT_DATABASE_URL in .env");
}

const adapter = new PrismaBetterSQLite3({
  url: process.env.PRISMA_CLIENT_DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });
