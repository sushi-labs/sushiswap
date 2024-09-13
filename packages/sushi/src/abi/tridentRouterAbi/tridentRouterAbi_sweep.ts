export const tridentRouterAbi_sweep = [
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'bool', name: 'fromBento', type: 'bool' },
    ],
    name: 'sweep',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
