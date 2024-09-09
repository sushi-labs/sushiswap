export const squidRouterAbi_upgrade = [
  {
    inputs: [
      { internalType: 'address', name: 'newImplementation', type: 'address' },
      {
        internalType: 'bytes32',
        name: 'newImplementationCodeHash',
        type: 'bytes32',
      },
      { internalType: 'bytes', name: 'params', type: 'bytes' },
    ],
    name: 'upgrade',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
