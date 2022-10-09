import { PrismaClient } from '@prisma/client'

declare global {
  var client: PrismaClient | undefined;
}

const isProduction = process.env.NODE_ENV === "production";

const client =
  global.client ||
  new PrismaClient({
    log: isProduction
      ? ["info", "warn", "error"]
      : ["info", "warn", "error", "query"],
  });

if (!isProduction) global.client = client;

export default client;