import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class DfynProvider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.POLYGON]: '0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B',
      [ChainId.FANTOM]: '0xd9820a17053d6314B20642E465a84Bf01a3D64f5',
      [ChainId.OKEX]: '0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B',
      [ChainId.ARBITRUM]: '0xA102072A4C07F06EC3B4900FDC4C7B80b6c57429',
    } as const
    const initCodeHash = {
      [ChainId.POLYGON]:
        '0xf187ed688403aa4f7acfada758d8d53698753b998a3071b06f1b777f4330eaf3',
      [ChainId.FANTOM]:
        '0xd3ab2c392f54feb4b3b2a677f449b133c188ad2f1015eff3e94ea9315282c5f5',
      [ChainId.OKEX]:
        '0xd9fecb0a9f5bfd6ce2daf90b441ed5860c3fed2fcde57ba9819eb98d2422e418',
      [ChainId.ARBITRUM]:
        '0xd49917af2b31d70ba7bea89230a93b55d3b6a99aacd03a72c288dfe524ec2f36',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.Dfyn
  }
  getPoolProviderName(): string {
    return 'Dfyn'
  }
}
