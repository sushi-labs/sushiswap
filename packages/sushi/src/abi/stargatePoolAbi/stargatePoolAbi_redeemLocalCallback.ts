export const stargatePoolAbi_redeemLocalCallback = [
  {
    inputs: [
      { internalType: 'uint16', name: '_srcChainId', type: 'uint16' },
      { internalType: 'uint256', name: '_srcPoolId', type: 'uint256' },
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint256', name: '_amountSD', type: 'uint256' },
      { internalType: 'uint256', name: '_amountToMintSD', type: 'uint256' },
    ],
    name: 'redeemLocalCallback',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
