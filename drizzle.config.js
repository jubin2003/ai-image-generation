import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './config/schema.js', // Adjust the path if necessary
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:4KBDTFNoGOs3@ep-crimson-sea-a5muscn8.us-east-2.aws.neon.tech/ai-room-redesign?sslmode=require', // Use environment variable
  },
});
