export const tridentRouterAbi_addLiquidity = [
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'bool', name: 'native', type: 'bool' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        internalType: 'struct ITridentRouter.TokenInput[]',
        name: 'tokenInput',
        type: 'tuple[]',
      },
      { internalType: 'address', name: 'pool', type: 'address' },
      { internalType: 'uint256', name: 'minLiquidity', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'addLiquidity',
    outputs: [{ internalType: 'uint256', name: 'liquidity', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
