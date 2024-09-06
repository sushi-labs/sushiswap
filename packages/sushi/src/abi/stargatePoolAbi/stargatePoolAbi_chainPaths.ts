export const stargatePoolAbi_chainPaths = [
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'chainPaths',
    outputs: [
      { internalType: 'bool', name: 'ready', type: 'bool' },
      { internalType: 'uint16', name: 'dstChainId', type: 'uint16' },
      { internalType: 'uint256', name: 'dstPoolId', type: 'uint256' },
      { internalType: 'uint256', name: 'weight', type: 'uint256' },
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'lkb', type: 'uint256' },
      { internalType: 'uint256', name: 'credits', type: 'uint256' },
      { internalType: 'uint256', name: 'idealBalance', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
