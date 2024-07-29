import { Token } from 'sushi/currency'
import { PoolCode } from 'sushi/router'

export abstract class IExtractor {
  // Starts extracting
  async start() {}
  abstract isStarted(): boolean

  // Returns all pools between tokensUnique
  // @param tokensUnique unique list of tokens
  abstract getPoolsForTokens(tokensUnique: Token[]): {
    prefetched: PoolCode[]
    fetching: Promise<PoolCode | undefined>[]
  }

  //  Returns all pools between tokensUnique1 and tokensUnique2 tokens
  // @param tokensUnique1 first unique list of tokens
  // @param tokensUnique2 second unique list of tokens
  abstract getPoolsBetweenTokenSets(
    tokensUnique1: Token[],
    tokensUnique2: Token[],
  ): {
    prefetched: PoolCode[]
    fetching: Promise<PoolCode | undefined>[]
  }

  // Returns all currently fetched pools
  abstract getCurrentPoolCodes(): PoolCode[]

  // Returns all pools changed or new from previous call of this function
  abstract getUpdatedPoolCodes(): PoolCode[]

  // For each token T of each pool make: tokenMap[T] += 1
  abstract getTokensPoolsQuantity(tokenMap: Map<Token, number>): void
}
