import { Amount, Token, Type, Type as Currency } from '@sushiswap/currency'
import { Address, readContracts } from 'wagmi'
import { computePairAddress, FACTORY_ADDRESS, Pair } from '@sushiswap/amm'
import { uniswapV2FactoryAddress, UniswapV2FactoryChainId, UniswapV2Router02ChainId } from '@sushiswap/sushiswap'
import { uniswapV2PairAbi } from '@sushiswap/abi'

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

/*
 * Add simple cache that gets wiped on refresh to avoid unnecessary calls
 */
const NonExistingPairs: Record<string, boolean> = {}

export const getPairs = async (
  chainId: UniswapV2Router02ChainId | undefined,
  currencies: [Currency | undefined, Currency | undefined][]
): Promise<[PairState, Pair | null][]> => {
  const filtered = currencies.filter((currencies): currencies is [Type, Type] => {
    const [currencyA, currencyB] = currencies
    return Boolean(
      currencyA &&
        currencyB &&
        currencyA.chainId === currencyB.chainId &&
        !currencyA.wrapped.equals(currencyB.wrapped) &&
        FACTORY_ADDRESS[currencyA.chainId]
    )
  })

  const [tokensA, tokensB, addresses] = filtered.reduce<[Token[], Token[], Address[]]>(
    (acc, [currencyA, currencyB]) => {
      const address = computePairAddress({
        factoryAddress: uniswapV2FactoryAddress[currencyA.chainId as UniswapV2FactoryChainId],
        tokenA: currencyA.wrapped,
        tokenB: currencyB.wrapped,
      }) as Address

      // Filter previously fetched pools that turned out to be non-existing
      if (NonExistingPairs[`${currencyA.chainId}:${address}`]) return acc

      acc[0].push(currencyA.wrapped)
      acc[1].push(currencyB.wrapped)
      acc[2].push(address)

      return acc
    },
    [[], [], []]
  )

  const contracts = addresses.map((address) => ({
    chainId,
    address: address,
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
    if (!result) {
      // Pool does not exist, set in cache as non-existing to avoid call next iteration
      NonExistingPairs[`${contracts[i].chainId}:${contracts[i].address}`] = true
      return [PairState.NOT_EXISTS, null]
    }

    const [reserve0, reserve1] = result
    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
    return [
      PairState.EXISTS,
      new Pair(Amount.fromRawAmount(token0, reserve0.toString()), Amount.fromRawAmount(token1, reserve1.toString())),
    ]
  })
}
