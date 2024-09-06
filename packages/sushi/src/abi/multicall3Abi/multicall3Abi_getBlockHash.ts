export const multicall3Abi_getBlockHash = [
  {
    inputs: [{ internalType: 'uint256', name: 'blockNumber', type: 'uint256' }],
    name: 'getBlockHash',
    outputs: [{ internalType: 'bytes32', name: 'blockHash', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
