import { Amount, Share, Type } from '@sushiswap/currency'
import { Address, encodeFunctionData, zeroAddress } from 'viem'

declare const abiShard: [
  {
    readonly inputs: readonly [
      {
        readonly internalType: 'address'
        readonly name: 'recipient'
        readonly type: 'address'
      },
      {
        readonly internalType: 'address'
        readonly name: 'token'
        readonly type: 'address'
      },
      {
        readonly internalType: 'uint64'
        readonly name: 'startTime'
        readonly type: 'uint64'
      },
      {
        readonly internalType: 'uint64'
        readonly name: 'endTime'
        readonly type: 'uint64'
      },
      {
        readonly internalType: 'uint256'
        readonly name: 'amount'
        readonly type: 'uint256'
      },
      {
        readonly internalType: 'bool'
        readonly name: 'fromBentoBox'
        readonly type: 'bool'
      },
      {
        readonly internalType: 'uint256'
        readonly name: 'minShare'
        readonly type: 'uint256'
      }
    ]
    readonly name: 'createStream'
    readonly outputs: readonly [
      {
        readonly internalType: 'uint256'
        readonly name: 'streamId'
        readonly type: 'uint256'
      },
      {
        readonly internalType: 'uint256'
        readonly name: 'depositedShares'
        readonly type: 'uint256'
      }
    ]
    readonly stateMutability: 'payable'
    readonly type: 'function'
  }
]

export interface StreamCreationAction {
  recipient: Address
  currency: Type
  startDate: Date
  endDate: Date
  amount: Amount<Type>
  fromBentobox: boolean
  minShare: Share<Type>
}

export const streamCreationAction = ({
  recipient,
  currency,
  startDate,
  endDate,
  amount,
  fromBentobox,
  minShare,
}: StreamCreationAction): string => {
  return encodeFunctionData({
    abi: abiShard,
    args: [
      recipient,
      currency.isNative ? zeroAddress : (currency.wrapped.address as Address),
      BigInt(Math.floor(startDate.getTime() / 1000)),
      BigInt(Math.floor(endDate.getTime() / 1000)),
      amount.quotient,
      fromBentobox,
      minShare.quotient,
    ],
  })
}
