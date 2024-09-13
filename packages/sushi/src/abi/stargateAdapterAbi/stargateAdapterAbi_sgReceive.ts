export const stargateAdapterAbi_sgReceive = [
  {
    inputs: [
      { internalType: 'uint16', name: '', type: 'uint16' },
      { internalType: 'bytes', name: '', type: 'bytes' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'address', name: '_token', type: 'address' },
      { internalType: 'uint256', name: 'amountLD', type: 'uint256' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
    ],
    name: 'sgReceive',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
