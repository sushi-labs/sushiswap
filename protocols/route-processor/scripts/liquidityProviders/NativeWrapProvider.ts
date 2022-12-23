/* eslint-disable @typescript-eslint/no-empty-function */
import { ChainId } from '@sushiswap/chain'
import { Native, WNATIVE } from '@sushiswap/currency'
import { BridgeUnlimited, RToken } from '@sushiswap/tines'
import { ethers } from 'ethers'

import { Limited } from '../Limited'
import { MultiCallProvider } from '../MulticallProvider'
import { NativeWrapBridgePoolCode } from '../pools/NativeWrapBridge'
import { PoolCode } from '../pools/PoolCode'
import { LiquidityProviderMC, LiquidityProviders } from './LiquidityProviderMC'

export class NativeWrapProvider extends LiquidityProviderMC {
  poolCodes: PoolCode[]

  static NativeWrapPoolAddress = 'Native Wrapper Bridge'

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
    const bridge = new BridgeUnlimited(
      NativeWrapProvider.NativeWrapPoolAddress,
      nativeRToken,
      WNATIVE[chainId] as RToken,
      0,
      50_000
    )
    this.poolCodes = [new NativeWrapBridgePoolCode(bridge)]
    this.stateId = 1
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
