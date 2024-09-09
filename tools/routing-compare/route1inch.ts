import { ChainId } from 'sushi'
import { Token } from 'sushi/currency'
import { Abi, Address, Hex, decodeFunctionResult } from 'viem'
import { createClient } from './multicall3Advanced.js'
import { whales } from './whales.js'

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

export const OneEachAbi: Abi = [
  {
    inputs: [{ internalType: 'contract IWETH', name: 'weth', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'AdvanceEpochFailed', type: 'error' },
  { inputs: [], name: 'ArbitraryStaticCallFailed', type: 'error' },
  { inputs: [], name: 'BadCurveSwapSelector', type: 'error' },
  { inputs: [], name: 'BadPool', type: 'error' },
  { inputs: [], name: 'BadSignature', type: 'error' },
  { inputs: [], name: 'BitInvalidatedOrder', type: 'error' },
  { inputs: [], name: 'ETHTransferFailed', type: 'error' },
  { inputs: [], name: 'ETHTransferFailed', type: 'error' },
  { inputs: [], name: 'EnforcedPause', type: 'error' },
  {
    inputs: [],
    name: 'EpochManagerAndBitInvalidatorsAreIncompatible',
    type: 'error',
  },
  { inputs: [], name: 'EthDepositRejected', type: 'error' },
  { inputs: [], name: 'ExpectedPause', type: 'error' },
  { inputs: [], name: 'InsufficientBalance', type: 'error' },
  { inputs: [], name: 'InvalidMsgValue', type: 'error' },
  { inputs: [], name: 'InvalidMsgValue', type: 'error' },
  { inputs: [], name: 'InvalidPermit2Transfer', type: 'error' },
  { inputs: [], name: 'InvalidShortString', type: 'error' },
  { inputs: [], name: 'InvalidatedOrder', type: 'error' },
  { inputs: [], name: 'MakingAmountTooLow', type: 'error' },
  { inputs: [], name: 'MismatchArraysLengths', type: 'error' },
  { inputs: [], name: 'OrderExpired', type: 'error' },
  { inputs: [], name: 'OrderIsNotSuitableForMassInvalidation', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  { inputs: [], name: 'PartialFillNotAllowed', type: 'error' },
  { inputs: [], name: 'Permit2TransferAmountTooHigh', type: 'error' },
  { inputs: [], name: 'PredicateIsNotTrue', type: 'error' },
  { inputs: [], name: 'PrivateOrder', type: 'error' },
  { inputs: [], name: 'ReentrancyDetected', type: 'error' },
  { inputs: [], name: 'RemainingInvalidatedOrder', type: 'error' },
  { inputs: [], name: 'ReservesCallFailed', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'result', type: 'uint256' },
      { internalType: 'uint256', name: 'minReturn', type: 'uint256' },
    ],
    name: 'ReturnAmountIsNotEnough',
    type: 'error',
  },
  { inputs: [], name: 'SafeTransferFailed', type: 'error' },
  { inputs: [], name: 'SafeTransferFromFailed', type: 'error' },
  {
    inputs: [
      { internalType: 'bool', name: 'success', type: 'bool' },
      { internalType: 'bytes', name: 'res', type: 'bytes' },
    ],
    name: 'SimulationResults',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'string', name: 'str', type: 'string' }],
    name: 'StringTooLong',
    type: 'error',
  },
  { inputs: [], name: 'SwapWithZeroAmount', type: 'error' },
  { inputs: [], name: 'TakingAmountExceeded', type: 'error' },
  { inputs: [], name: 'TakingAmountTooHigh', type: 'error' },
  { inputs: [], name: 'TransferFromMakerToTakerFailed', type: 'error' },
  { inputs: [], name: 'TransferFromTakerToMakerFailed', type: 'error' },
  { inputs: [], name: 'WrongSeriesNonce', type: 'error' },
  { inputs: [], name: 'ZeroAddress', type: 'error' },
  { inputs: [], name: 'ZeroMinReturn', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'maker',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'slotIndex',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'slotValue',
        type: 'uint256',
      },
    ],
    name: 'BitInvalidatorUpdated',
    type: 'event',
  },
  { anonymous: false, inputs: [], name: 'EIP712DomainChanged', type: 'event' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'maker',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'series',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newEpoch',
        type: 'uint256',
      },
    ],
    name: 'EpochIncreased',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'orderHash',
        type: 'bytes32',
      },
    ],
    name: 'OrderCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'orderHash',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'remainingAmount',
        type: 'uint256',
      },
    ],
    name: 'OrderFilled',
    type: 'event',
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
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'uint96', name: 'series', type: 'uint96' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'advanceEpoch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'offsets', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'and',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'target', type: 'address' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'arbitraryStaticCall',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'maker', type: 'address' },
      { internalType: 'uint256', name: 'slot', type: 'uint256' },
    ],
    name: 'bitInvalidatorForOrder',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'MakerTraits', name: 'makerTraits', type: 'uint256' },
      { internalType: 'uint256', name: 'additionalMask', type: 'uint256' },
    ],
    name: 'bitsInvalidateForOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'MakerTraits', name: 'makerTraits', type: 'uint256' },
      { internalType: 'bytes32', name: 'orderHash', type: 'bytes32' },
    ],
    name: 'cancelOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'MakerTraits[]', name: 'makerTraits', type: 'uint256[]' },
      { internalType: 'bytes32[]', name: 'orderHashes', type: 'bytes32[]' },
    ],
    name: 'cancelOrders',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: 'predicate', type: 'bytes' }],
    name: 'checkPredicate',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IClipperExchange',
        name: 'clipperExchange',
        type: 'address',
      },
      { internalType: 'Address', name: 'srcToken', type: 'uint256' },
      { internalType: 'contract IERC20', name: 'dstToken', type: 'address' },
      { internalType: 'uint256', name: 'inputAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'outputAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'goodUntil', type: 'uint256' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 'vs', type: 'bytes32' },
    ],
    name: 'clipperSwap',
    outputs: [
      { internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IClipperExchange',
        name: 'clipperExchange',
        type: 'address',
      },
      { internalType: 'address payable', name: 'recipient', type: 'address' },
      { internalType: 'Address', name: 'srcToken', type: 'uint256' },
      { internalType: 'contract IERC20', name: 'dstToken', type: 'address' },
      { internalType: 'uint256', name: 'inputAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'outputAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'goodUntil', type: 'uint256' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 'vs', type: 'bytes32' },
    ],
    name: 'clipperSwapTo',
    outputs: [
      { internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: 'inCoin', type: 'address' },
      { internalType: 'uint256', name: 'dx', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'curveSwapCallback',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { internalType: 'bytes1', name: 'fields', type: 'bytes1' },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'version', type: 'string' },
      { internalType: 'uint256', name: 'chainId', type: 'uint256' },
      { internalType: 'address', name: 'verifyingContract', type: 'address' },
      { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
      { internalType: 'uint256[]', name: 'extensions', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'maker', type: 'address' },
      { internalType: 'uint96', name: 'series', type: 'uint96' },
    ],
    name: 'epoch',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'maker', type: 'address' },
      { internalType: 'uint256', name: 'series', type: 'uint256' },
      { internalType: 'uint256', name: 'makerEpoch', type: 'uint256' },
    ],
    name: 'epochEquals',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'eq',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'minReturn', type: 'uint256' },
      { internalType: 'Address', name: 'dex', type: 'uint256' },
    ],
    name: 'ethUnoswap',
    outputs: [
      { internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'minReturn', type: 'uint256' },
      { internalType: 'Address', name: 'dex', type: 'uint256' },
      { internalType: 'Address', name: 'dex2', type: 'uint256' },
    ],
    name: 'ethUnoswap2',
    outputs: [
      { internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'minReturn', type: 'uint256' },
      { internalType: 'Address', name: 'dex', type: 'uint256' },
      { internalType: 'Address', name: 'dex2', type: 'uint256' },
      { internalType: 'Address', name: 'dex3', type: 'uint256' },
    ],
    name: 'ethUnoswap3',
    outputs: [
      { internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'Address', name: 'to', type: 'uint256' },
      { internalType: 'uint256', name: 'minReturn', type: 'uint256' },
      { internalType: 'Address', name: 'dex', type: 'uint256' },
    ],
    name: 'ethUnoswapTo',
    outputs: [
      { internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'Address', name: 'to', type: 'uint256' },
      { internalType: 'uint256', name: 'minReturn', type: 'uint256' },
      { internalType: 'Address', name: 'dex', type: 'uint256' },
      { internalType: 'Address', name: 'dex2', type: 'uint256' },
    ],
    name: 'ethUnoswapTo2',
    outputs: [
      { internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'Address', name: 'to', type: 'uint256' },
      { internalType: 'uint256', name: 'minReturn', type: 'uint256' },
      { internalType: 'Address', name: 'dex', type: 'uint256' },
      { internalType: 'Address', name: 'dex2', type: 'uint256' },
      { internalType: 'Address', name: 'dex3', type: 'uint256' },
    ],
    name: 'ethUnoswapTo3',
    outputs: [
      { internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
          { internalType: 'Address', name: 'maker', type: 'uint256' },
          { internalType: 'Address', name: 'receiver', type: 'uint256' },
          { internalType: 'Address', name: 'makerAsset', type: 'uint256' },
          { internalType: 'Address', name: 'takerAsset', type: 'uint256' },
          { internalType: 'uint256', name: 'makingAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'takingAmount', type: 'uint256' },
          { internalType: 'MakerTraits', name: 'makerTraits', type: 'uint256' },
        ],
        internalType: 'struct IOrderMixin.Order',
        name: 'order',
        type: 'tuple',
      },
      { internalType: 'bytes', name: 'signature', type: 'bytes' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'TakerTraits', name: 'takerTraits', type: 'uint256' },
    ],
    name: 'fillContractOrder',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'bytes32', name: '', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
          { internalType: 'Address', name: 'maker', type: 'uint256' },
          { internalType: 'Address', name: 'receiver', type: 'uint256' },
          { internalType: 'Address', name: 'makerAsset', type: 'uint256' },
          { internalType: 'Address', name: 'takerAsset', type: 'uint256' },
          { internalType: 'uint256', name: 'makingAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'takingAmount', type: 'uint256' },
          { internalType: 'MakerTraits', name: 'makerTraits', type: 'uint256' },
        ],
        internalType: 'struct IOrderMixin.Order',
        name: 'order',
        type: 'tuple',
      },
      { internalType: 'bytes', name: 'signature', type: 'bytes' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'TakerTraits', name: 'takerTraits', type: 'uint256' },
      { internalType: 'bytes', name: 'args', type: 'bytes' },
    ],
    name: 'fillContractOrderArgs',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'bytes32', name: '', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
          { internalType: 'Address', name: 'maker', type: 'uint256' },
          { internalType: 'Address', name: 'receiver', type: 'uint256' },
          { internalType: 'Address', name: 'makerAsset', type: 'uint256' },
          { internalType: 'Address', name: 'takerAsset', type: 'uint256' },
          { internalType: 'uint256', name: 'makingAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'takingAmount', type: 'uint256' },
          { internalType: 'MakerTraits', name: 'makerTraits', type: 'uint256' },
        ],
        internalType: 'struct IOrderMixin.Order',
        name: 'order',
        type: 'tuple',
      },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 'vs', type: 'bytes32' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'TakerTraits', name: 'takerTraits', type: 'uint256' },
    ],
    name: 'fillOrder',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'bytes32', name: '', type: 'bytes32' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
          { internalType: 'Address', name: 'maker', type: 'uint256' },
          { internalType: 'Address', name: 'receiver', type: 'uint256' },
          { internalType: 'Address', name: 'makerAsset', type: 'uint256' },
          { internalType: 'Address', name: 'takerAsset', type: 'uint256' },
          { internalType: 'uint256', name: 'makingAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'takingAmount', type: 'uint256' },
          { internalType: 'MakerTraits', name: 'makerTraits', type: 'uint256' },
        ],
        internalType: 'struct IOrderMixin.Order',
        name: 'order',
        type: 'tuple',
      },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 'vs', type: 'bytes32' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'TakerTraits', name: 'takerTraits', type: 'uint256' },
      { internalType: 'bytes', name: 'args', type: 'bytes' },
    ],
    name: 'fillOrderArgs',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'bytes32', name: '', type: 'bytes32' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'gt',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'uint256', name: 'salt', type: 'uint256' },
          { internalType: 'Address', name: 'maker', type: 'uint256' },
          { internalType: 'Address', name: 'receiver', type: 'uint256' },
          { internalType: 'Address', name: 'makerAsset', type: 'uint256' },
          { internalType: 'Address', name: 'takerAsset', type: 'uint256' },
          { internalType: 'uint256', name: 'makingAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'takingAmount', type: 'uint256' },
          { internalType: 'MakerTraits', name: 'makerTraits', type: 'uint256' },
        ],
        internalType: 'struct IOrderMixin.Order',
        name: 'order',
        type: 'tuple',
      },
    ],
    name: 'hashOrder',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint96', name: 'series', type: 'uint96' }],
    name: 'increaseEpoch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'lt',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
    name: 'not',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'offsets', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'or',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes', name: 'permit', type: 'bytes' },
      { internalType: 'bytes', name: 'action', type: 'bytes' },
    ],
    name: 'permitAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'maker', type: 'address' },
      { internalType: 'bytes32', name: 'orderHash', type: 'bytes32' },
    ],
    name: 'rawRemainingInvalidatorForOrder',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'maker', type: 'address' },
      { internalType: 'bytes32', name: 'orderHash', type: 'bytes32' },
    ],
    name: 'remainingInvalidatorForOrder',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
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
      { internalType: 'contract IERC20', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'rescueFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'target', type: 'address' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'simulate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IAggregationExecutor',
        name: 'executor',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'contract IERC20',
            name: 'srcToken',
            type: 'address',
          },
          {
            internalType: 'contract IERC20',
            name: 'dstToken',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'srcReceiver',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'dstReceiver',
            type: 'address',
          },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'minReturnAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'flags', type: 'uint256' },
        ],
        internalType: 'struct GenericRouter.SwapDescription',
        name: 'desc',
        type: 'tuple',
      },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'swap',
    outputs: [
      { internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'spentAmount', type: 'uint256' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'int256', name: 'amount0Delta', type: 'int256' },
      { internalType: 'int256', name: 'amount1Delta', type: 'int256' },
      { internalType: 'bytes', name: '', type: 'bytes' },
    ],
    name: 'uniswapV3SwapCallback',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'Address', name: 'token', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'minReturn', type: 'uint256' },
      { internalType: 'Address', name: 'dex', type: 'uint256' },
    ],
    name: 'unoswap',
    outputs: [
      { internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'Address', name: 'token', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'minReturn', type: 'uint256' },
      { internalType: 'Address', name: 'dex', type: 'uint256' },
      { internalType: 'Address', name: 'dex2', type: 'uint256' },
    ],
    name: 'unoswap2',
    outputs: [
      { internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'Address', name: 'token', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'minReturn', type: 'uint256' },
      { internalType: 'Address', name: 'dex', type: 'uint256' },
      { internalType: 'Address', name: 'dex2', type: 'uint256' },
      { internalType: 'Address', name: 'dex3', type: 'uint256' },
    ],
    name: 'unoswap3',
    outputs: [
      { internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'Address', name: 'to', type: 'uint256' },
      { internalType: 'Address', name: 'token', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'minReturn', type: 'uint256' },
      { internalType: 'Address', name: 'dex', type: 'uint256' },
    ],
    name: 'unoswapTo',
    outputs: [
      { internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'Address', name: 'to', type: 'uint256' },
      { internalType: 'Address', name: 'token', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'minReturn', type: 'uint256' },
      { internalType: 'Address', name: 'dex', type: 'uint256' },
      { internalType: 'Address', name: 'dex2', type: 'uint256' },
    ],
    name: 'unoswapTo2',
    outputs: [
      { internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'Address', name: 'to', type: 'uint256' },
      { internalType: 'Address', name: 'token', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'minReturn', type: 'uint256' },
      { internalType: 'Address', name: 'dex', type: 'uint256' },
      { internalType: 'Address', name: 'dex2', type: 'uint256' },
      { internalType: 'Address', name: 'dex3', type: 'uint256' },
    ],
    name: 'unoswapTo3',
    outputs: [
      { internalType: 'uint256', name: 'returnAmount', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
]

export async function OneInchBrowserRoute(
  chainId: ChainId,
  from: Token,
  to: Token,
  amountIn: bigint,
  gasPrice: bigint,
): Promise<bigint | undefined> {
  // pretending a browser
  const url =
    `https://proxy-app.1inch.io/v2.0/v1.5/chain/${chainId}/router/v6/quotes?` +
    `fromTokenAddress=${from.address}&toTokenAddress=${to.address}&amount=${amountIn}` +
    `&gasPrice=${gasPrice}&preset=maxReturnResult&isTableEnabled=true`
  const resp = await fetch(url, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en',
      authorization:
        'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjljMjlkNzdjLTU5MWItNGM1Yy1hM2EwLWNlMGMxMWU2Nzk1NiIsImV4cCI6MTcyNTI5Mjg0MSwiZGV2aWNlIjoiYnJvd3NlciIsImlhdCI6MTcyNTI4OTI0MX0.0hRJ5EEt9alBdwWAPp_C15UXUONSMbDhhpQhcRyriU_Vzimzu3NT3JAk4b5BU5hRGBcjVLzqmtBaXxD9ohzqMQ',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      priority: 'u=1, i',
      'sec-ch-ua':
        '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'x-session-id': 'c76482d0-923b-4fec-9353-e779fbc33896',
      'x-user-id': 'b9abfb7b-8cca-4479-97f4-630a441748ed',
    },
    referrer: 'https://app.1inch.io/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  })
  if (resp.status !== 200) return
  const route = (await resp.json()) as {
    bestResult: { toTokenAmount: string }
  }
  if (route?.bestResult?.toTokenAmount === undefined) return
  return BigInt(route?.bestResult?.toTokenAmount)
}

const oneInchApiKeys = (process.env['ONE_INCH_API_KEYS'] || '')
  .replaceAll(/ +/g, '')
  .split(',')
let next1inchKeyIndex = 0
// unfortunately it is impossible to obtain price impact
async function OneInchAPIRoute(
  chainId: ChainId,
  from: Token,
  to: Token,
  amountIn: bigint,
  gasPrice: bigint,
): Promise<bigint | undefined> {
  if (oneInchApiKeys.length === 0) return
  const apiKey = oneInchApiKeys[next1inchKeyIndex++]
  if (next1inchKeyIndex >= oneInchApiKeys.length) next1inchKeyIndex = 0

  const url =
    `https://api.1inch.dev/swap/v6.0/${chainId}/quote?` +
    `src=${from.address}&dst=${to.address}&amount=${amountIn}` +
    `&gasPrice=${gasPrice}&preset=maxReturnResult&isTableEnabled=true`

  for (let n = 0; n < 10; ++n) {
    const resp = await fetch(url, {
      headers: {
        authorization: `Bearer ${apiKey}`,
      },
    })
    if (resp.status === 429) {
      // The limit of requests per second has been exceeded
      delay(300)
      continue
    }
    if (resp.status !== 200) {
      //console.log(resp.status, apiKey, await resp.text())
      return
    }
    const route = (await resp.json()) as {
      dstAmount: number
    }
    if (route?.dstAmount === undefined) return
    return BigInt(route?.dstAmount)
  }

  return undefined
}

export async function OneInchRoute(
  chainId: ChainId,
  from: Token,
  to: Token,
  amountIn: bigint,
  gasPrice: bigint,
): Promise<bigint | undefined> {
  return OneInchAPIRoute(chainId, from, to, amountIn, gasPrice)
}

export async function OneInchAPIRouteSimulate(
  chainId: ChainId,
  from: Token,
  to: Token,
  amountIn: bigint,
  gasPrice: bigint,
): Promise<bigint | undefined> {
  const whale = whales[chainId]?.[from.address]
  if (whale === undefined) return undefined

  if (oneInchApiKeys.length === 0) return
  const apiKey = oneInchApiKeys[next1inchKeyIndex++]
  if (next1inchKeyIndex >= oneInchApiKeys.length) next1inchKeyIndex = 0

  const url =
    `https://api.1inch.dev/swap/v6.0/${chainId}/swap?` +
    `src=${from.address}&dst=${to.address}&amount=${amountIn}&from=${whale}&origin=${whale}` +
    `&gasPrice=${gasPrice}&preset=maxReturnResult&isTableEnabled=true&slippage=50`

  for (let n = 0; n < 10; ++n) {
    const resp = await fetch(url, {
      headers: {
        authorization: `Bearer ${apiKey}`,
      },
    })
    if (resp.status === 429) {
      // The limit of requests per second has been exceeded
      delay(300)
      continue
    }
    if (resp.status !== 200) {
      console.log(resp.status, await resp.text())
      return
    }
    const route = (await resp.json()) as {
      dstAmount: number
      tx: {
        from: Address
        to: Address
        data: Hex
      }
    }
    const client = createClient(chainId)
    //console.log(route.tx.data.substring(0, 10))
    try {
      const ret = (await client.call({
        account: whale,
        to: route.tx.to,
        data: route.tx.data,
        value:
          from.address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
            ? amountIn
            : undefined,
      })) as { data: Hex }
      console.log(ret)
      if (ret?.data === undefined) return
      const res = decodeFunctionResult({
        abi: OneEachAbi,
        functionName: 'swap',
        data: ret.data,
      }) as [bigint, bigint]
      console.log(res, route.dstAmount)
      return BigInt(res[0])
    } catch (_e) {
      console.log('11', _e)
      return
    }
    /*let initialOutputBalance = 0n
    let amountOut = 0n
    const calls: CallData[] = [
      {
        action: 'Check initial user output balance',
        target: to,
        functionName: 'balanceOf',
        args: [whale],
        validate(value: bigint) {
          initialOutputBalance = value
          return undefined
        },
      },
      {
        action: 'Call router',
        target: route.tx.to,
        abi: OneEachAbi,
        callData: route.tx.data,
        value:
          from.address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
            ? amountIn
            : undefined,
      },
      {
        action: 'Check final user output balance',
        target: to,
        functionName: 'balanceOf',
        args: [whale],
        validate(value: bigint) {
          amountOut = value - initialOutputBalance
          return undefined
        },
      },
    ]

    const res = await aggregate3({
      chainId,
      account: whale,
      calls,
    })
    if (res) console.log(res)
    else return amountOut
    return*/
  }

  return undefined
}
