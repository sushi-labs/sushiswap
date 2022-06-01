import { BaseContract } from '@ethersproject/contracts'

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

export const subscribeAction = (contract: BaseContract, id: string): string => {
  return contract.interface.encodeFunctionData('subscribeToIncentive', [id])
}
