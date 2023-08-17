import { Address, encodeFunctionData, Hex, Signature } from 'viem'

const abiShard = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'setBentoBoxApproval',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

interface ApproveBentoBoxAction {
  user: Address
  signature: Signature
}

export const approveBentoBoxAction = ({ user, signature }: ApproveBentoBoxAction): Hex => {
  const { v, r, s } = signature

  return encodeFunctionData({ abi: abiShard, functionName: 'setBentoBoxApproval', args: [user, true, Number(v), r, s] })
}
