export const squidRouterAbi_callBridgeCall = [
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      {
        components: [
          {
            internalType: 'enum ISquidMulticall.CallType',
            name: 'callType',
            type: 'uint8',
          },
          { internalType: 'address', name: 'target', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'bytes', name: 'callData', type: 'bytes' },
          { internalType: 'bytes', name: 'payload', type: 'bytes' },
        ],
        internalType: 'struct ISquidMulticall.Call[]',
        name: 'calls',
        type: 'tuple[]',
      },
      { internalType: 'string', name: 'bridgedTokenSymbol', type: 'string' },
      { internalType: 'string', name: 'destinationChain', type: 'string' },
      { internalType: 'string', name: 'destinationAddress', type: 'string' },
      { internalType: 'bytes', name: 'payload', type: 'bytes' },
      { internalType: 'address', name: 'gasRefundRecipient', type: 'address' },
      { internalType: 'bool', name: 'enableExpress', type: 'bool' },
    ],
    name: 'callBridgeCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
