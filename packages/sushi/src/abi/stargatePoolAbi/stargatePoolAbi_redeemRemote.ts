export const stargatePoolAbi_redeemRemote = [
  {
    inputs: [
      { internalType: 'uint16', name: '_dstChainId', type: 'uint16' },
      { internalType: 'uint256', name: '_dstPoolId', type: 'uint256' },
      { internalType: 'address', name: '_from', type: 'address' },
      { internalType: 'uint256', name: '_amountLP', type: 'uint256' },
    ],
    name: 'redeemRemote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
