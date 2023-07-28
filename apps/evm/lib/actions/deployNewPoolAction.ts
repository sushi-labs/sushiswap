import { Fee } from '@sushiswap/amm'
import { Type } from '@sushiswap/currency'
import { Address, encodeAbiParameters, encodeFunctionData, Hex, parseAbiParameters } from 'viem'

declare const abiShard: [
  {
    readonly inputs: readonly [
      {
        readonly internalType: 'address'
        readonly name: 'factory'
        readonly type: 'address'
      },
      {
        readonly internalType: 'bytes'
        readonly name: 'deployData'
        readonly type: 'bytes'
      }
    ]
    readonly name: 'deployPool'
    readonly outputs: readonly [
      {
        readonly internalType: 'address'
        readonly name: ''
        readonly type: 'address'
      }
    ]
    readonly stateMutability: 'payable'
    readonly type: 'function'
  }
]

export interface DeployNewPoolAction {
  assets: [Type, Type]
  factory: Address
  feeTier: Fee
  twap: boolean
}

export const deployNewPoolAction = ({ assets, factory, feeTier, twap }: DeployNewPoolAction): Hex => {
  const [tokenA, tokenB] = assets[0].wrapped.sortsBefore(assets[1].wrapped)
    ? [assets[0], assets[1]]
    : [assets[1], assets[0]]

  const deployData = encodeAbiParameters(parseAbiParameters('address, address, uint8, bool'), [
    tokenA.wrapped.address as Address,
    tokenB.wrapped.address as Address,
    feeTier,
    twap,
  ])

  return encodeFunctionData({
    abi: abiShard,
    functionName: 'deployPool',
    args: [factory, deployData],
  })
}
