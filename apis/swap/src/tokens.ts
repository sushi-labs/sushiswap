import 'dotenv/config'

import type { ChainId } from '@sushiswap/chain'
import {
  currencyFromShortCurrencyName,
  isShortCurrencyName,
  isShortCurrencyNameSupported,
  Token,
} from '@sushiswap/currency'
import { getAddress } from 'ethers/lib/utils'
import fetch from 'node-fetch'
import { z } from 'zod'

const tokenSchema = z.object({
  address: z.coerce.string(),
  symbol: z.string(),
  name: z.string(),
  decimals: z.coerce.number().int().gte(0),
})

const tokenCache: Map<ChainId, Map<string, typeof tokenSchema['_type']>> = new Map()

async function fetcher(chainId: ChainId, tokenId: string) {
  const cachedChain = tokenCache.get(chainId)
  const cachedToken = cachedChain?.get(tokenId)
  if (cachedToken) return cachedToken

  const token = tokenSchema.parse(
    await (await fetch(`https://tokens.sushi.com/v0/${chainId}/${getAddress(tokenId)}`)).json()
  )

  if (!cachedChain) {
    tokenCache.set(chainId, new Map())
  }

  tokenCache.get(chainId)?.set(tokenId, token)

  return token
}

export async function getToken(chainId: ChainId, tokenId: string) {
  const isShortNameSupported = isShortCurrencyNameSupported(chainId)
  const tokenIdIsShortName = isShortCurrencyName(chainId, tokenId)

  return isShortNameSupported && tokenIdIsShortName
    ? currencyFromShortCurrencyName(chainId, tokenId)
    : new Token({
        chainId,
        ...(await fetcher(chainId, tokenId)),
      })
}
