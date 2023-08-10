import { encodeFunctionData } from 'viem'

const abiShard = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'streamId',
        type: 'uint256',
      },
      {
        internalType: 'uint128',
        name: 'topUpAmount',
        type: 'uint128',
      },
      {
        internalType: 'uint64',
        name: 'extendTime',
        type: 'uint64',
      },
      {
        internalType: 'bool',
        name: 'fromBentoBox',
        type: 'bool',
      },
    ],
    name: 'updateStream',
    outputs: [
      {
        internalType: 'uint256',
        name: 'depositedShares',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

interface UpdateStreamAction {
  streamId: bigint
  topUpAmount: bigint
  difference: bigint
  fromBentoBox: boolean
}

export const updateStreamAction = ({ streamId, topUpAmount, difference, fromBentoBox }: UpdateStreamAction) => {
  return encodeFunctionData({
    abi: abiShard,
    functionName: 'updateStream',
    args: [streamId, topUpAmount, difference, fromBentoBox],
  })
}
