export const routeProcessor5Abi_processRouteWithTransferValueInput = [
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'transferValueTo',
        type: 'address',
      },
      { internalType: 'uint256', name: 'amountValueTransfer', type: 'uint256' },
      { internalType: 'address', name: 'tokenIn', type: 'address' },
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'address', name: 'tokenOut', type: 'address' },
      { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'bytes', name: 'route', type: 'bytes' },
    ],
    name: 'processRouteWithTransferValueInput',
    outputs: [{ internalType: 'uint256', name: 'amountOut', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
