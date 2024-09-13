export const furoVestingAbi_vests = [
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'vests',
    outputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'contract IERC20', name: 'token', type: 'address' },
      { internalType: 'uint32', name: 'start', type: 'uint32' },
      { internalType: 'uint32', name: 'cliffDuration', type: 'uint32' },
      { internalType: 'uint32', name: 'stepDuration', type: 'uint32' },
      { internalType: 'uint32', name: 'steps', type: 'uint32' },
      { internalType: 'uint128', name: 'cliffShares', type: 'uint128' },
      { internalType: 'uint128', name: 'stepShares', type: 'uint128' },
      { internalType: 'uint128', name: 'claimed', type: 'uint128' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
