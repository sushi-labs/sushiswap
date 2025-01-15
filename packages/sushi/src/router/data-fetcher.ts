import { http, PublicClient, createPublicClient } from 'viem'
import { ChainId, TestnetChainId } from '../chain/index.js'
import { publicClientConfig } from '../config/index.js'
import { Type } from '../currency/index.js'
import { ApeSwapProvider } from './liquidity-providers/ApeSwap.js'
import { BaseSwapProvider } from './liquidity-providers/BaseSwap.js'
import { BiswapProvider } from './liquidity-providers/Biswap.js'
import { BlastDEXProvider } from './liquidity-providers/BlastDEX.js'
import { BlazeSwapProvider } from './liquidity-providers/BlazeSwap.js'
import { CurveProvider } from './liquidity-providers/CurveProvider.js'
import { DfynProvider } from './liquidity-providers/Dfyn.js'
import { DovishV3Provider } from './liquidity-providers/DovishV3.js'
import { DyorV2Provider } from './liquidity-providers/DyorV2.js'
import { ElkProvider } from './liquidity-providers/Elk.js'
import { EnosysProvider } from './liquidity-providers/Enosys.js'
import { GravityFinanceProvider } from './liquidity-providers/GravityFinance.js'
import { HoneySwapProvider } from './liquidity-providers/HoneySwap.js'
import { HyperBlastProvider } from './liquidity-providers/HyperBlast.js'
import { JetSwapProvider } from './liquidity-providers/JetSwap.js'
import { KinetixV2Provider } from './liquidity-providers/KinetixV2.js'
import { KinetixV3Provider } from './liquidity-providers/KinetixV3.js'
import { LaserSwapV2Provider } from './liquidity-providers/LaserSwap.js'
import {
  LiquidityProvider,
  LiquidityProviders,
} from './liquidity-providers/LiquidityProvider.js'
import { LynexV1Provider } from './liquidity-providers/LynexV1.js'
import { LynexV2Provider } from './liquidity-providers/LynexV2.js'
import { MSwapProvider } from './liquidity-providers/MSwap.js'
import { MonoswapV2Provider } from './liquidity-providers/MonoSwapV2.js'
import { MonoswapV3Provider } from './liquidity-providers/MonoSwapV3.js'
import { NativeWrapProvider } from './liquidity-providers/NativeWrapProvider.js'
import { NetSwapProvider } from './liquidity-providers/NetSwap.js'
import { PancakeSwapV2Provider } from './liquidity-providers/PancakeSwapV2.js'
import { PancakeSwapV3Provider } from './liquidity-providers/PancakeSwapV3.js'
import { QuickSwapV2Provider } from './liquidity-providers/QuickSwapV2.js'
import { QuickSwapV3Provider } from './liquidity-providers/QuickswapV3.js'
import { SolarbeamProvider } from './liquidity-providers/Solarbeam.js'
import { SparkDexV2Provider } from './liquidity-providers/SparkDexV2.js'
import { SparkDexV3Provider } from './liquidity-providers/SparkDexV3.js'
import { SparkDexV3_1Provider } from './liquidity-providers/SparkDexV3_1.js'
import { SpookySwapV2Provider } from './liquidity-providers/SpookySwapV2.js'
import { SpookySwapV3Provider } from './liquidity-providers/SpookySwapV3.js'
import { SushiSwapV2Provider } from './liquidity-providers/SushiSwapV2.js'
import { SushiSwapV3Provider } from './liquidity-providers/SushiSwapV3.js'
import { SwapBlastProvider } from './liquidity-providers/SwapBlast.js'
import {
  ThrusterV2_1Provider,
  ThrusterV2_3Provider,
} from './liquidity-providers/ThrusterV2.js'
import { ThrusterV3Provider } from './liquidity-providers/ThrusterV3.js'
import { TraderJoeProvider } from './liquidity-providers/TraderJoe.js'
import { TridentProvider } from './liquidity-providers/Trident.js'
import { UbeSwapProvider } from './liquidity-providers/UbeSwap.js'
import { UniswapV2Provider } from './liquidity-providers/UniswapV2.js'
import { UniswapV3Provider } from './liquidity-providers/UniswapV3.js'
import { VVSStandardProvider } from './liquidity-providers/VVSStandard.js'
import { WagmiProvider } from './liquidity-providers/Wagmi.js'
import type { PoolCode } from './pool-codes/index.js'
import { promiseTimeout } from './timeout.js'

// options for data fetching, such as pinning block number and memoize
export type DataFetcherOptions = {
  /**
   * The pinned block number when getting onchain data
   * this option is usefull for reproducing the route,
   * price, etc of a certain block
   */
  blockNumber?: bigint
  /** Determines if memoizer should be used or not */
  memoize?: boolean
  /** Determines a timeout (in ms) for fetching pools for a token pair */
  fetchPoolsTimeout?: number
}

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
      BaseSwapProvider,
      BiswapProvider,
      BlastDEXProvider,
      BlazeSwapProvider,
      CurveProvider,
      DfynProvider,
      DovishV3Provider,
      DyorV2Provider,
      ElkProvider,
      EnosysProvider,
      GravityFinanceProvider,
      HoneySwapProvider,
      HyperBlastProvider,
      JetSwapProvider,
      KinetixV2Provider,
      KinetixV3Provider,
      LaserSwapV2Provider,
      LynexV1Provider,
      LynexV2Provider,
      MonoswapV2Provider,
      MonoswapV3Provider,
      MSwapProvider,
      NetSwapProvider,
      PancakeSwapV2Provider,
      PancakeSwapV3Provider,
      QuickSwapV2Provider,
      QuickSwapV3Provider,
      SolarbeamProvider,
      SparkDexV2Provider,
      SparkDexV3Provider,
      SparkDexV3_1Provider,
      SpookySwapV2Provider,
      SpookySwapV3Provider,
      SushiSwapV2Provider,
      SushiSwapV3Provider,
      SwapBlastProvider,
      ThrusterV2_1Provider,
      ThrusterV2_3Provider,
      ThrusterV3Provider,
      TraderJoeProvider,
      TridentProvider,
      UbeSwapProvider,
      UniswapV2Provider,
      UniswapV3Provider,
      VVSStandardProvider,
      WagmiProvider,
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
    options?: DataFetcherOptions,
  ): Promise<void> {
    // console.log('PROVIDER COUNT', this.providers.length)
    // ensure that we only fetch the native wrap pools if the token is the native currency and wrapped native currency
    if (currency0.wrapped.equals(currency1.wrapped)) {
      const provider = this.providers.find(
        (p) => p.getType() === LiquidityProviders.NativeWrap,
      )
      if (provider) {
        try {
          options?.fetchPoolsTimeout
            ? await promiseTimeout(
                provider.fetchPoolsForToken(
                  currency0.wrapped,
                  currency1.wrapped,
                  excludePools,
                  options,
                ),
                options.fetchPoolsTimeout,
              )
            : await provider.fetchPoolsForToken(
                currency0.wrapped,
                currency1.wrapped,
                excludePools,
                options,
              )
        } catch {
          /**/
        }
      }
    } else {
      const [token0, token1] =
        currency0.wrapped.equals(currency1.wrapped) ||
        currency0.wrapped.sortsBefore(currency1.wrapped)
          ? [currency0.wrapped, currency1.wrapped]
          : [currency1.wrapped, currency0.wrapped]
      try {
        options?.fetchPoolsTimeout
          ? await promiseTimeout(
              Promise.allSettled(
                this.providers.map((p) =>
                  p.fetchPoolsForToken(token0, token1, excludePools, options),
                ),
              ),
              options.fetchPoolsTimeout,
            )
          : await Promise.allSettled(
              this.providers.map((p) =>
                p.fetchPoolsForToken(token0, token1, excludePools, options),
              ),
            )
      } catch {
        /**/
      }
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
