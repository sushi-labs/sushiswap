import { encodeFunctionData } from 'viem'

declare const abiShard: [
  {
    inputs: [
      {
        internalType: 'uint256'
        name: 'streamId'
        type: 'uint256'
      },
      {
        internalType: 'uint128'
        name: 'topUpAmount'
        type: 'uint128'
      },
      {
        internalType: 'uint64'
        name: 'extendTime'
        type: 'uint64'
      },
      {
        internalType: 'bool'
        name: 'fromBentoBox'
        type: 'bool'
      }
    ]
    name: 'updateStream'
    outputs: [
      {
        internalType: 'uint256'
        name: 'depositedShares'
        type: 'uint256'
      }
    ]
    stateMutability: 'payable'
    type: 'function'
  }
]

interface UpdateStreamAction {
  streamId: bigint
  topUpAmount: bigint
  difference: bigint
  fromBentoBox: boolean
}

export const updateStreamAction = ({ streamId, topUpAmount, difference, fromBentoBox }: UpdateStreamAction) => {
  return encodeFunctionData({
    abi: abiShard,
    args: [streamId, topUpAmount, difference, fromBentoBox],
  })
}
