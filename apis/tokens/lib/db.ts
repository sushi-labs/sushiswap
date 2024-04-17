import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import {
  bigint,
  integer,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

const { CMS_DATABASE_URL } = process.env
if (!CMS_DATABASE_URL) {
  throw new Error('CMS_DATABASE_URL must be set')
}

const sql = neon<boolean, boolean>(CMS_DATABASE_URL)

export const databaseClient = drizzle(sql)

export const tokenSchema = pgTable(
  'token',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    chainId: bigint('chainId', { mode: 'number' }).notNull(),
    address: varchar('address', { length: 42 }).notNull(),
    symbol: varchar('symbol', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    decimals: integer('decimals').notNull(),
    addedBy: varchar('addedBy', { length: 255 }).notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (t) => {
    return {
      chainIdAddress: unique().on(t.chainId, t.address),
    }
  },
)

export const chainShema = pgTable('chain', {
  id: bigint('chainId', { mode: 'number' }).unique().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
})

export type Token = typeof tokenSchema.$inferSelect
export type TokenToInsert = Omit<
  typeof tokenSchema.$inferSelect,
  'id' | 'modifiedAt' | 'createdAt'
>

export type Chain = typeof chainShema.$inferSelect
