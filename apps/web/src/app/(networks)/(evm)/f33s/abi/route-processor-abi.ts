export const routeProcessorAbi = [
  {
    inputs: [
      {
        internalType: 'contract IWETH',
        name: 'wrappedNative',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'referralCode',
            type: 'uint32',
          },
          {
            internalType: 'uint16',
            name: 'feePortion',
            type: 'uint16',
          },
          {
            internalType: 'address',
            name: 'feeCollector',
            type: 'address',
          },
          {
            internalType: 'uint16',
            name: 'surplusPortion',
            type: 'uint16',
          },
          {
            internalType: 'address',
            name: 'surplusCollector',
            type: 'address',
          },
        ],
        internalType: 'struct ReferrerData[]',
        name: 'referrersInit',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'payable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint32',
        name: 'referralCode',
        type: 'uint32',
      },
    ],
    name: 'RemoveReferrer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenOut',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'slippage',
        type: 'int256',
      },
      {
        indexed: true,
        internalType: 'uint32',
        name: 'referralCode',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'diagnosticsFirst32',
        type: 'bytes32',
      },
    ],
    name: 'Route',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint32',
        name: 'referralCode',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'feePortion',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'feeCollector',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'surplusPortion',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'surplusCollector',
        type: 'address',
      },
    ],
    name: 'SetReferrer',
    type: 'event',
  },
  {
    stateMutability: 'nonpayable',
    type: 'fallback',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'lockAcquired',
    outputs: [
      {
        internalType: 'bytes',
        name: 'result',
        type: 'bytes',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
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
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'tokenOut',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountOutQuote',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'route',
        type: 'bytes',
      },
      {
        internalType: 'bool',
        name: 'takeSurplus',
        type: 'bool',
      },
      {
        internalType: 'uint32',
        name: 'referralCode',
        type: 'uint32',
      },
    ],
    name: 'processRoute',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'diagnostics',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'transferValueTo',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountValueTransfer',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'tokenOut',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountOutQuote',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'route',
        type: 'bytes',
      },
      {
        internalType: 'bool',
        name: 'takeSurplus',
        type: 'bool',
      },
      {
        internalType: 'uint32',
        name: 'referralCode',
        type: 'uint32',
      },
    ],
    name: 'processRouteWithTransferValueInput',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'diagnostics',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'transferValueTo',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountValueTransfer',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'tokenOut',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountOutQuote',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'route',
        type: 'bytes',
      },
      {
        internalType: 'bool',
        name: 'takeSurplus',
        type: 'bool',
      },
      {
        internalType: 'uint32',
        name: 'referralCode',
        type: 'uint32',
      },
    ],
    name: 'processRouteWithTransferValueOutput',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'diagnostics',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'referralCode',
        type: 'uint32',
      },
    ],
    name: 'removeReferrer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint32',
            name: 'referralCode',
            type: 'uint32',
          },
          {
            internalType: 'uint16',
            name: 'feePortion',
            type: 'uint16',
          },
          {
            internalType: 'address',
            name: 'feeCollector',
            type: 'address',
          },
          {
            internalType: 'uint16',
            name: 'surplusPortion',
            type: 'uint16',
          },
          {
            internalType: 'address',
            name: 'surplusCollector',
            type: 'address',
          },
        ],
        internalType: 'struct ReferrerData',
        name: 'referrer',
        type: 'tuple',
      },
    ],
    name: 'setReferrer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'transferValueTo',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountValueTransfer',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'tokenOut',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountOutQuote',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'route',
        type: 'bytes',
      },
      {
        internalType: 'bool',
        name: 'takeSurplus',
        type: 'bool',
      },
      {
        internalType: 'uint32',
        name: 'referralCode',
        type: 'uint32',
      },
    ],
    name: 'transferValueAndprocessRoute',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'diagnostics',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'int256',
        name: 'amount0Delta',
        type: 'int256',
      },
      {
        internalType: 'int256',
        name: 'amount1Delta',
        type: 'int256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'uniswapV3SwapCallback',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const
