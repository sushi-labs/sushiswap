export const furoStreamAbi_cancelStream = [
  {
    inputs: [
      { internalType: 'uint256', name: 'streamId', type: 'uint256' },
      { internalType: 'bool', name: 'toBentoBox', type: 'bool' },
    ],
    name: 'cancelStream',
    outputs: [
      { internalType: 'uint256', name: 'senderBalance', type: 'uint256' },
      { internalType: 'uint256', name: 'recipientBalance', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
