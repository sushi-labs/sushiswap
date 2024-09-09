export const cloneRewarderTimeAbi_updatePool = [
  {
    inputs: [{ internalType: 'uint256', name: 'pid', type: 'uint256' }],
    name: 'updatePool',
    outputs: [
      {
        components: [
          {
            internalType: 'uint128',
            name: 'accToken1PerShare',
            type: 'uint128',
          },
          { internalType: 'uint64', name: 'lastRewardTime', type: 'uint64' },
        ],
        internalType: 'struct CloneRewarderTime.PoolInfo',
        name: 'pool',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
