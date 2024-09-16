import { ChainId, LiquidityProviders } from 'sushi'
import { Address, Hex } from 'viem'

const V3_SUPPORTED_CHAIN_IDS = [ChainId.ETHEREUM] as const
type V3ChainId = (typeof V3_SUPPORTED_CHAIN_IDS)[number]
const V3_FACTORY_ADDRESS: Record<V3ChainId, Address> = {
  [ChainId.ETHEREUM]: '0x',
} as const
const V3_INIT_CODE_HASH: Record<V3ChainId, Hex> = {
  [ChainId.ETHEREUM]: '0x',
} as const
export function v3Factory(chainId: V3ChainId) {
  return {
    address: V3_FACTORY_ADDRESS[chainId],
    provider: LiquidityProviders.UniswapV3,
    initCodeHash: V3_INIT_CODE_HASH[chainId],
    feeSpacingMap: {
      100: 1,
      500: 10,
      3000: 60,
      10_000: 200,
    },
  } as const
}
