export const stargatePoolAbi_redeemLocal = [
  {
    inputs: [
      { internalType: 'address', name: '_from', type: 'address' },
      { internalType: 'uint256', name: '_amountLP', type: 'uint256' },
      { internalType: 'uint16', name: '_dstChainId', type: 'uint16' },
      { internalType: 'uint256', name: '_dstPoolId', type: 'uint256' },
      { internalType: 'bytes', name: '_to', type: 'bytes' },
    ],
    name: 'redeemLocal',
    outputs: [{ internalType: 'uint256', name: 'amountSD', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
