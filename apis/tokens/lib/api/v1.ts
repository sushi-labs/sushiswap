import {
  DEFAULT_LIST_OF_LISTS,
  SUSHI_DEFAULT_TOKEN_LIST,
  type TokenInfo,
  type TokenList,
} from 'sushi/token-list'
import { getAddress } from 'viem'
import { redis } from '../redis.js'

const REDIS_KEY_PREFIX = 'token-list-v2-'

export async function fetchTokensFromLists(chainId: number) {
  const redisResult = await Promise.all(
    DEFAULT_LIST_OF_LISTS.map(async (url) => {
      const value = await redis.get<TokenList | null>(
        `${REDIS_KEY_PREFIX}-${url}`.toLowerCase(),
      )
      return [url, value] as [string, TokenList | null]
    }),
  )

  const tokenLists = new Map<string, TokenList>(
    redisResult
      .filter(([_, v]) => v !== null)
      .map(([url, v]) => [url, v as TokenList]),
  )

  return merge(tokenLists, chainId)
}

function merge(tokenLists: Map<string, TokenList>, chainId: number) {
  const tokens = new Map<string, TokenInfo>()

  // Set sushi default tokens first, they will take precedence
  tokenLists
    .get(SUSHI_DEFAULT_TOKEN_LIST)
    ?.tokens.filter((token) => token.chainId === chainId)
    .forEach((token) => {
      try {
        tokens.set(token.address.toLowerCase(), {
          ...(token as TokenInfo),
          address: getAddress(token.address), // Token addresses are sometimes lowercase from token lists
        })
      } catch (_e) {}
    })

  tokenLists.forEach((tokenList, url) => {
    if (url === SUSHI_DEFAULT_TOKEN_LIST) return // skip because we already ran this
    tokenList?.tokens
      .filter((token) => token.chainId === chainId)
      .forEach((token) => {
        if (!tokens.has(token.address.toLowerCase())) {
          try {
            tokens.set(token.address.toLowerCase(), {
              ...(token as TokenInfo),
              address: getAddress(token.address), // Token addresses are sometimes lowercase from token lists
            })
          } catch (_e) {}
        }
      })
  })
  return Array.from(tokens.values())
}
