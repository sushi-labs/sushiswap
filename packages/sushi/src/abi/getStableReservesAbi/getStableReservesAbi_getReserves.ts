export const getStableReservesAbi_getReserves = [
  {
    inputs: [],
    name: 'getReserves',
    outputs: [
      { internalType: 'uint256', name: '_reserve0', type: 'uint256' },
      { internalType: 'uint256', name: '_reserve1', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
