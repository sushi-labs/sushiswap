export const stargatePoolAbi_setWeightForChainPath = [
  {
    inputs: [
      { internalType: 'uint16', name: '_dstChainId', type: 'uint16' },
      { internalType: 'uint256', name: '_dstPoolId', type: 'uint256' },
      { internalType: 'uint16', name: '_weight', type: 'uint16' },
    ],
    name: 'setWeightForChainPath',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
