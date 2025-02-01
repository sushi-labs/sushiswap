import { Address, PublicClient } from 'viem'
import { erc20Abi, tickLensAbi, uniswapV3FactoryAbi } from '../../abi/index.js'
import { ChainId } from '../../chain/index.js'
import { SushiSwapV3FeeAmount, TICK_SPACINGS } from '../../config/index.js'
import { Currency, Token, Type } from '../../currency/index.js'
import { computeSushiSwapV3PoolAddress } from '../../pool/index.js'
import { RToken, UniV3Pool } from '../../tines/index.js'
import { DataFetcherOptions } from '../data-fetcher.js'
import { getCurrencyCombinations } from '../get-currency-combinations.js'
import { memoizer } from '../memoizer.js'
import { type PoolCode, UniV3PoolCode } from '../pool-codes/index.js'
import { LiquidityProvider } from './LiquidityProvider.js'

export interface UniV3FeeType {
  readonly LOWEST: number
  readonly LOW: number
  readonly MEDIUM: number
  readonly HIGH: number
}

export type UniV3TickSpacingType = {
  readonly [key: UniV3FeeType[keyof UniV3FeeType]]: number
}

export interface StaticPoolUniV3 {
  address: Address
  token0: Token
  token1: Token
  fee: UniV3FeeType[keyof UniV3FeeType]
}

export interface V3Pool {
  address: Address
  token0: Token
  token1: Token
  fee: UniV3FeeType[keyof UniV3FeeType]
  sqrtPriceX96: bigint
  activeTick: number
}

export const NUMBER_OF_SURROUNDING_TICKS = 1000 // 10% price impact

export const bitmapIndex = (tick: number, tickSpacing: number) => {
  return Math.floor(tick / tickSpacing / 256)
}

export type PoolFilter = { has: (arg: string) => boolean }

export abstract class UniswapV3BaseProvider extends LiquidityProvider {
  TICK_SPACINGS: UniV3TickSpacingType = TICK_SPACINGS
  FEE: UniV3FeeType = SushiSwapV3FeeAmount
  poolsByTrade: Map<string, string[]> = new Map()
  pools: Map<string, PoolCode> = new Map()

  blockListener?: (() => void) | undefined
  unwatchBlockNumber?: () => void

  isInitialized = false
  factory: Record<number, Address> = {}
  initCodeHash: Record<number, string> = {}
  tickLens: Record<number, string> = {}

  constructor(
    chainId: ChainId,
    web3Client: PublicClient,
    factory: Record<number, Address>,
    initCodeHash: Record<number, string>,
    tickLens: Record<number, string>,
    isTest = false,
  ) {
    super(chainId, web3Client, isTest)
    this.factory = factory
    this.initCodeHash = initCodeHash
    this.tickLens = tickLens
    if (
      !(chainId in this.factory) ||
      !(chainId in this.initCodeHash) ||
      !(chainId in tickLens)
    ) {
      throw new Error(
        `${this.getType()} cannot be instantiated for chainid ${chainId}, no factory or initCodeHash`,
      )
    }
  }

  getActiveTick = (
    tickCurrent: number,
    feeAmount: UniV3FeeType[keyof UniV3FeeType],
  ) =>
    typeof tickCurrent === 'number' && feeAmount
      ? Math.floor(tickCurrent / this.TICK_SPACINGS[feeAmount]!) *
        this.TICK_SPACINGS[feeAmount]!
      : undefined

  async fetchPoolData(
    t0: Token,
    t1: Token,
    excludePools?: Set<string> | PoolFilter,
    options?: DataFetcherOptions,
  ): Promise<V3Pool[]> {
    let staticPools = this.getStaticPools(t0, t1)
    if (excludePools)
      staticPools = staticPools.filter((p) => !excludePools.has(p.address))

    const multicallMemoize = await memoizer.fn(this.client.multicall)

    const slot0Data = {
      multicallAddress: this.client.chain?.contracts?.multicall3
        ?.address as Address,
      allowFailure: true,
      blockNumber: options?.blockNumber,
      contracts: staticPools.map(
        (pool) =>
          ({
            address: pool.address as Address,
            chainId: this.chainId,
            abi: [
              {
                inputs: [],
                name: 'slot0',
                outputs: [
                  {
                    internalType: 'uint160',
                    name: 'sqrtPriceX96',
                    type: 'uint160',
                  },
                  { internalType: 'int24', name: 'tick', type: 'int24' },
                  {
                    internalType: 'uint16',
                    name: 'observationIndex',
                    type: 'uint16',
                  },
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
                  {
                    internalType: 'uint8',
                    name: 'feeProtocol',
                    type: 'uint8',
                  },
                  { internalType: 'bool', name: 'unlocked', type: 'bool' },
                ],
                stateMutability: 'view',
                type: 'function',
              },
            ],
            functionName: 'slot0',
          }) as const,
      ),
    }
    const slot0 = options?.memoize
      ? await (multicallMemoize(slot0Data) as Promise<any>).catch((e) => {
          console.warn(
            `${this.getLogPrefix()} - INIT: multicall failed, message: ${
              e.message
            }`,
          )
          return undefined
        })
      : await this.client.multicall(slot0Data).catch((e) => {
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
      const sqrtPriceX96 = slot0[i]!.result?.[0]
      const tick = slot0[i]!.result?.[1]
      if (!sqrtPriceX96 || sqrtPriceX96 === 0n || typeof tick !== 'number')
        return
      const activeTick = this.getActiveTick(tick, pool.fee)
      if (typeof activeTick !== 'number') return
      existingPools.push({
        ...pool,
        sqrtPriceX96,
        activeTick,
      })
    })

    return existingPools
  }

  getIndexes(existingPools: V3Pool[]): [number[], number[]] {
    const minIndexes = existingPools.map((pool) =>
      bitmapIndex(
        pool.activeTick - NUMBER_OF_SURROUNDING_TICKS,
        this.TICK_SPACINGS[pool.fee]!,
      ),
    )
    const maxIndexes = existingPools.map((pool) =>
      bitmapIndex(
        pool.activeTick + NUMBER_OF_SURROUNDING_TICKS,
        this.TICK_SPACINGS[pool.fee]!,
      ),
    )
    return [minIndexes, maxIndexes]
  }

  handleTickBoundries(
    i: number,
    pool: V3Pool,
    poolTicks: {
      index: number
      DLiquidity: bigint
    }[],
    minIndexes: number[],
    maxIndexes: number[],
  ) {
    const lowerUnknownTick =
      minIndexes[i]! * this.TICK_SPACINGS[pool.fee]! * 256 -
      this.TICK_SPACINGS[pool.fee]!
    console.assert(
      poolTicks.length === 0 || lowerUnknownTick < poolTicks[0]!.index,
      'Error 236: unexpected min tick index',
    )
    poolTicks.unshift({
      index: lowerUnknownTick,
      DLiquidity: 0n,
    })
    const upperUnknownTick =
      (maxIndexes[i]! + 1) * this.TICK_SPACINGS[pool.fee]! * 256
    console.assert(
      poolTicks[poolTicks.length - 1]!.index < upperUnknownTick,
      'Error 244: unexpected max tick index',
    )
    poolTicks.push({
      index: upperUnknownTick,
      DLiquidity: 0n,
    })
  }

  async fetchPoolsForToken(
    t0: Token,
    t1: Token,
    excludePools?: Set<string> | PoolFilter,
    options?: DataFetcherOptions,
  ): Promise<void> {
    const existingPools = await this.fetchPoolData(
      t0,
      t1,
      excludePools,
      options,
    )
    if (existingPools.length === 0) return

    const multicallMemoize = await memoizer.fn(this.client.multicall)

    const liquidityContractsData = {
      multicallAddress: this.client.chain?.contracts?.multicall3
        ?.address as Address,
      allowFailure: true,
      blockNumber: options?.blockNumber,
      contracts: existingPools.map(
        (pool) =>
          ({
            chainId: this.chainId,
            address: pool.address as Address,
            abi: [
              {
                inputs: [],
                name: 'liquidity',
                outputs: [
                  { internalType: 'uint128', name: '', type: 'uint128' },
                ],
                stateMutability: 'view',
                type: 'function',
              },
            ],
            functionName: 'liquidity',
          }) as const,
      ),
    }
    const liquidityContracts: Promise<
      (
        | {
            error?: undefined
            result: bigint
            status: 'success'
          }
        | {
            error: Error
            result?: undefined
            status: 'failure'
          }
      )[]
    > = options?.memoize
      ? (multicallMemoize(liquidityContractsData) as Promise<any>)
      : this.client.multicall(liquidityContractsData)

    const token0ContractsData = {
      multicallAddress: this.client.chain?.contracts?.multicall3
        ?.address as Address,
      allowFailure: true,
      blockNumber: options?.blockNumber,
      contracts: existingPools.map(
        (pool) =>
          ({
            chainId: this.chainId,
            address: pool.token0.wrapped.address as Address,
            args: [pool.address as Address],
            abi: erc20Abi,
            functionName: 'balanceOf',
          }) as const,
      ),
    }
    const token0Contracts: Promise<
      (
        | {
            error: Error
            result?: undefined
            status: 'failure'
          }
        | {
            error?: undefined
            result: bigint
            status: 'success'
          }
      )[]
    > = options?.memoize
      ? (multicallMemoize(token0ContractsData) as Promise<any>)
      : this.client.multicall(token0ContractsData)

    const token1ContractsData = {
      multicallAddress: this.client.chain?.contracts?.multicall3
        ?.address as Address,
      allowFailure: true,
      blockNumber: options?.blockNumber,
      contracts: existingPools.map(
        (pool) =>
          ({
            chainId: this.chainId,
            address: pool.token1.wrapped.address as Address,
            args: [pool.address as Address],
            abi: erc20Abi,
            functionName: 'balanceOf',
          }) as const,
      ),
    }
    const token1Contracts: Promise<
      (
        | {
            error?: undefined
            result: bigint
            status: 'success'
          }
        | {
            error: Error
            result?: undefined
            status: 'failure'
          }
      )[]
    > = options?.memoize
      ? (multicallMemoize(token1ContractsData) as Promise<any>)
      : this.client.multicall(token1ContractsData)

    const [minIndexes, maxIndexes] = this.getIndexes(existingPools)

    const wordList = existingPools.flatMap((pool, i) => {
      const minIndex = minIndexes[i]!
      const maxIndex = maxIndexes[i]!

      return Array.from(
        { length: maxIndex - minIndex + 1 },
        (_, i) => minIndex + i,
      ).flatMap((j) => ({
        chainId: this.chainId,
        address: this.tickLens[
          // @ts-ignore
          this.chainId as keyof typeof this.tickLens
        ] as Address,
        args: [pool.address, j] as const,
        abi: tickLensAbi,
        functionName: 'getPopulatedTicksInWord' as const,
        index: i,
      }))
    })

    const ticksContractsData = {
      multicallAddress: this.client.chain?.contracts?.multicall3
        ?.address as Address,
      allowFailure: true,
      contracts: wordList,
      blockNumber: options?.blockNumber,
    }
    const ticksContracts: Promise<
      (
        | {
            error?: undefined
            result: readonly {
              tick: number
              liquidityNet: bigint
              liquidityGross: bigint
            }[]
            status: 'success'
          }
        | {
            error: Error
            result?: undefined
            status: 'failure'
          }
      )[]
    > = options?.memoize
      ? (multicallMemoize(ticksContractsData) as Promise<any>)
      : this.client.multicall(ticksContractsData)

    const [liquidityResults, token0Balances, token1Balances, tickResults] =
      await Promise.all([
        liquidityContracts,
        token0Contracts,
        token1Contracts,
        ticksContracts,
      ])

    const ticks: NonNullable<(typeof tickResults)[number]['result']>[] = []
    tickResults.forEach((t, i) => {
      const index = wordList[i]!.index
      ticks[index] = (ticks[index] || []).concat(t.result || [])
    })

    const transformedV3Pools: PoolCode[] = []
    existingPools.forEach((pool, i) => {
      if (
        !liquidityResults?.[i] ||
        !token0Balances?.[i]!.result ||
        !token1Balances?.[i]!.result
      )
        return
      const balance0 = token0Balances[i]!.result
      const balance1 = token1Balances[i]!.result
      const liquidity = liquidityResults[i]!.result
      if (
        balance0 === undefined ||
        balance1 === undefined ||
        liquidity === undefined
      )
        return

      const poolTicks = ticks[i]!.map((tick) => ({
        index: tick.tick,
        DLiquidity: tick.liquidityNet,
      })).sort((a, b) => a.index - b.index)

      this.handleTickBoundries(i, pool, poolTicks, minIndexes, maxIndexes)
      //console.log(pool.fee, TICK_SPACINGS[pool.fee], pool.activeTick, minIndexes[i], maxIndexes[i], poolTicks)

      const v3Pool = new UniV3Pool(
        pool.address,
        pool.token0 as RToken,
        pool.token1 as RToken,
        pool.fee / 1_000_000,
        balance0,
        balance1,
        pool.activeTick,
        liquidity,
        pool.sqrtPriceX96,
        poolTicks,
      )

      const pc = new UniV3PoolCode(
        v3Pool,
        this.getType(),
        this.getPoolProviderName(),
      )
      transformedV3Pools.push(pc)
      this.pools.set(pool.address.toLowerCase(), pc)
    })

    this.poolsByTrade.set(
      this.getTradeId(t0, t1),
      transformedV3Pools.map((pc) => pc.pool.address.toLowerCase()),
    )
  }

  getStaticPools(t1: Token, t2: Token): StaticPoolUniV3[] {
    const fees = Object.values(this.FEE)
    const feeList = fees.splice(fees.length / 2) as number[]
    const currencyCombinations = getCurrencyCombinations(this.chainId, t1, t2)

    const allCurrencyCombinationsWithAllFees: [Type, Type, number][] =
      currencyCombinations.reduce<[Currency, Currency, number][]>(
        (list, [tokenA, tokenB]) => {
          if (tokenA !== undefined && tokenB !== undefined) {
            return list.concat(feeList.map((fee) => [tokenA, tokenB, fee]))
          }
          return []
        },
        [],
      )

    const filtered: [Token, Token, number][] = []
    allCurrencyCombinationsWithAllFees.forEach(
      ([currencyA, currencyB, feeAmount]) => {
        if (currencyA && currencyB && feeAmount) {
          const tokenA = currencyA.wrapped
          const tokenB = currencyB.wrapped
          if (tokenA.equals(tokenB)) return
          filtered.push(
            tokenA.sortsBefore(tokenB)
              ? [tokenA, tokenB, feeAmount]
              : [tokenB, tokenA, feeAmount],
          )
        }
      },
    )
    return filtered.map(([currencyA, currencyB, fee]) => ({
      address: computeSushiSwapV3PoolAddress({
        factoryAddress:
          this.factory[this.chainId as keyof typeof this.factory]!,
        tokenA: currencyA.wrapped,
        tokenB: currencyB.wrapped,
        fee,
        initCodeHashManualOverride:
          this.initCodeHash[this.chainId as keyof typeof this.initCodeHash],
      }) as Address,
      token0: currencyA,
      token1: currencyB,
      fee,
    }))
  }

  startFetchPoolsData() {
    this.stopFetchPoolsData()
    // this.topPools = new Map()
    // this.unwatchBlockNumber = this.client.watchBlockNumber({
    //   onBlockNumber: (blockNumber) => {
    //     this.lastUpdateBlock = Number(blockNumber)
    //     // if (!this.isInitialized) {
    //     //   this.initialize()
    //     // } else {
    //     //   this.updatePools()
    //     // }
    //   },
    //   onError: (error) => {
    //     console.error(
    //       `${this.getLogPrefix()} - Error watching block number: ${
    //         error.message
    //       }`,
    //     )
    //   },
    // })
  }

  getCurrentPoolList(): PoolCode[] {
    // const tradeId = this.getTradeId(t0, t1)
    // const poolsByTrade = this.poolsByTrade.get(tradeId) ?? []
    // return poolsByTrade
    //   ? Array.from(this.pools)
    //       .filter(([poolAddress]) => poolsByTrade.includes(poolAddress))
    //       .map(([, p]) => p)
    //   : []
    return Array.from(this.pools.values())
  }

  stopFetchPoolsData() {
    if (this.unwatchBlockNumber) this.unwatchBlockNumber()
    this.blockListener = undefined
  }

  async ensureFeeAndTicks(): Promise<boolean> {
    const fees = Object.values(this.FEE)
    const feeList = fees.splice(fees.length / 2) as number[]
    const results = (await this.client.multicall({
      multicallAddress: this.client.chain?.contracts?.multicall3
        ?.address as Address,
      allowFailure: false,
      contracts: feeList.map(
        (fee) =>
          ({
            chainId: this.chainId,
            address: this.factory[this.chainId as keyof typeof this.factory]!,
            abi: uniswapV3FactoryAbi,
            functionName: 'feeAmountTickSpacing',
            args: [fee],
          }) as const,
      ),
    })) as number[]

    // fetched fee map to ticks should match correctly with hardcoded literals in the dex
    // a tick can be 0 if there is no pools deployed with that fee yet
    return results.every(
      (v, i) =>
        this.TICK_SPACINGS[feeList[i] as SushiSwapV3FeeAmount] === v || v === 0,
    )
  }
}
