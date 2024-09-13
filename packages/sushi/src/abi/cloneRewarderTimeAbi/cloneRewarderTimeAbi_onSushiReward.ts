export const cloneRewarderTimeAbi_onSushiReward = [
  {
    inputs: [
      { internalType: 'uint256', name: 'pid', type: 'uint256' },
      { internalType: 'address', name: '_user', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: 'lpTokenAmount', type: 'uint256' },
    ],
    name: 'onSushiReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
