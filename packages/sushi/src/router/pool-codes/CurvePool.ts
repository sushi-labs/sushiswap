import { ChainId } from '../../chain/index.js'
import {
  CurveMultitokenPool,
  CurvePool,
  MultiRoute,
  RouteLeg,
} from '../../tines/index.js'
import { HEXer } from '../HEXer.js'
import {
  CURVE_NON_FACTORY_POOLS,
  CurvePoolType,
  LiquidityProviders,
} from '../liquidity-providers/index.js'
import { PoolCode } from './PoolCode.js'

export class CurvePoolCode extends PoolCode {
  constructor(
    pool: CurvePool | CurveMultitokenPool,
    liquidityProvider: LiquidityProviders,
    providerName: string,
  ) {
    super(pool, liquidityProvider, `${providerName} ${(pool?.fee || 0) * 100}%`)
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

    let poolType = 0
    if (leg.tokenFrom.chainId !== undefined) {
      const index = CURVE_NON_FACTORY_POOLS[
        leg.tokenFrom.chainId as ChainId
      ]!.findIndex(([addr]) => addr === this.pool.address)
      if (
        index >= 0 &&
        CURVE_NON_FACTORY_POOLS[leg.tokenFrom.chainId as ChainId]![
          index
        ]![1] !== CurvePoolType.Legacy
      )
        poolType = 1
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
