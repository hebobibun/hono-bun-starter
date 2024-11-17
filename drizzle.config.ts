import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env' })

export default defineConfig({
  schema: './src/application/db/schema.ts',
  out: './migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
});
