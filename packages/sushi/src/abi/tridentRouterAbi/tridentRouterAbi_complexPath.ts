export const tridentRouterAbi_complexPath = [
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: 'address', name: 'tokenIn', type: 'address' },
              { internalType: 'address', name: 'pool', type: 'address' },
              { internalType: 'bool', name: 'native', type: 'bool' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              { internalType: 'bytes', name: 'data', type: 'bytes' },
            ],
            internalType: 'struct ITridentRouter.InitialPath[]',
            name: 'initialPath',
            type: 'tuple[]',
          },
          {
            components: [
              { internalType: 'address', name: 'tokenIn', type: 'address' },
              { internalType: 'address', name: 'pool', type: 'address' },
              {
                internalType: 'uint64',
                name: 'balancePercentage',
                type: 'uint64',
              },
              { internalType: 'bytes', name: 'data', type: 'bytes' },
            ],
            internalType: 'struct ITridentRouter.PercentagePath[]',
            name: 'percentagePath',
            type: 'tuple[]',
          },
          {
            components: [
              { internalType: 'address', name: 'token', type: 'address' },
              { internalType: 'address', name: 'to', type: 'address' },
              { internalType: 'bool', name: 'unwrapBento', type: 'bool' },
              { internalType: 'uint256', name: 'minAmount', type: 'uint256' },
            ],
            internalType: 'struct ITridentRouter.Output[]',
            name: 'output',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct ITridentRouter.ComplexPathParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'complexPath',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const
