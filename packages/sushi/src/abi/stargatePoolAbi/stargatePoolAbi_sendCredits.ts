export const stargatePoolAbi_sendCredits = [
  {
    inputs: [
      { internalType: 'uint16', name: '_dstChainId', type: 'uint16' },
      { internalType: 'uint256', name: '_dstPoolId', type: 'uint256' },
    ],
    name: 'sendCredits',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'credits', type: 'uint256' },
          { internalType: 'uint256', name: 'idealBalance', type: 'uint256' },
        ],
        internalType: 'struct Pool.CreditObj',
        name: 'c',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
