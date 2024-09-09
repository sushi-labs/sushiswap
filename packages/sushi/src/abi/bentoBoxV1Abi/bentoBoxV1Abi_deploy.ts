export const bentoBoxV1Abi_deploy = [
  {
    inputs: [
      { internalType: 'address', name: 'masterContract', type: 'address' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
      { internalType: 'bool', name: 'useCreate2', type: 'bool' },
    ],
    name: 'deploy',
    outputs: [
      { internalType: 'address', name: 'cloneAddress', type: 'address' },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
