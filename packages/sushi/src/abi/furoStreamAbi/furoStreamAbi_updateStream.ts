export const furoStreamAbi_updateStream = [
  {
    inputs: [
      { internalType: 'uint256', name: 'streamId', type: 'uint256' },
      { internalType: 'uint128', name: 'topUpAmount', type: 'uint128' },
      { internalType: 'uint64', name: 'extendTime', type: 'uint64' },
      { internalType: 'bool', name: 'fromBentoBox', type: 'bool' },
    ],
    name: 'updateStream',
    outputs: [
      { internalType: 'uint256', name: 'depositedShares', type: 'uint256' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
