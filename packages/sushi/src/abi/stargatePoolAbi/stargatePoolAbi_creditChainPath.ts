export const stargatePoolAbi_creditChainPath = [
  {
    inputs: [
      { internalType: 'uint16', name: '_dstChainId', type: 'uint16' },
      { internalType: 'uint256', name: '_dstPoolId', type: 'uint256' },
      {
        components: [
          { internalType: 'uint256', name: 'credits', type: 'uint256' },
          { internalType: 'uint256', name: 'idealBalance', type: 'uint256' },
        ],
        internalType: 'struct Pool.CreditObj',
        name: '_c',
        type: 'tuple',
      },
    ],
    name: 'creditChainPath',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
