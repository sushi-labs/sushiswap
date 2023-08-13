import { ChainId } from '@sushiswap/chain'
import { AMPL_ADDRESS, DAI, Token, WNATIVE } from '@sushiswap/currency'

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {
  [ChainId.ETHEREUM]: {
    [AMPL_ADDRESS[ChainId.ETHEREUM]]: [DAI[ChainId.ETHEREUM], WNATIVE[ChainId.ETHEREUM]],
  },
}
