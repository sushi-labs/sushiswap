import { Address, PublicClient, parseAbi } from 'viem'
import { ChainId } from '../../chain/index.js'
import { DataFetcherOptions } from '../data-fetcher.js'
import { type PoolCode } from '../pool-codes/index.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { UniswapV2BaseProvider } from './UniswapV2Base.js'

type IsStableSwap =
  | (
      | boolean
      | {
          error?: undefined
          result: boolean
          status: 'success'
        }
      | {
          error: Error
          result?: undefined
          status: 'failure'
        }
    )[]
  | undefined

export class CamelotProvider extends UniswapV2BaseProvider {
  // Camelot has a slightly different getReserves() abi
  // so needs to be overriden
  override getReservesAbi = parseAbi([
    'function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint16 _token0FeePercent, uint16 _token1FeePercent)',
  ])
  FEE_DENOMINATOR = 100_000n
  FEE_INFO: [bigint, `0x${string}`] | undefined = undefined
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

  override async getReserves(
    poolCodesToCreate: Address[],
    options?: DataFetcherOptions,
  ): Promise<any> {
    if (!this.FEE_INFO) {
      try {
        this.FEE_INFO = (await this.client.readContract({
          address: this.factory[
            this.chainId as keyof typeof this.factory
          ]! as `0x${string}`,
          abi: [
            {
              constant: true,
              inputs: [],
              name: 'feeInfo',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '_ownerFeeShare',
                  type: 'uint256',
                },
                { internalType: 'address', name: '_feeTo', type: 'address' },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
          ] as const,
          functionName: 'feeInfo',
        })) as any
      } catch (_error) {
        /**/
      }
    }

    const getReservesData = {
      multicallAddress: this.client.chain?.contracts?.multicall3
        ?.address as Address,
      allowFailure: true,
      blockNumber: options?.blockNumber,
      contracts: poolCodesToCreate.map(
        (address) =>
          ({
            address,
            chainId: this.chainId,
            abi: this.getReservesAbi,
            functionName: 'getReserves',
          }) as const,
      ),
    } as const
    const reserves = await this.client.multicall(getReservesData).catch((e) => {
      console.warn(
        `${this.getLogPrefix()} - UPDATE: on-demand pools multicall failed, message: ${
          e.message
        }`,
      )
      return undefined
    })

    const stableSwapData = {
      multicallAddress: this.client.chain?.contracts?.multicall3
        ?.address as Address,
      allowFailure: true,
      blockNumber: options?.blockNumber,
      contracts: poolCodesToCreate.map(
        (address) =>
          ({
            address,
            chainId: this.chainId,
            abi: [
              {
                constant: true,
                inputs: [],
                name: 'stableSwap',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
                payable: false,
              },
            ] as const,
            functionName: 'stableSwap',
          }) as const,
      ),
    } as const
    const stableSwap: IsStableSwap = await this.client
      .multicall(stableSwapData)
      .catch((e) => {
        console.warn(
          `${this.getLogPrefix()} - UPDATE: on-demand pools multicall failed, message: ${
            e.message
          }`,
        )
        return undefined
      })

    return [reserves, stableSwap]
  }

  override handleCreatePoolCode(
    poolCodesToCreate: PoolCode[],
    contractData: [any[], IsStableSwap],
    validUntilTimestamp: number,
  ) {
    const [reserves, stableSwaps] = contractData
    poolCodesToCreate.forEach((poolCode, i) => {
      const thisStableSwap = stableSwaps?.[i]
      const isStableSwap =
        typeof thisStableSwap === 'boolean'
          ? thisStableSwap
          : thisStableSwap?.status === 'success'
            ? thisStableSwap?.result
            : undefined
      const pool = poolCode.pool
      const res0 = reserves?.[i]?.result?.[0]
      const res1 = reserves?.[i]?.result?.[1]

      if (res0 !== undefined && res1 !== undefined) {
        if (isStableSwap && this.FEE_INFO && pool.fee) {
          try {
            ;(pool.fee as any) +=
              (Number(this.FEE_INFO[0]) / Number(this.FEE_DENOMINATOR)) *
              pool.fee
          } catch {}
        }
        pool.updateReserves(res0, res1)
        this.onDemandPools.set(pool.address, { poolCode, validUntilTimestamp })
      } else {
        // Pool doesn't exist?
      }
    })
  }
}
