import { Amount, Share, Type } from 'sushi/currency'
import { Address, encodeFunctionData, Hex, zeroAddress } from 'viem'

const abiShard = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint64',
        name: 'startTime',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'endTime',
        type: 'uint64',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'fromBentoBox',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'minShare',
        type: 'uint256',
      },
    ],
    name: 'createStream',
    outputs: [
      {
        internalType: 'uint256',
        name: 'streamId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'depositedShares',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

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
}: StreamCreationAction): Hex => {
  return encodeFunctionData({
    abi: abiShard,
    functionName: 'createStream',
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
