import { Address } from 'viem'
import { ChainId } from '../../chain/index.js'
import { Type } from '../../currency/Type.js'
import {
  CurveMultitokenPool,
  CurvePool,
  MultiRoute,
  RouteLeg,
} from '../../tines/index.js'
import { HEXer } from '../HEXer.js'
import { CurvePoolType } from '../curve-sdk.js'
import {
  CURVE_NON_FACTORY_POOLS,
  LiquidityProviders,
} from '../liquidity-providers/index.js'
import { PoolCode } from './PoolCode.js'

export class CurvePoolCode extends PoolCode {
  poolType: number
  constructor(
    pool: CurvePool | CurveMultitokenPool,
    liquidityProvider: LiquidityProviders,
    providerName: string,
    poolType?: number,
  ) {
    super(pool, liquidityProvider, `${providerName} ${(pool?.fee || 0) * 100}%`)
    this.poolType = poolType || 1
  }

  override getStartPoint(): string {
    return PoolCode.RouteProcessorAddress
  }

  getSwapCodeForRouteProcessor(): string {
    return 'CurvePool is not supported by RP1'
  }

  override getSwapCodeForRouteProcessor2(): string {
    return 'CurvePool is not supported by RP2'
  }

  override getSwapCodeForRouteProcessor4(
    leg: RouteLeg,
    _: MultiRoute,
    to: string,
  ): string {
    // supports only 2-token pools currently

    let poolType = this.poolType ?? 0
    if (this.poolType === undefined) {
      if (leg.tokenFrom.chainId !== undefined) {
        const index = CURVE_NON_FACTORY_POOLS[
          leg.tokenFrom.chainId as ChainId
        ]?.findIndex(([addr]) => addr === this.pool.address)
        if (index !== undefined && index >= 0) {
          const pools = CURVE_NON_FACTORY_POOLS[
            leg.tokenFrom.chainId as ChainId
          ] as [Address, CurvePoolType, Type[]][]
          const poolInfo = pools[index] as [Address, CurvePoolType, Type[]]
          if (poolInfo[1] !== CurvePoolType.TypeC) poolType = 1
        }
      }
    }

    const [index0, index1] =
      this.pool instanceof CurveMultitokenPool
        ? [this.pool.index0, this.pool.index1]
        : [0, 1]
    const [fromIndex, toIndex] =
      this.pool.token0.tokenId === leg.tokenFrom.tokenId
        ? [index0, index1]
        : [index1, index0]
    const code = new HEXer()
      .uint8(5) // Curve pool
      .address(this.pool.address)
      .uint8(poolType)
      .uint8(fromIndex)
      .uint8(toIndex)
      .address(to)
      .address(
        leg.tokenTo.address || '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      )
      .toString()

    return code
  }
}
