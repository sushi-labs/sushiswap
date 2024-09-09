import { type Address, encodeFunctionData } from 'viem'
import {
  peripheryPaymentsWithFeeAbi_refundETH,
  peripheryPaymentsWithFeeAbi_sweepToken,
  peripheryPaymentsWithFeeAbi_sweepTokenWithFee,
  peripheryPaymentsWithFeeAbi_unwrapWETH9,
  peripheryPaymentsWithFeeAbi_unwrapWETH9WithFee,
} from '../../../abi/peripheryPaymentsWithFeeAbi/index.js'
import { Token } from '../../../currency/index.js'
import { Percent } from '../../../math/index.js'
import { validateAndParseAddress } from '../utils/index.js'

export interface FeeOptions {
  /**
   * The percent of the output that will be taken as a fee.
   */
  fee: Percent

  /**
   * The recipient of the fee.
   */
  recipient: Address
}

export abstract class Payments {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  private static encodeFeeBips(fee: Percent): bigint {
    return fee.multiply(10_000).quotient
  }

  public static encodeUnwrapWETH9(
    amountMinimum: bigint,
    recipient: Address,
    feeOptions?: FeeOptions,
  ) {
    recipient = validateAndParseAddress(recipient)

    if (feeOptions) {
      const feeBips = this.encodeFeeBips(feeOptions.fee)
      const feeRecipient = validateAndParseAddress(feeOptions.recipient)

      return encodeFunctionData({
        abi: peripheryPaymentsWithFeeAbi_unwrapWETH9WithFee,
        functionName: 'unwrapWETH9WithFee',
        args: [amountMinimum, recipient, feeBips, feeRecipient],
      })
    } else {
      return encodeFunctionData({
        abi: peripheryPaymentsWithFeeAbi_unwrapWETH9,
        functionName: 'unwrapWETH9',
        args: [amountMinimum, recipient],
      })
    }
  }

  public static encodeSweepToken(
    token: Token,
    amountMinimum: bigint,
    recipient: Address,
    feeOptions?: FeeOptions,
  ) {
    recipient = validateAndParseAddress(recipient)

    if (feeOptions) {
      const feeBips = this.encodeFeeBips(feeOptions.fee)
      const feeRecipient = validateAndParseAddress(feeOptions.recipient)

      return encodeFunctionData({
        abi: peripheryPaymentsWithFeeAbi_sweepTokenWithFee,
        functionName: 'sweepTokenWithFee',
        args: [token.address, amountMinimum, recipient, feeBips, feeRecipient],
      })
    } else {
      return encodeFunctionData({
        abi: peripheryPaymentsWithFeeAbi_sweepToken,
        functionName: 'sweepToken',
        args: [token.address, amountMinimum, recipient],
      })
    }
  }

  public static encodeRefundETH() {
    return encodeFunctionData({
      abi: peripheryPaymentsWithFeeAbi_refundETH,
      functionName: 'refundETH',
    })
  }
}
