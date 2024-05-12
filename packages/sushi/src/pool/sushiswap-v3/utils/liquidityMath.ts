import { ONE, ZERO } from '../../../math/index.js'

export abstract class LiquidityMath {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static addDelta(x: bigint, y: bigint): bigint {
    if (y < ZERO) {
      return x - y * -ONE
    } else {
      return x + y
    }
  }
}
