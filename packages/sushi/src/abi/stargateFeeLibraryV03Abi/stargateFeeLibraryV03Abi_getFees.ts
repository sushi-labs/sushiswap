export const stargateFeeLibraryV03Abi_getFees = [
  {
    inputs: [
      { internalType: 'uint256', name: '_srcPoolId', type: 'uint256' },
      { internalType: 'uint256', name: '_dstPoolId', type: 'uint256' },
      { internalType: 'uint16', name: '_dstChainId', type: 'uint16' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '_amountSD', type: 'uint256' },
    ],
    name: 'getFees',
    outputs: [
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
        name: 's',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
