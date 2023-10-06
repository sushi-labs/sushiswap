import { Share, Type } from 'sushi/currency'
import { Address, encodeFunctionData, Hex, zeroAddress } from 'viem'

const abiShard = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'uint32',
            name: 'start',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'cliffDuration',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'stepDuration',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'steps',
            type: 'uint32',
          },
          {
            internalType: 'uint128',
            name: 'stepPercentage',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'amount',
            type: 'uint128',
          },
          {
            internalType: 'bool',
            name: 'fromBentoBox',
            type: 'bool',
          },
        ],
        internalType: 'struct IFuroVesting.VestParams',
        name: 'vestParams',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'minShare',
        type: 'uint256',
      },
    ],
    name: 'createVesting',
    outputs: [
      {
        internalType: 'uint256',
        name: 'depositedShares',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'vestId',
        type: 'uint256',
      },
      {
        internalType: 'uint128',
        name: 'stepShares',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'cliffShares',
        type: 'uint128',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

export interface VestingCreationAction {
  recipient: Address
  currency: Type
  startDate: Date
  cliffDuration: number
  stepDuration: number
  steps: number
  stepPercentage: bigint
  amount: bigint
  fromBentoBox: boolean
  minShare: Share<Type>
}

export const vestingCreationAction = ({
  recipient,
  currency,
  startDate,
  cliffDuration,
  stepDuration,
  steps,
  stepPercentage,
  amount,
  fromBentoBox,
  minShare,
}: VestingCreationAction): Hex => {
  return encodeFunctionData({
    abi: abiShard,
    functionName: 'createVesting',
    args: [
      {
        token: currency.isNative
          ? zeroAddress
          : (currency.wrapped.address as Address),
        recipient,
        start: Math.floor(startDate.getTime() / 1000),
        cliffDuration,
        stepDuration,
        steps,
        stepPercentage,
        amount,
        fromBentoBox,
      },
      minShare.quotient,
    ],
  })
}
