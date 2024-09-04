export const squidRouterAbi_getExpressExecutor = [
  {
    inputs: [
      { internalType: 'bytes32', name: 'commandId', type: 'bytes32' },
      { internalType: 'string', name: 'sourceChain', type: 'string' },
      { internalType: 'string', name: 'sourceAddress', type: 'string' },
      { internalType: 'bytes32', name: 'payloadHash', type: 'bytes32' },
    ],
    name: 'getExpressExecutor',
    outputs: [
      { internalType: 'address', name: 'expressExecutor', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
