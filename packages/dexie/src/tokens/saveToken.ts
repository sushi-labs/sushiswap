import { db } from '../db'
import { SavedToken } from './types'

export const saveTokens = async ({ tokens }: { tokens: SavedToken[] }) => {
  try {
    await db.tokens.bulkPut(tokens)
  } catch (error) {
    console.error(error)
  }
}
