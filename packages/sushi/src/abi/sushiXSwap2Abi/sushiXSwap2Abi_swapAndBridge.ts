export const sushiXSwap2Abi_swapAndBridge = [
  {
    inputs: [
      {
        components: [
          { internalType: 'bytes2', name: 'refId', type: 'bytes2' },
          { internalType: 'address', name: 'adapter', type: 'address' },
          { internalType: 'address', name: 'tokenIn', type: 'address' },
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'bytes', name: 'adapterData', type: 'bytes' },
        ],
        internalType: 'struct ISushiXSwapV2.BridgeParams',
        name: '_bridgeParams',
        type: 'tuple',
      },
      { internalType: 'address', name: '_refundAddress', type: 'address' },
      { internalType: 'bytes', name: '_swapData', type: 'bytes' },
      { internalType: 'bytes', name: '_swapPayload', type: 'bytes' },
      { internalType: 'bytes', name: '_payloadData', type: 'bytes' },
    ],
    name: 'swapAndBridge',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
