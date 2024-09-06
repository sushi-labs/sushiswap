export const bentoBoxV1Abi_setStrategy = [
  {
    inputs: [
      { internalType: 'contract IERC20', name: 'token', type: 'address' },
      {
        internalType: 'contract IStrategy',
        name: 'newStrategy',
        type: 'address',
      },
    ],
    name: 'setStrategy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
