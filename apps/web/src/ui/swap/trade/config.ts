import { ChainId } from 'sushi/chain';
import { SUPPORTED_CHAIN_IDS, TWAP_SUPPORTED_CHAIN_IDS, XSWAP_SUPPORTED_CHAIN_IDS } from 'src/config';

export const TRADE_MODES = ['swap', 'limit', 'dca', 'cross-chain-swap'] as const;

export type TradeMode = (typeof TRADE_MODES)[number];

const isSupportedTradeMode = (mode: string): mode is TradeMode => TRADE_MODES.includes(mode as TradeMode);

export const CHAIN_IDS_BY_TRADE_MODE: Record<TradeMode, readonly ChainId[]> = {
  'swap': SUPPORTED_CHAIN_IDS,
  'limit': TWAP_SUPPORTED_CHAIN_IDS,
  'dca': TWAP_SUPPORTED_CHAIN_IDS,
  'cross-chain-swap': XSWAP_SUPPORTED_CHAIN_IDS
}

export const isSupportedTradeModeOnChainId = (mode: string, chainId: number) => {
  return isSupportedTradeMode(mode) && CHAIN_IDS_BY_TRADE_MODE[mode].includes(chainId as ChainId);
};
