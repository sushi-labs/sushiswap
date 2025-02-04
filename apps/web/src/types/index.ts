import type {
  SushiSwapV2ChainId,
  SushiSwapV3ChainId,
  TridentChainId,
} from 'sushi/config'

export type SwapChainId =
  | TridentChainId
  | SushiSwapV2ChainId
  | SushiSwapV3ChainId
