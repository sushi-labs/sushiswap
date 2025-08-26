import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV3BaseProvider } from '../rain/UniswapV3Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum KodiakV3FeeAmount {
  /** 0.01% */
  LOWEST = 100,
  /** 0.05% */
  LOW = 500,
  /** 0.3% */
  MEDIUM = 3000,
  /** 1% */
  HIGH = 10000,
  /** 2% */
  HIGHEST = 20000,
}

/**
 * The default factory tick spacings by fee amount.
 */
export const KODIAK_V3_FEE_SPACING_MAP: Record<KodiakV3FeeAmount, number> = {
  [KodiakV3FeeAmount.LOWEST]: 1,
  [KodiakV3FeeAmount.LOW]: 10,
  [KodiakV3FeeAmount.MEDIUM]: 60,
  [KodiakV3FeeAmount.HIGH]: 200,
  [KodiakV3FeeAmount.HIGHEST]: 400,
}

export class KodiakV3Provider extends UniswapV3BaseProvider {
  override FEE = KodiakV3FeeAmount
  override TICK_SPACINGS = KODIAK_V3_FEE_SPACING_MAP
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BERA]: '0xD84CBf0B02636E7f53dB9E5e45A616E05d710990',
    } as const
    const initCodeHash = {
      [ChainId.BERA]:
        '0xd8e2091bc519b509176fc39aeb148cc8444418d3ce260820edc44e806c2c2339',
    } as const
    const tickLens = {
      [ChainId.BERA]: '0xa73C6F1FeC76D5487dC30bdB8f11d1F390394b48',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.KodiakV3
  }
  getPoolProviderName(): string {
    return 'KodiakV3'
  }
}
