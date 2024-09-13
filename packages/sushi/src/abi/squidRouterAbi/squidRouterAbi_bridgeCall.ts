export const squidRouterAbi_bridgeCall = [
  {
    inputs: [
      { internalType: 'string', name: 'bridgedTokenSymbol', type: 'string' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'string', name: 'destinationChain', type: 'string' },
      { internalType: 'string', name: 'destinationAddress', type: 'string' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
      { internalType: 'address', name: 'gasRefundRecipient', type: 'address' },
      { internalType: 'bool', name: 'enableExpress', type: 'bool' },
    ],
    name: 'bridgeCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
