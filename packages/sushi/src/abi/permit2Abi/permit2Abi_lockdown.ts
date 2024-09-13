export const permit2Abi_lockdown = [
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'address', name: 'spender', type: 'address' },
        ],
        internalType: 'struct IAllowanceTransfer.TokenSpenderPair[]',
        name: 'approvals',
        type: 'tuple[]',
      },
    ],
    name: 'lockdown',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
