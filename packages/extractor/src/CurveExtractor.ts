import { CurvePoolCode, LiquidityProviders } from '@sushiswap/router'
import { RToken, createCurvePoolsForMultipool } from '@sushiswap/tines'
import { Token } from 'sushi/currency'
import { Address, PublicClient, parseAbi, parseAbiItem } from 'viem'
import { Counter } from './Counter'
import { LogFilter2 } from './LogFilter2'
import { MultiCallAggregator } from './MulticallAggregator'
import { TokenManager } from './TokenManager'
import { warnLog } from './WarnLog'

const CurvePoolListNames = [
  'main', // all not-factory pools, including 3pool
  //'crypto', // all not-factory crypro pools
  'factory', // pools of factories 0x0959158b6040d32d04c301a72cbfd6b39e21c9ae(3CRV) and 0xb9fc157394af804a3578134a6585c0dc9cc990d4 (EUR)
  'factory-crvusd', // pools for factory 0x4F8846Ae9380B90d2E71D5e3D042dff3E7ebb40d (crvUSD)
  //'factory-eywa',   // legacy - 0 pools
  //'factory-crypto',
  //'factory-tricrypto',
  // 'factory-stable-ng',   // stable pools new generation
]

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

export interface CurveConfig {
  api: string
  minPoolLiquidityLimitUSD: number
  poolBlackList?: Address[]
}

interface APIPoolInfo {
  address: Address
  symbol: string
  usdTotal: number
  coins: {
    address: Address
    decimals: string
    usdPrice: number
    poolBalance: string
  }[]
}

const ABICommonPart = parseAbi([
  'function A() pure returns (uint256)',
  'function fee() pure returns (uint256)',
])
const ABIBalance128 = parseAbi([
  'function balances(int128) pure returns (uint256)',
])
const ABIBalance256 = parseAbi([
  'function balances(uint256) pure returns (uint256)',
])

export class CurveExtractor {
  readonly config: CurveConfig
  readonly multiCallAggregator: MultiCallAggregator
  readonly tokenManager: TokenManager

  readonly poolMap: Map<string, CurvePoolCode> = new Map()
  readonly tokenPairMap: Map<string, CurvePoolCode[]> = new Map()

  readonly logFilter: LogFilter2
  readonly logging: boolean
  readonly taskCounter: Counter
  started = false

  /// @param client
  /// @param factories list of supported factories
  /// @param logging to write logs in console or not
  constructor(
    client: PublicClient,
    config: CurveConfig,
    logFilter: LogFilter2,
    tokenManager: TokenManager,
    logging = true,
    multiCallAggregator?: MultiCallAggregator,
  ) {
    this.multiCallAggregator =
      multiCallAggregator || new MultiCallAggregator(client)
    this.config = config
    this.tokenManager = tokenManager
    this.logging = logging
    this.taskCounter = new Counter(() => {
      // do nothing
    })

    this.logFilter = logFilter
    /*logFilter.addFilter(UniV2EventsListenAbi, (logs?: Log[]) => {
      if (logs) {
        let eventKnown = 0
        let eventUnknown = 0
        let eventIgnore = 0
        let eventRemoved = 0
        logs.forEach((l) => {
          const {
            args: { reserve0, reserve1 },
          } = decodeEventLog({
            abi: UniV2EventsListenAbi,
            data: l.data,
            topics: l.topics,
          })
          const poolState = this.poolMap.get(l.address.toLowerCase())
          if (!poolState || poolState.status === PoolStatus.NoPool) {
            ++eventUnknown
            if (reserve0 !== undefined && reserve1 !== undefined)
              this.addPoolByLog(l.address, reserve0, reserve1)
            return
          }
          if (poolState.status === PoolStatus.IgnorePool) {
            ++eventIgnore
            return
          }
          if (l.removed) {
            ++eventRemoved
            this.updatePoolState(poolState)
            return
          }
          if (reserve0 !== undefined && reserve1 !== undefined) {
            if (poolState.status === PoolStatus.AddingPool) {
              poolState.reserve0 = reserve0
              poolState.reserve1 = reserve1
            } else {
              poolState.poolCode.pool.updateReserves(reserve0, reserve1)
              poolState.status = PoolStatus.ValidPool
            }
          }
          ++eventKnown
        })
        const blockNumber =
          logs.length > 0
            ? Number(logs[logs.length - 1].blockNumber || 0)
            : '<undefined>'
        const eventInfo = [
          eventKnown > 0 ? `${eventKnown} known` : '',
          eventIgnore > 0 ? `${eventIgnore} ignore` : '',
          eventUnknown > 0 ? `${eventUnknown} unknown` : '',
          eventRemoved > 0 ? `${eventRemoved} removed` : '',
        ]
          .filter((e) => e !== '')
          .join(', ')

        this.consoleLog(
          `Block ${blockNumber} ${logs.length} logs (${eventInfo}), jobs: ${this.taskCounter.counter}`,
        )
      } else {
        warnLog(
          this.multiCallAggregator.chainId,
          'Log collecting failed. Pools refetching',
        )
        Array.from(this.poolMap.values()).forEach((pc) =>
          this.updatePoolState(pc),
        )
      }
    })*/
  }

  async start() {
    const pools = await this.gatherCurvePools()
    const balancesType = await Promise.all(
      pools.map((p) => this.detectPoolInterface(p.address)),
    )
    await Promise.all(
      pools.map((p, i) => {
        const tokens = p.coins.map((t) => t.address)
        return this.addPool(p.address, tokens, balancesType[i])
      }),
    )
    this.consoleLog(`Total 2-token pools: ${this.poolMap.size}`)
    this.started = true
  }

  async gatherCurvePools(): Promise<APIPoolInfo[]> {
    const api = this.config.api
    const urlPrefix = api.endsWith('/') ? api : `${api}/`
    const blackList = this.config.poolBlackList ?? []

    const poolMap = new Map<string, APIPoolInfo>()
    for (const l in CurvePoolListNames) {
      const url = urlPrefix + CurvePoolListNames[l]
      try {
        // @ts-ignore
        const dataResp = await fetch(url)
        const data = (await dataResp.json()) as {
          data?: { poolData?: APIPoolInfo[] }
        }
        const poolList = data?.data?.poolData
        if (poolList === undefined) {
          warnLog(
            this.multiCallAggregator.chainId,
            `Crv pool list ${url} unexpected format`,
          )
          continue
        }
        poolList.forEach((p) => {
          if (!blackList.includes(p.address)) poolMap.set(p.address, p)
        })
        //poolList.forEach((p) => console.log(p.address, l))
      } catch (_e) {
        warnLog(
          this.multiCallAggregator.chainId,
          `Crv pool list ${url} reading failed`,
        )
      }
    }
    this.consoleLog(`Pools found: ${poolMap.size}`)

    const pools = Array.from(poolMap.values()).filter((p) => {
      return p.usdTotal >= this.config.minPoolLiquidityLimitUSD
    })
    this.consoleLog(
      `Pools with liquidity >= ${this.config.minPoolLiquidityLimitUSD}USD: ${pools.length}`,
    )

    // let skip = true
    // for (let i = 0; i < pools.length; ++i) {
    //   //if (pools[i].address === '0x80466c64868E1ab14a1Ddf27A676C3fcBE638Fe5')
    //     skip = false
    //   if (skip) continue
    //   await this.testEvents(pools[i].address)
    // }

    return pools
  }

  // true - new interface balances/coins, false - bad
  async detectPoolInterface(poolAddress: Address): Promise<boolean> {
    try {
      await this.multiCallAggregator.callValue(
        poolAddress,
        ABIBalance256,
        'balances',
        [0],
      )
      return true
    } catch (_e) {
      return false
    }
  }

  async addPool(
    poolAddress: Address,
    tokenAddress: Address[],
    balancesType: boolean,
  ) {
    try {
      const tokens = await Promise.all(
        tokenAddress.map((a) => this.tokenManager.findToken(a)),
      )
      const balancesCalls = tokenAddress.map((_, i) => ({
        address: poolAddress,
        abi: balancesType ? ABIBalance256 : ABIBalance128,
        functionName: 'balances',
        args: [i],
      }))
      const {
        blockNumber,
        returnValues: [A, fee, ...balances],
      } = await this.multiCallAggregator.callSameBlock([
        {
          address: poolAddress,
          abi: ABICommonPart,
          functionName: 'A',
        },
        {
          address: poolAddress,
          abi: ABICommonPart,
          functionName: 'fee',
        },
        ...balancesCalls,
      ])
      const pools = createCurvePoolsForMultipool(
        poolAddress,
        tokens as RToken[],
        Number(fee) / 1e10,
        Number(A),
        balances as bigint[],
      )
      pools.forEach((p) => {
        const poolCode = new CurvePoolCode(
          p,
          LiquidityProviders.CurveSwap,
          'Curve',
          1, //poolType, don't rely on pool.exchange return value
        )
        this.poolMap.set(p.uniqueID(), poolCode)
        const [a0, a1] =
          p.token0.address < p.token1.address
            ? [p.token0.address, p.token1.address]
            : [p.token1.address, p.token0.address]
        const tokenPair = this.tokenPairMap.get(a0 + a1) ?? []
        tokenPair.push(poolCode)
        this.tokenPairMap.set(a0 + a1, tokenPair)
      })
    } catch (_e) {
      warnLog(
        this.multiCallAggregator.chainId,
        `Pool ${poolAddress} adding error ${_e}`,
      )
    }
  }

  getPoolsForTokenPair(t0: Token, t1: Token) {
    const [a0, a1] =
      t0.address < t1.address
        ? [t0.address, t1.address]
        : [t1.address, t0.address]
    return this.tokenPairMap.get(a0 + a1) ?? []
  }

  getPoolsForTokens(tokensUnique: Token[]): {
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

  getTokensPoolsQuantity(tokenMap: Map<Token, number>) {
    const add = (token: RToken) => {
      const num = tokenMap.get(token as Token) || 0
      tokenMap.set(token as Token, num + 1)
    }
    Array.from(this.poolMap.values()).forEach((p) => {
      add(p.pool.token0)
      add(p.pool.token1)
    })
  }

  getCurrentPoolCodes(): CurvePoolCode[] {
    return Array.from(this.poolMap.values())
  }

  isStarted() {
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
}
