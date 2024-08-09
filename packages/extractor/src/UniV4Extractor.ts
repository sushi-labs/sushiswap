import { LiquidityProviders, PoolCode } from 'sushi'
import { Token } from 'sushi/currency'
import { Address, PublicClient, parseAbiItem } from 'viem'
import { Counter } from './Counter.js'
import { IExtractor } from './IExtractor.js'
import { Logger } from './Logger.js'
import { MultiCallAggregator } from './MulticallAggregator.js'
import { PermanentCache } from './PermanentCache.js'
import { TokenManager } from './TokenManager.js'
import { UniV4PoolWatcher } from './UniV4PoolWatcher.js'
import { Index, IndexArray, allFulfilled, sortTokenPair } from './Utils.js'

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
  spacing: number
  hooks: Address | undefined
}

interface PoolCacheRecord {
  address: Address
  id: string
  token0: Address
  token1: Address
  fee: number
  spacing: number
  hooks: Address | undefined
}

const poolInitEvent = parseAbiItem(
  'event Initialize(bytes32 indexed id, address indexed currency0, address indexed currency1, uint24 fee, int24 tickSpacing, address hooks)',
)

// function splitArray<T>(arr: T[], predicate: (a:T) => boolean): [T[], T[]] {
//   let predicateTrue: T[] = []
//   let predicateFalse: T[] = []
//   arr.forEach(a => {
//     if (predicate(a)) predicateTrue.push(a)
//     else predicateFalse.push(a)
//   })
//     return [predicateTrue, predicateFalse]
// }

export class UniV4Extractor extends IExtractor {
  multiCallAggregator: MultiCallAggregator
  tokenManager: TokenManager
  tickHelperContract: Address
  poolPermanentCache: PermanentCache<PoolCacheRecord>
  taskCounter: Counter
  logging: boolean

  config: UniV4Config[]
  configMap = new Index(new Map<string, UniV4Config>(), (s: string) =>
    s.toLowerCase(),
  ) // indexed by UniV4Config.address.toLowerCase()

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
    (s: string) => s.toLowerCase(),
  )

  constructor({
    config,
    client,
    multiCallAggregator,
    tokenManager,
    tickHelperContract,
    cacheDir,
    logging,
  }: {
    config: UniV4Config[]
    client?: PublicClient
    multiCallAggregator?: MultiCallAggregator
    tokenManager?: TokenManager
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
        `uniV3Tokens-${this.multiCallAggregator.chainId}`,
      )

    this.tickHelperContract = tickHelperContract
    this.taskCounter = new Counter(() => {})
    this.logging = logging ?? true
    this.poolPermanentCache = new PermanentCache(
      cacheDir,
      `uniV4Pools-${this.multiCallAggregator.chainId}`,
    )
  }

  override async start() {
    // const client = this.multiCallAggregator.client
    // const logsAll = await client.getLogs({
    //   address: this.config.address,
    //   event: poolInitEvent,
    //   // fromBlock,
    //   // toBlock,
    // })
    // console.log(this.config.address, logsAll)
  }

  override isStarted() {
    return true
  }

  override getPoolsForTokens(): {
    prefetched: PoolCode[]
    fetching: Promise<PoolCode | undefined>[]
  } {
    return { prefetched: [], fetching: [] }
  }

  override getPoolsBetweenTokenSets(
    tokensUnique1: Token[],
    tokensUnique2: Token[],
  ): {
    prefetched: PoolCode[]
    fetching: Promise<PoolCode[]>
  } {
    const prefetched: UniV4PoolWatcher[][] = []
    const waitList: Promise<UniV4PoolWatcher[]>[] = []
    for (let i = 0; i < tokensUnique1.length; ++i) {
      const t0 = tokensUnique1[i]
      this.tokenManager.findToken(t0.address as Address) // to let save it in the cache
      for (let j = 0; j < tokensUnique2.length; ++j) {
        const t1 = tokensUnique2[j]
        const { known, newAdded } = this.getPoolsCreatedForTokenPair(t0, t1)
        prefetched.push(known)
        waitList.push(newAdded)
      }
    }

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

  getCurrentPoolCodes() {
    return []
  }
  getUpdatedPoolCodes() {
    return []
  }
  getTokensPoolsQuantity() {}

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

      const newWatcher = this.addPoolWatching(
        {
          address,
          id,
          token0,
          token1,
          fee,
          spacing: tickSpacing,
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

  watchedPools = 0
  addPoolWatching(
    p: PoolInfo,
    source: 'cache' | 'request' | 'logs',
    addToCache = true,
    startTime = 0,
  ): UniV4PoolWatcher | undefined {
    // if (this.logProcessingStatus !== LogsProcessing.Started) {
    //   throw new Error(
    //     'Pools can be added only after Log processing have been started',
    //   )
    // }
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
        spacing: p.spacing,
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
      this.poolWatchersUpdated.set((w as UniV4PoolWatcher).address, w)
    })
    return watcher
  }

  consoleLog(log: string) {
    if (this.logging)
      console.log(`V4-${this.multiCallAggregator.chainId}: ${log}`)
  }

  errorLog(message: string, error?: unknown) {
    if (!(error instanceof Error))
      error = JSON.stringify(error, undefined, '  ')
    Logger.error(this.multiCallAggregator.chainId, `UniV4: ${message}`, error)
  }
}
