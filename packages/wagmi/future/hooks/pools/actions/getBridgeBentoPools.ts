import { Token } from '@sushiswap/currency'
import { Address, readContracts } from 'wagmi'
import { BigNumber } from 'ethers'
import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { balanceOfAbi } from '@sushiswap/abi'
import { BridgeBento, RToken } from '@sushiswap/tines'
import { convertTokenToBento } from '@sushiswap/router/dist/liquidity-providers/Trident'

export enum BridgeBentoState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export const getBridgeBentoPools = async (
  chainId: BentoBoxV1ChainId,
  currencies: Token[],
  totals: Map<string,{ base: BigNumber; elastic: BigNumber }>
) => {
  const balances = await readContracts({
    contracts: currencies.map(
      (currency) =>
        ({
          address: currency.wrapped.address as Address,
          chainId,
          abi: balanceOfAbi,
          functionName: 'balanceOf',
          args: [bentoBoxV1Address[chainId] as Address],
        } as const)
    ),
  })

  return currencies.map((el, i) => {
    const total = totals.get(el.address)
    if (!total || !balances?.[i]) {
      return [BridgeBentoState.LOADING, null]
    }

    const { base, elastic } = total

    return [
      BridgeBentoState.EXISTS,
      new BridgeBento(
        `Bento bridge for ${el.symbol}`,
        el as RToken,
        convertTokenToBento(el),
        elastic,
        base,
        balances?.[i]
      ),
    ]
  })
}
