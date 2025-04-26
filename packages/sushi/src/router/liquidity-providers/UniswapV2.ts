import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { UniswapV2BaseProvider } from '../rain/UniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class UniswapV2Provider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.ETHEREUM]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
      [ChainId.ARBITRUM]: '0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9',
      [ChainId.AVALANCHE]: '0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C',
      [ChainId.BSC]: '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6',
      [ChainId.OPTIMISM]: '0x0c3c1c532F1e39EdF36BE9Fe0bE1410313E074Bf',
      [ChainId.POLYGON]: '0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C',
      [ChainId.BLAST]: '0x5C346464d33F90bABaf70dB6388507CC889C1070',
      [ChainId.BASE]: '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6',
    } as const
    const initCodeHash = {
      [ChainId.ETHEREUM]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
      [ChainId.ARBITRUM]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
      [ChainId.AVALANCHE]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
      [ChainId.BSC]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
      [ChainId.OPTIMISM]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
      [ChainId.POLYGON]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
      [ChainId.BLAST]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
      [ChainId.BASE]:
        '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.UniswapV2
  }
  getPoolProviderName(): string {
    return 'UniswapV2'
  }
}
