export const miniChefV2Abi_set = [
  {
    inputs: [
      { internalType: 'uint256', name: '_pid', type: 'uint256' },
      { internalType: 'uint256', name: '_allocPoint', type: 'uint256' },
      {
        internalType: 'contract IRewarder',
        name: '_rewarder',
        type: 'address',
      },
      { internalType: 'bool', name: 'overwrite', type: 'bool' },
    ],
    name: 'set',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
