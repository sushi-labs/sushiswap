import { UniswapV2FactoryChainId } from '@sushiswap/sushiswap'
import { ConstantProductPoolFactoryChainId, StablePoolFactoryChainId } from '@sushiswap/trident'

export type SwapChainId = StablePoolFactoryChainId | ConstantProductPoolFactoryChainId | UniswapV2FactoryChainId
