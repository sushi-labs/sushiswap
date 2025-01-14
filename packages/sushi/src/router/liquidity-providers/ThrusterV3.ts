import { Address, PublicClient } from 'viem'
import { uniswapV3FactoryAbi } from '../../abi/uniswapV3FactoryAbi.js'
import { ChainId } from '../../chain/index.js'
import { SushiSwapV3FeeAmount } from '../../config/sushiswap-v3.js'
import { RainUniswapV3BaseProvider } from '../rain/RainUniswapV3Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class ThrusterV3Provider extends RainUniswapV3BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.BLAST]: '0xa08ae3d3f4dA51C22d3c041E468bdF4C61405AaB',
    } as const
    const initCodeHash = {
      [ChainId.BLAST]:
        '0xd0c3a51b16dbc778f000c620eaabeecd33b33a80bd145e1f7cbc0d4de335193d',
    } as const
    const tickLens = {
      [ChainId.BLAST]: '0x796B39328b92472b2Bd950AEB20D950611e02EF6',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.ThrusterV3
  }
  getPoolProviderName(): string {
    return 'ThrusterV3'
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
                name: 'factory',
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
            functionName: 'factory',
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
        this.TICK_SPACINGS[feeList[i] as SushiSwapV3FeeAmount] === v || v === 0,
    )
  }
}
