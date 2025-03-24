import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { UniswapV3BaseProvider } from './UniswapV3Base.js'

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum NileV3FeeAmount {
  /** 0.01% */
  LOWEST = 100,
  /** 0.025% */
  LOWER = 250,
  /** 0.05% */
  LOW = 500,
  /** 0.3% */
  LOWMID = 3000,
  /** 0.5% */
  MEDIUM = 5000,
  /** 0.75% */
  HIGHMID = 7500,
  /** 1% */
  HIGH = 10000,
  /** 2% */
  HIGHEST = 20000,
}

/**
 * The default factory tick spacings by fee amount.
 */
export const NILE_V3_FEE_SPACING_MAP: Record<NileV3FeeAmount, number> = {
  [NileV3FeeAmount.LOWEST]: 1,
  [NileV3FeeAmount.LOWER]: 5,
  [NileV3FeeAmount.LOW]: 10,
  [NileV3FeeAmount.LOWMID]: 60,
  [NileV3FeeAmount.MEDIUM]: 25,
  [NileV3FeeAmount.HIGHMID]: 50,
  [NileV3FeeAmount.HIGH]: 200,
  [NileV3FeeAmount.HIGHEST]: 500,
}

export class NileV3Provider extends UniswapV3BaseProvider {
  override FEE = NileV3FeeAmount
  override TICK_SPACINGS = NILE_V3_FEE_SPACING_MAP
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.LINEA]: '0xAAA32926fcE6bE95ea2c51cB4Fcb60836D320C42',
    } as const
    const initCodeHash = {
      [ChainId.LINEA]:
        '0x1565b129f2d1790f12d45301b9b084335626f0c92410bc43130763b69971135d',
    } as const
    const tickLens = {
      [ChainId.LINEA]: '0xAAAD7F8b00B5ce6F8516AC595f0Bb175Ae755c63',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.NileV3
  }
  getPoolProviderName(): string {
    return 'NileV3'
  }
}
