export const uniswapV2RouterAbi_getAmountIn = [
  {
    inputs: [
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'uint256', name: 'reserveIn', type: 'uint256' },
      { internalType: 'uint256', name: 'reserveOut', type: 'uint256' },
    ],
    name: 'getAmountIn',
    outputs: [{ internalType: 'uint256', name: 'amountIn', type: 'uint256' }],
    stateMutability: 'pure',
    type: 'function',
  },
] as const
