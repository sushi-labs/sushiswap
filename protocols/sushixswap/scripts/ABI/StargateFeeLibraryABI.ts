export const StargateFeeLibraryABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_factory',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_lpStakingContract',
        type: 'address',
      },
      {
        internalType: 'int256',
        name: '_depegThreshold',
        type: 'int256',
      },
    ],
    stateMutability: 'nonpayable',
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
    inputs: [],
    name: 'DELTA_1',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'DELTA_2',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'DENOMINATOR',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'FIFTY_PERCENT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'LAMBDA_1',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'LAMBDA_2',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'LP_FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PROTOCOL_FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PROTOCOL_SUBSIDY',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SIXTY_PERCENT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'depegThreshold',
    outputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'factory',
    outputs: [
      {
        internalType: 'contract Factory',
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
        internalType: 'uint256',
        name: '_amountSD',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_currentAssetSD',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_lpAsset',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_rewardPoolSize',
        type: 'uint256',
      },
    ],
    name: 'getEqReward',
    outputs: [
      {
        internalType: 'uint256',
        name: 'eqReward',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'idealBalance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'beforeBalance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountSD',
        type: 'uint256',
      },
    ],
    name: 'getEquilibriumFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_srcPoolId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_dstPoolId',
        type: 'uint256',
      },
      {
        internalType: 'uint16',
        name: '_dstChainId',
        type: 'uint16',
      },
      {
        internalType: 'address',
        name: '_from',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amountSD',
        type: 'uint256',
      },
    ],
    name: 'getFees',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'eqFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'eqReward',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lpFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lkbRemove',
            type: 'uint256',
          },
        ],
        internalType: 'struct Pool.SwapObj',
        name: 's',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amountSD',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_currentAssetSD',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_lpAsset',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_protocolSubsidy',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_srcPoolId',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'bool',
            name: 'ready',
            type: 'bool',
          },
          {
            internalType: 'uint16',
            name: 'dstChainId',
            type: 'uint16',
          },
          {
            internalType: 'uint256',
            name: 'dstPoolId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'weight',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lkb',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'credits',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'idealBalance',
            type: 'uint256',
          },
        ],
        internalType: 'struct Pool.ChainPath',
        name: '_chainPath',
        type: 'tuple',
      },
    ],
    name: 'getProtocolAndLpFee',
    outputs: [
      {
        internalType: 'uint256',
        name: 'protocolFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lpFee',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'lambda',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'yOffset',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'xUpperBound',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'xLowerBound',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'xStart',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'xEnd',
        type: 'uint256',
      },
    ],
    name: 'getTrapezoidArea',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getVersion',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lpStaking',
    outputs: [
      {
        internalType: 'contract IStargateLPStaking',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
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
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'poolIdToLpId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'poolIdToPriceFeed',
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
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'int256',
        name: '_depegThreshold',
        type: 'int256',
      },
    ],
    name: 'setDepegThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_priceFeedAddress',
        type: 'address',
      },
    ],
    name: 'setPoolIdToPriceFeedAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_lpId',
        type: 'uint256',
      },
    ],
    name: 'setPoolToLpId',
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
        name: '_from',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_whiteListed',
        type: 'bool',
      },
    ],
    name: 'whiteList',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'whitelist',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]
