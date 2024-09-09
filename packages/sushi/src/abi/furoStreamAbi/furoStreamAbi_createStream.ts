export const furoStreamAbi_createStream = [
  {
    inputs: [
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint64', name: 'startTime', type: 'uint64' },
      { internalType: 'uint64', name: 'endTime', type: 'uint64' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'bool', name: 'fromBentoBox', type: 'bool' },
    ],
    name: 'createStream',
    outputs: [
      { internalType: 'uint256', name: 'streamId', type: 'uint256' },
      { internalType: 'uint256', name: 'depositedShares', type: 'uint256' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
