export const permit2Abi_permitWitnessTransferFrom = [
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
      { internalType: 'bytes32', name: 'witness', type: 'bytes32' },
      { internalType: 'string', name: 'witnessTypeString', type: 'string' },
      { internalType: 'bytes', name: 'signature', type: 'bytes' },
    ],
    name: 'permitWitnessTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
