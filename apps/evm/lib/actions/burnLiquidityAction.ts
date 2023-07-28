import { Address, encodeAbiParameters, encodeFunctionData, parseAbiParameters } from 'viem'

export type LiquidityOutput = {
  token: Address
  amount: bigint
}

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
        readonly components: readonly [
          {
            readonly internalType: 'address'
            readonly name: 'token'
            readonly type: 'address'
          },
          {
            readonly internalType: 'uint256'
            readonly name: 'amount'
            readonly type: 'uint256'
          }
        ]
        readonly internalType: 'struct IPool.TokenAmount[]'
        readonly name: 'minWithdrawals'
        readonly type: 'tuple[]'
      }
    ]
    readonly name: 'burnLiquidity'
    readonly outputs: readonly []
    readonly stateMutability: 'payable'
    readonly type: 'function'
  }
]

interface BurnLiquidityAction {
  address: Address
  amount: bigint
  recipient: Address
  receiveToWallet: boolean
  liquidityOutput: LiquidityOutput[]
}

/**
 * Burn liquidity tokens to get back `bento` tokens.
 * @param address address of liquidity token
 * @param amount amount of SLP to burn
 * @param recipient receiver of underlying SLP tokens
 * @param receiveToWallet true if underlying SLP tokens should be send to wallet instead of bentobox
 * @param liquidityOutput array with minimum output amounts for underlying tokens
 */
export const burnLiquidityAction = ({
  address,
  amount,
  recipient,
  receiveToWallet,
  liquidityOutput,
}: BurnLiquidityAction) => {
  return encodeFunctionData({
    abi: abiShard,
    args: [
      address,
      amount,
      encodeAbiParameters(parseAbiParameters('address, bool'), [recipient, receiveToWallet]),
      liquidityOutput,
    ],
  })
}
