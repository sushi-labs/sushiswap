export const bentoBoxV1Abi_harvest = [
  {
    inputs: [
      { internalType: 'contract IERC20', name: 'token', type: 'address' },
      { internalType: 'bool', name: 'balance', type: 'bool' },
      { internalType: 'uint256', name: 'maxChangeAmount', type: 'uint256' },
    ],
    name: 'harvest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
