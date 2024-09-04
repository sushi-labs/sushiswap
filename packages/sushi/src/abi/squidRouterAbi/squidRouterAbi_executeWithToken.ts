export const squidRouterAbi_executeWithToken = [
  {
    inputs: [
      { internalType: 'bytes32', name: 'commandId', type: 'bytes32' },
      { internalType: 'string', name: 'sourceChain', type: 'string' },
      { internalType: 'string', name: 'sourceAddress', type: 'string' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
      { internalType: 'string', name: 'tokenSymbol', type: 'string' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'executeWithToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
