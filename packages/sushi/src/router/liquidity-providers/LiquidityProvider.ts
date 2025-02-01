import { PublicClient } from 'viem'
import { ChainId, chainShortName } from '../../chain/index.js'
import type { Token } from '../../currency/index.js'
import { DataFetcherOptions } from '../data-fetcher.js'
import type { PoolCode } from '../pool-codes/index.js'

export enum LiquidityProviders {
  SushiSwapV2 = 'SushiSwapV2',
  SushiSwapV3 = 'SushiSwapV3',
  UniswapV2 = 'UniswapV2',
  UniswapV3 = 'UniswapV3',
  Trident = 'Trident',
  QuickSwapV2 = 'QuickSwapV2',
  QuickSwapV3 = 'QuickSwapV3',
  ApeSwap = 'ApeSwap',
  PancakeSwapV2 = 'PancakeSwapV2',
  PancakeSwapV3 = 'PancakeSwapV3',
  TraderJoe = 'TraderJoe',
  Dfyn = 'Dfyn',
  Elk = 'Elk',
  JetSwap = 'JetSwap',
  SpookySwapV2 = 'SpookySwapV2',
  SpookySwapV3 = 'SpookySwapV3',
  NetSwap = 'NetSwap',
  NativeWrap = 'NativeWrap',
  HoneySwap = 'HoneySwap',
  UbeSwap = 'UbeSwap',
  Biswap = 'Biswap',
  CurveSwap = 'CurveSwap',
  DovishV3 = 'DovishV3',
  Wagmi = 'Wagmi',
  LaserSwap = 'LaserSwap',
  BaseSwap = 'BaseSwap',
  BaseSwapV3 = 'BaseSwapV3',
  AlgebraIntegral = 'AlgebraIntegral',
  Solarbeam = 'Solarbeam',
  Swapsicle = 'Swapsicle',
  VVSStandard = 'VVSStandard',
  Fraxswap = 'Fraxswap',
  SwapBlast = 'SwapBlast',
  BlastDEX = 'BlastDEX',
  MonoswapV2 = 'MonoswapV2',
  MonoswapV3 = 'MonoswapV3',
  MSwap = 'MSwap',
  ThrusterV2 = 'ThrusterV2',
  ThrusterV3 = 'ThrusterV3',
  DyorV2 = 'DyorV2',
  HyperBlast = 'HyperBlast',
  KinetixV2 = 'KinetixV2',
  KinetixV3 = 'KinetixV3',
  Camelot = 'Camelot',
  Enosys = 'Enosys',
  BlazeSwap = 'BlazeSwap',
  LynexV1 = 'LynexV1',
  LynexV2 = 'LynexV2',
  SparkDexV2 = 'SparkDexV2',
  SparkDexV3 = 'SparkDexV3',
  SparkDexV3_1 = 'SparkDexV3_1',
  GravityFinance = 'GravityFinance',
  DackieSwapV2 = 'DackieSwapV2',
  DackieSwapV3 = 'DackieSwapV3',
  Pangolin = 'Pangolin',
  AlienBaseV2 = 'AlienBaseV2',
  AlienBaseV3 = 'AlienBaseV3',
  KimV4 = 'KimV4',
  RingExchangeV2 = 'RingExchangeV2',
  RingExchangeV3 = 'RingExchangeV3',
  BladeSwap = 'BladeSwap',
  Fenix = 'Fenix',
  BakerySwap = 'BakerySwap',
  SquadSwapV2 = 'SquadSwapV2',
  BSCSwap = 'BSCSwap',
  COREx = 'COREx',
  GlyphV4 = 'GlyphV4',
  Kwikswap = 'Kwikswap',
  ShibaSwap = 'ShibaSwap',
  CroDefiSwap = 'CroDefiSwap',
  NineInch = 'NineInch',
  Wigoswap = 'Wigoswap',
  ZebraV2 = 'ZebraV2',
  Scribe = 'Scribe',
  Horizon = 'Horizon',
  EddyFinance = 'EddyFinance',
  MMFinance = 'MMFinance',
  VVSFlawless = 'VVSFlawless',
}

export abstract class LiquidityProvider {
  chainId: ChainId
  client: PublicClient
  lastUpdateBlock = 0
  isTest = false
  readonly ON_DEMAND_POOLS_LIFETIME_IN_SECONDS = 60
  readonly FETCH_AVAILABLE_POOLS_AFTER_SECONDS = 900

  constructor(chainId: ChainId, client: PublicClient, isTest = false) {
    this.chainId = chainId
    this.client = client
    this.isTest = isTest
  }

  abstract getType(): LiquidityProviders

  /**
   * The name of liquidity provider to be used for pool naming. For example, 'SushiSwap'
   */
  abstract getPoolProviderName(): string

  /**
   * Initiates event listeners for top pools
   */
  abstract startFetchPoolsData(): void

  /**
   * Fetches relevant pools for the given tokens
   * @param t0 Token
   * @param t1 Token
   */
  abstract fetchPoolsForToken(
    t0: Token,
    t1: Token,
    excludePools?: Set<string>,
    options?: DataFetcherOptions,
  ): Promise<void>

  /**
   * Returns a list of PoolCode
   * @param t0 Token
   * @param t1 Token
   * @returns PoolCode[]
   */
  abstract getCurrentPoolList(t0: Token, t1: Token): PoolCode[]

  abstract stopFetchPoolsData(): void

  /**
   * Returns last processed block number
   * @returns last processed block number
   */
  getLastUpdateBlock(): number {
    return this.lastUpdateBlock
  }

  /**
   * Logs a message with the following format:
   * <chainId>~<lastUpdateBlock>~<providerName>
   * Example: 1~123456~SushiSwap
   * @returns string
   */
  getLogPrefix(): string {
    return `${chainShortName[this.chainId]}/${this.chainId}~${
      this.lastUpdateBlock
    }~${this.getType()}`
  }

  getTradeId = (t0: Token, t1: Token) =>
    [t0.address.toLowerCase(), t1.address.toLowerCase()]
      .sort((first, second) => (first > second ? -1 : 1))
      .join(':')
}

export const UniV2LiquidityProviders: LiquidityProviders[] = [
  LiquidityProviders.SushiSwapV2,
  LiquidityProviders.UniswapV2,
  LiquidityProviders.QuickSwapV2,
  LiquidityProviders.ApeSwap,
  LiquidityProviders.PancakeSwapV2,
  LiquidityProviders.TraderJoe,
  LiquidityProviders.Dfyn,
  LiquidityProviders.Elk,
  LiquidityProviders.JetSwap,
  LiquidityProviders.SpookySwapV2,
  LiquidityProviders.NetSwap,
  LiquidityProviders.HoneySwap,
  LiquidityProviders.UbeSwap,
  LiquidityProviders.Biswap,
  LiquidityProviders.LaserSwap,
  LiquidityProviders.BaseSwap,
  LiquidityProviders.Solarbeam,
  LiquidityProviders.Swapsicle,
  LiquidityProviders.VVSStandard,
  LiquidityProviders.Fraxswap,
  LiquidityProviders.SwapBlast,
  LiquidityProviders.BlastDEX,
  LiquidityProviders.MonoswapV2,
  LiquidityProviders.ThrusterV2,
  LiquidityProviders.DyorV2,
  LiquidityProviders.HyperBlast,
  LiquidityProviders.KinetixV2,
  LiquidityProviders.Camelot,
  LiquidityProviders.Enosys,
  LiquidityProviders.BlazeSwap,
  LiquidityProviders.LynexV1,
  LiquidityProviders.SparkDexV2,
  LiquidityProviders.MSwap,
  LiquidityProviders.GravityFinance,
  LiquidityProviders.DackieSwapV2,
  LiquidityProviders.Pangolin,
  LiquidityProviders.AlienBaseV2,
  LiquidityProviders.RingExchangeV2,
  LiquidityProviders.BakerySwap,
  LiquidityProviders.SquadSwapV2,
  LiquidityProviders.BSCSwap,
  LiquidityProviders.Kwikswap,
  LiquidityProviders.ShibaSwap,
  LiquidityProviders.CroDefiSwap,
  LiquidityProviders.NineInch,
  LiquidityProviders.Wigoswap,
  LiquidityProviders.EddyFinance,
  LiquidityProviders.MMFinance,
]

export const UniV3LiquidityProviders: LiquidityProviders[] = [
  LiquidityProviders.SushiSwapV3,
  LiquidityProviders.UniswapV3,
  LiquidityProviders.QuickSwapV3,
  LiquidityProviders.DovishV3,
  LiquidityProviders.KinetixV3,
  LiquidityProviders.MonoswapV3,
  LiquidityProviders.ThrusterV3,
  LiquidityProviders.SpookySwapV3,
  LiquidityProviders.PancakeSwapV3,
  LiquidityProviders.Wagmi,
  LiquidityProviders.LynexV2,
  LiquidityProviders.SparkDexV3,
  LiquidityProviders.SparkDexV3_1,
  LiquidityProviders.DackieSwapV3,
  LiquidityProviders.AlienBaseV3,
  LiquidityProviders.KimV4,
  LiquidityProviders.RingExchangeV3,
  LiquidityProviders.BladeSwap,
  LiquidityProviders.Fenix,
  LiquidityProviders.COREx,
  LiquidityProviders.GlyphV4,
  LiquidityProviders.ZebraV2,
  LiquidityProviders.Scribe,
  LiquidityProviders.Horizon,
  LiquidityProviders.VVSFlawless,
]
