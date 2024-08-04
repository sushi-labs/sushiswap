import { LiquidityProviders, PoolCode } from 'sushi'
import { Address, PublicClient, parseAbiItem } from 'viem'
import { IExtractor } from './IExtractor.js'
import { MultiCallAggregator } from './MulticallAggregator.js'
import { TokenManager } from './TokenManager.js'
import { UniV4PoolWatcher } from './UniV4PoolWatcher.js'
import { Logger } from './Logger.js'
import { Token } from 'sushi/currency'
import { Counter } from './Counter.js'

export interface UniV4Config {
  address: Address
  provider: LiquidityProviders
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

function _getPoolUniqueId(id: string|undefined, address: Address) {
  return ((id || '') + address).toLowerCase()
}

export class UniV4Extractor extends IExtractor {
  multiCallAggregator: MultiCallAggregator
  tokenManager: TokenManager
  tickHelperContract: Address
  taskCounter: Counter

  config: UniV4Config[]
  configMap = new Map<string, UniV4Config>() // indexed by UniV4Config.address.toLowerCase()

  poolWatchers = new Map<string, UniV4PoolWatcher>()  // indexed by _getPoolUniqueId

  constructor({
    config,
    client,
    multiCallAggregator,
    tokenManager,
    tickHelperContract,
    cacheDir,
  }: {
    config: UniV4Config[]
    client?: PublicClient
    multiCallAggregator?: MultiCallAggregator
    tokenManager?: TokenManager
    tickHelperContract: Address,
    cacheDir: string
  }) {
    super()
    this.config = config
    config.forEach(c => this.configMap.set(c.address.toLowerCase(), c))

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
  }

  async start() {
    // const client = this.multiCallAggregator.client
    // const logsAll = await client.getLogs({
    //   address: this.config.address,
    //   event: poolInitEvent,
    //   // fromBlock,
    //   // toBlock,
    // })
    // console.log(this.config.address, logsAll)
  }

  isStarted() {
    return true
  }

  getPoolsForTokens(): {
    prefetched: PoolCode[]
    fetching: Promise<PoolCode | undefined>[]
  } {
    return { prefetched: [], fetching: [] }
  }

  getPoolsBetweenTokenSets(): {
    prefetched: PoolCode[]
    fetching: Promise<PoolCode | undefined>[]
  } {
    return { prefetched: [], fetching: [] }
  }

  getCurrentPoolCodes() {
    return []
  }
  getUpdatedPoolCodes() {
    return []
  }
  getTokensPoolsQuantity() {}

  async getPoolsCreatedForSortedTokenPair(token0: Token, token1: Token): Promise<{
    known: UniV4PoolWatcher[],
    newAdded: UniV4PoolWatcher[]
  }> {
    const client = this.multiCallAggregator.client
    const events = await client.getLogs({
      address: this.config.map(c => c.address),
      event: poolInitEvent,
      args: {
        currency0: token0.address,
        currency1: token1.address,
      },
    })
    let known: UniV4PoolWatcher[] = []
    let newAdded: UniV4PoolWatcher[] = []
    events.forEach(({args, address}) => {
      const {id, fee, tickSpacing, hooks} = args
      if (id === undefined) {
        Logger.error(
          this.multiCallAggregator.chainId,
          `UniV4: undefined id in getLog for ${address}`,
          JSON.stringify(args, undefined, '  ')
        )
        return
      }

      const watcher = this.poolWatchers.get(_getPoolUniqueId(args.id, address))
      if (watcher !== undefined) {
        known.push(watcher)
        return
      }

      if (fee === undefined || tickSpacing === undefined) {
        Logger.error(
          this.multiCallAggregator.chainId,
          `UniV4: undefined fee ${fee} or tickSpacing ${tickSpacing} in getLog for ${address}:${id}`
        )
        return
      }

      const config = this.configMap.get(address.toLowerCase())
      if (config === undefined) {
        Logger.error(
          this.multiCallAggregator.chainId,
          `UniV4: unknown pool address ${address} in getLogs`,
          JSON.stringify(args, undefined, '  ')
        )
        return
      }

      newAdded.push(new UniV4PoolWatcher({
        provider: config.provider,
        address,
        id,
        tickHelperContract: this.tickHelperContract,
        token0,
        token1,
        fee,
        spacing: tickSpacing,
        hooks,
        client: this.multiCallAggregator,
        busyCounter: this.taskCounter
      }))
    })
    
    return {known, newAdded}
  }

}
