export const stargatePoolAbi_redeemLocalCheckOnRemote = [
  {
    inputs: [
      { internalType: 'uint16', name: '_srcChainId', type: 'uint16' },
      { internalType: 'uint256', name: '_srcPoolId', type: 'uint256' },
      { internalType: 'uint256', name: '_amountSD', type: 'uint256' },
    ],
    name: 'redeemLocalCheckOnRemote',
    outputs: [
      { internalType: 'uint256', name: 'swapAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'mintAmount', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
