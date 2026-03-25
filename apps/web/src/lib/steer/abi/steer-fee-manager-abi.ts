export const steerFeeManagerAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address',
      },
    ],
    name: 'AdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'Upgraded',
    type: 'event',
  },
  {
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    inputs: [],
    name: 'admin',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newAdmin',
        type: 'address',
      },
    ],
    name: 'changeAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'implementation',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address',
      },
    ],
    name: 'BeaconUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string[]',
        name: 'feeIdentifier',
        type: 'string[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'feeValue',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'withdrawer',
        type: 'address[]',
      },
    ],
    name: 'FeeUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'feeIdentifier',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
    ],
    name: 'FeeWithdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string[]',
        name: 'feeIdentifier',
        type: 'string[]',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'to',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'amount0',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'amount1',
        type: 'uint256[]',
      },
    ],
    name: 'FeesWithdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'vaults',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'string[][]',
        name: 'feeIdentifiers',
        type: 'string[][]',
      },
      {
        indexed: false,
        internalType: 'address[][]',
        name: 'to',
        type: 'address[][]',
      },
      {
        indexed: false,
        internalType: 'uint256[][]',
        name: 'amount0',
        type: 'uint256[][]',
      },
      {
        indexed: false,
        internalType: 'uint256[][]',
        name: 'amount1',
        type: 'uint256[][]',
      },
    ],
    name: 'FeesWithdrawnFromMultipleVaults',
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
    inputs: [
      {
        internalType: 'string[]',
        name: 'stringArray',
        type: 'string[]',
      },
    ],
    name: 'areAllUnique',
    outputs: [],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'feeIdentifier',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'newWithdrawer',
        type: 'address',
      },
    ],
    name: 'changeFeeWithdrawer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
    ],
    name: 'getFees',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'feeIdentifier',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'feeValue',
            type: 'uint256',
          },
        ],
        internalType: 'struct FeeManager.Fee[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_vaultRegistry',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
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
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'totalVaultFees',
        type: 'uint256',
      },
      {
        internalType: 'string[]',
        name: 'feeIdentifier',
        type: 'string[]',
      },
      {
        internalType: 'uint256[]',
        name: 'feeValue',
        type: 'uint256[]',
      },
      {
        internalType: 'address[]',
        name: 'withdrawer',
        type: 'address[]',
      },
    ],
    name: 'setDefaultFeeAndWithdrawalPermission',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'string[]',
        name: 'feeIdentifier',
        type: 'string[]',
      },
      {
        internalType: 'uint256[]',
        name: 'feeValue',
        type: 'uint256[]',
      },
      {
        internalType: 'address[]',
        name: 'withdrawer',
        type: 'address[]',
      },
    ],
    name: 'setFeeAndWithdrawalPermission',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'setMigratedVaultFeeAndWithdrawalPermission',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'newTotalFees',
        type: 'uint256',
      },
    ],
    name: 'setTotalFees',
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
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'vaultFees',
    outputs: [
      {
        internalType: 'string',
        name: 'feeIdentifier',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'feeValue',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vaultRegistry',
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
        name: 'vault',
        type: 'address',
      },
    ],
    name: 'vaultTotalFees',
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
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'feeIdentifier',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
    ],
    name: 'withdrawFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'vaults',
        type: 'address[]',
      },
      {
        internalType: 'string[][]',
        name: 'feeIdentifiers',
        type: 'string[][]',
      },
      {
        internalType: 'uint256[][]',
        name: 'amount0',
        type: 'uint256[][]',
      },
      {
        internalType: 'uint256[][]',
        name: 'amount1',
        type: 'uint256[][]',
      },
    ],
    name: 'withdrawFeesFromMultipleVaults',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'string[]',
        name: 'feeIdentifiers',
        type: 'string[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amount0',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amount1',
        type: 'uint256[]',
      },
    ],
    name: 'withdrawMultipleFees',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'feeIdentifier',
        type: 'string',
      },
    ],
    name: 'withdrawalPermissions',
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
