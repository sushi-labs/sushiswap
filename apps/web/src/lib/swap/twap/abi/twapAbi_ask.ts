export const twapAbi_ask = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'exchange',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'srcToken',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'dstToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'srcAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'srcBidAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'dstMinAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint32',
            name: 'deadline',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'bidDelay',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'fillDelay',
            type: 'uint32',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        internalType: 'struct OrderLib.Ask',
        name: '_ask',
        type: 'tuple',
      },
    ],
    name: 'ask',
    outputs: [
      {
        internalType: 'uint64',
        name: 'id',
        type: 'uint64',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
