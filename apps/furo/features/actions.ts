import { Amount, Token } from '@sushiswap/currency'
import { BigNumber, Contract, Signature } from 'ethers'
import { useSignTypedData } from 'wagmi'

interface Batch {
  contract: Contract
  actions: (string | undefined)[]
}

/**
 * Make sure provided contract has a batch function.
 * Calls action directly if provided array is of length 1, encode batch otherwise
 * @param contract should contain batch function
 * @param actions array of encoded function data
 */
export const batchAction = <T = any>({ contract, actions = [] }: Batch): string | undefined => {
  const validated = actions.filter(Boolean)

  if (validated.length === 0) throw new Error('No valid actions')

  // Call action directly to save gas
  if (validated.length === 1) {
    return validated[0]
  }

  // Call batch function with valid actions
  if (validated.length > 1) {
    console.log(validated.toString())
    return contract.interface.encodeFunctionData('batch', [validated, true])
  }
}

export interface ApproveBentoBoxActionProps {
  contract: Contract
  user: string
  signature?: Signature
}

export const approveBentoBoxAction = ({ contract, user, signature }: ApproveBentoBoxActionProps) => {
  if (!signature) return undefined

  const { v, r, s } = signature
  return contract.interface.encodeFunctionData('setBentoBoxApproval', [user, true, v, r, s])
}

export interface StreamCreationActionProps {
  contract: Contract
  recipient: string
  token: Token
  startDate: Date
  endDate: Date
  amount: Amount<Token>
  fromBentoBox: boolean
}

export const streamCreationAction = ({
  contract,
  recipient,
  token,
  startDate,
  endDate,
  amount,
  fromBentoBox,
}: StreamCreationActionProps): string => {
  return contract.interface.encodeFunctionData('createStream', [
    // TODO: check wnative address, pass in value
    recipient,
    token.address,
    startDate.getTime() / 1000,
    endDate.getTime() / 1000,
    amount.quotient.toString(),
    fromBentoBox,
  ])
}

export interface VestingCreationProps {
  contract: Contract
  recipient: string
  token: Token
  startDate: Date
  cliffDuration: BigNumber
  stepDuration: BigNumber
  steps: BigNumber
  cliffAmount: BigNumber
  stepAmount: BigNumber
  fromBentoBox: boolean
}

export const vestingCreationAction = ({
  contract,
  recipient,
  token,
  startDate,
  cliffDuration,
  stepDuration,
  steps,
  cliffAmount,
  stepAmount,
  fromBentoBox,
}: VestingCreationProps): string => {
  return contract.interface.encodeFunctionData('createVesting', [
    // TODO: check wnative address, pass in value
    token.address,
    recipient,
    startDate.getTime() / 1000,
    cliffDuration,
    stepDuration,
    steps,
    cliffAmount,
    stepAmount,
    fromBentoBox,
  ])
}
