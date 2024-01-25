import { Hex, encodeFunctionData } from 'viem'

const abiShard = [
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: 'data',
        type: 'bytes[]',
      },
    ],
    name: 'multicall',
    outputs: [
      {
        internalType: 'bytes[]',
        name: 'results',
        type: 'bytes[]',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

interface BatchAction {
  actions: (Hex | undefined)[]
}

/**
 * Make sure provided contract has a batch function.
 * Calls action directly if provided array is of length 1, encode batch otherwise
 * @param actions array of encoded function data
 */
export const batchAction = ({ actions = [] }: BatchAction): Hex | undefined => {
  const validated = actions.filter(Boolean) as Hex[]

  if (validated.length === 0) throw new Error('No valid actions')

  // Call action directly to save gas
  if (validated.length === 1) {
    return validated[0] as Hex
  }

  // Call batch function with valid actions
  if (validated.length > 1) {
    return encodeFunctionData({
      abi: abiShard,
      functionName: 'multicall',
      args: [validated],
    })
  }
}
