import { PublicClient } from 'viem'
/* eslint-disable @typescript-eslint/no-empty-function */
import type { ChainId } from '../../chain/index.js'
import { WNATIVE, WNATIVE_ADDRESS } from '../../currency/index.js'
import { Native } from '../../currency/index.js'
import { BridgeUnlimited, RToken } from '../../tines/index.js'
import { NativeWrapBridgePoolCode, type PoolCode } from '../pool-codes/index.js'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider.js'

export class NativeWrapProvider extends LiquidityProvider {
  poolCodes: PoolCode[]

  constructor(chainId: ChainId, client: PublicClient) {
    super(chainId, client)
    const native = Native.onChain(chainId)
    const nativeRToken: RToken = {
      address: '',
      name: native.name,
      symbol: native.symbol,
      chainId: chainId,
      decimals: 18,
    }
    const bridge = new BridgeUnlimited(
      WNATIVE_ADDRESS[chainId],
      nativeRToken,
      WNATIVE[chainId] as RToken,
      0,
      50_000,
    )
    this.poolCodes = [
      new NativeWrapBridgePoolCode(bridge, LiquidityProviders.NativeWrap),
    ]
    this.lastUpdateBlock = -1
  }

  getType(): LiquidityProviders {
    return LiquidityProviders.NativeWrap
  }

  getPoolProviderName(): string {
    return 'NativeWrap'
  }

  startFetchPoolsData() {}
  async fetchPoolsForToken(): Promise<void> {}
  getCurrentPoolList(): PoolCode[] {
    return this.poolCodes
  }
  stopFetchPoolsData() {}
}
