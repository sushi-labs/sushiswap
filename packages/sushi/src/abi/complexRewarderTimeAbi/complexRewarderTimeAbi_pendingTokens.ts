export const complexRewarderTimeAbi_pendingTokens = [
  {
    inputs: [
      { internalType: 'uint256', name: 'pid', type: 'uint256' },
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'pendingTokens',
    outputs: [
      {
        internalType: 'contract IERC20[]',
        name: 'rewardTokens',
        type: 'address[]',
      },
      { internalType: 'uint256[]', name: 'rewardAmounts', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
