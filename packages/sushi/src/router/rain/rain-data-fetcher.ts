import { isDeepStrictEqual } from 'util'
import { ParseAbiItem } from 'viem'
import { Type } from '../../currency/index.js'
import { DataFetcher, DataFetcherOptions } from '../data-fetcher.js'
import { ApeSwapProvider } from '../liquidity-providers/ApeSwap.js'
import { BaseSwapProvider } from '../liquidity-providers/BaseSwap.js'
import { BiswapProvider } from '../liquidity-providers/Biswap.js'
import { BlastDEXProvider } from '../liquidity-providers/BlastDEX.js'
import { BlazeSwapProvider } from '../liquidity-providers/BlazeSwap.js'
import { DfynProvider } from '../liquidity-providers/Dfyn.js'
import { DovishV3Provider } from '../liquidity-providers/DovishV3.js'
import { DyorV2Provider } from '../liquidity-providers/DyorV2.js'
import { ElkProvider } from '../liquidity-providers/Elk.js'
import { EnosysProvider } from '../liquidity-providers/Enosys.js'
import { GravityFinanceProvider } from '../liquidity-providers/GravityFinance.js'
import { HoneySwapProvider } from '../liquidity-providers/HoneySwap.js'
import { HyperBlastProvider } from '../liquidity-providers/HyperBlast.js'
import { JetSwapProvider } from '../liquidity-providers/JetSwap.js'
import { KinetixV2Provider } from '../liquidity-providers/KinetixV2.js'
import { KinetixV3Provider } from '../liquidity-providers/KinetixV3.js'
import { LaserSwapV2Provider } from '../liquidity-providers/LaserSwap.js'
import { LiquidityProviders } from '../liquidity-providers/LiquidityProvider.js'
import { LynexV1Provider } from '../liquidity-providers/LynexV1.js'
import { LynexV2Provider } from '../liquidity-providers/LynexV2.js'
import { MSwapProvider } from '../liquidity-providers/MSwap.js'
import { MonoswapV2Provider } from '../liquidity-providers/MonoSwapV2.js'
import { MonoswapV3Provider } from '../liquidity-providers/MonoSwapV3.js'
import { NativeWrapProvider } from '../liquidity-providers/NativeWrapProvider.js'
import { NetSwapProvider } from '../liquidity-providers/NetSwap.js'
import { PancakeSwapV2Provider } from '../liquidity-providers/PancakeSwapV2.js'
import { PancakeSwapV3Provider } from '../liquidity-providers/PancakeSwapV3.js'
import { QuickSwapV2Provider } from '../liquidity-providers/QuickSwapV2.js'
import { QuickSwapV3Provider } from '../liquidity-providers/QuickswapV3.js'
import { SolarbeamProvider } from '../liquidity-providers/Solarbeam.js'
import { SparkDexV2Provider } from '../liquidity-providers/SparkDexV2.js'
import { SparkDexV3Provider } from '../liquidity-providers/SparkDexV3.js'
import { SparkDexV3_1Provider } from '../liquidity-providers/SparkDexV3_1.js'
import { SpookySwapV2Provider } from '../liquidity-providers/SpookySwapV2.js'
import { SpookySwapV3Provider } from '../liquidity-providers/SpookySwapV3.js'
import { SushiSwapV2Provider } from '../liquidity-providers/SushiSwapV2.js'
import { SushiSwapV3Provider } from '../liquidity-providers/SushiSwapV3.js'
import { SwapBlastProvider } from '../liquidity-providers/SwapBlast.js'
import {
  ThrusterV2_1Provider,
  ThrusterV2_3Provider,
} from '../liquidity-providers/ThrusterV2.js'
import { ThrusterV3Provider } from '../liquidity-providers/ThrusterV3.js'
import { TraderJoeProvider } from '../liquidity-providers/TraderJoe.js'
import { UbeSwapProvider } from '../liquidity-providers/UbeSwap.js'
import { UniswapV2Provider } from '../liquidity-providers/UniswapV2.js'
import { UniswapV3Provider } from '../liquidity-providers/UniswapV3.js'
import { VVSStandardProvider } from '../liquidity-providers/VVSStandard.js'
import { WagmiProvider } from '../liquidity-providers/Wagmi.js'
import { RainUniswapV2BaseProvider } from './RainUniswapV2Base.js'
import { RainUniswapV3BaseProvider } from './RainUniswapV3Base.js'

export class RainDataFetcher extends DataFetcher {
  eventsAbi: ParseAbiItem<any>[] = []

  override _setProviders(providers?: LiquidityProviders[]) {
    this.providers = [new NativeWrapProvider(this.chainId, this.web3Client)]
    ;[
      ApeSwapProvider,
      BaseSwapProvider,
      BiswapProvider,
      BlastDEXProvider,
      BlazeSwapProvider,
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
          // gather eventsAbi unique instances
          if (provider?.eventsAbi?.length) {
            ;(provider.eventsAbi as any[]).forEach((v) => {
              if (this.eventsAbi.every((e) => !isDeepStrictEqual(e, v))) {
                this.eventsAbi.push(v)
              }
            })
          }
        }
      } catch (_e: unknown) {}
    })
  }

  override async fetchPoolsForToken(
    currency0: Type,
    currency1: Type,
    excludePools?: Set<string>,
    options?: DataFetcherOptions,
  ): Promise<void> {
    let opts = options
    if (!opts) {
      opts = {
        blockNumber: await this.web3Client.getBlockNumber(),
      }
    }
    if (typeof opts.blockNumber !== 'bigint') {
      opts.blockNumber = await this.web3Client.getBlockNumber()
    }
    await super.fetchPoolsForToken(currency0, currency1, excludePools, opts)
  }

  // updates the pool data of all dexes by enevts until the given block
  async updatePools(untilBlock?: bigint) {
    let fromBlock = -1n
    const addresses: string[] = []
    if (typeof untilBlock !== 'bigint') {
      untilBlock = await this.web3Client.getBlockNumber()
    }

    // gather all provider factory and pools addresses
    this.providers.forEach((provider: any) => {
      if (
        provider instanceof RainUniswapV2BaseProvider ||
        provider instanceof RainUniswapV3BaseProvider
      ) {
        const factory =
          provider.factory[
            this.chainId as keyof typeof provider.factory
          ]!.toLowerCase()
        if (!addresses.includes(factory)) {
          addresses.push(factory)
        }
        const pools = provider.pools
        pools.forEach((pool, address) => {
          if (!addresses.includes(address)) {
            addresses.push(address)
          }
          if (fromBlock === -1n) {
            fromBlock = pool.blockNumber
          }
          if (pool.blockNumber < fromBlock) {
            fromBlock = pool.blockNumber
          }
        })
      }
    })
    if (!addresses.length) return
    if (fromBlock === untilBlock) return

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
          provider instanceof RainUniswapV2BaseProvider ||
          provider instanceof RainUniswapV3BaseProvider
        ) {
          provider.pools.forEach((pool) => {
            pool.blockNumber = untilBlock!
          })
        }
      }
    })
  }
}
