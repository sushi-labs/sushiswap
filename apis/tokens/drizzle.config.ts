import type { Config } from 'drizzle-kit'
const { CMS_DATABASE_URL } = process.env
if (!CMS_DATABASE_URL) {
  throw new Error('CMS_DATABASE_URL must be set')
}
export default {
  schema: "./lib/db.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    database: 'CMS',
    connectionString: CMS_DATABASE_URL,
  },
} satisfies Config
