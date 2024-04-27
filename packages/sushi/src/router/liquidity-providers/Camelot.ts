import { PublicClient, parseAbi } from 'viem'
import { ChainId } from '../../chain/index.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { UniswapV2BaseProvider } from './UniswapV2Base.js'

export class CamelotProvider extends UniswapV2BaseProvider {
  // Camelot has a slightly different getReserves() abi
  // so needs to be overriden
  override getReservesAbi = parseAbi([
    'function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint16 _token0FeePercent, uint16 _token1FeePercent)',
  ])
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.ARBITRUM]: '0x6EcCab422D763aC031210895C81787E87B43A652',
    } as const
    const initCodeHash = {
      [ChainId.ARBITRUM]:
        '0xa856464ae65f7619087bc369daaf7e387dae1e5af69cfa7935850ebf754b04c1',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.Camelot
  }
  getPoolProviderName(): string {
    return 'Camelot'
  }
}
