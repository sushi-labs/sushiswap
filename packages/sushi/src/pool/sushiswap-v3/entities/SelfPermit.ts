import { type Hex, encodeFunctionData } from 'viem'
import {
  selfPermitAbi_selfPermit,
  selfPermitAbi_selfPermitAllowed,
} from '../../../abi/selfPermitAbi/index.js'
import { Token } from '../../../currency/index.js'
import type { BigintIsh } from '../../../math/index.js'

export interface StandardPermitArguments {
  v: 0 | 1 | 27 | 28
  r: Hex
  s: Hex
  amount: BigintIsh
  deadline: BigintIsh
}

export interface AllowedPermitArguments {
  v: 0 | 1 | 27 | 28
  r: Hex
  s: Hex
  nonce: BigintIsh
  expiry: BigintIsh
}

export type PermitOptions = StandardPermitArguments | AllowedPermitArguments

function isAllowedPermit(
  permitOptions: PermitOptions,
): permitOptions is AllowedPermitArguments {
  return 'nonce' in permitOptions
}

export abstract class SelfPermit {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  public static encodePermit(token: Token, options: PermitOptions) {
    if (isAllowedPermit(options)) {
      return encodeFunctionData({
        abi: selfPermitAbi_selfPermitAllowed,
        functionName: 'selfPermitAllowed',
        args: [
          token.address,
          BigInt(options.nonce),
          BigInt(options.expiry),
          options.v,
          options.r,
          options.s,
        ],
      })
    }

    return encodeFunctionData({
      abi: selfPermitAbi_selfPermit,
      functionName: 'selfPermit',
      args: [
        token.address,
        BigInt(options.amount),
        BigInt(options.deadline),
        options.v,
        options.r,
        options.s,
      ],
    })
  }
}
