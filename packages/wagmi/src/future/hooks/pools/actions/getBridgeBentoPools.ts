import { balanceOfAbi } from '@sushiswap/abi'
import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Token } from '@sushiswap/currency'
import { convertTokenToBento } from '@sushiswap/router/dist/liquidity-providers/Trident'
import { BridgeBento, Rebase, RToken } from '@sushiswap/tines'
import { Address, readContracts } from 'wagmi'

export enum BridgeBentoState {
  LOADING = 'Loading',
  NOT_EXISTS = 'Not exists',
  EXISTS = 'Exists',
  INVALID = 'Invalid',
}

export const getBridgeBentoPools = async (
  chainId: BentoBoxV1ChainId,
  currencies: Token[],
  totals: Map<string, Rebase>
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
    const balance = balances?.[i].result
    if (!total || !balance) {
      return [BridgeBentoState.LOADING, null]
    }

    const { base, elastic } = total

    return [
      BridgeBentoState.EXISTS,
      new BridgeBento(`Bento bridge for ${el.symbol}`, el as RToken, convertTokenToBento(el), elastic, base, balance),
    ]
  })
}
