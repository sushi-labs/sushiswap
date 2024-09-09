export const squidRouterAbi_expressExecute = [
  {
    inputs: [
      { internalType: 'bytes32', name: 'commandId', type: 'bytes32' },
      { internalType: 'string', name: 'sourceChain', type: 'string' },
      { internalType: 'string', name: 'sourceAddress', type: 'string' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
    ],
    name: 'expressExecute',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
