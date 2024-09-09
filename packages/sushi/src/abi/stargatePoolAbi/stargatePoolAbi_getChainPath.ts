export const stargatePoolAbi_getChainPath = [
  {
    inputs: [
      { internalType: 'uint16', name: '_dstChainId', type: 'uint16' },
      { internalType: 'uint256', name: '_dstPoolId', type: 'uint256' },
    ],
    name: 'getChainPath',
    outputs: [
      {
        components: [
          { internalType: 'bool', name: 'ready', type: 'bool' },
          { internalType: 'uint16', name: 'dstChainId', type: 'uint16' },
          { internalType: 'uint256', name: 'dstPoolId', type: 'uint256' },
          { internalType: 'uint256', name: 'weight', type: 'uint256' },
          { internalType: 'uint256', name: 'balance', type: 'uint256' },
          { internalType: 'uint256', name: 'lkb', type: 'uint256' },
          { internalType: 'uint256', name: 'credits', type: 'uint256' },
          { internalType: 'uint256', name: 'idealBalance', type: 'uint256' },
        ],
        internalType: 'struct Pool.ChainPath',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
