import { SushiSwapV3FeeAmount } from '../../../config/index.js'
import { FullMath } from './fullMath.js'
import { SqrtPriceMath } from './sqrtPriceMath.js'

const MAX_FEE = 10n ** 6n

export abstract class SwapMath {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static computeSwapStep(
    sqrtRatioCurrentX96: bigint,
    sqrtRatioTargetX96: bigint,
    liquidity: bigint,
    amountRemaining: bigint,
    feePips: SushiSwapV3FeeAmount,
  ): [bigint, bigint, bigint, bigint] {
    // We know that all will be assigned, typescript just doesn't see it for amountIn/Out
    let sqrtRatioNextX96
    let amountIn = 0n
    let amountOut = 0n
    let feeAmount

    const zeroForOne = sqrtRatioCurrentX96 >= sqrtRatioTargetX96
    const exactIn = amountRemaining >= 0n

    if (exactIn) {
      const amountRemainingLessFee =
        (amountRemaining * (MAX_FEE - BigInt(feePips))) / MAX_FEE
      amountIn = zeroForOne
        ? SqrtPriceMath.getAmount0Delta(
            sqrtRatioTargetX96,
            sqrtRatioCurrentX96,
            liquidity,
            true,
          )
        : SqrtPriceMath.getAmount1Delta(
            sqrtRatioCurrentX96,
            sqrtRatioTargetX96,
            liquidity,
            true,
          )
      if (amountRemainingLessFee >= amountIn) {
        sqrtRatioNextX96 = sqrtRatioTargetX96
      } else {
        sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromInput(
          sqrtRatioCurrentX96,
          liquidity,
          amountRemainingLessFee,
          zeroForOne,
        )
      }
    } else {
      amountOut = zeroForOne
        ? SqrtPriceMath.getAmount1Delta(
            sqrtRatioTargetX96,
            sqrtRatioCurrentX96,
            liquidity,
            false,
          )
        : SqrtPriceMath.getAmount0Delta(
            sqrtRatioCurrentX96,
            sqrtRatioTargetX96,
            liquidity,
            false,
          )
      if (amountRemaining * -1n >= amountOut) {
        sqrtRatioNextX96 = sqrtRatioTargetX96
      } else {
        sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromOutput(
          sqrtRatioCurrentX96,
          liquidity,
          amountRemaining * -1n,
          zeroForOne,
        )
      }
    }

    const max = sqrtRatioTargetX96 === sqrtRatioNextX96

    if (zeroForOne) {
      amountIn =
        max && exactIn
          ? amountIn
          : SqrtPriceMath.getAmount0Delta(
              sqrtRatioNextX96,
              sqrtRatioCurrentX96,
              liquidity,
              true,
            )
      amountOut =
        max && !exactIn
          ? amountOut
          : SqrtPriceMath.getAmount1Delta(
              sqrtRatioNextX96,
              sqrtRatioCurrentX96,
              liquidity,
              false,
            )
    } else {
      amountIn =
        max && exactIn
          ? amountIn
          : SqrtPriceMath.getAmount1Delta(
              sqrtRatioCurrentX96,
              sqrtRatioNextX96,
              liquidity,
              true,
            )
      amountOut =
        max && !exactIn
          ? amountOut
          : SqrtPriceMath.getAmount0Delta(
              sqrtRatioCurrentX96,
              sqrtRatioNextX96,
              liquidity,
              false,
            )
    }

    if (!exactIn && amountOut > amountRemaining * -1n) {
      amountOut = amountRemaining * -1n
    }

    if (exactIn && sqrtRatioNextX96 !== sqrtRatioTargetX96) {
      // we didn't reach the target, so take the remainder of the maximum input as fee
      feeAmount = amountRemaining - amountIn
    } else {
      feeAmount = FullMath.mulDivRoundingUp(
        amountIn,
        BigInt(feePips),
        MAX_FEE - BigInt(feePips),
      )
    }

    return [sqrtRatioNextX96, amountIn, amountOut, feeAmount]
  }
}
