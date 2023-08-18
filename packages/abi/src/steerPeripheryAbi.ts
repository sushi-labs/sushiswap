export const steerPeripheryAbi = [
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
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'params',
            type: 'bytes',
          },
          {
            internalType: 'string',
            name: 'beaconName',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'vaultManager',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'payloadIpfs',
            type: 'string',
          },
        ],
        internalType: 'struct ISteerPeriphery.CVDGParams',
        name: 'cvdgParams',
        type: 'tuple',
      },
    ],
    name: 'createVaultAndDepositGas',
    outputs: [
      {
        internalType: 'address',
        name: 'newVault',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'strategyCreator',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'execBundle',
            type: 'string',
          },
          {
            internalType: 'uint128',
            name: 'maxGasCost',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'maxGasPerAction',
            type: 'uint128',
          },
          {
            internalType: 'bytes',
            name: 'params',
            type: 'bytes',
          },
          {
            internalType: 'string',
            name: 'beaconName',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'vaultManager',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'payloadIpfs',
            type: 'string',
          },
        ],
        internalType: 'struct ISteerPeriphery.CVSParams',
        name: 'cvsParams',
        type: 'tuple',
      },
    ],
    name: 'createVaultAndStrategy',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'newVault',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'strategyCreator',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'execBundle',
            type: 'string',
          },
          {
            internalType: 'uint128',
            name: 'maxGasCost',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'maxGasPerAction',
            type: 'uint128',
          },
          {
            internalType: 'bytes',
            name: 'jobInitParams',
            type: 'bytes',
          },
          {
            internalType: 'string',
            name: 'beaconName',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'vaultManager',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'payloadIpfs',
            type: 'string',
          },
          {
            internalType: 'bytes[]',
            name: 'userProvidedData',
            type: 'bytes[]',
          },
          {
            internalType: 'address[]',
            name: 'targetAddresses',
            type: 'address[]',
          },
          {
            internalType: 'string',
            name: 'jobName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'ipfsForJobDetails',
            type: 'string',
          },
        ],
        internalType: 'struct ISteerPeriphery.CVSRJParams',
        name: 'cvsrjParams',
        type: 'tuple',
      },
    ],
    name: 'createVaultStrategyAndRegisterJob',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'newVault',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'vaultAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount0Desired',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount1Desired',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount0Min',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount1Min',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'vaultAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount0Desired',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount1Desired',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount0Min',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount1Min',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'poolId',
        type: 'uint256',
      },
    ],
    name: 'depositAndStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_strategyRegistry',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_vaultRegistry',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_gasVault',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_stakingRewards',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_nodeConfig',
        type: 'string',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nodeConfig',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
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
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_nodeConfig',
        type: 'string',
      },
    ],
    name: 'setNodeConfig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
    ],
    name: 'strategiesByCreator',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'execBundle',
            type: 'string',
          },
          {
            internalType: 'uint128',
            name: 'maxGasCost',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'maxGasPerAction',
            type: 'uint128',
          },
        ],
        internalType: 'struct IStrategyRegistry.RegisteredStrategy[]',
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
    ],
    name: 'vaultBalancesByAddressWithFees',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'amountToken0',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amountToken1',
            type: 'uint256',
          },
        ],
        internalType: 'struct IMultiPositionManager.VaultBalance',
        name: 'balances',
        type: 'tuple',
      },
    ],
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
    name: 'vaultDetailsByAddress',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'vaultType',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'token0',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'token1',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'decimals',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'token0Name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'token1Name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'token0Symbol',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'token1Symbol',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'token0Decimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'token1Decimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'feeTier',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalLPTokensIssued',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'token0Balance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'token1Balance',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'vaultCreator',
            type: 'address',
          },
        ],
        internalType: 'struct IMultiPositionManager.VaultDetails',
        name: 'details',
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
        name: 'strategyId',
        type: 'uint256',
      },
    ],
    name: 'vaultsByStrategy',
    outputs: [
      {
        components: [
          {
            internalType: 'enum IVaultRegistry.VaultState',
            name: 'state',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'vaultID',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'payloadIpfs',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'vaultAddress',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'beaconName',
            type: 'string',
          },
        ],
        internalType: 'struct IVaultRegistry.VaultData[]',
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
        name: 'initialLogic',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'initialAdmin',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'constructor',
  },
] as const
