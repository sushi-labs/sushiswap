export const stargatePoolAbi_swap = [
  {
    inputs: [
      { internalType: 'uint16', name: '_dstChainId', type: 'uint16' },
      { internalType: 'uint256', name: '_dstPoolId', type: 'uint256' },
      { internalType: 'address', name: '_from', type: 'address' },
      { internalType: 'uint256', name: '_amountLD', type: 'uint256' },
      { internalType: 'uint256', name: '_minAmountLD', type: 'uint256' },
      { internalType: 'bool', name: 'newLiquidity', type: 'bool' },
    ],
    name: 'swap',
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
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
