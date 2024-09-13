export const furoStreamAbi_streamBalanceOf = [
  {
    inputs: [{ internalType: 'uint256', name: 'streamId', type: 'uint256' }],
    name: 'streamBalanceOf',
    outputs: [
      { internalType: 'uint256', name: 'senderBalance', type: 'uint256' },
      { internalType: 'uint256', name: 'recipientBalance', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
