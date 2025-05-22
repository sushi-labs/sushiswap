import {
  type NonStandardChainId,
  SUPPORTED_NETWORKS,
  TWAP_SUPPORTED_CHAIN_IDS,
  XSWAP_SUPPORTED_CHAIN_IDS,
} from 'src/config'
import type { EvmChainId } from 'sushi/chain'

export const TRADE_MODES = ['swap', 'limit', 'dca', 'cross-chain-swap'] as const

export type TradeMode = (typeof TRADE_MODES)[number]

const isSupportedTradeMode = (mode: string): mode is TradeMode =>
  TRADE_MODES.includes(mode as TradeMode)

export const CHAIN_IDS_BY_TRADE_MODE: Record<
  TradeMode,
  readonly (EvmChainId | NonStandardChainId)[]
> = {
  swap: SUPPORTED_NETWORKS,
  limit: TWAP_SUPPORTED_CHAIN_IDS,
  dca: TWAP_SUPPORTED_CHAIN_IDS,
  'cross-chain-swap': XSWAP_SUPPORTED_CHAIN_IDS,
}

export const isSupportedTradeModeOnChainId = (
  mode: string,
  chainId: number | string,
) => {
  return (
    isSupportedTradeMode(mode) &&
    CHAIN_IDS_BY_TRADE_MODE[mode].includes(
      chainId as EvmChainId | NonStandardChainId,
    )
  )
}

export const TRADE_VIEWS = ['simple', 'advanced'] as const

export type TradeView = (typeof TRADE_VIEWS)[number]
