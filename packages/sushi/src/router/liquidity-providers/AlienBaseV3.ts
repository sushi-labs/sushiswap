import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { UniswapV3BaseProvider } from './UniswapV3Base.js'

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum AlienBaseV3FeeAmount {
  /** 0.02% */
  LOWEST = 200,
  /** 0.075% */
  LOW = 750,
  /** 0.3% */
  MEDIUM = 3000,
  /** 1% */
  HIGH = 10000,
}

export const ALIENBASE_V3_FEE_SPACING_MAP: Record<
  AlienBaseV3FeeAmount,
  number
> = {
  [AlienBaseV3FeeAmount.LOWEST]: 4,
  [AlienBaseV3FeeAmount.LOW]: 15,
  [AlienBaseV3FeeAmount.MEDIUM]: 60,
  [AlienBaseV3FeeAmount.HIGH]: 200,
}

export class AlienBaseV3Provider extends UniswapV3BaseProvider {
  override FEE = AlienBaseV3FeeAmount
  override TICK_SPACINGS = ALIENBASE_V3_FEE_SPACING_MAP
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BASE]: '0x0Fd83557b2be93617c9C1C1B6fd549401C74558C',
    } as const
    const initCodeHash = {
      [ChainId.BASE]:
        '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
    } as const
    const tickLens = {
      [ChainId.BASE]: '0xe3B6A547495c84A039D70A81178496220B5Fbd8e',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.AlienBaseV3
  }
  getPoolProviderName(): string {
    return 'AlienBaseV3'
  }
}
