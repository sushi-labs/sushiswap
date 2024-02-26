import { publicWagmiConfig } from '@sushiswap/wagmi-config'
import { createConfig, readContract } from '@wagmi/core'
import { ChainId } from 'sushi/chain'
import { Amount, Token } from 'sushi/currency'
import { Address, erc20Abi } from 'viem'

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
  const config = createConfig(publicWagmiConfig)

  const data = await readContract(config, {
    chainId,
    address: token.address as Address,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [owner, spender],
  })

  return Amount.fromRawAmount(token, data.toString())
}
