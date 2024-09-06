export const bentoBoxV1Abi_toAmount = [
  {
    inputs: [
      { internalType: 'contract IERC20', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'share', type: 'uint256' },
      { internalType: 'bool', name: 'roundUp', type: 'bool' },
    ],
    name: 'toAmount',
    outputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
