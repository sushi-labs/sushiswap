import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class DackieSwapV2Provider extends UniswapV2BaseProvider {
  override fee = 0.0025
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BASE]: '0x591f122D1df761E616c13d265006fcbf4c6d6551',
      [ChainId.OPTIMISM]: '0xaEdc38bD52b0380b2Af4980948925734fD54FbF4',
      [ChainId.ARBITRUM]: '0x507940c2469e6E3B33032F1d4FF8d123BDDe2f5C',
      [ChainId.BLAST]: '0xF5190E64dB4cbf7ee5E72B55cC5b2297e20264c2',
      [ChainId.LINEA]: '0x9790713770039CeFcf4FAaf076E2846c9B7a4630',
    } as const
    const initCodeHash = {
      [ChainId.BASE]:
        '0xaaaacde43ad77b69fcbcdc68ccb757c3c634ad20e330a951b4a267f1180c6520',
      [ChainId.OPTIMISM]:
        '0x6583f40d4a27d36b2f66ec686363a3fc9a3b0f4d748e788cd6e8e2773e4ee898',
      [ChainId.ARBITRUM]:
        '0x6583f40d4a27d36b2f66ec686363a3fc9a3b0f4d748e788cd6e8e2773e4ee898',
      [ChainId.BLAST]:
        '0x08b78b4ee8893b0d52edf9be019ea4e261e38b8eb1e0d7be8940645e8f95aa28',
      [ChainId.LINEA]:
        '0x6583f40d4a27d36b2f66ec686363a3fc9a3b0f4d748e788cd6e8e2773e4ee898',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.DackieSwapV2
  }
  getPoolProviderName(): string {
    return 'DackieSwapV2'
  }
}
