export const cloneRewarderTimeAbi_poolInfo = [
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'poolInfo',
    outputs: [
      { internalType: 'uint128', name: 'accToken1PerShare', type: 'uint128' },
      { internalType: 'uint64', name: 'lastRewardTime', type: 'uint64' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
