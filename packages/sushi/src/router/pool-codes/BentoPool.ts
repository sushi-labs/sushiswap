import { Address, encodeAbiParameters } from 'viem'
import {
  ConstantProductRPool,
  MultiRoute,
  RPool,
  RouteLeg,
  StableSwapRPool,
} from '../../tines/index.js'
import { HEXer } from '../HEXer.js'
import { LiquidityProviders } from '../liquidity-providers/index.js'
import { PoolCode } from './PoolCode.js'

function getPoolTypeTicker(pool: RPool): string {
  if (pool instanceof ConstantProductRPool) return 'Classic'
  if (pool instanceof StableSwapRPool) return 'Stable'
  return ''
}

export class BentoPoolCode extends PoolCode {
  constructor(
    pool: RPool,
    liquidityProvider: LiquidityProviders,
    providerName: string,
  ) {
    super(
      pool,
      liquidityProvider,
      `${providerName} ${getPoolTypeTicker(pool)} ${(pool?.fee || 0) * 100}%`,
    )
  }

  getSwapCodeForRouteProcessor(
    leg: RouteLeg,
    _route: MultiRoute,
    to: string,
  ): string {
    // TODO: add unwrap bento = true variant
    // address tokenIn, address recipient, bool unwrapBento
    const poolData = encodeAbiParameters(
      [
        { name: 'tokenIn', type: 'address' },
        { name: 'recipient', type: 'address' },
        { name: 'unwrapBento', type: 'bool' },
      ],
      [leg.tokenFrom.address as Address, to as Address, false],
    )

    const code = new HEXer()
      .uint8(21) // swapTrident
      .address(leg.poolAddress)
      .bytes(poolData)
      .toString()

    return code
  }

  override getSwapCodeForRouteProcessor2(
    leg: RouteLeg,
    _route: MultiRoute,
    to: string,
  ): string {
    // TODO: add unwrap bento = true optimization
    // address tokenIn, address recipient, bool unwrapBento
    const poolData = encodeAbiParameters(
      [
        { name: 'tokenIn', type: 'address' },
        { name: 'recipient', type: 'address' },
        { name: 'unwrapBento', type: 'bool' },
      ],
      [leg.tokenFrom.address as Address, to as Address, false],
    )
    const code = new HEXer()
      .uint8(4) // swapTrident
      .address(leg.poolAddress)
      .bytes(poolData)
      .toString()

    return code
  }
}
