import { getAll } from '@vercel/edge-config'
import type { TradeMode } from './config'

interface CrossChainSwapEdgeConfig {
  maintenance: boolean
}

interface DCAEdgeConfig {
  maintenance: boolean
}

interface LimitEdgeConfig {
  maintenance: boolean
}

interface SwapEdgeConfig {
  maintenance: boolean
}
interface FiatEdgeConfig {
  maintenance: boolean
}

interface TradeEdgeConfig {
  swap: SwapEdgeConfig
  limit: LimitEdgeConfig
  dca: DCAEdgeConfig
  // xswap: CrossChainSwapEdgeConfig;
  fiat: FiatEdgeConfig
}

const getTradeEdgeConfig = async (): Promise<TradeEdgeConfig> => {
  return getAll([
    'swap',
    'limit',
    'dca',
    // "xswap",
    'fiat',
  ])
}

const edgeConfigMap: Record<TradeMode, keyof TradeEdgeConfig> = {
  swap: 'swap',
  limit: 'limit',
  dca: 'dca',
  // 'cross-chain-swap': 'xswap',
  fiat: 'fiat', // Fiat uses the same config as swap
}

const sliceEdgeConfig = (config: TradeEdgeConfig, mode: TradeMode) => {
  return config[edgeConfigMap[mode]]
}

export {
  type TradeEdgeConfig,
  type CrossChainSwapEdgeConfig,
  type DCAEdgeConfig,
  type LimitEdgeConfig,
  type SwapEdgeConfig,
  type FiatEdgeConfig,
  getTradeEdgeConfig,
  sliceEdgeConfig,
}
