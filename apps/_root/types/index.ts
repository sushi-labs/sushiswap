import { UniswapV2FactoryChainId } from '@sushiswap/sushiswap'
import { ConstantProductPoolFactoryChainId, StablePoolFactoryChainId } from '@sushiswap/trident'
import { V3ChainId } from '@sushiswap/v3-sdk'

export type SwapChainId =
  | StablePoolFactoryChainId
  | ConstantProductPoolFactoryChainId
  | UniswapV2FactoryChainId
  | V3ChainId
