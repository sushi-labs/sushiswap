import { fetchMultichain } from '@sushiswap/graph-client-new/multichain'
import { getSushiV2Tokens } from '@sushiswap/graph-client-new/sushi-v2'
import { ChainId } from 'sushi/chain'
import { SushiSwapV2ChainId } from 'sushi/config'
import { SUSHI_DEFAULT_TOKEN_LIST } from 'sushi/token-list'

export type Token = Awaited<ReturnType<typeof getTokens>>[0]

// price might be screwed because of the combination, source won't make sense either
export async function getTokens({
  chainIds,
  filter,
}: { chainIds: SushiSwapV2ChainId[]; filter?: string }) {
  const defaultTokenList = await getDefaultTokenList()

  const { data } = await fetchMultichain({
    chainIds,
    fetch: getSushiV2Tokens,
    variables: {
      orderBy: 'tradeVolumeUSD',
      where: { symbol_contains_nocase: filter },
    },
  })

  const tokens = data.map((token) => ({
    ...token,
    listEntry:
      defaultTokenList.find(
        (entry) =>
          entry.address.toLowerCase() ===
            token.id.toLowerCase().split(':')[1] &&
          entry.chainId === token.chainId,
      ) || null,
  }))

  const tokensCombined = new Map<string, (typeof tokens)[0]>()
  tokens.forEach((token) => {
    const tokenCombined = tokensCombined.get(token.id)

    if (tokenCombined) {
      tokensCombined.set(token.id, {
        ...token,
        volumeUSD: String(
          Number(token.volumeUSD) + Number(tokenCombined.volumeUSD),
        ),
        totalLiquidity: String(
          Number(token.totalLiquidity) + Number(tokenCombined.totalLiquidity),
        ),
      })
    } else {
      tokensCombined.set(token.id, token)
    }
  })

  return Array.from(tokensCombined.values())
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

export async function getTokenLogos(): Promise<TokenLogo[]> {
  const allRepoFiles = await fetch(
    'https://api.github.com/repos/sushiswap/list/git/trees/master?recursive=1',
  ).then(
    (data) =>
      data.json() as Promise<{
        tree: { path: string; type: 'tree' | 'blob'; url: string }[]
      }>,
  )

  const images = allRepoFiles.tree
    .filter((entry) => entry.path.startsWith('logos/token-logos/token/'))
    .map((entry) => entry.path.replace('logos/token-logos/token/', ''))
    .map((name) => ({
      name: name,
      url: `https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/token/${name}`,
    }))

  return images
}
