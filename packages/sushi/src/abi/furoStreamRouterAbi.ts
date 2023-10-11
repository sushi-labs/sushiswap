export const furoStreamRouterAbi = [
  {
    inputs: [
      {
        internalType: 'contract IBentoBoxMinimal',
        name: '_bentoBox',
        type: 'address',
      },
      {
        internalType: 'contract IFuroStream',
        name: '_furoStream',
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
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint64',
        name: 'startTime',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'endTime',
        type: 'uint64',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'fromBentoBox',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'minShare',
        type: 'uint256',
      },
    ],
    name: 'createStream',
    outputs: [
      {
        internalType: 'uint256',
        name: 'streamId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'depositedShares',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'furoStream',
    outputs: [
      {
        internalType: 'contract IFuroStream',
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
