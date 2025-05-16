import {
  type Config,
  type TwapSDK as TwapSDKType,
  constructSDK,
} from '@orbs-network/twap-sdk'
import type { TwapSupportedChainId } from 'src/config'
import { ChainId } from 'sushi/chain'

const CONFIG: Record<TwapSupportedChainId, Config> = {
  [ChainId.ETHEREUM]: {
    chainName: 'eth',
    chainId: 1,
    twapVersion: 4,
    twapAddress: '0x037E2bda7B1f03411ba5E96ACb7F36a7D19c3D83',
    lensAddress: '0xD5Dc89eb7fc256b407A0Cd166e9d20bcF8FbCf98',
    bidDelaySeconds: 60,
    minChunkSizeUsd: 1000,
    name: 'SushiEth',
    partner: 'Orbs:TWAP:Sushi',
    exchangeAddress: '0xc55943Fa6509004B2903ED8F8ab7347BfC47D0bA',
    exchangeType: 'RouterExchange',
    pathfinderKey: '',
  },
  [ChainId.ARBITRUM]: {
    chainName: 'arb',
    chainId: 42161,
    twapVersion: 4,
    twapAddress: '0xD63430c74C8E70D9dbdCA04C6a9E6E9E929028DA',
    lensAddress: '0x7eD30e55FF792816Ba88f42b43ee0c4512302152',
    bidDelaySeconds: 60,
    minChunkSizeUsd: 50,
    name: 'SushiArb',
    partner: 'Orbs:TWAP:Sushi',
    exchangeAddress: '0x846F2B29ef314bF3D667981b4ffdADc5B858312a',
    exchangeType: 'RouterExchange',
    pathfinderKey: '',
  },
  [ChainId.BASE]: {
    chainName: 'base',
    chainId: 8453,
    twapVersion: 4,
    twapAddress: '0x25a0A78f5ad07b2474D3D42F1c1432178465936d',
    lensAddress: '0xFaB090A976c61FAfc2bAf91f04222fea42A42257',
    bidDelaySeconds: 60,
    minChunkSizeUsd: 50,
    name: 'SushiBase',
    partner: 'Orbs:TWAP:Sushi',
    exchangeAddress: '0x846F2B29ef314bF3D667981b4ffdADc5B858312a',
    exchangeType: 'RouterExchange',
    pathfinderKey: '',
  },
}

export class TwapSDK {
  private static instances: { [key in TwapSupportedChainId]?: TwapSDKType } = {}

  static onNetwork(network: TwapSupportedChainId): TwapSDKType {
    if (!this.instances[network]) {
      this.instances[network] = constructSDK({
        config: CONFIG[network],
      })
    }
    return this.instances[network]!
  }
}
