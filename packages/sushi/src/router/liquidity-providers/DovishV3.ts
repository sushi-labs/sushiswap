import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { RainUniswapV3BaseProvider } from '../rain/RainUniswapV3Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class DovishV3Provider extends RainUniswapV3BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.POLYGON_ZKEVM]: '0xdE474Db1Fa59898BC91314328D29507AcD0D593c',
    } as const
    const initCodeHash = {
      [ChainId.POLYGON_ZKEVM]:
        '0xd3e7f58b9af034cfa7a0597e539bae7c6b393817a47a6fc1e1503cd6eaffe22a',
    } as const
    const tickLens = {
      [ChainId.POLYGON_ZKEVM]: '0x0e88C06437891D2a56352eaa2bf0d107472eC0f4',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.DovishV3
  }
  getPoolProviderName(): string {
    return 'DovishV3'
  }
}
