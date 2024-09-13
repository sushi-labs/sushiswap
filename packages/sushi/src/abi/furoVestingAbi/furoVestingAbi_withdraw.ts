export const furoVestingAbi_withdraw = [
  {
    inputs: [
      { internalType: 'uint256', name: 'vestId', type: 'uint256' },
      { internalType: 'bytes', name: 'taskData', type: 'bytes' },
      { internalType: 'bool', name: 'toBentoBox', type: 'bool' },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
