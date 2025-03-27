import { getCreate2Address } from '@ethersproject/address'
import { Address, PublicClient, encodePacked, keccak256 } from 'viem'
import { ChainId } from '../../chain/index.js'
import { Token } from '../../currency/Token.js'
import { ConstantProductRPool } from '../../tines/PrimaryPools.js'
import { RToken } from '../../tines/RPool.js'
import { DataFetcherOptions } from '../data-fetcher.js'
import { getCurrencyCombinations } from '../get-currency-combinations.js'
import { ConstantProductPoolCode } from '../pool-codes/ConstantProductPool.js'
import { PoolCode } from '../pool-codes/PoolCode.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { StaticPool, UniswapV2BaseProvider } from './UniswapV2Base.js'

export class NileV2Provider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.LINEA]: '0xAAA16c016BF556fcD620328f0759252E29b1AB57',
    } as const
    const initCodeHash = {
      [ChainId.LINEA]:
        '0xbf2404274de2b11f05e5aebd49e508de933034cb5fa2d0ac3de8cbd4bcef47dc',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.NileV2
  }
  getPoolProviderName(): string {
    return 'NileV2'
  }

  override async getOnDemandPools(
    t0: Token,
    t1: Token,
    excludePools?: Set<string>,
    options?: DataFetcherOptions,
  ): Promise<void> {
    let pools = this.getStaticPools(t0, t1)
    if (excludePools) pools = pools.filter((p) => !excludePools.has(p.address))

    if (pools.length === 0) {
      return
    }

    this.poolsByTrade.set(
      this.getTradeId(t0, t1),
      pools.map((pool) => pool.address),
    )

    const fees = await this.client
      .multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3
          ?.address as Address,
        allowFailure: true,
        blockNumber: options?.blockNumber,
        contracts: pools.map(
          (poolCode) =>
            ({
              address: this.factory[this.chainId as keyof typeof this.factory]!,
              chainId: this.chainId,
              abi: [
                {
                  inputs: [
                    { internalType: 'address', name: '_pool', type: 'address' },
                  ],
                  name: 'pairFee',
                  outputs: [
                    { internalType: 'uint256', name: 'fee', type: 'uint256' },
                  ],
                  stateMutability: 'view',
                  type: 'function',
                },
              ],
              functionName: 'pairFee',
              args: [poolCode.address],
            }) as const,
        ),
      })
      .catch((e) => {
        console.warn(
          `${this.getLogPrefix()} - UPDATE: on-demand pools multicall failed, message: ${
            e.message
          }`,
        )
        return undefined
      })

    const poolCodesToCreate: PoolCode[] = []
    pools.forEach((pool, i) => {
      const fee = fees?.[i]?.result
      const existingPool = this.onDemandPools.get(pool.address)
      if (existingPool === undefined) {
        if (fee === undefined) {
          return
        }
        const token0 = pool.token0 as RToken
        const token1 = pool.token1 as RToken

        const rPool = new ConstantProductRPool(
          pool.address,
          token0,
          token1,
          Number(fee) * 0.0001,
          0n,
          0n,
        )
        const pc = new ConstantProductPoolCode(
          rPool,
          this.getType(),
          this.getPoolProviderName(),
        )
        poolCodesToCreate.push(pc)
      }
    })

    const reserves = await this.getReserves(poolCodesToCreate, options)
    this.handleCreatePoolCode(poolCodesToCreate, reserves, 0)
  }

  override getStaticPools(t1: Token, t2: Token): StaticPool[] {
    const currencyCombination = getCurrencyCombinations(
      this.chainId,
      t1,
      t2,
    ).map(([c0, c1]) => (c0.sortsBefore(c1) ? [c0, c1] : [c1, c0]))
    return currencyCombination.flatMap((combination) => [
      {
        address: this.computePoolAddress(
          combination[0]!,
          combination[1]!,
          true,
        ),
        token0: combination[0]!,
        token1: combination[1]!,
        fee: 0,
      },
      {
        address: this.computePoolAddress(
          combination[0]!,
          combination[1]!,
          false,
        ),
        token0: combination[0]!,
        token1: combination[1]!,
        fee: 0,
      },
    ])
  }

  computePoolAddress(t1: Token, t2: Token, stable: boolean): Address {
    return getCreate2Address(
      this.factory[this.chainId as keyof typeof this.factory]!,
      keccak256(
        encodePacked(
          ['address', 'address', 'bool'],
          [t1.address as Address, t2.address as Address, stable],
        ),
      ),
      this.initCodeHash[this.chainId as keyof typeof this.initCodeHash]!,
    ) as Address
  }
}
