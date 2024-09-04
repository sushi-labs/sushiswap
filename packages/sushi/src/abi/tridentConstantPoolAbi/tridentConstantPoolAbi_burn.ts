export const tridentConstantPoolAbi_burn = [
  {
    inputs: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
    name: 'burn',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        internalType: 'struct IPool.TokenAmount[]',
        name: 'withdrawnAmounts',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
