export const squidAdapterAbi_swap = [
  {
    inputs: [
      { internalType: 'uint256', name: '_amountBridged', type: 'uint256' },
      { internalType: 'bytes', name: '_swapData', type: 'bytes' },
      { internalType: 'address', name: '_token', type: 'address' },
      { internalType: 'bytes', name: '_payloadData', type: 'bytes' },
    ],
    name: 'swap',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
