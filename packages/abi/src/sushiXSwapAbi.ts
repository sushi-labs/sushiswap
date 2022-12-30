export const sushiXSwapAbi = [
  {
    inputs: [
      {
        internalType: 'contract IBentoBoxMinimal',
        name: '_bentoBox',
        type: 'address',
      },
      {
        internalType: 'contract IStargateRouter',
        name: '_stargateRouter',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_factory',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '_pairCodeHash',
        type: 'bytes32',
      },
      {
        internalType: 'contract IStargateWidget',
        name: '_stargateWidget',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'NotStargateRouter',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TooLittleReceived',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'srcContext',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'failed',
        type: 'bool',
      },
    ],
    name: 'StargateSushiXSwapDst',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'srcContext',
        type: 'bytes32',
      },
    ],
    name: 'StargateSushiXSwapSrc',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'approveToStargateRouter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
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
        internalType: 'uint8[]',
        name: 'actions',
        type: 'uint8[]',
      },
      {
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes[]',
        name: 'datas',
        type: 'bytes[]',
      },
    ],
    name: 'cook',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'factory',
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
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '_dstChainId',
        type: 'uint16',
      },
      {
        internalType: 'uint8',
        name: '_functionType',
        type: 'uint8',
      },
      {
        internalType: 'address',
        name: '_receiver',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_gas',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_dustAmount',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_payload',
        type: 'bytes',
      },
    ],
    name: 'getFee',
    outputs: [
      {
        internalType: 'uint256',
        name: 'a',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'b',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pairCodeHash',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountLD',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'payload',
        type: 'bytes',
      },
    ],
    name: 'sgReceive',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stargateRouter',
    outputs: [
      {
        internalType: 'contract IStargateRouter',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stargateWidget',
    outputs: [
      {
        internalType: 'contract IStargateWidget',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const
