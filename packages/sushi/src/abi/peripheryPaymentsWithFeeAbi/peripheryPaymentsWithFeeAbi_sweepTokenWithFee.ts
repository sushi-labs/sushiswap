export const peripheryPaymentsWithFeeAbi_sweepTokenWithFee = [
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amountMinimum', type: 'uint256' },
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'feeBips', type: 'uint256' },
      { internalType: 'address', name: 'feeRecipient', type: 'address' },
    ],
    name: 'sweepTokenWithFee',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
