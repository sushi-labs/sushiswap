import { db } from '../db.js'
import { type SavedToken } from './types.js'

export const saveTokens = async ({ tokens }: { tokens: SavedToken[] }) => {
  try {
    await db.tokens.bulkPut(tokens)
  } catch (error) {
    console.error(error)
  }
}
