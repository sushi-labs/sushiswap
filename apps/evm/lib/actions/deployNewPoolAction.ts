import { Fee } from '@sushiswap/amm'
import { Type } from '@sushiswap/currency'
import { Address, encodeAbiParameters, encodeFunctionData, Hex, parseAbiParameters } from 'viem'

const abiShard = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'factory',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'deployData',
        type: 'bytes',
      },
    ],
    name: 'deployPool',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

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
