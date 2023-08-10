import { Address, encodeAbiParameters, encodeFunctionData, parseAbiParameters } from 'viem'

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
        internalType: 'uint256',
        name: 'minWithdrawal',
        type: 'uint256',
      },
    ],
    name: 'burnLiquiditySingle',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

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
