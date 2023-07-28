import { Address, encodeFunctionData } from 'viem'

declare const abiShard: [
  {
    readonly inputs: readonly [
      {
        readonly internalType: 'address'
        readonly name: 'token'
        readonly type: 'address'
      },
      {
        readonly internalType: 'address'
        readonly name: 'recipient'
        readonly type: 'address'
      },
      {
        readonly internalType: 'bool'
        readonly name: 'fromBento'
        readonly type: 'bool'
      }
    ]
    readonly name: 'sweep'
    readonly outputs: readonly []
    readonly stateMutability: 'payable'
    readonly type: 'function'
  }
]

interface SweepAction {
  token: Address
  recipient: Address
  fromBento: boolean
}

/**
 * Recover mistakenly sent ERC-20 tokens
 * @param token address of token
 * @param recipient address to sent funds to
 */
export const sweepAction = ({ token, recipient, fromBento = false }: SweepAction) => {
  return encodeFunctionData({ abi: abiShard, functionName: 'sweep', args: [token, recipient, fromBento] })
}
