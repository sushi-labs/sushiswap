export const stargatePoolAbi_setDeltaParam = [
  {
    inputs: [
      { internalType: 'bool', name: '_batched', type: 'bool' },
      { internalType: 'uint256', name: '_swapDeltaBP', type: 'uint256' },
      { internalType: 'uint256', name: '_lpDeltaBP', type: 'uint256' },
      { internalType: 'bool', name: '_defaultSwapMode', type: 'bool' },
      { internalType: 'bool', name: '_defaultLPMode', type: 'bool' },
    ],
    name: 'setDeltaParam',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
