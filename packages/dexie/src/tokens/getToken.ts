import { ChainId } from '@sushiswap/chain'

import { db } from '../db.js'
import { type SavedToken } from './types.js'

export const getToken = async ({
  chainId,
  address,
}: {
  chainId: ChainId | undefined
  address: string | undefined | null
}): Promise<SavedToken | undefined> => {
  if (!chainId || typeof address !== 'string') return
  try {
    const token = await db.tokens.where('id').equals(`${chainId}:${address.toLowerCase()}`).first()
    return token
  } catch (error) {
    console.error(error)
    return undefined
  }
}
