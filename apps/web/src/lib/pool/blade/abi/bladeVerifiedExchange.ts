export const bladeVerifiedExchangeAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'theSigner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'theWrapper',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: 'tokens',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: '_oracles',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'minTimeTolerances',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: 'initialOwner',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'DepositLocked',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DigestAlreadyUsed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ECDSAInvalidSignature',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'length',
        type: 'uint256',
      },
    ],
    name: 'ECDSAInvalidSignatureLength',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'ECDSAInvalidSignatureS',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'allowance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'needed',
        type: 'uint256',
      },
    ],
    name: 'ERC20InsufficientAllowance',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'needed',
        type: 'uint256',
      },
    ],
    name: 'ERC20InsufficientBalance',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'approver',
        type: 'address',
      },
    ],
    name: 'ERC20InvalidApprover',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'ERC20InvalidReceiver',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'ERC20InvalidSender',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'ERC20InvalidSpender',
    type: 'error',
  },
  {
    inputs: [],
    name: 'EthTransferFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ExistingVestingDeposit',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ExpiredMessage',
    type: 'error',
  },
  {
    inputs: [],
    name: 'GracePeriodNotOver',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InsufficientInput',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidFeeSplit',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidLPTokenValue',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidLockTime',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidOracle',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidSequencerFeed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvariantCheckFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MarketTradeHalted',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MismatchedArrayLengths',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OracleNotSet',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OracleStalePrice',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OracleSwapDeviation',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OracleValueDeviation',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'x',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'y',
        type: 'uint256',
      },
    ],
    name: 'PRBMath_MulDiv18_Overflow',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'x',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'y',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'denominator',
        type: 'uint256',
      },
    ],
    name: 'PRBMath_MulDiv_Overflow',
    type: 'error',
  },
  {
    inputs: [],
    name: 'PRBMath_SD59x18_Div_InputTooSmall',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'SD59x18',
        name: 'x',
        type: 'int256',
      },
      {
        internalType: 'SD59x18',
        name: 'y',
        type: 'int256',
      },
    ],
    name: 'PRBMath_SD59x18_Div_Overflow',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'SD59x18',
        name: 'x',
        type: 'int256',
      },
    ],
    name: 'PRBMath_SD59x18_Exp2_InputTooBig',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'SD59x18',
        name: 'x',
        type: 'int256',
      },
    ],
    name: 'PRBMath_SD59x18_Log_InputTooSmall',
    type: 'error',
  },
  {
    inputs: [],
    name: 'PRBMath_SD59x18_Mul_InputTooSmall',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'SD59x18',
        name: 'x',
        type: 'int256',
      },
      {
        internalType: 'SD59x18',
        name: 'y',
        type: 'int256',
      },
    ],
    name: 'PRBMath_SD59x18_Mul_Overflow',
    type: 'error',
  },
  {
    inputs: [],
    name: 'PoolStateDeviation',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReentrancyGuardReentrantCall',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'int256',
        name: 'value',
        type: 'int256',
      },
    ],
    name: 'SafeCastOverflowedIntToUint',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'SafeCastOverflowedUintToInt',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'SafeERC20FailedOperation',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SequencerDown',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SignatureValidation',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TokenDecimalsNotSupported',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TokenNotInPool',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UnauthorizedCaller',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'withdrawer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'poolTokens',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'assetAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'assetAmount',
        type: 'uint256',
      },
    ],
    name: 'AssetWithdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'depositor',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'poolTokens',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'lockTime',
        type: 'uint256',
      },
    ],
    name: 'Deposited',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'entitledFeesInDollars',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'averagePoolBalanceInDollars',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokensTransferred',
        type: 'uint256',
      },
    ],
    name: 'FeesTaken',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'MarketHalted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
    ],
    name: 'MarketResumed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'oracleAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'minTimeTolerance',
        type: 'uint256',
      },
    ],
    name: 'OracleAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'OracleRemoved',
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
        name: 'sequencerUptimeFeed',
        type: 'address',
      },
    ],
    name: 'SequencerUptimeFeedAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'inAsset',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'outAsset',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'inAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'outAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'auxiliaryData',
        type: 'bytes',
      },
    ],
    name: 'Swapped',
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
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newAddress',
        type: 'address',
      },
    ],
    name: 'TriageAddressChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'withdrawer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'poolTokens',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fractionOfPool',
        type: 'uint256',
      },
    ],
    name: 'Withdrawn',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DESIGNATED_SIGNER',
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
    name: 'WRAPPER_CONTRACT',
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
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'oracleAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'minTimeTolerance',
        type: 'uint256',
      },
    ],
    name: 'addOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'allTokensBalance',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
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
    name: 'allTokensStateBalance',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
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
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
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
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
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
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'burnToWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'depositor',
        type: 'address',
      },
    ],
    name: 'canUnlockDeposit',
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
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'depositor',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: 'depositAmounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'lockTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'poolTokens',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'goodUntil',
        type: 'uint256',
      },
      {
        components: [
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
        internalType: 'struct Signature',
        name: 'theSignature',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'extraData',
        type: 'bytes',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'depositor',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'inputToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'inputAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lockTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'poolTokens',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'goodUntil',
        type: 'uint256',
      },
      {
        components: [
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
        internalType: 'struct Signature',
        name: 'theSignature',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'extraData',
        type: 'bytes',
      },
    ],
    name: 'depositSingleAsset',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'getLastBalance',
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
        name: 'token',
        type: 'address',
      },
    ],
    name: 'getOracleInfo',
    outputs: [
      {
        internalType: 'address',
        name: 'oracleAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'minTimeTolerance',
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
        name: 'token',
        type: 'address',
      },
    ],
    name: 'isToken',
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
  {
    inputs: [],
    name: 'isTradeHalted',
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
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'lastBalances',
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
    name: 'lastFeeWithdrawal',
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
    name: 'nTokens',
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
    name: 'name',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'packedInput',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'packedOutput',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'packedGoodUntil',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: 'auxData',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'vs',
        type: 'bytes32',
      },
    ],
    name: 'packedSwap',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'packedInput',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'packedConfig',
        type: 'uint256',
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
      {
        internalType: 'bytes',
        name: 'extraData',
        type: 'bytes',
      },
    ],
    name: 'packedTransmitAndDepositSingleAsset',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'packedInput',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'packedOutput',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'packedGoodUntil',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: 'auxData',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'vs',
        type: 'bytes32',
      },
    ],
    name: 'packedTransmitAndSwap',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'removeOracle',
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
    inputs: [],
    name: 'resumeTrade',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'outputToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'inputAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'outputAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'goodUntil',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'destinationAddress',
        type: 'address',
      },
      {
        components: [
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
        internalType: 'struct Signature',
        name: 'theSignature',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'auxiliaryData',
        type: 'bytes',
      },
    ],
    name: 'sellEthForToken',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'inputToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'inputAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'outputAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'goodUntil',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'destinationAddress',
        type: 'address',
      },
      {
        components: [
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
        internalType: 'struct Signature',
        name: 'theSignature',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'auxiliaryData',
        type: 'bytes',
      },
    ],
    name: 'sellTokenForEth',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'sequencerUptimeFeed',
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
        name: 'feedAddress',
        type: 'address',
      },
    ],
    name: 'setSequencerUptimeFeed',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newTriage',
        type: 'address',
      },
    ],
    name: 'setTriageRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stopTrade',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'inputToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'outputToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'inputAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'outputAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'goodUntil',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'destinationAddress',
        type: 'address',
      },
      {
        components: [
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
        internalType: 'struct Signature',
        name: 'theSignature',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'auxiliaryData',
        type: 'bytes',
      },
    ],
    name: 'swap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'entitledFeesInDollars',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'averagePoolBalanceInDollars',
        type: 'uint256',
      },
    ],
    name: 'takeFees',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'i',
        type: 'uint256',
      },
    ],
    name: 'tokenAt',
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
    name: 'totalSupply',
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
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
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
        internalType: 'uint256[]',
        name: 'depositAmounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256',
        name: 'lockTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'poolTokens',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'goodUntil',
        type: 'uint256',
      },
      {
        components: [
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
        internalType: 'struct Signature',
        name: 'theSignature',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'extraData',
        type: 'bytes',
      },
    ],
    name: 'transmitAndDeposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'inputToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'inputAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lockTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'poolTokens',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'goodUntil',
        type: 'uint256',
      },
      {
        components: [
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
        internalType: 'struct Signature',
        name: 'theSignature',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'extraData',
        type: 'bytes',
      },
    ],
    name: 'transmitAndDepositSingleAsset',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'inputToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'inputAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'outputAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'goodUntil',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'destinationAddress',
        type: 'address',
      },
      {
        components: [
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
        internalType: 'struct Signature',
        name: 'theSignature',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'auxiliaryData',
        type: 'bytes',
      },
    ],
    name: 'transmitAndSellTokenForEth',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'inputToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'outputToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'inputAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'outputAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'goodUntil',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'destinationAddress',
        type: 'address',
      },
      {
        components: [
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
        internalType: 'struct Signature',
        name: 'theSignature',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'auxiliaryData',
        type: 'bytes',
      },
    ],
    name: 'transmitAndSwap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'triageRole',
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
    name: 'unlockDeposit',
    outputs: [
      {
        internalType: 'uint256',
        name: 'poolTokens',
        type: 'uint256',
      },
    ],
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
    name: 'vestingDeposits',
    outputs: [
      {
        internalType: 'uint256',
        name: 'lockedUntil',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'poolTokenAmount',
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
        name: 'tokenHolder',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'poolTokenAmountToBurn',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'assetAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'assetAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'goodUntil',
        type: 'uint256',
      },
      {
        components: [
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
        internalType: 'struct Signature',
        name: 'theSignature',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'extraData',
        type: 'bytes',
      },
    ],
    name: 'withdrawSingleAsset',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const
