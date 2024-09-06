export const sushiXSwapAbi_getFee = [
  {
    inputs: [
      { internalType: 'uint16', name: '_dstChainId', type: 'uint16' },
      { internalType: 'uint8', name: '_functionType', type: 'uint8' },
      { internalType: 'address', name: '_receiver', type: 'address' },
      { internalType: 'uint256', name: '_gas', type: 'uint256' },
      { internalType: 'uint256', name: '_dustAmount', type: 'uint256' },
      { internalType: 'bytes', name: '_payload', type: 'bytes' },
    ],
    name: 'getFee',
    outputs: [
      { internalType: 'uint256', name: 'a', type: 'uint256' },
      { internalType: 'uint256', name: 'b', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
