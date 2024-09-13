export const tridentStablePoolFactoryAbi_calculatePoolAddress = [
  {
    inputs: [
      { internalType: 'address', name: 'token0', type: 'address' },
      { internalType: 'address', name: 'token1', type: 'address' },
      { internalType: 'uint256', name: 'swapFee', type: 'uint256' },
    ],
    name: 'calculatePoolAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
