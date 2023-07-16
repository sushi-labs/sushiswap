import { Token } from '@sushiswap/currency'
import { PoolCode } from '@sushiswap/router'
import { Address, PublicClient } from 'viem'

import { MultiCallAggregator } from './MulticallAggregator'
import { TokenManager } from './TokenManager'
import { FactoryV2, UniV2Extractor } from './UniV2Extractor'
import { FactoryV3, UniV3Extractor } from './UniV3Extractor'
import { UniV3PoolWatcher, UniV3PoolWatcherStatus } from './UniV3PoolWatcher'

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

export class Extractor {
  extractorV2?: UniV2Extractor
  extractorV3?: UniV3Extractor

  // IMPORTANT: Use different cacheDir for Extractor with the same chainId
  constructor(args: {
    client: PublicClient
    factoriesV2: FactoryV2[]
    factoriesV3: FactoryV3[]
    tickHelperContract: Address
    cacheDir: string
    logDepth: number
    logging?: boolean
  }) {
    const multiCallAggregator = new MultiCallAggregator(args.client)
    const tokenManager = new TokenManager(multiCallAggregator, args.cacheDir, `tokens-${multiCallAggregator.chainId}`)
    if (args.factoriesV2.length > 0)
      this.extractorV2 = new UniV2Extractor(
        args.client,
        args.factoriesV2,
        args.cacheDir,
        args.logDepth,
        args.logging !== undefined ? args.logging : false,
        multiCallAggregator,
        tokenManager
      )
    if (args.factoriesV3.length > 0)
      this.extractorV3 = new UniV3Extractor(
        args.client,
        args.tickHelperContract,
        args.factoriesV3,
        args.cacheDir,
        args.logDepth,
        args.logging !== undefined ? args.logging : false,
        multiCallAggregator,
        tokenManager
      )
  }

  async start(tokensPrefetch: Token[] = []) {
    await Promise.all([this.extractorV2?.start(), this.extractorV3?.start()].filter((e) => e !== undefined))
    this.getPoolCodesForTokens(tokensPrefetch)
  }

  getPoolCodesForTokens(tokens: Token[]): PoolCode[] {
    const pools2 = this.extractorV2 ? this.extractorV2.getPoolsForTokens(tokens).prefetched : []
    const pools3 = this.extractorV3
      ? (this.extractorV3
          .getWatchersForTokens(tokens)
          .prefetched.map((w) => w.getPoolCode())
          .filter((pc) => pc !== undefined) as PoolCode[])
      : []
    return pools2.concat(pools3)
  }

  async getPoolCodesForTokensAsync(tokens: Token[], timeout: number): Promise<PoolCode[]> {
    let poolsV2: PoolCode[] = []
    let watchersV3: UniV3PoolWatcher[] = []
    let promises: Promise<void>[] = []

    if (this.extractorV2) {
      const { prefetched, fetching } = this.extractorV2.getPoolsForTokens(tokens)
      poolsV2 = prefetched
      promises = fetching.map(async (p) => {
        const pc = await p
        if (pc !== undefined) poolsV2.push(pc)
      })
    }

    if (this.extractorV3) {
      const { prefetched, fetching } = this.extractorV3.getWatchersForTokens(tokens)
      watchersV3 = prefetched
      prefetched.forEach((w) => {
        if (w.getStatus() != UniV3PoolWatcherStatus.All) promises.push(w.statusAll())
      })
      promises = promises.concat(
        fetching.map(async (p) => {
          const w = await p
          if (w == undefined) return
          watchersV3.push(w)
          if (w.getStatus() != UniV3PoolWatcherStatus.All) await w.statusAll()
        })
      )
    }

    await Promise.any([Promise.allSettled(promises), delay(timeout)])
    const poolsV3 = watchersV3.map((w) => w.getPoolCode()).filter((pc) => pc !== undefined) as PoolCode[]
    return poolsV3.concat(poolsV2)
  }

  getCurrentPoolCodes() {
    const pools2 = this.extractorV2 ? this.extractorV2.getCurrentPoolCodes() : []
    const pools3 = this.extractorV3 ? this.extractorV3.getCurrentPoolCodes() : []
    return pools2.concat(pools3)
  }
}
