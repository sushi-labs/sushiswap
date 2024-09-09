export const bentoBoxV1Abi_transferMultiple = [
  {
    inputs: [
      { internalType: 'contract IERC20', name: 'token', type: 'address' },
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address[]', name: 'tos', type: 'address[]' },
      { internalType: 'uint256[]', name: 'shares', type: 'uint256[]' },
    ],
    name: 'transferMultiple',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
