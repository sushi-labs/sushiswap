import { Address } from 'viem'
import type { MultiRoute, RouteLeg, UniV4Pool } from '../../tines/index.js'
import { HEXer } from '../HEXer.js'
import { LiquidityProviders } from '../liquidity-providers/index.js'
import { PoolCode, RPPoolType } from './PoolCode.js'

export class UniV4PoolCode extends PoolCode {
  address: Address
  constructor(
    address: Address,
    pool: UniV4Pool,
    liquidityProvider: LiquidityProviders,
    providerName: string,
  ) {
    super(pool, liquidityProvider, `${providerName} ${(pool?.fee || 0) * 100}%`)
    this.address = address
  }

  override getStartPoint(): string {
    return PoolCode.RouteProcessorAddress
  }

  override getSwapCodeForRouteProcessor(): string {
    return 'unsupported'
  }
  override getSwapCodeForRouteProcessor2(): string {
    return 'unsupported'
  }

  getSwapCodeForRouteProcessor6(
    leg: RouteLeg,
    _route: MultiRoute,
    to: string,
  ): string {
    const code = new HEXer()
      .uint8(RPPoolType.UniV4)
      .address(this.address)
      .bytes32(this.pool.address) // id
      .bool(leg.tokenFrom.address === this.pool.token0.address)
      .address(to)
      .toString()
    return code
  }
}
