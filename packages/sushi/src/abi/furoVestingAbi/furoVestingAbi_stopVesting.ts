export const furoVestingAbi_stopVesting = [
  {
    inputs: [
      { internalType: 'uint256', name: 'vestId', type: 'uint256' },
      { internalType: 'bool', name: 'toBentoBox', type: 'bool' },
    ],
    name: 'stopVesting',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
