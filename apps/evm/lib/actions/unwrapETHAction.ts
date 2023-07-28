import { Address, encodeFunctionData } from 'viem'

declare const abiShard: [
  {
    readonly inputs: readonly [
      {
        readonly internalType: 'address'
        readonly name: 'recipient'
        readonly type: 'address'
      }
    ]
    readonly name: 'unwrapWETH'
    readonly outputs: readonly []
    readonly stateMutability: 'payable'
    readonly type: 'function'
  }
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
