import { Token } from '@sushiswap/currency'
import { readContracts } from 'wagmi'
import { BigNumber } from 'ethers'
import { getContract } from 'wagmi/actions'
import { BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { balanceOfAbi } from '@sushiswap/abi'
import { getBentoBoxContractConfig } from '../../../../hooks'
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
  totals: { base: string; elastic: string }[] | null
) => {
  const contract = getContract({
    ...getBentoBoxContractConfig(chainId),
  })

  const balances = await readContracts({
    contracts: currencies.map((currency) => ({
      address: contract.address,
      chainId,
      abi: balanceOfAbi,
      functionName: 'balanceOf',
      args: [currency.wrapped.address],
    })),
  })

  return currencies.map((el, i) => {
    if (!totals?.[i] || !balances?.[i]) {
      return [BridgeBentoState.LOADING, null]
    }

    return [
      BridgeBentoState.EXISTS,
      new BridgeBento(
        `Bento bridge for ${el.symbol}`,
        el as RToken,
        convertTokenToBento(el),
        BigNumber.from(0),
        BigNumber.from(0),
        BigNumber.from(0)
      ),
    ]
  })
}
