import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { RainUniswapV3BaseProvider } from '../rain/RainUniswapV3Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class UniswapV3Provider extends RainUniswapV3BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.ETHEREUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      [ChainId.POLYGON]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      [ChainId.ARBITRUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      [ChainId.OPTIMISM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      [ChainId.BSC]: '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7',
      [ChainId.BASE]: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
    } as const
    const initCodeHash = {
      [ChainId.ETHEREUM]:
        '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
      [ChainId.POLYGON]:
        '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
      [ChainId.ARBITRUM]:
        '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
      [ChainId.OPTIMISM]:
        '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
      [ChainId.BSC]:
        '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
      [ChainId.BASE]:
        '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
    } as const
    const tickLens = {
      [ChainId.ETHEREUM]: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573',
      [ChainId.POLYGON]: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573',
      [ChainId.ARBITRUM]: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573',
      [ChainId.OPTIMISM]: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573',
      [ChainId.BSC]: '0xD9270014D396281579760619CCf4c3af0501A47C',
      [ChainId.BASE]: '0x0CdeE061c75D43c82520eD998C23ac2991c9ac6d',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.UniswapV3
  }
  getPoolProviderName(): string {
    return 'UniswapV3'
  }
}
