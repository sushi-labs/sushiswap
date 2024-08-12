import { LiquidityProviders, PoolCode, UniV4Pool, UniV4PoolCode } from 'sushi'
import { Token } from 'sushi/currency'
import {
  Address,
  Hex,
  Log,
  PublicClient,
  decodeEventLog,
  parseAbiItem,
} from 'viem'
import { PoolSyncState } from './AlgebraQualityChecker.js'
import { Counter } from './Counter.js'
import { IExtractor } from './IExtractor.js'
import { LogFilter2 } from './LogFilter2.js'
import { Logger, safeSerialize } from './Logger.js'
import { MultiCallAggregator } from './MulticallAggregator.js'
import { PermanentCache } from './PermanentCache.js'
import { TokenManager } from './TokenManager.js'
import {
  UniV4ChangeStateEventsAbi,
  UniV4PoolWatcher,
} from './UniV4PoolWatcher.js'
import {
  UniV4QualityChecker,
  UniV4QualityCheckerCallBackArg,
} from './UniV4QualityChecker.js'
import {
  Index,
  IndexArray,
  allFulfilled,
  sortTokenPair,
  uniqueArray,
} from './Utils.js'

export interface UniV4Config {
  address: Address
  provider: LiquidityProviders
}

interface PoolInfo {
  address: Address
  id: string
  token0: Token
  token1: Token
  fee: number
  tickSpacing: number
  hooks: Address | undefined
}

interface PoolCacheRecord {
  address: Address
  id: string
  token0: Address
  token1: Address
  fee: number
  tickSpacing: number
  hooks: Address | undefined
}

enum StartStatus {
  NotStarted = 'NotStarted',
  Starting = 'Starting',
  Started = 'Started',
}

const poolInitEvent = parseAbiItem(
  'event Initialize(bytes32 indexed id, address indexed currency0, address indexed currency1, uint24 fee, int24 tickSpacing, address hooks)',
)

export class UniV4Extractor extends IExtractor {
  multiCallAggregator: MultiCallAggregator
  tokenManager: TokenManager
  logFilter: LogFilter2
  qualityChecker: UniV4QualityChecker
  tickHelperContract: Address
  poolPermanentCache: PermanentCache<PoolCacheRecord>
  taskCounter: Counter
  logging: boolean

  config: UniV4Config[]
  configMap = new Index(new Map<string, UniV4Config>(), (s: string) =>
    s.toLowerCase(),
  )

  poolWatchers = new Index(
    new Map<string, UniV4PoolWatcher>(),
    (id: string, address: Address) => (id + address).toLowerCase(),
  )

  tokenPairPool = new IndexArray(
    new Map<string, UniV4PoolWatcher[]>(),
    (token0: Address, token1: Address) => (token0 + token1).toLowerCase(),
  ) // tokens MUST be sorted

  poolWatchersUpdated = new Index(
    new Map<string, UniV4PoolWatcher>(),
    (id: string, address: Address) => (id + address).toLowerCase(),
  )

  startStatus: StartStatus = StartStatus.NotStarted
  lastProcessdBlock = -1

  constructor({
    config,
    client,
    multiCallAggregator,
    tokenManager,
    logFilter,
    tickHelperContract,
    cacheDir,
    logging,
  }: {
    config: UniV4Config[]
    client?: PublicClient
    multiCallAggregator?: MultiCallAggregator
    tokenManager?: TokenManager
    logFilter: LogFilter2
    tickHelperContract: Address
    cacheDir: string
    logging?: boolean
  }) {
    super()
    this.config = config
    config.forEach((c) => this.configMap.set(c.address, c))

    if (multiCallAggregator === undefined && client === undefined)
      throw new Error(
        'UniV4Extractor: multiCallAggregator or client must not be undefined',
      )
    this.multiCallAggregator =
      multiCallAggregator || new MultiCallAggregator(client as PublicClient)

    this.tokenManager =
      tokenManager ||
      new TokenManager(
        this.multiCallAggregator,
        cacheDir as string,
        `uniV4Tokens-${this.multiCallAggregator.chainId}`,
      )

    this.tickHelperContract = tickHelperContract
    this.taskCounter = new Counter(() => {})
    this.logging = logging ?? true
    this.poolPermanentCache = new PermanentCache(
      cacheDir,
      `uniV4Pools-${this.multiCallAggregator.chainId}`,
    )

    this.qualityChecker = new UniV4QualityChecker(
      200,
      (arg: UniV4QualityCheckerCallBackArg) => {
        const { id, address } = arg.ethalonPool
        if (arg.ethalonPool !== this.poolWatchers.get(id, address)) return false // checked pool was replaced during checking
        if (arg.correctPool) {
          this.poolWatchers.set(id, address, arg.correctPool)
          this.poolWatchersUpdated.set(id, address, arg.correctPool)
          arg.correctPool.on('PoolCodeWasChanged', (w) => {
            const { id, address } = w as UniV4PoolWatcher
            this.poolWatchersUpdated.set(id, address, w)
          })
        }
        if (arg.status !== PoolSyncState.Match)
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
    logFilter.addFilter(UniV4ChangeStateEventsAbi, (logs?: Log[]) => {
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
          this.errorLog(`Block ${blockNumber} log process error`, e)
        }
      } else {
        this.errorLog('Log collecting failed. Pools refetching')
        this.poolWatchers.forEachValue((p) => p.updatePoolState())
      }
    })
  }

  override async start() {
    if (this.startStatus !== StartStatus.NotStarted) return
    this.startStatus = StartStatus.Starting
    const startTime = performance.now()

    if (this.tokenManager.tokens.size === 0)
      await this.tokenManager.addCachedTokens()

    // deduplication
    const cachedPoolsInfo: PoolInfo[] = uniqueArray(
      await this.poolPermanentCache.getAllRecords(),
      (p: PoolCacheRecord) => (p.id + p.address).toLowerCase(),
    )
      .map((r) => {
        const token0 = this.tokenManager.getKnownToken(r.token0)
        const token1 = this.tokenManager.getKnownToken(r.token1)
        return token0 && token1
          ? {
              ...r,
              token0,
              token1,
            }
          : undefined
      })
      .filter((p) => p !== undefined) as PoolInfo[]

    const promises = cachedPoolsInfo
      .map((p) => this.addPoolWatcher(p, 'cache', false))
      .filter((w) => w !== undefined)
      .map((w) => (w as UniV4PoolWatcher).downloadFinished())

    const result = await Promise.allSettled(promises)
    const failed = result.reduce(
      (c, r) => (r.status === 'rejected' ? c + 1 : c),
      0,
    )
    this.startStatus = StartStatus.Started
    this.consoleLog(
      `ExtractorV4 is ready, ${failed}/${
        result.length
      } pools failed (${Math.round(performance.now() - startTime)}ms)`,
    )
    if (failed > 0) {
      this.errorLog(
        `${failed}/${result.length} pools load failed during ExtractorV4 starting`,
      )
    }
    this.consoleLog(`${cachedPoolsInfo.length} pools were taken from cache`)
    this.consoleLog(
      `ExtractorV4 is started (${Math.round(performance.now() - startTime)}ms)`,
    )
  }

  override isStarted() {
    return this.startStatus === StartStatus.Started
  }

  override getPoolsForTokens(tokensUnique: Token[]): {
    prefetched: PoolCode[]
    fetching: Promise<PoolCode[]>
  } {
    const pairs: [Token, Token][] = []
    for (let i = 0; i < tokensUnique.length; ++i) {
      const t0 = tokensUnique[i]
      for (let j = i + 1; j < tokensUnique.length; ++j) {
        pairs.push([t0, tokensUnique[j]])
      }
    }

    return this.getPoolsCreatedForTokenPairs(pairs)
  }

  override getPoolsBetweenTokenSets(
    tokensUnique1: Token[],
    tokensUnique2: Token[],
  ): {
    prefetched: PoolCode[]
    fetching: Promise<PoolCode[]>
  } {
    const pairs: [Token, Token][] = []
    for (let i = 0; i < tokensUnique1.length; ++i) {
      const t0 = tokensUnique1[i]
      for (let j = 0; j < tokensUnique2.length; ++j) {
        pairs.push([t0, tokensUnique2[j]])
      }
    }

    return this.getPoolsCreatedForTokenPairs(pairs)
  }

  override getCurrentPoolCodes() {
    return this.poolWatchers
      .mapValue((p) => p.getPoolCode())
      .filter((pc) => pc !== undefined) as PoolCode[]
  }

  // side effect: updated pools list is cleared
  override getUpdatedPoolCodes(): PoolCode[] {
    const res = this.poolWatchersUpdated
      .mapValue((p) => p.getPoolCode())
      .filter((pc) => pc !== undefined) as UniV4PoolCode[]
    res.forEach((p) =>
      this.poolWatchersUpdated.delete((p.pool as UniV4Pool).id, p.pool.address),
    )
    return res
  }

  override getTokensPoolsQuantity(tokenMap: Map<Token, number>) {
    const add = (token: Token) => {
      const num = tokenMap.get(token) || 0
      tokenMap.set(token, num + 1)
    }
    this.poolWatchers.forEachValue((p) => {
      add(p.token0)
      add(p.token1)
    })
  }

  getPoolsCreatedForTokenPairs(pairs: [Token, Token][]): {
    prefetched: PoolCode[]
    fetching: Promise<PoolCode[]>
  } {
    const prefetched: UniV4PoolWatcher[][] = []
    const waitList: Promise<UniV4PoolWatcher[]>[] = []
    pairs.forEach((pair) => {
      if (pair[0].equals(pair[1])) return
      const { known, newAdded } = this.getPoolsCreatedForTokenPair(...pair)
      prefetched.push(known)
      waitList.push(newAdded)
    })

    const fetching = allFulfilled(waitList).then((res) =>
      allFulfilled(res.flat().map((w) => w.waitPoolCode())).then(
        (pcs) => pcs.filter((pc) => pc !== undefined) as PoolCode[],
      ),
    )

    return {
      prefetched: prefetched
        .flat()
        .map((p) => p.getPoolCode())
        .filter((p) => p !== undefined) as PoolCode[],
      fetching,
    }
  }

  // ATTENTION: pools created after this moment and before <await newAdded> moment are not returned by this function
  getPoolsCreatedForTokenPair(
    token0: Token,
    token1: Token,
  ): {
    known: UniV4PoolWatcher[]
    newAdded: Promise<UniV4PoolWatcher[]>
  } {
    const [t0, t1] = sortTokenPair(token0, token1)
    return {
      known: this.tokenPairPool.get(token0.address, token1.address) ?? [],
      newAdded: this.getPoolsCreatedForSortedTokenPair(t0, t1),
    }
  }

  async getPoolsCreatedForSortedTokenPair(
    token0: Token,
    token1: Token,
  ): Promise<UniV4PoolWatcher[]> {
    const startTime = performance.now()
    const client = this.multiCallAggregator.client
    const events = await client.getLogs({
      address: this.config.map((c) => c.address),
      event: poolInitEvent,
      args: {
        currency0: token0.address,
        currency1: token1.address,
      },
    })
    const newAdded: UniV4PoolWatcher[] = []
    events.forEach(({ args, address }) => {
      const { id, fee, tickSpacing, hooks } = args
      if (id === undefined) {
        this.errorLog(`undefined id in getLog for ${address}`, args)
        return
      }

      const watcher = this.poolWatchers.get(id, address)
      if (watcher !== undefined) return

      if (fee === undefined || tickSpacing === undefined) {
        this.errorLog(
          `undefined fee ${fee} or tickSpacing ${tickSpacing} in getLog for ${address}:${id}`,
        )
        return
      }

      const config = this.configMap.get(address)
      if (config === undefined) {
        this.errorLog(`unknown pool address ${address} in getLogs`, args)
        return
      }

      const newWatcher = this.addPoolWatcher(
        {
          address,
          id,
          token0,
          token1,
          fee,
          tickSpacing,
          hooks,
        },
        'request',
        true,
        startTime,
      )
      if (newWatcher !== undefined) newAdded.push(newWatcher)
    })

    return newAdded
  }

  processLog(l: Log): string {
    try {
      const event = decodeEventLog({
        abi: UniV4ChangeStateEventsAbi,
        data: l.data,
        topics: l.topics,
      })
      const pool = this.poolWatchers.get(event.args.id, l.address)
      if (pool) {
        this.qualityChecker.processLog(l, pool)
        return pool.processLog(l)
      } else this.addPoolById(l.address, event.args.id) // ????? not too agressive?
      return 'UnknPool'
    } catch (e) {
      this.errorLog(
        `Log processing for pool ${l.address} throwed an exception`,
        e,
      )
      return 'Exception!!!'
    }
  }

  async addPoolById(
    address: Address,
    id: string,
  ): Promise<UniV4PoolWatcher | undefined> {
    if (this.multiCallAggregator.chainId === undefined) return
    this.taskCounter.inc()
    try {
      const startTime = performance.now()
      const client = this.multiCallAggregator.client
      const initEvents = await client.getLogs({
        address: this.config.map((c) => c.address),
        event: poolInitEvent,
        args: { id: id as Hex },
      })
      if (initEvents.length === 0) {
        this.errorLog(`Unknown id: ${address}:${id}`)
        return
      }

      const { currency0, currency1, fee, tickSpacing, hooks } =
        initEvents[0].args
      if (
        currency0 &&
        currency1 &&
        fee !== undefined &&
        tickSpacing !== undefined
      ) {
        const [token0, token1] = await Promise.all([
          this.tokenManager.findToken(currency0),
          this.tokenManager.findToken(currency1),
        ])
        if (token0 && token1) {
          return this.addPoolWatcher(
            { address, id, token0, token1, fee, tickSpacing, hooks },
            'logs',
            true,
            startTime,
          )
        }
      }
    } finally {
      this.taskCounter.dec()
    }
  }

  watchedPools = 0
  addPoolWatcher(
    p: PoolInfo,
    source: 'cache' | 'request' | 'logs',
    addToCache = true,
    startTime = 0,
  ): UniV4PoolWatcher | undefined {
    if (this.startStatus === StartStatus.NotStarted) {
      throw new Error(
        'Pools can be added only after Log processing have been started',
      )
    }
    const config = this.configMap.get(p.address)
    if (config === undefined) return // unsupported uniV4 provider
    if (this.poolWatchers.has(p.id, p.address)) return // pool watcher exists

    startTime = startTime || performance.now()

    const watcher = new UniV4PoolWatcher({
      ...p,
      provider: config.provider,
      tickHelperContract: this.tickHelperContract,
      client: this.multiCallAggregator,
      busyCounter: this.taskCounter,
    })

    watcher.updatePoolState()
    this.poolWatchers.set(p.id, p.address, watcher)

    const [{ address: t0 }, { address: t1 }] = sortTokenPair(p.token0, p.token1)

    this.tokenPairPool.push(t0, t1, watcher)

    if (addToCache)
      this.poolPermanentCache.add({
        address: p.address,
        id: p.id,
        token0: t0,
        token1: t1,
        fee: p.fee,
        tickSpacing: p.tickSpacing,
        hooks: p.hooks,
      })
    watcher.once('isUpdated', () => {
      ++this.watchedPools
      if (source !== 'cache') {
        const delay = Math.round(performance.now() - startTime)
        this.consoleLog(
          `add pool ${p.address}:${p.id} (${delay}ms, ${source}), watched pools total: ${this.watchedPools}`,
        )
      }
    })
    watcher.on('PoolCodeWasChanged', (w) => {
      const { id, address } = w as UniV4PoolWatcher
      this.poolWatchersUpdated.set(id, address, w)
    })
    return watcher
  }

  consoleLog(log: string) {
    if (this.logging)
      console.log(`V4-${this.multiCallAggregator.chainId}: ${log}`)
  }

  errorLog(message: string, error?: unknown, trim?: boolean) {
    if (!(error instanceof Error))
      error = JSON.stringify(error, undefined, '  ')
    Logger.error(
      this.multiCallAggregator.chainId,
      `UniV4: ${message}`,
      error,
      trim,
    )
  }
}
