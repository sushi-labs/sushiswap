import { mkdir, open } from 'node:fs/promises'
import path from 'node:path'

import { PoolCode } from '@sushiswap/router'
import { Token } from 'sushi/currency'
import { Address, PublicClient } from 'viem'

import { AlgebraExtractor, FactoryAlgebra } from './AlgebraExtractor'
import {
  AlgebraPoolWatcher,
  AlgebraPoolWatcherStatus,
} from './AlgebraPoolWatcher'
import { LogFilter2, LogFilterType } from './LogFilter2'
import { MultiCallAggregator } from './MulticallAggregator'
import { TokenManager } from './TokenManager'
import { FactoryV2, UniV2Extractor } from './UniV2Extractor'
import { FactoryV3, UniV3Extractor } from './UniV3Extractor'
import { UniV3PoolWatcher, UniV3PoolWatcherStatus } from './UniV3PoolWatcher'
import { WarningMessageHandler, setWarningMessageHandler } from './WarnLog'

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

// TODO: cache for not-existed pools?
// TODO: to fill address cache from pool cache

// Usage recomendation:
//  - getPoolCodesForTokens/getPoolCodesForTokensAsync consumes much processor resources for new token sets -
//    about 50ms. Some quantity of routing requests can be processed on the same process as Extractor
//    But for significant loading it is better to deploy Extractor on a separate server
//    and have several servers for routing. Extractor server can provide all pools by getCurrentPoolCodes()
//  - direct logs (std output) to console
//  - direct warnings (std error) to a file
export class Extractor {
  client: PublicClient
  extractorV2?: UniV2Extractor
  extractorV3?: UniV3Extractor
  extractorAlg?: AlgebraExtractor
  multiCallAggregator: MultiCallAggregator
  tokenManager: TokenManager
  readonly logFilter: LogFilter2
  cacheDir: string
  logging?: boolean
  requestStartedNum = 0
  requestFinishedNum = 0
  requestFailedNum = 0

  /// @param client
  /// @param factoriesV2 list of supported V2 factories
  /// @param factoriesV3 list of supported V3 factories
  /// @param tickHelperContract address of helper contract for pool's ticks download
  /// @param cacheDir directory for cache
  //                  IMPORTANT: Use different cacheDir for Extractors with the same chainId
  /// @param logDepth the depth of logs to keep in memory for reorgs
  /// @param logging to write logs in console or not
  constructor(args: {
    client: PublicClient
    factoriesV2?: FactoryV2[]
    factoriesV3?: FactoryV3[]
    factoriesAlgebra?: FactoryAlgebra[]
    tickHelperContract: Address
    cacheDir: string
    logType?: LogFilterType
    logDepth: number
    logging?: boolean
    maxCallsInOneBatch?: number
    warningMessageHandler?: WarningMessageHandler
  }) {
    this.cacheDir = args.cacheDir
    this.logging = args.logging
    this.client = args.client
    this.multiCallAggregator = new MultiCallAggregator(
      args.client,
      args.maxCallsInOneBatch ?? 0,
    )
    this.tokenManager = new TokenManager(
      this.multiCallAggregator,
      args.cacheDir,
      `tokens-${this.multiCallAggregator.chainId}`,
    )
    this.logFilter = new LogFilter2(
      this.client,
      args.logDepth,
      args.logType ?? LogFilterType.OneCall,
      args.logging,
    )
    if (args.factoriesV2 && args.factoriesV2.length > 0)
      this.extractorV2 = new UniV2Extractor(
        this.client,
        args.factoriesV2,
        args.cacheDir,
        this.logFilter,
        args.logging !== undefined ? args.logging : false,
        this.multiCallAggregator,
        this.tokenManager,
      )
    if (args.factoriesV3 && args.factoriesV3.length > 0)
      this.extractorV3 = new UniV3Extractor(
        this.client,
        args.tickHelperContract,
        args.factoriesV3,
        args.cacheDir,
        this.logFilter,
        args.logging !== undefined ? args.logging : false,
        this.multiCallAggregator,
        this.tokenManager,
      )
    if (args.factoriesAlgebra && args.factoriesAlgebra.length > 0)
      this.extractorAlg = new AlgebraExtractor(
        this.client,
        args.tickHelperContract,
        args.factoriesAlgebra,
        args.cacheDir,
        this.logFilter,
        args.logging !== undefined ? args.logging : false,
        this.multiCallAggregator,
        this.tokenManager,
      )
    setWarningMessageHandler(args.warningMessageHandler)
  }

  /// @param tokensBaseSet Prefetch all pools between these tokens
  /// @param tokensAdditionalSet Prefetch all pools between tokensBaseSet and tokensAdditionalSet
  async start(tokensBaseSet: Token[] = [], tokensAdditionalSet: Token[] = []) {
    this.logFilter.start()
    await Promise.all(
      [
        this.extractorV2?.start(),
        this.extractorV3?.start(),
        this.extractorAlg?.start(),
      ].filter((e) => e !== undefined),
    )
    await this.prefetch(tokensBaseSet, tokensAdditionalSet)
    if (this.cacheDir !== '')
      this.printTokensPoolsQuantity(
        this.cacheDir,
        `TokensStatus-${this.multiCallAggregator?.chainId}`,
      )
    this.reportRequestStatistics()
  }

  lastRequestStartedNum = 0
  rpcCalled = 0
  rpcProcessed = 0
  rpcFailed = 0
  rpcMCalled = 0
  rpcMProcessed = 0
  rpcMFailed = 0
  rpcTime = 0
  lastRequestLogTime = Date.now()
  reportRequestStatistics() {
    if (!this.logging) return
    //if (this.lastRequestStartedNum < this.requestStartedNum) {
    const now = Date.now()
    console.log(
      `${this.multiCallAggregator.chainId} Requests: ` +
        `${this.requestStartedNum} total, ` +
        `${this.requestStartedNum - this.requestFinishedNum} pending, ` +
        `${this.requestFailedNum} failed, ` +
        `${
          this.requestStartedNum - this.lastRequestStartedNum
        } in the last ${Math.round(
          (now - this.lastRequestLogTime) / 1000,
        )} sec`,
    )
    this.lastRequestStartedNum = this.requestStartedNum
    //}

    const processed =
      this.multiCallAggregator.totalCallsProcessed - this.rpcProcessed
    const processedM =
      this.multiCallAggregator.totalMCallsProcessed - this.rpcMProcessed
    console.log(
      `${this.multiCallAggregator.chainId} RPC last ${Math.round(
        (now - this.lastRequestLogTime) / 1000,
      )} sec: Calls` +
        ` +${this.multiCallAggregator.totalCalls - this.rpcCalled}` +
        ` -${processed}` +
        ` x${this.multiCallAggregator.totalCallsFailed - this.rpcFailed}` +
        ` p${
          this.multiCallAggregator.totalCalls -
          this.multiCallAggregator.totalCallsProcessed -
          this.multiCallAggregator.totalCallsFailed
        }` +
        ` ${
          processed > 0
            ? Math.round(
                (this.multiCallAggregator.totalTimeSpent - this.rpcTime) /
                  processed,
              )
            : 0
        }ms, MultiCalls` +
        ` +${this.multiCallAggregator.totalMCalls - this.rpcMCalled}` +
        ` -${processedM}` +
        ` x${this.multiCallAggregator.totalMCallsFailed - this.rpcMFailed}` +
        ` p${
          this.multiCallAggregator.totalMCalls -
          this.multiCallAggregator.totalMCallsProcessed -
          this.multiCallAggregator.totalMCallsFailed
        }` +
        ` ${
          processedM > 0
            ? Math.round(
                (this.multiCallAggregator.totalTimeSpent - this.rpcTime) /
                  processedM,
              )
            : 0
        }ms`,
    )
    this.rpcCalled = this.multiCallAggregator.totalCalls
    this.rpcProcessed = this.multiCallAggregator.totalCallsProcessed
    this.rpcFailed = this.multiCallAggregator.totalCallsFailed
    this.rpcMCalled = this.multiCallAggregator.totalMCalls
    this.rpcMProcessed = this.multiCallAggregator.totalMCallsProcessed
    this.rpcMFailed = this.multiCallAggregator.totalMCallsFailed
    this.rpcTime = this.multiCallAggregator.totalTimeSpent

    this.lastRequestLogTime = now
    setTimeout(() => this.reportRequestStatistics(), 60_000)
  }

  getPoolCodesForTokens(tokens: Token[]): PoolCode[] {
    ++this.requestStartedNum
    try {
      const tokenMap = new Map<string, Token>()
      tokens.forEach((t) => tokenMap.set(t.address, t))
      const tokensUnique = Array.from(tokenMap.values())

      const pools2 = this.extractorV2
        ? this.extractorV2.getPoolsForTokens(tokensUnique).prefetched
        : []
      const pools3 = this.extractorV3
        ? (this.extractorV3
            .getWatchersForTokens(tokensUnique)
            .prefetched.map((w) => w.getPoolCode())
            .filter((pc) => pc !== undefined) as PoolCode[])
        : []
      const poolsAlg = this.extractorAlg
        ? (this.extractorAlg
            .getWatchersForTokens(tokensUnique)
            .prefetched.map((w) => w.getPoolCode())
            .filter((pc) => pc !== undefined) as PoolCode[])
        : []
      ++this.requestFinishedNum
      return pools2.concat(pools3).concat(poolsAlg)
    } catch (e) {
      ++this.requestFinishedNum
      ++this.requestFailedNum
      throw e
    }
  }

  // downloads pools for all pairs from tokensBaseSet and between tokensBaseSet and tokensAdditionalSet
  async prefetch(
    tokensBaseSet: Token[],
    tokensAdditionalSet: Token[],
  ): Promise<void> {
    ++this.requestStartedNum
    try {
      const baseMap = new Map<string, Token>()
      tokensBaseSet.forEach((t) => baseMap.set(t.address, t))
      const baseUnique = Array.from(baseMap.values())

      const addMap = new Map<string, Token>()
      tokensAdditionalSet.forEach((t) => {
        if (baseMap.get(t.address) === undefined) addMap.set(t.address, t)
      })
      const addUnique = Array.from(addMap.values())

      let fetching: Promise<unknown>[] = []

      if (this.extractorV2) {
        fetching = fetching.concat(
          this.extractorV2.getPoolsForTokens(baseUnique).fetching,
        )
        fetching = fetching.concat(
          this.extractorV2.getPoolsBetweenTokenSets(baseUnique, addUnique)
            .fetching,
        )
      }
      if (this.extractorV3) {
        fetching = fetching.concat(
          this.extractorV3.getWatchersForTokens(baseUnique).fetching,
        )
        fetching = fetching.concat(
          this.extractorV3.getWatchersBetweenTokenSets(baseUnique, addUnique)
            .fetching,
        )
      }
      if (this.extractorAlg) {
        fetching = fetching.concat(
          this.extractorAlg.getWatchersForTokens(baseUnique).fetching,
        )
        fetching = fetching.concat(
          this.extractorAlg.getWatchersBetweenTokenSets(baseUnique, addUnique)
            .fetching,
        )
      }
      await Promise.allSettled(fetching)
      ++this.requestFinishedNum
    } catch (e) {
      ++this.requestFinishedNum
      ++this.requestFailedNum
      throw e
    }
  }

  async getPoolCodesBetweenTokenSets(
    tokens1: Token[],
    tokens2: Token[],
  ): Promise<PoolCode[]> {
    ++this.requestStartedNum
    try {
      const map1 = new Map<string, Token>()
      tokens1.forEach((t) => map1.set(t.address, t))
      const tokens1Unique = Array.from(map1.values())

      const map2 = new Map<string, Token>()
      tokens2.forEach((t) => {
        if (map1.get(t.address) === undefined) map2.set(t.address, t)
      })
      const tokens2Unique = Array.from(map2.values())

      let prefetchedAll: (PoolCode | undefined)[] = []
      let fetchingAll: Promise<unknown>[] = []

      if (this.extractorV2) {
        const { prefetched, fetching } =
          this.extractorV2.getPoolsBetweenTokenSets(
            tokens1Unique,
            tokens2Unique,
          )
        prefetchedAll = prefetchedAll.concat(prefetched)
        fetchingAll = fetchingAll.concat(fetching)
      }
      if (this.extractorV3) {
        const { prefetched, fetching } =
          this.extractorV3.getWatchersBetweenTokenSets(
            tokens1Unique,
            tokens2Unique,
          )
        prefetchedAll = prefetchedAll.concat(
          prefetched.map((w) => w.getPoolCode()),
        )
        fetchingAll = fetchingAll.concat(fetching)
      }
      if (this.extractorAlg) {
        const { prefetched, fetching } =
          this.extractorAlg.getWatchersBetweenTokenSets(
            tokens1Unique,
            tokens2Unique,
          )
        prefetchedAll = prefetchedAll.concat(
          prefetched.map((w) => w.getPoolCode()),
        )
        fetchingAll = fetchingAll.concat(fetching)
      }
      const fetchedAll = await Promise.allSettled(fetchingAll)
      const res = prefetchedAll
        .concat(
          fetchedAll.map((p) => {
            if (p === undefined) return undefined
            if (p instanceof PoolCode) return p
            if (p instanceof UniV3PoolWatcher) return p.getPoolCode()
            if (p instanceof AlgebraPoolWatcher) return p.getPoolCode()
          }),
        )
        .filter((p) => p !== undefined) as PoolCode[]
      ++this.requestFinishedNum
      return res
    } catch (e) {
      ++this.requestFinishedNum
      ++this.requestFailedNum
      throw e
    }
  }

  getPoolCodesForTokensFull(tokens: Token[]): {
    prefetched: PoolCode[]
    fetchingNumber: number
  } {
    ++this.requestStartedNum
    try {
      const tokenMap = new Map<string, Token>()
      tokens.forEach((t) => tokenMap.set(t.address, t))
      const tokensUnique = Array.from(tokenMap.values())

      let prefetched: PoolCode[] = []
      let fetchingNumber = 0
      if (this.extractorV2) {
        const pools2 = this.extractorV2.getPoolsForTokens(tokensUnique)
        prefetched = pools2.prefetched
        fetchingNumber = pools2.fetching.length
      }
      if (this.extractorV3) {
        const pools3 = this.extractorV3.getWatchersForTokens(tokensUnique)
        const pools3Prefetched = pools3.prefetched
          .map((w) => w.getPoolCode())
          .filter((pc) => pc !== undefined) as PoolCode[]

        prefetched = prefetched.concat(pools3Prefetched)
        fetchingNumber += pools3.fetching.length
      }
      if (this.extractorAlg) {
        const poolsAlg = this.extractorAlg.getWatchersForTokens(tokensUnique)
        const poolsAlgPrefetched = poolsAlg.prefetched
          .map((w) => w.getPoolCode())
          .filter((pc) => pc !== undefined) as PoolCode[]

        prefetched = prefetched.concat(poolsAlgPrefetched)
        fetchingNumber += poolsAlg.fetching.length
      }
      ++this.requestFinishedNum
      return { prefetched, fetchingNumber }
    } catch (e) {
      ++this.requestFinishedNum
      ++this.requestFailedNum
      throw e
    }
  }

  async getPoolCodesForTokensAsync(
    tokens: Token[],
    timeout: number,
  ): Promise<PoolCode[]> {
    ++this.requestStartedNum
    try {
      let poolsV2: PoolCode[] = []
      let watchersV3: UniV3PoolWatcher[] = []
      let watchersAlg: AlgebraPoolWatcher[] = []
      let promises: Promise<void>[] = []

      const tokenMap = new Map<string, Token>()
      tokens.forEach((t) => tokenMap.set(t.address, t))
      const tokensUnique = Array.from(tokenMap.values())

      if (this.extractorV2) {
        const { prefetched, fetching } =
          this.extractorV2.getPoolsForTokens(tokensUnique)
        poolsV2 = prefetched
        promises = fetching.map(async (p) => {
          const pc = await p
          if (pc !== undefined) poolsV2.push(pc)
        })
      }

      if (this.extractorV3) {
        const { prefetched, fetching } =
          this.extractorV3.getWatchersForTokens(tokensUnique)
        watchersV3 = prefetched
        prefetched.forEach((w) => {
          if (w.getStatus() !== UniV3PoolWatcherStatus.All)
            promises.push(w.statusAll())
        })
        promises = promises.concat(
          fetching.map(async (p) => {
            const w = await p
            if (w === undefined) return
            watchersV3.push(w)
            if (w.getStatus() !== UniV3PoolWatcherStatus.All)
              await w.statusAll()
          }),
        )
      }

      if (this.extractorAlg) {
        const { prefetched, fetching } =
          this.extractorAlg.getWatchersForTokens(tokensUnique)
        watchersAlg = prefetched
        prefetched.forEach((w) => {
          if (w.getStatus() !== AlgebraPoolWatcherStatus.All)
            promises.push(w.statusAll())
        })
        promises = promises.concat(
          fetching.map(async (p) => {
            const w = await p
            if (w === undefined) return
            watchersAlg.push(w)
            if (w.getStatus() !== AlgebraPoolWatcherStatus.All)
              await w.statusAll()
          }),
        )
      }

      await Promise.any([Promise.allSettled(promises), delay(timeout)])
      const poolsV3 = watchersV3
        .map((w) => w.getPoolCode())
        .filter(
          (pc) =>
            pc !== undefined && pc.pool.reserve0 > 0n && pc.pool.reserve1 > 0n,
        ) as PoolCode[]
      const poolsAlg = watchersAlg
        .map((w) => w.getPoolCode())
        .filter(
          (pc) =>
            pc !== undefined && pc.pool.reserve0 > 0n && pc.pool.reserve1 > 0n,
        ) as PoolCode[]
      ++this.requestFinishedNum
      return poolsV3.concat(poolsAlg).concat(poolsV2)
    } catch (e) {
      ++this.requestFinishedNum
      ++this.requestFailedNum
      throw e
    }
  }

  getTokensPoolsQuantity(): [Token, number][] {
    const tokenMap: Map<Token, number> = new Map()
    if (this.extractorV2) this.extractorV2.getTokensPoolsQuantity(tokenMap)
    if (this.extractorV3) this.extractorV3.getTokensPoolsQuantity(tokenMap)
    if (this.extractorAlg) this.extractorAlg.getTokensPoolsQuantity(tokenMap)
    return Array.from(tokenMap.entries()).sort(([, a], [, b]) => b - a)
  }

  async printTokensPoolsQuantity(...paths: string[]) {
    try {
      const filePath = path.resolve(...paths)
      const stats = this.getTokensPoolsQuantity()
      const dirName = path.dirname(filePath)
      mkdir(dirName, { recursive: true })
      const file = await open(filePath, 'w')
      await file.writeFile(`Total tokens: ${stats.length}\n`)
      await file.writeFile('Quantity of pools for tokens\n')
      const tokenNum = Math.min(stats.length, 30)
      for (let i = 0; i < tokenNum; ++i) {
        const [token, num] = stats[i]
        await file.writeFile(`${token.address} ${token.symbol} ${num}\n`)
      }
      await file.close()
    } catch (_e) {
      // do nothing
    }
  }

  getCurrentPoolCodes() {
    const pools2 = this.extractorV2
      ? this.extractorV2.getCurrentPoolCodes()
      : []
    const pools3 = this.extractorV3
      ? this.extractorV3.getCurrentPoolCodes()
      : []
    const poolsAlg = this.extractorAlg
      ? this.extractorAlg.getCurrentPoolCodes()
      : []
    return pools2.concat(pools3).concat(poolsAlg)
  }

  isStarted(): boolean {
    if (this.extractorV2 && !this.extractorV2.isStarted()) return false
    if (this.extractorV3 && !this.extractorV3.isStarted()) return false
    if (this.extractorAlg && !this.extractorAlg.isStarted()) return false
    return true
  }
}
