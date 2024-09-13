export const stargateFeeLibraryV03Abi_getTrapezoidArea = [
  {
    inputs: [
      { internalType: 'uint256', name: 'lambda', type: 'uint256' },
      { internalType: 'uint256', name: 'yOffset', type: 'uint256' },
      { internalType: 'uint256', name: 'xUpperBound', type: 'uint256' },
      { internalType: 'uint256', name: 'xLowerBound', type: 'uint256' },
      { internalType: 'uint256', name: 'xStart', type: 'uint256' },
      { internalType: 'uint256', name: 'xEnd', type: 'uint256' },
    ],
    name: 'getTrapezoidArea',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'pure',
    type: 'function',
  },
] as const
