import { encodeFunctionData, Signature } from 'viem'

declare const abiShard: [
  {
    readonly inputs: readonly [
      {
        readonly internalType: 'uint8'
        readonly name: 'v'
        readonly type: 'uint8'
      },
      {
        readonly internalType: 'bytes32'
        readonly name: 'r'
        readonly type: 'bytes32'
      },
      {
        readonly internalType: 'bytes32'
        readonly name: 's'
        readonly type: 'bytes32'
      }
    ]
    readonly name: 'approveMasterContract'
    readonly outputs: readonly []
    readonly stateMutability: 'payable'
    readonly type: 'function'
  }
]

export interface ApproveMasterContractAction {
  signature?: Signature
}

export const approveMasterContractAction = ({ signature }: ApproveMasterContractAction) => {
  if (!signature) return undefined

  const { v, r, s } = signature
  return encodeFunctionData({
    abi: abiShard,
    functionName: 'approveMasterContract',
    args: [Number(v), r, s],
  })
}
