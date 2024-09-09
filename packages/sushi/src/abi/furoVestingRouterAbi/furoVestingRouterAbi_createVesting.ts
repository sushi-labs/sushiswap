export const furoVestingRouterAbi_createVesting = [
  {
    inputs: [
      {
        components: [
          { internalType: 'contract IERC20', name: 'token', type: 'address' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint32', name: 'start', type: 'uint32' },
          { internalType: 'uint32', name: 'cliffDuration', type: 'uint32' },
          { internalType: 'uint32', name: 'stepDuration', type: 'uint32' },
          { internalType: 'uint32', name: 'steps', type: 'uint32' },
          { internalType: 'uint128', name: 'stepPercentage', type: 'uint128' },
          { internalType: 'uint128', name: 'amount', type: 'uint128' },
          { internalType: 'bool', name: 'fromBentoBox', type: 'bool' },
        ],
        internalType: 'struct IFuroVesting.VestParams',
        name: 'vestParams',
        type: 'tuple',
      },
      { internalType: 'uint256', name: 'minShare', type: 'uint256' },
    ],
    name: 'createVesting',
    outputs: [
      { internalType: 'uint256', name: 'depositedShares', type: 'uint256' },
      { internalType: 'uint256', name: 'vestId', type: 'uint256' },
      { internalType: 'uint128', name: 'stepShares', type: 'uint128' },
      { internalType: 'uint128', name: 'cliffShares', type: 'uint128' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
