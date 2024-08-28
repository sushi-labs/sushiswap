import { defaultAbiCoder } from '@ethersproject/abi'
import IUniswapV3Factory from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json' assert {
  type: 'json',
}
import IUniswapV3Pool from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json' assert {
  type: 'json',
}
import { Abi } from 'abitype'
import { Token } from 'sushi/currency'
import { LiquidityProviders, PoolCode } from 'sushi/router'
import {
  type Address,
  type Hex,
  type Log,
  type PublicClient,
  getAddress,
  keccak256,
  parseAbi,
  parseAbiItem,
} from 'viem'
import {
  AerodromeSlipstreamPoolSyncState,
  AerodromeSlipstreamQualityChecker,
  AerodromeSlipstreamQualityCheckerCallBackArg,
} from './AerodromeSlipstreamQualityChecker.js'
import { AerodromeSlipstreamV3PoolWatcher } from './AerodromeSlipstreamV3PoolWatcher.js'
import { Counter } from './Counter.js'
import { IExtractor } from './IExtractor.js'
import { LogFilter2 } from './LogFilter2.js'
import { Logger, safeSerialize } from './Logger.js'
import { MultiCallAggregator } from './MulticallAggregator.js'
import { PermanentCache } from './PermanentCache.js'
import { TokenManager } from './TokenManager.js'
import { FeeSpacingMap } from './UniV3Extractor.js'
import { UniV3EventsAbi, UniV3PoolWatcherStatus } from './UniV3PoolWatcher.js'
import { delay } from './Utils.js'

const TickSpacingEnabledEventABI = parseAbiItem(
  'event TickSpacingEnabled(int24 indexed tickSpacing, uint24 indexed fee)',
)
const AerodromeSlipstreamABI = parseAbi([
  'function tickSpacingToFee(int24) view returns (uint24)',
  'function poolImplementation() view returns (address)',
])

export interface AerodromeSlipstreamFactoryV3 {
  address: Address
  provider: LiquidityProviders
  feeSpacingMap?: FeeSpacingMap // created dinamically
  poolImplementation?: Address // fetched inExtractor
}

interface PoolInfo {
  address: Address
  token0: Token
  token1: Token
  //fee: number
  tickSpacing: number
  factory: AerodromeSlipstreamFactoryV3
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
  tickSpacing: number
  factory: Address
}

// Difference from UniV3:
// 1) Fee-TickSpacing map is dynamic. Set by PoolFactory.enableTickSpacing()
// 2) Pools are proxies:
//    pool = Clones.cloneDeterministic({
//        master: poolImplementation,
//        salt: keccak256(abi.encode(token0, token1, tickSpacing))
//    });
// 3) Pool fee can be changed (not during swap). But tickSpacing - never
// 4) Different slot0 struct (no fee)
export class AerodromeSlipstreamV3Extractor extends IExtractor {
  factories: AerodromeSlipstreamFactoryV3[]
  factoryMap: Map<string, AerodromeSlipstreamFactoryV3> = new Map()
  tickHelperContract: Address
  multiCallAggregator: MultiCallAggregator
  tokenManager: TokenManager
  poolMap: Map<Address, AerodromeSlipstreamV3PoolWatcher> = new Map()
  poolMapUpdated: Map<string, AerodromeSlipstreamV3PoolWatcher> = new Map()
  emptyAddressSet: Set<Address> = new Set()
  poolPermanentCache: PermanentCache<PoolCacheRecord>
  otherFactoryPoolSet: Set<Address> = new Set()
  logFilter: LogFilter2
  logProcessingStatus = LogsProcessing.NotStarted
  logging: boolean
  taskCounter: Counter
  qualityChecker: AerodromeSlipstreamQualityChecker
  lastProcessdBlock = -1
  watchedPools = 0
  started = false

  constructor(
    client: PublicClient,
    tickHelperContract: Address,
    factories: AerodromeSlipstreamFactoryV3[],
    cacheDir: string,
    logFilter: LogFilter2,
    logging = true,
    multiCallAggregator?: MultiCallAggregator,
    tokenManager?: TokenManager,
    cacheReadOnly = false,
  ) {
    super()
    this.multiCallAggregator =
      multiCallAggregator || new MultiCallAggregator(client)
    this.tokenManager =
      tokenManager ||
      new TokenManager(
        this.multiCallAggregator,
        cacheReadOnly,
        cacheDir,
        `aerodromeSlipstreamV3Tokens-${this.multiCallAggregator.chainId}`,
      )
    this.tickHelperContract = tickHelperContract
    this.factories = factories
    factories.forEach((f) => this.factoryMap.set(f.address.toLowerCase(), f))
    this.poolPermanentCache = new PermanentCache(
      cacheReadOnly,
      cacheDir,
      `aerodromeSlipstreamV3Pools-${this.multiCallAggregator.chainId}`,
    )
    this.logging = logging
    this.consoleLog(`CacheReadOnly = ${cacheReadOnly}`)
    this.taskCounter = new Counter(() => {
      //if (count == 0) this.consoleLog(`All pools were updated`)
    })
    this.qualityChecker = new AerodromeSlipstreamQualityChecker(
      200,
      (arg: AerodromeSlipstreamQualityCheckerCallBackArg) => {
        const addr = arg.ethalonPool.address.toLowerCase() as Address
        if (arg.ethalonPool !== this.poolMap.get(addr)) return false // checked pool was replaced during checking
        if (arg.correctPool) {
          this.poolMap.set(addr, arg.correctPool)
          this.poolMapUpdated.set(addr, arg.correctPool)
          arg.correctPool.on('PoolCodeWasChanged', (w) => {
            this.poolMapUpdated.set(
              (w as AerodromeSlipstreamV3PoolWatcher).address.toLowerCase(),
              w,
            )
          })
        }
        if (
          arg.status !== AerodromeSlipstreamPoolSyncState.Match &&
          arg.status !== AerodromeSlipstreamPoolSyncState.ReservesMismatch
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
  override async start() {
    if (this.logProcessingStatus === LogsProcessing.NotStarted) {
      this.logProcessingStatus = LogsProcessing.Started
      const startTime = performance.now()

      await this.tokenManager.addCachedTokens()

      // Add cached pools to watching
      const cachedPools: Map<string, PoolInfo> = new Map() // map instead of array to avoid duplicates
      const cachedRecords = await this.poolPermanentCache.getAllRecords()
      cachedRecords.forEach((r) => {
        const token0 = this.tokenManager.getKnownToken(r.token0)
        const token1 = this.tokenManager.getKnownToken(r.token1)
        const factory = this.factoryMap.get(r.factory.toLowerCase())
        if (token0 && token1 && factory && r.address && r.tickSpacing)
          cachedPools.set(r.address.toLowerCase(), {
            address: r.address,
            token0,
            token1,
            tickSpacing: r.tickSpacing,
            factory,
          })
      })
      const promises = Array.from(cachedPools.values())
        .map((p) => this.addPoolWatching(p, 'cache', false))
        .filter((w) => w !== undefined)
        .map((w) => (w as AerodromeSlipstreamV3PoolWatcher).downloadFinished())
      Promise.allSettled(promises).then((promises) => {
        let failed = 0
        promises.forEach((p) => {
          if (p.status === 'rejected') ++failed
        })
        this.started = true
        this.consoleLog(
          `ExtractorAerodromeSlipstreamV3 is ready, ${failed}/${
            promises.length
          } pools failed (${Math.round(performance.now() - startTime)}ms)`,
        )
        if (failed > 0) {
          Logger.error(
            this.multiCallAggregator.chainId,
            `${failed}/${promises.length} pools load failed during ExtractorAerodromeSlipstreamV3 starting`,
          )
        }
      })

      await this.fetchFeeSpacingMap()

      this.consoleLog(`${cachedPools.size} pools were taken from cache`)
      this.consoleLog(
        `ExtractorAerodromeSlipstreamV3 is started (${Math.round(
          performance.now() - startTime,
        )}ms)`,
      )
    }
  }

  async fetchFeeSpacingMap() {
    const client = this.multiCallAggregator.client

    // checks once per our changes in feeSpacingMap
    client.createEventFilter({ event: TickSpacingEnabledEventABI }).then(
      async (filter) => {
        for (;;) {
          await delay(3600 * 1000)
          try {
            const logs = await client.getFilterChanges({
              filter,
            })
            logs.forEach(({ address, args }) => {
              const f = this.factoryMap.get(address.toLowerCase())
              if (!f) return
              f.feeSpacingMap = f.feeSpacingMap ?? {}
              const { fee, tickSpacing } = args
              if (fee !== undefined && tickSpacing !== undefined)
                f.feeSpacingMap[fee] = tickSpacing
            })
          } catch (e) {
            Logger.error(
              client.chain?.id,
              `TickSpacingEnabledEvent ${filter.id} error`,
              e,
            )
          }
        }
      },
      (e) => {
        Logger.error(
          client.chain?.id,
          `TickSpacingEnabledEvent creation error`,
          e,
        )
      },
    )

    await Promise.allSettled([
      ...this.factories.map(async (f) => {
        try {
          const logs = await client.getLogs({
            address: f.address,
            event: TickSpacingEnabledEventABI,
          })
          const feeSpacingMap: FeeSpacingMap = {}
          logs.forEach((l) => {
            const { fee, tickSpacing } = l.args
            if (fee !== undefined && tickSpacing !== undefined)
              feeSpacingMap[fee] = tickSpacing
          })
          f.feeSpacingMap = feeSpacingMap
          this.consoleLog(
            `Provider ${f.provider}(${
              f.address
            }) fees-tickSpacing map: ${JSON.stringify(feeSpacingMap)}`,
          )
          if (Object.keys(feeSpacingMap).length === 0)
            Logger.error(
              this.multiCallAggregator.chainId,
              `Provider ${f.provider}(${f.address}) fees-tickSpacing map is empty`,
            )
        } catch (e) {
          Logger.error(
            this.multiCallAggregator.chainId,
            `Provider ${f.provider}(${f.address}) fees-tickSpacing map fetching failed`,
            e,
          )
        }
      }),
      ...this.factories.map(async (f) => {
        try {
          f.poolImplementation = await this.multiCallAggregator.callValue(
            f.address,
            AerodromeSlipstreamABI,
            'poolImplementation',
          )
        } catch (e) {
          Logger.error(
            this.multiCallAggregator.chainId,
            `Provider ${f.provider}(${f.address}) poolImplementation fetching failed`,
            e,
          )
        }
      }),
    ])
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
    const expectedPoolAddress = this.computeV3Address(
      p.factory,
      t0,
      t1,
      p.tickSpacing,
    )
    if (expectedPoolAddress === undefined) return
    if (addrL !== expectedPoolAddress.toLowerCase()) {
      this.consoleLog(`FakePool: ${p.address}`)
      this.otherFactoryPoolSet.add(addrL)
      return
    }
    const watcher = new AerodromeSlipstreamV3PoolWatcher(
      p.factory.provider,
      expectedPoolAddress,
      this.tickHelperContract,
      t0,
      t1,
      p.tickSpacing,
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
        tickSpacing: p.tickSpacing,
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
      this.poolMapUpdated.set(
        (w as AerodromeSlipstreamV3PoolWatcher).address.toLowerCase(),
        w,
      )
    })
    return watcher
  }

  getWatchersForTokens(tokensUnique: Token[]): {
    prefetched: AerodromeSlipstreamV3PoolWatcher[]
    fetching: Promise<AerodromeSlipstreamV3PoolWatcher | undefined>[]
  } {
    const startTime = performance.now()
    const prefetched: AerodromeSlipstreamV3PoolWatcher[] = []
    const fetching: Promise<AerodromeSlipstreamV3PoolWatcher | undefined>[] = []
    for (let i = 0; i < tokensUnique.length; ++i) {
      const t0 = tokensUnique[i]
      this.tokenManager.findToken(t0.address as Address) // to let save it in the cache
      for (let j = i + 1; j < tokensUnique.length; ++j) {
        const t1 = tokensUnique[j]
        this.factories.forEach((factory) => {
          const feeSpacingMap = factory.feeSpacingMap ?? {}
          const tickSpacings = Object.values(feeSpacingMap).map((f) =>
            Number(f),
          )
          tickSpacings.forEach((tickSpacing) => {
            const res = this.getWatchersForTokenPair(
              factory,
              tickSpacing,
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

  override getPoolsForTokens(tokensUnique: Token[]): {
    prefetched: PoolCode[]
    fetching: Promise<PoolCode | undefined>[]
  } {
    const { prefetched, fetching } = this.getWatchersForTokens(tokensUnique)
    return {
      prefetched: prefetched
        .map((w) => w.getPoolCode())
        .filter((p) => p !== undefined) as PoolCode[],
      fetching: fetching.map(async (pr) => {
        const w = await pr
        if (w === undefined) return

        if (w.getStatus() !== UniV3PoolWatcherStatus.All)
          await w.downloadFinished()
        return w.getPoolCode()
      }),
    }
  }

  getWatchersBetweenTokenSets(
    tokensUnique1: Token[],
    tokensUnique2: Token[],
  ): {
    prefetched: AerodromeSlipstreamV3PoolWatcher[]
    fetching: Promise<AerodromeSlipstreamV3PoolWatcher | undefined>[]
  } {
    const startTime = performance.now()
    const prefetched: AerodromeSlipstreamV3PoolWatcher[] = []
    const fetching: Promise<AerodromeSlipstreamV3PoolWatcher | undefined>[] = []
    for (let i = 0; i < tokensUnique1.length; ++i) {
      const t0 = tokensUnique1[i]
      this.tokenManager.findToken(t0.address as Address) // to let save it in the cache
      for (let j = 0; j < tokensUnique2.length; ++j) {
        const t1 = tokensUnique2[j]
        this.factories.forEach((factory) => {
          const feeSpacingMap = factory.feeSpacingMap ?? {}
          const tickSpacings = Object.values(feeSpacingMap).map((f) =>
            Number(f),
          )
          tickSpacings.forEach((tickSpacing) => {
            const res = this.getWatchersForTokenPair(
              factory,
              tickSpacing,
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

  override getPoolsBetweenTokenSets(
    tokensUnique1: Token[],
    tokensUnique2: Token[],
  ): {
    prefetched: PoolCode[]
    fetching: Promise<PoolCode | undefined>[]
  } {
    const { prefetched, fetching } = this.getWatchersBetweenTokenSets(
      tokensUnique1,
      tokensUnique2,
    )
    return {
      prefetched: prefetched
        .map((w) => w.getPoolCode())
        .filter((p) => p !== undefined) as PoolCode[],
      fetching: fetching.map(async (pr) => {
        const w = await pr
        if (w === undefined) return

        if (w.getStatus() !== UniV3PoolWatcherStatus.All)
          await w.downloadFinished()
        return w.getPoolCode()
      }),
    }
  }

  getWatchersForTokenPair(
    factory: AerodromeSlipstreamFactoryV3,
    tickSpacing: number,
    t0: Token,
    t1: Token,
    startTime: number,
  ):
    | undefined
    | AerodromeSlipstreamV3PoolWatcher
    | Promise<AerodromeSlipstreamV3PoolWatcher | undefined> {
    const addr = this.computeV3Address(factory, t0, t1, tickSpacing)
    if (addr === undefined) return
    const addrL = addr.toLowerCase() as Address
    const pool = this.poolMap.get(addrL)
    if (pool) return pool
    if (this.emptyAddressSet.has(addr)) return
    const promise = this.multiCallAggregator
      .callValue(factory.address, IUniswapV3Factory.abi as Abi, 'getPool', [
        t0.address,
        t1.address,
        tickSpacing,
      ])
      .then(
        (checkedAddress) => {
          if (checkedAddress === '0x0000000000000000000000000000000000000000') {
            this.emptyAddressSet.add(addr)
            return
          }
          const watcher = this.addPoolWatching(
            { address: addr, token0: t0, token1: t1, tickSpacing, factory },
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
        const [token0Address, token1Address, tickSpacing] = await Promise.all([
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
            'tickSpacing',
          ),
        ])
        const [token0, token1] = await Promise.all([
          this.tokenManager.findToken(token0Address as Address),
          this.tokenManager.findToken(token1Address as Address),
        ])
        if (token0 && token1) {
          this.addPoolWatching(
            {
              address,
              token0,
              token1,
              tickSpacing: tickSpacing as number,
              factory,
            },
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
    // Lets don't log it as most of such pools are UniV3
    // this.consoleLog(
    //   `other factory pool ${address}, such pools known: ${this.otherFactoryPoolSet.size}`,
    // )
  }

  override getCurrentPoolCodes(): PoolCode[] {
    return Array.from(this.poolMap.values())
      .map((p) => p.getPoolCode())
      .filter((pc) => pc !== undefined) as PoolCode[]
  }

  // side effect: updated pools list is cleared
  override getUpdatedPoolCodes(): PoolCode[] {
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

  override getTokensPoolsQuantity(tokenMap: Map<Token, number>) {
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
    factory: AerodromeSlipstreamFactoryV3,
    tokenA: Token,
    tokenB: Token,
    tickSpacing: number,
  ): Address | undefined {
    if (!factory.poolImplementation) return

    const key = `${tokenA.address}${tokenB.address}${tickSpacing}${factory.address}`
    const cached = this.addressCache.get(key)
    if (cached) return cached

    const [token0, token1] = tokenA.sortsBefore(tokenB)
      ? [tokenA, tokenB]
      : [tokenB, tokenA]
    const constructorArgumentsEncoded = defaultAbiCoder.encode(
      ['address', 'address', 'int24'],
      [token0.address, token1.address, tickSpacing],
    ) as Hex
    const initCode =
      `0x3d602d80600a3d3981f3363d3d373d3d3d363d73${factory.poolImplementation.replace(
        '0x',
        '',
      )}5af43d82803e903d91602b57fd5bf3` as Hex
    const initCodeHash = keccak256(initCode)

    const create2Inputs = [
      '0xff',
      factory.address,
      // salt
      keccak256(constructorArgumentsEncoded),
      // init code hash
      initCodeHash,
    ]
    const sanitizedInputs = `0x${create2Inputs
      .map((i) => i.slice(2))
      .join('')}` as Hex
    const addr = getAddress(`0x${keccak256(sanitizedInputs).slice(-40)}`)
    this.addressCache.set(key, addr)
    return addr
  }

  consoleLog(log: string) {
    if (this.logging)
      console.log(`ASV3-${this.multiCallAggregator.chainId}: ${log}`)
  }

  override isStarted() {
    return this.started
  }
}
