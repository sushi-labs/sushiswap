export const bentoBoxV1Abi_strategyData = [
  {
    inputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    name: 'strategyData',
    outputs: [
      { internalType: 'uint64', name: 'strategyStartDate', type: 'uint64' },
      { internalType: 'uint64', name: 'targetPercentage', type: 'uint64' },
      { internalType: 'uint128', name: 'balance', type: 'uint128' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
