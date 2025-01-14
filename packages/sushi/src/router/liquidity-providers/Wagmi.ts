import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { RainUniswapV3BaseProvider } from '../rain/RainUniswapV3Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

enum WagmiFeeAmount {
  /** 0.01% */
  LOWEST = 500,
  /** 0.15% */
  LOW = 1500,
  /** 0.3% */
  MEDIUM = 3000,
  /** 1% */
  HIGH = 10000,
}

const WagmiTickSpacing: Record<WagmiFeeAmount, number> = {
  [WagmiFeeAmount.LOWEST]: 10,
  [WagmiFeeAmount.LOW]: 30,
  [WagmiFeeAmount.MEDIUM]: 60,
  [WagmiFeeAmount.HIGH]: 200,
}

export class WagmiProvider extends RainUniswapV3BaseProvider {
  override FEE = WagmiFeeAmount
  override TICK_SPACINGS = WagmiTickSpacing
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.ETHEREUM]: '0xB9a14EE1cd3417f3AcC988F61650895151abde24',
      [ChainId.FANTOM]: '0xaf20f5f19698f1D19351028cd7103B63D30DE7d7',
      [ChainId.KAVA]: '0x0e0Ce4D450c705F8a0B6Dd9d5123e3df2787D16B',
      [ChainId.ZKSYNC_ERA]: '0x31be61CE896e8770B21e7A1CAFA28402Dd701995',
      [ChainId.METIS]: '0x8112E18a34b63964388a3B2984037d6a2EFE5B8A',
    } as const
    const initCodeHash = {
      [ChainId.ETHEREUM]:
        '0x30146866f3a846fe3c636beb2756dbd24cf321bc52c9113c837c21f47470dfeb',
      [ChainId.FANTOM]:
        '0x30146866f3a846fe3c636beb2756dbd24cf321bc52c9113c837c21f47470dfeb',
      [ChainId.KAVA]:
        '0x30146866f3a846fe3c636beb2756dbd24cf321bc52c9113c837c21f47470dfeb',
      [ChainId.ZKSYNC_ERA]:
        '0x30146866f3a846fe3c636beb2756dbd24cf321bc52c9113c837c21f47470dfeb',
      [ChainId.METIS]:
        '0x30146866f3a846fe3c636beb2756dbd24cf321bc52c9113c837c21f47470dfeb',
    } as const
    const tickLens = {
      [ChainId.ETHEREUM]: '0xb1F795776cB9DdAC6E7e162f31C7419Dd3d48297',
      [ChainId.FANTOM]: '0x209050d81Aad536Ca2092466B221013B8de7AC6c',
      [ChainId.KAVA]: '0xf914e1329e4588783Ee68f06B2b900adDC97f966',
      [ChainId.ZKSYNC_ERA]: '0x09Cbf436DE2273dAC3f0971fB905aCBe41b1CC81',
      [ChainId.METIS]: '0x428065998a96F82bf66A0A427A157429A6Fdd649',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.Wagmi
  }
  getPoolProviderName(): string {
    return 'Wagmi'
  }
}
