import { Address, encodeFunctionData } from 'viem'

const abiShard = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
    ],
    name: 'unwrapWETH',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
]

interface UnwrapETHAction {
  recipient: Address
}

/**
 * Unwrap contract's wETH into ETH
 * @param recipient recipient of ETH
 * @param liquidityOutput array with minimum output amounts for underlying tokens
 */
export const unwrapWETHAction = ({ recipient }: UnwrapETHAction) => {
  return encodeFunctionData({ abi: abiShard, functionName: 'unwrapWETH', args: [recipient] })
}
