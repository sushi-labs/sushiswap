import { ChainId, LiquidityProviders } from 'sushi'
import { Address, Hex } from 'viem'

const V2_SUPPORTED_CHAIN_IDS = [ChainId.ETHEREUM] as const
type V2ChainId = (typeof V2_SUPPORTED_CHAIN_IDS)[number]
const V2_FACTORY_ADDRESS: Record<V2ChainId, Address> = {
  [ChainId.ETHEREUM]: '0x',
} as const
const V2_INIT_CODE_HASH: Record<V2ChainId, Hex> = {
  [ChainId.ETHEREUM]: '0x',
} as const
export function v2Factory(chainId: V2ChainId) {
  return {
    address: V2_FACTORY_ADDRESS[chainId],
    provider: LiquidityProviders.UniswapV2,
    initCodeHash: V2_INIT_CODE_HASH[chainId],
    fee: 0.003,
  } as const
}
