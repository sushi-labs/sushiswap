export const stargatePoolAbi_createChainPath = [
  {
    inputs: [
      { internalType: 'uint16', name: '_dstChainId', type: 'uint16' },
      { internalType: 'uint256', name: '_dstPoolId', type: 'uint256' },
      { internalType: 'uint256', name: '_weight', type: 'uint256' },
    ],
    name: 'createChainPath',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
