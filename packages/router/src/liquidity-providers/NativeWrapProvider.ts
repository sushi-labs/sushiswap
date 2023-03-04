/* eslint-disable @typescript-eslint/no-empty-function */
import type { ChainId } from '@sushiswap/chain'
import { Native, WNATIVE, WNATIVE_ADDRESS } from '@sushiswap/currency'
import { BridgeUnlimited, RToken } from '@sushiswap/tines'
import type { ethers } from 'ethers'

import type { Limited } from '../Limited'
import type { MultiCallProvider } from '../MulticallProvider'
import { NativeWrapBridgePoolCode } from '../pools/NativeWrapBridge'
import type { PoolCode } from '../pools/PoolCode'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'

export class NativeWrapProvider extends LiquidityProvider {
  poolCodes: PoolCode[]

  constructor(
    chainDataProvider: ethers.providers.BaseProvider,
    multiCallProvider: MultiCallProvider,
    chainId: ChainId,
    l: Limited
  ) {
    super(chainDataProvider, multiCallProvider, chainId, l)
    const native = Native.onChain(chainId)
    const nativeRToken: RToken = {
      address: '',
      name: native.name,
      symbol: native.symbol,
      chainId: chainId,
    }
    const bridge = new BridgeUnlimited(WNATIVE_ADDRESS[chainId], nativeRToken, WNATIVE[chainId] as RToken, 0, 50_000)
    this.poolCodes = [new NativeWrapBridgePoolCode(bridge)]
    this.stateId = 0
    this.lastUpdateBlock = -1
  }

  getType(): LiquidityProviders {
    return LiquidityProviders.NativeWrap
  }

  getPoolProviderName(): string {
    return 'NativeWrap'
  }

  startFetchPoolsData() {}
  fetchPoolsForToken(): void {}
  getCurrentPoolList(): PoolCode[] {
    return this.poolCodes
  }
  stopFetchPoolsData() {}
}
