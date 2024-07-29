import { mkdir, open } from 'node:fs/promises'
import path from 'node:path'
import { Token } from 'sushi/currency'
import { PoolCode } from 'sushi/router'
import { Address, PublicClient } from 'viem'
import { AlgebraExtractor, FactoryAlgebra } from './AlgebraExtractor.js'
import { AlgebraPoolWatcher } from './AlgebraPoolWatcher.js'
import {
  CurveWhitelistConfig,
  CurveWhitelistExtractor,
} from './CurveWhitelistExtractor.js'
import { IExtractor } from './IExtractor.js'
import { LogFilter2, LogFilterType } from './LogFilter2.js'
import { MultiCallAggregator } from './MulticallAggregator.js'
import { TokenManager } from './TokenManager.js'
import { FactoryV2, UniV2Extractor } from './UniV2Extractor.js'
import { FactoryV3, UniV3Extractor } from './UniV3Extractor.js'
import { UniV3PoolWatcher } from './UniV3PoolWatcher.js'
import { UniV4Config, UniV4Extractor } from './UniV4Extractor.js'

const DEFAULT_RPC_MAX_CALLS_IN_ONE_BATCH = 1000

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

export type ExtractorConfig = {
  client: PublicClient
  factoriesV2?: FactoryV2[]
  factoriesV3?: FactoryV3[]
  factoriesAlgebra?: FactoryAlgebra[]
  curveConfig?: CurveWhitelistConfig
  uinV4?: UniV4Config
  tickHelperContractV3: Address
  tickHelperContractAlgebra: Address
  cacheDir: string
  logType?: LogFilterType
  logDepth: number
  logging?: boolean
  maxCallsInOneBatch?: number
  maxBatchesSimultaniously?: number
  debug?: boolean
} & Record<string, any>

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
  projectExtractors: IExtractor[] = []
  multiCallAggregator: MultiCallAggregator
  tokenManager: TokenManager
  requestedPairs: Map<string, Set<string>> = new Map()
  readonly logFilter: LogFilter2
  cacheDir: string
  logging?: boolean
  requestStartedNum = 0
  requestFinishedNum = 0
  requestFailedNum = 0
  debug?: boolean
  config: ExtractorConfig

  /// @param client
  /// @param factoriesV2 list of supported V2 factories
  /// @param factoriesV3 list of supported V3 factories
  /// @param tickHelperContract address of helper contract for pool's ticks download
  /// @param cacheDir directory for cache
  //                  IMPORTANT: Use different cacheDir for Extractors with the same chainId
  /// @param logDepth the depth of logs to keep in memory for reorgs
  /// @param logging to write logs in console or not
  constructor(args: ExtractorConfig) {
    this.config = args
    this.cacheDir = args.cacheDir
    this.logging = Boolean(args.logging)
    this.debug = Boolean(args.debug)
    this.client = args.client
    this.multiCallAggregator = new MultiCallAggregator(
      args.client,
      args.maxCallsInOneBatch ?? DEFAULT_RPC_MAX_CALLS_IN_ONE_BATCH,
      args.maxBatchesSimultaniously ?? 0,
      args.debug,
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
      args.debug,
    )
    if (args.factoriesV2 && args.factoriesV2.length > 0)
      this.projectExtractors.push(
        new UniV2Extractor(
          this.client,
          args.factoriesV2,
          args.cacheDir,
          this.logFilter,
          args.logging !== undefined ? args.logging : false,
          this.multiCallAggregator,
          this.tokenManager,
        ),
      )
    if (args.factoriesV3 && args.factoriesV3.length > 0)
      this.projectExtractors.push(
        new UniV3Extractor(
          this.client,
          args.tickHelperContractV3,
          args.factoriesV3,
          args.cacheDir,
          this.logFilter,
          args.logging !== undefined ? args.logging : false,
          this.multiCallAggregator,
          this.tokenManager,
        ),
      )
    if (args.factoriesAlgebra && args.factoriesAlgebra.length > 0)
      this.projectExtractors.push(
        new AlgebraExtractor(
          this.client,
          args.tickHelperContractAlgebra,
          args.factoriesAlgebra,
          args.cacheDir,
          this.logFilter,
          args.logging !== undefined ? args.logging : false,
          this.multiCallAggregator,
          this.tokenManager,
        ),
      )
    if (args.curveConfig)
      this.projectExtractors.push(
        new CurveWhitelistExtractor(
          this.client,
          args.curveConfig,
          this.logFilter,
          this.tokenManager,
          args.logging !== undefined ? args.logging : false,
          this.multiCallAggregator,
        ),
      )
    if (args.uniV4)
      this.projectExtractors.push(
        new UniV4Extractor({
          config: args.uniV4,
          multiCallAggregator: this.multiCallAggregator,
          tokenManager: this.tokenManager,
          cacheDir: args.cacheDir,
        }),
      )
  }

  /// @param tokensBaseSet Prefetch all pools between these tokens
  /// @param tokensAdditionalSet Prefetch all pools between tokensBaseSet and tokensAdditionalSet
  async start(tokensBaseSet: Token[] = [], tokensAdditionalSet: Token[] = []) {
    this.logFilter.start()
    await Promise.all(this.projectExtractors.map((e) => e.start()))
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
      ++this.requestFinishedNum
      const res = this.projectExtractors.flatMap(
        (e) => e.getPoolsForTokens(tokensUnique).prefetched,
      )
      // console.log(
      //   'EXTR DEBUG: getPoolCodesForTokens',
      //   tokens.length,
      //   res.length,
      // )
      return res
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

      const fetching = [
        ...this.projectExtractors.flatMap(
          (e) => e.getPoolsForTokens(baseUnique).fetching,
        ),
        ...this.projectExtractors.flatMap(
          (e) => e.getPoolsBetweenTokenSets(baseUnique, addUnique).fetching,
        ),
      ]
      // console.log(
      //   'EXTR DEBUG: prefetch start ',
      //   tokensBaseSet.length,
      //   tokensAdditionalSet.length,
      //   fetching.length,
      // )
      await Promise.allSettled(fetching)
      // console.log('EXTR DEBUG: prefetch finish')
      ++this.requestFinishedNum
    } catch (e) {
      ++this.requestFinishedNum
      ++this.requestFailedNum
      throw e
    }
  }

  addRequestedPair(t0: Token, t1: Token) {
    if (t0.address > t1.address) {
      const t = t0
      t0 = t1
      t1 = t
    }
    const set = this.requestedPairs.get(t0.address)
    if (set === undefined)
      this.requestedPairs.set(t0.address, new Set([t1.address]))
    else set.add(t1.address)
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

      this.projectExtractors.forEach((e) => {
        const { prefetched, fetching } = e.getPoolsBetweenTokenSets(
          tokens1Unique,
          tokens2Unique,
        )
        prefetchedAll = prefetchedAll.concat(prefetched)
        fetchingAll = fetchingAll.concat(fetching)
      })

      // console.log(
      //   'EXTR DEBUG: getPoolCodesBetweenTokenSets start ',
      //   tokens1.length,
      //   tokens2.length,
      //   prefetchedAll.length,
      //   fetchingAll.length,
      // )

      const fetchedAll = await Promise.allSettled(fetchingAll)
      const res = prefetchedAll
        .concat(
          fetchedAll.map((p) => {
            if (p.status === 'fulfilled') {
              const value = p.value
              if (value === undefined) return undefined
              if (value instanceof PoolCode) return value
              if (value instanceof UniV3PoolWatcher) return value.getPoolCode()
              if (value instanceof AlgebraPoolWatcher)
                return value.getPoolCode()
            }
          }),
        )
        .filter((p) => p !== undefined) as PoolCode[]
      // console.log(
      //   'EXTR DEBUG: getPoolCodesBetweenTokenSets finished ',
      //   res.length,
      // )

      tokens1Unique.forEach((t0) => {
        tokens2Unique.forEach((t1) => {
          this.addRequestedPair(t0, t1)
        })
      })
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

      this.projectExtractors.forEach((e) => {
        const pools = e.getPoolsForTokens(tokensUnique)
        prefetched = prefetched.concat(pools.prefetched)
        fetchingNumber += pools.fetching.length
      })

      // console.log(
      //   'EXTR DEBUG: getPoolCodesForTokensFull ',
      //   tokens.length,
      //   prefetched.length,
      //   fetchingNumber,
      // )

      for (let i = 0; i < tokensUnique.length; ++i) {
        for (let j = i + 1; j < tokensUnique.length; ++j) {
          this.addRequestedPair(tokensUnique[i], tokensUnique[j])
        }
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
      // let poolsV2: PoolCode[] = []
      // let watchersV3: UniV3PoolWatcher[] = []
      // let watchersAlg: AlgebraPoolWatcher[] = []
      // let poolsCurve: PoolCode[] = []
      let pools: PoolCode[] = []
      let promises: Promise<void>[] = []

      const tokenMap = new Map<string, Token>()
      tokens.forEach((t) => tokenMap.set(t.address, t))
      const tokensUnique = Array.from(tokenMap.values())

      this.projectExtractors.forEach((e) => {
        const { prefetched, fetching } = e.getPoolsForTokens(tokensUnique)
        pools = pools.concat(prefetched)
        promises = promises.concat(
          fetching.map(async (p) => {
            const pc = await p
            if (pc !== undefined) pools.push(pc)
          }),
        )
      })

      // console.log(
      //   'EXTR DEBUG: getPoolCodesForTokensAsync start',
      //   tokens.length,
      //   pools.length,
      //   promises.length,
      // )

      await Promise.any([Promise.allSettled(promises), delay(timeout)])

      // console.log(
      //   'EXTR DEBUG: getPoolCodesForTokensAsync finish',
      //   tokens.length,
      //   pools.length,
      //   promises.length,
      // )

      for (let i = 0; i < tokensUnique.length; ++i) {
        for (let j = i + 1; j < tokensUnique.length; ++j) {
          this.addRequestedPair(tokensUnique[i], tokensUnique[j])
        }
      }
      ++this.requestFinishedNum
      return pools
    } catch (e) {
      ++this.requestFinishedNum
      ++this.requestFailedNum
      throw e
    }
  }

  getTokensPoolsQuantity(): [Token, number][] {
    const tokenMap: Map<Token, number> = new Map()
    this.projectExtractors.forEach((e) => e.getTokensPoolsQuantity(tokenMap))
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

  getCurrentPoolCodes(): PoolCode[] {
    return this.projectExtractors.flatMap((e) => e.getCurrentPoolCodes())
  }

  // side effect: updated pools list is cleared
  getCurrentPoolCodesUpdate(): PoolCode[] {
    return this.projectExtractors.flatMap((e) => e.getUpdatedPoolCodes())
  }

  isStarted(): boolean {
    return this.projectExtractors.every((e) => e.isStarted())
  }
}
