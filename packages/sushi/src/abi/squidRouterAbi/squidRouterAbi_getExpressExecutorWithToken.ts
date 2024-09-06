export const squidRouterAbi_getExpressExecutorWithToken = [
  {
    inputs: [
      { internalType: 'bytes32', name: 'commandId', type: 'bytes32' },
      { internalType: 'string', name: 'sourceChain', type: 'string' },
      { internalType: 'string', name: 'sourceAddress', type: 'string' },
      { internalType: 'bytes32', name: 'payloadHash', type: 'bytes32' },
      { internalType: 'string', name: 'symbol', type: 'string' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'getExpressExecutorWithToken',
    outputs: [
      { internalType: 'address', name: 'expressExecutor', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
