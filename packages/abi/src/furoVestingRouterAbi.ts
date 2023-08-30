export const furoVestingRouterAbi = [
  {
    inputs: [
      {
        internalType: 'contract IBentoBoxMinimal',
        name: '_bentoBox',
        type: 'address',
      },
      {
        internalType: 'contract IFuroVesting',
        name: '_furoVesting',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_wETH',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'InsufficientShares',
    type: 'error',
  },
  {
    inputs: [],
    name: 'bentoBox',
    outputs: [
      {
        internalType: 'contract IBentoBoxMinimal',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'uint32',
            name: 'start',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'cliffDuration',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'stepDuration',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'steps',
            type: 'uint32',
          },
          {
            internalType: 'uint128',
            name: 'stepPercentage',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'amount',
            type: 'uint128',
          },
          {
            internalType: 'bool',
            name: 'fromBentoBox',
            type: 'bool',
          },
        ],
        internalType: 'struct IFuroVesting.VestParams',
        name: 'vestParams',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'minShare',
        type: 'uint256',
      },
    ],
    name: 'createVesting',
    outputs: [
      {
        internalType: 'uint256',
        name: 'depositedShares',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'vestId',
        type: 'uint256',
      },
      {
        internalType: 'uint128',
        name: 'stepShares',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'cliffShares',
        type: 'uint128',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'furoVesting',
    outputs: [
      {
        internalType: 'contract IFuroVesting',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: 'data',
        type: 'bytes[]',
      },
    ],
    name: 'multicall',
    outputs: [
      {
        internalType: 'bytes[]',
        name: 'results',
        type: 'bytes[]',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'setBentoBoxApproval',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'wETH',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
