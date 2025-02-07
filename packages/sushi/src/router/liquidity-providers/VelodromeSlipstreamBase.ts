import {
  Address,
  Hex,
  PublicClient,
  encodeAbiParameters,
  getAddress,
  keccak256,
  parseAbi,
  parseAbiParameters,
} from 'viem'
import { ChainId } from '../../chain/index.js'
import { Token } from '../../currency/index.js'
import { DataFetcherOptions } from '../data-fetcher.js'
import { getCurrencyCombinations } from '../get-currency-combinations.js'
import {
  PoolFilter,
  StaticPoolUniV3,
  UniswapV3BaseProvider,
  V3Pool,
} from './UniswapV3Base.js'

export const ZERO_FEE_INDICATOR = 420

export interface SlipstreamPool extends StaticPoolUniV3 {
  tickSpacing: number
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

const SlipstreamABI = parseAbi([
  'function tickSpacingToFee(int24) view returns (uint24)',
  'function poolImplementation() view returns (address)',
  'function tickSpacings() view returns (int24[])',
  'function swapFeeModule() view returns (address)',
])

export abstract class VelodromeSlipstreamBaseProvider extends UniswapV3BaseProvider {
  override TICK_SPACINGS: Record<string, number> = {}
  didFetchTickSpacing = false

  readonly BASE_FEE = 100
  DEFAULT_TICK_SPACINGS = [1, 50, 100, 200, 2000] as const
  tickSpacings: number[] = [...this.DEFAULT_TICK_SPACINGS]

  poolImplementation: Record<number, Address> = {}
  customSwapFeeModule: Record<number, Address> = {}

  constructor(
    chainId: ChainId,
    web3Client: PublicClient,
    factory: Record<number, Address>,
    tickLens: Record<number, Address>,
    poolImplementation: Record<number, Address>,
    customSwapFeeModule: Record<number, Address>,
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
    this.poolImplementation = poolImplementation
    this.customSwapFeeModule = customSwapFeeModule
    if (!(chainId in this.poolImplementation)) {
      throw new Error(
        `${this.getType()} cannot be instantiated for chainid ${chainId}, no poolImplementation address`,
      )
    }
    if (!(chainId in this.customSwapFeeModule)) {
      throw new Error(
        `${this.getType()} cannot be instantiated for chainid ${chainId}, no customSwapFeeModule address`,
      )
    }
  }

  override async fetchPoolData(
    t0: Token,
    t1: Token,
    excludePools?: Set<string> | PoolFilter,
    options?: DataFetcherOptions,
  ): Promise<V3Pool[]> {
    if (!this.didFetchTickSpacing) {
      const result = await this.client
        .readContract({
          address: this.factory[this.chainId as keyof typeof this.factory]!,
          blockNumber: options?.blockNumber,
          abi: SlipstreamABI,
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
      if (result) this.didFetchTickSpacing = true
      this.tickSpacings = (result ?? this.DEFAULT_TICK_SPACINGS) as number[]
    }

    let staticPools = this.getStaticPools(t0, t1)
    if (excludePools)
      staticPools = staticPools.filter((p) => !excludePools.has(p.address))

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

    const poolFees = await this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3?.address!,
        allowFailure: true,
        blockNumber: options?.blockNumber,
        contracts: staticPools.map(
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

    const existingPools: V3Pool[] = []

    staticPools.forEach((pool, i) => {
      if (slot0 === undefined || !slot0[i]) return
      const sqrtPriceX96 = slot0[i]!.result?.[0] // price
      const tick = slot0[i]!.result?.[1] // tick
      if (!sqrtPriceX96 || sqrtPriceX96 === 0n || typeof tick !== 'number')
        return
      const fee = poolFees?.[i]?.result // fee
      if (!fee) return
      const activeTick = Math.floor(tick / pool.tickSpacing) * pool.tickSpacing
      if (typeof activeTick !== 'number') return
      this.TICK_SPACINGS[pool.address.toLowerCase()] = pool.tickSpacing
      existingPools.push({
        ...pool,
        fee,
        sqrtPriceX96,
        activeTick,
      })
    })

    return existingPools
  }

  override getStaticPools(t1: Token, t2: Token): SlipstreamPool[] {
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
