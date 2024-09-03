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
  decodeEventLog,
  getAddress,
  keccak256,
  parseAbi,
  parseAbiItem,
} from 'viem'
import { Counter } from './Counter.js'
import { IExtractor } from './IExtractor.js'
import { LogFilter2 } from './LogFilter2.js'
import { Logger, safeSerialize } from './Logger.js'
import {
  MultiCallAggregator,
  MultiCallContract,
} from './MulticallAggregator.js'
import { PermanentCache } from './PermanentCache.js'
import {
  SlipstreamPoolSyncState,
  SlipstreamQualityChecker,
  SlipstreamQualityCheckerCallBackArg,
} from './SlipstreamQualityChecker.js'
import { SlipstreamV3PoolWatcher } from './SlipstreamV3PoolWatcher.js'
import { TokenManager } from './TokenManager.js'
import { FeeSpacingMap } from './UniV3Extractor.js'
import { UniV3EventsAbi, UniV3PoolWatcherStatus } from './UniV3PoolWatcher.js'

const Events = {
  TickSpacingEnabled: parseAbiItem(
    'event TickSpacingEnabled(int24 indexed tickSpacing, uint24 indexed fee)',
  ),
  SetCustomFee: parseAbiItem(
    'event SetCustomFee(address indexed pool, uint24 indexed fee)',
  ),
  SwapFeeModuleChanged: parseAbiItem(
    'event SwapFeeModuleChanged(address indexed oldFeeModule, address indexed newFeeModule)',
  ),
}

const AerodromeSlipstreamABI = parseAbi([
  'function tickSpacingToFee(int24) view returns (uint24)',
  'function poolImplementation() view returns (address)',
  'function tickSpacings() view returns (int24[])',
  'function swapFeeModule() view returns (address)',
])

export interface SlipstreamFactoryV3 {
  address: Address
  provider: LiquidityProviders
  checkedSwapFeeModules: Address[]
  feeSpacingMap?: FeeSpacingMap // created dinamically
  poolImplementation?: Address // fetched inExtractor
  contract?: MultiCallContract
  swapFeeModule?: Address
}

function factoryIsSupported(f: SlipstreamFactoryV3, newFeeModule?: Address) {
  return f.checkedSwapFeeModules.includes(
    newFeeModule ?? (f.swapFeeModule as Address),
  )
}

interface PoolInfo {
  address: Address
  token0: Token
  token1: Token
  //fee: number
  tickSpacing: number
  factory: SlipstreamFactoryV3
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
// 5) SugarHelper ('0x0AD09A66af0154a84e86F761313d02d0abB6edd5') instead of Tickens.
//    getPopulatedTicks function (takes startTick, not a word index) instead of getPopulatedTicksInWord
//    returns ALL ticks for the word AND upper (unlike TickLens)
//    Created and deployed our own TickLens for Slipstream 0x3e1116ea5034f5d73a7b530071709d54a4109f5f
//      Diff from original: PopulatedTick doesn't contain price (as in standard TickLens)
export class SlipstreamV3Extractor extends IExtractor {
  factories: SlipstreamFactoryV3[]
  factoryMap: Map<string, SlipstreamFactoryV3> = new Map()
  tickHelperContract: Address
  multiCallAggregator: MultiCallAggregator
  tokenManager: TokenManager
  poolMap: Map<Address, SlipstreamV3PoolWatcher> = new Map()
  poolMapUpdated: Map<string, SlipstreamV3PoolWatcher> = new Map()
  emptyAddressSet: Set<Address> = new Set()
  poolPermanentCache: PermanentCache<PoolCacheRecord>
  otherFactoryPoolSet: Set<Address> = new Set()
  logFilter: LogFilter2
  logProcessingStatus = LogsProcessing.NotStarted
  logging: boolean
  taskCounter: Counter
  qualityChecker: SlipstreamQualityChecker
  lastProcessdBlock = -1
  watchedPools = 0

  constructor(
    client: PublicClient,
    tickHelperContract: Address,
    factories: SlipstreamFactoryV3[],
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
        `slipstreamV3Tokens-${this.multiCallAggregator.chainId}`,
      )
    this.tickHelperContract = tickHelperContract
    this.factories = factories
    factories.forEach((f) => this.factoryMap.set(f.address.toLowerCase(), f))
    this.poolPermanentCache = new PermanentCache(
      cacheReadOnly,
      cacheDir,
      `slipstreamV3Pools-${this.multiCallAggregator.chainId}`,
    )
    this.logging = logging
    this.consoleLog(`CacheReadOnly = ${cacheReadOnly}`)
    this.taskCounter = new Counter(() => {
      //if (count == 0) this.consoleLog(`All pools were updated`)
    })
    this.qualityChecker = new SlipstreamQualityChecker(
      200,
      (arg: SlipstreamQualityCheckerCallBackArg) => {
        const addr = arg.ethalonPool.address.toLowerCase() as Address
        if (arg.ethalonPool !== this.poolMap.get(addr)) return false // checked pool was replaced during checking
        if (arg.correctPool) {
          this.poolMap.set(addr, arg.correctPool)
          this.poolMapUpdated.set(addr, arg.correctPool)
          arg.correctPool.on('PoolCodeWasChanged', (w) => {
            this.poolMapUpdated.set(
              (w as SlipstreamV3PoolWatcher).address.toLowerCase(),
              w,
            )
          })
        }
        if (
          arg.status !== SlipstreamPoolSyncState.Match &&
          arg.status !== SlipstreamPoolSyncState.ReservesMismatch
        )
          this.errorLog(
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
  }

  startBlockChainEventsListening() {
    // pool event filtering
    this.logFilter.addFilter(UniV3EventsAbi, (logs?: Log[]) => {
      if (logs) {
        const blockNumber =
          logs.length > 0
            ? Number(logs[logs.length - 1].blockNumber || 0)
            : '<undefined>'
        try {
          const logNames = logs
            .map((l) => this.processLog(l))
            .filter((n) => n !== 'UnknPool') // because most of such events are from UniV3
          this.consoleLog(
            `Block ${blockNumber} ${logNames.length} logs: [${logNames}], jobs: ${this.taskCounter.counter}`,
          )
          if (logs.length > 0)
            this.lastProcessdBlock = Number(
              logs[logs.length - 1].blockNumber || 0,
            )
        } catch (e) {
          this.errorLog(`Block ${blockNumber} log process error`, e)
        }
      } else {
        this.errorLog('Log collecting failed. Pools refetching')
        Array.from(this.poolMap.values()).forEach((p) => p.updatePoolState())
      }
    })
    // pool fee update
    this.logFilter.addFilter(Events.SetCustomFee, (logs: Log[] | undefined) => {
      logs?.forEach((l) => {
        const {
          args: { pool, fee },
        } = decodeEventLog({
          abi: [Events.SetCustomFee],
          data: l.data,
          topics: l.topics,
        })
        const watcher = this.poolMap.get(pool.toLowerCase() as Address)
        if (watcher === undefined) return
        if (
          watcher.factory.swapFeeModule?.toLowerCase() ===
          l.address.toLowerCase()
        )
          watcher.setFee(fee)
      })
    })
    // factory TickSpacingEnabled event
    this.logFilter.addAddressesFilter(
      this.factories.map((f) => f.address),
      Events.TickSpacingEnabled,
      (logs: Log[] | undefined) => {
        logs?.forEach((l) => {
          const {
            args: { tickSpacing, fee },
          } = decodeEventLog({
            abi: [Events.TickSpacingEnabled],
            data: l.data,
            topics: l.topics,
          })
          const factory = this.factoryMap.get(l.address.toLowerCase())
          if (!factory) return
          factory.feeSpacingMap = factory.feeSpacingMap ?? {}
          factory.feeSpacingMap[fee] = tickSpacing
        })
      },
    )
    // factory SwapFeeModuleChanged event. RN we can't process it correctly
    // Please restart the extractor ASAP in this case. Factory's pools can have wrong fee
    // TGood: this event should be rare
    this.logFilter.addAddressesFilter(
      this.factories.map((f) => f.address),
      Events.SwapFeeModuleChanged,
      (logs: Log[] | undefined) => {
        logs?.forEach((l) => {
          const {
            args: { newFeeModule },
          } = decodeEventLog({
            abi: [Events.SwapFeeModuleChanged],
            data: l.data,
            topics: l.topics,
          })
          const factory = this.factoryMap.get(l.address.toLowerCase())
          if (!factory) return
          if (factoryIsSupported(factory, newFeeModule))
            factory.swapFeeModule = newFeeModule
          else {
            // TODO: update all fees
            // Log much errors
            setInterval(() => {
              this.errorLog(
                `Slipstream provider ${factory.provider}(${factory.address}) new SwapFeeModule ${newFeeModule} is not supported. Prease RESTART ASAP `,
              )
            }, 60_000)
          }
        })
      },
    )
  }

  // TODO: stop ?
  override async start() {
    if (this.logProcessingStatus === LogsProcessing.NotStarted) {
      this.logProcessingStatus = LogsProcessing.Starting
      const startTime = performance.now()
      this.consoleLog('Starting')
      // events listening should be started before pools creation from the cache in order to not miss
      // update events during starting
      this.startBlockChainEventsListening()
      this.consoleLog('Blockchain events listening was strated')

      await this.fetchFactoryData()
      await this.tokenManager.addCachedTokens()

      // Add cached pools to watching
      const cachedPools: Map<string, PoolInfo> = new Map() // map instead of array to avoid duplicates
      const cachedRecords = await this.poolPermanentCache.getAllRecords()
      cachedRecords.forEach((r) => {
        const token0 = this.tokenManager.getKnownToken(r.token0)
        const token1 = this.tokenManager.getKnownToken(r.token1)
        const factory = this.factoryMap.get(r.factory.toLowerCase())
        if (
          token0 &&
          token1 &&
          factory &&
          r.address &&
          r.tickSpacing &&
          factoryIsSupported(factory)
        )
          cachedPools.set(r.address.toLowerCase(), {
            address: r.address,
            token0,
            token1,
            tickSpacing: r.tickSpacing,
            factory,
          })
      })

      this.consoleLog(`${cachedPools.size} pools were taken from cache`)

      const promises = Array.from(cachedPools.values())
        .map((p) => this.addPoolWatching(p, 'cache', false))
        .filter((w) => w !== undefined)
        .map((w) => (w as SlipstreamV3PoolWatcher).downloadFinished())
      Promise.allSettled(promises).then((promises) => {
        let failed = 0
        promises.forEach((p) => {
          if (p.status === 'rejected') ++failed
        })

        this.consoleLog(
          `Started and ready, ${failed}/${
            promises.length
          } pools failed (${Math.round(performance.now() - startTime)}ms)`,
        )
        if (failed > 0) {
          this.errorLog(
            `${failed}/${promises.length} pools load failed during ExtractorAerodromeSlipstreamV3 starting`,
          )
        }
        this.logProcessingStatus = LogsProcessing.Started
      })
    }
  }

  async fetchFactoryData() {
    await Promise.allSettled(
      this.factories.map(async (f) => {
        try {
          const feeSpacingMap: FeeSpacingMap = {}
          const CLFactory = this.multiCallAggregator.getContract(
            f.address,
            AerodromeSlipstreamABI,
          )
          const [tickSpacings, poolImplementation, swapFeeModule] =
            await Promise.all([
              CLFactory.call<number[]>('tickSpacings'),
              CLFactory.call<Address>('poolImplementation'),
              CLFactory.call<Address>('swapFeeModule'),
            ])
          await Promise.all(
            tickSpacings.map(async (ts) => {
              const fee = await CLFactory.call<number>('tickSpacingToFee', ts)
              feeSpacingMap[fee] = ts
            }),
          )
          f.contract = CLFactory
          f.feeSpacingMap = feeSpacingMap
          f.poolImplementation = poolImplementation
          f.swapFeeModule = swapFeeModule

          this.consoleLog(
            `Provider ${f.provider}(${
              f.address
            }) fees-tickSpacing map: ${JSON.stringify(feeSpacingMap)}`,
          )
          if (Object.keys(feeSpacingMap).length === 0)
            this.errorLog(
              `Provider ${f.provider}(${f.address}) fees-tickSpacing map is empty`,
            )
        } catch (e) {
          this.errorLog(
            `Provider ${f.provider}(${f.address}) data fetching failed`,
            e,
          )
        }
      }),
    )

    // filter out unsupported factories !!!
    this.factories.forEach((f) => {
      if (factoryIsSupported(f)) return
      this.factoryMap.delete(f.address.toLowerCase())
      this.errorLog(
        `Provider ${f.provider}(${f.address}) is not supported !!!!!`,
      )
    })
    this.factories = this.factories.filter((f) => factoryIsSupported(f))
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
      this.errorLog(
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
    const watcher = new SlipstreamV3PoolWatcher(
      p.factory,
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
    if (addToCache && this.isStarted())
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
          `add pool ${expectedPoolAddress} (${delay}ms, ${source}), watched pools total: ${this.watchedPools}`,
        )
      }
    })
    watcher.on('PoolCodeWasChanged', (w) => {
      this.poolMapUpdated.set(
        (w as SlipstreamV3PoolWatcher).address.toLowerCase(),
        w,
      )
    })
    return watcher
  }

  getWatchersForTokens(tokensUnique: Token[]): {
    prefetched: SlipstreamV3PoolWatcher[]
    fetching: Promise<SlipstreamV3PoolWatcher | undefined>[]
  } {
    const startTime = performance.now()
    const prefetched: SlipstreamV3PoolWatcher[] = []
    const fetching: Promise<SlipstreamV3PoolWatcher | undefined>[] = []
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
    prefetched: SlipstreamV3PoolWatcher[]
    fetching: Promise<SlipstreamV3PoolWatcher | undefined>[]
  } {
    const startTime = performance.now()
    const prefetched: SlipstreamV3PoolWatcher[] = []
    const fetching: Promise<SlipstreamV3PoolWatcher | undefined>[] = []
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
    factory: SlipstreamFactoryV3,
    tickSpacing: number,
    t0: Token,
    t1: Token,
    startTime: number,
  ):
    | undefined
    | SlipstreamV3PoolWatcher
    | Promise<SlipstreamV3PoolWatcher | undefined> {
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
    if (this.logProcessingStatus !== LogsProcessing.Started) return // don't create pools by logs before started
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
    factory: SlipstreamFactoryV3,
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

  errorLog(msg: string, err?: unknown, trim?: boolean) {
    Logger.error(this.multiCallAggregator.chainId, msg, err, trim)
  }

  override isStarted() {
    return this.logProcessingStatus === LogsProcessing.Started
  }
}
