import { Signature, encodeFunctionData } from 'viem'

const abiShard = [
  {
    inputs: [
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
    name: 'approveMasterContract',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

export interface ApproveMasterContractAction {
  signature?: Signature
}

export const approveMasterContractAction = ({
  signature,
}: ApproveMasterContractAction) => {
  if (!signature) return undefined

  const { v, r, s } = signature
  return encodeFunctionData({
    abi: abiShard,
    functionName: 'approveMasterContract',
    args: [Number(v), r, s],
  })
}
