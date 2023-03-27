import { Currency, Token, Type } from '@sushiswap/currency'
import { computeV3PoolAddress, FeeAmount } from '@sushiswap/amm'
import { Address, readContracts } from 'wagmi'
import { BigNumber } from 'ethers'
import { erc20Abi } from '@sushiswap/abi'
import { ChainId } from '@sushiswap/chain'
import { uniswapV3PoolAbi } from '../../../../abis/uniswapV3PoolAbi'
import { RToken, UniV3Pool } from '@sushiswap/tines'

export enum V3PoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

interface PoolData {
  address: string
  token0: Token
  token1: Token
  fee: FeeAmount
  sqrtPriceX96: BigNumber
  tick: number
}

/**
 * The default factory tick spacings by fee amount.
 */
export declare const TICK_SPACINGS: {
  [amount in FeeAmount]: number
}

const NUMBER_OF_SURRONDING_TICKS = 125

const tickLensAbi = [
  {
    inputs: [
      { internalType: 'address', name: 'pool', type: 'address' },
      { internalType: 'int16', name: 'tickBitmapIndex', type: 'int16' },
    ],
    name: 'getPopulatedTicksInWord',
    outputs: [
      {
        components: [
          { internalType: 'int24', name: 'tick', type: 'int24' },
          { internalType: 'int128', name: 'liquidityNet', type: 'int128' },
          { internalType: 'uint128', name: 'liquidityGross', type: 'uint128' },
        ],
        internalType: 'struct ITickLens.PopulatedTick[]',
        name: 'populatedTicks',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const getActiveTick = (tickCurrent: number | undefined, feeAmount: FeeAmount | undefined) =>
  tickCurrent && feeAmount ? Math.floor(tickCurrent / TICK_SPACINGS[feeAmount]) * TICK_SPACINGS[feeAmount] : undefined

const bitmapIndex = (tick: number, tickSpacing: number) => {
  return Math.floor(tick / tickSpacing / 256)
}

export const getV3Pools = async (chainId: ChainId, currencies: [Currency | undefined, Currency | undefined][]) => {
  const allCurrencyCombinationsWithAllFees: [Type, Type, FeeAmount][] = currencies.reduce<
    [Currency, Currency, FeeAmount][]
  >((list, [tokenA, tokenB]) => {
    if (tokenA !== undefined && tokenB !== undefined) {
      return list.concat([
        // [tokenA, tokenB, 100],
        [tokenA, tokenB, 500],
        [tokenA, tokenB, 3000],
        [tokenA, tokenB, 10000],
      ])
    }
    return []
  }, [])

  const filtered: [Token, Token, FeeAmount][] = []
  allCurrencyCombinationsWithAllFees.forEach(([currencyA, currencyB, feeAmount]) => {
    if (currencyA && currencyB && feeAmount) {
      const tokenA = currencyA.wrapped
      const tokenB = currencyB.wrapped
      if (tokenA.equals(tokenB)) return
      filtered.push(tokenA.sortsBefore(tokenB) ? [tokenA, tokenB, feeAmount] : [tokenB, tokenA, feeAmount])
    }
  })

  const slot0Contracts = filtered.map(
    ([currencyA, currencyB, fee]) =>
      ({
        chainId,
        address: computeV3PoolAddress({
          factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
          tokenA: currencyA.wrapped,
          tokenB: currencyB.wrapped,
          fee,
        }),
        abi: uniswapV3PoolAbi,
        functionName: 'slot0',
      } as const)
  )

  const slot0 = await readContracts({
    contracts: slot0Contracts,
  })

  if (slot0Contracts.length === 0) return [[V3PoolState.INVALID, null]]
  if (!slot0) return slot0Contracts.map(() => [V3PoolState.LOADING, null])

  const existingPools: [V3PoolState, PoolData][] = []

  filtered.forEach(([token0, token1, fee], i) => {
    if (!slot0[i]) return
    const [sqrtPriceX96, tick] = slot0[i]
    if (!sqrtPriceX96 || sqrtPriceX96.eq(0)) return
    // const [tokenA, tokenB, fee] = tokens[index]
    existingPools.push([
      V3PoolState.LOADING,
      {
        address: slot0Contracts[i].address,
        sqrtPriceX96,
        tick,
        token0,
        token1,
        fee,
      } as PoolData,
    ])
  })

  const liquidityContracts = existingPools.map(
    ([, poolData]) =>
      ({
        chainId,
        address: poolData.address,
        abi: uniswapV3PoolAbi,
        functionName: 'liquidity',
      } as const)
  )

  const tickSpacingContracts = existingPools.map(
    ([, poolData]) =>
      ({
        chainId,
        address: poolData.address,
        abi: uniswapV3PoolAbi,
        functionName: 'tickSpacing',
      } as const)
  )

  const token0Contracts = existingPools.map(
    ([, poolData]) =>
      ({
        chainId,
        address: poolData.token0.wrapped.address,
        args: [poolData.address as Address],
        abi: erc20Abi,
        functionName: 'balanceOf',
      } as const)
  )

  const token1Contracts = existingPools.map(
    ([, poolData]) =>
      ({
        chainId,
        address: poolData.token1.wrapped.address,
        args: [poolData.address as Address],
        abi: erc20Abi,
        functionName: 'balanceOf',
      } as const)
  )

  const [liquidity, tickSpacing, token0Balances, token1Balances] = await Promise.all([
    readContracts({
      contracts: liquidityContracts,
    }),
    readContracts({
      contracts: tickSpacingContracts,
    }),
    readContracts({
      contracts: token0Contracts,
    }),
    readContracts({
      contracts: token1Contracts,
    }),
  ])
  const isContractLengthsNull =
    liquidityContracts.length === 0 ||
    tickSpacingContracts.length === 0 ||
    token0Contracts.length === 0 ||
    token1Contracts.length === 0

  if (isContractLengthsNull) return [[V3PoolState.INVALID, null]]
  if (!liquidity || !tickSpacing || !token0Balances || !token1Balances)
    return existingPools.map(() => [V3PoolState.LOADING, null])

  const minIndexes = existingPools.map(([, poolData], i) => {
    return bitmapIndex(poolData.tick - NUMBER_OF_SURRONDING_TICKS * tickSpacing[i], tickSpacing[i])
  })

  const maxIndexes = existingPools.map(([, poolData], i) => {
    return bitmapIndex(poolData.tick + NUMBER_OF_SURRONDING_TICKS * tickSpacing[i], tickSpacing[i])
  })

  const lowerTicksContracts = existingPools.map(
    ([, poolData], i) =>
      ({
        chainId,
        address: '0xbfd8137f7d1516D3ea5cA83523914859ec47F573' as Address,
        args: [poolData.address as Address, minIndexes[i]],
        abi: tickLensAbi,
        functionName: 'getPopulatedTicksInWord',
      } as const)
  )

  const upperTicksContracts = existingPools.map(
    ([, poolData], i) =>
      ({
        chainId,
        address: '0xbfd8137f7d1516D3ea5cA83523914859ec47F573' as Address,
        args: [poolData.address as Address, maxIndexes[i]],
        abi: tickLensAbi,
        functionName: 'getPopulatedTicksInWord',
      } as const)
  )

  const [lowerTickResults, upperTickResults] = await Promise.all([
    readContracts({
      contracts: lowerTicksContracts,
    }),
    readContracts({
      contracts: upperTicksContracts,
    }),
  ])
  
  const tickContractsLengthIsNull = lowerTicksContracts.length === 0 || upperTicksContracts.length === 0

  if (tickContractsLengthIsNull) return [[V3PoolState.INVALID, null]]
  if (!lowerTickResults || !upperTickResults)
    return existingPools.map(() => [V3PoolState.LOADING, null])


  return existingPools.map(([, pool], i) => {
    if (
      !liquidity?.[i] ||
      !tickSpacing?.[i] ||
      !token0Balances?.[i] ||
      !token1Balances?.[i] ||
      !lowerTickResults?.[i] ||
      !upperTickResults?.[i]
    )
      return [V3PoolState.LOADING, null]
    const lowerTicks = lowerTickResults[i].map((tick) => {
      return {
        index: tick.tick,
        DLiquidity: tick.liquidityGross,
      }
    })
    const upperTicks = upperTickResults[i].map((tick) => {
      return {
        index: tick.tick,
        DLiquidity: tick.liquidityGross,
      }
    })
    return [
      V3PoolState.EXISTS,
      new UniV3Pool(
        pool.address,
        pool.token0 as RToken,
        pool.token1 as RToken,
        pool.fee / 10_000,  // TODO: FIX THIS, wrong fee?
        token0Balances[i],
        token1Balances[i],
        pool.tick,
        liquidity[i],
        pool.sqrtPriceX96,
        [lowerTicks, upperTicks]
        // .sort( 
        //   (a, b) => a[0].index - b[0].index) // TODO: might need to sort these before passing them in. Can't remember where I've seen Ilya do it.
        .flat()
      ),
      ,
    ]
  })
}
