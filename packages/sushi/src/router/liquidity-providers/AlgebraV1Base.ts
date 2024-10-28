import {
  Address,
  Hex,
  PublicClient,
  encodeAbiParameters,
  getAddress,
  keccak256,
} from 'viem'
import { ChainId } from '../../chain/index.js'
import { Token } from '../../currency/index.js'
import { DataFetcherOptions } from '../data-fetcher.js'
import { getCurrencyCombinations } from '../get-currency-combinations.js'
import { memoizer } from '../memoizer.js'
import {
  PoolFilter,
  StaticPoolUniV3,
  UniswapV3BaseProvider,
  V3Pool,
} from './UniswapV3Base.js'

export abstract class AlgebraV1BaseProvider extends UniswapV3BaseProvider {
  override TICK_SPACINGS: Record<number, number> = {}

  readonly BASE_FEE = 100
  DEFAULT_TICK_SPACING = 1

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
  ): Promise<V3Pool[]> {
    let staticPools = this.getStaticPools(t0, t1)
    if (excludePools)
      staticPools = staticPools.filter((p) => !excludePools.has(p.address))

    const multicallMemoize = await memoizer.fn(this.client.multicall)

    const globalStateData = {
      multicallAddress: this.client.chain?.contracts?.multicall3?.address!,
      allowFailure: true,
      blockNumber: options?.blockNumber,
      contracts: staticPools.map(
        (pool) =>
          ({
            address: pool.address,
            chainId: this.chainId,
            abi: [
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
            ] as const,
            functionName: 'globalState',
          }) as const,
      ),
    }
    const globalState = options?.memoize
      ? await (multicallMemoize(globalStateData) as Promise<any>).catch((e) => {
          console.warn(
            `${this.getLogPrefix()} - INIT: multicall failed, message: ${
              e.message
            }`,
          )
          return undefined
        })
      : await this.client.multicall(globalStateData).catch((e) => {
          console.warn(
            `${this.getLogPrefix()} - INIT: multicall failed, message: ${
              e.message
            }`,
          )
          return undefined
        })

    let tickSpacings:
      | (
          | number
          | {
              error?: undefined
              result: number
              status: 'success'
            }
          | {
              error: Error
              result?: undefined
              status: 'failure'
            }
        )[]
      | undefined

    try {
      const tickSpacingsData = {
        multicallAddress: this.client.chain?.contracts?.multicall3?.address!,
        allowFailure: true,
        blockNumber: options?.blockNumber,
        contracts: staticPools.map(
          (pool) =>
            ({
              address: pool.address,
              chainId: this.chainId,
              abi: [
                {
                  inputs: [],
                  name: 'tickSpacing',
                  outputs: [{ internalType: 'int24', name: '', type: 'int24' }],
                  stateMutability: 'view',
                  type: 'function',
                },
              ] as const,
              functionName: 'tickSpacing',
            }) as const,
        ),
      }
      tickSpacings = options?.memoize
        ? await (multicallMemoize(tickSpacingsData) as Promise<any>).catch(
            (e) => {
              console.warn(
                `${this.getLogPrefix()} - INIT: multicall failed, message: ${
                  e.message
                }`,
              )
              return undefined
            },
          )
        : await this.client.multicall(tickSpacingsData).catch((e) => {
            console.warn(
              `${this.getLogPrefix()} - INIT: multicall failed, message: ${
                e.message
              }`,
            )
            return undefined
          })
    } catch (_error) {}

    const existingPools: V3Pool[] = []

    for (let i = 0; i < staticPools.length; i++) {
      if (globalState === undefined || !globalState[i]) continue
      const pool = staticPools[i]! 
      let thisTickSpacing = this.DEFAULT_TICK_SPACING
      if (tickSpacings !== undefined && Array.isArray(tickSpacings)) {
        if (tickSpacings[i] !== undefined) {
          const ts = tickSpacings[i]
          if (typeof ts === 'number') {
            thisTickSpacing = ts
          } else {
            if (ts?.status === 'success') {
              thisTickSpacing = ts.result
            }
          }
        }
      }
      const sqrtPriceX96 = globalState[i]!.result?.[0] // price
      const tick = globalState[i]!.result?.[1] // tick
      if (!sqrtPriceX96 || sqrtPriceX96 === 0n || typeof tick !== 'number')
        continue
      const fee = globalState[i]!.result?.[2] // fee
      if (!fee) continue
      const activeTick = Math.floor(tick / thisTickSpacing) * thisTickSpacing
      if (typeof activeTick !== 'number') continue
      this.TICK_SPACINGS[fee] = this.DEFAULT_TICK_SPACING
      existingPools.push({
        ...pool,
        fee,
        sqrtPriceX96,
        activeTick,
      })
    }

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

// [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"int24","name":"bottomTick","type":"int24"},{"indexed":true,"internalType":"int24","name":"topTick","type":"int24"},{"indexed":false,"internalType":"uint128","name":"liquidityAmount","type":"uint128"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"address","name":"recipient","type":"address"},{"indexed":true,"internalType":"int24","name":"bottomTick","type":"int24"},{"indexed":true,"internalType":"int24","name":"topTick","type":"int24"},{"indexed":false,"internalType":"uint128","name":"amount0","type":"uint128"},{"indexed":false,"internalType":"uint128","name":"amount1","type":"uint128"}],"name":"Collect","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint16","name":"communityFee0New","type":"uint16"},{"indexed":false,"internalType":"uint16","name":"communityFee1New","type":"uint16"}],"name":"CommunityFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint16","name":"fee","type":"uint16"}],"name":"Fee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"paid0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"paid1","type":"uint256"}],"name":"Flash","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"virtualPoolAddress","type":"address"}],"name":"Incentive","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint160","name":"price","type":"uint160"},{"indexed":false,"internalType":"int24","name":"tick","type":"int24"}],"name":"Initialize","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint32","name":"liquidityCooldown","type":"uint32"}],"name":"LiquidityCooldown","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"int24","name":"bottomTick","type":"int24"},{"indexed":true,"internalType":"int24","name":"topTick","type":"int24"},{"indexed":false,"internalType":"uint128","name":"liquidityAmount","type":"uint128"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"int256","name":"amount0","type":"int256"},{"indexed":false,"internalType":"int256","name":"amount1","type":"int256"},{"indexed":false,"internalType":"uint160","name":"price","type":"uint160"},{"indexed":false,"internalType":"uint128","name":"liquidity","type":"uint128"},{"indexed":false,"internalType":"int24","name":"tick","type":"int24"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"int24","name":"newTickSpacing","type":"int24"}],"name":"TickSpacing","type":"event"},{"inputs":[],"name":"activeIncentive","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"int24","name":"bottomTick","type":"int24"},{"internalType":"int24","name":"topTick","type":"int24"},{"internalType":"uint128","name":"amount","type":"uint128"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"int24","name":"bottomTick","type":"int24"},{"internalType":"int24","name":"topTick","type":"int24"},{"internalType":"uint128","name":"amount0Requested","type":"uint128"},{"internalType":"uint128","name":"amount1Requested","type":"uint128"}],"name":"collect","outputs":[{"internalType":"uint128","name":"amount0","type":"uint128"},{"internalType":"uint128","name":"amount1","type":"uint128"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"dataStorageOperator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"flash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int24","name":"bottomTick","type":"int24"},{"internalType":"int24","name":"topTick","type":"int24"}],"name":"getInnerCumulatives","outputs":[{"internalType":"int56","name":"innerTickCumulative","type":"int56"},{"internalType":"uint160","name":"innerSecondsSpentPerLiquidity","type":"uint160"},{"internalType":"uint32","name":"innerSecondsSpent","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32[]","name":"secondsAgos","type":"uint32[]"}],"name":"getTimepoints","outputs":[{"internalType":"int56[]","name":"tickCumulatives","type":"int56[]"},{"internalType":"uint160[]","name":"secondsPerLiquidityCumulatives","type":"uint160[]"},{"internalType":"uint112[]","name":"volatilityCumulatives","type":"uint112[]"},{"internalType":"uint256[]","name":"volumePerAvgLiquiditys","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"globalState","outputs":[{"internalType":"uint160","name":"price","type":"uint160"},{"internalType":"int24","name":"tick","type":"int24"},{"internalType":"uint16","name":"fee","type":"uint16"},{"internalType":"uint16","name":"timepointIndex","type":"uint16"},{"internalType":"uint16","name":"communityFeeToken0","type":"uint16"},{"internalType":"uint16","name":"communityFeeToken1","type":"uint16"},{"internalType":"bool","name":"unlocked","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint160","name":"initialPrice","type":"uint160"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"liquidity","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"liquidityCooldown","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxLiquidityPerTick","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"int24","name":"bottomTick","type":"int24"},{"internalType":"int24","name":"topTick","type":"int24"},{"internalType":"uint128","name":"liquidityDesired","type":"uint128"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"mint","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"},{"internalType":"uint128","name":"liquidityActual","type":"uint128"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"positions","outputs":[{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint32","name":"lastLiquidityAddTimestamp","type":"uint32"},{"internalType":"uint256","name":"innerFeeGrowth0Token","type":"uint256"},{"internalType":"uint256","name":"innerFeeGrowth1Token","type":"uint256"},{"internalType":"uint128","name":"fees0","type":"uint128"},{"internalType":"uint128","name":"fees1","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint16","name":"communityFee0","type":"uint16"},{"internalType":"uint16","name":"communityFee1","type":"uint16"}],"name":"setCommunityFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"virtualPoolAddress","type":"address"}],"name":"setIncentive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint32","name":"newLiquidityCooldown","type":"uint32"}],"name":"setLiquidityCooldown","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int24","name":"newTickSpacing","type":"int24"}],"name":"setTickSpacing","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"bool","name":"zeroToOne","type":"bool"},{"internalType":"int256","name":"amountRequired","type":"int256"},{"internalType":"uint160","name":"limitSqrtPrice","type":"uint160"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[{"internalType":"int256","name":"amount0","type":"int256"},{"internalType":"int256","name":"amount1","type":"int256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"bool","name":"zeroToOne","type":"bool"},{"internalType":"int256","name":"amountRequired","type":"int256"},{"internalType":"uint160","name":"limitSqrtPrice","type":"uint160"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swapSupportingFeeOnInputTokens","outputs":[{"internalType":"int256","name":"amount0","type":"int256"},{"internalType":"int256","name":"amount1","type":"int256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tickSpacing","outputs":[{"internalType":"int24","name":"","type":"int24"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"int16","name":"","type":"int16"}],"name":"tickTable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"int24","name":"","type":"int24"}],"name":"ticks","outputs":[{"internalType":"uint128","name":"liquidityTotal","type":"uint128"},{"internalType":"int128","name":"liquidityDelta","type":"int128"},{"internalType":"uint256","name":"outerFeeGrowth0Token","type":"uint256"},{"internalType":"uint256","name":"outerFeeGrowth1Token","type":"uint256"},{"internalType":"int56","name":"outerTickCumulative","type":"int56"},{"internalType":"uint160","name":"outerSecondsPerLiquidity","type":"uint160"},{"internalType":"uint32","name":"outerSecondsSpent","type":"uint32"},{"internalType":"bool","name":"initialized","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"timepoints","outputs":[{"internalType":"bool","name":"initialized","type":"bool"},{"internalType":"uint32","name":"blockTimestamp","type":"uint32"},{"internalType":"int56","name":"tickCumulative","type":"int56"},{"internalType":"uint160","name":"secondsPerLiquidityCumulative","type":"uint160"},{"internalType":"uint88","name":"volatilityCumulative","type":"uint88"},{"internalType":"int24","name":"averageTick","type":"int24"},{"internalType":"uint144","name":"volumePerLiquidityCumulative","type":"uint144"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalFeeGrowth0Token","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalFeeGrowth1Token","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
