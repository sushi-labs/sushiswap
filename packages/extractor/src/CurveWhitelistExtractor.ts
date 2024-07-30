import { Token } from 'sushi/currency'
import {
  CurvePoolCode,
  CurvePoolType,
  CurvePoolWhiteList,
  LiquidityProviders,
  curvePoolABI,
  getPoolRatio,
} from 'sushi/router'
import {
  CurveMultitokenCore,
  RToken,
  createCurvePoolsForMultipool,
} from 'sushi/tines'
import {
  Address,
  Log,
  PublicClient,
  decodeEventLog,
  parseAbi,
  parseAbiItem,
} from 'viem'
import { Counter } from './Counter.js'
import { IExtractor } from './IExtractor.js'
import { LogFilter2 } from './LogFilter2.js'
import { Logger } from './Logger.js'
import { MultiCallAggregator } from './MulticallAggregator.js'
import { TokenManager } from './TokenManager.js'

const POOL_RATIO_UPDATE_INTERVAL = 30 * 60_000 // How often to update pools with ratio !== 1

export const CurveEventsAbi = [
  parseAbiItem(
    'event TokenExchange(address indexed buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)',
  ),
  parseAbiItem(
    'event TokenExchangeUnderlying(address indexed buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)',
  ),
  parseAbiItem(
    'event AddLiquidity(address indexed provider, uint256[2] token_amounts, uint256[2] fees, uint256 invariant, uint256 token_supply)',
  ),
  parseAbiItem(
    'event AddLiquidity(address indexed provider, uint256[3] token_amounts, uint256[3] fees, uint256 invariant, uint256 token_supply)',
  ),
  parseAbiItem(
    'event AddLiquidity(address indexed provider, uint256[4] token_amounts, uint256[4] fees, uint256 invariant, uint256 token_supply)',
  ),
  parseAbiItem(
    'event RemoveLiquidity(address indexed provider, uint256[2] token_amounts, uint256[2] fees, uint256 token_supply)',
  ),
  parseAbiItem(
    'event RemoveLiquidity(address indexed provider, uint256[3] token_amounts, uint256[3] fees, uint256 token_supply)',
  ),
  parseAbiItem(
    'event RemoveLiquidity(address indexed provider, uint256[4] token_amounts, uint256[4] fees, uint256 token_supply)',
  ),
  parseAbiItem(
    'event RemoveLiquidityOne(address indexed provider, uint256 token_amount, uint256 coin_amount)',
  ),
  parseAbiItem(
    'event RemoveLiquidityOne(address indexed provider, uint256 token_amount, uint256 coin_amount, uint256 token_supply)',
  ),
  parseAbiItem(
    'event RemoveLiquidityImbalance(address indexed provider, uint256[2] token_amounts, uint256[2] fees, uint256 invariant, uint256 token_supply)',
  ),
  parseAbiItem(
    'event RemoveLiquidityImbalance(address indexed provider, uint256[3] token_amounts, uint256[3] fees, uint256 invariant, uint256 token_supply)',
  ),
  parseAbiItem(
    'event RemoveLiquidityImbalance(address indexed provider, uint256[4] token_amounts, uint256[4] fees, uint256 invariant, uint256 token_supply)',
  ),
  parseAbiItem('event NewFee(uint256 fee, uint256 admin_fee)'),
  parseAbiItem(
    'event NewFee(uint256 fee, uint256 admin_fee, uint256 offpeg_fee_multiplier)',
  ),
]

const CurveAllEventsAbi = parseAbi([
  // used
  'event TokenExchange(address indexed buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)',
  'event TokenExchangeUnderlying(address indexed buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)',
  'event AddLiquidity(address indexed provider, uint256[2] token_amounts, uint256[2] fees, uint256 invariant, uint256 token_supply)',
  'event AddLiquidity(address indexed provider, uint256[3] token_amounts, uint256[3] fees, uint256 invariant, uint256 token_supply)',
  'event AddLiquidity(address indexed provider, uint256[4] token_amounts, uint256[4] fees, uint256 invariant, uint256 token_supply)',
  'event RemoveLiquidity(address indexed provider, uint256[2] token_amounts, uint256[2] fees, uint256 token_supply)',
  'event RemoveLiquidity(address indexed provider, uint256[3] token_amounts, uint256[3] fees, uint256 token_supply)',
  'event RemoveLiquidity(address indexed provider, uint256[4] token_amounts, uint256[4] fees, uint256 token_supply)',
  'event RemoveLiquidityOne(address indexed provider, uint256 token_amount, uint256 coin_amount)',
  'event RemoveLiquidityOne(address indexed provider, uint256 token_amount, uint256 coin_amount, uint256 token_supply)',
  'event RemoveLiquidityImbalance(address indexed provider, uint256[2] token_amounts, uint256[2] fees, uint256 invariant, uint256 token_supply)',
  'event RemoveLiquidityImbalance(address indexed provider, uint256[3] token_amounts, uint256[3] fees, uint256 invariant, uint256 token_supply)',
  'event RemoveLiquidityImbalance(address indexed provider, uint256[4] token_amounts, uint256[4] fees, uint256 invariant, uint256 token_supply)',
  'event NewFee(uint256 fee, uint256 admin_fee)',
  'event NewFee(uint256 fee, uint256 admin_fee, uint256 offpeg_fee_multiplier)',

  //unused
  'event CommitNewAdmin(uint256 indexed deadline, address indexed admin)',
  'event NewAdmin(address indexed admin)',
  'event CommitNewFee(uint256 indexed deadline, uint256 fee, uint256 admin_fee)',
  'event CommitNewFee(uint256 indexed deadline, uint256 fee, uint256 admin_fee, uint256 offpeg_fee_multiplier)',
  'event RampA(uint256 old_A, uint256 new_A, uint256 initial_time, uint256 future_time)',
  'event StopRampA(uint256 A, uint256 t)',
  'event Transfer(address indexed sender, address indexed receiver, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
])

export interface CurveWhitelistConfig {
  minPoolLiquidityLimitUSD: number
  ratioPoolsUpdateInterval?: number
}

export class CurveWhitelistExtractor extends IExtractor {
  readonly config: CurveWhitelistConfig
  readonly multiCallAggregator: MultiCallAggregator
  readonly tokenManager: TokenManager

  readonly poolMap: Map<string, CurvePoolCode> = new Map() // indexed by uniqueId
  readonly poolTypeMap: Map<string, CurvePoolType> = new Map() // indexed by  pool address
  readonly coreMap: Map<string, CurveMultitokenCore> = new Map() // indexed by pool address.toLowerCase()
  readonly tokenPairMap: Map<string, CurvePoolCode[]> = new Map() // indexed by t0.address+t1.address
  readonly ratioPoolSet: Set<string> = new Set() // indexed by pool address
  readonly poolMapUpdated: Map<string, CurvePoolCode> = new Map() // indexed by uniqueId

  readonly logFilter: LogFilter2
  readonly logging: boolean
  readonly taskCounter: Counter
  started = false

  /// @param client
  /// @param factories list of supported factories
  /// @param logging to write logs in console or not
  constructor(
    client: PublicClient,
    config: CurveWhitelistConfig,
    logFilter: LogFilter2,
    tokenManager: TokenManager,
    logging = true,
    multiCallAggregator?: MultiCallAggregator,
  ) {
    super()
    this.multiCallAggregator =
      multiCallAggregator || new MultiCallAggregator(client)
    this.config = config
    this.tokenManager = tokenManager
    this.logging = logging
    this.taskCounter = new Counter(() => {
      // do nothing
    })

    this.logFilter = logFilter
    logFilter.addFilter(CurveEventsAbi, (logs?: Log[]) => {
      if (logs) {
        logs.forEach((l) => {
          const core = this.coreMap.get(l.address.toLowerCase())
          if (core === undefined) {
            return
          }
          const { eventName, args } = decodeEventLog({
            abi: CurveEventsAbi,
            data: l.data,
            topics: l.topics,
          })
          switch (eventName) {
            case 'TokenExchange':
            case 'TokenExchangeUnderlying': {
              const { sold_id, tokens_sold, bought_id, tokens_bought } = args
              core.applyReserveDiff(Number(sold_id), tokens_sold)
              core.applyReserveDiff(Number(bought_id), -tokens_bought)
              break
            }
            default:
              this.updatePool(core)
          }
        })
        const blockNumber =
          logs.length > 0
            ? Number(logs[logs.length - 1].blockNumber || 0)
            : '<undefined>'
        this.consoleLog(
          `Block ${blockNumber} ${logs.length} logs, jobs: ${this.taskCounter.counter}`,
        )
      } else {
        Logger.error(
          this.multiCallAggregator.chainId,
          'Log collecting failed. Pools refetching',
        )
        Array.from(this.coreMap.values()).forEach((pc) => this.updatePool(pc))
      }
    })
  }

  override async start() {
    const startTime = performance.now()
    if (this.tokenManager.tokens.size === 0)
      await this.tokenManager.addCachedTokens()
    await Promise.all(
      CurvePoolWhiteList.map((p) => {
        this.poolTypeMap.set(p.pool, p.poolType as CurvePoolType)
        return this.addPool(
          p.pool as Address,
          p.tokens,
          p.poolType as CurvePoolType,
        )
      }),
    )
    this.consoleLog(`Found pools with ratio != 1: ${this.ratioPoolSet.size}`)
    setInterval(async () => {
      if (this.ratioPoolSet.size > 0) {
        await this.updateRatioPools()
        this.consoleLog(`${this.ratioPoolSet.size} ratio pools were updated`)
      }
    }, this.config.ratioPoolsUpdateInterval ?? POOL_RATIO_UPDATE_INTERVAL)
    this.started = true
    this.consoleLog(
      `CurveWhitelistExtractor is started and ready(${Math.round(
        performance.now() - startTime,
      )}ms)`,
    )
  }

  async addPool(
    poolAddress: Address,
    tokenAddress: Address[] | RToken[],
    poolType: CurvePoolType,
  ) {
    try {
      const tokens =
        typeof tokenAddress[0] === 'string'
          ? ((await Promise.all(
              tokenAddress.map((a) =>
                this.tokenManager.findToken(a as Address),
              ),
            )) as RToken[])
          : (tokenAddress as RToken[])
      const balancesCalls = tokenAddress.map((_, i) => ({
        address: poolAddress,
        abi: curvePoolABI[poolType],
        functionName: 'balances',
        args: [i],
      }))
      const [
        {
          returnValues: [A, fee, ...balances],
        },
        ratio,
      ] = await Promise.all([
        this.multiCallAggregator.callSameBlock([
          {
            address: poolAddress,
            abi: curvePoolABI[poolType],
            functionName: 'A',
          },
          {
            address: poolAddress,
            abi: curvePoolABI[poolType],
            functionName: 'fee',
          },
          ...balancesCalls,
        ]),
        getPoolRatio(
          { readContract: this.multiCallAggregator.getReadContract() },
          poolAddress,
          tokens.map((t) => t.address) as Address[],
        ),
      ])
      if (ratio.some((r) => r !== 1)) this.ratioPoolSet.add(poolAddress)
      const pools = createCurvePoolsForMultipool(
        poolAddress,
        tokens as RToken[],
        Number(fee) / 1e10,
        Number(A),
        balances as bigint[],
        ratio,
      )
      this.coreMap.set(poolAddress.toLowerCase(), pools[0].core)
      pools.forEach((p) => {
        const poolCode = new CurvePoolCode(
          p,
          LiquidityProviders.CurveSwap,
          'Curve',
          poolType,
        )
        this.poolMap.set(p.uniqueID(), poolCode)
        this.poolMapUpdated.set(p.uniqueID(), poolCode)
        const [a0, a1] =
          p.token0.address < p.token1.address
            ? [p.token0.address, p.token1.address]
            : [p.token1.address, p.token0.address]
        const tokenPair = this.tokenPairMap.get(a0 + a1) ?? []
        tokenPair.push(poolCode)
        this.tokenPairMap.set(a0 + a1, tokenPair)
      })
    } catch (_e) {
      Logger.error(
        this.multiCallAggregator.chainId,
        `Pool ${poolAddress} adding error ${_e}`,
      )
    }
  }

  async updatePool(core: CurveMultitokenCore) {
    return await this.addPool(
      core.address as Address,
      core.tokens,
      this.poolTypeMap.get(core.address) as CurvePoolType,
    )
  }

  async updateRatioPools() {
    await Promise.all(
      Array.from(this.ratioPoolSet.values()).map((pool) =>
        this.updatePool(
          this.coreMap.get(pool.toLowerCase()) as CurveMultitokenCore,
        ),
      ),
    )
  }

  getPoolsForTokenPair(t0: Token, t1: Token) {
    const [a0, a1] =
      t0.address < t1.address
        ? [t0.address, t1.address]
        : [t1.address, t0.address]
    return this.tokenPairMap.get(a0 + a1) ?? []
  }

  override getPoolsForTokens(tokensUnique: Token[]): {
    prefetched: CurvePoolCode[]
    fetching: Promise<CurvePoolCode | undefined>[]
  } {
    let prefetched: CurvePoolCode[] = []
    for (let i = 0; i < tokensUnique.length; ++i) {
      const t0 = tokensUnique[i]
      for (let j = i + 1; j < tokensUnique.length; ++j) {
        const t1 = tokensUnique[j]
        prefetched = prefetched.concat(this.getPoolsForTokenPair(t0, t1))
      }
    }
    return {
      prefetched,
      fetching: [],
    }
  }

  override getTokensPoolsQuantity(tokenMap: Map<Token, number>) {
    const add = (token: RToken) => {
      const num = tokenMap.get(token as Token) || 0
      tokenMap.set(token as Token, num + 1)
    }
    Array.from(this.poolMap.values()).forEach((p) => {
      add(p.pool.token0)
      add(p.pool.token1)
    })
  }

  override getCurrentPoolCodes(): CurvePoolCode[] {
    return Array.from(this.poolMap.values())
  }

  override isStarted() {
    return this.started
  }

  consoleLog(log: string) {
    if (this.logging)
      console.log(`CRV-${this.multiCallAggregator.chainId}: ${log}`)
  }

  // checks that we don't miss any log of a pool - not for production
  async testEvents(poolAddress: Address) {
    const client = this.multiCallAggregator.client
    for (let blocks = 500_000; blocks > 1; blocks = Math.floor(blocks / 2)) {
      try {
        const toBlock = (await client.getBlockNumber()) - 200n
        const fromBlock = toBlock - BigInt(blocks)
        const logsAll = await client.getLogs({
          address: poolAddress,
          fromBlock,
          toBlock,
        })
        const logsKnownEvents = await client.getLogs({
          address: poolAddress,
          fromBlock,
          toBlock,
          events: CurveAllEventsAbi,
        })

        console.log(
          poolAddress,
          logsAll.length,
          logsKnownEvents.length,
          logsAll.length - logsKnownEvents.length,
        )
        return
      } catch (_e) {
        console.log(poolAddress, `${blocks} blocks - too much logs`)
      }
    }
  }

  // side effect: updated pools list is cleared
  override getUpdatedPoolCodes(): CurvePoolCode[] {
    const pools = Array.from(this.poolMapUpdated.values())
    this.poolMapUpdated.clear()
    return pools
  }

  override getPoolsBetweenTokenSets(
    tokensUnique1: Token[],
    tokensUnique2: Token[],
  ): {
    prefetched: CurvePoolCode[]
    fetching: Promise<CurvePoolCode | undefined>[]
  } {
    let prefetched: CurvePoolCode[] = []
    const fetching: Promise<CurvePoolCode | undefined>[] = []
    for (let i = 0; i < tokensUnique1.length; ++i) {
      const t0 = tokensUnique1[i]
      this.tokenManager.findToken(t0.address as Address) // to let save it in the cache
      for (let j = 0; j < tokensUnique2.length; ++j) {
        const t1 = tokensUnique2[j]
        const res = this.getPoolsForTokenPair(t0, t1)
        prefetched = prefetched.concat(res)
      }
    }
    return {
      prefetched,
      fetching,
    }
  }
}
