import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './config/schema.js', // Adjust the path if necessary
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL;
  },
});
