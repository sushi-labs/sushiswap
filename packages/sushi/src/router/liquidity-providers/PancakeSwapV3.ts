import { Address, PublicClient, parseAbiItem } from 'viem'
import { uniswapV3FactoryAbi } from '../../abi/uniswapV3FactoryAbi.js'
import { ChainId } from '../../chain/index.js'
import {
  PANCAKESWAP_V3_FEE_SPACING_MAP,
  PancakeSwapV3FeeAmount,
} from '../../config/index.js'
import { UniV3EventsAbi, UniswapV3BaseProvider } from '../rain/UniswapV3Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export const PancakeV3EventsAbi = [
  ...UniV3EventsAbi.slice(1), // univ3 events except Swap
  parseAbiItem(
    // PancakeV3 specific Swap event
    'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick, uint128 protocolFeesToken0, uint128 protocolFeesToken1)',
  ),
]

export class PancakeSwapV3Provider extends UniswapV3BaseProvider {
  override FEE = PancakeSwapV3FeeAmount
  override TICK_SPACINGS = PANCAKESWAP_V3_FEE_SPACING_MAP
  override eventsAbi = PancakeV3EventsAbi as any

  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.ARBITRUM]: '0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9',
      [ChainId.BASE]: '0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9',
      [ChainId.BSC]: '0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9',
      [ChainId.ETHEREUM]: '0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9',
      [ChainId.LINEA]: '0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9',
      [ChainId.POLYGON_ZKEVM]: '0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9',
      [ChainId.ZKSYNC_ERA]: '0x7f71382044A6a62595D5D357fE75CA8199123aD6',
    } as const
    const initCodeHash = {
      [ChainId.ARBITRUM]:
        '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
      [ChainId.BASE]:
        '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
      [ChainId.BSC]:
        '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
      [ChainId.ETHEREUM]:
        '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
      [ChainId.LINEA]:
        '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
      [ChainId.POLYGON_ZKEVM]:
        '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
      [ChainId.ZKSYNC_ERA]:
        '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
    } as const
    const tickLens = {
      [ChainId.ARBITRUM]: '0x9a489505a00cE272eAa5e07Dba6491314CaE3796',
      [ChainId.BASE]: '0x9a489505a00cE272eAa5e07Dba6491314CaE3796',
      [ChainId.BSC]: '0x9a489505a00cE272eAa5e07Dba6491314CaE3796',
      [ChainId.ETHEREUM]: '0x9a489505a00cE272eAa5e07Dba6491314CaE3796',
      [ChainId.LINEA]: '0x9a489505a00cE272eAa5e07Dba6491314CaE3796',
      [ChainId.POLYGON_ZKEVM]: '0x9a489505a00cE272eAa5e07Dba6491314CaE3796',
      [ChainId.ZKSYNC_ERA]: '0x7b08978FA77910f77d273c353C62b5BFB9E6D17B',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.PancakeSwapV3
  }
  getPoolProviderName(): string {
    return 'PancakeSwapV3'
  }
  override async ensureFeeAndTicks(): Promise<boolean> {
    const feeList = [
      this.FEE.LOWEST,
      this.FEE.LOW,
      this.FEE.MEDIUM,
      this.FEE.HIGH,
    ] as number[]
    const factoryAddress = (
      await this.client.multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3
          ?.address as Address,
        allowFailure: false,
        contracts: [
          {
            address: this.factory[this.chainId as keyof typeof this.factory]!,
            abi: [
              {
                inputs: [],
                name: 'factoryAddress',
                outputs: [
                  {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                  },
                ],
                stateMutability: 'view',
                type: 'function',
              },
            ],
            functionName: 'factoryAddress',
          } as const,
        ],
      })
    )[0]

    const results = (await this.client.multicall({
      multicallAddress: this.client.chain?.contracts?.multicall3
        ?.address as Address,
      allowFailure: false,
      contracts: feeList.map(
        (fee) =>
          ({
            chainId: this.chainId,
            address: factoryAddress as Address,
            abi: uniswapV3FactoryAbi,
            functionName: 'feeAmountTickSpacing',
            args: [fee],
          }) as const,
      ),
    })) as number[]

    // fetched fee map to ticks should match correctly with hardcoded literals in the dex
    return results.every(
      (v, i) =>
        this.TICK_SPACINGS[feeList[i] as PancakeSwapV3FeeAmount] === v ||
        v === 0,
    )
  }
}
