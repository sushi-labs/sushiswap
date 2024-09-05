import { Interface } from '@ethersproject/abi'
import { multicallAbi_multicall } from '../../../abi/multicallAbi/multicallAbi_multicall.js'

export abstract class Multicall {
  public static INTERFACE: Interface = new Interface(multicallAbi_multicall)

  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static encodeMulticall(calldatas: string | string[]): string {
    if (!Array.isArray(calldatas)) {
      calldatas = [calldatas]
    }

    return calldatas.length === 1
      ? calldatas[0]!
      : Multicall.INTERFACE.encodeFunctionData('multicall', [calldatas])
  }
}
