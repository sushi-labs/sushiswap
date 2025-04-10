import { isDeepStrictEqual } from 'util'
import { ParseAbiItem, PublicClient } from 'viem'
import { ChainId } from '../../chain/constants.js'
import { Type } from '../../currency/index.js'
import { MultiRoute } from '../../tines/Graph.js'
import { DataFetcher, DataFetcherOptions } from '../data-fetcher.js'
import { AerodromeSlipstreamProvider } from '../liquidity-providers/AerodromeSlipstream.js'
import { AlienBaseV2Provider } from '../liquidity-providers/AlienBaseV2.js'
import { AlienBaseV3Provider } from '../liquidity-providers/AlienBaseV3.js'
import { ApeSwapProvider } from '../liquidity-providers/ApeSwap.js'
import { BSCSwapProvider } from '../liquidity-providers/BSCSwap.js'
import { BakerySwapProvider } from '../liquidity-providers/BakerySwap.js'
import { BaseSwapProvider } from '../liquidity-providers/BaseSwap.js'
import { BaseSwapV3Provider } from '../liquidity-providers/BaseSwapV3.js'
import { BiswapProvider } from '../liquidity-providers/Biswap.js'
import { BladeSwapProvider } from '../liquidity-providers/BladeSwap.js'
import { BlastDEXProvider } from '../liquidity-providers/BlastDEX.js'
import { BlazeSwapProvider } from '../liquidity-providers/BlazeSwap.js'
import { CORExProvider } from '../liquidity-providers/COREx.js'
import { CroDefiSwapProvider } from '../liquidity-providers/CroDefiSwap.js'
import { DackieSwapV2Provider } from '../liquidity-providers/DackieSwapV2.js'
import { DackieSwapV3Provider } from '../liquidity-providers/DackieSwapV3.js'
import { DfynProvider } from '../liquidity-providers/Dfyn.js'
import { DovishV3Provider } from '../liquidity-providers/DovishV3.js'
import { DyorV2Provider } from '../liquidity-providers/DyorV2.js'
import { EddyFinanceProvider } from '../liquidity-providers/EddyFinance.js'
import { ElkProvider } from '../liquidity-providers/Elk.js'
import { EnosysProvider } from '../liquidity-providers/Enosys.js'
import { FenixProvider } from '../liquidity-providers/Fenix.js'
import { GlyphV4Provider } from '../liquidity-providers/GlyphV4.js'
import { GravityFinanceProvider } from '../liquidity-providers/GravityFinance.js'
import { HoneySwapProvider } from '../liquidity-providers/HoneySwap.js'
import { HorizonProvider } from '../liquidity-providers/Horizon.js'
import { HyperBlastProvider } from '../liquidity-providers/HyperBlast.js'
import { JetSwapProvider } from '../liquidity-providers/JetSwap.js'
import { KimV4Provider } from '../liquidity-providers/KimV4.js'
import { KinetixV2Provider } from '../liquidity-providers/KinetixV2.js'
import { KinetixV3Provider } from '../liquidity-providers/KinetixV3.js'
import { KwikswapProvider } from '../liquidity-providers/Kwikswap.js'
import { LaserSwapV2Provider } from '../liquidity-providers/LaserSwap.js'
import { LiquidityProviders } from '../liquidity-providers/LiquidityProvider.js'
import { LynexV1Provider } from '../liquidity-providers/LynexV1.js'
import { LynexV2Provider } from '../liquidity-providers/LynexV2.js'
import { MMFinanceProvider } from '../liquidity-providers/MMFinance.js'
import { MSwapProvider } from '../liquidity-providers/MSwap.js'
import { MonoswapV2Provider } from '../liquidity-providers/MonoSwapV2.js'
import { MonoswapV3Provider } from '../liquidity-providers/MonoSwapV3.js'
import { NativeWrapProvider } from '../liquidity-providers/NativeWrapProvider.js'
import { NetSwapProvider } from '../liquidity-providers/NetSwap.js'
import { NineInchProvider } from '../liquidity-providers/NineInch.js'
import { PancakeSwapV2Provider } from '../liquidity-providers/PancakeSwapV2.js'
import { PancakeSwapV3Provider } from '../liquidity-providers/PancakeSwapV3.js'
import { PangolinProvider } from '../liquidity-providers/Pangolin.js'
import { QuickSwapV2Provider } from '../liquidity-providers/QuickSwapV2.js'
import { QuickSwapV3Provider } from '../liquidity-providers/QuickswapV3.js'
import { RingExchangeV2Provider } from '../liquidity-providers/RingExchangeV2.js'
import { RingExchangeV3Provider } from '../liquidity-providers/RingExchangeV3.js'
import { ScribeProvider } from '../liquidity-providers/Scribe.js'
import { ShibaSwapProvider } from '../liquidity-providers/ShibaSwap.js'
import { SolarbeamProvider } from '../liquidity-providers/Solarbeam.js'
import { SparkDexV2Provider } from '../liquidity-providers/SparkDexV2.js'
import { SparkDexV3Provider } from '../liquidity-providers/SparkDexV3.js'
import { SparkDexV3_1Provider } from '../liquidity-providers/SparkDexV3_1.js'
import { SpookySwapV2Provider } from '../liquidity-providers/SpookySwapV2.js'
import { SpookySwapV3Provider } from '../liquidity-providers/SpookySwapV3.js'
import { SquadSwapV2Provider } from '../liquidity-providers/SquadSwapV2.js'
import { SushiSwapV2Provider } from '../liquidity-providers/SushiSwapV2.js'
import { SushiSwapV3Provider } from '../liquidity-providers/SushiSwapV3.js'
import { SwapBlastProvider } from '../liquidity-providers/SwapBlast.js'
import { SwapsicleProvider } from '../liquidity-providers/Swapsicle.js'
import {
  ThrusterV2_1Provider,
  ThrusterV2_3Provider,
} from '../liquidity-providers/ThrusterV2.js'
import { ThrusterV3Provider } from '../liquidity-providers/ThrusterV3.js'
import { TraderJoeProvider } from '../liquidity-providers/TraderJoe.js'
import { UbeSwapProvider } from '../liquidity-providers/UbeSwap.js'
import { UniswapV2Provider } from '../liquidity-providers/UniswapV2.js'
import { UniswapV3Provider } from '../liquidity-providers/UniswapV3.js'
import { VVSFlawlessProvider } from '../liquidity-providers/VVSFlawless.js'
import { VVSStandardProvider } from '../liquidity-providers/VVSStandard.js'
import { VelodromeSlipstreamProvider } from '../liquidity-providers/VelodromeSlipstream.js'
import { WagmiProvider } from '../liquidity-providers/Wagmi.js'
import { WigoswapProvider } from '../liquidity-providers/Wigoswap.js'
import { ZebraV2Provider } from '../liquidity-providers/ZebraV2.js'
import { PoolCode } from '../pool-codes/PoolCode.js'
import { PoolFilter, Router } from '../router.js'
import { UniswapV2BaseProvider } from './UniswapV2Base.js'
import { UniswapV3BaseProvider } from './UniswapV3Base.js'
import { VelodromeSlipstreamBaseProvider } from './VelodromeSlipstreamBase.js'

// options for data fetching, such as pinning block number and memoize
export interface RainDataFetcherOptions extends DataFetcherOptions {
  /**
   * Set to true for ignoring cached pools data and fetch them regardless
   */
  ignoreCache?: boolean
}

export class RainDataFetcher extends DataFetcher {
  initBlockNumber = -1n
  eventsAbi: ParseAbiItem<any>[] = []
  factories: string[] = []

  // make constructor private, must use init() for instantiation
  private constructor(chainId: ChainId, publicClient?: PublicClient) {
    super(chainId, publicClient)
  }

  /**
   * Creates an instance of RainDataFetcher, constructor of this class should
   * not be used, instead, use this method to create a new instance
   * @param chainId - The chain id
   * @param publicClient - (optional) The viem client
   * @param liquidityProviders - (optional) List of liquidity providers, includes all if undefined
   * @param initBlockNumber - (optional) Block height to initialize at
   * @returns A new instance of RainDataFetcher
   */
  static async init(
    chainId: ChainId,
    publicClient?: PublicClient,
    liquidityProviders?: LiquidityProviders[],
    initBlockNumber?: bigint,
  ): Promise<RainDataFetcher> {
    const dataFetcher = new RainDataFetcher(chainId, publicClient)
    if (typeof initBlockNumber === 'bigint') {
      if (initBlockNumber < 0n)
        throw 'expected block number greater than equal zero'
      dataFetcher.initBlockNumber = initBlockNumber
    } else {
      dataFetcher.initBlockNumber =
        await dataFetcher.web3Client.getBlockNumber()
    }
    await dataFetcher.initProviders(liquidityProviders)
    dataFetcher.startDataFetching(liquidityProviders)
    return dataFetcher
  }

  /**
   * Initializes list of liquidity providers
   * @param providers - (optional) List of liquidity providers, includes all if undefined
   */
  async initProviders(providers?: LiquidityProviders[]) {
    this.providers = [new NativeWrapProvider(this.chainId, this.web3Client)]
    const allProviders = [
      AerodromeSlipstreamProvider,
      AlienBaseV2Provider,
      AlienBaseV3Provider,
      ApeSwapProvider,
      BakerySwapProvider,
      BaseSwapProvider,
      BaseSwapV3Provider,
      BiswapProvider,
      BladeSwapProvider,
      BlastDEXProvider,
      BlazeSwapProvider,
      BSCSwapProvider,
      CORExProvider,
      CroDefiSwapProvider,
      DackieSwapV2Provider,
      DackieSwapV3Provider,
      DfynProvider,
      DovishV3Provider,
      DyorV2Provider,
      EddyFinanceProvider,
      ElkProvider,
      EnosysProvider,
      FenixProvider,
      GlyphV4Provider,
      GravityFinanceProvider,
      HoneySwapProvider,
      HorizonProvider,
      HyperBlastProvider,
      JetSwapProvider,
      KimV4Provider,
      KinetixV2Provider,
      KinetixV3Provider,
      KwikswapProvider,
      LaserSwapV2Provider,
      LynexV1Provider,
      LynexV2Provider,
      MMFinanceProvider,
      MonoswapV2Provider,
      MonoswapV3Provider,
      MSwapProvider,
      NetSwapProvider,
      NineInchProvider,
      PancakeSwapV2Provider,
      PancakeSwapV3Provider,
      PangolinProvider,
      QuickSwapV2Provider,
      QuickSwapV3Provider,
      RingExchangeV2Provider,
      RingExchangeV3Provider,
      ScribeProvider,
      ShibaSwapProvider,
      SolarbeamProvider,
      SparkDexV2Provider,
      SparkDexV3Provider,
      SparkDexV3_1Provider,
      SpookySwapV2Provider,
      SpookySwapV3Provider,
      SquadSwapV2Provider,
      SushiSwapV2Provider,
      SushiSwapV3Provider,
      SwapBlastProvider,
      SwapsicleProvider,
      ThrusterV2_1Provider,
      ThrusterV2_3Provider,
      ThrusterV3Provider,
      TraderJoeProvider,
      UbeSwapProvider,
      UniswapV2Provider,
      UniswapV3Provider,
      VelodromeSlipstreamProvider,
      VVSStandardProvider,
      VVSFlawlessProvider,
      WagmiProvider,
      WigoswapProvider,
      ZebraV2Provider,
    ]

    const _pendings = []
    const _providers = []
    for (const p of allProviders) {
      try {
        const provider = new p(this.chainId, this.web3Client)
        if (
          // If none passed, include all
          !providers ||
          this._providerIsIncluded(provider.getType(), providers)
        ) {
          _pendings.push(provider.init(this.initBlockNumber))
          _providers?.push(provider)
        }
      } catch (_e: unknown) {}
    }

    for (let i = 0; i < _pendings.length; i++) {
      const provider = _providers[i]!
      await _pendings[i]?.catch(() => {
        console.warn(`Failed to initialize ${provider.getPoolProviderName()}`)
      })
      if (provider.initialized) {
        this.providers.push(provider)

        // gather unique instances of liquidity provider events abi
        if (provider?.eventsAbi?.length) {
          ;(provider.eventsAbi as any[]).forEach((abi) => {
            if (this.eventsAbi.every((v) => !isDeepStrictEqual(v, abi))) {
              this.eventsAbi.push(abi)
            }
          })
        }
        // gather factory addresses
        if (
          provider instanceof UniswapV2BaseProvider ||
          provider instanceof UniswapV3BaseProvider
        ) {
          const factory =
            provider.factory[
              this.chainId as keyof typeof provider.factory
            ]!.toLowerCase()
          if (!this.factories.includes(factory)) {
            this.factories.push(factory)
          }
        }
      }
    }
  }

  /**
   * Updates the pools data of all the liquidity providers until the given block number
   * @param untilBlock - (optional) The block number to update to, if left undefined,
   * pools data will be updated to latest block number
   */
  async updatePools(untilBlock?: bigint) {
    let fromBlock = -1n
    const poolAddresses: string[] = []
    const addresses: string[] = [...this.factories]
    if (typeof untilBlock !== 'bigint') {
      untilBlock = await this.web3Client.getBlockNumber()
    }

    // gather all provider pools addresses
    this.providers.forEach((provider: any) => {
      if (
        provider instanceof UniswapV2BaseProvider ||
        provider instanceof UniswapV3BaseProvider
      ) {
        const pools = provider.pools
        pools.forEach((pool, address) => {
          poolAddresses.push(address)
          if (fromBlock === -1n) {
            fromBlock = pool.blockNumber
          }
          if (pool.blockNumber < fromBlock) {
            fromBlock = pool.blockNumber
          }
        })

        // slipstream has swapFeeModule address to be collected as well
        if (provider instanceof VelodromeSlipstreamBaseProvider) {
          const swapFeeModule =
            provider.swapFeeModule[
              this.chainId as keyof typeof provider.swapFeeModule
            ]!.toLowerCase()
          addresses.push(swapFeeModule)
        }
      }
    })
    if (fromBlock === -1n) return
    if (fromBlock === untilBlock) return
    if (fromBlock > untilBlock) {
      throw [
        'pools data are cached at higher block height than the given untilBlock',
        'if you wish to get pools data at untilBlock',
        'consider calling fetchPoolsForToken() with "ignoreCache" option',
      ].join(', ')
    }
    if (!poolAddresses.length) return
    addresses.push(...poolAddresses)

    // get logs and sort them from earliest block to latest
    const logs = await this.web3Client.getLogs({
      events: this.eventsAbi,
      address: addresses as `0x${string}`[],
      fromBlock,
      toBlock: untilBlock,
    })
    logs.sort((a, b) => {
      const diff = a.blockNumber - b.blockNumber
      if (diff === 0n) {
        return a.logIndex - b.logIndex
      } else {
        return Number(diff)
      }
    })

    // process each log for each provider
    logs.forEach((log) => {
      this.providers.forEach((p) => {
        p.processLog(log)
      })
    })
    const results = await Promise.allSettled(
      this.providers.map((p) => p.afterProcessLog(untilBlock!)),
    )
    results.forEach((res, i) => {
      if (res.status === 'fulfilled') {
        const provider = this.providers[i]
        if (
          provider instanceof UniswapV2BaseProvider ||
          provider instanceof UniswapV3BaseProvider
        ) {
          provider.pools.forEach((pool) => {
            pool.blockNumber = untilBlock!
          })
        }
      }
    })
  }

  /**
   * Resets this instance's liquidity providers cached pools data
   */
  reset() {
    this.providers.forEach((provider) => {
      if (
        provider instanceof UniswapV2BaseProvider ||
        provider instanceof UniswapV3BaseProvider
      ) {
        provider.reset()
      }
    })
  }

  /**
   * Get route and poolcode map for the given tokens and amount
   * @param chainId - The network chain id
   * @param fromToken - The from token
   * @param toToken - The to token
   * @param amountIn - The sell amount, of fromToken
   * @param gasPrice - Gas price
   * @param update - (optional) Whether or not pool should be updated before finding route, default is false
   * @param options - (optional) options for fetching new pools data
   * @param lps - (optional) List of liquidity providers, includes all if undefined
   * @param poolFilter - (optional) A function to filter pools
   * @param routeType - (optional) single (default) picks the best route with no breadth, multi
   * picks the best route with breadth, set undefined for picking the better of the two
   */
  async findBestRoute(
    chainId: ChainId,
    fromToken: Type,
    toToken: Type,
    amountIn: bigint,
    gasPrice: bigint,
    update = false,
    options?: RainDataFetcherOptions,
    lps?: LiquidityProviders[],
    poolFilter?: PoolFilter,
    routeType: 'single' | 'multi' = 'single',
  ): Promise<{
    /** The route */
    route: MultiRoute
    /**
     * The PoolCode map, which is a map of all available pools
     * with their details for the given token pair to route among
     */
    pcMap: Map<string, PoolCode>
  }> {
    const opts = { ...options }
    if (typeof opts.blockNumber !== 'bigint') {
      opts.blockNumber = await this.web3Client.getBlockNumber()
    }
    if (typeof opts.ignoreCache !== 'boolean') {
      opts.ignoreCache = false
    }

    if (update) await this.updatePools(opts.blockNumber)
    await this.fetchPoolsForToken(fromToken, toToken, undefined, opts)

    const pcMap = this.getCurrentPoolCodeMap(fromToken, toToken)
    const route = Router.findBestRoute(
      pcMap,
      chainId,
      fromToken,
      amountIn,
      toToken,
      Number(gasPrice),
      lps,
      poolFilter,
      undefined,
      routeType,
    )
    return { pcMap: pcMap, route }
  }

  static override onChain(chainId: ChainId): RainDataFetcher {
    return new RainDataFetcher(chainId)
  }

  override startDataFetching(_providers?: LiquidityProviders[]) {
    this.providers.forEach((p) => p.startFetchPoolsData())
    this.stopDataFetching()
  }

  override async fetchPoolsForToken(
    currency0: Type,
    currency1: Type,
    excludePools?: Set<string>,
    options?: RainDataFetcherOptions,
  ): Promise<void> {
    const opts = { ...options }
    if (typeof opts.blockNumber !== 'bigint') {
      opts.blockNumber = await this.web3Client.getBlockNumber()
    }
    if (typeof opts.ignoreCache !== 'boolean') {
      opts.ignoreCache = false
    }
    await super.fetchPoolsForToken(currency0, currency1, excludePools, opts)
  }
}
