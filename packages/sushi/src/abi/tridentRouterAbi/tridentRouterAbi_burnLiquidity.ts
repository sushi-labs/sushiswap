export const tridentRouterAbi_burnLiquidity = [
  {
    inputs: [
      { internalType: 'address', name: 'pool', type: 'address' },
      { internalType: 'uint256', name: 'liquidity', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
      {
        components: [
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        internalType: 'struct IPool.TokenAmount[]',
        name: 'minWithdrawals',
        type: 'tuple[]',
      },
    ],
    name: 'burnLiquidity',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
