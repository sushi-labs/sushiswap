import { Amount, Type as Currency } from '@sushiswap/currency'
import { readContracts } from 'wagmi'
import { Pair } from '@sushiswap/amm'
import { getPairs as _getPairs, PairState } from '@sushiswap/wagmi'
import { UniswapV2Router02ChainId } from '@sushiswap/sushiswap'

export const getPairs = async (
  chainId: UniswapV2Router02ChainId | undefined,
  currencies: [Currency | undefined, Currency | undefined][]
) => {
  const [tokensA, tokensB, contracts] = _getPairs(chainId, currencies)

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
