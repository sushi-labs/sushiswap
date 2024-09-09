export const furoVestingAbi_updateOwner = [
  {
    inputs: [
      { internalType: 'uint256', name: 'vestId', type: 'uint256' },
      { internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'updateOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
