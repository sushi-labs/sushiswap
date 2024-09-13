export const miniChefAbi_rewarder = [
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'rewarder',
    outputs: [
      { internalType: 'contract IRewarder', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
