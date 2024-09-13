export const bentoBoxV1Abi_flashLoan = [
  {
    inputs: [
      {
        internalType: 'contract IFlashBorrower',
        name: 'borrower',
        type: 'address',
      },
      { internalType: 'address', name: 'receiver', type: 'address' },
      { internalType: 'contract IERC20', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'flashLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
