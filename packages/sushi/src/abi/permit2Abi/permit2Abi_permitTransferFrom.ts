export const permit2Abi_permitTransferFrom = [
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: 'address', name: 'token', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            internalType: 'struct ISignatureTransfer.TokenPermissions[]',
            name: 'permitted',
            type: 'tuple[]',
          },
          { internalType: 'uint256', name: 'nonce', type: 'uint256' },
          { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        ],
        internalType: 'struct ISignatureTransfer.PermitBatchTransferFrom',
        name: 'permit',
        type: 'tuple',
      },
      {
        components: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'requestedAmount', type: 'uint256' },
        ],
        internalType: 'struct ISignatureTransfer.SignatureTransferDetails[]',
        name: 'transferDetails',
        type: 'tuple[]',
      },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'bytes', name: 'signature', type: 'bytes' },
    ],
    name: 'permitTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
