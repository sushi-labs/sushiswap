import { isBentoBoxV1ChainId } from '@sushiswap/bentobox'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { PrismaClient } from '@sushiswap/database'
import { isTridentConstantPoolFactoryChainId, isTridentStablePoolFactoryChainId } from '@sushiswap/trident-sdk'
import { config } from '@sushiswap/viem-config'
import { createPublicClient, http, PublicClient } from 'viem'

import { ApeSwapProvider } from './liquidity-providers/ApeSwap'
import { BiswapProvider } from './liquidity-providers/Biswap'
import { CurveProvider } from './liquidity-providers/CurveProvider'
import { DfynProvider } from './liquidity-providers/Dfyn'
import { DovishV3Provider } from './liquidity-providers/DovishV3'
import { ElkProvider } from './liquidity-providers/Elk'
import { HoneySwapProvider } from './liquidity-providers/HoneySwap'
import { JetSwapProvider } from './liquidity-providers/JetSwap'
import { LaserSwapV2Provider } from './liquidity-providers/LaserSwap'
import { LiquidityProvider, LiquidityProviders } from './liquidity-providers/LiquidityProvider'
import { NativeWrapProvider } from './liquidity-providers/NativeWrapProvider'
import { NetSwapProvider } from './liquidity-providers/NetSwap'
import { PancakeSwapProvider } from './liquidity-providers/PancakeSwap'
import { QuickSwapProvider } from './liquidity-providers/QuickSwap'
import { SpookySwapProvider } from './liquidity-providers/SpookySwap'
import { SushiSwapV2Provider } from './liquidity-providers/SushiSwapV2'
import { SushiSwapV3Provider } from './liquidity-providers/SushiSwapV3'
import { TraderJoeProvider } from './liquidity-providers/TraderJoe'
import { TridentProvider } from './liquidity-providers/Trident'
import { UbeSwapProvider } from './liquidity-providers/UbeSwap'
import { UniswapV2Provider } from './liquidity-providers/UniswapV2'
import { UniswapV3Provider } from './liquidity-providers/UniswapV3'
import type { PoolCode } from './pools/PoolCode'

// import { create } from 'viem'
const isTest = process.env.NODE_ENV === 'test' || process.env.NEXT_PUBLIC_TEST === 'true'

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

  // TODO: maybe use an actual map
  // private static cache = new Map<number, DataFetcher>()

  private static cache: Record<number, DataFetcher> = {}

  static onChain(chainId: ChainId): DataFetcher {
    if (chainId in this.cache) {
      return this.cache[chainId]
    }

    this.cache[chainId] = new DataFetcher(chainId)

    return this.cache[chainId]
  }

  constructor(chainId: ChainId, web3Client?: PublicClient, databaseClient?: PrismaClient) {
    this.chainId = chainId
    if (!web3Client && !config[chainId]) {
      throw new Error(`No viem client or config for chainId ${chainId}`)
    }

    if (web3Client) {
      this.web3Client = web3Client
    } else {
      this.web3Client = createPublicClient({
        ...config[chainId],
        transport: isTest ? http('http://127.0.0.1:8545') : config[chainId].transport,
        pollingInterval: 8_000,
        batch: {
          multicall: {
            batchSize: 512,
          },
        },
      })
    }

    this.databaseClient = databaseClient
  }

  _providerIsIncluded(lp: LiquidityProviders, liquidity?: LiquidityProviders[]) {
    if (!liquidity) return true
    if (lp === LiquidityProviders.NativeWrap) return true
    return liquidity.some((l) => l === lp)
  }

  // Starts pool data fetching
  startDataFetching(
    providers?: LiquidityProviders[] // all providers if undefined
  ) {
    this.stopDataFetching()
    this.poolCodes = new Map()

    this.providers = [new NativeWrapProvider(this.chainId, this.web3Client)]

    if (this._providerIsIncluded(LiquidityProviders.SushiSwapV2, providers)) {
      try {
        const provider = new SushiSwapV2Provider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (
      this._providerIsIncluded(LiquidityProviders.Trident, providers) &&
      isBentoBoxV1ChainId(this.chainId) &&
      (isTridentConstantPoolFactoryChainId(this.chainId) || isTridentStablePoolFactoryChainId(this.chainId))
    ) {
      try {
        const provider = new TridentProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.SushiSwapV3, providers)) {
      try {
        const provider = new SushiSwapV3Provider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.UniswapV3, providers)) {
      try {
        const provider = new UniswapV3Provider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.ApeSwap, providers)) {
      try {
        const provider = new ApeSwapProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.Biswap, providers)) {
      try {
        const provider = new BiswapProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.Dfyn, providers)) {
      try {
        const provider = new DfynProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.Elk, providers)) {
      try {
        const provider = new ElkProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.HoneySwap, providers)) {
      try {
        const provider = new HoneySwapProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.JetSwap, providers)) {
      try {
        const provider = new JetSwapProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.NetSwap, providers)) {
      try {
        const provider = new NetSwapProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.PancakeSwap, providers)) {
      try {
        const provider = new PancakeSwapProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.QuickSwap, providers)) {
      try {
        const provider = new QuickSwapProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.SpookySwap, providers)) {
      try {
        const provider = new SpookySwapProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.TraderJoe, providers)) {
      try {
        const provider = new TraderJoeProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.UbeSwap, providers)) {
      try {
        const provider = new UbeSwapProvider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.UniswapV2, providers)) {
      try {
        const provider = new UniswapV2Provider(this.chainId, this.web3Client, this.databaseClient)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.CurveSwap, providers)) {
      try {
        const provider = new CurveProvider(this.chainId, this.web3Client)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.DovishV3, providers)) {
      try {
        const provider = new DovishV3Provider(this.chainId, this.web3Client)
        this.providers.push(provider)
      } catch (e: unknown) {
        // console.warn(e.message)
      }
    }

    if (this._providerIsIncluded(LiquidityProviders.LaserSwap, providers)) {
      try {
        const provider = new LaserSwapV2Provider(this.chainId, this.web3Client)
        this.providers.push(provider)
      } catch (e: unknown) {
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

  async fetchPoolsForToken(currency0: Type, currency1: Type, excludePools?: Set<string>): Promise<void> {
    // ensure that we only fetch the native wrap pools if the token is the native currency and wrapped native currency
    if (currency0.wrapped.equals(currency1.wrapped)) {
      const provider = this.providers.find((p) => p.getType() === LiquidityProviders.NativeWrap)
      if (provider) {
        await provider.fetchPoolsForToken(currency0.wrapped, currency1.wrapped, excludePools)
      }
    } else {
      const [token0, token1] =
        currency0.wrapped.equals(currency1.wrapped) || currency0.wrapped.sortsBefore(currency1.wrapped)
          ? [currency0.wrapped, currency1.wrapped]
          : [currency1.wrapped, currency0.wrapped]
      await Promise.all(this.providers.map((p) => p.fetchPoolsForToken(token0, token1, excludePools)))
    }
  }

  getCurrentPoolCodeMap(currency0: Type, currency1: Type): Map<string, PoolCode> {
    const result: Map<string, PoolCode> = new Map()
    this.providers.forEach((p) => {
      const poolCodes = p.getCurrentPoolList(currency0.wrapped, currency1.wrapped)
      poolCodes.forEach((pc) => result.set(pc.pool.address, pc))
    })

    return result
  }

  getCurrentPoolCodeList(currency0: Type, currency1: Type): PoolCode[] {
    const pcMap = this.getCurrentPoolCodeMap(currency0.wrapped, currency1.wrapped)
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
}
