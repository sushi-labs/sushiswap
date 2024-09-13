export const masterChefV2Abi_add = [
  {
    inputs: [
      { internalType: 'uint256', name: 'allocPoint', type: 'uint256' },
      { internalType: 'contract IERC20', name: '_lpToken', type: 'address' },
      {
        internalType: 'contract IRewarder',
        name: '_rewarder',
        type: 'address',
      },
    ],
    name: 'add',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
