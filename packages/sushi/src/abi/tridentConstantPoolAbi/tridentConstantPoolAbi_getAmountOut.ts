export const tridentConstantPoolAbi_getAmountOut = [
  {
    inputs: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
    name: 'getAmountOut',
    outputs: [
      { internalType: 'uint256', name: 'finalAmountOut', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
