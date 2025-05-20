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
    twapAddress: '0xb1ed8BCAD1EaC8a1DF0764700472391800D12946',
    lensAddress: '0x0967f448c4d4dbd14c355E635AE9CbF68cc44A60',
    bidDelaySeconds: 60,
    minChunkSizeUsd: 200,
    name: 'SushiEth',
    partner: 'Orbs:TWAP:Sushi',
    exchangeAddress: '0x04eB53119079FA779492720D1EfeAEBF0aF2e5ad',
    exchangeType: 'ExchangeV2',
    pathfinderKey: '',
  },
  [ChainId.ARBITRUM]: {
    chainName: 'arb',
    chainId: 42161,
    twapVersion: 4,
    twapAddress: '0x0B94dcC0EA2d1ee33Ab064DaC252de980a941eF3',
    lensAddress: '0x549e1fc9a47FCc0C5C2EbdfF31254cc49fF7164e',
    bidDelaySeconds: 60,
    minChunkSizeUsd: 50,
    name: 'SushiArb',
    partner: 'Orbs:TWAP:Sushi',
    exchangeAddress: '0x04eB53119079FA779492720D1EfeAEBF0aF2e5ad',
    exchangeType: 'ExchangeV2',
    pathfinderKey: '',
  },
  [ChainId.BASE]: {
    chainName: 'base',
    chainId: 8453,
    twapVersion: 4,
    twapAddress: '0xc918bdC47264687796Cd54FE362FaC4f8b99Eb55',
    lensAddress: '0x6313188c1909b161074D62E43105faC9B756A23e',
    bidDelaySeconds: 60,
    minChunkSizeUsd: 50,
    name: 'SushiBase',
    partner: 'Orbs:TWAP:Sushi',
    exchangeAddress: '0x04eB53119079FA779492720D1EfeAEBF0aF2e5ad',
    exchangeType: 'ExchangeV2',
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
