export const sushiXSwapAbi_cook = [
  {
    inputs: [
      { internalType: 'uint8[]', name: 'actions', type: 'uint8[]' },
      { internalType: 'uint256[]', name: 'values', type: 'uint256[]' },
      { internalType: 'bytes[]', name: 'datas', type: 'bytes[]' },
    ],
    name: 'cook',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
