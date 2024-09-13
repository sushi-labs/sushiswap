export const bentoBoxV1Abi_batchFlashLoan = [
  {
    inputs: [
      {
        internalType: 'contract IBatchFlashBorrower',
        name: 'borrower',
        type: 'address',
      },
      { internalType: 'address[]', name: 'receivers', type: 'address[]' },
      { internalType: 'contract IERC20[]', name: 'tokens', type: 'address[]' },
      { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'batchFlashLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
