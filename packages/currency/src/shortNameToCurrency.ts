import { ChainId } from '@sushiswap/chain'

import { DAI, FRAX, LUSD, MAI, MIM, Native, SUSHI, UNI, USDC, USDT, WBTC, WETH9, WNATIVE } from '.'

export const CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY = {
  [ChainId.ETHEREUM]: {
    NATIVE: Native.onChain(ChainId.ETHEREUM),
    WNATIVE: WETH9[ChainId.ETHEREUM],
    ETH: Native.onChain(ChainId.ETHEREUM),
    WETH: WETH9[ChainId.ETHEREUM],
    WBTC: WBTC[ChainId.ETHEREUM],
    USDC: USDC[ChainId.ETHEREUM],
    USDT: USDT[ChainId.ETHEREUM],
    DAI: DAI[ChainId.ETHEREUM],
    FRAX: FRAX[ChainId.ETHEREUM],
    MIM: MIM[ChainId.ETHEREUM],
    SUSHI: SUSHI[ChainId.ETHEREUM],
    MAI: MAI[ChainId.ETHEREUM],
    UNI: UNI[ChainId.ETHEREUM],
    LUSD: LUSD[ChainId.ETHEREUM],
  },
  [ChainId.POLYGON]: {
    NATIVE: Native.onChain(ChainId.POLYGON),
    WNATIVE: WNATIVE[ChainId.POLYGON],
    MATIC: Native.onChain(ChainId.POLYGON),
    WMATIC: WNATIVE[ChainId.POLYGON],
    WETH: WETH9[ChainId.POLYGON],
    WBTC: WBTC[ChainId.POLYGON],
    USDC: USDC[ChainId.POLYGON],
    USDT: USDT[ChainId.POLYGON],
    DAI: DAI[ChainId.POLYGON],
    FRAX: FRAX[ChainId.POLYGON],
    MIM: MIM[ChainId.POLYGON],
    SUSHI: SUSHI[ChainId.POLYGON],
    MAI: MAI[ChainId.POLYGON],
    UNI: UNI[ChainId.POLYGON],
  },
} as const

export type ShortNameToCurrencyChainId = keyof typeof CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY

export type ShortName = keyof typeof CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY[ShortNameToCurrencyChainId]

export const isShortNameToCurrencySupported = (chainId: number) => chainId in CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY

export const isShortName = (chainId: number, id: string) =>
  isShortNameToCurrencySupported(chainId) &&
  id in CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY[chainId as ShortNameToCurrencyChainId]

export const shortNameToCurrency = (chainId: number, id: ShortName) => {
  if (!isShortNameToCurrencySupported(chainId)) throw new Error(`Unsupported chainId: ${chainId}`)
  if (!isShortName(chainId, id)) throw new Error(`Unsupported id: ${id}`)
  return CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY[chainId as ShortNameToCurrencyChainId][id]
}
