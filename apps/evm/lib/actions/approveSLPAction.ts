import { Address, encodeFunctionData, Hex } from 'viem'

const abiShard = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'selfPermit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
]

enum PermitType {
  AMOUNT = 1,
  ALLOWED = 2,
}

interface BaseSignatureData {
  v: number
  r: Hex
  s: Hex
  deadline: bigint
  nonce: number
  owner: string
  spender: string
  chainId: number
  tokenAddress: Address
  permitType: PermitType
}

export interface StandardSignatureData extends BaseSignatureData {
  amount: bigint
}

export interface ApproveSLPAction {
  signatureData?: StandardSignatureData
}

/**
 *
 * @param signatureData SLP approval signature data
 */
export const approveSLPAction = ({ signatureData }: ApproveSLPAction) => {
  if (!signatureData) return undefined
  const { tokenAddress, amount, deadline, v, r, s } = signatureData

  return encodeFunctionData({
    abi: abiShard,
    functionName: 'selfPermit',
    args: [tokenAddress, amount, deadline, v, r, s],
  })
}
