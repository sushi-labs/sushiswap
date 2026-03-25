import type { SmartPoolChainId } from '@sushiswap/graph-client/data-api'
import { EvmChainId } from 'sushi/evm'

export const STEER_PERIPHERY_ADDRESS: Record<SmartPoolChainId, `0x${string}`> =
  {
    [EvmChainId.ETHEREUM]: '0xcebf1a54a9ce703fc80967760b5a6cbdb4111099',
    [EvmChainId.BASE]: '0x16ba7102271dc83fff2f709691c2b601dad7668e',
  }

export const STEER_FEE_MANAGER_ADDRESS: Record<
  SmartPoolChainId,
  `0x${string}`
> = {
  [EvmChainId.ETHEREUM]: '0x031923c15bd3af56F41Ca65833C91152dB493af6',
  [EvmChainId.BASE]: '0x4E48624bEcf612268fd84F48421b7818C4Ba020F',
}
