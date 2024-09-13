export const squidAdapterAbi_executePayload = [
  {
    inputs: [
      { internalType: 'uint256', name: '_amountBridged', type: 'uint256' },
      { internalType: 'bytes', name: '_payloadData', type: 'bytes' },
      { internalType: 'address', name: '_token', type: 'address' },
    ],
    name: 'executePayload',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
