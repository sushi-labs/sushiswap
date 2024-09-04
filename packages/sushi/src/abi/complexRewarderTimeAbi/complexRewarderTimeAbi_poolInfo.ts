export const complexRewarderTimeAbi_poolInfo = [
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'poolInfo',
    outputs: [
      { internalType: 'uint128', name: 'accSushiPerShare', type: 'uint128' },
      { internalType: 'uint64', name: 'lastRewardTime', type: 'uint64' },
      { internalType: 'uint64', name: 'allocPoint', type: 'uint64' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
