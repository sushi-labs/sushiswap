import {
  Address,
  Hex,
  Log,
  PublicClient,
  encodeAbiParameters,
  getAddress,
  keccak256,
  parseAbiItem,
  parseAbiParameters,
  parseEventLogs,
} from 'viem'
import { ChainId } from '../../chain/index.js'
import { Token } from '../../currency/index.js'
import { getCurrencyCombinations } from '../get-currency-combinations.js'
import {
  PoolFilter,
  StaticPoolUniV3,
} from '../liquidity-providers/UniswapV3Base.js'
import { RainDataFetcherOptions } from './RainDataFetcher.js'
import {
  RainV3Pool,
  UniV3EventsAbi,
  UniswapV3BaseProvider,
} from './UniswapV3Base.js'

export const ZERO_FEE_INDICATOR = 420

export enum FeeType {
  Default = 0,
  Dynamic = 1,
  Zero = 2,
}

export interface StaticSlipstreamPool extends StaticPoolUniV3 {
  tickSpacing: number
  feeType: FeeType
}

export interface SlipstreamPool extends RainV3Pool {
  feeType: FeeType
}

const feeAbi = [
  {
    inputs: [],
    name: 'fee',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const slot0Abi = [
  {
    inputs: [],
    name: 'slot0',
    outputs: [
      { internalType: 'uint160', name: 'sqrtPriceX96', type: 'uint160' },
      { internalType: 'int24', name: 'tick', type: 'int24' },
      { internalType: 'uint16', name: 'observationIndex', type: 'uint16' },
      {
        internalType: 'uint16',
        name: 'observationCardinality',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'observationCardinalityNext',
        type: 'uint16',
      },
      { internalType: 'bool', name: 'unlocked', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const customFeeAbi = [
  {
    inputs: [{ internalType: 'address', name: '_pool', type: 'address' }],
    name: 'customFee',
    outputs: [{ internalType: 'uint24', name: '', type: 'uint24' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const SlipstreamEventsAbi = [
  ...UniV3EventsAbi.slice(0, -1), // univ3 shared events except PoolCreated
  parseAbiItem(
    'event PoolCreated(address indexed token0, address indexed token1, int24 indexed tickSpacing, address pool)',
  ),
  parseAbiItem(
    'event TickSpacingEnabled(int24 indexed tickSpacing, uint24 indexed fee)',
  ),
  parseAbiItem('event CustomFeeSet(address indexed pool, uint24 indexed fee)'),
  parseAbiItem(
    'event SwapFeeModuleChanged(address indexed oldFeeModule, address indexed newFeeModule)',
  ),
]

export abstract class VelodromeSlipstreamBaseProvider extends UniswapV3BaseProvider {
  readonly BASE_FEE = 100
  DEFAULT_TICK_SPACINGS = [1, 50, 100, 200, 2000] as const
  tickSpacings: number[] = [...this.DEFAULT_TICK_SPACINGS]

  shouldResetFees = false
  feeSpacingMap: Record<number, number> = {} // fee to tick spacing map
  spacingFeeMap: Record<number, number> = {} // tick spacing to fee map

  poolImplementation: Record<number, Address> = {}
  swapFeeModule: Record<number, Address> = {}

  override eventsAbi = SlipstreamEventsAbi as any

  constructor(
    chainId: ChainId,
    web3Client: PublicClient,
    factory: Record<number, Address>,
    tickLens: Record<number, Address>,
    isTest = false,
  ) {
    super(
      chainId,
      web3Client,
      factory,
      { [chainId]: `0x${'0'.repeat(64)}` },
      tickLens,
      isTest,
    )
  }

  override async init(blockNumber?: bigint) {
    if (!this.initialized) {
      if (!this.poolImplementation[this.chainId]) {
        const poolImplementation = await this.client
          .readContract({
            address: this.factory[this.chainId as keyof typeof this.factory]!,
            blockNumber,
            abi: [
              {
                inputs: [],
                name: 'poolImplementation',
                outputs: [
                  { internalType: 'address', name: '', type: 'address' },
                ],
                stateMutability: 'view',
                type: 'function',
              },
            ] as const,
            functionName: 'poolImplementation',
          })
          .catch((e) => {
            console.warn(
              `${this.getLogPrefix()} - INIT: multicall failed, message: ${
                e.message
              }`,
            )
            return undefined
          })
        if (!poolImplementation) return
        this.poolImplementation[this.chainId] = poolImplementation
      }

      if (!this.swapFeeModule[this.chainId]) {
        const swapFeeModule = await this.client
          .readContract({
            address: this.factory[this.chainId as keyof typeof this.factory]!,
            blockNumber,
            abi: [
              {
                inputs: [],
                name: 'swapFeeModule',
                outputs: [
                  { internalType: 'address', name: '', type: 'address' },
                ],
                stateMutability: 'view',
                type: 'function',
              },
            ] as const,
            functionName: 'swapFeeModule',
          })
          .catch((e) => {
            console.warn(
              `${this.getLogPrefix()} - INIT: multicall failed, message: ${
                e.message
              }`,
            )
            return undefined
          })
        if (!swapFeeModule) return
        this.swapFeeModule[this.chainId] = swapFeeModule
      }

      if (!this.tickSpacings) {
        const tickSpacings = await this.client
          .readContract({
            address: this.factory[this.chainId as keyof typeof this.factory]!,
            blockNumber,
            abi: [
              {
                inputs: [],
                name: 'tickSpacings',
                outputs: [
                  { internalType: 'int24[]', name: '', type: 'int24[]' },
                ],
                stateMutability: 'view',
                type: 'function',
              },
            ],
            functionName: 'tickSpacings',
          })
          .catch((e) => {
            console.warn(
              `${this.getLogPrefix()} - INIT: multicall failed, message: ${
                e.message
              }`,
            )
            return undefined
          })
        this.tickSpacings = (tickSpacings ??
          this.DEFAULT_TICK_SPACINGS) as number[]
      }

      if (!Object.values(this.feeSpacingMap).length) {
        const fees = await this.client
          .multicall({
            multicallAddress:
              this.client.chain?.contracts?.multicall3?.address!,
            allowFailure: true,
            blockNumber,
            contracts: this.tickSpacings.map((spacing) => ({
              address: this.factory[this.chainId as keyof typeof this.factory]!,
              chainId: this.chainId,
              abi: [
                {
                  inputs: [{ internalType: 'int24', name: '', type: 'int24' }],
                  name: 'tickSpacingToFee',
                  outputs: [
                    { internalType: 'uint24', name: '', type: 'uint24' },
                  ],
                  stateMutability: 'view',
                  type: 'function',
                },
              ] as const,
              functionName: 'tickSpacingToFee',
              args: [spacing],
            })),
          })
          .catch((e) => {
            console.warn(
              `${this.getLogPrefix()} - INIT: multicall failed, message: ${
                e.message
              }`,
            )
            return undefined
          })
        if (!fees) return
        for (let i = 0; i < this.tickSpacings.length; i++) {
          const fee = fees?.[i]?.result
          const tickSpacing = this.tickSpacings[i]
          if (typeof fee === 'number' && typeof tickSpacing === 'number') {
            this.feeSpacingMap[fee] = tickSpacing
            this.spacingFeeMap[tickSpacing] = fee
          }
        }
      }
      this.initialized = true
    }
  }

  override async fetchPoolData(
    t0: Token,
    t1: Token,
    excludePools?: Set<string> | PoolFilter,
    options?: RainDataFetcherOptions,
  ): Promise<SlipstreamPool[]> {
    await this.init(options?.blockNumber)

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
    // this ensures backward compatibility for original DataFetcher
    if (typeof options?.ignoreCache === 'boolean' && !options.ignoreCache) {
      staticPools = this.filterCachedPools(
        staticPools,
      ) as StaticSlipstreamPool[]
    }

    const slot0 = await this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address!,
        allowFailure: true,
        blockNumber: options?.blockNumber,
        contracts: staticPools.map((pool) => ({
          address: pool.address,
          chainId: this.chainId,
          abi: slot0Abi,
          functionName: 'slot0',
        })),
      })
      .catch((e) => {
        console.warn(
          `${this.getLogPrefix()} - INIT: multicall failed, message: ${
            e.message
          }`,
        )
        return undefined
      })

    const feeTypes = await this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address!,
        allowFailure: true,
        blockNumber: options?.blockNumber,
        contracts: staticPools.map((pool) => ({
          address: this.swapFeeModule[this.chainId]!,
          chainId: this.chainId,
          abi: customFeeAbi,
          functionName: 'customFee',
          args: [pool.address],
        })),
      })
      .catch((e) => {
        console.warn(
          `${this.getLogPrefix()} - INIT: multicall failed, message: ${
            e.message
          }`,
        )
        return undefined
      })
    staticPools.forEach((pool, i) => {
      const result = feeTypes?.[i]?.result
      if (typeof result === 'number') {
        if (result === 0) pool.feeType = FeeType.Default
        else if (result === ZERO_FEE_INDICATOR) pool.feeType = FeeType.Zero
        else pool.feeType = FeeType.Dynamic
      }
    })

    // get pool fees for dynamic fee type pools
    const poolFees = await this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address!,
        allowFailure: true,
        blockNumber: options?.blockNumber,
        contracts: staticPools
          .filter((pool) => pool.feeType === FeeType.Dynamic)
          .map(
            (pool) =>
              ({
                address: pool.address,
                chainId: this.chainId,
                abi: feeAbi,
                functionName: 'fee',
              }) as const,
          ),
      })
      .catch((e) => {
        console.warn(
          `${this.getLogPrefix()} - INIT: multicall failed, message: ${
            e.message
          }`,
        )
        return undefined
      })

    const existingPools: SlipstreamPool[] = []
    staticPools.forEach((pool, i) => {
      const poolAddress = pool.address.toLowerCase()
      if (slot0 === undefined || !slot0[i]) {
        this.handleNullPool(poolAddress)
        return
      }
      const sqrtPriceX96 = slot0[i]!.result?.[0] // price
      const tick = slot0[i]!.result?.[1] // tick
      if (!sqrtPriceX96 || sqrtPriceX96 === 0n || typeof tick !== 'number') {
        this.handleNullPool(poolAddress)
        return
      }
      const activeTick = Math.floor(tick / pool.tickSpacing) * pool.tickSpacing
      if (typeof activeTick !== 'number') {
        this.handleNullPool(poolAddress)
        return
      }
      const fee = (() => {
        if (pool.feeType === FeeType.Zero) {
          return 0
        } else if (pool.feeType === FeeType.Default) {
          return this.spacingFeeMap[pool.tickSpacing]!
        } else if (pool.feeType === FeeType.Dynamic) {
          const _fee = poolFees?.shift()?.result
          if (typeof _fee === 'number') return _fee
          else return undefined
        } else {
          return this.spacingFeeMap[pool.tickSpacing]!
        }
      })()
      if (typeof fee !== 'number') {
        this.handleNullPool(poolAddress)
        return
      }

      existingPools.push({
        ...pool,
        fee,
        sqrtPriceX96,
        activeTick,
        ticks: new Map(),
        reserve0: 0n,
        reserve1: 0n,
        liquidity: 0n,
        blockNumber: options?.blockNumber ?? 0n,
        feeType: pool.feeType,
      })
    })

    return existingPools
  }

  override handleFactoryEvents(log: Log) {
    const logAddress = log.address.toLowerCase()
    const factory =
      this.factory[this.chainId as keyof typeof this.factory]!.toLowerCase()
    const swapFeeModule =
      this.swapFeeModule[
        this.chainId as keyof typeof this.swapFeeModule
      ]!.toLowerCase()
    if (logAddress === factory || logAddress === swapFeeModule) {
      try {
        const event = parseEventLogs({
          logs: [log],
          abi: SlipstreamEventsAbi,
        })[0]!
        switch (event.eventName) {
          case 'PoolCreated': {
            this.nullPools.delete(event.args.pool.toLowerCase())
            break
          }
          case 'TickSpacingEnabled': {
            // new tick spacing enabled
            if (!this.tickSpacings.includes(event.args.tickSpacing)) {
              this.tickSpacings.push(event.args.tickSpacing)
            }
            this.feeSpacingMap[event.args.fee] = event.args.tickSpacing
            break
          }
          case 'CustomFeeSet': {
            // pool fee update
            const pool = this.pools.get(
              event.args.pool.toLowerCase(),
            ) as SlipstreamPool
            if (pool) {
              if (log.blockNumber! >= pool.blockNumber) {
                pool.blockNumber = log.blockNumber!
                if (event.args.fee === ZERO_FEE_INDICATOR) {
                  pool.fee = 0
                  pool.feeType = FeeType.Zero
                } else if (event.args.fee !== 0) {
                  pool.fee = event.args.fee
                  pool.feeType = FeeType.Dynamic
                } else {
                  pool.fee = this.spacingFeeMap[pool.tickSpacing]!
                  pool.feeType = FeeType.Default
                }
              }
            }
            break
          }
          case 'SwapFeeModuleChanged': {
            // factory swapFeeMoulde address changed
            if (
              this.swapFeeModule[this.chainId]?.toLowerCase() !==
              event.args.newFeeModule.toLowerCase()
            ) {
              // we need to reset the cached pools fees as they might
              // have wrong fees after swapFeeModule address is changed
              // PS: this event is very rare
              this.swapFeeModule[this.chainId] = event.args.newFeeModule
              this.shouldResetFees = true
            }
            break
          }
          default:
        }
      } catch {}
    }
  }

  override async afterProcessLog(untilBlock: bigint) {
    let pools: SlipstreamPool[] = []
    let shouldResetFees = false
    if (this.shouldResetFees) {
      shouldResetFees = true
      this.shouldResetFees = false
    }
    this.pools.forEach((pool) => {
      if (shouldResetFees) {
        pools.push(pool as SlipstreamPool)
      } else {
        if ((pool as SlipstreamPool).feeType === FeeType.Dynamic) {
          pools.push(pool as SlipstreamPool)
        }
      }
    })

    let [_, poolFees] = await Promise.allSettled([
      // base after log process
      super.afterProcessLog(untilBlock),
      // get pool new fees
      shouldResetFees
        ? this.client.multicall({
            multicallAddress:
              this.client.chain?.contracts?.multicall3?.address!,
            allowFailure: true,
            blockNumber: untilBlock,
            contracts: pools.map((pool) => ({
              address: this.swapFeeModule[this.chainId]!,
              chainId: this.chainId,
              abi: customFeeAbi,
              functionName: 'customFee',
              args: [pool.address],
            })),
          })
        : this.client.multicall({
            multicallAddress:
              this.client.chain?.contracts?.multicall3?.address!,
            allowFailure: true,
            blockNumber: untilBlock,
            contracts: pools.map((pool) => ({
              address: pool.address,
              chainId: this.chainId,
              abi: feeAbi,
              functionName: 'fee',
            })),
          }),
    ])

    // handle pool fees
    if (poolFees.status === 'fulfilled') {
      if (shouldResetFees) {
        const newDynamicPools: SlipstreamPool[] = []
        pools.forEach((pool, i) => {
          const result = (poolFees as any).value?.[i]?.result
          if (typeof result === 'number') {
            if (result === 0) pool.feeType = FeeType.Default
            else if (result === ZERO_FEE_INDICATOR) pool.feeType = FeeType.Zero
            else {
              pool.feeType = FeeType.Dynamic
              newDynamicPools.push(pool)
            }
          }
        })
        pools = newDynamicPools
        ;[poolFees] = await Promise.allSettled([
          this.client.multicall({
            multicallAddress:
              this.client.chain?.contracts?.multicall3?.address!,
            allowFailure: true,
            blockNumber: untilBlock,
            contracts: pools.map((pool) => ({
              address: pool.address,
              chainId: this.chainId,
              abi: feeAbi,
              functionName: 'fee',
            })),
          }),
        ])
      }
    }
    if (poolFees.status === 'fulfilled') {
      pools.forEach((pool, i) => {
        const fee = (poolFees as any).value?.[i]?.result
        if (typeof fee === 'number') pool.fee = fee
      })
    } else {
      // if failed to update pool fees, we'll try again on next update
      this.shouldResetFees = true
    }
  }

  override getStaticPools(t1: Token, t2: Token): StaticSlipstreamPool[] {
    const allCombinations = getCurrencyCombinations(this.chainId, t1, t2)
    const currencyCombinations: [Token, Token, number][] = []
    allCombinations.forEach(([currencyA, currencyB]) => {
      if (currencyA && currencyB) {
        const tokenA = currencyA.wrapped
        const tokenB = currencyB.wrapped
        if (tokenA.equals(tokenB)) return
        const tokens = tokenA.sortsBefore(tokenB)
          ? [tokenA, tokenB]
          : [tokenB, tokenA]
        currencyCombinations.push(
          ...this.tickSpacings.map(
            (t) => [...tokens, t] as [Token, Token, number],
          ),
        )
      }
    })
    return currencyCombinations.map(([currencyA, currencyB, tickSpacing]) => ({
      address: this.getSlipstreamPoolAddress(
        this.factory[this.chainId as keyof typeof this.factory]!,
        currencyA.wrapped,
        currencyB.wrapped,
        tickSpacing,
      ),
      token0: currencyA,
      token1: currencyB,
      fee: this.BASE_FEE,
      tickSpacing,
      feeType: FeeType.Default,
    }))
  }

  // algebra doesnt have the fee/ticks setup the same way univ3 has
  override async ensureFeeAndTicks(): Promise<boolean> {
    return true
  }

  getSlipstreamPoolAddress(
    factory: Address,
    tokenA: Token,
    tokenB: Token,
    tickSpacing: number,
  ): Address {
    const [token0, token1] = tokenA.sortsBefore(tokenB)
      ? [tokenA, tokenB]
      : [tokenB, tokenA]
    const constructorArgumentsEncoded = encodeAbiParameters(
      parseAbiParameters('address, address, int24'),
      [token0.address, token1.address, tickSpacing],
    )
    const initCode =
      `0x3d602d80600a3d3981f3363d3d373d3d3d363d73${this.poolImplementation[
        this.chainId as keyof typeof this.poolImplementation
      ]!.replace('0x', '')}5af43d82803e903d91602b57fd5bf3` as Hex
    const initCodeHash = keccak256(initCode)

    const create2Inputs = [
      '0xff',
      factory,
      // salt
      keccak256(constructorArgumentsEncoded),
      // init code hash
      initCodeHash,
    ]
    const sanitizedInputs = `0x${create2Inputs
      .map((i) => i.slice(2))
      .join('')}` as Hex
    return getAddress(`0x${keccak256(sanitizedInputs).slice(-40)}`)
  }
}
