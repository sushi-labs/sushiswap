import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { UniswapV3BaseProvider } from './UniswapV3Base.js'

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum ZebraV2FeeAmount {
  /** 0.05% */
  LOW = 500,
  /** 0.3% */
  MEDIUM = 3000,
  /** 1% */
  HIGH = 10000,
}

export const ZEBRA_V2_FEE_SPACING_MAP: Record<ZebraV2FeeAmount, number> = {
  [ZebraV2FeeAmount.LOW]: 10,
  [ZebraV2FeeAmount.MEDIUM]: 60,
  [ZebraV2FeeAmount.HIGH]: 200,
}

export class ZebraV2Provider extends UniswapV3BaseProvider {
  override FEE = ZebraV2FeeAmount as any
  override TICK_SPACINGS = ZEBRA_V2_FEE_SPACING_MAP
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.SCROLL]: '0x96a7F53f7636c93735bf85dE416A4Ace94B56Bd9',
    } as const
    const initCodeHash = {
      [ChainId.SCROLL]:
        '0xcf0b3414328c2bd327a4f093539d0d7d82fb94f893a2965c75cb470289cb5ac7',
    } as const
    const tickLens = {
      [ChainId.SCROLL]: '0x1Daef3F1D97CcD9ae428641B23733cF1C619AeAA',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.ZebraV2
  }
  getPoolProviderName(): string {
    return 'ZebraV2'
  }
}
