export const steerVaultFeesAbi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'feeIdentifier',
        type: 'string',
      },
    ],
    name: 'accruedFees0',
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
        internalType: 'string',
        name: 'feeIdentifier',
        type: 'string',
      },
    ],
    name: 'accruedFees1',
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
] as const
