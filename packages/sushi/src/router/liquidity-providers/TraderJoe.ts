import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { RainUniswapV2BaseProvider } from '../rain/RainUniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class TraderJoeProvider extends RainUniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.AVALANCHE]: '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10',
      [ChainId.ARBITRUM]: '0xaE4EC9901c3076D0DdBe76A520F9E90a6227aCB7',
      [ChainId.BSC]: '0x4f8bdc85E3eec5b9dE67097c3f59B6Db025d9986',
    } as const
    const initCodeHash = {
      [ChainId.AVALANCHE]:
        '0x0bbca9af0511ad1a1da383135cf3a8d2ac620e549ef9f6ae3a4c33c2fed0af91',
      [ChainId.ARBITRUM]:
        '0x5c9d12e487d245c53fb0b8dd1ba2ccc48810e6b9671311502b8632e88b0d605b',
      [ChainId.BSC]:
        '0x75e986a1d8c57bd5530b4b59ab7dd63c4d4ad267f147e17774264956de33c282',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.TraderJoe
  }
  getPoolProviderName(): string {
    return 'TraderJoe'
  }
}
