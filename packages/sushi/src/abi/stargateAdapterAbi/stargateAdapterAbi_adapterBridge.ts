export const stargateAdapterAbi_adapterBridge = [
  {
    inputs: [
      { internalType: 'bytes', name: '_adapterData', type: 'bytes' },
      { internalType: 'address', name: '_refundAddress', type: 'address' },
      { internalType: 'bytes', name: '_swapData', type: 'bytes' },
      { internalType: 'bytes', name: '_payloadData', type: 'bytes' },
    ],
    name: 'adapterBridge',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
