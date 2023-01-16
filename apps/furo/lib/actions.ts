import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { BaseContract } from '@ethersproject/contracts'
import { Amount, Share, Type } from '@sushiswap/currency'
import { FuroStreamRouter, FuroVestingRouter } from '@sushiswap/wagmi'

interface Batch<T> {
  contract: T
  actions: (string | undefined)[]
}

/**
 * Make sure provided contract has a batch function.
 * Calls action directly if provided array is of length 1, encode batch otherwise
 * @param contract should contain batch function
 * @param actions array of encoded function data
 */
export const batchAction = <T extends BaseContract>({ contract, actions = [] }: Batch<T>): string | undefined => {
  const validated = actions.filter(Boolean)

  if (validated.length === 0) throw new Error('No valid actions')

  // Call action directly to save gas
  if (validated.length === 1) {
    return validated[0]
  }

  // Call batch function with valid actions
  if (validated.length > 1) {
    return contract.interface.encodeFunctionData('multicall', [validated])
  }
}

export interface ApproveBentoBoxActionProps<T> {
  contract: T
  user: string
  signature: Signature
}

export const approveBentoBoxAction = <T extends BaseContract>({
  contract,
  user,
  signature,
}: ApproveBentoBoxActionProps<T>) => {
  const { v, r, s } = signature
  return contract.interface.encodeFunctionData('setBentoBoxApproval', [user, true, v, r, s])
}

export interface StreamCreationActionProps {
  contract: FuroStreamRouter
  recipient: string
  currency: Type
  startDate: Date
  endDate: Date
  amount: Amount<Type>
  fromBentobox: boolean
  minShare: Share<Type>
}

export const streamCreationAction = ({
  contract,
  recipient,
  currency,
  startDate,
  endDate,
  amount,
  fromBentobox,
  minShare,
}: StreamCreationActionProps): string => {
  return contract.interface.encodeFunctionData('createStream', [
    recipient,
    currency.isNative ? AddressZero : currency.wrapped.address,
    Math.floor(startDate.getTime() / 1000),
    Math.floor(endDate.getTime() / 1000),
    amount.quotient.toString(),
    fromBentobox,
    minShare.quotient.toString(),
  ])
}

export interface VestingCreationProps {
  contract: FuroVestingRouter
  recipient: string
  currency: Type
  startDate: Date
  cliffDuration: string
  stepDuration: string
  steps: string
  stepPercentage: string
  amount: string
  fromBentobox: boolean
  minShare: Share<Type>
}

export const vestingCreationAction = ({
  contract,
  recipient,
  currency,
  startDate,
  cliffDuration,
  stepDuration,
  steps,
  stepPercentage,
  amount,
  fromBentobox,
  minShare,
}: VestingCreationProps): string => {
  return contract.interface.encodeFunctionData('createVesting', [
    {
      token: currency.isNative ? AddressZero : currency.wrapped.address,
      recipient: recipient,
      start: Math.floor(startDate.getTime() / 1000),
      cliffDuration: cliffDuration,
      stepDuration: stepDuration,
      steps: steps,
      stepPercentage: stepPercentage,
      amount: amount,
      fromBentoBox: fromBentobox,
    },
    minShare.quotient.toString(),
  ])
}
