export const masterChefV2Abi_updatePool = [
  {
    inputs: [{ internalType: 'uint256', name: 'pid', type: 'uint256' }],
    name: 'updatePool',
    outputs: [
      {
        components: [
          {
            internalType: 'uint128',
            name: 'accSushiPerShare',
            type: 'uint128',
          },
          { internalType: 'uint64', name: 'lastRewardBlock', type: 'uint64' },
          { internalType: 'uint64', name: 'allocPoint', type: 'uint64' },
        ],
        internalType: 'struct MasterChefV2.PoolInfo',
        name: 'pool',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const