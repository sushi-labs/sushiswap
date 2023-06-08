import { UniswapV2FactoryChainId } from '@sushiswap/v2-core'
import { ConstantProductPoolFactoryChainId, StablePoolFactoryChainId } from '@sushiswap/trident-core'
import { V3ChainId } from '@sushiswap/v3-sdk'

export type SwapChainId =
  | StablePoolFactoryChainId
  | ConstantProductPoolFactoryChainId
  | UniswapV2FactoryChainId
  | V3ChainId
