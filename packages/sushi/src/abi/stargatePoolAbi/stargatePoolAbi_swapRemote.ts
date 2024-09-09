export const stargatePoolAbi_swapRemote = [
  {
    inputs: [
      { internalType: 'uint16', name: '_srcChainId', type: 'uint16' },
      { internalType: 'uint256', name: '_srcPoolId', type: 'uint256' },
      { internalType: 'address', name: '_to', type: 'address' },
      {
        components: [
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'eqFee', type: 'uint256' },
          { internalType: 'uint256', name: 'eqReward', type: 'uint256' },
          { internalType: 'uint256', name: 'lpFee', type: 'uint256' },
          { internalType: 'uint256', name: 'protocolFee', type: 'uint256' },
          { internalType: 'uint256', name: 'lkbRemove', type: 'uint256' },
        ],
        internalType: 'struct Pool.SwapObj',
        name: '_s',
        type: 'tuple',
      },
    ],
    name: 'swapRemote',
    outputs: [{ internalType: 'uint256', name: 'amountLD', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
