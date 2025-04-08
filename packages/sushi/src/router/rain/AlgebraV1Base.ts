import {
  Address,
  Hex,
  Log,
  PublicClient,
  encodeAbiParameters,
  getAddress,
  keccak256,
  parseAbiItem,
} from 'viem'
import { ChainId } from '../../chain/index.js'
import { Token } from '../../currency/index.js'
import { DataFetcherOptions } from '../data-fetcher.js'
import { getCurrencyCombinations } from '../get-currency-combinations.js'
import {
  PoolFilter,
  StaticPoolUniV3,
} from '../liquidity-providers/UniswapV3Base.js'
import { RainV3Pool, UniswapV3BaseProvider } from './UniswapV3Base.js'

export const AlgebraEventsAbi = [
  parseAbiItem(
    'event Mint(address sender, address indexed owner, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount, uint256 amount0, uint256 amount1)',
  ),
  parseAbiItem(
    'event Collect(address indexed owner, address recipient, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount0, uint128 amount1)',
  ),
  parseAbiItem(
    'event Burn(address indexed owner, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount, uint256 amount0, uint256 amount1)',
  ),
  parseAbiItem(
    'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)',
  ),
  parseAbiItem(
    'event Flash(address indexed sender, address indexed recipient, uint256 amount0, uint256 amount1, uint256 paid0, uint256 paid1)',
  ),
  parseAbiItem('event Fee(uint16 fee)'),
  parseAbiItem('event TickSpacing(int24 newTickSpacing)'),
  // for algebra factory, new pool created
  parseAbiItem(
    'event Pool(address indexed token0, address indexed token1, address pool)',
  ),
]

export const globalStateAbi = [
  {
    inputs: [],
    name: 'globalState',
    outputs: [
      { internalType: 'uint160', name: 'price', type: 'uint160' },
      { internalType: 'int24', name: 'tick', type: 'int24' },
      { internalType: 'uint16', name: 'fee', type: 'uint16' },
      {
        internalType: 'uint16',
        name: 'timepointIndex',
        type: 'uint16',
      },
      {
        internalType: 'uint8',
        name: 'communityFeeToken0',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'communityFeeToken1',
        type: 'uint8',
      },
      { internalType: 'bool', name: 'unlocked', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export abstract class AlgebraV1BaseProvider extends UniswapV3BaseProvider {
  override TICK_SPACINGS: Record<string, number> = {}
  override eventsAbi = AlgebraEventsAbi as any

  readonly BASE_FEE = 100
  DEFAULT_TICK_SPACING = 1
  gloablStateAbi = globalStateAbi

  poolDeployer: Record<number, Address> = {}

  constructor(
    chainId: ChainId,
    web3Client: PublicClient,
    factory: Record<number, Address>,
    initCodeHash: Record<number, string>,
    tickLens: Record<number, Address>,
    poolDeployer: Record<number, Address>,
    isTest = false,
  ) {
    super(chainId, web3Client, factory, initCodeHash, tickLens, isTest)
    this.poolDeployer = poolDeployer
    if (!(chainId in this.poolDeployer)) {
      throw new Error(
        `${this.getType()} cannot be instantiated for chainid ${chainId}, no poolDeployer address`,
      )
    }
  }

  override async fetchPoolData(
    t0: Token,
    t1: Token,
    excludePools?: Set<string> | PoolFilter,
    options?: DataFetcherOptions,
  ): Promise<RainV3Pool[]> {
    let staticPools = this.getStaticPools(t0, t1)
    if (excludePools)
      staticPools = staticPools.filter((p) => !excludePools.has(p.address))

    const tradeId = this.getTradeId(t0, t1)
    if (!this.poolsByTrade.has(tradeId))
      this.poolsByTrade.set(
        tradeId,
        staticPools.map((pool) => pool.address.toLowerCase()),
      )

    // filter out cached pools
    if (!options?.ignoreCache) {
      staticPools = this.filterCachedPools(staticPools)
    }

    const globalStateData = {
      multicallAddress: this.client.chain?.contracts?.multicall3?.address!,
      allowFailure: true,
      blockNumber: options?.blockNumber,
      contracts: staticPools.map(
        (pool) =>
          ({
            address: pool.address,
            chainId: this.chainId,
            abi: this.gloablStateAbi,
            functionName: 'globalState',
          }) as const,
      ),
    } as const
    const globalState = await this.client
      .multicall(globalStateData)
      .catch((e) => {
        console.warn(
          `${this.getLogPrefix()} - INIT: multicall failed, message: ${
            e.message
          }`,
        )
        return undefined
      })

    const tickSpacings = await this.getTickSpacing(staticPools, options)

    const existingPools: RainV3Pool[] = []
    staticPools.forEach((pool, i) => {
      const poolAddress = pool.address.toLowerCase()
      if (globalState === undefined || !globalState[i]) {
        this.handleNullPool(poolAddress)
        return
      }
      let tickSpacing = this.DEFAULT_TICK_SPACING
      if (typeof tickSpacings?.[i]?.result === 'number') {
        tickSpacing = tickSpacings[i]!.result!
      }
      const sqrtPriceX96 = globalState[i]!.result?.[0] // price
      const tick = globalState[i]!.result?.[1] // tick
      if (!sqrtPriceX96 || sqrtPriceX96 === 0n || typeof tick !== 'number') {
        this.handleNullPool(poolAddress)
        return
      }
      const fee = globalState[i]!.result?.[2] // fee
      if (!fee) {
        this.handleNullPool(poolAddress)
        return
      }
      const activeTick = this.getActiveTick(tick, tickSpacing)
      if (typeof activeTick !== 'number') {
        this.handleNullPool(poolAddress)
        return
      }
      existingPools.push({
        ...pool,
        fee,
        sqrtPriceX96,
        activeTick,
        tickSpacing,
        ticks: new Map(),
        reserve0: 0n,
        reserve1: 0n,
        liquidity: 0n,
        blockNumber: options?.blockNumber ?? 0n,
      })
    })

    return existingPools
  }

  override getStaticPools(t1: Token, t2: Token): StaticPoolUniV3[] {
    const allCombinations = getCurrencyCombinations(this.chainId, t1, t2)
    const currencyCombinations: [Token, Token][] = []
    allCombinations.forEach(([currencyA, currencyB]) => {
      if (currencyA && currencyB) {
        const tokenA = currencyA.wrapped
        const tokenB = currencyB.wrapped
        if (tokenA.equals(tokenB)) return
        currencyCombinations.push(
          tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA],
        )
      }
    })
    return currencyCombinations.map(([currencyA, currencyB]) => ({
      address: getAlgebraPoolAddress(
        this.poolDeployer[this.chainId as keyof typeof this.poolDeployer]!,
        currencyA.wrapped.address,
        currencyB.wrapped.address,
        this.initCodeHash[
          this.chainId as keyof typeof this.initCodeHash
        ] as `0x${string}`,
      ),
      token0: currencyA,
      token1: currencyB,
      fee: this.BASE_FEE,
    }))
  }

  // algebra doesnt have the fee/ticks setup the same way univ3 has
  override async ensureFeeAndTicks(): Promise<boolean> {
    return true
  }

  // handle extra events that Algebra has
  override otherEventCases(
    log: Log,
    event: Log<
      bigint,
      number,
      boolean,
      (typeof AlgebraEventsAbi)[number],
      true,
      typeof AlgebraEventsAbi,
      (typeof AlgebraEventsAbi)[number]['name']
    >,
    pool: RainV3Pool,
  ): void {
    switch (event.eventName) {
      case 'Fee': {
        if (log.blockNumber! >= pool.blockNumber) {
          pool.blockNumber = log.blockNumber!
          pool.fee = event.args.fee
        }
        break
      }
      case 'TickSpacing': {
        if (log.blockNumber! >= pool.blockNumber) {
          pool.blockNumber = log.blockNumber!
          pool.tickSpacing = event.args.newTickSpacing
        }
        break
      }
      default:
    }
  }
}

// from packages/extractor/src/AlgebraExtractor.ts
export function getAlgebraPoolAddress(
  poolDeployer: Address,
  tokenA: Address,
  tokenB: Address,
  initCodeHash: Hex,
): Address {
  const constructorArgumentsEncoded = encodeAbiParameters(
    [
      { name: 'TokenA', type: 'address' },
      { name: 'TokenB', type: 'address' },
    ],
    [tokenA, tokenB],
  )
  const create2Inputs = [
    '0xff',
    poolDeployer,
    keccak256(constructorArgumentsEncoded as Hex),
    initCodeHash,
  ]
  const sanitizedInputs = `0x${create2Inputs.map((i) => i.slice(2)).join('')}`

  return getAddress(`0x${keccak256(sanitizedInputs as Hex).slice(-40)}`)
}
