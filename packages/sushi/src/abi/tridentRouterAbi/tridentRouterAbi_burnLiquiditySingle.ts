export const tridentRouterAbi_burnLiquiditySingle = [
  {
    inputs: [
      { internalType: 'address', name: 'pool', type: 'address' },
      { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
      { internalType: 'uint256', name: 'minWithdrawal', type: 'uint256' },
    ],
    name: 'burnLiquiditySingle',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
