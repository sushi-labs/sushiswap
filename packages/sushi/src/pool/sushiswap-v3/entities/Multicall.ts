import { type Hex, encodeFunctionData } from 'viem'
import { multicallAbi_multicall } from '../../../abi/multicallAbi/multicallAbi_multicall.js'

export abstract class Multicall {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static encodeMulticall(calldatas: Hex | Hex[]): string {
    if (!Array.isArray(calldatas)) {
      calldatas = [calldatas]
    }

    if (calldatas.length === 1) {
      return calldatas[0]!
    }

    return encodeFunctionData({
      abi: multicallAbi_multicall,
      functionName: 'multicall',
      args: [calldatas],
    })
  }
}
