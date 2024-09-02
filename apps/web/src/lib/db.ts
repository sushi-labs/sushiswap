import { createClient } from '@sushiswap/database'
import { createConfig } from '@wagmi/core'
import { getToken as getTokenFromContract } from '@wagmi/core/actions'
import { ChainId } from 'sushi/chain'
import { Address } from 'viem'
import { publicWagmiConfig } from './wagmi/config/public'
// import * as defaultTokenList from '@sushiswap/default-token-list' assert { type: 'json' }

const config = createConfig(publicWagmiConfig)

export async function getToken(chainId: number, address: string) {
  // TODO: example to include default list token
  // const tokenFromList = defaultTokenList.tokens.find((token) => token.chainId === chainId && token.address === address)
  // if (tokenFromList) {
  //   return {
  //     id: `${chainId}:${tokenFromList.address}`,
  //     address: tokenFromList.address,
  //     name: tokenFromList.name,
  //     symbol: tokenFromList.symbol,
  //     decimals: tokenFromList.decimals,
  //   }
  // }

  const client = await createClient()
  try {
    const token = await client.token.findFirstOrThrow({
      select: {
        id: true,
        address: true,
        name: true,
        symbol: true,
        decimals: true,
        status: true,
      },
      where: {
        chainId,
        address,
      },
    })
    await client.$disconnect()
    return token
  } catch {
    await client.$disconnect()
    const tokenFromContract = await getTokenFromContract(config, {
      chainId: chainId as ChainId,
      address: address as Address,
    }).catch(() => {
      return undefined
    })
    if (tokenFromContract) {
      return {
        id: `${chainId}:${tokenFromContract.address}`,
        address: tokenFromContract.address,
        name: tokenFromContract.name,
        symbol: tokenFromContract.symbol,
        decimals: tokenFromContract.decimals,
      }
    } else {
      throw new Error('Token not found')
    }
  }
}
