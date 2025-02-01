import { Address, PublicClient } from 'viem'
import { uniswapV3FactoryAbi } from '../../abi/uniswapV3FactoryAbi.js'
import { ChainId } from '../../chain/index.js'
import {
  PANCAKESWAP_V3_FEE_SPACING_MAP,
  PancakeSwapV3FeeAmount,
} from '../../config/index.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { UniswapV3BaseProvider } from './UniswapV3Base.js'

export class DackieSwapV3Provider extends UniswapV3BaseProvider {
  override FEE = PancakeSwapV3FeeAmount
  override TICK_SPACINGS = PANCAKESWAP_V3_FEE_SPACING_MAP
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BASE]: '0x4f205D69834f9B101b9289F7AFFAc9B77B3fF9b7',
      [ChainId.OPTIMISM]: '0xa466ebCfa58848Feb6D8022081f1C21a884889bB',
      [ChainId.ARBITRUM]: '0xf79A36F6f440392C63AD61252a64d5d3C43F860D',
      [ChainId.BLAST]: '0x6510E68561F04C1d111e616750DaC2a063FF5055',
      [ChainId.LINEA]: '0x46B22CD275967DDf055A567E7f36EC89eE3F1139',
    } as const
    const initCodeHash = {
      [ChainId.BASE]:
        '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
      [ChainId.OPTIMISM]:
        '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
      [ChainId.ARBITRUM]:
        '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
      [ChainId.BLAST]:
        '0x9173e4373ab542649f2f059b10eaab2181ad82cc2e70cf51cf9d9fa8a144a2af',
      [ChainId.LINEA]:
        '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
    } as const
    const tickLens = {
      [ChainId.BASE]: '0x9a489505a00cE272eAa5e07Dba6491314CaE3796',
      [ChainId.OPTIMISM]: '0x0367a647A68f304f2A6e453c25033a4249d7F2C6',
      [ChainId.ARBITRUM]: '0x9a489505a00cE272eAa5e07Dba6491314CaE3796',
      [ChainId.BLAST]: '0x039e87AB90205F9d87c5b40d4B28e2Be45dA4a20',
      [ChainId.LINEA]: '0x9a489505a00cE272eAa5e07Dba6491314CaE3796',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.DackieSwapV3
  }
  getPoolProviderName(): string {
    return 'DackieSwapV3'
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
