import { drizzle } from 'drizzle-orm/libsql';
import { config } from 'dotenv';

config({ path: '.env' })

export const db = drizzle({ connection: {
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
}});