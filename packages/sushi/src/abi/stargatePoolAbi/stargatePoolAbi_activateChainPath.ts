export const stargatePoolAbi_activateChainPath = [
  {
    inputs: [
      { internalType: 'uint16', name: '_dstChainId', type: 'uint16' },
      { internalType: 'uint256', name: '_dstPoolId', type: 'uint256' },
    ],
    name: 'activateChainPath',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
