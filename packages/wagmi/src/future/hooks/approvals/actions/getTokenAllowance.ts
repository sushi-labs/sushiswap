import { Address, erc20ABI } from 'wagmi'
import { readContract } from '@wagmi/core'
import { Amount, Token } from 'sushi/currency'
import { ChainId } from 'sushi/chain'

interface GetTokenAllowance {
  chainId: ChainId
  token: Token
  owner: Address
  spender: Address
}

export const getTokenAllowance = async ({
  chainId,
  token,
  owner,
  spender,
}: GetTokenAllowance) => {
  const data = await readContract({
    chainId,
    address: token.address as Address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [owner, spender],
  })

  return Amount.fromRawAmount(token, data.toString())
}
