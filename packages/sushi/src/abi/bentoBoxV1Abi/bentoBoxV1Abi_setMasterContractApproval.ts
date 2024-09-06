export const bentoBoxV1Abi_setMasterContractApproval = [
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'address', name: 'masterContract', type: 'address' },
      { internalType: 'bool', name: 'approved', type: 'bool' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'setMasterContractApproval',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
