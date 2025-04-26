import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV3BaseProvider } from '../rain/UniswapV3Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum BaseSwapV3FeeAmount {
  /** 0.008% */
  LOWEST = 80,
  /** 0.035% */
  LOW = 350,
  /** 0.045% */
  MEDIUM = 450,
  /** 0.25% */
  HIGH = 2500,
  /** 1% */
  HIGHEST = 10000,
}

export const BASESWAP_V3_FEE_SPACING_MAP: Record<BaseSwapV3FeeAmount, number> =
  {
    [BaseSwapV3FeeAmount.LOWEST]: 1,
    [BaseSwapV3FeeAmount.LOW]: 10,
    [BaseSwapV3FeeAmount.MEDIUM]: 10,
    [BaseSwapV3FeeAmount.HIGH]: 60,
    [BaseSwapV3FeeAmount.HIGHEST]: 200,
  }

export class BaseSwapV3Provider extends UniswapV3BaseProvider {
  override FEE = BaseSwapV3FeeAmount
  override TICK_SPACINGS = BASESWAP_V3_FEE_SPACING_MAP
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BASE]: '0x38015D05f4fEC8AFe15D7cc0386a126574e8077B',
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
    return LiquidityProviders.BaseSwapV3
  }
  getPoolProviderName(): string {
    return 'BaseSwapV3'
  }
}
