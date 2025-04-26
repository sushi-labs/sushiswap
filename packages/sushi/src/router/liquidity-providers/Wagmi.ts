import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV3BaseProvider } from '../rain/UniswapV3Base.js'
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

export class WagmiProvider extends UniswapV3BaseProvider {
  override FEE = WagmiFeeAmount
  override TICK_SPACINGS = WagmiTickSpacing
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.ETHEREUM]: '0xB9a14EE1cd3417f3AcC988F61650895151abde24',
      [ChainId.FANTOM]: '0xaf20f5f19698f1D19351028cd7103B63D30DE7d7',
      [ChainId.KAVA]: '0x0e0Ce4D450c705F8a0B6Dd9d5123e3df2787D16B',
      [ChainId.ZKSYNC_ERA]: '0x31be61CE896e8770B21e7A1CAFA28402Dd701995',
      [ChainId.METIS]: '0x8112E18a34b63964388a3B2984037d6a2EFE5B8A',
      [ChainId.BASE]: '0x576A1301B42942537d38FB147895fE83fB418fD4',

      // these chains dont have any pools deployed yet
      // [ChainId.OPTIMISM]: '0xC49c177736107fD8351ed6564136B9ADbE5B1eC3',
      // [ChainId.BSC]: '0xE3Dc1A5a7aB81F1cC1895FA55034725c24a5BD0e',
      // [ChainId.POLYGON]: '0x8bb1Be7acD806BF6C9766486dC4c21284a472BaC',
      // [ChainId.AVALANCHE]: '0x08d6E1aE0f91423dDBD16f083ca39ccDd1D79cE8',
      // [ChainId.ARBITRUM]: '0x7301350CC76D669ea384e77aF38a70C61661CA48',
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
      [ChainId.BASE]:
        '0x30146866f3a846fe3c636beb2756dbd24cf321bc52c9113c837c21f47470dfeb',

      // [ChainId.OPTIMISM]: '0x30146866f3a846fe3c636beb2756dbd24cf321bc52c9113c837c21f47470dfeb',
      // [ChainId.BSC]: '0x30146866f3a846fe3c636beb2756dbd24cf321bc52c9113c837c21f47470dfeb',
      // [ChainId.POLYGON]: '0x30146866f3a846fe3c636beb2756dbd24cf321bc52c9113c837c21f47470dfeb',
      // [ChainId.AVALANCHE]: '0x30146866f3a846fe3c636beb2756dbd24cf321bc52c9113c837c21f47470dfeb',
      // [ChainId.ARBITRUM]: '0x30146866f3a846fe3c636beb2756dbd24cf321bc52c9113c837c21f47470dfeb',
    } as const
    const tickLens = {
      [ChainId.ETHEREUM]: '0xb1F795776cB9DdAC6E7e162f31C7419Dd3d48297',
      [ChainId.FANTOM]: '0x209050d81Aad536Ca2092466B221013B8de7AC6c',
      [ChainId.KAVA]: '0xf914e1329e4588783Ee68f06B2b900adDC97f966',
      [ChainId.ZKSYNC_ERA]: '0x09Cbf436DE2273dAC3f0971fB905aCBe41b1CC81',
      [ChainId.METIS]: '0x428065998a96F82bf66A0A427A157429A6Fdd649',
      [ChainId.BASE]: '0x2Dc123Ff6757fcEa46c025758E93bd8b98710cEA',

      // [ChainId.OPTIMISM]: '0xE1609682d9fA627301125C402078A8074151886d',
      // [ChainId.BSC]: '0x67241f1a9471B366039bdBbc1810061A7312298f',
      // [ChainId.POLYGON]: '0xA6D200ED01389b49E21D8A0018d5b81528bcFC0D',
      // [ChainId.AVALANCHE]: '0x66034b71A749E655feE0005C5496D5c0949590F0',
      // [ChainId.ARBITRUM]: '0x08d6E1aE0f91423dDBD16f083ca39ccDd1D79cE8',
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
