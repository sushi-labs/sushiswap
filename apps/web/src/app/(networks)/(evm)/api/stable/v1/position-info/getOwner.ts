import { publicClientConfig } from 'src/lib/wagmi/config/viem'
import {
  SUSHISWAP_V3_POSITION_MANAGER,
  type SushiSwapV3ChainId,
} from 'sushi/evm'
import { createClient } from 'viem'
import { readContract } from 'viem/actions'

const abiShard = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const getOwner = async ({
  tokenId,
  chainId,
}: {
  tokenId: bigint
  chainId: SushiSwapV3ChainId
}) => {
  const client = createClient(publicClientConfig[chainId])

  const result = await readContract(client, {
    abi: abiShard,
    address: SUSHISWAP_V3_POSITION_MANAGER[chainId],
    functionName: 'ownerOf',
    args: [tokenId],
  })

  return result
}
