export const tridentRouterAbi_deployPool = [
  {
    inputs: [
      { internalType: 'address', name: 'factory', type: 'address' },
      { internalType: 'bytes', name: 'deployData', type: 'bytes' },
    ],
    name: 'deployPool',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
