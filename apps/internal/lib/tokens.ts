import { createAppAuth } from '@octokit/auth-app'
import { ChainId } from '@sushiswap/chain'
import { getBuiltGraphSDK } from '@sushiswap/graph-client/.graphclient'
import { SUSHISWAP_ENABLED_NETWORKS, TRIDENT_ENABLED_NETWORKS } from '@sushiswap/graph-config'
import { SUSHI_DEFAULT_TOKEN_LIST } from '@sushiswap/redux-token-lists'
import { Octokit } from 'octokit'

export type Token = Awaited<ReturnType<typeof getTokens>>[0]

const chainIds = [...TRIDENT_ENABLED_NETWORKS, ...SUSHISWAP_ENABLED_NETWORKS]

export async function getTokens({ filter }: { filter?: string } = {}) {
  const sdk = getBuiltGraphSDK()

  const defaultTokenList = await getDefaultTokenList()

  return sdk
    .CrossChainTokens({ chainIds, orderBy: 'liquidityUSD', where: { name_contains: filter } })
    .then(({ crossChainTokens: tokens }) =>
      tokens.map((token) => ({
        ...token,
        listEntry:
          defaultTokenList.find(
            (entry) =>
              entry.address.toLowerCase() === token.id.toLowerCase().split(':')[1] && entry.chainId === token.chainId
          ) || null,
      }))
    )
}

export interface TokenListEntry {
  address: string
  name: string
  symbol: string
  decimals: number
  chainId: ChainId
  logoURI: string
}

export async function getDefaultTokenList(): Promise<TokenListEntry[]> {
  return fetch(SUSHI_DEFAULT_TOKEN_LIST)
    .then((data) => data.json())
    .then((data) => data.tokens)
}

export interface TokenLogo {
  name: string
  url: string
}

// will be called through api to keep the key secret
export async function getTokenLogos(octokitKey: string): Promise<TokenLogo[]> {
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: 169875,
      privateKey: octokitKey?.replace(/\\n/g, '\n'),
      installationId: 23112528,
    },
  })

  return octokit
    .request('GET /repos/sushiswap/list/contents/logos/token-logos/token')
    .then(({ data }) => data.map((entry) => ({ name: entry.name.split('.jpg')[0], url: entry.url })))
}
