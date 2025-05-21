import {
  type TwapSDK as TwapSDKType,
  constructSDK,
} from '@orbs-network/twap-sdk'
import type { TwapSupportedChainId } from 'src/config'
import { TWAP_CONFIG } from './config'

export class TwapSDK {
  private static instances: { [key in TwapSupportedChainId]?: TwapSDKType } = {}

  static onNetwork(network: TwapSupportedChainId): TwapSDKType {
    if (!this.instances[network]) {
      this.instances[network] = constructSDK({
        config: TWAP_CONFIG[network],
      })
    }
    return this.instances[network]!
  }
}
