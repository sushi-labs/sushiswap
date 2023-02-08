export const routeProcessorAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_bentoBox',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
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
        name: 'amountOutMin',
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
    ],
    name: 'processRoute',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
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
        name: 'amountOutMin',
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
    ],
    name: 'transferValueAndprocessRoute',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const
