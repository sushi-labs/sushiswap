import { MultiRoute, RouteLeg, RPool } from "@sushiswap/tines";
import { BigNumber } from "ethers";

// RPool extention for RP coding
export abstract class PoolCode {
  pool: RPool
  poolName: string

  constructor(pool: RPool, poolName: string) {
    this.pool = pool
    this.poolName = poolName
  }

  static RouteProcessorAddress = 'RouteProcessor'

  // the address where should be swap amount of liquidity before the swap
  // returns RouteProcessorAddress if it is a RouteProcessor
  getStartPoint(_leg: RouteLeg, _route: MultiRoute): string {
    return this.pool.address
  }

  abstract getSwapCodeForRouteProcessor(leg: RouteLeg, route: MultiRoute, to: string, exactAmount?: BigNumber): string
}