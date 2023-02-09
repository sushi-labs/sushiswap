import { ChainId, chainShortName } from '@sushiswap/chain'
import { Native, Token, Type, WNATIVE } from '@sushiswap/currency'
// const { provider } = configureChains(allChains, allProviders, { pollingInterval: 10000, minQuorum: 1, targetQuorum: 1 })
// createClient({
//   autoConnect: true,
//   provider,
// })
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

// import { configureChains, createClient } from '@wagmi/core'
// import { allChains } from './chains'
import { ApeSwapProvider } from './liquidity-providers/ApeSwap'
import { DfynProvider } from './liquidity-providers/Dfyn'
import { ElkProvider } from './liquidity-providers/Elk'
import { JetSwapProvider } from './liquidity-providers/JetSwap'
import { LiquidityProvider, LiquidityProviders } from './liquidity-providers/LiquidityProvider'
import { NativeWrapProvider } from './liquidity-providers/NativeWrapProvider'
import { NetSwapProvider } from './liquidity-providers/NetSwap'
import { QuickSwapProvider } from './liquidity-providers/QuickSwap'
import { SpookySwapProvider } from './liquidity-providers/SpookySwap'
import { SushiProvider } from './liquidity-providers/Sushi'
import { TraderJoeProvider } from './liquidity-providers/TraderJoe'
import { UniswapV2Provider } from './liquidity-providers/UniswapV2'
import type { PoolCode } from './pools/PoolCode'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

// Gathers pools info, creates routing in 'incremental' mode
// This means that new routing recalculates each time new pool fetching data comes
export class DataFetcher {
  chainId: ChainId
  providers: LiquidityProvider[] = []
  lastProviderStates: Map<LiquidityProviders, number> = new Map()
  // Provider to poolAddress to PoolCode
  poolCodes: Map<LiquidityProviders, Map<string, PoolCode>> = new Map()
  stateId = 0
  client = client

  constructor(chainId: ChainId) {
    this.chainId = chainId
  }

  _providerIsIncluded(lp: LiquidityProviders, liquidity?: LiquidityProviders[]) {
    if (!liquidity) return true
    if (lp == LiquidityProviders.NativeWrap) return true
    return liquidity.some((l) => l == lp)
  }

  // Starts pool data fetching
  startDataFetching(
    providers?: LiquidityProviders[] // all providers if undefined
  ) {
    this.stopDataFetching()
    this.poolCodes = new Map()

    this.providers = [new NativeWrapProvider(this.chainId, this.client)]

    if (this._providerIsIncluded(LiquidityProviders.SushiSwap, providers)) {
      try {
        const provider = new SushiProvider(this.chainId, this.client)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    // if (this._providerIsIncluded(LiquidityProviders.Trident, providers)) {
    //   try {
    //     const provider = new TridentProvider(this.chainId, this.client)
    //     this.providers.push(provider)
    //   } catch (e: any) {
    //     // console.warn(e.message)
    //   }
    // }

    if (this._providerIsIncluded(LiquidityProviders.UniswapV2, providers)) {
      try {
        const provider = new UniswapV2Provider(this.chainId, this.client)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }
    if (this._providerIsIncluded(LiquidityProviders.QuickSwap, providers)) {
      try {
        const provider = new QuickSwapProvider(this.chainId, this.client)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }
    if (this._providerIsIncluded(LiquidityProviders.ApeSwap, providers)) {
      try {
        const provider = new ApeSwapProvider(this.chainId, this.client)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }
    if (this._providerIsIncluded(LiquidityProviders.Dfyn, providers)) {
      try {
        const provider = new DfynProvider(this.chainId, this.client)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }
    if (this._providerIsIncluded(LiquidityProviders.Elk, providers)) {
      try {
        const provider = new ElkProvider(this.chainId, this.client)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }
    if (this._providerIsIncluded(LiquidityProviders.JetSwap, providers)) {
      try {
        const provider = new JetSwapProvider(this.chainId, this.client)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.SpookySwap, providers)) {
      try {
        const provider = new SpookySwapProvider(this.chainId, this.client)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    // if (this._providerIsIncluded(LiquidityProviders.TridentCP, providers)) {
    //   try {
    //     const provider = new TridentClassicProvider(this.chainId)
    //     this.providers.push(provider)
    //   } catch (e: any) {
    //     // console.warn(e.message)
    //   }
    // }

    // if (this._providerIsIncluded(LiquidityProviders.TridentStable, providers)) {
    //   try {
    //     const provider = new TridentStableProvider(this.chainId)
    //     this.providers.push(provider)
    //   } catch (e: any) {
    //     // console.warn(e.message)
    //   }
    // }

    if (this._providerIsIncluded(LiquidityProviders.TraderJoe, providers)) {
      try {
        const provider = new TraderJoeProvider(this.chainId)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.NetSwap, providers)) {
      try {
        const provider = new NetSwapProvider(this.chainId)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    console.log(
      `${chainShortName[this.chainId]}/${this.chainId} - Included providers: ${this.providers
        .map((p) => p.getType())
        .join(', ')}`
    )
    this.providers.forEach((p) => p.startFetchPoolsData())
  }

  // To stop fetch pool data
  stopDataFetching() {
    this.providers.forEach((p) => p.stopFetchPoolsData())
  }

  fetchPoolsForToken(t0: Type, t1: Type) {
    if (t0 instanceof Native) t0 = WNATIVE[t0.chainId]
    if (t1 instanceof Native) t1 = WNATIVE[t1.chainId]
    this.providers.forEach((p) => p.fetchPoolsForToken(t0 as Token, t1 as Token))
  }

  getCurrentPoolCodeMap(providers?: LiquidityProviders[]): Map<string, PoolCode> {
    const result: Map<string, PoolCode> = new Map()
    this.providers.forEach((p) => {
      if (!this._providerIsIncluded(p.getType(), providers)) return
      if (p.getCurrentPoolStateId() !== this.lastProviderStates.get(p.getType())) {
        this.lastProviderStates.set(p.getType(), p.getCurrentPoolStateId())
        const poolCodes = p.getCurrentPoolList()
        let pcMap = this.poolCodes.get(p.getType())
        if (pcMap === undefined) {
          pcMap = new Map()
          this.poolCodes.set(p.getType(), pcMap)
        }
        poolCodes.forEach((pc) => (pcMap as Map<string, PoolCode>).set(pc.pool.address, pc))
      }
      const pcMap = this.poolCodes.get(p.getType())
      if (pcMap) Array.from(pcMap.entries()).forEach(([addr, pc]) => result.set(addr, pc))
    })

    return result
  }

  getCurrentPoolCodeList(providers?: LiquidityProviders[]): PoolCode[] {
    const pcMap = this.getCurrentPoolCodeMap(providers)
    return Array.from(pcMap.values())
  }

  getCurrentPoolStateId(providers?: LiquidityProviders[]) {
    let state = 0
    this.providers.forEach((p) => {
      if (this._providerIsIncluded(p.getType(), providers)) state += p.getCurrentPoolStateId()
    })
    return state
  }

  // returns the last processed by all LP block number
  getLastUpdateBlock(providers?: LiquidityProviders[]): number {
    let lastUpdateBlock: number | undefined
    this.providers.forEach((p) => {
      if (this._providerIsIncluded(p.getType(), providers)) {
        const last = p.getLastUpdateBlock()
        if (last < 0) return
        if (lastUpdateBlock === undefined) lastUpdateBlock = last
        else lastUpdateBlock = Math.min(lastUpdateBlock, last)
      }
    })
    return lastUpdateBlock === undefined ? 0 : lastUpdateBlock
  }
}
