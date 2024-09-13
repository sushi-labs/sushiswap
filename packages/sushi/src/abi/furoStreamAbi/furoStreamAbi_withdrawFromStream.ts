export const furoStreamAbi_withdrawFromStream = [
  {
    inputs: [
      { internalType: 'uint256', name: 'streamId', type: 'uint256' },
      { internalType: 'uint256', name: 'sharesToWithdraw', type: 'uint256' },
      { internalType: 'address', name: 'withdrawTo', type: 'address' },
      { internalType: 'bool', name: 'toBentoBox', type: 'bool' },
      { internalType: 'bytes', name: 'taskData', type: 'bytes' },
    ],
    name: 'withdrawFromStream',
    outputs: [
      { internalType: 'uint256', name: 'recipientBalance', type: 'uint256' },
      { internalType: 'address', name: 'to', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
