import { Address, encodeFunctionData, Hex, Signature } from 'viem'

declare const abiShard: [
  {
    readonly inputs: readonly [
      {
        readonly internalType: 'address'
        readonly name: 'user'
        readonly type: 'address'
      },
      {
        readonly internalType: 'bool'
        readonly name: 'approved'
        readonly type: 'bool'
      },
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
    readonly name: 'setBentoBoxApproval'
    readonly outputs: readonly []
    readonly stateMutability: 'payable'
    readonly type: 'function'
  }
]

interface ApproveBentoBoxAction {
  user: Address
  signature: Signature
}

export const approveBentoBoxAction = ({ user, signature }: ApproveBentoBoxAction): Hex => {
  const { v, r, s } = signature

  return encodeFunctionData({ abi: abiShard, args: [user, true, Number(v), r, s] })
}
