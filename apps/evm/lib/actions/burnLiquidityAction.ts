import { Address, encodeAbiParameters, encodeFunctionData, parseAbiParameters } from 'viem'

export type LiquidityOutput = {
  token: Address
  amount: bigint
}

const abiShard = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'liquidity',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        internalType: 'struct IPool.TokenAmount[]',
        name: 'minWithdrawals',
        type: 'tuple[]',
      },
    ],
    name: 'burnLiquidity',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

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
    functionName: 'burnLiquidity',
    args: [
      address,
      amount,
      encodeAbiParameters(parseAbiParameters('address, bool'), [recipient, receiveToWallet]),
      liquidityOutput,
    ],
  })
}
