export const stargatePoolAbi_instantRedeemLocal = [
  {
    inputs: [
      { internalType: 'address', name: '_from', type: 'address' },
      { internalType: 'uint256', name: '_amountLP', type: 'uint256' },
      { internalType: 'address', name: '_to', type: 'address' },
    ],
    name: 'instantRedeemLocal',
    outputs: [{ internalType: 'uint256', name: 'amountSD', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
