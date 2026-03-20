export const redSnwapperAbi_snwap = [
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: 'tokenIn',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'contract IERC20',
        name: 'tokenOut',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountOutMin',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'executor',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'executorData',
        type: 'bytes',
      },
    ],
    name: 'snwap',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
