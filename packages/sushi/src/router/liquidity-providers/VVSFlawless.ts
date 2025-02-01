import { Address, PublicClient } from 'viem'
import { uniswapV3FactoryAbi } from '../../abi/uniswapV3FactoryAbi.js'
import { ChainId } from '../../chain/index.js'
import { SushiSwapV3FeeAmount } from '../../config/sushiswap-v3.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { UniswapV3BaseProvider } from './UniswapV3Base.js'

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum VVSFlawlessFeeAmount {
  /** 0.01% */
  LOWEST = 100,
  /** 0.05% */
  LOW = 500,
  /** 0.3% */
  MEDIUM = 3000,
  /** 1% */
  HIGH = 10000,
}

export const VVS_FLAWLESS_FEE_SPACING_MAP: Record<
  VVSFlawlessFeeAmount,
  number
> = {
  [VVSFlawlessFeeAmount.LOWEST]: 1,
  [VVSFlawlessFeeAmount.LOW]: 10,
  [VVSFlawlessFeeAmount.MEDIUM]: 60,
  [VVSFlawlessFeeAmount.HIGH]: 200,
}

export class VVSFlawlessProvider extends UniswapV3BaseProvider {
  override FEE = VVSFlawlessFeeAmount
  override TICK_SPACINGS = VVS_FLAWLESS_FEE_SPACING_MAP
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.CRONOS]: '0x6757E8E1B694e60285D733D8684eF2F60b2407ff',
    } as const
    const initCodeHash = {
      [ChainId.CRONOS]:
        '0x3ea5f55d6524ce396b6eb0054ae36a854425f2ed4c48b04b78e228656dc0b7de',
    } as const
    const tickLens = {
      [ChainId.CRONOS]: '0xFe2b370F14Efe064Ae6ef17f44EB3F72594F2939',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.VVSFlawless
  }
  getPoolProviderName(): string {
    return 'VVSFlawless'
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
