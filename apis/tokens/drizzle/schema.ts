import {
  bigint,
  integer,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const chain = pgTable('chain', {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  chainId: bigint('chainId', { mode: 'number' }).primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
})

export const token = pgTable(
  'token',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    chainId: bigint('chainId', { mode: 'number' }).notNull(),
    address: varchar('address', { length: 42 }).notNull(),
    symbol: varchar('symbol', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    decimals: integer('decimals').notNull(),
    addedBy: varchar('addedBy', { length: 255 }).notNull(),
    createdAt: timestamp('createdAt', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      tokenChainIdAddressUnique: unique('token_chainId_address_unique').on(
        table.chainId,
        table.address,
      ),
    }
  },
)
