export const permit2Abi_permit = [
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      {
        components: [
          {
            components: [
              { internalType: 'address', name: 'token', type: 'address' },
              { internalType: 'uint160', name: 'amount', type: 'uint160' },
              { internalType: 'uint48', name: 'expiration', type: 'uint48' },
              { internalType: 'uint48', name: 'nonce', type: 'uint48' },
            ],
            internalType: 'struct IAllowanceTransfer.PermitDetails',
            name: 'details',
            type: 'tuple',
          },
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'sigDeadline', type: 'uint256' },
        ],
        internalType: 'struct IAllowanceTransfer.PermitSingle',
        name: 'permitSingle',
        type: 'tuple',
      },
      { internalType: 'bytes', name: 'signature', type: 'bytes' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
