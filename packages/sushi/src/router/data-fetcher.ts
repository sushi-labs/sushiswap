import { http, PublicClient, createPublicClient } from 'viem'
import { ChainId, TestnetChainId } from '../chain/index.js'
import { publicClientConfig } from '../config/index.js'
import { Type } from '../currency/index.js'
import { ApeSwapProvider } from './liquidity-providers/ApeSwap.js'
import { BiswapProvider } from './liquidity-providers/Biswap.js'
import { CurveProvider } from './liquidity-providers/CurveProvider.js'
import { DfynProvider } from './liquidity-providers/Dfyn.js'
import { DovishV3Provider } from './liquidity-providers/DovishV3.js'
import { ElkProvider } from './liquidity-providers/Elk.js'
import { HoneySwapProvider } from './liquidity-providers/HoneySwap.js'
import { JetSwapProvider } from './liquidity-providers/JetSwap.js'
import { LaserSwapV2Provider } from './liquidity-providers/LaserSwap.js'
import {
  LiquidityProvider,
  LiquidityProviders,
} from './liquidity-providers/LiquidityProvider.js'
import { NativeWrapProvider } from './liquidity-providers/NativeWrapProvider.js'
import { NetSwapProvider } from './liquidity-providers/NetSwap.js'
import { PancakeSwapProvider } from './liquidity-providers/PancakeSwap.js'
import { QuickSwapProvider } from './liquidity-providers/QuickSwap.js'
import { SpookySwapProvider } from './liquidity-providers/SpookySwap.js'
import { SushiSwapV2Provider } from './liquidity-providers/SushiSwapV2.js'
import { SushiSwapV3Provider } from './liquidity-providers/SushiSwapV3.js'
import { TraderJoeProvider } from './liquidity-providers/TraderJoe.js'
import { TridentProvider } from './liquidity-providers/Trident.js'
import { UbeSwapProvider } from './liquidity-providers/UbeSwap.js'
import { UniswapV2Provider } from './liquidity-providers/UniswapV2.js'
import { UniswapV3Provider } from './liquidity-providers/UniswapV3.js'
import type { PoolCode } from './pool-codes/index.js'

// TODO: Should be a mode on the config for DataFetcher
const isTest =
  process.env['APP_ENV'] === 'test' ||
  process.env['NEXT_PUBLIC_APP_ENV'] === 'test'

// Gathers pools info, creates routing in 'incremental' mode
// This means that new routing recalculates each time new pool fetching data comes
export class DataFetcher {
  chainId: Exclude<ChainId, TestnetChainId>
  providers: LiquidityProvider[] = []
  // Provider to poolAddress to PoolCode
  poolCodes: Map<LiquidityProviders, Map<string, PoolCode>> = new Map()
  stateId = 0
  web3Client: PublicClient

  // TODO: maybe use an actual map
  // private static cache = new Map<number, DataFetcher>()

  private static cache: Record<number, DataFetcher> = {}

  static onChain(chainId: ChainId): DataFetcher {
    const cache = this.cache[chainId]
    if (cache) {
      return cache
    }
    const dataFetcher = new DataFetcher(chainId)
    this.cache[chainId] = dataFetcher
    return dataFetcher
  }

  // constructor({
  //   chainId,
  //   publicClient,
  // }: {
  //   chainId: ChainId
  //   publicClient?: PublicClient
  //   providers: LiquidityProviders[]
  //   // providers?: (new (
  //   //   chainId: ChainId,
  //   //   publicClient: PublicClient,
  //   // ) => LiquidityProvider)[]
  // }) {

  constructor(chainId: ChainId, publicClient?: PublicClient) {
    this.chainId = chainId as Exclude<ChainId, TestnetChainId>
    if (!publicClient && !publicClientConfig[this.chainId]) {
      throw new Error(
        `No public client given and no viem config found for chainId ${chainId}`,
      )
    }

    if (publicClient) {
      this.web3Client = publicClient
    } else if (isTest) {
      this.web3Client = createPublicClient({
        ...publicClientConfig[this.chainId],
        transport: http('http://127.0.0.1:8545'),
        batch: {
          multicall: {
            batchSize: 512,
          },
        },
      })
    } else {
      this.web3Client = createPublicClient(publicClientConfig[this.chainId])
    }
  }

  _providerIsIncluded(
    lp: LiquidityProviders,
    liquidity?: LiquidityProviders[],
  ) {
    if (!liquidity) return true
    if (lp === LiquidityProviders.NativeWrap) return true
    return liquidity.some((l) => l === lp)
  }

  _setProviders(providers?: LiquidityProviders[]) {
    // concrete providers
    this.providers = [new NativeWrapProvider(this.chainId, this.web3Client)]
    ;[
      ApeSwapProvider,
      BiswapProvider,
      CurveProvider,
      DfynProvider,
      DovishV3Provider,
      ElkProvider,
      HoneySwapProvider,
      JetSwapProvider,
      LaserSwapV2Provider,
      NetSwapProvider,
      PancakeSwapProvider,
      SpookySwapProvider,
      SushiSwapV2Provider,
      SushiSwapV3Provider,
      TraderJoeProvider,
      QuickSwapProvider,
      TridentProvider,
      UbeSwapProvider,
      UniswapV2Provider,
      UniswapV3Provider,
    ].forEach((p) => {
      try {
        const provider = new p(this.chainId, this.web3Client)
        if (
          // If none passed, include all
          !providers ||
          this._providerIsIncluded(provider.getType(), providers)
        ) {
          this.providers.push(provider)
        }
      } catch (_e: unknown) {
        // console.warn(e)
      }
    })
  }

  // Starts pool data fetching
  startDataFetching(
    providers?: LiquidityProviders[], // all providers if undefined
  ) {
    this.stopDataFetching()
    this._setProviders(providers)
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

  async fetchPoolsForToken(
    currency0: Type,
    currency1: Type,
    excludePools?: Set<string>,
  ): Promise<void> {
    // console.log('PROVIDER COUNT', this.providers.length)
    // ensure that we only fetch the native wrap pools if the token is the native currency and wrapped native currency
    if (currency0.wrapped.equals(currency1.wrapped)) {
      const provider = this.providers.find(
        (p) => p.getType() === LiquidityProviders.NativeWrap,
      )
      if (provider) {
        await provider.fetchPoolsForToken(
          currency0.wrapped,
          currency1.wrapped,
          excludePools,
        )
      }
    } else {
      const [token0, token1] =
        currency0.wrapped.equals(currency1.wrapped) ||
        currency0.wrapped.sortsBefore(currency1.wrapped)
          ? [currency0.wrapped, currency1.wrapped]
          : [currency1.wrapped, currency0.wrapped]
      await Promise.all(
        this.providers.map((p) =>
          p.fetchPoolsForToken(token0, token1, excludePools),
        ),
      )
    }
  }

  getCurrentPoolCodeMap(
    currency0: Type,
    currency1: Type,
  ): Map<string, PoolCode> {
    const result: Map<string, PoolCode> = new Map()
    this.providers.forEach((p) => {
      const poolCodes = p.getCurrentPoolList(
        currency0.wrapped,
        currency1.wrapped,
      )
      poolCodes.forEach((pc) => result.set(pc.pool.uniqueID(), pc))
    })

    return result
  }

  getCurrentPoolCodeList(currency0: Type, currency1: Type): PoolCode[] {
    const pcMap = this.getCurrentPoolCodeMap(
      currency0.wrapped,
      currency1.wrapped,
    )
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
