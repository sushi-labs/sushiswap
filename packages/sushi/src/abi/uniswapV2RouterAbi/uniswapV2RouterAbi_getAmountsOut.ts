export const uniswapV2RouterAbi_getAmountsOut = [
  {
    inputs: [
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'address[]', name: 'path', type: 'address[]' },
    ],
    name: 'getAmountsOut',
    outputs: [
      { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
