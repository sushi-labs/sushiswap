import { Address, encodeFunctionData, Hex } from 'viem'

declare const abiShard: [
  {
    readonly inputs: readonly [
      {
        readonly internalType: 'address'
        readonly name: 'token'
        readonly type: 'address'
      },
      {
        readonly internalType: 'uint256'
        readonly name: 'value'
        readonly type: 'uint256'
      },
      {
        readonly internalType: 'uint256'
        readonly name: 'deadline'
        readonly type: 'uint256'
      },
      {
        readonly internalType: 'uint8'
        readonly name: 'v'
        readonly type: 'uint8'
      },
      {
        readonly internalType: 'bytes32'
        readonly name: 'r'
        readonly type: 'bytes32'
      },
      {
        readonly internalType: 'bytes32'
        readonly name: 's'
        readonly type: 'bytes32'
      }
    ]
    readonly name: 'selfPermit'
    readonly outputs: readonly []
    readonly stateMutability: 'payable'
    readonly type: 'function'
  }
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
