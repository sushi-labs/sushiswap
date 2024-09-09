export const cloneRewarderTimeAbi_reclaimTokens = [
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address payable', name: 'to', type: 'address' },
    ],
    name: 'reclaimTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
