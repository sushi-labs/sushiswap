import { Address, PublicClient, parseAbi } from 'viem'
import { ChainId } from '../../chain/index.js'
import { DataFetcherOptions } from '../data-fetcher.js'
import { memoizer } from '../memoizer.js'
import { type PoolCode } from '../pool-codes/index.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { UniswapV2BaseProvider } from './UniswapV2Base.js'

export class CamelotProvider extends UniswapV2BaseProvider {
  // Camelot has a slightly different getReserves() abi
  // so needs to be overriden
  override getReservesAbi = parseAbi([
    'function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint16 _token0FeePercent, uint16 _token1FeePercent)',
  ])
  FEE_DENOMINATOR = 100_000n
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
    poolCodesToCreate: PoolCode[],
    options?: DataFetcherOptions,
  ): Promise<any> {
    const multicallMemoize = await memoizer.fn(this.client.multicall)

    const multicallData = {
      multicallAddress: this.client.chain?.contracts?.multicall3
        ?.address as Address,
      allowFailure: true,
      blockNumber: options?.blockNumber,
      contracts: poolCodesToCreate.map(
        (poolCode) =>
          ({
            address: poolCode.pool.address as Address,
            chainId: this.chainId,
            abi: this.getReservesAbi,
            functionName: 'getReserves',
          }) as const,
      ),
    }
    const reserves = options?.memoize
      ? await (multicallMemoize(multicallData) as Promise<any>).catch((e) => {
          console.warn(
            `${this.getLogPrefix()} - UPDATE: on-demand pools multicall failed, message: ${
              e.message
            }`,
          )
          return undefined
        })
      : await this.client.multicall(multicallData).catch((e) => {
          console.warn(
            `${this.getLogPrefix()} - UPDATE: on-demand pools multicall failed, message: ${
              e.message
            }`,
          )
          return undefined
        })

    if (reserves !== undefined && Array.isArray(reserves)) {
      reserves.forEach(
        (reserve: {
          result?: [bigint, bigint, number, number] | undefined
          status: 'failure' | 'success'
        }) => {
          if (
            reserve &&
            reserve.status === 'success' &&
            reserve.result !== undefined
          ) {
            if (reserve.result?.[0]) {
              reserve.result[0] -=
                (reserve.result[0] * BigInt(reserve.result[2])) /
                this.FEE_DENOMINATOR
            }
            if (reserve.result?.[1]) {
              reserve.result[1] -=
                (reserve.result[1] * BigInt(reserve.result[3])) /
                this.FEE_DENOMINATOR
            }
          }
        },
      )
    }
    return reserves
  }
}
