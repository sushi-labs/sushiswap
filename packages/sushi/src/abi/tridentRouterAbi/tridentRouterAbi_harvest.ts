export const tridentRouterAbi_harvest = [
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'maxChangeAmount', type: 'uint256' },
    ],
    name: 'harvest',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
