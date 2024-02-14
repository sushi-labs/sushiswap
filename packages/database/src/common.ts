import { type Prisma } from '@prisma/client'

export const defaultPrismaClientOptions = {
  datasources: {
    db: {
      url: process.env['DATABASE_URL'] as string,
    },
  },
  // log: ['query'],
} satisfies Prisma.PrismaClientOptions

/**
 *
 * Deep-replaces the Prisma.Decimal type with string, which prisma actually returns.
 * Will add 'string' for null-only types, don't think we should ever come across those though.
 */
export type DecimalToString<T> = {
  [P in keyof T]: T[P] extends Prisma.Decimal | null
    ? Exclude<T[P], Prisma.Decimal> | string
    : T[P] extends unknown[]
    ? DecimalToString<T[P][0]>[]
    : T[P] extends object
    ? DecimalToString<T[P]>
    : T[P]
}
