import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { AlgebraV1BaseProvider } from './AlgebraV1Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class LynexV2Provider extends AlgebraV1BaseProvider {
  override DEFAULT_TICK_SPACING = 1
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.LINEA]: '0x622b2c98123D303ae067DB4925CD6282B3A08D0F',
    } as const
    const poolDeployer = {
      [ChainId.LINEA]: '0x9A89490F1056A7BC607EC53F93b921fE666A2C48',
    } as const
    const initCodeHash = {
      [ChainId.LINEA]:
        '0xc65e01e65f37c1ec2735556a24a9c10e4c33b2613ad486dd8209d465524bc3f4',
    } as const
    const tickLens = {
      [ChainId.LINEA]: '0x23406481b28cb7C1914C460b8B96cE4b2580BCB9',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens, poolDeployer)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.LynexV2
  }
  getPoolProviderName(): string {
    return 'LynexV2'
  }
}
