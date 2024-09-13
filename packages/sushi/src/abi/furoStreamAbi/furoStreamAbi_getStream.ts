export const furoStreamAbi_getStream = [
  {
    inputs: [{ internalType: 'uint256', name: 'streamId', type: 'uint256' }],
    name: 'getStream',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint128', name: 'depositedShares', type: 'uint128' },
          { internalType: 'uint128', name: 'withdrawnShares', type: 'uint128' },
          { internalType: 'uint64', name: 'startTime', type: 'uint64' },
          { internalType: 'uint64', name: 'endTime', type: 'uint64' },
        ],
        internalType: 'struct IFuroStream.Stream',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
