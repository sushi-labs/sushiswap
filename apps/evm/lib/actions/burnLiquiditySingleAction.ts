import { Address, encodeAbiParameters, encodeFunctionData, parseAbiParameters } from 'viem'

declare const abiShard: [
  {
    readonly inputs: readonly [
      {
        readonly internalType: 'address'
        readonly name: 'pool'
        readonly type: 'address'
      },
      {
        readonly internalType: 'uint256'
        readonly name: 'liquidity'
        readonly type: 'uint256'
      },
      {
        readonly internalType: 'bytes'
        readonly name: 'data'
        readonly type: 'bytes'
      },
      {
        readonly internalType: 'uint256'
        readonly name: 'minWithdrawal'
        readonly type: 'uint256'
      }
    ]
    readonly name: 'burnLiquiditySingle'
    readonly outputs: readonly []
    readonly stateMutability: 'payable'
    readonly type: 'function'
  }
]

interface BurnLiquiditySingleAction {
  token: Address
  address: Address
  amount: bigint
  recipient: Address
  receiveToWallet: boolean
  minWithdrawal: bigint
}

export const burnLiquiditySingleAction = ({
  token,
  address,
  amount,
  recipient,
  receiveToWallet,
  minWithdrawal,
}: BurnLiquiditySingleAction) => {
  return encodeFunctionData({
    abi: abiShard,
    functionName: 'burnLiquiditySingle',
    args: [
      address,
      amount,
      encodeAbiParameters(parseAbiParameters('address, address, bool'), [token, recipient, receiveToWallet]),
      minWithdrawal,
    ],
  })
}
