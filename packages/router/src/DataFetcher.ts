import { isBentoBoxV1ChainId } from '@sushiswap/bentobox'
import { ChainId } from '@sushiswap/chain'
import { Native, Token, Type, WNATIVE } from '@sushiswap/currency'
import { PrismaClient } from '@sushiswap/database'
import { isConstantProductPoolFactoryChainId, isStablePoolFactoryChainId } from '@sushiswap/trident'
import { PublicClient } from 'viem'

import { ApeSwapProvider } from './liquidity-providers/ApeSwap'
import { BiswapProvider } from './liquidity-providers/Biswap'
import { DfynProvider } from './liquidity-providers/Dfyn'
import { ElkProvider } from './liquidity-providers/Elk'
import { HoneySwapProvider } from './liquidity-providers/HoneySwap'
import { JetSwapProvider } from './liquidity-providers/JetSwap'
import { LiquidityProvider, LiquidityProviders } from './liquidity-providers/LiquidityProvider'
import { NativeWrapProvider } from './liquidity-providers/NativeWrapProvider'
import { NetSwapProvider } from './liquidity-providers/NetSwap'
import { PancakeSwapProvider } from './liquidity-providers/PancakeSwap'
import { QuickSwapProvider } from './liquidity-providers/QuickSwap'
import { SpookySwapProvider } from './liquidity-providers/SpookySwap'
import { SushiProvider } from './liquidity-providers/Sushi'
import { TraderJoeProvider } from './liquidity-providers/TraderJoe'
import { TridentProvider } from './liquidity-providers/Trident'
import { UbeSwapProvider } from './liquidity-providers/UbeSwap'
import { UniswapV2Provider } from './liquidity-providers/UniswapV2'
import { UniswapV3Provider } from './liquidity-providers/UniswapV3'
import type { PoolCode } from './pools/PoolCode'

// import { create } from 'viem'

// Gathers pools info, creates routing in 'incremental' mode
// This means that new routing recalculates each time new pool fetching data comes
export class DataFetcher {
  chainId: ChainId
  providers: LiquidityProvider[] = []
  // Provider to poolAddress to PoolCode
  poolCodes: Map<LiquidityProviders, Map<string, PoolCode>> = new Map()
  stateId = 0
  web3Client: PublicClient
  databaseClient: PrismaClient | undefined = undefined

  constructor(chainId: ChainId, web3Client: PublicClient, databaseClient?: PrismaClient) {
    this.chainId = chainId
    this.web3Client = web3Client
    this.databaseClient = databaseClient
  }

  _providerIsIncluded(lp: LiquidityProviders, liquidity?: LiquidityProviders[]) {
    if (!liquidity) return true
    if (lp === LiquidityProviders.NativeWrap) return true
    return liquidity.some((l) => l == lp)
  }

  // Starts pool data fetching
  startDataFetching(
    providers?: LiquidityProviders[] // all providers if undefined
  ) {
    this.stopDataFetching()
    this.poolCodes = new Map()

    this.providers = [new NativeWrapProvider(this.chainId, this.web3Client)]

    if (this._providerIsIncluded(LiquidityProviders.SushiSwap, providers)) {
      try {
        const provider = new SushiProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    if (
      this._providerIsIncluded(LiquidityProviders.Trident, providers) &&
      isBentoBoxV1ChainId(this.chainId) &&
      (isConstantProductPoolFactoryChainId(this.chainId) || isStablePoolFactoryChainId(this.chainId))
    ) {
      try {
        const provider = new TridentProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.ApeSwap, providers)) {
      try {
        const provider = new ApeSwapProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.Biswap, providers)) {
      try {
        const provider = new BiswapProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.Dfyn, providers)) {
      try {
        const provider = new DfynProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.Elk, providers)) {
      try {
        const provider = new ElkProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.HoneySwap, providers)) {
      try {
        const provider = new HoneySwapProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.JetSwap, providers)) {
      try {
        const provider = new JetSwapProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.NetSwap, providers)) {
      try {
        const provider = new NetSwapProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.PancakeSwap, providers)) {
      try {
        const provider = new PancakeSwapProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.QuickSwap, providers)) {
      try {
        const provider = new QuickSwapProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.SpookySwap, providers)) {
      try {
        const provider = new SpookySwapProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.TraderJoe, providers)) {
      try {
        const provider = new TraderJoeProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.UbeSwap, providers)) {
      try {
        const provider = new UbeSwapProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.UniswapV2, providers)) {
      try {
        const provider = new UniswapV2Provider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.UniswapV3, providers)) {
      try {
        const provider = new UniswapV3Provider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: any) {
        // console.warn(e.message)
      }
    }

    // console.log(
    //   `${chainShortName[this.chainId]}/${this.chainId} - Included providers: ${this.providers
    //     .map((p) => p.getType())
    //     .join(', ')}`
    // )
    this.providers.forEach((p) => p.startFetchPoolsData())
  }

  // To stop fetch pool data
  stopDataFetching() {
    this.providers.forEach((p) => p.stopFetchPoolsData())
  }

  async fetchPoolsForToken(t0: Type, t1: Type): Promise<void> {
    const token0 = this.transformToken(t0)
    const token1 = this.transformToken(t1)
    await Promise.all(this.providers.map((p) => p.fetchPoolsForToken(token0, token1)))
  }

  getCurrentPoolCodeMap(t0: Type, t1: Type): Map<string, PoolCode> {
    const token0 = this.transformToken(t0)
    const token1 = this.transformToken(t1)
    const result: Map<string, PoolCode> = new Map()
    this.providers.forEach((p) => {
      const poolCodes = p.getCurrentPoolList(token0, token1)
      poolCodes.forEach((pc) => result.set(pc.pool.address, pc))
    })

    return result
  }

  getCurrentPoolCodeList(t0: Type, t1: Type): PoolCode[] {
    const token0 = this.transformToken(t0)
    const token1 = this.transformToken(t1)
    const pcMap = this.getCurrentPoolCodeMap(token0, token1)
    return Array.from(pcMap.values())
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

  transformToken(t: Type) {
    return t instanceof Native ? WNATIVE[t.chainId] : (t as Token)
  }
}
