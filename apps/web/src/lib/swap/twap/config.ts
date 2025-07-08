import { type Config, Configs } from '@orbs-network/twap-sdk'
import type { TwapSupportedChainId } from 'src/config'
import { ChainId } from 'sushi/chain'

export const TWAP_CONFIG: Record<TwapSupportedChainId, Config> = {
  [ChainId.ETHEREUM]: Configs.SushiEth,
  [ChainId.ARBITRUM]: Configs.SushiArb,
  [ChainId.BASE]: Configs.SushiBase,
  [ChainId.KATANA]: Configs.SushiKatana,
}
