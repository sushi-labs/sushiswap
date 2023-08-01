import { Share, Type } from '@sushiswap/currency'
import { Address, encodeFunctionData, zeroAddress } from 'viem'

declare const abiShard: [
  {
    readonly inputs: readonly [
      {
        readonly components: [
          {
            readonly internalType: 'contract IERC20'
            readonly name: 'token'
            readonly type: 'address'
          },
          {
            readonly internalType: 'address'
            readonly name: 'recipient'
            readonly type: 'address'
          },
          {
            readonly internalType: 'uint32'
            readonly name: 'start'
            readonly type: 'uint32'
          },
          {
            readonly internalType: 'uint32'
            readonly name: 'cliffDuration'
            readonly type: 'uint32'
          },
          {
            readonly internalType: 'uint32'
            readonly name: 'stepDuration'
            readonly type: 'uint32'
          },
          {
            readonly internalType: 'uint32'
            readonly name: 'steps'
            readonly type: 'uint32'
          },
          {
            readonly internalType: 'uint128'
            readonly name: 'stepPercentage'
            readonly type: 'uint128'
          },
          {
            readonly internalType: 'uint128'
            readonly name: 'amount'
            readonly type: 'uint128'
          },
          {
            readonly internalType: 'bool'
            readonly name: 'fromBentoBox'
            readonly type: 'bool'
          }
        ]
        readonly internalType: 'struct IFuroVesting.VestParams'
        readonly name: 'vestParams'
        readonly type: 'tuple'
      },
      {
        readonly internalType: 'uint256'
        readonly name: 'minShare'
        readonly type: 'uint256'
      }
    ]
    readonly name: 'createVesting'
    readonly outputs: readonly [
      {
        readonly internalType: 'uint256'
        readonly name: 'depositedShares'
        readonly type: 'uint256'
      },
      {
        readonly internalType: 'uint256'
        readonly name: 'vestId'
        readonly type: 'uint256'
      },
      {
        readonly internalType: 'uint128'
        readonly name: 'stepShares'
        readonly type: 'uint128'
      },
      {
        readonly internalType: 'uint128'
        readonly name: 'cliffShares'
        readonly type: 'uint128'
      }
    ]
    readonly stateMutability: 'payable'
    readonly type: 'function'
  }
]

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
}: VestingCreationAction): string => {
  return encodeFunctionData({
    abi: abiShard,
    args: [
      {
        token: currency.isNative ? zeroAddress : (currency.wrapped.address as Address),
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
