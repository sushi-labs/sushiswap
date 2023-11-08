import { Address, encodeFunctionData } from 'viem'

const abiShard = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'fromBento',
        type: 'bool',
      },
    ],
    name: 'sweep',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

interface SweepAction {
  token: Address
  recipient: Address
  fromBento: boolean
}

/**
 * Recover mistakenly sent ERC-20 tokens
 * @param token address of token
 * @param recipient address to sent funds to
 */
export const sweepAction = ({
  token,
  recipient,
  fromBento = false,
}: SweepAction) => {
  return encodeFunctionData({
    abi: abiShard,
    functionName: 'sweep',
    args: [token, recipient, fromBento],
  })
}
