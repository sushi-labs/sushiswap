export const furoStreamAbi_streams = [
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'streams',
    outputs: [
      { internalType: 'address', name: 'sender', type: 'address' },
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint128', name: 'depositedShares', type: 'uint128' },
      { internalType: 'uint128', name: 'withdrawnShares', type: 'uint128' },
      { internalType: 'uint64', name: 'startTime', type: 'uint64' },
      { internalType: 'uint64', name: 'endTime', type: 'uint64' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
