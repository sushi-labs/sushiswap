import {
  DEFAULT_LIST_OF_LISTS,
  type TokenInfo,
  type TokenList,
} from 'sushi/token-list'
import { redis } from '../redis.js'
import { getAddress } from 'viem'
import { isPromiseFulfilled } from 'sushi'

const REDIS_KEY_PREFIX = 'token-list-v2-'

export async function fetchTokensFromLists(chainId?: number) {
  const redisResult = await Promise.allSettled(
    DEFAULT_LIST_OF_LISTS
    .map((url) =>
      redis.get<TokenList | null>(`${REDIS_KEY_PREFIX}-${url}`.toLowerCase()),
    ),
  )
  const tokenLists = redisResult
    .filter(isPromiseFulfilled)
    .map((r) => r.value)
    .filter((v) => v !== null)

    // TODO: this filtering below should be extracted to it's own function, e.g. sushis token lists should take precedence over others, 
    // e.g. partners might have renamed their tokens and those changes might only exist in our token list.
  return chainId
    ? tokenLists.flatMap((tokenList) =>
        tokenList.tokens
          .filter((t) => t.chainId === chainId)
          .map((t) => ({
            ...(t as TokenInfo),
            address: getAddress(t.address), // Token addresses are sometimes lowercase from token lists
          })),
      )
    : tokenLists.flatMap((tokenList) =>
        tokenList.tokens.map((t) => ({
          ...(t as TokenInfo),
          address: getAddress(t.address), // Token addresses are sometimes lowercase from token lists
        })),
      )
}
