export const miniChefV2Abi_withdrawAndHarvest = [
  {
    inputs: [
      { internalType: 'uint256', name: 'pid', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address', name: 'to', type: 'address' },
    ],
    name: 'withdrawAndHarvest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
