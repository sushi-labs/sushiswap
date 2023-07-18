import { Amount, Token, Type, Type as Currency } from '@sushiswap/currency'
import { Address, readContracts } from 'wagmi'
import { computePairAddress, Pair }from "@sushiswap/amm"
import { SushiSwapV2ChainId, SUSHISWAP_V2_FACTORY_ADDRESS, isSushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import { uniswapV2PairAbi } from '@sushiswap/abi'

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export const getPairs = async (
  chainId: SushiSwapV2ChainId | undefined,
  currencies: [Currency | undefined, Currency | undefined][]
): Promise<[PairState, Pair | null][]> => {
  const filtered = currencies.filter((currencies): currencies is [Type, Type] => {
    const [currencyA, currencyB] = currencies
    return Boolean(
      currencyA &&
        currencyB &&
        currencyA.chainId === currencyB.chainId &&
        !currencyA.wrapped.equals(currencyB.wrapped) &&
        isSushiSwapV2ChainId(currencyA.chainId)
    )
  })

  const [tokensA, tokensB] = filtered.reduce<[Token[], Token[]]>(
    (acc, [currencyA, currencyB]) => {
      acc[0].push(currencyA.wrapped)
      acc[1].push(currencyB.wrapped)

      return acc
    },
    [[], []]
  )

  const contracts = filtered.map(([currencyA, currencyB]) => ({
    chainId,
    address: computePairAddress({
      factoryAddress: SUSHISWAP_V2_FACTORY_ADDRESS[currencyA.chainId as SushiSwapV2ChainId],
      tokenA: currencyA.wrapped,
      tokenB: currencyB.wrapped,
    }) as Address,
    abi: uniswapV2PairAbi,
    functionName: 'getReserves' as const,
  }))

  const data = await readContracts({
    contracts: contracts,
  })

  if (contracts.length === 0) return [[PairState.INVALID, null]]
  if (!data) return contracts.map(() => [PairState.LOADING, null])

  return data.map((result, i) => {
    const tokenA = tokensA[i]
    const tokenB = tokensB[i]
    if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
    if (!result) return [PairState.NOT_EXISTS, null]
    const [reserve0, reserve1] = result
    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
    return [
      PairState.EXISTS,
      new Pair(Amount.fromRawAmount(token0, reserve0.toString()), Amount.fromRawAmount(token1, reserve1.toString())),
    ]
  })
}
