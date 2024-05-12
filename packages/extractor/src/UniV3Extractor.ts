import IUniswapV3Factory from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json' assert {
  type: 'json',
}
import IUniswapV3Pool from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json' assert {
  type: 'json',
}
import { Abi } from 'abitype'
import { computeSushiSwapV3PoolAddress } from 'sushi'
import { Token } from 'sushi/currency'
import { LiquidityProviders, PoolCode } from 'sushi/router'
import { Address, Log, PublicClient } from 'viem'
import { Counter } from './Counter.js'
import { LogFilter2 } from './LogFilter2.js'
import { Logger, safeSerialize } from './Logger.js'
import { MultiCallAggregator } from './MulticallAggregator.js'
import { PermanentCache } from './PermanentCache.js'
import {
  PoolSyncState,
  QualityChecker,
  QualityCheckerCallBackArg,
} from './QualityChecker.js'
import { TokenManager } from './TokenManager.js'
import { UniV3EventsAbi, UniV3PoolWatcher } from './UniV3PoolWatcher.js'

export type FeeSpacingMap = Record<number, number>

export const uniswapFeeSpaceMap: FeeSpacingMap = {
  100: 1,
  500: 10,
  3000: 60,
  10_000: 200,
}

export interface FactoryV3 {
  address: Address
  provider: LiquidityProviders
  initCodeHash: string
  deployer?: Address
  feeSpacingMap?: FeeSpacingMap
}

interface PoolInfo {
  address: Address
  token0: Token
  token1: Token
  fee: number
  factory: FactoryV3
}

enum LogsProcessing {
  NotStarted = 'NotStarted',
  Starting = 'Starting',
  Started = 'Started',
}

interface PoolCacheRecord {
  address: Address
  token0: Address
  token1: Address
  fee: number
  factory: Address
}

export class UniV3Extractor {
  factories: FactoryV3[]
  factoryMap: Map<string, FactoryV3> = new Map()
  tickHelperContract: Address
  multiCallAggregator: MultiCallAggregator
  tokenManager: TokenManager
  poolMap: Map<Address, UniV3PoolWatcher> = new Map()
  poolMapUpdated: Map<string, UniV3PoolWatcher> = new Map()
  emptyAddressSet: Set<Address> = new Set()
  poolPermanentCache: PermanentCache<PoolCacheRecord>
  otherFactoryPoolSet: Set<Address> = new Set()
  logFilter: LogFilter2
  logProcessingStatus = LogsProcessing.NotStarted
  logging: boolean
  taskCounter: Counter
  qualityChecker: QualityChecker
  lastProcessdBlock = -1
  watchedPools = 0
  started = false

  constructor(
    client: PublicClient,
    tickHelperContract: Address,
    factories: FactoryV3[],
    cacheDir: string,
    logFilter: LogFilter2,
    logging = true,
    multiCallAggregator?: MultiCallAggregator,
    tokenManager?: TokenManager,
  ) {
    this.multiCallAggregator =
      multiCallAggregator || new MultiCallAggregator(client)
    this.tokenManager =
      tokenManager ||
      new TokenManager(
        this.multiCallAggregator,
        cacheDir,
        `uniV3Tokens-${this.multiCallAggregator.chainId}`,
      )
    this.tickHelperContract = tickHelperContract
    this.factories = factories
    factories.forEach((f) => this.factoryMap.set(f.address.toLowerCase(), f))
    this.poolPermanentCache = new PermanentCache(
      cacheDir,
      `uniV3Pools-${this.multiCallAggregator.chainId}`,
    )
    this.logging = logging
    this.taskCounter = new Counter(() => {
      //if (count == 0) this.consoleLog(`All pools were updated`)
    })
    this.qualityChecker = new QualityChecker(
      200,
      (arg: QualityCheckerCallBackArg) => {
        const addr = arg.ethalonPool.address.toLowerCase() as Address
        if (arg.ethalonPool !== this.poolMap.get(addr)) return false // checked pool was replaced during checking
        if (arg.correctPool) {
          this.poolMap.set(addr, arg.correctPool)
          this.poolMapUpdated.set(addr, arg.correctPool)
          arg.correctPool.on('PoolCodeWasChanged', (w) => {
            this.poolMapUpdated.set(
              (w as UniV3PoolWatcher).address.toLowerCase(),
              w,
            )
          })
        }
        if (
          arg.status !== PoolSyncState.Match &&
          arg.status !== PoolSyncState.ReservesMismatch
        )
          Logger.error(
            this.multiCallAggregator.chainId,
            `Pool ${arg.ethalonPool.address} quality check: ${arg.status} ` +
              `${arg.correctPool ? 'pool was updated ' : ''}` +
              `(${this.qualityChecker.totalMatchCounter}/${this.qualityChecker.totalCheckCounter})`,
            safeSerialize({
              oldPool: arg.ethalonPool.debugState(),
              newPool: arg.correctPool?.debugState(),
            }),
            false,
          )
        else
          this.consoleLog(
            `Pool ${arg.ethalonPool.address} quality check: ${arg.status} ` +
              `${arg.correctPool ? 'pool was updated ' : ''}` +
              `(${this.qualityChecker.totalMatchCounter}/${this.qualityChecker.totalCheckCounter})`,
          )
        return true
      },
    )

    this.logFilter = logFilter
    logFilter.addFilter(UniV3EventsAbi, (logs?: Log[]) => {
      if (logs) {
        const blockNumber =
          logs.length > 0
            ? Number(logs[logs.length - 1].blockNumber || 0)
            : '<undefined>'
        try {
          const logNames = logs.map((l) => this.processLog(l))
          this.consoleLog(
            `Block ${blockNumber} ${logNames.length} logs: [${logNames}], jobs: ${this.taskCounter.counter}`,
          )
          if (logs.length > 0)
            this.lastProcessdBlock = Number(
              logs[logs.length - 1].blockNumber || 0,
            )
        } catch (e) {
          Logger.error(
            this.multiCallAggregator.chainId,
            `Block ${blockNumber} log process error`,
            e,
          )
        }
      } else {
        Logger.error(
          this.multiCallAggregator.chainId,
          'Log collecting failed. Pools refetching',
        )
        Array.from(this.poolMap.values()).forEach((p) => p.updatePoolState())
      }
    })
  }

  // TODO: stop ?
  async start() {
    if (this.logProcessingStatus === LogsProcessing.NotStarted) {
      this.logProcessingStatus = LogsProcessing.Started
      const startTime = performance.now()

      if (this.tokenManager.tokens.size === 0)
        await this.tokenManager.addCachedTokens()

      // Add cached pools to watching
      const cachedPools: Map<string, PoolInfo> = new Map() // map instead of array to avoid duplicates
      const cachedRecords = await this.poolPermanentCache.getAllRecords()
      cachedRecords.forEach((r) => {
        const token0 = this.tokenManager.getKnownToken(r.token0)
        const token1 = this.tokenManager.getKnownToken(r.token1)
        const factory = this.factoryMap.get(r.factory.toLowerCase())
        if (token0 && token1 && factory && r.address && r.fee)
          cachedPools.set(r.address.toLowerCase(), {
            address: r.address,
            token0,
            token1,
            fee: r.fee,
            factory,
          })
      })
      const promises = Array.from(cachedPools.values())
        .map((p) => this.addPoolWatching(p, 'cache', false))
        .filter((w) => w !== undefined)
        .map((w) => (w as UniV3PoolWatcher).downloadFinished())
      Promise.allSettled(promises).then((promises) => {
        let failed = 0
        promises.forEach((p) => {
          if (p.status === 'rejected') ++failed
        })
        this.started = true
        this.consoleLog(
          `ExtractorV3 is ready, ${failed}/${
            promises.length
          } pools failed (${Math.round(performance.now() - startTime)}ms)`,
        )
        if (failed > 0) {
          Logger.error(
            this.multiCallAggregator.chainId,
            `${failed}/${promises.length} pools load failed during ExtractorV3 starting`,
          )
        }
      })
      this.consoleLog(`${cachedPools.size} pools were taken from cache`)
      this.consoleLog(
        `ExtractorV3 is started (${Math.round(
          performance.now() - startTime,
        )}ms)`,
      )
    }
  }

  processLog(l: Log): string {
    try {
      const pool = this.poolMap.get(l.address.toLowerCase() as Address)
      if (pool) {
        this.qualityChecker.processLog(l, pool)
        return pool.processLog(l)
      } else this.addPoolByAddress(l.address)
      return 'UnknPool'
    } catch (e) {
      Logger.error(
        this.multiCallAggregator.chainId,
        `Log processing for pool ${l.address} throwed an exception`,
        e,
      )
      return 'Exception!!!'
    }
  }

  addPoolWatching(
    p: PoolInfo,
    source: 'cache' | 'request' | 'logs',
    addToCache = true,
    startTime = 0,
  ) {
    if (this.logProcessingStatus !== LogsProcessing.Started) {
      throw new Error(
        'Pools can be added only after Log processing have been started',
      )
    }
    const addrL = p.address.toLowerCase() as Address
    const watcherExisted = this.poolMap.get(addrL)
    if (watcherExisted) return watcherExisted
    if (this.otherFactoryPoolSet.has(addrL)) return

    const [t0, t1] = p.token0.sortsBefore(p.token1)
      ? [p.token0, p.token1]
      : [p.token1, p.token0]

    startTime = startTime || performance.now()
    const expectedPoolAddress = this.computeV3Address(p.factory, t0, t1, p.fee)
    if (addrL !== expectedPoolAddress.toLowerCase()) {
      this.consoleLog(`FakePool: ${p.address}`)
      this.otherFactoryPoolSet.add(addrL)
      return
    }
    const spacing = (p.factory.feeSpacingMap ?? uniswapFeeSpaceMap)[p.fee]
    if (spacing === undefined) {
      this.consoleLog(
        `Unknown spacing for pool ${p.address} with fee = ${p.fee}. Pool is ignored`,
      )
      this.otherFactoryPoolSet.add(addrL)
      return
    }
    const watcher = new UniV3PoolWatcher(
      p.factory.provider,
      expectedPoolAddress,
      this.tickHelperContract,
      t0,
      t1,
      p.fee,
      spacing,
      this.multiCallAggregator,
      this.taskCounter,
    )
    watcher.updatePoolState()
    this.poolMap.set(addrL, watcher) // lowercase because incoming events have lowcase addresses ((
    this.poolMapUpdated.set(addrL, watcher)
    if (addToCache)
      this.poolPermanentCache.add({
        address: expectedPoolAddress,
        token0: t0.address as Address,
        token1: t1.address as Address,
        fee: p.fee,
        factory: p.factory.address,
      })
    watcher.once('isUpdated', () => {
      ++this.watchedPools
      if (source !== 'cache') {
        const delay = Math.round(performance.now() - startTime)
        this.consoleLog(
          `add pool ${expectedPoolAddress} (${delay}ms, ${source}), watched pools total: ${
            this.watchedPools
          }/${this.poolMap.size + this.emptyAddressSet.size}`,
        )
      }
    })
    watcher.on('PoolCodeWasChanged', (w) => {
      this.poolMapUpdated.set((w as UniV3PoolWatcher).address.toLowerCase(), w)
    })
    return watcher
  }

  getWatchersForTokens(tokensUnique: Token[]): {
    prefetched: UniV3PoolWatcher[]
    fetching: Promise<UniV3PoolWatcher | undefined>[]
  } {
    const startTime = performance.now()
    const prefetched: UniV3PoolWatcher[] = []
    const fetching: Promise<UniV3PoolWatcher | undefined>[] = []
    for (let i = 0; i < tokensUnique.length; ++i) {
      const t0 = tokensUnique[i]
      this.tokenManager.findToken(t0.address as Address) // to let save it in the cache
      for (let j = i + 1; j < tokensUnique.length; ++j) {
        const t1 = tokensUnique[j]
        this.factories.forEach((factory) => {
          const feeSpacingMap = factory.feeSpacingMap ?? uniswapFeeSpaceMap
          const fees = Object.keys(feeSpacingMap).map((f) => Number(f))
          fees.forEach((fee) => {
            const res = this.getWatchersForTokenPair(
              factory,
              fee,
              t0,
              t1,
              startTime,
            )
            if (res instanceof Promise) fetching.push(res)
            else if (res !== undefined) prefetched.push(res)
          })
        })
      }
    }
    return {
      prefetched,
      fetching,
    }
  }

  getWatchersBetweenTokenSets(
    tokensUnique1: Token[],
    tokensUnique2: Token[],
  ): {
    prefetched: UniV3PoolWatcher[]
    fetching: Promise<UniV3PoolWatcher | undefined>[]
  } {
    const startTime = performance.now()
    const prefetched: UniV3PoolWatcher[] = []
    const fetching: Promise<UniV3PoolWatcher | undefined>[] = []
    for (let i = 0; i < tokensUnique1.length; ++i) {
      const t0 = tokensUnique1[i]
      this.tokenManager.findToken(t0.address as Address) // to let save it in the cache
      for (let j = 0; j < tokensUnique2.length; ++j) {
        const t1 = tokensUnique2[j]
        this.factories.forEach((factory) => {
          const feeSpacingMap = factory.feeSpacingMap ?? uniswapFeeSpaceMap
          const fees = Object.keys(feeSpacingMap).map((f) => Number(f))
          fees.forEach((fee) => {
            const res = this.getWatchersForTokenPair(
              factory,
              fee,
              t0,
              t1,
              startTime,
            )
            if (res instanceof Promise) fetching.push(res)
            else if (res !== undefined) prefetched.push(res)
          })
        })
      }
    }
    return {
      prefetched,
      fetching,
    }
  }

  getWatchersForTokenPair(
    factory: FactoryV3,
    fee: number,
    t0: Token,
    t1: Token,
    startTime: number,
  ): undefined | UniV3PoolWatcher | Promise<UniV3PoolWatcher | undefined> {
    const addr = this.computeV3Address(factory, t0, t1, fee)
    const addrL = addr.toLowerCase() as Address
    const pool = this.poolMap.get(addrL)
    if (pool) return pool
    if (this.emptyAddressSet.has(addr)) return
    const promise = this.multiCallAggregator
      .callValue(factory.address, IUniswapV3Factory.abi as Abi, 'getPool', [
        t0.address,
        t1.address,
        fee,
      ])
      .then(
        (checkedAddress) => {
          if (checkedAddress === '0x0000000000000000000000000000000000000000') {
            this.emptyAddressSet.add(addr)
            return
          }
          const watcher = this.addPoolWatching(
            { address: addr, token0: t0, token1: t1, fee, factory },
            'request',
            true,
            startTime,
          )
          return watcher
        },
        () => undefined,
      )
    return promise
  }

  async addPoolByAddress(address: Address) {
    if (this.otherFactoryPoolSet.has(address.toLowerCase() as Address)) return
    if (this.multiCallAggregator.chainId === undefined) return
    this.taskCounter.inc()
    try {
      this.emptyAddressSet.delete(address)
      const startTime = performance.now()
      const factoryAddress = await this.multiCallAggregator.callValue(
        address,
        IUniswapV3Pool.abi as Abi,
        'factory',
      )
      const factory = this.factoryMap.get(
        (factoryAddress as Address).toLowerCase(),
      )
      if (factory !== undefined) {
        const [token0Address, token1Address, fee] = await Promise.all([
          this.multiCallAggregator.callValue(
            address,
            IUniswapV3Pool.abi as Abi,
            'token0',
          ),
          this.multiCallAggregator.callValue(
            address,
            IUniswapV3Pool.abi as Abi,
            'token1',
          ),
          this.multiCallAggregator.callValue(
            address,
            IUniswapV3Pool.abi as Abi,
            'fee',
          ),
        ])
        const [token0, token1] = await Promise.all([
          this.tokenManager.findToken(token0Address as Address),
          this.tokenManager.findToken(token1Address as Address),
        ])
        if (token0 && token1) {
          this.addPoolWatching(
            { address, token0, token1, fee: fee as number, factory },
            'logs',
            true,
            startTime,
          )
          this.taskCounter.dec()
          return
        }
      }
    } catch (_e) {
      // adding pool failed - let's add its address in otherFactoryPoolSet in order to not
      // spent resources for in the future
    }
    this.taskCounter.dec()
    this.otherFactoryPoolSet.add(address.toLowerCase() as Address)
    this.consoleLog(
      `other factory pool ${address}, such pools known: ${this.otherFactoryPoolSet.size}`,
    )
  }

  getCurrentPoolCodes(): PoolCode[] {
    return Array.from(this.poolMap.values())
      .map((p) => p.getPoolCode())
      .filter((pc) => pc !== undefined) as PoolCode[]
  }

  // side effect: updated pools list is cleared
  getUpdatedPoolCodes(): PoolCode[] {
    const res = Array.from(this.poolMapUpdated.values())
      .map((p) => p.getPoolCode())
      .filter((pc) => pc !== undefined) as PoolCode[]
    res.forEach((p) => this.poolMapUpdated.delete(p.pool.address.toLowerCase()))
    return res
  }

  // only for testing
  getStablePoolCodes(): PoolCode[] {
    return Array.from(this.poolMap.values())
      .map((p) => (p.isStable() ? p.getPoolCode() : undefined))
      .filter((pc) => pc !== undefined) as PoolCode[]
  }

  getTokensPoolsQuantity(tokenMap: Map<Token, number>) {
    const add = (token: Token) => {
      const num = tokenMap.get(token) || 0
      tokenMap.set(token, num + 1)
    }
    Array.from(this.poolMap.values()).forEach((p) => {
      add(p.token0)
      add(p.token1)
    })
  }

  readonly addressCache: Map<string, Address> = new Map()
  computeV3Address(
    factory: FactoryV3,
    tokenA: Token,
    tokenB: Token,
    fee: number,
  ): Address {
    const key = `${tokenA.address}${tokenB.address}${fee}${factory.address}`
    const cached = this.addressCache.get(key)
    if (cached) return cached
    const poolCreator = factory.deployer ?? factory.address
    const addr = computeSushiSwapV3PoolAddress({
      factoryAddress: poolCreator,
      tokenA,
      tokenB,
      fee,
      initCodeHashManualOverride: factory.initCodeHash,
    }) as Address
    this.addressCache.set(key, addr)
    return addr
  }

  consoleLog(log: string) {
    if (this.logging)
      console.log(`V3-${this.multiCallAggregator.chainId}: ${log}`)
  }

  isStarted() {
    return this.started
  }
}
