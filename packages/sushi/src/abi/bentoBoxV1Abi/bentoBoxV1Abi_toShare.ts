export const bentoBoxV1Abi_toShare = [
  {
    inputs: [
      { internalType: 'contract IERC20', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'bool', name: 'roundUp', type: 'bool' },
    ],
    name: 'toShare',
    outputs: [{ internalType: 'uint256', name: 'share', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
